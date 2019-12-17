/*
 * @Author: huangzz 
 * @Date: 2019-07-31 19:44:45 
 * @Last Modified by: huangzz
 * @Last Modified time: 2019-12-17 14:13:09
 */
const glob = require('glob')
const path = require('path')

module.exports = (name, extname = '.js') => {
    const cwd = path.resolve(__dirname, '../src', name)
    return {
        ...glob.sync('**/*' + extname, { cwd }).reduce((obj, key) => {
            obj[key.replace(extname, '')] = path.resolve(cwd, key)
            return obj
        }, {})
    }
}
