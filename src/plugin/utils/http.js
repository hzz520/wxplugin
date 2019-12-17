export default async (options) => {
    // eslint-disable-next-line no-new
    const defaultOptions = {
        url: '',
        method: 'get', 
        data: {}, 
        header: {
            contentType: 'application/x-www-form-urlencoded'
        }
    }
    const res = await new Promise((resolve, reject) => {
        wx.request({
            ...defaultOptions,
            ...options,
            success (res) {
                if (res.statusCode === 0) {
                    resolve(res.data) 
                    return false
                }
                // todo 异常处理弹窗
                reject('error')
            },
            fail (err) { 
                // todo 异常处理弹窗
                reject(err) 
            }
        })
    })
    return res
}
