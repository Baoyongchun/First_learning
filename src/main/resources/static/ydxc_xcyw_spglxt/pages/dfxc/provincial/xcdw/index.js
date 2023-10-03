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
            // 列表数据
            xcdwDataList: [{
                cCspcjMc: null,
                cFlId: "01",
                cId: "010000000002",
                cName: "公安部",
                cSjyName: "户籍人口",
                cSpcjMcList: null,
                cSyzt: "1",
                nLx: 1,
                nSjjrfs: 1,
                nZt: 1
            }, {
                cCspcjMc: null,
                cFlId: "01",
                cId: "010000000002",
                cName: "公安部",
                cSjyName: "户籍人口",
                cSpcjMcList: null,
                cSyzt: "1",
                nLx: 1,
                nSjjrfs: 1,
                nZt: 1
            }, {
                cCspcjMc: null,
                cFlId: "01",
                cId: "010000000002",
                cName: "公安部",
                cSjyName: "户籍人口",
                cSpcjMcList: null,
                cSyzt: "1",
                nLx: 1,
                nSjjrfs: 1,
                nZt: 1
            }, {
                cCspcjMc: null,
                cFlId: "01",
                cId: "010000000002",
                cName: "银行",
                cSjyName: "户籍人口",
                cSpcjMcList: null,
                cSyzt: "1",
                nLx: 1,
                nSjjrfs: 1,
                nZt: 1
            }, {
                cCspcjMc: null,
                cFlId: "01",
                cId: "010000000002",
                cName: "银行",
                cSjyName: "户籍人口",
                cSpcjMcList: null,
                cSyzt: "1",
                nLx: 1,
                nSjjrfs: 1,
                nZt: 1
            }]
        },
        // 创建
        created: function () {
            /*重新分解列表数据合并形同协查单位*/
            this.xcdwDataList = this.listHandle(this.xcdwDataList);
        },
        methods: {
            changeSelect: function (name) {
                console.log('name')
            },
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
            }
        }

    })


})
