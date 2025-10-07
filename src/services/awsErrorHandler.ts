interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBase: number;
  jitter: boolean;
}

interface ErrorContext {
  service: string;
  operation: string;
  attempt: number;
  maxRetries: number;
  error: Error;
}

type ErrorHandler = (context: ErrorContext) => boolean; // Return true to retry

class AWSErrorHandler {
  private defaultConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    exponentialBase: 2,
    jitter: true,
  };

  private errorHandlers: Map<string, ErrorHandler> = new Map();

  constructor() {
    this.setupDefaultErrorHandlers();
  }

  /**
   * Setup default error handlers for common AWS services
   */
  private setupDefaultErrorHandlers(): void {
    // S3 error handler
    this.errorHandlers.set('S3', (context) => {
      const error = context.error;
      const message = error.message.toLowerCase();
      
      // Retry on throttling, timeouts, and server errors
      if (message.includes('throttling') || 
          message.includes('slowdown') ||
          message.includes('timeout') ||
          message.includes('503') ||
          message.includes('502') ||
          message.includes('500')) {
        console.warn(`🔄 S3 ${context.operation} failed (attempt ${context.attempt}/${context.maxRetries}): ${error.message}`);
        return true;
      }

      // Don't retry on client errors (4xx except 429)
      if (message.includes('404') || 
          message.includes('403') ||
          message.includes('401')) {
        console.error(`❌ S3 ${context.operation} client error: ${error.message}`);
        return false;
      }

      return false;
    });

    // Cognito error handler
    this.errorHandlers.set('Cognito', (context) => {
      const error = context.error;
      const message = error.message.toLowerCase();
      
      // Retry on service errors and throttling
      if (message.includes('throttling') ||
          message.includes('serviceunavailable') ||
          message.includes('internalerror') ||
          message.includes('timeout')) {
        console.warn(`🔄 Cognito ${context.operation} failed (attempt ${context.attempt}/${context.maxRetries}): ${error.message}`);
        return true;
      }

      // Don't retry on user errors
      if (message.includes('usernotfound') ||
          message.includes('incorrectpassword') ||
          message.includes('invalidparameter')) {
        console.error(`❌ Cognito ${context.operation} user error: ${error.message}`);
        return false;
      }

      return false;
    });

    // OpenSearch error handler
    this.errorHandlers.set('OpenSearch', (context) => {
      const error = context.error;
      const message = error.message.toLowerCase();
      
      // Retry on cluster busy, timeouts, and server errors
      if (message.includes('cluster_block_exception') ||
          message.includes('timeout') ||
          message.includes('503') ||
          message.includes('502') ||
          message.includes('500')) {
        console.warn(`🔄 OpenSearch ${context.operation} failed (attempt ${context.attempt}/${context.maxRetries}): ${error.message}`);
        return true;
      }

      return false;
    });

    // DynamoDB error handler
    this.errorHandlers.set('DynamoDB', (context) => {
      const error = context.error;
      const message = error.message.toLowerCase();
      
      // Retry on throttling and service errors
      if (message.includes('throttlingexception') ||
          message.includes('provisioned throughput exceeded') ||
          message.includes('serviceunavailable') ||
          message.includes('internalservererror')) {
        console.warn(`🔄 DynamoDB ${context.operation} failed (attempt ${context.attempt}/${context.maxRetries}): ${error.message}`);
        return true;
      }

      return false;
    });

    // Generic network error handler
    this.errorHandlers.set('Network', (context) => {
      const error = context.error;
      
      // Retry on network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn(`🔄 Network ${context.operation} failed (attempt ${context.attempt}/${context.maxRetries}): ${error.message}`);
        return true;
      }

      return false;
    });
  }

  /**
   * Execute operation with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    service: string,
    operationName: string,
    config?: Partial<RetryConfig>
  ): Promise<T> {
    const retryConfig = { ...this.defaultConfig, ...config };
    let lastError: Error;

    for (let attempt = 1; attempt <= retryConfig.maxRetries + 1; attempt++) {
      try {
        const result = await operation();
        
        if (attempt > 1) {
          console.log(`✅ ${service} ${operationName} succeeded on attempt ${attempt}`);
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt > retryConfig.maxRetries) {
          break; // No more retries
        }

        const context: ErrorContext = {
          service,
          operation: operationName,
          attempt,
          maxRetries: retryConfig.maxRetries,
          error: lastError,
        };

        const shouldRetry = this.shouldRetryError(context);
        
        if (!shouldRetry) {
          console.error(`❌ ${service} ${operationName} failed (non-retryable): ${lastError.message}`);
          throw lastError;
        }

        const delay = this.calculateDelay(attempt, retryConfig);
        console.warn(`⏳ ${service} ${operationName} retrying in ${delay}ms (attempt ${attempt + 1}/${retryConfig.maxRetries + 1})`);
        
        await this.delay(delay);
      }
    }

    console.error(`❌ ${service} ${operationName} failed after ${retryConfig.maxRetries + 1} attempts`);
    throw lastError!;
  }

  /**
   * Determine if error should be retried
   */
  private shouldRetryError(context: ErrorContext): boolean {
    const handler = this.errorHandlers.get(context.service) || this.errorHandlers.get('Network');
    
    if (handler) {
      return handler(context);
    }

    // Default behavior: retry on 5xx errors and network issues
    const message = context.error.message.toLowerCase();
    return message.includes('500') || 
           message.includes('502') || 
           message.includes('503') || 
           message.includes('timeout') ||
           (context.error instanceof TypeError && message.includes('fetch'));
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(attempt: number, config: RetryConfig): number {
    const exponentialDelay = Math.min(
      config.baseDelay * Math.pow(config.exponentialBase, attempt - 1),
      config.maxDelay
    );

    if (config.jitter) {
      // Add random jitter (±25%)
      const jitterRange = exponentialDelay * 0.25;
      const jitter = (Math.random() - 0.5) * 2 * jitterRange;
      return Math.max(0, exponentialDelay + jitter);
    }

    return exponentialDelay;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Register custom error handler
   */
  registerErrorHandler(service: string, handler: ErrorHandler): void {
    this.errorHandlers.set(service, handler);
  }

  /**
   * Circuit breaker pattern for repeated failures
   */
  private circuitBreakers: Map<string, {
    failures: number;
    lastFailureTime: number;
    state: 'closed' | 'open' | 'half-open';
  }> = new Map();

  async executeWithCircuitBreaker<T>(
    operation: () => Promise<T>,
    service: string,
    operationName: string,
    options?: {
      failureThreshold?: number;
      resetTimeoutMs?: number;
    }
  ): Promise<T> {
    const key = `${service}:${operationName}`;
    const failureThreshold = options?.failureThreshold || 5;
    const resetTimeoutMs = options?.resetTimeoutMs || 60000; // 1 minute
    
    let breaker = this.circuitBreakers.get(key);
    if (!breaker) {
      breaker = { failures: 0, lastFailureTime: 0, state: 'closed' };
      this.circuitBreakers.set(key, breaker);
    }

    // Check if circuit is open
    if (breaker.state === 'open') {
      const timeSinceLastFailure = Date.now() - breaker.lastFailureTime;
      if (timeSinceLastFailure < resetTimeoutMs) {
        throw new Error(`Circuit breaker open for ${service} ${operationName}`);
      } else {
        breaker.state = 'half-open';
      }
    }

    try {
      const result = await this.executeWithRetry(operation, service, operationName);
      
      // Success - reset circuit breaker
      if (breaker.state === 'half-open') {
        breaker.state = 'closed';
        breaker.failures = 0;
        console.log(`🔄 Circuit breaker reset for ${service} ${operationName}`);
      }
      
      return result;
    } catch (error) {
      breaker.failures++;
      breaker.lastFailureTime = Date.now();
      
      if (breaker.failures >= failureThreshold) {
        breaker.state = 'open';
        console.error(`🔴 Circuit breaker opened for ${service} ${operationName} after ${breaker.failures} failures`);
      }
      
      throw error;
    }
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus(): Array<{ service: string; state: string; failures: number }> {
    return Array.from(this.circuitBreakers.entries()).map(([key, breaker]) => ({
      service: key,
      state: breaker.state,
      failures: breaker.failures,
    }));
  }

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker(service: string, operationName: string): void {
    const key = `${service}:${operationName}`;
    const breaker = this.circuitBreakers.get(key);
    if (breaker) {
      breaker.state = 'closed';
      breaker.failures = 0;
      breaker.lastFailureTime = 0;
      console.log(`🔄 Manually reset circuit breaker for ${service} ${operationName}`);
    }
  }
}

export const awsErrorHandler = new AWSErrorHandler();

// Convenience wrapper functions
export const withRetry = <T>(
  operation: () => Promise<T>,
  service: string,
  operationName: string,
  config?: Partial<RetryConfig>
): Promise<T> => {
  return awsErrorHandler.executeWithRetry(operation, service, operationName, config);
};

export const withCircuitBreaker = <T>(
  operation: () => Promise<T>,
  service: string,
  operationName: string,
  options?: { failureThreshold?: number; resetTimeoutMs?: number }
): Promise<T> => {
  return awsErrorHandler.executeWithCircuitBreaker(operation, service, operationName, options);
};