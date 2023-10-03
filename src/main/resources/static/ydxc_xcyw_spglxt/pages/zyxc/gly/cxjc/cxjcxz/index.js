// 查询记录模块
define(['extend/template1.js','jquery','fdEventBus','config'], function (template1,jquery,fdEventBus,_config) {
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
                this.xcdwShow = false;//协查单位下拉框空中x号隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.queryInfo.sortList = [{column: 'xcdwcode', dir: 'desc'}];
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
            //处理下拉列表
            xcdwChange: function(cXzdwbm){
            	var _this= this;
            	_this.cXzdwbm = cXzdwbm;
                if(_this.cXzdwbm!=='') {
                	_this.xcdwShow = true;
                	_this.isDisabled = false;
                	_this.cxdwCodeChange(cXzdwbm);
                }
                _this.xcdwList.forEach(function(item,index){
            		console.log(item);
            		if(item.code === _this.cXzdwbm){
            			_this.cXcdwName = item.name;
            		}
            	})
            },
            clearXcdw: function() {
            	this.xcdwShow = false;
                this.cXzdwbm = '';
                this.cSjyId = [];
                this.isDisabled = true;
            },
            cxxChange: function(cSjyId){
            	this.cSjyId = cSjyId;
            	if(this.cSjyId.length !=0){
                    this.cxxShow = true;
                }
            },
            clearCxx:  function() {
                this.cxxShow = false;
                this.cSjyId = '';
            },
            //打开重发弹窗
            openCfmodal: function(row){
                // 定义需要传递过去的数据
                var dataBj={
                    flag:"CxjcCf",
                    _data:{}
                };
                // 给首页发消息
                dataBj._data = row;
                var _data =JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data,'*');
            },
            /**
             * 重发弹窗里面的确认按钮
             */
            modalcxjccfParent:function(row){
                var _this = this;
                Artery.ajax.get("/api/v1/cxjcjl/sqcf", {
                    params: {
                        id: row.id,
                    }
                }).then(function (result) {
                    if (result.code = '200') {
                        Artery.message.success("发送成功！");
                        _this.queryInfo.offset = 0;
                        _this.queryInfo.limit = _this.query.pageSize;
                        _this.selectCxjc(_this.queryInfo);
                    } else {
                        Artery.message.error(result.message);
                    }
                });
   //             this.$refs["modalCf"].close();
            },
            /**
             * @Author: wjing
             * @name: selectXcdw
             * @description: 选择协查单位
             * @param {type} 
             * @return: {undefined}
             */
            selectXcdw: function () {
                console.log('协查单位')
            },
            /**
             * @Author: wjing
             * @name: selectCxx
             * @description: 选择查询项
             * @param {type} 
             * @return: {undefined}
             */
            selectCxx: function () {
                console.log('点击查询项')
                this.isDisabled=false;
            },
            /**
             * @Author: wjing
             * @name: selectYcbs
             * @description: 选择异常标识
             * @param {type} 
             * @return: {undefined}
             */
            selectYcbs: function () {
                console.log('异常标识')
            },
            /**
             * @Author: zyl
             * @name: selectZt
             * @description: 选择异常标识
             * @param {type}
             * @return: {undefined}
             */
            selectSfyfk: function () {
                console.log('状态')
            },
            /**
             * @Author: wjing
             * @name: selectCsbs
             * @description: 选择超时标识
             * @param {type} 
             * @return: {undefined}
             */
            selectCsbs: function () {
                console.log('超时标识')
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
                this.queryInfo.sortList = [{column: 'xcdwcode', dir: 'desc'}];
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
                    _this.queryInfo.sortList = [{column: 'xcdwcode', dir: 'desc'}];
                }
                _this.queryInfo.limit = getLimit();
                _this.cxtj.time = Date.now();
                _this.cxtj.cXzdwbm = _this.cXzdwbm;
                _this.cxtj.cSjyId = _this.cSjyId.join(",");
                Artery.loadPageData("/api/v1/cxjcjl/getCxjcXxxx", _this.queryInfo, _this.cxtj)
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
            selectXcdwAndCxxList: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/cxjcjl/getCxjcXcdwCxx", {
                    params: {
                        bh:_this.cxtj.bh
                    }
                }).then(function (result) {
                        if (result.success) {
                            _this.cxxList = result.data.cxx;
                            _this.xcdwList = result.data.xcdw;
                        } else {
                            Artery.message.error(result.message);
                        }
                    })
            },
            //查询项根据协查单位而改变
            cxdwCodeChange : function(cXzdwbm){
            	var _this = this;
                Artery.ajax.get("/api/v1/cxjcjl/getCxxByXxdw", {
                    params: {
                        bh: _this.cxtj.bh,
                        cXzdwbm: _this.cXzdwbm
                    }
                }).then(function (result) {
                        if (result.success) {
                            _this.cxxList = result.data.cxx;
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
            _this.selectXcdwAndCxxList();
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
            _this.cxtj.zt = params.zt;
            _this.cxh = params.cxh;
            /**
             *  * @Author qhy
             *    @Date 2020/03/06
             *    @description 父页面给子页面发送消息  --- 重发
             */
            window.addEventListener('message', function(evt){
                if(JSON.parse(evt.data).flag=='CxjcCfParent'){
                    _this.modalcxjccfParent(JSON.parse(evt.data)._data);
                }
            }, false);
        }
    })
})