// 查询记录模块
define(['extend/template1.js','jquery','fdEventBus','config'],
    function (template1,jquery,fdEventBus,_config) {
    new Vue({
        el: '#rzjcresultfile1',
        mixins: [template1],
        data: function () {
            return {
                loginPersonRole: _config.url.frame.loginPerson,
                rzjcHyflUrl: _config.url.frame.getRzjcHyfl,
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
                initSort: true,



                //新加的

                /*optionRzjc: {
                    totalPage: 10,
                    totalSize: 100,
                    currentSize: 15,
                    currentPage: 1,
                    showPoint: false,
                    showPage: 4,
                    prev: ' ',
                    next: ' ',
                    first: ' ',
                    last: ' '
                },*/
                // 申请时间默认降序
                isSqsjDesc: null,
                // 导出时间默认降序
                isExportDesc: null,
                // 最新反馈时间默认降序
                isZxfksjDesc: true,


                /*tableData: [
                    {
                        eResultFileName: '结果文件名_4_130000000002_YL00002.xlsx',
                        eSjyName: '旅馆住宿',
                        eStartTime: '2019-01-30 19:27:59',
                        eEndTime: '2019-01-30 19:27:59',
                        eProcessStatus: 2,
                        eContent: '文件解析异常'
                    },
                    {
                        eResultFileName: '结果文件名_4_130000000002_YL00002.xlsx',
                        eSjyName: '旅馆住宿',
                        eStartTime: '2019-01-30 19:27:59',
                        eEndTime: '2019-01-30 19:27:59',
                        eProcessStatus: 2,
                        eContent: '文件解析异常'
                    },
                    {
                        eResultFileName: '结果文件名_4_130000000002_YL00002.xlsx',
                        eSjyName: '旅馆住宿',
                        eStartTime: '2019-01-30 19:27:59',
                        eEndTime: '2019-01-30 19:27:59',
                        eProcessStatus: 2,
                        eContent: '文件解析异常'
                    },
                    {
                        eResultFileName: '结果文件名_4_130000000002_YL00002.xlsx',
                        eSjyName: '旅馆住宿',
                        eStartTime: '2019-01-30 19:27:59',
                        eEndTime: '2019-01-30 19:27:59',
                        eProcessStatus: 2,
                        eContent: '文件解析异常'
                    },
                    {
                        eResultFileName: '结果文件名_4_130000000002_YL00002.xlsx',
                        eSjyName: '旅馆住宿',
                        eStartTime: '2019-01-30 19:27:59',
                        eEndTime: '2019-01-30 19:27:59',
                        eProcessStatus: 2,
                        eContent: '文件解析异常'
                    },
                ],*/
                industryList: [
                    {
                        cId: '01',
                        cName: '公安部',
                        cPid: '',
                        nValid: 1,
                        nOrder: 2
                    },
                    {
                        cId: '02',
                        cName: '自然资源部',
                        cPid: '',
                        nValid: 1,
                        nOrder: 4
                    }
                ],
                activeItem: true,
                activeIndex: '0',
                eHyfl:'',
                /*optionrzjcrf: {
                    // 信息查询目录分页  optionCxjcrf
                    totalPage: 10,
                    totalSize: 100,
                    currentSize: 15,
                    currentPage: 1,
                    showPoint: false,
                    showPage: 4,
                    prev:' ',
                    next:' ',
                    first: ' ',
                    last:' '
                },*/
                currentPage:1,
                packagesName:'',
                eResultRecordCi:'',
                eLogType: '02'
            }
        },
        methods: {

            headerCellClassName: function(rowItem) {
                if (this.initSort && rowItem.column.property === 'xcdw') {
                    return 'descending'
                }
            },

            /*searchReset:function(){
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
            },*/

            /*滚动条滑动*/
            scrollLeft:function(top,left) {
                var tableHead = $('.fd-table-header .aty-table__header-wrapper .aty-table__header');
                if(this.evtDrag) {
                    tableHead.addClass('fd-scrollbar-transition');
                }
                tableHead.css('transform','translate('+left+')');
            },


         /*   goBack: function () {
                window.location.href = '../index.html'
            },*/

            /*clickCx: function () {
                var _this = this;
                _this.queryInfo.offset = 0;
                _this.queryInfo.limit = _this.query.pageSize;
                // 查询后从第一页开始显示
                _this.query.pageNow = Math.ceil((_this.queryInfo.offset + 1) / _this.queryInfo.limit);
                this.$refs.cxjcTable.clearSort();
                this.queryInfo.sortList = [{column: 'fksj', dir: 'desc'}];
                this.initSort = true;
                _this.selectCxjc(_this.queryInfo);
            },*/

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

            //排序变化
            sortChange: function (sort) {
                if (sort && sort.order) {
                    this.query.pageNow = 1;
                    this.query.offset = 0;
                    var queryInfo = this.queryInfo;
                    queryInfo.offset = 0;
                    var dir = sort.order === 'descending'? 'desc':'asc';
                    var column = sort.prop;
                    queryInfo.sortList =[{column: column, dir: dir}];
                    this.initSort = false;
                    this.selectCxjc(queryInfo)
                }
            },

            //获取结果
            selectCxjc: function (queryInfo) {
                var _this = this;
                _this.queryInfo = queryInfo;
                _this.cxtj.eLogType = '02';
                _this.cxtj.eResultRecordCid = _this.eResultRecordCid;
                _this.cxtj.eHyfl = _this.eHyfl;
                Artery.loadPageData("/api/v1/rzjc/rzjcrf", _this.queryInfo, _this.cxtj)
                    .then(function (result) {
                        // if (result.code === '200') {
                        if (result.success) {
                            _this.shList = result.data.data;
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

            //获取行业分类
            getrzjcHyfl: function (){
                var _this = this;
                $.ajax({
                    method: 'get',
                    url: _this.rzjcHyflUrl,
                    success: function (data) {
                        if (data.code === '200') {
                            _this.industryList = data.data.data;
                            /*var all ={
                                cName:'全部',
                                cId:''
                            }
                            _this.industryList.splice(0,0,all);*/
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                    }
                });
            },

            //修改页签
            changeActive(item, index) {
                this.activeIndex = index;
                this.eHyfl = item.cId;
                var _this = this;
                _this.queryInfo.offset = 0;
                _this.queryInfo.limit = 10;
                _this.queryInfo.sortList = [{column: 'startTime', dir: 'desc'}];
                this.selectCxjc(_this.queryInfo);
            },

            /*//获取文件列表
            getrzjcResultFilesList: function (currentPage, currentSize) {
                var _this = this;
                var _serverData = {};
                // 点击查询按钮发的请求数据
                _serverData = {
                    eResultRecordCid:_this.eResultRecordCid,
                    eLogType:'02',
                    eHyfl:_this.eHyfl,
                    currentPage:currentPage,
                    currentSize:currentSize,
                    sqsjDesc:_this.isSqsjDesc,//排序需要后端支持
                    zxfksjDesc:_this.isZxfksjDesc//排序需要后端支持（其实es只需要按这两个中的一个time进行升降排序即可、状态字段排序）
                };
                $.ajax({
                    method: config.methodPost,
                    // url: _this.queryRzjcResultFiles,
                    url: 'http://localhost:10010/api/rzjc/rzjcResultFiles',
                    // url: 'http://10.202.40.89:10010/api/rzjc/rzjcResultFiles',
                    data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code === 1) {
                            // _this.activities = data.data.rzResultVOList;
                            _this.xxtxList = data.data.rzResultVOList;
                            _this.optionrzjcrf.totalPage = data.data.page.totalPage;
                            _this.optionrzjcrf.totalSize = data.data.page.totalSize;
                            _this.optionrzjcrf.currentPage = currentPage;
                            _this.optionrzjcrf.currentSize = currentSize;
                        }
                        // 输出日志
                        fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data);
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },*/

            /*handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },*/

            /*formatter(row, column) {
                return row.eResultFileName;
            },*/

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
            _this.queryInfo.offset = 0;
            _this.queryInfo.limit = 10;
            _this.queryInfo.sortList = [{column: 'startTime', dir: 'desc'}];
            _this.packagesName = params.cZipName;
            _this.eResultRecordCid = params.eResultRecordCid;
            _this.getrzjcHyfl();
            _this.selectCxjc(_this.queryInfo);

           /* // 禁用浏览器的backspace默认回退事件
            document.onkeypress = function (e) {
                // 获取event对象
                var ev = e || window.event;
                // 获取事件源
                var obj = ev.target || ev.srcElement;
                // 获取事件源类型
                var t = obj.type || obj.getAttribute('type');
                if (ev.keyCode === 8 && t !== 'password' && t !== 'text' && t !== 'textarea' && t !== 'number') {
                    return false;
                }
            };
            document.onkeydown = function (e) {
                // 获取event对象
                var ev = e || window.event;
                // 获取事件源
                var obj = ev.target || ev.srcElement;
                // 获取事件源类型
                var t = obj.type || obj.getAttribute('type');
                if (ev.keyCode === 8 && t !== 'password' && t !== 'text' && t !== 'textarea' && t !== 'number') {
                    return false;
                }
            };
            if (window.history && window.history.pushState) {
                $(window).on('popstate', function () {
                    window.history.pushState('forward', null, '#');
                    window.history.forward(1);
                });
            }
            // 在IE中必须得有这两行
            window.history.pushState('forward', null, '#');
            window.history.forward(1);*/

        }
    })
})
