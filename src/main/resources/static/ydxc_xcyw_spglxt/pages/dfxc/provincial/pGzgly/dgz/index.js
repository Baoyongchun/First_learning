// 查询记录模块
define(['config', 'fdGlobal'], function (config, fdGlobal) {
    var vm = new Vue({
        el: '#jscxsqgzDgz',
        mixins: [],
        data: function () {
            return {
                pageshow:true,
                currentPage:1,
                /// 申请单位
                sqdw: '',
                // 申请单位列表
                sqdwList: [],
                // 申请部门列表
                sqbmList: [],
                // 状态
                zt: '',
                // 状态列表
                ztList: [{
                    code: 1,
                    name: '待盖章',
                }, {
                    code: 2,
                    name: '已盖章',
                }, {
                    code: 3,
                    name: '不予盖章',
                }],
                xxjs: '',
                //列表数据
                shList: [],
                pageNow: getLimit(),
                total: 0,
                //artery封装查询对象
                queryInfo: {},
                //查询条件
                cxtj: {
                    //状态
                    zt: '1',
                    //申请单位
                    sqdw: "",
                    //申请部门 @Version 3.2.6  ""改为[]
                    sqbm: [],
                    //开始日期
                    kssqsj: "",
                    //结束日期
                    jssqsj: "",
                    //信息检索
                    xxjs: ""
                },
                //盖章页面
                gzUrl: '../../../provincial/pGzgly/dgz/gz/index.html',
                //线上数据盖章页面
                xsgzUrl: '../../../provincial/pGzgly/dgz/xsgz/index.html',
                // 默认申请部门不可选
                disabled: false,
                //获取查询盖章数据
                cxgzlbUrl: config.url.frame.cxgzlbUrl,
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
                            return date && date.valueOf() < new Date(_this.cxtj.kssqsj).valueOf() - 86400000;
                        }
                    }
                })(this),
                currentPageIndex:1,
                //暂无数据是否显示
                zwsjShow: false,
                // 线上线下的暂无数据的显示隐藏
                xsOrXxZwsjShow: false,
                isShowFilter: false,
                filterTableName: '全部',
                filterList: [
                    {key: 0, name: '全部'},
                    {key: 2, name: '线上'},
                    {key: 1, name: '线下'}
                ],
                // @version 3.2.6 添加
                bm : ''
            }
        },
        methods: {
            // 点击筛选的下拉框里面的值
            clickFilter: function(item) {
                // 获取选中的值
                this.filterTableName = item.name;
                this.cxtj.cXsxx = item.key;
                // 隐藏下拉框
                this.isShowFilter = false;
                // 调用请求表格的方法，得到对应的数据，（需要组装参数，线上还是线下还是全部）
                this.init(this.queryInfo);
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 如果查询条件有值，怎清空后重新请求数据
                if(this.cxtj.sqbm || this.cxtj.sqbm || this.cxtj.xxjs || this.cxtj.cxh || this.cxtj.kssqsj || this.cxtj.jssqsj) {
                    // 申请单位 @Version 3.2.6 添加
                    this.cxtj.sqdw = '';
                    // 申请部门 @Version 3.2.6  ""改为[]
                    this.cxtj.sqbm = [];
                    // 开始时间
                    this.cxtj.kssqsj = '';
                    // 结束时间
                    this.cxtj.jssqsj = '';
                    // 信息检索
                    this.cxtj.xxjs = '';
                    //线上线下
                    this.cxtj.cXsxx= 0;
                    this.filterTableName = "全部";
                }
                this.queryInfo.limit = getLimit();
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                // 重新调用接口
                this.init(this.queryInfo);

            },
            setIndex: function(index) {
                return (index + 1) + (this.currentPageIndex - 1) * getLimit();
            },
            /**
             * 结束申请时间change事件
             */
            jssqsjChange: function (date) {
                if (new Date(this.cxtj.kssqsj) > new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    })
                    this.cxtj.jssqsj = "";
                }
            },
            /**
             * 初始化列表信息
             * @param queryInfo
             */
            init: function (queryInfo) {
                var _this = this;
                this.queryInfo = queryInfo;
                // @Version 3.2.6 添加处理部门
                var bm = '';
                if(typeof this.cxtj.sqbm == 'object'){
                    for (var i = 0; i < this.cxtj.sqbm.length; i++) {
                        bm += (this.cxtj.sqbm[i] + ',')
                    }
                }
                //由于组织树的数据可能有前缀（corp_、user_、……），此处查询前对参数进行处理，去掉前缀
                var param = JSON.parse(JSON.stringify(this.cxtj));//深克隆对象
                if(this.cxtj.sqdw.indexOf("_")!=-1)
                {
                    param.sqdw = this.cxtj.sqdw.split("_")[1];
                }
                param.sqbm = bm;
                Artery.loadPageData(this.cxgzlbUrl, this.queryInfo, param).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.shList = result.data.data;
                        if (_this.filterTableName === '全部') {
                            // 当数据的长度等于0时，暂无数据显示
                            if (_this.shList.length <= 0 ) {
                                _this.zwsjShow = true;
                            } else {
                                _this.zwsjShow = false;
                            }
                        } else {
                            _this.zwsjShow = false;
                            // 当数据的长度等于0时，暂无数据显示
                            if (_this.shList.length <= 0 ) {
                                _this.xsOrXxZwsjShow = true;
                            } else {
                                _this.xsOrXxZwsjShow = false;
                            }
                        }
                        _this.total = result.data.total;
                        var pMessage = {
                            message: 'gzgly-dgz',
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
             * 操作列--盖章
             */
            openGz: function (row) {
                // window.open(this.gzUrl, '_blank');
                var url = this.gzUrl;
                //1:线下审批2:线上审批
                if(row.xsxx && row.xsxx == 2)
                {
                    url = this.xsgzUrl;
                }
                Artery.open({
                    targetType: '_blank',
                    url: url,
                    params: {
                        bh: row.bh,
                        sqbs: row.sqbs
                    }
                })
            },
            /**
             * 查询按钮
             *
             * 根据查询条件获取列表信息
             */
            cxshByCxtj: function () {
                // 设置offset为0
                this.queryInfo.offset =0;
                // 设置当前页
                this.currentPageIndex = 1;
                this.init(this.queryInfo);
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.currentPageIndex = page.offset / page.limit + 1;
                this.init(this.queryInfo);
            },
        },
        mounted: function () {
            var _this = this;
            this.$nextTick(function(){
                // 点击出现table的筛选框
                $('.fd-filter-th .filter-wrap').click(function () {
                    _this.isShowFilter = !_this.isShowFilter;
                })
            })
        },
        // @Version 3.2.6 添加 computed
        computed: {
            deptRootId: function () {
                this.cxtj.sqbm = [];
                if (this.cxtj.sqdw) {
                    if (this.cxtj.sqdw instanceof Array) {
                        return this.cxtj.sqdw[0];
                    } else {
                        return this.cxtj.sqdw;
                    }
                }
                return '';
            },
            deptDisabled: function () {
                return !this.cxtj.sqdw;
            }
        },
        created: function () {
            var _this = this;
            window.addEventListener('message', function (evt) {
                var evts = JSON.parse(evt.data);
                if (evts.flag === 'SxDgzOpen') {
                    _this.init(_this.queryInfo);
                }
            }, false);
        }
    });
    window.vm = vm;
    return vm;
})
