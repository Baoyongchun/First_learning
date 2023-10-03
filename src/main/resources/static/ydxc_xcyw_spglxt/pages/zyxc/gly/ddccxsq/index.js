// 查询记录模块
define(['extend/template1.js', 'config'], function (template1, config) {

    var vm = new Vue({
        el: '#jscxjc',
        mixins: [template1],
        data: function () {
            return {
                pageshow:true,
                // 申请单位
                dw: '',
                // 申请单位列表
                sqdwList: [],
                xxjs: '',
                shList: [],
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
                    sqdwList: '',
                    sqbm: '',
                    sqkssj: '',
                    sqjssj: '',
                    cxh: '',
                    zt: '6',
                    //信息检索
                    xxjs: '',
                    //时间戳
                    time: ''
                },
                bhList:new Set(),
                options3: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.sqjssj).valueOf() - 86400000;
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
                checkboxBtn:'',
                isChecked:false,
                // 全选
                checkedAll:false,
                //暂无数据是否显示
                zwsjShow:false,
                sendBackReason: '',
                exportAllCxsqUrl: config.url.frame.exportAllCxsqUrl,
                exportFlagUrl: config.url.frame.exportFlagUrl,
                exportType: '',
                exportArg: '',
                webSocket: {},
                socketKey: '',
                canUseWebSocket: true,
                stopLongPooling: false
            }
        },
        // 创建
        created: function () {
            var _this = this;
            _this.query.pageSize = getLimit();
            $(window).on('message', function (evt) {
                var mesStr = typeof (evt.originalEvent.data) !== 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
                if (mesStr.flag === 'ddcCxsqListRefresh') {
                    _this.selectddc();
                } else if(mesStr.flag === 'doExportApply') {
                    _this[_this.exportType](_this.exportArg);
                }
            });
        },
        mounted: function () {
            var _this = this;
            _this.$nextTick(function () {
                $('.fd-table-header .aty-checkbox-input').change(function () {
                    _this.selectable1()
                })
            });
        },
        methods: {
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                // 结束时间
                this.cxtj.sqjssj = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
                // 开始时间
                // 用户没有选择时间，用默认的时间
                this.cxtj.sqkssj = year + '-01-01';
                // 申请单位
                if(this.sqdwList.length != 0){
                    this.sqdwList = [];
                }
                this.cxtj.cxh = ''
                var _this = this;
                _this.query.pageNow = 1;
                _this.query.offset = 0;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
            });
                this.selectddc();
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
            /**
             * @Author: wlq
             * @name: dc
             * @description: 导出
             * @param {object}
             * @return: {undefined}
             */
            dc: function(bh) {
                var _this = this;
                this.initSocketIO();
                var fjUrl = "/api/v1/sqwjdc?bh=" + bh + '&socketKey=' + this.socketKey;
                new downLoadFile(fjUrl).downLoad();
                setTimeout(function () {
                    _this.selectddc();
                },1000)
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
                var fjUrl = "/api/v1/sqwjpldc?again=false&bh=" + arr.toString() + '&socketKey=' + this.socketKey;
                new downLoadFile(fjUrl).downLoad();
                setTimeout(function () {
                    _this.selectddc();
                },2000)
            },

            /**
             * 选择申请开始时间
             * @param date
             */
            selectSqsjStart: function (date) {
                var _this = this;
                if (new Date(this.cxtj.sqjssj) < new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    });
                    _this.cxtj.sqkssj = "";
                } else {
                    _this.queryInfo.offset = 0;
                    // _this.selectddc();
                }
            },
            /**
             * 选择申请结束时间
             * @param date
             */
            selectSqsjEnd: function (date) {
                var _this = this;
                if (new Date(this.cxtj.sqkssj) > new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    });
                    _this.cxtj.sqjssj = "";
                } else{
                    _this.queryInfo.offset = 0;
                    // _this.selectddc();
                }
            },
            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param {type}
             * @return: {undefined}
             */
            selectDw: function (newValue, oldValue) {
                var _this = this;
                _this.queryInfo.offset = 0;
                if(newValue && newValue.length > 0 && _this.sqdwList.length === 0) {
                    newValue.splice(0, newValue.length);
                }
                _this.selectddc(_this.queryInfo);
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                this.query.offset = (this.query.pageNow -1)* page.limit;
                this.selectddc();
            },

            handleChangePageSize: function (page) {
                this.query.pageSize = page;
                this.selectddc();
            },
            createSqdwList:function(){
                var _this = this;
                _this.cxtj.sqdwList = null;
                if(_this.sqdwList != null && _this.sqdwList.length>0){
                    var index = _this.sqdwList.indexOf("0");
                    if(index>-1){
                        _this.sqdwList.splice(index,1);
                    }
                    if(_this.sqdwList.length>0){
                        _this.cxtj.sqdwList = "(''";
                        for (var i = 0; i < _this.sqdwList.length; i++) {
                            _this.cxtj.sqdwList += (',\''+_this.sqdwList[i]+'\'');
                        }
                        _this.cxtj.sqdwList += ')';
                    }
                }
            },

            /**
             * 待导出列表数据
             */
            selectddc: function () {
                var _this = this;
                //清除全选框
                _this.checkedAll = false;
                _this.bhList.clear();
                _this.createSqdwList();
                // 初始化时间
                _this.initSqDate();
                // this.cxtj.sqjssj = _this.initSqDate(this.cxtj.sqjssj);
                // this.cxtj.sqkssj = _this.initSqDate(this.cxtj.sqkssj);

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
                            }
                            _this.total = result.data.total;
                            if(parseInt(_this.total/_this.query.pageSize) == _this.query.pageNow -1){
                                _this.query.currentSize = _this.total;
                            } else {
                                _this.query.currentSize = _this.query.pageSize * (_this.query.pageNow);
                            }
                            _this.canUseWebSocket = result.data.customData.canUseWebSocket;
                            var pMessage = {
                                message: 'zy-jdy-dccxsq',
                                count: _this.total
                            }
                            window.parent.postMessage(pMessage, '*');
                        } else {
                            Artery.message.error(result.message);
                        }
                    })
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
                if (this.cxtj.sqkssj) {
                    // 用户选择了时间，不做任何操作
                } else {
                    // 用户没有选择时间，用默认的时间
                    this.cxtj.sqkssj = year + '-01-01';
                }
                // 判断用户是否选了时间
                if (this.cxtj.sqjssj) {
                    // 用户选择了时间，不做任何操作
                } else {
                    // 用户没有选择时间，用默认的时间
                    this.cxtj.sqjssj = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
                }
            },
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
            openSendBackModal: function (bh) {
                var dataBj={
                    flag:"sendBack",
                    _data:{
                        cBh: bh,
                        cBtgyy: ''
                    }
                };
                // 给首页发消息
                var _data =JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data,'*');
            },
            exportAll: function (onlyValidate) {
                var _this = this;
                if(!_this.shList || _this.shList.length === 0) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '当前没有任何可以导出的查询申请'
                        },
                        interval: 900
                    });
                    return false;
                }

                if(onlyValidate) {
                    return true;
                }

                this.initSocketIO();
                new downLoadFile(_this.exportAllCxsqUrl + '?socketKey=' + this.socketKey).downLoad();
                setTimeout(function () {
                    _this.selectddc();
                },1000)
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
            generateScoketKey: function () {
                // 当前毫秒值加6位随机数
                var randomNum = "";
                for (var i = 0; i < 6; i++) {
                    randomNum += Math.floor(Math.random() * 10);
                }
                this.socketKey = new Date().getTime() + randomNum;
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
                    this.getExportFlag(false);
                }
            },
            socketOnOpen: function (event) {
                console.log('Socket opened.');
            },
            socketOnClose: function (event) {
                console.log('Socket closed. Try reconnect.');
            },
            socketOnError: function (event) {
                console.error(event);
            },
            socketOnMessage: function (event) {
                this.selectddc();
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
                    _this.selectddc();
                }).catch(function (error) {
                    console.log(error);
                    // _this.getExportFlag(_this.stopLongPooling);
                })
            }
        }
    })
})
