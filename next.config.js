/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow warnings during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow type errors during production builds (for faster deployment)
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Fixes for module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  images: {
    remotePatterns: [
      // Your backend S3 bucket for card images
      {
        protocol: 'https',
        hostname: 'abditrade-images.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Legitimate card image sources
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ygoprodeck.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'en.onepiece-cardgame.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'limitlesstcg.nyc3.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig