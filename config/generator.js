/*
 * @Author: huangzz 
 * @Date: 2019-07-31 19:44:51 
 * @Last Modified by: huangzz
 * @Last Modified time: 2019-12-17 14:18:18
 */
const path = require('path')
const getEntry = require('./entry')
const rimraf = require('rimraf')
const Copy = require('copy-webpack-plugin')
const Init = require('./plugins/init') // 添加js
const babel = require('@babel/core')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const env = process.env.NODE_ENV

module.exports = (name) => {
    const origin = `src/${name}`
    const target = `dist/${name}`
    rimraf.sync(`${target}/**/*`)
    name === 'plugin' && rimraf.sync(`dist/*`)

    return {
        mode: 'none',
        entry: getEntry(name),
        resolveLoader: {
            modules: [
                'node_modules',
                path.resolve(__dirname, './loaders')
            ]
        },
        output: {
            path: path.resolve(__dirname, `../${target}`),
            filename: 'js/[name].js',
            globalObject: 'global',
            libraryTarget: 'commonjs',
            chunkFilename: 'js/[name].js'
        },
        optimization: {
            minimize: env !== 'development',
            occurrenceOrder: true,
            sideEffects: false,
            concatenateModules: true,
            runtimeChunk: {
              name: 'manifest'
            },
            splitChunks: {
              chunks: 'async',
              minSize: 30000,
              minChunks: 1,
              maxAsyncRequests: 5,
              maxInitialRequests: 3,
              name: true,
              cacheGroups: {
                default: {
                  minChunks: 2,
                  priority: -20,
                  reuseExistingChunk: true
                },
                vendors: {
                  name: 'vendor',
                  chunks: 'all',
                  test: /[\\/](node_modules|src)[\\/]/,
                  priority: -10
                }
              }
            }
        },
        module: {
            rules: [
                {
                    test: /\.(t|j)s$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader'
                        },
                        {
                            // 添加scss模块
                            loader: 'add-module-loader'
                        },
                        {
                            loader: 'ts-loader'
                        },
                        {
                            loader: 'eslint-loader'
                        }
                    ]
                },
                {
                    test: /\.scss/,
                    exclude: /node_modules/,
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        plugins: [
            new StyleLintPlugin({
                context: "src",
                configFile: path.resolve(__dirname, '../.stylelintrc.json'),
                files: '**/*.scss',
                failOnError: false,
                quiet: true,
                syntax: 'scss'
            }),
            new Init({
                minimize: env !== 'development'
            }),
            new Copy([
                {
                    from: '**/*.json',
                    to: './',
                    transform: (content, path) => {
                        return JSON.stringify(JSON.parse(content))
                    }
                },
                {
                    from: '**/*.wxml',
                    to: './',
                    transform: (content, path) => {
                        let str = content.toString('utf-8')
                            .replace(/(\n|\r)/g, "") //del \n
                            .replace(/>([\x20\t]+)</g, "><") //del blank & tab
                            .replace(/<!--.+?-->/g, "") // del comment
                            .replace(/\s{2,}/, ' ')
                            .replace(/^\s+|\s+$/g, "") // trim blank
                        return Buffer.from(str, 'utf-8')
                    }
                },
                {
                    from: '**/*.wxs',
                    to: './',
                    transform: async (content) => {
                        let { code } = await babel.transformAsync(content, {
                            babelrcRoots: path.resolve(__dirname, '../')
                        })
                        return code.replace(/\n/g, '')
                    }
                }
            ], {
                context: path.resolve(__dirname, `../${origin}`)
            })
        ].concat(name === 'plugin' ? [
            new Copy([
                {
                    from: '*.json',
                    to: '../',
                    transform: (content, path) => {
                        return JSON.stringify(JSON.parse(content))
                    }
                }
            ], {
                context: path.resolve(__dirname, `../src`)
            })
        ] : [])
        .concat(env === 'analyze' ? [
            new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
                analyzerPort: name === 'plugin' ? 3001 : 3002
            })
        ] : [])
    }
}