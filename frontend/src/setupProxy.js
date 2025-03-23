// This file is only used in development
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://mepadv4.vercel.app',
      changeOrigin: true,
    })
  );
}; 