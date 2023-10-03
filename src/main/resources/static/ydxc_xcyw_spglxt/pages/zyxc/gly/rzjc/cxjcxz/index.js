// 查询记录模块
define(['extend/template1.js','jquery','fdEventBus','config'],
    function (template1,jquery,fdEventBus,_config) {
    new Vue({
        el: '#jscxjc',
        mixins: [template1],
        data: function () {
            return {
                loginPersonRole: _config.url.frame.loginPerson,
                pageshow:true,
                showAll:false,
                showCxz:true,
                // 申请单位
                sqdw: [],
                // 申请单位列表
                sqdwList: [],
                // 申请部门
                sqbm: [],
                // 申请部门列表
                sqbmList: [],
                // 协查单位
                xcdw: '',
                // 查询项
                cxx: '',
                // 异常标识
                ycbs: '',
                // 超时标识
                csbs: '',
                // 协查单位列表
                xcdwList: [],
                // 查询项列表
                cxxList: [],
                // 异常标识列表
                ycbsList: [{
                    code: '1',
                    name: '正常'
                }, {
                    code: '2',
                    name: '异常'
                }],
                // 状态列表
                sfyfkList: [{
                    code: '1',
                    name: '已反馈'
                }, {
                    code: '2',
                    name: '未反馈'
                }],
                // 超时标识
                csbsList: [{
                    code: '0',
                    name: '超时'
                }, {
                    code: '1',
                    name: '未超时'
                }],
                //信息检索
                xxjs: '',
                shList: {
                    data: [

                    ],
                    customData: {},
                    limit: getLimit(),
                    offset: 0,
                    total: 10
                },
                pageNow: 20,
                total: 30,
                // 默认申请部门不可选
                disabled: true,
                queryInfo: {},
                //查询条件
                cxtj: {
                    bh:'',
                    zt:'',
                    sqdw: '',
                    cxx: '',
                    ycbs: '',
                    csbs: '',
                    //信息检索
                    xxjs: '',
                    //时间戳
                    time: '',
                    cXzdwbm: '',
                    startDate: '',
                    endDate: '',
                    cSjyId:[],
                },
                cxh:"",
                query:{
                    // 分页数据
                    pageNow: 1,
                    pageSize: 10,
                    offset:0,
                    currentSize:''
                },
                // 树的数据
                data2: (function (len) {
                    var _data = [];
                    var k = 0;
                    for (var i = 0; i < len; i++) {
                        k++;
                        _data.push({
                            name: '一级 ' + k,
                            id: '' + k,
                            open: true,
                            children: [{
                                id: k + '-' + k,
                                name: '二级 ' + k + '-' + k,
                                open: true,
                                children: [{
                                    icon: '/src/components/css/images/treeIcon/avatar.png',
                                    id: k + '-' + k + '-' + k,
                                    open: true,
                                    name: '三级 ' + k + '-' + k + '-' + k,
                                    children: [{
                                        icon: '/src/components/css/images/treeIcon/avatar.png',
                                        id: k + '-' + k + '-' + k + '-' + k,
                                        name: '三级 ' + k + '-' + k + '-' + k + '-' + k,
                                        draggable: false
                                    }, {
                                        icon: '/src/components/css/images/treeIcon/avatar.png',
                                        id: k + '-' + k + '-' + k + '-' + k + '2',
                                        name: '三级 ' + k + '-' + k + '-' + k + '-' + k + '2',
                                        draggable: false
                                    }]
                                }]
                            }]
                        })
                    }
                    return _data;
                })(3),
                // 重发行数的信息
                row:'',
                evtDrag:true,
                //查询项框是否可选
                isDisabled: true,
                cXzdwbm: '',
                cXcdwName: '',
                cSjyId:[],
                xcdwShow: false,
                cxxShow: false,
                initSort: true
            }
        },
        methods: {
            headerCellClassName: function(rowItem) {
                if (this.initSort && rowItem.column.property === 'xcdw') {
                    return 'descending'
                }
            },
            //跳转到详情
            goTockxq: function (cCid,cZipName,dRtime) {
                var _this = this;
                Artery.open({
                    targetType: '_self',
                    url: '../rzjcnode/index.html',
                    params: {
                        eLogType:'01',
                        eResultRecordCid: cCid,
                        cZipName:cZipName,
                        dRtime:dRtime
                    }
                });
            },

            selectDcsjStart: function (date) {
                if (new Date(this.cxtj.endDate) < new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    });
                    this.cxtj.startDate = "";
                }
            },
            selectDcsjEnd: function (date) {
                if (new Date(this.cxtj.startDate) > new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    });
                    this.cxtj.endDate = "";
                }
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                this.cxtj.sqdw = '';
                this.cxtj.cxx = '';
                this.cxtj.ycbs = '';
                this.cxtj.sfyfk = '';
                this.cxtj.xxjs = '';
                this.cXzdwbm = '';
                this.cSjyId = [];
                this.query.pageNow = 1;
                this.query.offset = 0;
                this.queryInfo.offset = this.query.offset;
                this.queryInfo.limit = this.query.pageSize;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.queryInfo.sortList = [{column: 'fksj', dir: 'desc'}];//默认排序方式--改成时间
                this.$refs.cxjcTable.clearSort();
                this.initSort = true;
                this.selectCxjc(this.queryInfo);
                this.isDisabled = true;
            },

            /*滚动条滑动*/
            scrollLeft:function(top,left) {
                var tableHead = $('.fd-table-header .aty-table__header-wrapper .aty-table__header');
                if(this.evtDrag) {
                    tableHead.addClass('fd-scrollbar-transition');
                }
                tableHead.css('transform','translate('+left+')');
            },

            /**
             * @Author: wjing
             * @name: goBack
             * @description: 返回到查询监测
             * @param {}
             * @return: {undefined}
             */
            goBack: function () {
                window.location.href = '../index.html'
            },


            /**
             * @Author: wjing
             * @name: clickCx
             * @description: 点击查询
             * @param {type}
             * @return: {undefined}
             */
            clickCx: function () {
                var _this = this;
                _this.queryInfo.offset = 0;
                _this.queryInfo.limit = _this.query.pageSize;
                // 查询后从第一页开始显示
                _this.query.pageNow = Math.ceil((_this.queryInfo.offset + 1) / _this.queryInfo.limit);
                this.$refs.cxjcTable.clearSort();
                this.queryInfo.sortList = [{column: 'fksj', dir: 'desc'}];
                this.initSort = true;
                _this.selectCxjc(_this.queryInfo);
            },

            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                this.query.offset = (this.query.pageNow -1)* page.limit;
                this.queryInfo.offset = this.query.offset;
                this.queryInfo.limit = this.query.pageSize;
                this.selectCxjc(this.queryInfo);
            },

            handleChangePageSize: function (page) {
                this.query.pageSize = page;
                this.queryInfo.offset = this.query.offset;
                this.queryInfo.limit = this.query.pageSize;
                this.selectCxjc(this.queryInfo);
            },

            sortChange: function (sort) {
                if (sort && sort.order) {
                    this.query.pageNow = 1;
                    this.query.offset = 0;
                    var queryInfo = this.queryInfo;
                    queryInfo.offset = 0;
                    var dir = sort.order === 'descending'? 'desc':'asc';
                    var column = sort.prop;
                    if (column === 'xcdw') {
                        column = 'xcdwcode'
                    }
                    queryInfo.sortList =[{column: column, dir: dir}];
                    this.initSort = false;
                    this.selectCxjc(queryInfo)
                }
            },

            /**
             * 获取查询监测数据
             * @param queryInfo 分页信息
             */
            selectCxjc: function (queryInfo) {
                var _this = this;
                _this.queryInfo = queryInfo;
                // 初始化排序
                if (!_this.queryInfo.sortList) {
                    _this.queryInfo.sortList = [{column: 'fksj', dir: 'desc'}];
                }
                _this.queryInfo.limit = getLimit();
                _this.cxtj.time = Date.now();
                // Artery.loadPageData("/api/v1/cxjcjl/getCxjcXxxx", _this.queryInfo, _this.cxtj)
                Artery.loadPageData("/api/v1/rzjc/getRzjcXxxx", _this.queryInfo, _this.cxtj)
                    .then(function (result) {
                        if (result.success) {
                            _this.shList = result.data;
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
            loginPersonData: function () {
                var _this = this;
                Artery.ajax.get(_this.loginPersonRole).then(function (result) {
                    if ("zyxtgly" == result.data.roles[0]) {
                        _this.showAll = true;
                        _this.showCxz = false;
                    }
                })
            },
            getSerialNum: function (index) {
                return (index+1) + (this.query.pageNow - 1) * this.query.pageSize;
            },
            showIcon: function(cs) {
                return cs === 1 && this.showAll;
            },
        },
        mounted: function () {
            var _this = this;
            _this.query.pageSize=getLimit();
            // 当拖拽横向滚动条时去掉transition
            _this.$nextTick(function(){
                // 鼠标按下
                $(document).on('mousedown',function () {
                    _this.evtDrag = false;
                    $('.fd-table-header .aty-table__header-wrapper .aty-table__header').removeClass('fd-scrollbar-transition');
                });
                $(document).on('mouseup',function () { // 鼠标抬起
                    _this.evtDrag = true;
                });
            })
            _this.loginPersonData();
        },
        created: function () {
            var _this = this;
            var params = Artery.parseUrl();
            _this.cxtj.bh = params.bh;
            _this.cxh = params.cxh;
            this.queryInfo.offset = 0;
            this.queryInfo.limit = 10;
            _this.queryInfo.sortList = [{column: 'fksj', dir: 'desc'}];
            _this.selectCxjc(this.queryInfo);
        }
    })
})
