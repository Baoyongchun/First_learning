/*
 * @Author: nfj
 * @Date: 2020-05-07
 * @LastEditors: nfj
 * @LastEditTime: 2020-05-07
 * @Description: 反馈意见管理
 */
define(['fdEventBus', 'extend/template1.js', 'fdGlobal', 'config'], function (fdEventBus, template1, fdGlobal, config) {

    new Vue({
        el: '#jsAppControllerFkyjgl',
        mixins: [template1],
        data: function () {
            return {
                pageshow:true,
                /// 申请单位
                sqdw: [],
                // 申请单位列表
                sqdwList: [],
                // 申请部门列表
                sqbmList: [],
                // 状态
                zt: '',
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
                    //申请单位
                    corpId: '',
                    //申请部门
                    deptId: '',
                    //开始日期
                    endDate: "",
                    //结束日期
                    startDate: ""
                },
                // 默认申请部门不可选
                disabled: false,
                optionKssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.endDate).valueOf();
                        }
                    }
                })(this),
                optionJssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.startDate).valueOf() - 86400000;
                        }
                    }
                })(this),
                currentPageIndex: 1,
                //暂无数据是否显示
                zwsjShow: false,
                // table 意见内容或者答复内容的重写title是否显示
                tableToolTipIsShow: false,
                // title 的内容
                tableToolTipCon: ''
            }
        },
        destroyed: function () {
            // 取消事件绑定
            // this.unbindEvent();
        },
        methods: {
            // 取消事件绑定
            // unbindEvent: function () {
            //     // 取消绑定表格滑过事件
            //     document.querySelector('#jsShTabel').removeEventListener('mouseenter', this.mouseenterTreeHandle, true)
            // },
            // 绑定事件
            // bindEvent: function () {
            //     // 绑定表格滑过事件
            //     document.querySelector('#jsShTabel').addEventListener('mouseenter', this.mouseenterTreeHandle, true)
            // },
            // 鼠标进入事件
            // mouseenterTreeHandle: function (event) {
            //     var _this = this;
            //     var _target = event.target;
            //     _this.tableToolTipCon = '';
            //     // 查找目标节点
            //     if (_target.className.indexOf('cell') !== -1 && _target.className.indexOf('th') === -1) {
            //         if (_target.parentElement.getAttribute('class').indexOf('fd-title-word') !== -1) {
            //             if (_target.getAttribute('date')) {
            //
            //             } else {
            //                 _target.setAttribute('date', _target.getAttribute('title'));
            //             }
            //             _target.removeAttribute('title');
            //             var titleCon = _target.getAttribute('date');
            //             _this.tableToolTipCon = titleCon;
            //             $('.fd-title-tooltip').css({
            //                 'top': event.clientY + 8,
            //                 'left': event.clientX + 8
            //             })
            //             _this.tableToolTipIsShow = true;
            //         }
            //     } else {
            //         _this.tableToolTipIsShow = false;
            //     }
            // },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset: function () {
                // 如果查询条件有值，怎清空后重新请求数据
                this.cxtj.corpId = '';
                this.cxtj.deptId = '';
                this.cxtj.startDate = '';
                this.cxtj.endDate = '';
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.init(this.queryInfo);
                // this.cxshByFkyjgl();
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
                _this.queryInfo = queryInfo;
                Artery.loadPageData("/api/feedback/receiver/list", this.queryInfo, this.cxtj).then(function (result) {
                    if (result.success && result.code === "200") {

                        _this.shList = result.data.data;
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.shList.length <= 0) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }

                        _this.total = result.data.total;
                        var pMessage = {
                            message: 'zy-zyxtgly-fkyjgl',
                            count: _this.total
                        }
                        window.parent.postMessage(pMessage, '*');
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                });
            },

            /**
             * 操作列--查看详情
             */
            openCkxq: function (row) {
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "fkyjglCkxq",
                    type: 1,
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = row;
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
            },
            /**
             * 操作列--答复
             */
            openDf: function (row) {
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "fkyjglCkxq",
                    type: 2,
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = row;
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
            },

            /**
             * 查询按钮
             *
             * 根据查询条件获取列表信息
             */
            cxshByFkyjgl: function () {
                this.$refs.shTabel.reloadData(true);
                this.zwsjShow = !this.shList.data || this.shList.data.length === 0;
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.currentPageIndex = page.offset / page.limit + 1;
                this.init(this.queryInfo);
            }
        },
        created: function () {
            var _this = this;
            this.pageNow = getLimit();
            fdEventBus.$on('appUpdateFkyjgl', function (data) {
                _this.init(_this.queryInfo);
            });
        },
        mounted: function () {
            // 绑定事件
            // this.bindEvent();
        },
        computed: {
            deptRootId: function () {
                this.cxtj.deptId='';
                if (this.cxtj.corpId) {
                    if (this.cxtj.corpId instanceof Array) {
                        return this.cxtj.corpId[0];
                    } else {
                        return this.cxtj.corpId;
                    }
                }
                return '';
            },
            deptDisabled: function () {
                return !this.cxtj.corpId;
            }
        }
    })
});
