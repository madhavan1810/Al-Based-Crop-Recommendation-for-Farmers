
const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@genkit-ai/googleai',
      'firebase-admin',
      'handlebars', 
      'dotprompt',
      '@opentelemetry/instrumentation',
      'require-in-the-middle'
    ],
  },
  allowedDevOrigins: [
      "https://6000-firebase-studio-1757467904870.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev"
  ]
};

module.exports = withNextIntl(nextConfig);
