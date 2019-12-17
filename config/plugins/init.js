/*
 * @Author: huangzz 
 * @Date: 2019-07-31 19:44:24 
 * @Last Modified by: huangzz
 * @Last Modified time: 2019-08-05 14:37:16
 */
const path = require('path')
module.exports = class InitPlugin {
    constructor (options) {
        this.options = Object.assign({}, {
            minimize: false
        }, options)
    }
    add (chunks, compilation) {
        chunks.forEach((chunk, i) => {
            chunk.files.forEach((filename, j) => {
                let {
                    output,
                    optimization
                } = compilation.options
                let cwd = output.path
                let prefix = output.filename.replace(/(\/(.*){0,}\.(.*){0,})/, '')
                let runtimeChunkName = optimization.runtimeChunk &&  optimization.runtimeChunk.name ? [path.join(prefix, optimization.runtimeChunk.name)] : []
                let { cacheGroups } = optimization.splitChunks || {}

                let vendorChunkNames = cacheGroups ? Object.keys(cacheGroups).map(key => {
                    if (key !== 'default' && cacheGroups[key].name) return path.join(prefix, cacheGroups[key].name)
                    return ''
                }).filter(key => {
                    return chunks.some(chunk => {
                        return key && chunk.files.filter(filename => key === filename.replace('.js', '')).length
                    })
                     
                }) : []
                let realFilename = filename.replace('js/', '')
                let names = [...runtimeChunkName, ...vendorChunkNames, filename.replace('.js', '')]

                if ([...runtimeChunkName, ...vendorChunkNames].indexOf(filename.replace('.js', '')) === -1) {
                    let str = ''
                    names.map((key, i) => {
                        str += (i === names.length -1 ? 'module.exports = ' : '') + `require('${path.relative(realFilename, key).replace(path.sep, '/').replace('../', '')}.js');`
                    })
                    let source = Buffer.from(
                        str,
                        'utf-8'
                    )
                    compilation.assets[realFilename] = {
                        source: () => { 
                            return source
                        },
                        size: () => {
                            return source.length
                        }
                    }
                }
                let reg = /Function\("r"\,\s{0,}"regeneratorRuntime\s{0,}=\s{0,}r"\)\([a-zA-Z]{1,}\)/g

                let str = compilation.assets[filename].source().toString('utf-8').replace(reg, '')
                let source = Buffer.from(str, 'utf-8')
                compilation.assets[filename] = {
                    source: () => {
                        return source
                    },
                    size: () => {
                        return source.length
                    }
                }
            })
        })
    }
    apply (compiler) {
        if (compiler.hooks) {            
            compiler.hooks.compilation.tap('compilation', compilation => {
                compilation.hooks.afterOptimizeChunkAssets.tap('afterOptimizeChunkAssets', (chunks) => {
                    this.add(chunks, compilation)
                })
            })
        } else {
            compiler.plugin('compilation', compilation => {
                compilation.plugin('after-optimize-chunk-assets', chunks => {
                    this.add(chunks, compilation)
                })
            })
        }
    }
}
