
const withNextIntl = require('next-intl/plugin')('./src/i18n-request.ts');

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
    // This is required to support our AI-powered features.
    serverComponentsExternalPackages: [
      '@genkit-ai/ai',
      '@genkit-ai/core',
      '@genkit-ai/googleai',
      'genkit',
      'zod',
      '@opentelemetry/api',
      '@opentelemetry/exporter-trace-otlp-http',
      '@opentelemetry/instrumentation',
      '@opentelemetry/resources',
      '@opentelemetry/sdk-node',
      '@opentelemetry/sdk-trace-base',
      '@opentelemetry/sdk-trace-node',
      '@opentelemetry/semantic-conventions',
    ],
  },
};

module.exports = withNextIntl(nextConfig);
