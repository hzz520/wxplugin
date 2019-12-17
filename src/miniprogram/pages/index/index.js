const { request } = requirePlugin('myPlugin').default || requirePlugin('myPlugin')
// plugin = plugin.default || plugin
Page({
    async onLoad () {
        // const res = await axios.get('https://cdata.58.com/nfp')
        // console.log(res)
        // eslint-disable-next-line no-new
        try {
            const res = await request({ url: 'https://wxapp.58.com' })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
})
