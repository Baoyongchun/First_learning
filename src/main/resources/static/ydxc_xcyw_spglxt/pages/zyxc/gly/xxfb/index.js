/*
 * @Author: DengShuai
 * @Date: 2021-04-01
 * @LastEditors: DengShuai
 * @LastEditTime: 2021-04-01
 * @Description: 消息通知
 */
define(['fdEventBus', 'config', 'fdGlobal', 'Promise'], function (fdEventBus, config, fdGlobal, Promise) {
    new Vue({
        el: '#jsAppControllerXxfb',
        data: function () {
            return {
                pageshow:true,
                // 状态列表
                ztList: [
                    {
                        code: '1',
                        codeType: '1004',
                        name: '已发布'
                    },{
                        code: '2',
                        codeType: '1004',
                        name: '待发布'
                    }
                ],
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
                    // 关键字
                    bt: '',
                    // 状态
                    zt: '',
                    //开始日期
                    fbsjks: '',
                    //结束日期
                    fbsjjs: '',
                    sort: '-DT_FBSJ'
                },
                xxfbForm : {
                    JSF: [], // 选择单位
                    JSJS: ['01'],// 选择角色
                    BT: '', // 标题
                    NR: '',// 内容
                    JSR: [],
                    deptRootId: 'jsjs:01'
                },
                // 默认申请部门不可选
                disabled: false,
                optionKssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.fbsjjs).valueOf();
                        }
                    }
                })(this),
                optionJssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.fbsjks).valueOf() - 86400000;
                        }
                    }
                })(this),
                currentPageIndex: 1,
                //暂无数据是否显示
                zwsjShow: false,
                // table 意见内容或者答复内容的重写title是否显示
                tableToolTipIsShow: false,
                // title 的内容
                tableToolTipCon: '',
                dataList: [{
                    code: '01',
                    codeType: 'jsjs',
                    name: '查询员'
                }/*, {
                    code: '02',
                    codeType: 'jsjs',
                    name: '审批员'
                }, {
                    code: '03',
                    codeType: 'jsjs',
                    name: '公章管理员'
                }*/, {
                    code: '04',
                    codeType: 'jsjs',
                    name: '审核员'
                }, {
                    code: '05',
                    codeType: 'jsjs',
                    name: '监督员'
                }, {
                    code: '06',
                    codeType: 'jsjs',
                    name: '系统管理员'
                }, {
                    code: '08',
                    codeType: 'jsjs',
                    name: '审核监督员'
                }],
                delRow: {},
                isClick: true
            }
        },
        destroyed: function () {
            // 取消事件绑定
            // this.unbindEvent();
        },
        methods: {
            /**
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset: function () {
                // 如果查询条件有值，怎清空后重新请求数据
                this.cxtj.bt = '';
                this.cxtj.zt = '';
                this.cxtj.fbsjks = '';
                this.cxtj.fbsjjs = '';
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
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
                    var _params = {};
                    for(var _key in _this.queryInfo){
                        _params[_key] = _this.queryInfo[_key];
                    }
                    for(var _key in _this.cxtj){
                        _params[_key] = _this.cxtj[_key];
                    }
                    Artery.ajax.get("/api/v1/tzxx/page", {
                        params: _params
                    }).then(function (result) {
                        if(result.code) {
                            Artery.notice.error({
                                title: '查询失败！'
                            });
                            return;
                        }
                        _this.shList = result.data;
                        _this.shList.forEach(function (item) {
                            item.jsjsTranslateText = fdGlobal.translateFsdx2Name(item.JSJS);
                            if(item.FBSJ) {
                                item.fbsjTranslateText = item.FBSJ.replace('T', ' ').slice(0, -4);
                            }
                        })
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.shList.length <= 0) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
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
            // 发布消息通知
            fbxxtz: function () {
                var _this = this;
                _this.disabled = false;
                _this.xxfbForm = {
                    JSF: [], // 选择单位
                    JSJS: ['01'],// 选择角色
                    BT: '', // 标题
                    NR: '', // 内容
                    JSR: [],
                    deptRootId: 'jsjs:01'
                };
                _this.$refs.fbxxtzModel.open();
            },
            // 查询消息发布
            cxXxfb: function () {
                this.init(this.queryInfo);
            },
            xxfbFormValidate: function(_params) {
                var isSuccess = false;
                if(_params.BT == ''){
                    isSuccess = true;
                }
                return isSuccess;
            },
            xxfbJSJSJGRValidate: function(_params) {
                var isSuccess = false;
                if(!_params.JSJS.length && !_params.JSR.length) {
                    isSuccess = true;
                }
                return isSuccess;
            },
            saveXxThrottle: function(val) {
                var _this = this;
                if(_this.isClick) {
                    _this.isClick = false;
                    _this.saveXx(val);
                    //定时器
                    setTimeout(function() {
                        _this.isClick = true;
                    }, 2000);//一秒内不能重复点击

                }
            },
            // 保存消息 2为暂存 1为发布
            saveXx: function (type) {
                var _this = this;
                // 做深拷贝
                var _params = {};
                for(var _key in _this.xxfbForm){
                    _params[_key] = _this.xxfbForm[_key];
                }
                var _method = 'put';
                _params.JSF = _params.JSF.join(';');
                _params.JSJS = _params.JSJS.join(';');
                _params.JSR = _params.JSR.join(';');
                // 通过判断参数里面是否有ID，来决定是否是修改操作
                if(!_params.ID) {
                    _method = 'post';
                }
                if(_this.xxfbFormValidate(_params)) {
                    Artery.notice.warning({
                        title: '必填项不能为空！'
                    });
                    return;
                }
                if(_this.xxfbJSJSJGRValidate(_params)) {
                    Artery.notice.warning({
                        title: '角色和人员至少选择一个！'
                    });
                    return;
                }
                // 根据type判断是暂存还是发布
                _params.ZT = type;
                Artery.ajax[_method]('/api/v1/tzxx', _params).then(function () {
                    _this.init(_this.queryInfo).then(function (res) {
                        Artery.notice.success({
                            title: '操作成功！'
                        });
                        _this.$refs.fbxxtzModel.close();
                    });
                }).catch(function (err) {
                    console.info(err);
                });
            },
            // 删除消息
            deleteXX: function () {
                var _this = this;
                var row = _this.delRow;
                _this.delRow = {};
                Artery.ajax.delete('/api/v1/tzxx/' + row.ID).then(function () {
                    Artery.notice.success({
                        title: '删除成功！'
                    });
                    _this.init(_this.queryInfo);
                    _this.$refs.scxxModel.close();
                }).catch(function (err) {
                    Artery.notice.error({
                        title: '删除失败！'
                    });
                })
            },
            // 修改消息
            editXX: function (row) {
                var _this = this;
                _this.$nextTick(function () {
                    _this.disabled = row.ZT == 1;
                })
                _this.xxfbForm = JSON.parse(JSON.stringify(row));
                _this.xxfbForm.JSF = _this.xxfbForm.JSF.split(';');
                _this.xxfbForm.JSJS = _this.xxfbForm.JSJS.split(';');
                _this.xxfbForm.JSR = _this.xxfbForm.JSR.split(';');
                var jsf = '';
                for (var i = 0; i < _this.xxfbForm.JSF.length; i++) {
                    jsf += _this.xxfbForm.JSF[i] + ',';
                }
                if(jsf !=''){
                    jsf = jsf.substring(0,jsf.length-1);
                }
                var jsjs = '';
                for (var i = 0; i < _this.xxfbForm.JSJS.length; i++) {
                    jsjs += _this.xxfbForm.JSJS[i] + ',';
                }
                if(jsjs !=''){
                    jsjs = jsjs.substring(0,jsjs.length-1)
                }
                _this.xxfbForm.deptRootId = "jsf:" + jsf + ";jsjs:" + jsjs
                _this.$refs.fbxxtzModel.open();
            },
            scxxModalOpen: function(row) {
                var _this = this;
                _this.delRow = row;
                _this.$refs.scxxModel.open();
            },
            selectDw: function(newValue) {
                var _this = this;
                var jsf = '';
                for (var i = 0; i < _this.xxfbForm.JSF.length; i++) {
                    jsf += _this.xxfbForm.JSF[i] + ',';
                }
                if(jsf !=''){
                    jsf = jsf.substring(0,jsf.length-1);
                }
                var jsjs = '';
                for (var i = 0; i < _this.xxfbForm.JSJS.length; i++) {
                    jsjs += _this.xxfbForm.JSJS[i] + ',';
                }
                if(jsjs !=''){
                    jsjs = jsjs.substring(0,jsjs.length-1)
                }
                _this.xxfbForm.JSR = [];
                _this.xxfbForm.deptRootId = "jsf:" + jsf + ";jsjs:" + jsjs
                console.log(_this.xxfbForm);
            }
        },
        created: function () {
            var _this = this;
            this.pageNow = getLimit();
        },
        mounted: function () {
            // 绑定事件
            // this.bindEvent();
        }
    })
});
