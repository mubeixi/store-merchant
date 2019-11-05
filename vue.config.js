// vue.config.js

module.exports = {
  // options...
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://new401.bafangka.com/api',
        changeOrigin: true,
        // http2: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },

};
