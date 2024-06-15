
const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  output: 'export',
  images: {
    loader: 'akamai',
    path: '',
  },
  assetPrefix: './',
  reactStrictMode: true,
  basePath: isProd ? '/frontend-impch-zanartu' : '',
  distDir: '/dist',
};
