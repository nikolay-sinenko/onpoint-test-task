const { join, resolve } = require('path')

const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const SOURCE = resolve(__dirname, './src')
const OUTPUT = resolve(__dirname, './dist')
const PORT = 3000;

module.exports = (_, argv) => {
    const prod = argv.mode === 'production';

    return {

        entry: {
            app: join(SOURCE, 'index.js')
        },
    
        output: {
            path: OUTPUT,
            filename: '[name].bundle.js'
        },
    
        devServer: {
            port: PORT,
        },
    
        module: {
            noParse: /lodash/,
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: [ 'babel-loader' ]
                },
                {
                    test: /\.scss$/,
                    include: /components|layouts/,
                    use: [
                        prod
                        ? MiniCssExtractPlugin.loader
                        : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    // BEM-naming for CSS Modules
                                    getLocalIdent: ({ context }, _, localName) => {
                                        const block = context.split('\\').pop().toLowerCase();
                                        return `${block}__${localName}`;
                                    },
                                },
                                sourceMap: false,
                            }
                        },
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    exclude: /components|layouts/,
                    use: [
                        prod
                        ? MiniCssExtractPlugin.loader
                        : 'style-loader',
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(png|jpe?g|svg|webp|ttf|woff2?)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[folder]/[name].[ext]',
                                publicPath: `${prod ? '.' : ''}./src/assets`,
                                emitFile: false
                            }
                        }
                    ]
                }
            ]
        },
    
        optimization: {
            minimize: prod,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false,
                })
            ]
        },

        resolve: {
            alias: {
                '@img': resolve(SOURCE, './assets/img'),
                '@fonts': resolve(SOURCE, './assets/fonts'),
                '@components': join(SOURCE, 'components'),
                '@styles': join(SOURCE, 'styles')
            }
        },
    
        plugins: [
            new HtmlWebpackPlugin({ 
                template: join(SOURCE, 'index.html'),
            }),
            new MiniCssExtractPlugin()
        ]
    }
}