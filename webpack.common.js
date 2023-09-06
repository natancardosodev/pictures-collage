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

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: entry(
        entry.basePath('assets'),
        './assets/**/*.{js,scss,json,png,jpg,gif,ico,pdf,eot,woff,woff2,ttf}',
        './assets/index.html'
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
            title: 'Cartaz #EuVou'
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
                    attributes: {
                        list: [
                            {
                                // Tag name
                                tag: 'img',
                                // Attribute name
                                attribute: 'src',
                                // Type of processing, can be `src` or `scrset`
                                type: 'src'
                            },
                            {
                                // Tag name
                                tag: 'img',
                                // Attribute name
                                attribute: 'srcset',
                                // Type of processing, can be `src` or `scrset`
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
                                // Tag name
                                tag: 'link',
                                // Attribute name
                                attribute: 'href',
                                // Type of processing, can be `src` or `scrset`
                                type: 'src',
                                // Allow to filter some attributes
                                filter: (tag, attribute, attributes, resourcePath) => {
                                    // The `tag` argument contains a name of the HTML tag.
                                    // The `attribute` argument contains a name of the HTML attribute.
                                    // The `attributes` argument contains all attributes of the tag.
                                    // The `resourcePath` argument contains a path to the loaded HTML file.

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
