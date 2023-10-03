// 查询记录模块
define(['extend/template1.js'], function (template1) {

    new Vue({
        el: '#jsApp',
        mixins: [template1],
        data: {
            name: '模板页面',
            value: '',
            pageNow: 20,
            total: 30,
            // 卡片里的人员数据
            cxjgName: [{
                    id: 0,
                    name: 'aaaaa'
                },
                {
                    id: 2,
                    name: 'bbb'
                },
                {
                    id: 2,
                    name: 'bbb'
                },
                {
                    id: 2,
                    name: 'bbb'
                },
                {
                    id: 2,
                    name: 'bbb'
                },
                {
                    id: 2,
                    name: 'bbb'
                }
            ],
            // 页面tablelist的数据
            data2: (function (len) {
                var _data = [];
                var k = 0;
                for (var i = 0; i < len; i++) {
                    k++;
                    _data.push({
                        name: '一级 ' + k,
                        id: '' + k,
                        open: true,
                        children: [{
                            id: k + '-' + k,
                            name: '二级 ' + k + '-' + k,
                            open: true,
                            children: [{
                                icon: '/src/components/css/images/treeIcon/avatar.png',
                                id: k + '-' + k + '-' + k,
                                open: true,
                                name: '三级 ' + k + '-' + k + '-' + k,
                                children: [{
                                    icon: '/src/components/css/images/treeIcon/avatar.png',
                                    id: k + '-' + k + '-' + k + '-' + k,
                                    name: '三级 ' + k + '-' + k + '-' + k + '-' + k,
                                    draggable: false
                                }, {
                                    icon: '/src/components/css/images/treeIcon/avatar.png',
                                    id: k + '-' + k + '-' + k + '-' + k + '2',
                                    name: '三级 ' + k + '-' + k + '-' + k + '-' + k + '2',
                                    draggable: false
                                }]
                            }]
                        }]
                    })
                }
                return _data;
            })(3),
            rs1: [{
                fkdw: '工商银行',
                fkrq: '2016-05-04',
                result: '有',
                zhs: '3'
            }, {
                fkdw: '工商银行',
                fkrq: '2016-05-04',
                result: '有',
                zhs: '3'
            }],
        },
        // 创建
        created: function () {

        },
        mounted: function () {
            var _this = this;
            _this.$refs.cxjkXzScroll.update(0,0);
            $(function () {
                // if( $('.aty-tree .aty-tree-node-icon>img').attr('alt') === '图标') {
                // }
            })
        },
        methods: {
            changeSelect: function (name) {
                console.log('name')
            },
            // 额外的请求参数
            requestDataExtendsParams: {
                fdId: 'zgrmfy-id-001',
                fymc: "zgrmfy"
            }
        }

    })


})