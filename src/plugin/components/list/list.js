Component({
    data: {
        // list: []
    },
    properties: {
        list: {
            type: [{
                name: String,
                price: String | Number
            }]
        },
        changelist: {
            type: Function
        }
    },
    attached () {
        const a = new About()
        a.render()
        // 可以在这里发起网络请求获取插件的数据
        // this.setData({
        //     list: [{
        //         name: '电视',
        //         price: 1000
        //     }, {
        //         name: '电脑',
        //         price: 4000
        //     }, {
        //         name: '手机',
        //         price: 3000
        //     }]
        // })
    },
    methods: {
        handleClick (e) {
            const {
                index
            } = e.target.dataset
          
            this.triggerEvent('changelist', { index })
        }
    }
})

class About {
    constructor () {
        this.a = 'a'
    }

    async render () {
        console.log(777)
    }
}
