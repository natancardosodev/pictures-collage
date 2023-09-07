const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    stats: 'errors-only',
    plugins: [
        new HtmlReplaceWebpackPlugin([
            {
                pattern: '/public/',
                replacement: '/'
            }
        ]),
        new RemovePlugin({
            after: {
                root: './public',
                test: [
                    {
                        folder: './images',
                        method: (absoluteItemPath) => {
                            return new RegExp(/\.(js|map)$/, 'm').test(absoluteItemPath);
                        },
                        recursive: true,
                        trash: true
                    },
                    {
                        folder: './css',
                        method: (absoluteItemPath) => {
                            return new RegExp(/\.(js|map)$/, 'm').test(absoluteItemPath);
                        },
                        recursive: true,
                        trash: true
                    }
                ],
                log: false,
                logError: true
            }
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }]
                },
                canPrint: true
            }),
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                extractComments: false,
                terserOptions: {
                    parse: {
                        ecma: 2017
                    },
                    compress: {
                        ecma: 2017
                    },
                    warnings: false,
                    mangle: true,
                    module: false,
                    output: null,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                }
            })
        ]
    }
});
