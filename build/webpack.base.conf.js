const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const config = require('../config');
const lessToJs = require('less-vars-to-js')
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './theme.less'), 'utf8'))

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        alias: {
            ASSET: resolve('src/assets'),
            COMMON: resolve('src/common'),
            COMPONENT: resolve('src/components'),
            ACTION: resolve('src/redux/actions'),
            REDUCER: resolve('src/redux/reducers'),
            STORE: resolve('src/redux/store'),
            ROUTE: resolve('src/routes'),
            UTIL: resolve('src/utils'),
            VIEW: resolve('src/views'),
            LAYOUT: resolve('src/layouts')
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(css)?$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: _ => [
                                require('autoprefixer')({ browsers: ['last 20 versions'] })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(less)?$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: _ => [
                                require('autoprefixer')({ browsers: ['last 20 versions'] })
                            ],
                            modifyVars: themeVariables
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.(styl)$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: _ => [require('autoprefixer')({ browsers: ['last 20 versions'] })]
                        }
                    },
                    'stylus-loader'
                ]
            }
        ]
    }
};
