// vue.config.js

module.exports = {
  // options...
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass') // This line must in sass option
      },
      scss: {
        implementation: require('sass') // This line must in sass option
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://new401.bafangka.com/api', // 'https://new401t.bafangka.com/api',
        changeOrigin: true,
        // http2: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },

  }
};
