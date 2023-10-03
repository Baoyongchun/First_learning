// 查询记录模块
define(['fdGlobal', 'config', '', 'fdEventBus'],
    function (fdGlobal, config, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        new Vue({
            el: '#jsApp',
            data: function() {
                return {
                    name: '模板页面',
                    value: '',
                    // 查看申请表格数据
                    cxsqList: [],
                    // 反馈进度数据
                    fkjdData: {},
                    //当前页数据量
                    pageNow: '',
                    //总数据量
                    total: 30,
                    progressNum: 0, //进度百分比
                    pageOffset: 0, //分页控件offset
                    //控制表格操作列的显示
                    fdCz: false,
                    isFilter: false,
                    currBh: '',
                    approvalMethodType:'online',
                    queryInfo: {
                        limit: 10,
                        offset: 0,
                        splitPage: true
                    },
                    //查询条件
                    query: {
                        endDate: '', //申请结束时间
                        startDate: '', //申请开始时间
                        keyword: '', //检索关键词，
                        status: [8,9], //申请状态(多选)
                        cXsxx: 0 //线上线下（1：线下2：线上，0：所有）
                    },

                    dateOptions: {
                        language: 'zh-CN',
                        format: 'yyyy-mm-dd',
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        startDate: fdGlobal.startDate, //设置最小日期
                        endDate: '', //设置最大日期
                        todayHighlight: 1,
                        startView: 2,
                        minView: 2, //Number, String. 默认值：0, 'hour' 日期时间选择器所能够提供的最精确的时间选择视图。
                        forceParse: true
                    },
                    pageUrl: {
                        ckspbUrl: '../../../approval/cgdyyl/index.html', //查看审批单
                        cxjgUrl: '../cxsq/cxjg/index.html', //查询结果
                        xjspbUrl: '../../../approval/xjspb/index.html', //新建审批单
                    },

                    codeType: {
                        spdStatus: '1028'
                    },
                    scrollbar: null,
                    storage: '',
                    currentPageIndex: 1,
                    // 全部暂无数据是否显示
                    allZwsjShow:false,
                    isShowFilter: '',
                    filterTableName: '全部',
                    filterList: [
                        {key: 0, name: '全部'},
                        {key: 2, name: '线上'},
                        {key: 1, name: '线下'}
                    ],
                    selectedYy: '',
                    optionStartDate: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() > new Date(_this.query.endDate).valueOf();
                            }
                        }
                    })(this),
                    optionEndDate: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() < new Date(_this.query.startDate).valueOf() - 86400000;
                            }
                        }
                    })(this)
                }
            },
            // 创建
            created: function () {
                this.queryInfo.limit = getLimit();
            },
            mounted: function () {
                var _this = this;
                this.$nextTick(function(){
                    $('.fd-filter-th .filter-wrap').click(function () {
                        _this.isShowFilter = !_this.isShowFilter;
                    })
                })
            },
            computed: {},
            methods: {
                // 点击筛选的下拉框里面的值
                clickFilter: function(item) {
                    // 获取选中的值
                    this.filterTableName = item.name;
                    this.query.cXsxx = item.key;
                    // 隐藏下拉框
                    this.isShowFilter = false;
                    this.isFilter = true;
                    // 调用请求表格的方法，得到对应的数据，（需要组装参数，线上还是线下还是全部）
                    this.refreshForm();
                },
                /**
                 *  @Author wlq
                 * @description 查询条件重置
                 * @name searchReset
                 * @return {*} 无
                 */
                searchReset:function(){
                    // 如果查询条件有值，怎清空后重新请求数据
                    if(this.query.startDate || this.query.endDate || this.query.keyword) {
                        // 信息检索
                        this.query.keyword = '';
                        // 开始时间
                        this.query.startDate = '';
                        // 结束时间
                        this.query.endDate = '';
                        //线上线下
                        this.query.cXsxx= 0;
                        this.filterTableName = "全部";
                        // 设置offset为0
                        this.queryInfo.offset =0;
                        // 设置当前页
                        this.currentPageIndex = 1;
                        // 重新调用接口
                        this.refreshForm();
                    }
                },
                setIndex: function (index) {
                    return (index + 1) + (this.currentPageIndex - 1) * getLimit();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 修改反馈进度对应class名
                 */
                changeClass: function (val) {
                    if (val) {
                        if (val === '无') {
                            // 无反馈进度
                            return 'fd-td-fkjd-wu'
                        } else if (val.indexOf('100') > -1) {
                            // 反馈进度100%
                            return 'fd-td-fkjd-over'
                        } else {
                            // 反馈进度0-99%
                            return 'fd-td-fkjd-more'
                        }
                    }
                },

                //反馈进度弹窗
                openModalFkjd: function (bh, jd, cxh) {
                    if (jd === '无') {
                        return;
                    }
                    window.location.href = "./cxjd/index.html?bh=" + bh + "&jd=" + jd + "&cxh=" + cxh;
                },

                //加载表单数据
                loadData: function () {
                    console.log("enter loadData method");
                    var _this = this;
                    var _data = _this.isFilter ? _this.query : {status: [8,9]};
                    console.log('loadData', _data);
                    Artery.ajax.post(_config.url.frame.serverlUrlCxJg + '?v=' + new Date().getTime(), {
                        conditions: _data,
                        queryInfo: _this.queryInfo
                    }).then(function (result) {
                        _this.allZwsjShow = false;
                        // 如果用户选中的是全部的话
                        if (_this.filterTableName === '全部') {
                            if (result.data.length <= 0 ) {
                                // 当数据的长度等于0时，暂无数据显示
                                _this.allZwsjShow = true;
                            } else {
                                for (var i = 0; i < result.data.length; i++) {
                                    result.data[i].submitSpbBtnLoading = false;
                                    result.data[i].submitSpbBtnText = "生成审批表";
                                }
                            }
                        }
                        _this.cxsqList = result.data;
                        _this.pageNow = _this.cxsqList.length;
                        _this.total = result.total;
                    });
                },
                // 变换页签
                change: function (pageInfo) {
                    var _this = this;
                    _this.queryInfo.offset = pageInfo.offset;
                    _this.pageOffset = pageInfo.offset;
                    _this.queryInfo.limit = pageInfo.limit;
                    _this.currentPageIndex = pageInfo.offset / pageInfo.limit + 1;
                    _this.loadData();
                },

                //条件查询
                commit: function () {
                    var _this = this;
                    //校验开始时间和结束时间
                    if (_this.query.endDate !== '' && _this.query.startDate !== '') {
                        var end = new Date(_this.query.endDate).getTime();
                        var start = new Date(_this.query.startDate).getTime();
                        if (end < start) {
                            Artery.notice.warning({
                                title: "申请开始时间不能大于申请结束时间"
                            });
                            return;
                        }
                    }
                    // 设置offset为0
                    _this.queryInfo.offset =0;
                    // 设置当前页
                    _this.currentPageIndex = 1;

                    _this.isFilter = true;
                    _this.resetPageInfo();
                    _this.loadData();
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "CxsqCx",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data, '*');

                },

                //重置分页信息
                resetPageInfo: function () {
                    console.log("enter resetPageInfo method");
                    var _this = this;
                    _this.queryInfo.offset = 0; //表单分页offset
                    _this.pageOffset = 0; //分页控件offset
                },
                //刷新表单
                refreshForm: function () {
                    console.log("enter refreshForm method");
                    var _this = this;
                    _this.resetPageInfo();
                    _this.loadData();
                },

                //跳转查看结果页
                gotoCkjg: function (bh, jd, cxh) {
                    var _this = this;
                    // 变为已读
                    Artery.ajax.get(_config.url.frame.serverUrlCxJgYd, {
                        params: {
                            bh: bh,
                        }
                    }).then(function(result) {
                        var pMessage = {
                            message: 'shy-cxjg'
                        };
                        window.parent.postMessage(pMessage, '*');
                        _this.refreshForm();
                        Artery.open({
                            targetType: '_blank',
                            url: '../cxsq/cxjg/index.html',
                            params: {
                                id: bh
                            }
                        })
                    });
                }
            }
        })
    });
