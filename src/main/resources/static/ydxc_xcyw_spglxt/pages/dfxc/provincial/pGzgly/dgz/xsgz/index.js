// 查询记录模块
define(['extend/template1.js', 'extend/scspb.js', 'jquery', 'dragFun', 'config', 'fdGlobal'], function (template1, scspb, jquery, dragFun, config, fdGlobal) {
    var _config = JSON.parse(JSON.stringify(config));
    //  单独设置，便于调试
    _config.showLog = true;
    var vm = new Vue({
        el: '#jsXsGzbjsq',
        mixins: [template1],
        cBh:"",
        sqbs:"",
        data: function () {
            return {
                // 默认值为不通过  1通过  2不通过
                tgType: "2",
                // 当前选中的页签
                tabName: 'spb',
                // 审批记录的table数据
                spjlTable: [

                ],
                jbxx:{
                    cCxh:''
                },
                ssUrl:"",
                btgyy:"",
                //用来处理object层级过高
                objectZd: false,
                // 盖章记录
                shjlList: [],
                //申请基本信息的编号
                bh: '',
                //申请基本信息的申请标识
                sqbs: '',
                //信息查询审批表信息接口
                xxxcspbUrl: config.url.frame.xxxcspbUrl,
                //获取盖章记录接口
                gzjllbUrl: config.url.frame.gzjllbUrl,
                qzIframeSrc:"",
                //获取用印接口
                dwjQzSrc: config.url.frame.dwjQzSrc,
                //多次用印申请
                dcYysqSrc: config.url.frame.dcYysqSrc,
                //盖章结论接口
                gzshUrl: config.url.frame.gzshUrl,
                // 线上盖章不通过字数限制显示
                showXsgzbtg:false,
                info:{},
                webSocket: {},
                socketKey: "",
                tabList:[
                    {
                        key: 'spb',
                        name: '审批表'
                    },
                    {
                        key: 'gzjl',
                        name: '盖章记录'
                    },
                ],
                // 数据的lable字段
                dKey:'key',
                // 数据值字段
                dName:'name',
                // 当前激活的key
                activeKey:'spb',
                // 当前的key
                currentKey: '',
                // 当前激活的条目
                activeItem: {},
                // 是否显示第一个页签
                showTab:true
            }
        },
        watch: {
            // 监听key值
            activeKey: {
                handler:function(newValue) {
                    // 当前的key
                    if (this.currentKey !== newValue) {
                        // 设置激活的key
                        this.setActiveKey(newValue);
                    }
                },
                // 直接执行
                immediate: true
            }
        },
        methods: {
            // 点击tab
            clickTabItem:function(item) {
                if (this.activeItem.key !== item.key) {
                    // 设置当前的激活条目
                    this.setActiveItem(item);
                }
                if(item.key === 'spb'){
                    this.showTab = true
                } else {
                    this.showTab = false;
                }
            },
            // 设置激活的key
            setActiveKey:function(key) {
                // 激活的条目
                var _activeItem = null;
                // 循环tabList
                this.tabList.every(function(item){
                    if (item.key === key) {
                        _activeItem = item;
                        return false;
                    }
                    return true;
                })
                // 设置当前激活的条目
                if (_activeItem) {
                    this.setActiveItem(_activeItem);
                } else if (!this.currentKey && this.tabList.length) {
                    // 默认第一个激活
                    this.setActiveItem(this.tabList[0]);
                }
            },

            /**
             * @function
             * @memberof module:tab
             * @description  设置当前的激活条目
             * @param {object} item 激活条目
             * @return {undefined} 无返回值
             */
            setActiveItem:function(item) {
                // 当前激活的条目
                this.activeItem = item;
                // 设置当前选中的key
                this.setCurrentKey(this.activeItem.key);
                // 触发事件
                this.$emit('select', this.activeItem);
            },
            // 设置当前的key
            setCurrentKey:function(key) {
                // 当前的key
                this.currentKey = key;
                // 触发事件
                this.$emit('changeTab', this.currentKey);
            },
            // 盖章不通过
            focusXsgzbtg:function(){
                this.showXsgzbtg = true;
            },
            blurXsgzbtg:function(){
                this.showXsgzbtg = false;
            },
            /**
             * 不予盖章
             */
            clickBtg: function () {
                this.objectZd = true;
                this.$refs.editSh.open();
            },
            /**
             * 验证盖章结论
             */
            vaildateShjl: function () {
                if (this.tgType == '2') {
                    this.$refs.btyyyTextArea.validate();
                    return this.btgyy.trim() !== "";
                }
                return true;
            },
            /**
             * 验证字数
             */
            vaildateShjlLength: function () {
                if (this.tgType == '2') {
                    this.$refs.btyyyTextArea.validate();
                    return this.btgyy.length <= 200;
                }
                return true;
            },
            clickSubmit: function () {
                if (!this.vaildateShjl()) {
                    Artery.notice.error({
                        title: '请填写必填项'
                    });
                } else if (!this.vaildateShjlLength()) {
                    Artery.notice.error({
                        title: '审核结论长度超过200'
                    });
                } else {
                    /*this.$refs.submitShModel.open();*/
                    this.submitSh();

                }
            },
            /**
             * @Author: wjing
             * @name: clickCancel
             * @description: 取消盖章弹窗
             * @param {type}
             * @return: {undefined}
             */
            clickCancel: function () {
                this.objectZd = false;
                this.btgyy = '';
            },
            getParamsFun:function(){
                var winParamStr = window.location.search.substring(1);
                this.cBh = getParam("bh");
                this.sqbs = getParam("sqbs");
                //单个获取参数函数
                function getParam(key){
                    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
                    var r = winParamStr.match(reg);
                    if(r == null){
                        return "";
                    }
                    return r[2];
                }

            },
            /**
             * 盖章
             */
            clickGz: function () {
                var _this = this;
                if (!!_this.isDebugger) {
                    // submitSh方法会关闭页面，所以后续不再设置gzConfirmButtonLoading为false
                    this.gzConfirmButtonLoading = true;
                    this.tgType = '1';//通过
                    _this.submitSh();
                } else {
                    _this.initQz();
                }
            },
            clickClose: function () {
                window.close();

            },
            /**
             * 初始化签章
             */
            initQz: function (/*callback*/) {
                var _this = this;
                Artery.ajax.get(this.dcYysqSrc, {
                    timeout: 50000,
                    params: {
                        isCover: "1",
                        operateuser: "rs_sd",
                        esealnames: "印章甲",
                        bh: this.bh,
                        sqbs: this.sqbs,
                        timestamp:new Date().getTime()
                    }

                }).then(function (result) {
                    if (result) {
                        // _this.info = result;
                        //将result的属性覆盖到info中去
                        Object.assign(_this.info, result);
                        if (!!_this.qzIframeSrc && !!result.status) {
                            _this.initSocketIO();
                            _this.info.extend = {"socketKey":_this.socketKey};
                            this.gzWindow = window.open(_this.qzIframeSrc + "?info=" + encodeURI(JSON.stringify(_this.info)));
                            /*var timer = setInterval(function () {
                                Artery.ajax.get("/api/v1/cxgz/zt?cxh=" + _this.bh + "&time=" + Date.now()).then(function (rs) {
                                    if (rs.data) {
                                        //刷新列表数据
                                        window.opener && window.opener.location.reload();
                                        window.close();
                                        console.log(window.opener);
                                        console.log("盖章阶段==>关闭盖章页面");
                                        _this.gzWindow.close();
                                        // window.close();
                                        clearInterval(timer);
                                    }
                                }).catch(function () {
                                    clearInterval(timer);
                                })
                            }, 500);*/
                            //将当前用户信息和jbxx 的编号缓存到服务器，以便回调中使用
                            Artery.ajax.get("/api/v1/cxgz/user?cxh=" + _this.bh);
                        }
                    }
                   /* if (callback && typeof callback === "function") {
                        callback();
                    }*/
                })
            },
            loadQzSrc: function () {
                var _this = this;
                Artery.ajax.get(this.dwjQzSrc).then(function (result) {
                    _this.info.page = /*_this.page +*/ '1';
                    _this.info.maxpage = '1';
                    _this.info.noteflag = "1";//noteflag为非必须要素，如果需要展示批注项按钮则传1，不展示传0
                    _this.info.extend={};
                    console.log("盖章methods:loadQzSrc===>:  ");
                    console.log(_this.info);
                   /* if (!!_this.info.status) {*/
                        _this.qzIframeSrc = result;// + "?info=" + encodeURI(JSON.stringify(_this.info));
                   /* } else {
                        console.log(_this.info)
                    }*/
                }).catch(function (error) {
                    console.log(error)
                })
            },
            /**
             * 获取盖章记录
             */
            getShjlList: function () {
                var _this = this;
                Artery.ajax.get(_this.gzjllbUrl+"?cxh=" + encodeURIComponent( _this.jbxx.cCxh))
                    .then(function (result) {
                    _this.shjlList = result;
                })
            },
            /**
             * 获取信息查询审批表信息接口
             */
            loadXxxcspb: function () {
                var _this = this;
                Artery.ajax.get(this.xxxcspbUrl + this.bh).then(function (result) {
                    if (result) {
                        _this.jbxxDataObj = result.jbxx;
                        _this.queriedObj.cxZrrList = result.cxZrrList;
                        _this.queriedObj.cxDwList = result.cxDwList;
                        _this.queriedObj.cxYhzhList = result.cxOtherList;
                        /* Artery.notice.success({
                             title: '获取信息查询审批表信息成功',
                         });*/
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                })
            },
            getDebugger: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/cxgz/debugger?time=" + Date.now()).then(function (result) {
                    _this.isDebugger = result;
                })
            },
            /**
             * 提交盖章提交
             */
            submitSh: function () {
                var _this = this;
                Artery.ajax.post(this.gzshUrl, {
                    bh: _this.bh,
                    gzjl: _this.tgType,//1通过2不通过
                    btgyy: _this.btgyy,
                    cxh: _this.jbxxDataObj.cCxh
                }).then(function (result) {
                    if (result.success) {
                        Artery.notice.success({
                            title: '提交盖章结论成功'
                        });
                    } else {
                        Artery.notice.error({
                            title: '操作不正确',
                            desc: result.message || ""
                        });
                    }

                    //通知上一个页面刷新待盖章表格数据
                    var data = {
                        flag:"SxDgz"/*刷新待盖章*/
                    }
                    var _data = JSON.stringify(data);
                    window.opener.parent.postMessage(_data, '*');

                    fdGlobal.readMessage(_this.bh).then(function (res) {
                        //关闭盖章并刷新待盖章列表页面
                        _this.closeEditShAndReload();
                    }).catch(function (err) {
                        _this.closeEditShAndReload();
                    });
                }).catch(function (error) {
                    Artery.notice.error({
                        title: '请求超时'
                    });
                    console.log(error);
                    //关闭盖章并刷新待盖章列表页面
                    // _this.closeEditShAndReload();
                });
            },
            /**
             * 关闭盖章并刷新待盖章列表页面
             */
            closeEditShAndReload: function () {
                this.$refs.editSh.close()
                window.opener && window.opener.location.reload();
                setTimeout(function () {
                    window && window.close();
                }, 1000);
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
                var baseWebSocketUrl = _config.dirProjectPath.replace('http', 'ws');
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
                var message = event.data;
                // console.log('Socket receive data:' + message);
                // var data = JSON.parse(message);
                //刷新列表数据
                window.opener && window.opener.location.reload();
                window.close();
            }
        },

        mounted: function () {
            // 页面一开始进来更新滚动条
            // this.$refs.spbScroll.update();
        },
        created: function () {
            var _this = this;
            var params = Artery.parseUrl();
            _this.bh = params.bh || '';
            _this.sqbs = params.sqbs || '';
            _this.loadXxxcspb();
            _this.getParamsFun();
            // _this.initQz(this.loadQzSrc);
            _this.loadQzSrc();
            /**
             * 获取审批记录
             */
            Artery.ajax.get("/api/v1/cxjcjl/getShjlByJbxxCid", {
                params: {
                    cId:  _this.cBh
                }
            }).then(function (result) {
                _this.spjlTable = result;
            });
            /**
             * 获取jbxx信息
             */
            Artery.ajax.get("/api/spd/getJbxxByCbh/"+_this.cBh, {
                params: {
                    cBh:  _this.cBh
                }
            }).then(function (result) {
                _this.jbxx = result.data;
                _this.getShjlList();
            });


            /**
             * 阅读书生接口
             */
            Artery.ajax.get("/api/v1/spb/view", {
                timeout: 50000,
                params: {
                    sqbh: _this.cBh,
                    sqbs: _this.sqbs,
                    type: "1",  //1: 地方  2: 中央
                    time: Date.now()
                }
            }).then(function (result) {
                if (result === 'dzurl') {
                    result =  '../../../../approval/cgdyyl/index.html?cBh='+_this.cBh;
                } else if(!(result && /(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(result))) {
                    Artery.notice.warning({
                        title: '无法连接上电子签章服务，请联系管理员',
                        desc: ''
                    });
                    return;
                }
                _this.ssUrl = encodeURI(result);
           });


            this.getDebugger();
        }
    });
    window.vm = vm;
    return vm;
})
