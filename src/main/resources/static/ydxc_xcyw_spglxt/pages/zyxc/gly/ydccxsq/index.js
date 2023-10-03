// 查询记录模块
define(['extend/template1.js', 'config'], function (template1, config) {

    new Vue({
        el: '#jscxjc',
        mixins: [template1],
        data: function () {
            // var _this =this;
            return {
                pageshow:true,
                sqbmList: [],
                // 单位
                dw: '',
                // 申请单位列表
                sqdwList: [],
                xxjs: '',
                shList: [],
                pageNow: 20,
                total: 30,
                // 默认申请部门不可选
                disabled: true,
                queryInfo: {
                },
                query: {
                    // 分页数据
                    pageNow: 1,
                    pageSize: 10,
                    offset: 0,
                    currentSize: ''
                },
                bhList:new Set(),
                // 全选
                checkedAll:false,
                //查询条件
                cxtj: {
                    dckssj: '',
                    dcjssj: '',
                    cxh: '',
                    sqdwList: '',
                    ztList: '(8,9,10)',
                    //时间戳
                    time: '',
                    zt: '',
                    dir: 'desc'
                },
                options3: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.dcjssj).valueOf() - 86400000;
                        }
                    }
                })(this),
                options4: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.sqkssj).valueOf();
                        }
                    }
                })(this),
                //暂无数据是否显示
                zwsjShow:false,
                exportType:'',
                exportArg:'',
                webSocket: {},
                socketKey: '',
                canUseWebSocket: true,
                stopLongPooling: false,
                // 状态列表
                ztList: [{
                    code: '8',
                    name: '部分反馈'
                }, {
                    code: '9',
                    name: '全部反馈'
                }, {
                    code: '10',
                    name: '已导出'
                }],
            }
        },
        // 创建
        created: function () {
            var _this = this;
            _this.query.pageSize=getLimit();
            $(window).on('message', function (evt) {
                var mesStr = typeof (evt.originalEvent.data) !== 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
                if(mesStr.flag === 'doExportApply') {
                    _this[_this.exportType](_this.exportArg);
                }
            });
        },
        methods: {
            openSqb: function (bh) {
                // 请求书生的阅读接口
                Artery.ajax.get("/api/v1/spb/view", {
                    timeout: 50000,
                    params: {
                        sqbh: bh,
                        type: "1",  //1: 地方  2: 中央
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
            },
            openSendBackModal: function (row) {
                if(row.zt !="已导出"){
                    Artery.notice.warning({
                        title: "查询结果已"+row.zt+"，不可退回！"
                    });
                    return false;
                }
                var dataBj={
                    flag:"sendBack",
                    _data:{
                        cBh: row.bh,
                        cBtgyy: ''
                    }
                };
                // 给首页发消息
                var _data =JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data,'*');
                setTimeout(function () {
                    _this.searchReset();
                },2000)
            },
            //点击单个
            clickItem: function (bh) {
                var _this = this;
                if(_this.bhList.has(bh)) {
                    _this.bhList.delete(bh);
                } else {
                    _this.bhList.add(bh);
                }

                if (_this.bhList.size === _this.shList.length) {
                    _this.checkedAll = true;
                } else {
                    _this.checkedAll = false;
                }

                this.$forceUpdate();
            },
            // 点击全选
            clickAll: function () {
                var _this = this;
                _this.checkedAll = !_this.checkedAll;
                _this.bhList.clear();

                if (_this.checkedAll === true) {
                    _this.shList.forEach(function (item, index) {
                        item.checked = true;
                        _this.bhList.add(item.bh);
                    });
                } else {
                    _this.shList.forEach(function (item, index) {
                        item.checked = false;
                    });
                }
            },
            openExportModel: function (exportType, arg) {
                this.exportType = exportType;
                this.exportArg = arg;
                if(exportType === 'pldc' && !this.pldc(true)) {
                    return;
                } else if (exportType === 'exportAll' && !this.exportAll(true)) {
                    return;
                }

                var dataBj={
                    flag:"confirmExportApply"
                };
                // 给首页发消息
                var _data =JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data,'*');
            },
            /**
             * 批量导出
             */
            pldc: function(onlyValidate) {
                var _this = this;
                var arr = [];
                if (!(_this.bhList && _this.bhList.size)) {
                    Artery.notice.warning({
                        title: "请选择至少一个要导出的申请"
                    });
                    return false;
                }

                if(onlyValidate) {
                    return true;
                }

                this.initSocketIO();
                _this.bhList.forEach(function (item, index) {
                    arr.push(item)
                });
                var fjUrl = "/api/v1/sqwjpldc?again=true&bh=" + arr.toString() + '&socketKey=' + this.socketKey;
                new downLoadFile(fjUrl).downLoad();
                setTimeout(function () {
                    this.selectYdc();
                },2000)
            },
            initSocketIO: function () {
                if(this.canUseWebSocket) {
                    var baseWebSocketUrl = config.dirProjectPath.replace('http', 'ws');
                    if(!this.webSocket || !this.webSocket.readyState || this.webSocket.readyState > 1) {
                        this.generateScoketKey();
                        try {
                            var webSocket = new WebSocket(baseWebSocketUrl + 'socket/' + this.socketKey);
                            webSocket.onopen = this.socketOnOpen;
                            webSocket.onclose = this.socketOnClose;
                            webSocket.onerror = this.socketOnError;
                            webSocket.onmessage = this.socketOnMessage;
                            this.webSocket = webSocket;
                        } catch (e) {
                            console.error(e);
                        }
                    }
                } else {
                    this.generateScoketKey();
                    this.stopLongPooling = false;
                    // this.getExportFlag(false);
                }
            },
            getExportFlag: function (stop) {
                if(stop) {
                    return;
                }
                var _this = this;
                Artery.ajax.get(_this.exportFlagUrl, {
                    params: {
                        socketKey: _this.socketKey
                    }
                }).then(function (result) {
                    _this.selectYdc();
                }).catch(function (error) {
                    console.log(error);
                    // _this.getExportFlag(_this.stopLongPooling);
                })
            },
            generateScoketKey: function () {
                // 当前毫秒值加6位随机数
                var randomNum = "";
                for (var i = 0; i < 6; i++) {
                    randomNum += Math.floor(Math.random() * 10);
                }
                this.socketKey = new Date().getTime() + randomNum;
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 申请单位
                if(this.sqdwList.length != 0){
                    this.sqdwList = [];
                }
                this.cxtj.cxh = ''
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                // 结束时间
                this.cxtj.dcjssj = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
                // 开始时间
                // 用户没有选择时间，用默认的时间
                this.cxtj.dckssj = year + '-01-01';
                this.resetCurrentPage(1);
                this.selectYdc();
            },
            resetCurrentPage: function (currentPageNum) {
                var _this = this;
                _this.query.pageNow = currentPageNum;
                _this.query.offset = 0;
                _this.pageshow = false;//让分页隐藏
                _this.$nextTick(function (){//重新渲染分页
                    _this.pageshow = true;
                });
            },
            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param {type}
             * @return: {undefined}
             */
            selectSqsjStart: function (date) {
                var _this = this;
                if (new Date(this.cxtj.dcjssj) < new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    })
                    _this.cxtj.dckssj = "";
                } else {
                }
            },
            selectSqsjEnd: function (date) {
                var _this = this;
                if (new Date(this.cxtj.dckssj) > new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    })
                    _this.cxtj.dcjssj = "";
                } else{
                }
            },
            selectDw: function (newValue, oldValue) {
                var _this = this;
                window._vm = _this;
                if(newValue && newValue.length > 0 && _this.sqdwList.length === 0) {
                    newValue.splice(0, newValue.length);
                }
                _this.query.offset = 0;
                _this.resetCurrentPage(1);
                _this.selectYdc();
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                var _this = this;
                _this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                _this.query.offset = (_this.query.pageNow -1)* page.limit;
                _this.selectYdc();
            },

            handleChangePageSize: function (page) {
                var _this = this;
                _this.query.pageSize = page;
                _this.selectYdc(_this.queryInfo);
            },
            createSqdwList:function(){
                var _this = this;
                _this.cxtj.sqdwList = null;
                if(_this.sqdwList != null && _this.sqdwList.length>0){
                    if(_this.sqdwList.length>0){
                        _this.cxtj.sqdwList = "(''";
                        for (var i = 0; i < _this.sqdwList.length; i++) {
                            _this.cxtj.sqdwList += (',\''+_this.sqdwList[i]+'\'');
                        }
                        _this.cxtj.sqdwList += ')';
                    }
                }
            },

            dc: function(bh) {
                var _this = this;
                var fjUrl = "/api/v1/sqwjdc?again=true&bh=" + bh;
                new downLoadFile(fjUrl).downLoad();
            },


            /**
             * 获取已导出列表数据
             * @param queryInfo 分页信息
             */
            selectYdc: function (queryInfo) {
                var _this = this;
                _this.checkedAll = false;
                _this.bhList.clear();
                _this.createSqdwList();
                // 初始化时间
                _this.initSqDate();
                // this.cxtj.dcjssj = _this.initSqDate(this.cxtj.dcjssj);
                // this.cxtj.dckssj = _this.initSqDate(this.cxtj.dckssj);
                _this.queryInfo.offset = _this.query.offset;
                _this.queryInfo.limit = _this.query.pageSize;
                _this.cxtj.time = Date.now();
                Artery.loadPageData("/api/v1/cxsqxx", _this.queryInfo, _this.cxtj)
                    .then(function (result) {
                        if (result.success) {
                            _this.shList = result.data.data;
                            if(_this.shList.length <= 0 ) {
                                _this.zwsjShow = true;
                            } else {
                                _this.zwsjShow = false;
                                _this.shList.forEach(function (item, index) {
                                    item.checked = false;
                                });
                            }
                            _this.total = result.data.total;
                            if(parseInt(_this.total/_this.query.pageSize) == _this.query.pageNow -1){
                                _this.query.currentSize = _this.total;
                            } else {
                                _this.query.currentSize = _this.query.pageSize * (_this.query.pageNow);
                            }
                            _this.canUseWebSocket = result.data.customData.canUseWebSocket;
                        } else {
                            Artery.message.error(result.message);
                        }
                    });
            },
            /**
             * @description 显示初始化时间（今年的一月一号到今日）
             * @author nfj
             * @name initSqDate
             */
            initSqDate: function() {
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
            sortChange: function (sort) {
                if (sort && sort.order) {
                    this.query.pageNow = 1;
                    this.query.offset = 0;
                    var queryInfo = this.queryInfo;
                    queryInfo.offset = 0;
                    var dir = sort.order === 'descending'? 'desc':'asc';
                    this.cxtj.dir = dir;
                    // queryInfo.sortList =[{column: sort.prop, dir: dir}];
                    // this.initSort = false;
                    this.selectYdc(queryInfo)
                }
            },
        }
    })
})
