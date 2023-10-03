// 查询记录模块
define(['fdGlobal', 'config',  'fdEventBus'],
    function (fdGlobal, config,  fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        new Vue({
            el: '#jsApp',
            data: function() {
                return {
                    name: '模板页面',
                    value: '',
                    // 查看申请表格数据
                    cxsqList: [],
                    //当前页数据量
                    pageNow: '',
                    //总数据量
                    total: 30,
                    progressNum: 0, //进度百分比
                    pageOffset: 0, //分页控件offset
                    //控制表格操作列的显示
                    fdCz: false,
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
                    url: {
                        bhjlUrl: _config.url.frame.bhjl, //查询驳回列表
                    },
                    btgyy:'',
                    scrollbar: null,
                    storage: '',
                    currentPageIndex: 1,
                    // 全部暂无数据是否显示
                    allZwsjShow:false,
                    isShowFilter: '',
                    filterTableName: '全部',
                    flag:'',
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
                var _this = this;
                var params = Artery.parseUrl();
                _this.flag = params.flag;
                _this.queryInfo.limit = getLimit();
            },
            mounted: function () {
                var _this = this;
                //更新滚动条方法 ---表格
                // this.$refs.scrollTable.update();
                this.$nextTick(function(){
                    // 点击出现table的筛选框
                    $('.fd-filter-th .filter-wrap').click(function () {
                        _this.isShowFilter = !_this.isShowFilter;
                    })
                })
            },
            computed: {},
            methods: {
                /**
                 *  @Author wlq
                 * @description 查询条件重置
                 * @name searchReset
                 * @return {*} 无
                 */
                searchReset:function(){
                    // 如果查询条件有值，怎清空后重新请求数据
                    if(this.query.startDate || this.query.endDate || this.query.status || this.query.keyword) {
                        // 信息检索
                        this.query.keyword = '';
                        // 开始时间
                        this.query.startDate = '';
                        // 结束时间
                        this.query.endDate = '';
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
                clickBtgyy: function (row) {
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "CxsqShbtg",
                        _data: {}
                    };
                    // 给首页发消息
                    dataBj._data.reason = row.btgyy;
                    dataBj._data.name = row.ztText;
                    var _data = JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data, '*');
                },
                ckSpd :function(row){
                    if(row.nMgxx==1){
                        if(row.usertype !=1){//敏感信息单子并且不是查询员（不是本人）不可查看审批表
                            Artery.notice.warning({
                                title: '审批单包含敏感信息，无法查看！',
                                desc: ''
                            });
                            return;
                        }
                    }
                    var params = {}
                    if(row.isHaveOfd==2){
                        params = {
                            sqbh: row.sqcxJbxxBh,
                            type: "2",  //1: 地方  2: 中央
                            time: Date.now()
                        }
                    }else {
                        params = {
                            sqbh: row.sqcxJbxxBh,
                            splcId:row.splcId,
                            model:"1",//根据流程id预览指定ofd文件
                            type: "2",  //1: 地方  2: 中央
                            time: Date.now()
                        }
                    }
                    if(this.flag=='zy'){
                        // 请求书生的阅读接口
                        Artery.ajax.get("/api/v1/spb/view", {
                            timeout: 50000,
                            params: params
                        }).then(function (result) {
                            if (result === 'dzurl') {
                                result = '../../../approval/cgdyyl/index.html';
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
                                    cBh: row.sqcxJbxxBh
                                }
                            });
                        })
                    }else{
                        window.open(config.url.frame.ckshbtgtp+ "?splcId=" + row.splcId+"&jbxxCbh="+row.sqcxJbxxBh,"_blank");
                    }
                },
                //加载表单数据
                loadData: function () {
                    var _this = this;
                    Artery.ajax.post(_this.url.bhjlUrl + 'tableInfo', {
                        conditions: _this.query ,
                        queryInfo: _this.queryInfo
                    }).then(function (result) {
                        _this.allZwsjShow = false;
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
                    var _this = this;
                    _this.queryInfo.offset = 0; //表单分页offset
                    _this.pageOffset = 0; //分页控件offset
                },
            }
        })
    });
