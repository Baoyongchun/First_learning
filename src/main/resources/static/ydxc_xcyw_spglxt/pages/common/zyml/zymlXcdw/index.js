// 查询记录模块
define(['extend/template1.js'], function (template1) {

    new Vue({
        el: '#jsApp',
        mixins: [template1],
        data: {
            name: '资源目录-协查单位',
            value: '',
            pageNow: 20,
            total: 30,
            queryInfo: {},
            // 列表数据
            xcdwDataList: [],
            //暂无数据是否显示
            zwsjShow:false,
            serialWith: '4%'
        },
        // 创建
        created: function () {
            this.serialWith = Math.round(100/(window.screen.width-226)*100) + '%';
            this.loadPageData();
        },
        methods: {
            changeSelect: function (name) {},
            //合并相同的协查单位
            listHandle: function (list) {
                for (var key in list[0]) {
                    var k = 0;
                    while (k < list.length) {
                        list[k][key + 'count'] = 1;
                        list[k][key + 'show'] = true;
                        for (var i = k + 1; i <= list.length - 1; i++) {
                            if (list[k][key] == list[i][key] && list[k][key] != '') {
                                list[k][key + 'count']++;
                                list[k][key + 'show'] = true;
                                list[i][key + 'count'] = 1;
                                list[i][key + 'show'] = false;
                            } else {
                                break;
                            }
                        }
                        k = i;
                    }
                }
                return list
            },
            loadPageData: function () {
                var _this = this;
                _this.queryInfo.limit = getLimit();
                _this.queryInfo.offset = 0;
                _this.queryInfo.splitPage = true;
                Artery.loadPageData("/api/v1/zyml/xcdw/list", _this.queryInfo).then(function (result) {
                    _this.xcdwDataList = _this.listHandle(result.data.data);
                    // 当数据的长度等于0时，暂无数据显示
                    if (_this.xcdwDataList.length <= 0 ) {
                        _this.zwsjShow = true;
                    } else {
                        _this.zwsjShow = false;
                    }
                    // _this.$refs.scrollTable.update();
                    _this.total = result.data.total;
                    _this.pageNow = result.data.data.length;
                })
            },
            change: function (pageInfo) {
                var _this = this;
                _this.queryInfo.limit = pageInfo.limit;
                _this.queryInfo.offset = pageInfo.offset;
                _this.queryInfo.splitPage = true;
                Artery.loadPageData("/api/v1/zyml/xcdw/list", _this.queryInfo).then(function (result) {
                    _this.xcdwDataList = _this.listHandle(result.data.data);
                    // 当数据的长度等于0时，暂无数据显示
                    if (_this.xcdwDataList.length <= 0 ) {
                        _this.zwsjShow = true;
                    } else {
                        _this.zwsjShow = false;
                    }
                    // _this.$refs.scrollTable.update();
                    _this.total = result.data.total;
                    _this.pageNow = result.data.data.length;
                })
            },
        },
        mounted:function(){
            // this.$refs.scrollTable.update();
        }

    })


})