const { request } = requirePlugin('myPlugin')

// plugin = plugin.default || plugin
Page({
    data: {
        list: [{
            name: '电视',
            price: 1000
        }, {
            name: '电脑',
            price: 4000
        }, {
            name: '手机',
            price: 3000
        }]
    },
    async onLoad () {
        // const res = await axios.get('https://cdata.58.com/nfp')
        // console.log(res)
        // eslint-disable-next-line no-new
        // try {
        //     const res = await request({ url: 'https://wxapp.58.com' })
        //     // console.log(res)
        // } catch (error) {
        //     console.log(error)
        // }
    },
    changelist (e) {
        let index = e
        if (e.type) {
            index = e.detail.index
        }
        const {
            list
        } = this.data  

        list[index].price = Math.floor(Math.random() * 1000)

        this.setData({
            list
        })
    }
})
