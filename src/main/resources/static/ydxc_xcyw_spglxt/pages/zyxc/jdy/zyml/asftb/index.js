/*
 * @Author: wjing
 * @Date: 2020-02-18 18:26:16
 * @LastEditors: wjing
 * @LastEditTime: 2020-02-19 10:54:27
 * @Description:资源目录管理 - 按省份同步 
 */
define(['extend/template1.js'], function (template1) {

    new Vue({
        el: '#jsAsftb',
        mixins: [template1],
        data: function () {
            return {
                // 全选
                all: false,
                // 左侧省份
                provinLeft: [],
                // 右侧省份
                provinRight: [],
                // 左侧省份列表
                leftdataList: [{
                    code: '110000000000',
                    name: '北京市监委'
                }, {
                    code: '120000000000',
                    name: '天津市监委'
                }, {
                    code: '130000000000',
                    name: '河北省监委'
                }, {
                    code: '140000000000',
                    name: '山西省监委'
                }, {
                    code: '150000000000',
                    name: '内蒙古自治区监委'
                }, {
                    code: '210000000000',
                    name: '辽宁省监委'
                }, {
                    code: '220000000000',
                    name: '吉林省监委'
                }, {
                    code: '230000000000',
                    name: '黑龙江省监委'
                }, {
                    code: '310000000000',
                    name: '上海市监委'
                }, {
                    code: '320000000000',
                    name: '江苏省监委'
                }, {
                    code: '330000000000',
                    name: '浙江省监委'
                }, {
                    code: '340000000000',
                    name: '安徽省监委'
                }, {
                    code: '350000000000',
                    name: '福建省监委'
                }, {
                    code: '360000000000',
                    name: '江西省监委'
                }, {
                    code: '370000000000',
                    name: '山东省监委'
                }, {
                    code: '410000000000',
                    name: '河南省监委'
                }, {
                    code: '420000000000',
                    name: '湖北省监委'
                }, {
                    code: '430000000000',
                    name: '湖南省监委'
                }, {
                    code: '440000000000',
                    name: '广东省监委'
                }, ],
                // 右侧省份列表
                rightdataList: [{
                    code: '450000000000',
                    name: '广西壮族自治区监委'
                }, {
                    code: '460000000000',
                    name: '海南省监委'
                }, {
                    code: '500000000000',
                    name: '重庆市监委'
                }, {
                    code: '510000000000',
                    name: '四川省监委'
                }, {
                    code: '520000000000',
                    name: '贵州省监委'
                }, {
                    code: '530000000000',
                    name: '云南省监委'
                }, {
                    code: '540000000000',
                    name: '西藏自治区监委'
                }, {
                    code: '610000000000',
                    name: '陕西省监委'
                }, {
                    code: '620000000000',
                    name: '甘肃省监委'
                }, {
                    code: '630000000000',
                    name: '青海省监委'
                }, {
                    code: '640000000000',
                    name: '宁夏回族自治区监委'
                }, {
                    code: '650000000000',
                    name: '新疆维吾尔自治区监委'
                }, {
                    code: '660000000000',
                    name: '新疆生产建设兵团监委'
                }, ]
            }

        },
        // 创建
        created: function () {

        },
        methods: {
            /**
             * @Author: wjing
             * @name: allSelect
             * @description: 全选
             * @param {type} 
             * @return: {undfined}}
             */
            allSelect: function () {
                if (this.all) {
                    this.provinLeft = [
                        '110000000000',
                        '120000000000',
                        '130000000000',
                        '140000000000',
                        '150000000000',
                        '210000000000',
                        '220000000000',
                        '230000000000',
                        '310000000000',
                        '320000000000',
                        '330000000000',
                        '340000000000',
                        '350000000000',
                        '360000000000',
                        '370000000000',
                        '410000000000',
                        '420000000000',
                        '430000000000',
                        '440000000000'];
                    this.provinRight = [
                        '450000000000',
                        '460000000000',
                        '500000000000',
                        '510000000000',
                        '520000000000',
                        '530000000000',
                        '540000000000',
                        '610000000000',
                        '620000000000',
                        '630000000000',
                        '640000000000',
                        '650000000000',
                        '660000000000'];
                } else {
                    this.provinLeft = [];
                    this.provinRight = [];
                }
            },
            sync: function() {
                var _this = this;
                var p = _this.provinLeft.concat(_this.provinRight);
                if(p.length == 0) {
                    Artery.notice.info({
                        title: '请选择同步省份后进行同步！'
                    })
                } else {
                    Artery.ajax.get("/api/v1/zyml/sync",{
                        params: {
                            provinces: JSON.stringify(p),
                        }
                    }).then(function(result){
                        if(result.code == 200) {
                            Artery.notice.success({
                                title: '已成功向数据协同系统发送资源目录同步请求！'
                            });
                        } else {
                            Artery.notice.error({
                                title: '向数据协同系统发送资源目录同步请求失败！'
                            })
                        }
                    });
                }

            }
        },
        mounted: function () {

        }

    })
})