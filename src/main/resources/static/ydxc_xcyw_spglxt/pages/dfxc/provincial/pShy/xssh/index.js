// 查询记录模块
define(['extend/template1.js', 'extend/scspb.js', 'jquery', 'dragFun', 'config'], function (template1, scspb, jquery, dragFun, config) {
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
                //线下审批表的审核接口
                xxspbshUrl: config.url.frame.xxspbshUrl,
                //获取盖章记录接口
                gzjllbUrl: config.url.frame.gzjllbUrl,
                qzIframeSrc:"",
                //获取用印接口
                dwjQzSrc: config.url.frame.dwjQzSrc,
                //多图片用印申请
                dcYysqSrc: config.url.frame.dcYysqSrc,
                // 审核不通过原因字数限制
                showXsbtg:false,
                info:{},
                webSocket: {},
                socketKey: "",
                tabList:[
                    {
                        key: 'spb',
                        name: '审批表'
                    },
                    {
                        key: 'shjl',
                        name: '审核记录'
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
            // 审核不通过
            focusXsbtg:function(){
                this.showXsbtg = true;
            },
            blurXsbtg:function(){
                this.showXsbtg = false;
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
                this.$refs.editSh.close();
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
                    //动态获取license等信息，并打开用印页面
                    _this.initQz();
                }
            },
            clickPass: function () {

                var _this = this;
                if (!!_this.isDebugger) {
                    // submitSh方法会关闭页面，所以后续不再设置gzConfirmButtonLoading为false
                    this.gzConfirmButtonLoading = true;
                    this.tgType = '1';
                    _this.submitSh();
                } else {
                    if (!!_this.qzIframeSrc) {
                        _this.initSocketIO();
                        _this.info.extend.socketKey = _this.socketKey;//socketKey在方法initSocketIO初始化，所以需要先执行方法initSocketIO
                        var gzWindow = window.open(this.qzIframeSrc+ "?info=" + encodeURI(JSON.stringify(_this.info)));
                        this.gzWindow = gzWindow

                       /* var p = {
                            "cBh":_this.cBh
                        };

                        //审核通过(用户点击审核通过，弹出新页面还需用户自己点确认盖章，此处一律认为用户盖章了。审核通过)
                        Artery.ajax.post('/api/v1/cxsq/sptg', p).then(function (result) {
                            if (result && result.code == "200") {
                                if(result.zt==16){
                                    Artery.notice.warning({
                                        title: '该审批单已被审核不通过，请稍后再试'
                                    });
                                }else{


                                    //通知上一个页面刷新待审核表格数据
                                    var data = {
                                        flag:"SxDsh"/!*刷新待审核*!/
                                    }
                                    var _data = JSON.stringify(data);
                                    window.opener.parent.postMessage(_data, '*');

                                    Artery.notice.success({
                                        title: '审核通过完成'
                                    });
                                }

                            } else {
                                Artery.notice.error({
                                    title: '审核通过请求出错',
                                    desc: result.message || ""
                                });
                            }
                        });*/


                    }
                }
            },
            clickClose: function () {
                window.close();

            },
            /**
             * 发起多次用印申请，获取license等信息
             */
            initQz: function (/*callback*/) {
                var _this = this;
                Artery.ajax.get(
                    _this.dcYysqSrc
                    /*"/api/v1/bgt/plgz"*/
                    , {
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
                    if (result && !!result.status) {
                    // _this.info = result;
                        //将result的属性覆盖到info中去
                        Object.assign(_this.info, result);

                        if (!!_this.qzIframeSrc) {
                            Artery.ajax.post('/api/v1/cxsq/getCurrUserInfo', {}).then(function (result) {
                                _this.info.extend = { 'userId' : result.data.id };
                                _this.initSocketIO();
                                _this.info.extend.socketKey = _this.socketKey;//socketKey在方法initSocketIO初始化，所以需要先执行方法initSocketIO
                                var gzWindow = window.open(_this.qzIframeSrc+ "?info=" + encodeURI(JSON.stringify(_this.info)));
                                this.gzWindow = gzWindow;
                              /*  var timer = setInterval(function () {
                                    Artery.ajax.get("/api/v1/cxsh/zt?cxh=" + _this.bh + "&time=" + Date.now()).then(function (rs) {
                                        if (rs.data) {
                                            window.close();
                                            //刷新列表数据
                                            window.opener && window.opener.location.reload();
                                            console.log(window.opener)
                                            console.log("审核阶段==>关闭盖章页面")
                                            _this.gzWindow.close();
                                            // window.close();
                                            clearInterval(timer);
                                        }
                                    }).catch(function () {
                                        clearInterval(timer);
                                    })
                                }, 500)*/
                                Artery.ajax.get("/api/v1/cxgz/user?cxh=" + _this.bh)
                                //下面方法调用的本来是书生回调的接口，由于没有书生的key，无法盖章，导致
                                // 不能回调，此处发送一个本地请求，代替书生的回调，测试流程是否走的下去
                                /* Artery.ajax.get("/api/v1/mfile/qzhdtest?sqbs=" + _this.sqbs).then(function (result) {
                                     console.log(result)
                                 });*/
                            });

                        }


                    }
                   /* if (callback && typeof callback === "function") {
                        callback();
                    }*/
                })
            },
            loadQzSrc: function () {
                var _this = this;
                Artery.ajax.get(_this.dwjQzSrc/*"/api/v1/bgt/sp/getApplyMultiFileSealRequest"*/).then(function (result) {
                    _this.info.noteflag = "1";//noteflag为非必须要素，如果需要展示批注项按钮则传1，不展示传0
                    _this.info.extend="";
                    console.log("盖章methods:loadQzSrc===>:  ");
                    console.log(_this.info);
                    /*if (!!_this.info.status) {*/
                        _this.qzIframeSrc = result ;//+ "?info=" + encodeURI(JSON.stringify(_this.info));
                        console.log(_this.qzIframeSrc)
                   /* } else {
                        console.log(_this.info)
                    }*/
                }).catch(function (error) {
                    console.log(error)
                })
            },
            /**
             * 获取审核记录
             */
            getShjlList: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/getShjl"+"?cxh=" +encodeURI(_this.jbxx.cCxh)/*, {
                    params: {
                        cxh: _this.jbxxDataObj.cCxh
                    }
                }*/).then(function (result) {
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
             * 提交审核
             */
            submitSh: function () {
                var _this = this;
                Artery.ajax.post(this.xxspbshUrl, {
                    bh: this.bh,
                    spjl: this.tgType,
                    btgyy: this.btgyy
                }).then(function (result) {
                    if (result.success) {
                        Artery.notice.success({
                            title: '提交审核成功'
                        });
                    } else {
                        Artery.notice.error({
                            title: '操作不正确',
                            desc: result.message || ""
                        });
                    }
                    // _this.closeEditShAndReload();
                    //通知上一个页面刷新待盖章表格数据
                    var data = {
                        flag:"SxDsh"/*刷新待盖章*/
                    }
                    var _data = JSON.stringify(data);
                    window.opener.parent.postMessage(_data, '*');

                    window.close();
                }).catch(function (error) {
                    Artery.notice.error({
                        title: '请求超时'
                    });
                    console.log(error)
                    // _this.closeEditShAndReload();
                })


                // this.$refs.editSh.close();
                // this.$refs.submitShModel.close();
                // return flag;
            },
            okSpjlModal: function(){
                window.opener && window.opener.location.reload();
                window.close();
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
                if(message=='ysh'){
                    this.objectZd = true;
               	 	this.$refs.editWidiow.open();
               }else{                
               		window.opener && window.opener.location.reload();
                	window.close();
               }
                // console.log('Socket receive data:' + message);
                // var data = JSON.parse(message);
                //刷新列表数据

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
            //页面一加载，就获取用印的url（此url是固定的，而license等信息在点击“审核”按钮的时候再获取）
            _this.loadQzSrc();
            /**
             * 获取审核记录
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
                    result =  '../../../approval/cgdyyl/index.html?cBh='+_this.cBh;
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