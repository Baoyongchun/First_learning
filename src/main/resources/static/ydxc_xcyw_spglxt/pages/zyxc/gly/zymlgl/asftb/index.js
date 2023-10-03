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
                searchProvince: '',
                // 左侧省份
                provinLeft: [],
                // 右侧省份
                provinRight: [],
                leftDefaultList: [{
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
                }],
                // 左侧省份列表
                leftdataList: [],
                rightDefaultList: [{
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
                }],
                // 右侧省份列表
                rightdataList: []
            }

        },
        // 创建
        created: function () {
            this.leftdataList = this.leftDefaultList;
            this.rightdataList = this.rightDefaultList;
        },
        methods: {
            /**
             * @description 搜索框实时查询省份
             */
            searchRightProvince: function() {
                var _this = this;
                var selectLeftName = [];
                var selectRightName = [];
                console.log('搜索的省份',_this.searchProvince)
                // 循环原始数据
                $.each(_this.leftDefaultList, function (index,val) {
                    // 得到用户当前搜索的数据
                    if (val.name.indexOf(_this.searchProvince) > -1) {
                        selectLeftName.push(val);
                    }
                });
                // 循环原始数据
                $.each(_this.rightDefaultList, function (index,val) {
                    // 得到用户当前搜索的数据
                    if (val.name.indexOf(_this.searchProvince) > -1) {
                        selectRightName.push(val);
                    }
                });
                // 如果用户搜索的数据没有符合条件的，就显示默认的
                if (selectLeftName.length === 0) {
                    // _this.leftdataList = _this.leftDefaultList;
                    _this.leftdataList = []
                } else {
                    _this.leftdataList = selectLeftName;
                }
                // 如果用户搜索的数据没有符合条件的，就显示默认的
                if (selectRightName.length === 0) {
                    _this.rightdataList = [];
                } else {
                    _this.rightdataList = selectRightName;
                }
                this.$nextTick(function () {
                    _this.$refs.checkFormScroll && _this.$refs.checkFormScroll.update();
                })
            },
            /**
             * @description 点击每个复选框组，判断是否全选
             * @param value
             * @param dataItem
             * @param event
             */
            changeCheckbox: function(value, dataItem, event) {
                // 如果当前选中的左边和右边的量和默认的长度一样，就是全选，否则不是全选
                if (this.provinRight.length + this.provinLeft.length === this.rightdataList.length + this.leftdataList.length) {
                    this.all = true;
                } else {
                    this.all = false;
                }
            },
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
                                title: 'Success',
                                desc: '已成功向数据协同系统发送资源目录同步请求！'
                            });
                        } else {
                            Artery.notice.error({
                                title: 'error',
                                desc: '向数据协同系统发送资源目录同步请求失败！'
                            })
                        }
                    });
                }

            }
        },
        mounted: function () {
            var _this = this;
            this.$nextTick(function () {
                _this.$refs.checkFormScroll.update();
            })
        }

    })
})
