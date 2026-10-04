import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
import { BASE_URL } from './AppConfig';

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'javascript/auto',
      use: []
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/saas/:path*',
        destination: `${BASE_URL}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);