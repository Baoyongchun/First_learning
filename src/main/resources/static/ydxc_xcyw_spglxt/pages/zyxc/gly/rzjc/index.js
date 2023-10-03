// 查询记录模块
define(['extend/template1.js', 'config', 'fdGlobal'], function (template1,_config, fdGlobal) {

    new Vue({
        el: '#jscxjc',
        mixins: [template1],
        data: function () {
            return {
                pageshow:true,
                showAll:false,
                showCz:false,
                // 申请单位
                sqdw: [],
                loginPersonRole: _config.url.frame.loginPerson,
                sqdwList: [],
                // 申请单位列表
                // 申请部门
                sqbm: [],
                // 申请部门列表
                sqbmList: [],
                // 状态
                zt: '',
                // 状态列表
                ztList: [{
                    code: '0',
                    name: '全部'
                }, {
                    code: '6',
                    name: '人工核验通过'
                }, {
                    code: '7',
                    name: '核验不通过'
                }, {
                    code: '8',
                    name: '部分反馈'
                }, {
                    code: '9',
                    name: '全部反馈'
                }, {
                    code: '10',
                    name: '已导出'
                }, {
                    code: '18',
                    name: '已退回'
                }, {
                    code: '20',
                    name: '系统核验通过'
                }],
                xxjs: '',
                shList: {
                    data: [],
                    customData: {},
                    limit: 15,
                    offset: 0,
                    total: 10
                },
                pageNow: 20,
                total: 30,
                // 默认申请部门不可选
                disabled: true,
                queryInfo: {},
                query:{
                    // 分页数据
                    pageNow: 1,
                    pageSize: 10,
                    offset:0,
                    currentSize:''
                },
                //查询条件
                cxtj: {
                    sqdw: '',
                    sqbm: '',
                    cbr:'',
                    dckssj: '',
                    dcjssj: '',
                    cxh: '',
                    zt: '',
                    //信息检索
                    xxjs: '',
                    //时间戳
                    time: '',
                    // 异常类型
                    cxxFkZt:'',
                },
                // 异常类型-model
                cxxFkZt:[],
                // 异常类型
                cxxFkZtList: [{
                    code: "'1'",
                    name: '文件解析报错'
                }, {
                    code: "'2'",
                    name: '超时未反馈结果'
                }, {
                    code: "'3'",
                    name: '多类型并存'
                }],
                // options3: (function (_this) {
                //     return {
                //         disabledDate: function (date) {
                //             return date && date.valueOf() > new Date(_this.cxtj.sqjssj).valueOf() - 86400000;
                //         }
                //     }
                // })(this),
                // options4: (function (_this) {
                //     return {
                //         disabledDate: function (date) {
                //             return date && date.valueOf() < new Date(_this.cxtj.sqkssj).valueOf();
                //         }
                //     }
                // })(this),
                triggerCode: false,// 展开收起标志
                evtDrag:true,
                //暂无数据是否显示
                zwsjShow:false,
                indexNumberOffset: 0,
                resizeHeight:0,
                // 初始化sort
                initSort:true,
                // 初始化sorelist
                initSortList:[],
            }
        },
        // 创建
        created: function () {
            this.query.pageSize = getLimit();
            this.getJueSeType();
            window.vm = this;
            // // 初始化时间
            // _this.initDcDate();
        },
        methods: {
            headerCellClassName: function(rowItem) {
                if (this.initSort) {
                    if (this.initSortList.length === 1 && this.initSortList[0].column === rowItem.column.property) {
                        const sort = this.initSortList[0].dir;
                        this.initSortList = [];
                        return sort.dir === 'desc' ? 'descending' : 'ascending'
                    }else if(rowItem.column.property === 'zxfksj') {
                        return 'descending'
                    }
                }
            },
            showIcon: function(cxxFk, zt) {
                return this.showAll && cxxFk === zt;
            },
            //监测员不显示操作列
            getJueSeType: function () {
                var _this = this;
                Artery.ajax.post("/api/v1/cxjcjl/getJueSe").then(function (result) {
                    if("cxjcy"==result){
                        _this.showCz = false;
                    }else{
                        _this.showCz = true;
                    }
                })
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 如果查询条件有值，怎清空后重新请求数据
                if(this.cxtj.dckssj || this.cxtj.dcjssj || this.cxtj.zt || this.cxtj.cxh || this.cxxFkZt.length > 0 ) {
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    // 结束时间
                    // this.cxtj.dcjssj = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
                    // 开始时间
                    // 用户没有选择时间，用默认的时间
                    // this.cxtj.dckssj = year + '-01-01';
                    // 状态
                    this.cxtj.zt = '';
                    // 信息检索
                    this.cxtj.cxh = '';
                    // 异常类型
                    this.cxxFkZt = [];
                    this.cxtj.cxxFkZt = '';
                    // 重新调用接口
                    this.queryInfo.offset = 0;
                    this.pageshow = false;//让分页隐藏
                    this.$nextTick(function (){//重新渲染分页
                        this.pageshow = true;
                    });
                    this.$refs.cxjcTable.clearSort();
                    this.queryInfo.sortList = [{column: 'zxfksj', dir: 'desc'}];
                    this.initSort = true;
                    this.selectCxjc(this.queryInfo);
                }
            },
            /*滚动条滑动*/
            scrollLeft:function(top,left) {
                var tableHead = $('.fd-table-header .aty-table__header-wrapper .aty-table__header');
                if(this.evtDrag) {
                    tableHead.addClass('fd-scrollbar-transition');
                }
                tableHead.css('transform','translate('+left+')');
            },
            /*展开收起下拉树区域*/
            triggerClick: function() {
                this.triggerCode = !this.triggerCode;
            },
            /**
             * @Author: wjing
             * @name: clickXq
             * @description: 点击详情
             * @param {object}
             * @return: {undefined}
             */
            clickXq: function (row) {
                const query = JSON.parse(JSON.stringify(this.cxtj));
                query.cxxFkZtList = this.cxxFkZt;
                query.limit = this.queryInfo.limit;
                query.offset = this.queryInfo.offset;
                query.sortList = this.queryInfo.sortList;
                query.pageNow = this.query.pageNow;
                fdGlobal.saveLocalStorage("cxjc-search", JSON.stringify(query));
                window.location.href = './cxjcxz/index.html?bh='+row.bh+"&zt="+row.zt+"&cxh="+row.cxh;
            },
            getStartDate :function(){
                return this.cxtj.kssqsj;
            },
            clickCx: function () {
                var _this = this;
                _this.queryInfo.offset = 0;
                _this.queryInfo.limit = _this.query.pageSize;
                this.initSort = true;
                this.$refs.cxjcTable.clearSort();
                _this.queryInfo.sortList = [{column: 'zxfksj', dir: 'desc'}];
                _this.selectCxjc(_this.queryInfo);
            },
            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param {type}
             * @return: {undefined}
             */
            selectSqdw: function (newValue, oldValue) {
                var _this = this;
                if (newValue) {
                    _this.cxtj.sqdw = newValue.id;
                } else {
                    _this.cxtj.sqdw = '';
                }
                _this.queryInfo.offset = 0;
                _this.selectCxjc(_this.queryInfo);
            },

            selectDcsjStart: function (date) {
                if (new Date(this.cxtj.dcjssj) < new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    });
                    this.cxtj.dckssj = "";
                }
            },
            selectDcsjEnd: function (date) {
                if (new Date(this.cxtj.dckssj) > new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    });
                    this.cxtj.dcjssj = "";
                }
            },
            // 设置序号的显示1-10,11-20
            setXuIndex:function(index) {
                return (index + 1) + (Math.ceil((this.indexNumberOffset + 1) / this.queryInfo.limit) - 1) * getLimit();
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                var _this = this;
                _this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                _this.query.offset = (_this.query.pageNow -1)* page.limit;
                _this.queryInfo.offset = _this.query.offset;
                _this.selectCxjc(_this.queryInfo);
            },
            sortChange: function (sort) {
              if (sort && sort.order) {
                  this.query.pageNow = 1;
                  this.query.offset = 0;
                  var queryInfo = this.queryInfo;
                  queryInfo.offset = 0;
                  var dir = sort.order === 'descending'? 'desc':'asc';
                  queryInfo.sortList =[{column: sort.prop, dir: dir}];
                  this.initSort = false;
                  this.selectCxjc(queryInfo)
              }
            },
            /**
             * 加载查询监测列表数据
             * @param queryInfo 分页
             */
            selectCxjc: function (queryInfo) {
                var _this = this;
                _this.isIndexNumberUpdate = false;
                _this.queryInfo = queryInfo;
                if (!_this.queryInfo.offset) {
                    _this.queryInfo.offset = 0;
                }
                // 初始化排序
                if (!_this.queryInfo.sortList) {
                    _this.queryInfo.sortList = [{column: 'zxfksj', dir: 'desc'}];
                }
                // 处理反馈状态
                if (_this.cxxFkZt.length > 0) {
                    _this.cxtj.cxxFkZt = _this.cxxFkZt.join(',');
                }else {
                    _this.cxtj.cxxFkZt = '';
                }
                _this.cxtj.time = Date.now();
                // Artery.loadPageData("/api/v1/cxjcjl/getCxjcData", _this.queryInfo, _this.cxtj)
                Artery.loadPageData("/api/v1/rzjc/getRzjc", _this.queryInfo, _this.cxtj)
                    .then(function (result) {
                        if (result.success) {
                            _this.shList = result.data;
                            if(_this.shList.data.length) {
                                _this.zwsjShow = false;
                            } else {
                                _this.zwsjShow = true;
                            }
                            _this.total = result.data.total;
                            if(parseInt(_this.total/_this.query.pageSize) == _this.query.pageNow -1){
                                _this.query.currentSize = _this.total;
                            } else {
                                _this.query.currentSize = _this.query.pageSize * (_this.query.pageNow);
                            }
                            _this.indexNumberOffset = _this.queryInfo.offset;
                            _this.resizeHeight = $('.fd-content-cxjc').height();
                        } else {
                            Artery.message.error(result.message);
                        }
                    })
                $(document).on('mousedown',function () {
                    _this.evtDrag = false;
                    $('.fd-table-header .aty-table__header-wrapper .aty-table__header').removeClass('fd-scrollbar-transition');
                });
                $(document).on('mouseup',function () { // 鼠标抬起
                    _this.evtDrag = true;
                });
            },
            /**
             * @description 显示初始化时间（今年的一月一号到今日）
             * @author nfj
             * @name initSqDate
             */
            initDcDate: function() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                // 判断用户是否选了时间
                if (this.cxtj.dckssj) {
                    // 用户选择了时间，不做任何操作
                } else {
                    // 用户没有选择时间，用默认的时间
                    this.cxtj.dckssj = year + '-01-01';
                }
                // 判断用户是否选了时间
                if (this.cxtj.dcjssj) {
                    // 用户选择了时间，不做任何操作
                } else {
                    // 用户没有选择时间，用默认的时间
                    this.cxtj.dcjssj = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
                }
            },
            loginPersonData: function () {
                var _this = this;
                Artery.ajax.get(_this.loginPersonRole).then(function (result) {
                    if ("zyxtgly" == result.data.roles[0]) {
                        _this.showAll = true;
                    }
                })

            },
            openCkspb: function (bh) {
                // 请求书生的阅读接口
                Artery.ajax.get("/api/v1/spb/view", {
                    timeout: 50000,
                    params: {
                        sqbh: bh,
                        type: "2",  //1: 地方  2: 中央
                        time: Date.now()
                    }
                }).then(function (result) {
                    if (result === 'dzurl') {
                        result = '/ydxc_xcyw_spglxt/pages/dfxc/approval/cgdyyl/index.html';
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
                            cBh: bh
                        }
                    });
                })
            }
        },
        mounted: function () {
            var _this = this;
            // 当拖拽横向滚动条时去掉transition
            _this.$nextTick(function(){
                // 鼠标按下
                $('.aty-scroll-track-h').on('mousedown',function () {
                    _this.evtDrag = false;
                    $('.fd-table-header .aty-table__header-wrapper .aty-table__header').removeClass('fd-scrollbar-transition');
                });
                $(document).on('mouseup',function () { // 鼠标抬起
                    _this.evtDrag = true;
                });

                // 绑定组织机构树的查询输入框的事件
                $('.fd-cxjc-tree .aty-tree-search .aty-input').on('blur', function() {
                    setTimeout(function(){
                        // console.log($('.isFocus').parent())
                        // 选中的元素的距离顶部的位置
                        var selectedTreeTop = $('.isFocus').parent()[0].offsetTop;
                        // 滚动的距离
                        _this.$refs.jsCxjcTreeScroll.updateTop(selectedTreeTop);
                    }, 300)
                })
                // 绑定组织机构树点击选择搜索下拉框的内容
                $('.fd-cxjc-tree .fd-aty-tree .aty-select-dropdown-list .aty-select-item').on('click', function() {
                    setTimeout(function(){
                        // console.log($('.isFocus').parent())
                        // 选中的元素的距离顶部的位置
                        var selectedTreeTop = $('.isFocus').parent()[0].offsetTop;
                        // 滚动的距离
                        _this.$refs.jsCxjcTreeScroll.updateTop(selectedTreeTop);
                    }, 300)
                })
            })
            _this.loginPersonData();
            // 适应大小屏的滚动条
            this.resizeHeight = $('.fd-content-cxjc').height();
            window.addEventListener('resize',function(){
                // 适应大小屏的滚动条
                console.log('resize')
                _this.$nextTick(function(){
                    _this.resizeHeight = $('.fd-content-cxjc').height();
                })
            });
            // 初始化 查询条件
            const storeValue = fdGlobal.findLocalStorage('cxjc-search');
            console.log('storeValue', storeValue);
            var queryInfo = {
                offset: 0,
                limit: _this.query.pageSize
            };
            if (storeValue) {
                const query = JSON.parse(storeValue);
                _this.cxtj.sqdw = query.sqdw;
                _this.cxtj.sqbm = query.sqbm;
                _this.cxtj.cbr = query.cbr;
                _this.cxtj.dckssj = query.dckssj;
                _this.cxtj.dcjssj = query.dcjssj;
                _this.cxtj.cxh = query.cxh;
                _this.cxtj.zt = query.zt;
                _this.cxtj.xxjs = query.xxjs;
                _this.cxtj.time = query.time;
                _this.cxxFkZt = query.cxxFkZtList;
                queryInfo.offset = query.offset;
                queryInfo.sortList = query.sortList;
                _this.initSortList = queryInfo.sortList;
                _this.query.pageNow = query.pageNow;
                fdGlobal.devareLocalStorage('cxjc-search');
            }
            // 初始化时间
            // _this.initDcDate();
            _this.selectCxjc(queryInfo);
        }
    })

})
