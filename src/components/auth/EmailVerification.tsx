'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Mail } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onBackToSignUp: () => void;
}

export function EmailVerification({ email, onVerificationComplete, onBackToSignUp }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.confirmSignUp(email, code);
      setSuccess(true);
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      });
      setTimeout(() => {
        onVerificationComplete();
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError('');

    try {
      await authService.resendConfirmationCode(email);
      toast({
        title: "Code sent!",
        description: "A new verification code has been sent to your email.",
      });
      setError('Verification code sent! Please check your email.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code. Please try again.';
      setError(errorMessage);
      toast({
        title: "Failed to resend",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Email Verified!</h3>
          <p className="text-muted-foreground">
            Your email has been successfully verified. You're being redirected...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification code to{' '}
          <span className="font-semibold">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerification} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
          </div>
          
          {error && (
            <div className={`text-sm p-2 rounded border ${
              error.includes('sent') 
                ? 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800' 
                : 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800'
            }`}>
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading || code.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>
        
        <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
          <Button 
            variant="ghost" 
            onClick={handleResendCode}
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend verification code'}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onBackToSignUp}
          >
            ← Back to sign up
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          Check your spam folder if you don't see the email
        </p>
      </CardContent>
    </Card>
  );
}