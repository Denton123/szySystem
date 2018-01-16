// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');
const server = require('./server.js')
const proxyTableOptions = {
    target: `${server.protocol}://${server.origin}:${server.port}`,
    changeOrigin: true
}

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            // '/api': {
            //     target: 'http://192.168.220.70:8080/api/',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': ''
            //     }
            // }
            '/api/**': proxyTableOptions,
            '/user/**': proxyTableOptions,
            '/project/**': proxyTableOptions,
            '/task/**': proxyTableOptions,
            '/answer/**': proxyTableOptions,
            '/attendance/**': proxyTableOptions,
            '/role/**': proxyTableOptions,
            '/permission/**': proxyTableOptions,
            '/worklog/**': proxyTableOptions,
            '/summary/**': proxyTableOptions,
            '/check': proxyTableOptions,
            // 上传文件
            '/uploadFiles/**': proxyTableOptions,
            // 上传图片
            '/uploadImgs/**': proxyTableOptions,
            // websocket
            '/socket.io/**': proxyTableOptions,
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
};
