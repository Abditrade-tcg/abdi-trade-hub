import Image from 'next/image';
import { useState } from 'react';

interface CardImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  game?: string;
}

export default function CardImage({ 
  src, 
  alt, 
  width = 300, 
  height = 400, 
  className = '',
  priority = false,
  game = ''
}: CardImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Domains that have CORS or optimization issues
  const problemDomains = ['ygoprodeck.com', 'apitcg.com', 'cdn.apitcg.com', 'world.digimoncard.com', 'en.onepiece-cardgame.com'];
  const shouldUnoptimize = problemDomains.some(domain => imageSrc?.includes(domain));

  const handleLoad = () => {
    setIsLoading(false);
    console.log(`🖼️ Image loaded successfully: ${alt} (${game})`);
  };

  const handleError = () => {
    console.warn(`❌ Image failed to load: ${alt} (${game}) - ${imageSrc}`);
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback strategies
    if (!hasError) {
      // First, try switching protocols if it's HTTPS
      if (imageSrc?.startsWith('https://')) {
        const httpFallback = imageSrc.replace('https://', 'http://');
        console.log(`🔄 Trying HTTP fallback for ${alt}: ${httpFallback}`);
        setImageSrc(httpFallback);
        setHasError(false);
        return;
      }
    }
  };

  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center rounded-lg`}>
        <div className="text-center p-4">
          <div className="text-gray-400 text-4xl mb-2">🃏</div>
          <div className="text-xs text-gray-500">
            {alt}
            <br />
            <span className="text-red-400">Image unavailable</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded-lg"
        >
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        unoptimized={shouldUnoptimize} // Skip optimization for problematic domains
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'contain',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}