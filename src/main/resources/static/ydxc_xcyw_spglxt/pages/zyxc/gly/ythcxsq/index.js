// 查询记录模块
define(['extend/template1.js', 'config'], function (template1, config) {

    new Vue({
        el: '#jscxjc',
        mixins: [template1],
        data: function () {
            // var _this =this;
            return {
                pageshow:true,
                sqbmList: [],
                // 单位
                dw: '',
                // 申请单位列表
                sqdwList: [],
                xxjs: '',
                shList: {
                    data: [
                    ],
                    customData: {},
                    limit: 15,
                    offset: 0,
                    total: 10
                },
                pageNow: 20,
                total: 30,
                // 默认申请部门不可选
                disabled: true,
                queryInfo: {},
                query: {
                    // 分页数据
                    pageNow: 1,
                    pageSize: 10,
                    offset: 0,
                    currentSize: ''
                },
                //查询条件
                cxtj: {
                    thkssj: '',
                    thjssj: '',
                    sqdwList: '',
                    cxh: '',
                    zt: ''
                },
                options3: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.thjssj).valueOf() - 86400000;
                        }
                    }
                })(this),
                options4: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.thkssj).valueOf();
                        }
                    }
                })(this),
                //暂无数据是否显示
                zwsjShow:false,
                sendBackListUrl: config.url.frame.sendBackListUrl,
                // 状态列表
                ztList: [{
                    code: '7',
                    name: '核验不通过'
                },  {
                    code: '18',
                    name: '已退回'
                }],
            }
        },
        // 创建
        created: function () {
            var _this = this;
            _this.query.pageSize = getLimit();
        },
        methods: {
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 申请单位
                if(this.sqdwList.length != 0){
                    this.sqdwList = [];
                }
                this.cxtj.cxh = ''
                this.cxtj.zt = '';
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                // 结束时间
                this.cxtj.thjssj = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
                // 开始时间
                // 用户没有选择时间，用默认的时间
                this.cxtj.thkssj = year + '-01-01';
                var _this = this;
                _this.query.pageNow = 1;
                _this.query.offset = 0;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.selectYth();
            },
            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param {type}
             * @return: {undefined}
             */
            selectSqsjStart: function (date) {
                var _this = this;
                if (new Date(this.cxtj.thjssj) < new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    })
                    _this.cxtj.thkssj = "";
                } else {
                    _this.query.offset = 0;
                }
            },
            selectSqsjEnd: function (date) {
                var _this = this;
                if (new Date(this.cxtj.thkssj) > new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    })
                    _this.cxtj.thjssj = "";
                } else{
                    _this.query.offset = 0;
                }
            },
            selectDw: function (newValue, oldValue) {
                var _this = this;
                if(newValue && newValue.length > 0 && _this.sqdwList.length === 0) {
                    newValue.splice(0, newValue.length);
                }
                _this.queryInfo.offset = 0;
                // _this.selectYth();
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                var _this = this;
                _this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                _this.query.offset = (_this.query.pageNow -1)* page.limit;
                _this.selectYth();
            },

            handleChangePageSize: function (page) {
                var _this = this;
                _this.query.pageSize = page;
                _this.selectYth();
            },
            createSqdwList:function(){
                var _this = this;
                _this.cxtj.sqdwList = null;
                if(_this.sqdwList != null && _this.sqdwList.length>0){
                    if(_this.sqdwList.length>0){
                        _this.cxtj.sqdwList = _this.sqdwList;
                    }
                }
            },
            /**
             * 获取已导出列表数据
             * @param queryInfo 分页信息
             */
            selectYth: function () {
                var _this = this;
                _this.createSqdwList();
                // 初始化时间
                _this.initSqDate();
                _this.queryInfo.offset = _this.query.offset;
                _this.queryInfo.limit = _this.query.pageSize;
                _this.cxtj.time = Date.now();
                Artery.loadPageData(_this.sendBackListUrl, _this.queryInfo, _this.cxtj)
                    .then(function (result) {
                        if (result.success) {
                            _this.shList = result.data;
                            if(_this.shList.data.length <= 0 ) {
                                _this.zwsjShow = true;
                            } else {
                                _this.zwsjShow = false;
                            }
                            _this.total = result.data.total;
                            if(parseInt(_this.total/_this.query.pageSize) == _this.query.pageNow -1){
                                _this.query.currentSize = _this.total;
                            } else {
                                _this.query.currentSize = _this.query.pageSize * (_this.query.pageNow);
                            }
                        } else {
                            Artery.message.error(result.message);
                        }
                    })
            },
            /**
             * @description 显示初始化时间（今年的一月一号到今日）
             * @author nfj
             * @name initSqDate
             */
            initSqDate: function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                // 判断用户是否选了时间
                if (this.cxtj.thkssj) {
                    // 用户选择了时间，不做任何操作
                } else {
                    // 用户没有选择时间，用默认的时间
                    this.cxtj.thkssj = year + '-01-01';
                }
                // 判断用户是否选了时间
                if (this.cxtj.thjssj) {
                    // 用户选择了时间，不做任何操作
                } else {
                    // 用户没有选择时间，用默认的时间
                    this.cxtj.thjssj = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
                }
            },
            openSqb: function (bh) {
                // 请求书生的阅读接口
                Artery.ajax.get("/api/v1/spb/view", {
                    timeout: 50000,
                    params: {
                        sqbh: bh,
                        type: "2",  //1: 地方  2: 中央
                        time: Date.now()
                    }
                }).then(function (result) {
                    if (result === 'dzurl') {
                        result = '/ydxc_xcyw_spglxt/pages/dfxc/approval/cgdyyl/index.html';
                    } else if(!(result && /(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(result))) {
                        Artery.notice.warning({
                            title: '无法连接上电子签章服务，请联系管理员',
                            desc: ''
                        });
                        return;
                    }
                    Artery.open({
                        targetType: "_blank",
                        url: encodeURI(result),
                        params: {
                            cBh: bh
                        }
                    });
                })
            }
        }
    })
});
