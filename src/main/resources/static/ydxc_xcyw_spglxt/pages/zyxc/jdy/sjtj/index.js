// 判断是否是ie 浏览器
function isIE() {
    return (!!window.ActiveXObject || "ActiveXObject" in window) ? true : false
}

// 查询记录模块
define(['extend/template1.js'], function (template1) {

    if (isIE()) {
        document.querySelector('html').classList.add('ie');
    }
    new Vue({
        el: '#jsApp',
        mixins: [template1],
        data: {
            //查询条件
            query: {
                startDate: '',
                endDate: '',
                tjfs: '0' //统计方式
            },
            tjfsList: [{
                code: '0',
                name: '单位查询'
            }, {
                code: '1',
                name: '查询项'
            }],
            // 查询单位数据
            dwcxDataList: [],
            // 查询单位总计
            dwcxTotal: {},
            // 查询项数据
            cxxDataList: [],
            // 查询项总计
            cxxTotal: {},
            //点击select列表切换
            currentSelect: '0',
            startime: null,
            endtime: null,
            realStarTime: '',
            realEndTime: '',
            options3: {
                disabledDate: function (date) {
                    return date
                }
            },
            evtDrag: true,
            // 暂无数据是否显示
            zwsjShow: false,
            isKeyCodeShift: false,
            resizeHeight: 0,
            //用来计算高度的
            dataList: []
        },

        mounted: function () {
            var _this = this;
            this.init();
            this.loadPageData();
            // 监听键盘按下的事件
            window.addEventListener('keydown', _this.onKeydownHandler);
            // 监听键盘弹起的事件
            window.addEventListener('keyup', _this.onKeyupHandler);
            // 适应大小屏的滚动条
            this.resizeHeight = $('.fd-content').height();
            window.addEventListener('resize', function () {
                // 适应大小屏的滚动条
                console.log('resize')
                _this.$nextTick(function () {
                    _this.resizeHeight = $('.fd-content').height();
                })
            })
        },
        destroyed: function () {
            var _this = this;
            // // 监听键盘按下的事件
            window.removeEventListener('keydown', _this.onKeydownHandler);
            // 监听键盘弹起的事件
            window.removeEventListener('keyup', _this.onKeyupHandler);
        },
        methods: {
            /**
             * @description 监听鼠标按下的回调函数
             * @name onKeydownHandler
             */
            onKeydownHandler: function (ev) {
                var _this = this;
                var e = ev || window.event;
                // 是否按下shift键
                _this.isKeyCodeShift = e.keyCode === 16
            },
            /**
             * @description 监听键盘弹起的回调函数
             * @name onKeyupHandler
             */
            onKeyupHandler: function (ev) {
                var e = ev || window.event;
                var _this = this;
                // 是否按下shift键
                _this.isKeyCodeShift = false
            },
            /**
             * @author nfj
             * @updateTime 2020-07-13
             * @description 单位查询表格监听滚动条滚动事件
             * */
            scrollDwcxTableEvent: function (top, left) {
                if (this.isKeyCodeShift) {
                    // 获取scrollBar的滚动的左边距
                    var scrollBarLeft = this.$refs.scroll0 && this.$refs.scroll0.horizontalScrollBarPostion;
                    // 表头元素
                    var tableHead = $('.fd-content .fd-table-wraper02 .fd-dwcx-table-th');
                    // 合计，表尾
                    var tableFooter = $('.fd-content .fd-table-wraper .fd-dwcx .fd-dwcx-zj-footer .aty-scroll-area');
                    // 表尾的scrollBar
                    var tableFooterScrollBar = $('.fd-content .fd-table-wraper .fd-dwcx .fd-dwcx-zj-footer .aty-scroll-track-h .aty-scroll-bar');
                    // 兼容shift+滚轮事件拖动表格，表头和表尾一起动，transform:translate()
                    tableHead.css('transform', 'translate(' + left + ')');
                    tableFooter.css('transform', 'translate(' + left + ')');
                    // 滚动条也要一起动
                    tableFooterScrollBar.css('left', scrollBarLeft + '%');
                }
            },
            /*
            * @author whf
            * @updateTime 2020-04-27
            * @description 滚动条滚动后触发(拖动单位查询合计列)
            * @TODO 为了解决，拖拽横向滚动条的时候，头部和尾部都需要滚动
            * */
            scrollLoadingEvent: function (top, left) {
                // 表头元素
                var tableHead = $('.fd-content .fd-table-wraper02 .fd-dwcx-table-th');
                // 主体表格
                var tableBody = $('.fd-content .fd-table-wraper .fd-dwcx .aty-scroll-area');
                // 拖拽横向滚动条的时候，给表头和表尾添加滚动的距离，transform:translate()
                tableHead.css('transform', 'translate(' + left + ')');
                tableBody.css('transform', 'translate(' + left + ')');
            },
            /*
            * @author whf
            * @updateTime 2020-04-28
            * @description 滚动条滚动后触发
            * @TODO 为了解决，如果统计方式中的单位查询横向滚动条拖动到最后，再切换查询项的时候，头部和尾部没有刷新过来的问题
            * */
            scrollLoadingEventCxx: function (top, left) {
                // 表头元素
                var tableHead = $('.fd-content .fd-table-wraper02 .fd-cxx-table-th');
                // 合计，表尾
                var tableFooter = $('.fd-content .fd-table-wraper .fd-zj-footer .aty-scroll-area');
                // 中间的list
                var tableListCon = $('.fd-content .fd-table-wraper .fd-cxx .fd-scroll-01 .aty-scroll-area');
                // 拖拽横向滚动条的时候，给表头和表尾和中间添加滚动的距离，transform:translate()
                tableHead.css('transform', 'translate(' + 0 + ')');
                tableListCon.css('transform', 'translate(' + 0 + ')');
                tableFooter.css('transform', 'translate(' + 0 + ')');
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset: function () {
                this.query = {};
                this.resetDateRange();
                this.query.tjfs = '0';
                this.loadPageData();
            },
            /**
             * 开始时间改变事件
             * @param time
             */
            startimeChange: function (time) {
                if (!time) {
                    return;
                }
                var _this = this;
                if (_this.query.endDate && time > _this.date2Str(_this.query.endDate)) {
                    Artery.message.info("开始时间不能大于结束时间！");
                    _this.query.startDate = _this.realStarTime;
                } else {
                    _this.query.startDate = time;
                    _this.realStarTime = time;
                }
            },

            /**
             * 结束时间改变事件
             * @param time
             */
            endtimeChange: function (time) {
                if (!time) {
                    return;
                }
                var _this = this;
                if (_this.query.startDate && time < _this.date2Str(_this.query.startDate)) {
                    Artery.message.info("结束时间不能小于开始时间！");
                    _this.query.endDate = _this.realEndTime;
                } else {
                    _this.query.endDate = time;
                    _this.realEndTime = time;
                }
            },
            /**
             * 初始化
             */
            init: function () {
                var _this = this;
                _this.resetDateRange();
                this.options3.disabledDate = function (val) {
                    return val && val.valueOf() < Date.parse(_this.query.startDate) - 86400000;
                };
                this.realStarTime = this.query.startDate;
                this.realEndTime = this.query.endDate;
            },
            //合并相同的单位名称
            listHandle: function (list) {
                if (list) {
                    var key;
                    for (var i = 0; i < list.length; i++) {
                        if (i > 0 && list[i]['xcdwid'] === list[i - 1]['xcdwid']) {
                            list[key]['rowspan']++;
                            list[i]['rowspan'] = 1;
                            list[i]['show'] = false;
                        } else {
                            list[i]['rowspan'] = 1;
                            list[i]['show'] = true;
                            key = i;
                        }
                    }
                }
                return list
            },
            scrollUpdate: function () {
                Array.prototype.forEach.call(document.querySelectorAll('.js-fd-table-contain, .js-fd-content-warp'), function (item) {
                    item.scrollTop = 0;
                    item.scrollLeft = 0;
                });
            },
            /**
             *
             * 加载列表数据
             */
            loadPageData: function () {
                var _this = this;

                Artery.axios.post("/api/v1/sjtj/getTjData", _this.query).then(function (result) {
                    if (result.data.success) {
                        // 重置信息
                        _this.zwsjShow = false;
                        _this.dwcxDataList = [];
                        _this.dwcxTotal = 0;
                        _this.cxxDataList = [];
                        _this.cxxTotal = 0;
                        _this.dataList = [];
                        if (_this.query.tjfs === '0') {
                            _this.dwcxDataList = result.data.data.data;
                            _this.dwcxTotal = result.data.data.total;
                            if (_this.dwcxDataList) {
                                if (_this.dwcxDataList.length) {
                                    _this.zwsjShow = false;
                                } else {
                                    _this.zwsjShow = true;
                                }
                            }
                            _this.$nextTick(function () {
                                _this.resizeHeight = $('.fd-content').height();
                            })
                            _this.dataList = _this.dwcxDataList
                            /*
                            * @author whf
                            * @updateTime 2020-04-27
                            * @description 统计方式====》查询单位
                            * TODO 现在切换的是查询单位，如果_this.$refs中存在scroll1，那么需要把当前的scroll的宽度设置为自适应
                            * */
                            if (_this.$refs.scroll1) {
                                _this.$refs.scroll1.$el.firstChild.style.width = "auto"
                            }
                        } else {
                            _this.cxxDataList = _this.listHandle(result.data.data.data);
                            if (_this.cxxDataList) {
                                if (_this.cxxDataList.length) {
                                    _this.zwsjShow = false;
                                } else {
                                    _this.zwsjShow = true;
                                }
                            }
                            _this.cxxTotal = result.data.data.total;
                            _this.$nextTick(function () {
                                _this.resizeHeight = $('.fd-content').height();
                            })
                            _this.dataList = _this.cxxDataList
                            /*
                           * @author whf
                           * @updateTime 2020-04-27
                           * @description 统计方式====》查询项
                           * TODO 现在切换的是查询项，如果_this.$refs中存在scroll0，那么需要把当前的scroll的宽度设置为百分之百
                           * */
                            if (_this.$refs.scroll0 && _this.$refs.scroll0.hasHorizontalScrollBar) {
                                // console.log(_this.$refs.scroll0)
                                _this.$refs.scroll0.$el.firstChild.style.width = "100%"
                            }
                        }
                        _this.currentSelect = _this.query.tjfs;
                        _this.startime = _this.query.startDate;
                        _this.endtime = _this.query.endDate;
                        /*
                          * @author whf
                          * @updateTime 2020-04-27
                          * @description 统计方式====》单位查询或者查询项
                          * TODO 数据加载完成之后，调用滚动条的更新方法
                          * */
                        _this.$nextTick(function () {
                            // console.log(_this.$refs)
                            if (_this.$refs.scroll0) {
                                _this.$refs.scroll0 && _this.$refs.scroll0.update();
                                // console.log(_this.$refs.scroll0.$el.firstChild.style.width)
                            } else {
                                /*
                                 * @author whf
                                 * @updateTime 2020-04-28
                                 * @description 滚动条滚动后触发
                                 * @TODO 为了解决，如果统计方式中的单位查询横向滚动条拖动到最后，再切换查询项的时候，头部和尾部没有刷新过来的问题
                                 * */
                                _this.scrollLoadingEventCxx(0, 0);
                                _this.$refs.scroll1 && _this.$refs.scroll1.update();
                                // console.log(_this.$refs)
                            }
                            _this.scrollUpdate();
                        })
                    } else {
                        _this.zwsjShow = true;
                    }
                })
            },
            /**
             * 日期转字符串
             * @param date
             * @returns {string|*}
             */
            date2Str: function (date) {
                if (Object.prototype.toString.call(date) === "[object Date]") {
                    return this.formatDate(date);
                }
                return date;
            },
            /**
             * 格式化日期
             * @param date
             * @returns {string}
             */
            formatDate: function (date) {
                var month = date.getMonth() + 1;
                var day = date.getDate();
                return date.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
            },

            /**
             * 未反馈下钻
             * @param item
             */
            goDetail: function (item) {
                var url = './wfks/index.html?startDate='
                    + this.date2Str(this.startime) + '&endDate=' + this.date2Str(this.endtime);
                if (item.sjyid) {
                    url += '&sjyId=' + item.sjyid;
                }
                if (item.id) {
                    url += '&sqdw=' + item.id;
                }
                if (item.xcdwid) {
                    url += '&xcdwId=' + item.xcdwid;
                }
                window.open(url, '_self');
            },
            /**
             * 数据统计报表excel导出
             */
            exportExcel: function () {
                var _this = this;
                if (_this.query.tjfs == "") {
                    Artery.message.info("统计方式不得为空，导出报表失败！");
                    return;
                }
                //使用模拟表单方式导出
                var $eleForm = $("<form method='get'></form>");
                $eleForm.attr("action", '/api/v1/sjtj/tjDataExport');
                $eleForm.append($("<input></input>").attr("type", "hidden").attr("name", "tjfs").attr("value", _this.query.tjfs));

                var _startDate, _endDate;


                if (typeof (_this.query.startDate) == 'string') {
                    var date = new Date(Date.parse(_this.query.startDate.replace(/-/g, "/")));
                    _startDate = date;
                } else {
                    _startDate = _this.query.startDate
                }

                if (typeof (_this.query.endDate) == 'string') {
                    var date = new Date(Date.parse(_this.query.endDate.replace(/-/g, "/")));
                    _endDate = date;
                } else {
                    _endDate = _this.query.endDate
                }

                if (_this.query.startDate != "") {
                    $eleForm.append($("<input></input>").attr("type", "hidden").attr("name", "startDate").attr("value", _startDate));
                }
                if (_this.query.endDate != "") {
                    $eleForm.append($("<input></input>").attr("type", "hidden").attr("name", "endDate").attr("value", _endDate));
                }
                $(document.body).append($eleForm);
                //提交表单，实现下载
                $eleForm.submit().remove();
            },
            resetDateRange: function() {
                //下面的时间数据太乱了
                var today = new Date();
                var tomorrow = new Date(today.getTime() - 24*60*60*1000);
                var year = tomorrow.getFullYear();
                var month = tomorrow.getMonth() + 1;
                var day = tomorrow.getDate();
                this.query.startDate = year + '-01-01';
                this.query.endDate = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
            }
        }
    })
});
