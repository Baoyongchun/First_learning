/*
 * @Author: DengShuai
 * @Date: 2021-04-01
 * @LastEditors: DengShuai
 * @LastEditTime: 2021-04-01
 * @Description: 消息通知
 */
define(['fdEventBus', 'config', 'fdGlobal', 'Promise'], function (fdEventBus, config, fdGlobal, Promise) {
    new Vue({
        el: '#jsAppControllerSqdbdInfo',
        data: function () {
            return {
                pageshow:true,
                // 状态列表
                ztList: [{
                    code: "",
                    name: '全部',
                }, {
                    code: '1',
                    name: '未反馈',
                }, {
                    code: '2',
                    name: '已反馈',
                }],
                //列表数据
                shList: [],
                pageNow: 10,
                total: 0,
                //artery封装查询对象
                queryInfo: {},
                query: {
                    offset: 0,
                    pageNow:1
                },
                //查询条件
                cxtj: {
                    //协查单位
                    xcdwId: "",
                    //查询项
                    sjyIds: [],
                    //比对处理状态 1未处理 2已处理
                    clzt: "",
                    //单号id
                    bh: "",
                },
                cxh:"",
                // 协查单位列表
                xcdwList: [],
                cXcdwName: '',
                //协查单位下拉框空中x号隐藏
                xcdwShow: false,
                // 查询项下拉列表
                cxxList:[],
                //协查单位下拉框空中x号隐藏
                cxxShow: false,
                // 查询项框是否可选
                isDisabled: true,
                currentPageIndex: 1,
                //暂无数据是否显示
                zwsjShow: false,
                // table 意见内容或者答复内容的重写title是否显示
                tableToolTipIsShow: false,
                // title 的内容
                tableToolTipCon: '',
                delRow: {},
                isClick: true,
                xxlbFlag:true,
                //处理信息
                bjMsArea:"",
                //选择的处理id
                bjMsIds:[],
                //全选
                checkedAll: false,
            }
        },
        destroyed: function () {
            // 取消事件绑定
            // this.unbindEvent();
        },
        methods: {
            /**
             *  * @Author juxiang
             *    @description 组装请求数据
             */
            getRequestData (file) {
                var formData = new FormData();
                formData.append('file', file);
                return formData;
            },
            /**
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset: function () {
                // 如果查询条件有值，怎清空后重新请求数据
                this.cxtj.xcdwId = ''
                this.cxtj.sjyIds = []
                this.cxtj.clzt = ''
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.isDisabled = true// 查询项框是否可选
                this.xcdwShow = false;//协查单位下拉框空中x号隐藏
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.init(this.queryInfo);
            },
            setIndex: function (index) {
                return (index + 1) + (this.currentPageIndex - 1) * 10
            },
            /**
             * 初始化列表信息
             * @param queryInfo
             */
            init: function (queryInfo) {
                var _this = this;
                return new Promise(function(resolve, reject){
                    _this.queryInfo = queryInfo;
                    let _params = Object.assign(_this.queryInfo, _this.cxtj);
                    _params.sjyIds = _params.sjyIds.join(',')
                    Artery.ajax.get("/itemBdResult/detailedBdPage", {
                        params: _params
                    }).then(function (result) {
                        if(result.code) {
                            Artery.notice.error({
                                title: '查询失败！'
                            });
                            return;
                        }
                        _this.shList = result.data;
                        // 当数据的长度等于0时，暂无数据显示
                        _this.zwsjShow = _this.shList.length <= 0;
                        _this.total = result.total;
                        resolve(true);
                    }).catch(function (err) {
                        console.info(err);
                        reject(false);
                    });
                })
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.currentPageIndex = page.offset / page.limit + 1;
                this.init(this.queryInfo);
            },
            // 查询
            queryTable: function () {
                var _this = this
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.init(this.queryInfo);
            },
            goBack: function () {
                window.location.href = '../sqdbd/index.html'
            },
            //初始化协查单位、查询项
            selectXcdwAndCxxList: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/cxjcjl/getCxjcXcdwCxx", {
                    params: {
                        bh:_this.cxtj.bh
                    }
                }).then(function (result) {
                    if (result.success) {
                        _this.cxxList = result.data.cxx;
                        _this.xcdwList = result.data.xcdw;
                    } else {
                        Artery.message.error(result.message);
                    }
                })
            },
            //处理下拉列表
            xcdwChange: function(xcdwId){
                var _this= this;
                if(_this.cxtj.xcdwId!=='') {
                    _this.xcdwShow = true;
                    _this.isDisabled = false;
                    _this.cxdwCodeChange(_this.cxtj.xcdwId);
                } else {
                    _this.clearXcdw()
                }
            },
            //清空协查单位
            clearXcdw: function() {
                var _this = this
                _this.cxtj.xcdwId = ''
                _this.cxtj.sjyIds = []
                this.xcdwShow = false;
                this.isDisabled = true;
            },
            //查询项根据协查单位而改变
            cxdwCodeChange : function(xcdwId){
                var _this = this;
                Artery.ajax.get("/api/v1/cxjcjl/getCxxByXxdw", {
                    params: {
                        bh: _this.cxtj.bh,
                        cXzdwbm: xcdwId
                    }
                }).then(function (result) {
                    if (result.success) {
                        _this.cxxList = result.data.cxx;
                    } else {
                        Artery.message.error(result.message);
                    }
                })
            },

            //关闭弹出
            closeBjModal: function () {
                let _this = this;
                _this.bjMsArea = "";
                _this.bjMsIds = []
                _this.$refs.bjModal.close();
            },

            //显示弹窗 type 1单个 2批量
            bjMod: function (item, type) {
                var _this = this;
                _this.bjMsArea = "";
                _this.bjMsIds = []
                if (type == 1) {
                    if (item) {
                        _this.bjMsIds = [item.id]
                    }
                } else if (type == 2) {
                    _this.bjMsIds = _this.shList
                        .filter(item => item.checked)
                        .map(item => item.id);
                }
                if (_this.bjMsIds.length <= 0) {
                    Artery.notice.error({
                        title: '请选择数据！'
                    });
                    return;
                }
                this.$refs.bjModal.open();
            },
            //提交
            clickSubmitMs: function () {
                var _this = this;
                if (_this.bjMsIds.length === 0) {
                    Artery.notice.error({
                        title: '请选择数据！'
                    });
                    return;
                }
                if (_this.bjMsArea.length <= 0) {
                    Artery.notice.error({
                        title: '请输入处理说明！'
                    });
                    return;
                }
                let _params = {}
                _params.ids = _this.bjMsIds
                _params.mark = _this.bjMsArea
                Artery.ajax.post("/itemBdResult/updateResolvedStatus", _params)
                    .then(function (result) {
                    if(result.success) {
                        Artery.notice.success({
                            title: '提交成功'
                        });
                        _this.closeBjModal()
                        _this.queryTable()
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                });
            },
            // 点击全选
            clickAll: function () {
                var _this = this;
                _this.checkedAll = !_this.checkedAll;
                if (_this.checkedAll) {
                    _this.shList.forEach(function (item, index) {
                        if (item.clzt == 1) {
                            item.checked = true;
                        }
                    });
                } else {
                    _this.shList.forEach(function (item, index) {
                        item.checked = false;
                    });
                }
            },
            //点击单个
            clickItem: function (row) {
                if (row) {
                    row.checked = !row.checked
                }
            },
        },
        created: function () {
            var _this = this;
            _this.xxlbFlag=true;
            var params = Artery.parseUrl();
            _this.cxh = params.cxh;
            _this.cxtj.bh = params.bh;
            this.pageNow = getLimit();
            _this.selectXcdwAndCxxList()
        },
        mounted: function () {

        }
    })
});
