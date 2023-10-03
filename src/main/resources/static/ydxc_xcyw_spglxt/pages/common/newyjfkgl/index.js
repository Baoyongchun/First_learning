define(['fdGlobal', 'config', 'fdDataTable', 'scrollbar', 'fdComponent2', "dragFun", 'userBehavior', 'jqueryUi', 'layDate'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     * @param fdDataTable
     */
    function (fdGlobal, config, fdDataTable, scrollbar, fdComponent2, dragFun, userBehavior, jqueryUi, layDate) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var scrollBar1;
        var _vm = new Vue({
            // 控制器id
            el: '#jsAppControllerFkyj',
            // 数据
            data: function () {
                return {

                    //暂无数据是否显示
                    zwsjShow: false,
                    optionKssqsj: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() > new Date(_this.query.endDate).valueOf();
                            }
                        }
                    })(this),
                    optionJssqsj: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() < new Date(_this.query.startDate).valueOf() - 86400000;
                            }
                        }
                    })(this),
                    queryInfo: {},
                    //列表数据
                    shList: [],
                    pageNow: getLimit(),
                    total: 0,
                    currentPageIndex: 1,
                    // 答复内容
                    dfContent: '',
                    // 意见内容
                    yjContent: '',
                    // 判断是答复还是查看详情1是查看详情2是答复
                    type: 1,
                    // 答复内容
                    dfTextarea: '',
                    params: {},
                    query: {
                        startDate: '',
                        endDate: ''
                        //统计方式
                    },
                    wordLength: 0,
                    // table 意见内容
                    tableToolTipIsShow: false,
                    tableToolTipCon: '',
                    _noticeList: []
                }
            },
            destroyed: function () {
                // 取消事件绑定
                // this.unbindEvent();
            },
            // 方法
            methods: {
                // 取消事件绑定
                // unbindEvent: function () {
                //     // 取消绑定表格滑过事件
                //     document.querySelector('#jsShTable').removeEventListener('mouseenter', this.mouseenterTreeHandle, true)
                //     document.querySelector('#jsShTable').removeEventListener('mouseleave', this.mouseenterTreeHandle, true)
                // },
                // 绑定事件
                // bindEvent: function () {
                //     // 绑定表格滑过事件
                //     document.querySelector('#jsShTable').addEventListener('mouseenter', this.mouseenterTreeHandle, true)
                //     document.querySelector('#jsShTable').addEventListener('mouseleave', this.mouseenterTreeHandle, true)
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
                 * 操作列--查看详情
                 */
                openCkxq: function (row) {
                    var _id = row.id;
                    var notice = this._noticeList.filter(function (item) {
                        return item.cxId === _id;
                    })[0];
                    if(notice) {
                        var params = {
                            id: notice.id,
                            readed: notice.readed
                        }
                        var _this = this;
                        $.ajax({
                            type: 'get',
                            url: config.url.frame.updateNoticeStatusUrl,
                            data: params,
                            dataType: "json",
                            success: function (data) {
                                console.info('消息已读：',data);
                                _this.init(_this.queryInfo);
                            }
                        });
                    }
                    this.dfContent = row.reply;
                    this.yjContent = row.content;
                    this.type = 1;
                    this.$refs.fkyjglCkxqModel.open();
                },
                /**
                 * 操作列--答复
                 */
                openDf: function (row) {
                    this.type = 2;
                    this.$refs.fkyjglCkxqModel.open();
                },
                /**
                 * 重置按钮
                 */
                searchReset: function () {
                    this.query = {
                        startDate: '',
                        endDate: ''
                    }
                    this.yjfkcx();
                },
                // 答复确认按钮
                okFkyjglModal: function () {
                    // 关闭
                    this.$refs.fkyjglCkxqModel.close();
                },
                setIndex: function (index) {
                    return (index + 1) + (this.currentPageIndex - 1) * this.pageNow
                },
                /**
                 * 用户输入的方法
                 * @param inputWord
                 */
                inputWord: function () {
                    // 用户输入的长度
                    this.wordLength = this.dfTextarea.length;
                },
                // 提交意见
                submit: function () {
                    var _this = this
                    if(!_this.dfTextarea.length>0){
                    	$.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写意见反馈内容！'
                            },
                            interval: 1000
                        });

                    	return false;
                    }
                    _this.params.content = _this.dfTextarea;
                    Artery.loadPageData("/api/feedback/advice", _this.params).then(function (result) {
                        if (result.success && result.code === "200") {
                            $.alert({
                                type: 'success',
                                info: {
                                    success: '提交成功！'
                                },
                                interval: 1800
                            })
                            _this.dfTextarea = '';
                            _this.init(_this.queryInfo);
                        } else {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '提交失败！'
                                },
                                interval: 1800
                            });
                        }
                    });

                   _this.wordLength=0;
                },
                /**
                 * 查询按钮
                 */
                yjfkcx: function () {
                    this.init(this.queryInfo);
                },


                init: function (queryInfo) {
                    var _this = this;
                    _this.queryInfo = queryInfo;
                    // 获取新的答复消息
                    fdGlobal.initNoticeLogs('7').then(function (res) {
                        console.info(res);
                        _this._noticeList = res.data.filter(function (item) {
                            return item.type === 7;
                        });
                        Artery.loadPageData("/api/feedback/sender/list", _this.queryInfo, _this.query).then(function (result) {
                            if (result.success && result.code === "200") {
                                _this.shList = [];
                                // 根据yjId判断是否显示new图标，并把这条数据放在第一行
                                result.data.data.forEach(function (item) {
                                    if(_this._noticeList.length > 0) {
                                        let _index = _this._noticeList.findIndex(function (_item) {
                                            return _item.cxId === item.id;
                                        })
                                        if(_index > -1) {
                                            item.showNewFlag = true;
                                            _this.shList.unshift(item);
                                        }else {
                                            _this.shList.push(item);
                                        }
                                    }else {
                                        _this.shList.push(item);
                                    }
                                })
                                // 当数据的长度等于0时，暂无数据显示
                                if (_this.shList.length <= 0) {
                                    _this.zwsjShow = true;
                                } else {
                                    _this.zwsjShow = false;
                                }
                                _this.total = result.data.total;
                                _this.$nextTick(function(){
                                    /*_this.$refs.yjfkTableScroll.update();*/
                                })
                                window.opener.postMessage('reload-Message', '*');
                            } else {
                                Artery.notice.error({
                                    title: '请求出错',
                                    desc: result.message || ""
                                });
                            }

                        });
                    });
                },
                // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
                handleChangePageNow: function (page) {
                    this.queryInfo.limit = page.limit;
                    this.queryInfo.offset = page.offset;
                    this.currentPageIndex = page.offset / page.limit+ 1;
                    this.init(this.queryInfo);
                }
            },
            mounted: function () {
                // this.bindEvent();
            }
        });
    });
