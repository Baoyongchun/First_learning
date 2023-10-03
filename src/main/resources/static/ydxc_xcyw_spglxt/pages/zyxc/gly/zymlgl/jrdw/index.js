
// 查询记录模块
define(['extend/template1.js'],function (template1) {

    new Vue({
        el:'#jsApp',
        mixins:[template1],
        data:{
            name:'模板页面'
        },
        // 创建
        created:function () {

        },
        methods:{
            changeSelect:function (name) {
                console.log('name')
            }
        }

    })
})
