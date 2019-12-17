/*
 * @Author: huangzz 
 * @Date: 2019-07-31 19:44:36 
 * @Last Modified by: huangzz
 * @Last Modified time: 2019-12-17 13:54:07
 */
const fs = require('fs')
const path = require('path')
module.exports = async function (content, map, meta) {
    let scssPath = this.resourcePath.replace('.js', '.scss')
    let callback = this.async()
    if (fs.existsSync(scssPath)) {
        this.addDependency(scssPath)
        await new Promise(resolve => {
            this.loadModule(scssPath, (err, source, sourceMap, module) => {
                let {
                    path: cwd
                } = this._compilation.options.output
                
                let root = cwd.replace(process.cwd() + path.sep, '').split(path.sep)[0]
                let str = ''
                let targetPath = scssPath.replace('src', root).replace('.scss', '.wxss').replace(cwd + path.sep, '')

                source.replace(/((module.id,\s")(.*)(",))/, ($0, $1, $2, $3) => {
                    str = $3
                        .replace(/(\\n)/g, '')
                        .replace(/([;:\}\{])\s{1,}/g, '$1')
                        .replace(/\s{1,}(\{)/g, '$1')
                    return $0
                })
                this.emitFile(targetPath, Buffer.from(str, 'utf-8'), sourceMap)
                resolve()
            })
        })
    } 
    callback(null, content, map, meta)
}
