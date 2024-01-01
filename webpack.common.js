/*!
 * 2019 (c) Vox Tecnologia.
 * @author Natan Cardoso <natan@voxtecnologia.com.br>
 */

const path = require('path');
const webpack = require('webpack');
const entry = require('webpack-glob-entry');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const hashGit = require('git-rev-sync');
// const hash = hashGit.short();
const CopyPlugin = require('copy-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: entry(
        entry.basePath('assets'),
        './assets/**/*.{js,scss,json,png,jpg,gif,ico,pdf,eot,woff,woff2,ttf}',
        './assets/*.html'
    ),
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: `[name].js`, //.${hash}
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `[name].css`, //.${hash}
            chunkFilename: 'css/[id].chunk.css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new HtmlWebpackPlugin({
            title: 'Cartaz #EuVou',
            filename: 'cartaz-euvou.html',
            template: './assets/cartaz-euvou.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            title: 'Cartaz Aniversariante',
            filename: 'cartaz-aniversariante.html',
            template: './assets/cartaz-aniversariante.html',
            chunks: ['index']
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'node_modules/cropperjs/dist/cropper.min.css',
                    to: 'css'
                },
                {
                    from: 'node_modules/cropperjs/dist/cropper.min.js',
                    to: 'js'
                },
                {
                    from: 'assets/configs/**/*.json',
                    to: ''
                }
            ]
        })
    ],
    resolve: {
        extensions: ['.js', '.css', '.scss', '.sass']
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /src\/css/, /src\/images/],
                use: [
                    {
                        loader: 'template-string-optimize-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-syntax-dynamic-import']
                        }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')]
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    minimize: {
                        caseSensitive: true,
                        conservativeCollapse: true,
                        keepClosingSlash: true,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: true,
                        collapseWhitespace: false,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    attributes: {
                        list: [
                            {
                                tag: 'img',
                                attribute: 'src',
                                type: 'src'
                            },
                            {
                                tag: 'img',
                                attribute: 'srcset',
                                type: 'srcset'
                            },
                            {
                                tag: 'img',
                                attribute: 'data-src',
                                type: 'src'
                            },
                            {
                                tag: 'img',
                                attribute: 'data-srcset',
                                type: 'srcset'
                            },
                            {
                                tag: 'link',
                                attribute: 'href',
                                type: 'src',
                                filter: (tag, attribute, attributes, resourcePath) => {
                                    if (/my-html\.html$/.test(resourcePath)) {
                                        return false;
                                    }

                                    if (!/stylesheet/i.test(attributes.rel)) {
                                        return false;
                                    }

                                    if (attributes.type && attributes.type.trim().toLowerCase() !== 'text/css') {
                                        return false;
                                    }

                                    return true;
                                }
                            }
                        ]
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico|pdf|xlsx|docx|doc|xls)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true
                            },
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: [0.65, 0.9],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            }
                        }
                    }
                ]
            },
            {
                test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            publicPath: '../'
                        }
                    }
                ]
            }
        ]
    }
};
