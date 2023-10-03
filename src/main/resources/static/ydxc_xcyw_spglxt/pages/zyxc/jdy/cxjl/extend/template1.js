// 分模块
define([],function () {
    return {
        data:{
            age: 25
        },
        methods:{
            clickMe:function () {
                console.log(this)
                this.$Message.info('点击我干嘛？')
            }
        }
    }
})
