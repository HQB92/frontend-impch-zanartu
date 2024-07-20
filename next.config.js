const withGraphql = require('next-plugin-graphql');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
    path: '/_next/image', // Valor corregido para .images.path
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'graphql-tag/loader',
        },
      ],
    });

    return config;
  },
  output: 'export',
  trailingSlash: true,
};