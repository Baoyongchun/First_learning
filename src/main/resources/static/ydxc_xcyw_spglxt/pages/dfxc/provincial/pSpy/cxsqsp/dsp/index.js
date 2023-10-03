// 查询记录模块
define(['extend/template1.js', 'config','fdEventBus'], function (template1, config, fdEventBus) {
    var vm = new Vue({
        el: '#jscxsqsp',
        mixins: [template1],
        data: function () {
            return {
                pageshow:true,
                currentPage:1,
                /// 申请单位
                sqdw: [],
                // 申请单位列表
                sqdwList: [],
                // 申请部门列表
                sqbmList: [],

                showOrNot: true,
                // 状态
                zt: '',
                // 状态列表
                ztList: [{
                    code: 1,
                    name: '待审核',
                }, {
                    code: 2,
                    name: '审核通过',
                }, {
                    code: 3,
                    name: '审核不通过',
                }],
                sqr: '',
                //列表数据
                shList: [
                ],
                pageNow: '',
                pageOffset: 0,
                currentPageIndex: 1,
                total: 30,
                //artery封装查询对象
                queryInfo: {
                    limit: 10,
                    offset: 0,
                    splitPage: true
                },
                isFilter: false,
                //查询条件
                cxtj: {
                    //申请人
                    sqr:"",
                    //申请单位
                    sqdw: "",
                    //申请部门
                    bmIdList: [],
                    //开始日期
                    kssqsj: "",
                    //结束日期
                    jssqsj: ""
                },
                dspUrl: config.url.frame.dspUrl,
                yspUrl:config.url.frame.dspUrl,
                shUrl: '../../sh/index.html',
                ckspbUrl: '../../spb/index.html',
                // 默认申请部门不可选
                disabled: false,
                //不通过原因
                btgyy: '',
                hqdwbmUrl: config.url.frame.hqdwbmUrl,
                optionKssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.jssqsj).valueOf();
                        }
                    }
                })(this),
                optionJssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.kssqsj).valueOf();
                        }
                    }
                })(this),
                //暂无数据是否显示
                zwsjShow:false,
                // 申请单位选择后绑定的数据
                gzzshlSqdwValue: null,
                showOrNot:true,
                gzzshSqbmValue: null
            }
        },
        methods: {
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 如果查询条件有值，怎清空后重新请求数据
                if(this.cxtj.sqdw || this.cxtj.bmIdList || this.cxtj.sqr || this.cxtj.kssqsj || this.cxtj.jssqsj) {
                    // 申请单位
                    this.cxtj.sqdw = '';
                    //申请部门
                    this.cxtj.bmIdList = [];
                    // 开始时间
                    this.cxtj.kssqsj = '';
                    // 结束时间
                    this.cxtj.jssqsj = '';
                    // 信息检索
                    this.cxtj.sqr = '';
                }
                this.currentPageIndex = 1;
                this.currentPage = 1;
                this.queryInfo.offset = 0;
                this.pageOffset = 0;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                // 重新调用接口
                this.init(this.queryInfo);
                this.showOrNot=true;
            },
            setIndex: function(index) {
                return (index + 1) + (this.currentPageIndex - 1) * 10
            },
            /**
             * 初始化列表信息
             * @param queryInfo
             */
            init: function () {
            	var _this = this;
                var _data = _this.isFilter ? _this.cxtj : {};
                Artery.loadPageData(this.dspUrl, {
                	conditions:_data,
                    queryInfo: _this.queryInfo
                }).then(function (result) {
                    if (result.data!=undefined && result.data.length>=0) {
                         _this.shList = result.data;
                         var pMessage = {
                             message: 'spy-dsp',
                             count: result.total
                         }
                        // 如果带有查询条件，就不改变左侧数字
                        if(!_this.cxtj.bmIdList.length) {
                            window.parent.postMessage(pMessage, '*');
                        }
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.shList.length <= 0 ) {
                             _this.zwsjShow = true;
                        } else {
                             _this.zwsjShow = false;
                         }
                        _this.pageNow = _this.shList.length;
                        _this.total = result.total;
                        //_this.total = result.data.total
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                });
            },
            /**
             * 操作列--审核
             */
            openSh: function (row) {

                Artery.open({
                    targetType: '_blank',
                    url: this.ckspbUrl,
                    params: {
                        bh: row.cBh,
                        sqbs: row.cCxbs,
                        type: 'spy'
                    }
                })
            },
            /**
             * 操作列--查看审核表
             */
            openCkspb: function (row) {
                /*Artery.open({
                    targetType: '_blank',
                    url: this.ckspbUrl,
                    params: {
                        cBh: row.bh
                    }
                })*/

                // window.open('./ckspb/index.html', 'newwindow', 'height=600, width=600, top=300, left=650, toolbar=no, menubar=no, scrollbars=true, resizable=true,location=no, status=no');

                // 请求书生的阅读接口
                var _this = this;
                Artery.ajax.get("/api/v1/spb/view", {
                    timeout: 50000,
                    params: {
                        sqbh: row.bh,
                        type: "1",  //1: 地方  2: 中央
                        time: Date.now()
                    }
                }).then(function (result) {
                    console.log(result);
                    if (result == 'dzurl') {
                        result = _this.ckspbUrl;
                    }
                    Artery.open({
                        targetType: "_blank",
                        url: encodeURI(result),
                        params: {
                            cBh: row.bh
                        }
                    })
                })
            },
            changeCorp: function (newValue, oldValue) {
            	var _this = this;
            	if(newValue!=null && newValue!=undefined){
            		_this.gzzshlSqdwValue = newValue.id;
            		_this.showOrNot = false;
            	}else{
            		_this.gzzshlSqdwValue = '';
            		_this.cxtj.bmIdList = [];
            		_this.showOrNot = true;
            	}
                _this.cxtj.bmIdList = [];
            },
            changeDept : function (newValue, oldValue) {
            	var _this = this;
            	_this.cxtj.bmIdList=[];
            	if (newValue.length > 0){
            		 for (var i = 0; i < newValue.length; i++) {
            			 _this.cxtj.bmIdList.push(newValue[i].id);
                     }
            	  }

            },
            /**
             * 操作列--打开不通过原因
             */
            openBtgyy: function (row) {
                this.btgyy = row.btgyy;
                this.$refs.btgyyModel.open();
            },

            /**
             * 查询按钮
             *
             * 根据查询条件获取列表信息
             */
            cxshByCxtj: function () {
            	var _this = this;
                //校验开始时间和结束时间
                if (_this.cxtj.jssqsj !== '' && _this.cxtj.kssqsj !== '') {
                    var end = new Date(_this.cxtj.jssqsj).getTime();
                    var start = new Date(_this.cxtj.kssqsj).getTime();
                    if (end < start) {
                        Artery.notice.warning({
                            title: "申请开始时间不能大于申请结束时间"
                        });
                        return;
                    }
                }

                _this.isFilter = true;
                _this.queryInfo.offset = 0;
                _this.pageOffset = 0;
                _this.currentPageIndex = 1;
               this.$refs.shTabel.reloadData(true);
                if (this.shList.data!=undefined && this.shList.data.length <= 0 ) {
                    this.zwsjShow = true;
                } else {
                    this.zwsjShow = false;
                }
            },

            changeSelect: function (name) {
                console.log('name')
            },
            getRowKey: function (row) {
                return row.name
            },
            /**
             * @Author: wjing
             * @name: clickSh
             * @description: 跳转到审核页面
             * @param {type}
             * @return: {undefined}
             */
            clickSh: function () {
                window.open("../../sh/index.html")
            },
            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param newValue 新选择的节点
             * @param oldValue 上一次选择的节点
             * @return: {undefined}
             */
            selectSqdw: function (newValue, oldValue) {
                var _this = this;
                this.$nextTick(function () {
                    if (_this.sqdw.length == 0) {
                        _this.disabled = true;
                    } else {
                        _this.disabled = false;
                    }
                })
                Artery.ajax.get(_this.hqdwbmUrl, {
                    cropId: newValue.code
                }).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.sqbmList = result.data
                        Artery.notice.success({
                            title: '获取部门数据成功'
                        });
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }

                });
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            // 变换页签
            change: function (pageInfo) {
                var _this = this;
                _this.queryInfo.offset = pageInfo.offset;
                _this.pageOffset = pageInfo.offset;
                _this.currentPageIndex = pageInfo.offset / 10 + 1;
                _this.init();
            },
        },

        mounted: function () {
        },
        created: function () {
            var _this = this;
            this.queryInfo.limit = getLimit();
            window.addEventListener('message', function (evt) {
                var evts = JSON.parse(evt.data);
                if (evts.flag === 'SxDspOpen') {
                    _this.init();
                }
            }, false);
        }
    });
    window.vm = vm;
    return vm;
})
