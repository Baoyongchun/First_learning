// 查询记录模块
define(['fdComponent2', 'extend/template1.js'], function (fdComponent, template1) {

    new Vue({
        el: '#jsApp',
        mixins: [template1],
        data: {
            pageNow: 2,
            total: 20,
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
            // 申请单位
            sqdwList: [{
                    key: '1',
                    name: '单位1'
                },
                {
                    key: '2',
                    name: '单位2'
                }
            ],
            sqdw: '',
            // 申请部门
            sqbmList: [{
                    key: '1',
                    name: '部门1'
                },
                {
                    key: '2',
                    name: '部门2'
                }
            ],
            sqbm: '',
            optionData: { //目录分页
                totalPage: 10,
                totalSize: 100,
                currentSize: 10,
                currentPage: 1,
                showPoint: false,
                showPage: 4,
                prev: ' ',
                next: " ",
                first: " ",
                last: " ",
                callback: function (num) {
                    /* console.log(num)*/
                }
            },
            /*基本数据*/
            dataDataList: [{
                    zdmc: '证照号码', // 字段名称
                    zddm:'ZZLXDM',
                    zdlx:'字符型',
                    sfwk:'是',
                    sm: '沿用请求单的证件号码；' // 说明
                },
                {
                    zdmc: '证照号码', // 字段名称
                    zddm:'ZZLXDM',
                    zdlx:'字符型',
                    sfwk:'是',
                    sm: '沿用请求单的证件号码；' // 说明
                },
                {
                    zdmc: '证照号码', // 字段名称
                    zddm:'ZZLXDM',
                    zdlx:'字符型',
                    sfwk:'是',
                    sm: '沿用请求单的证件号码；' // 说明
                }
            ]
        },
        // 创建
        created: function () {

        },
        methods: {
            changeSelect: function (name) {
                console.log('name')
            },
            ready: function (scrollbar) {
                scrollbar.update();
            },
        }

    })


})