// 查询记录模块
define(['extend/template1.js', 'config'], function (template1, config) {
    var _config = JSON.parse(JSON.stringify(config));
    //  单独设置，便于调试
    _config.showLog = true;
    var vm = new Vue({
        el: '#jsSpb',
        mixins: [template1],
        cBh:"",
        sqbs:"",
        qzIframeSrc:"",

        data: function () {
            return {
                // 当前选中的页签
                tabName: 'spb',
                // 审批记录的table数据
                spjlTable: [],
                jbxx:{
                    cCxh:''
                },
                ssUrl:"",
                cBtgyy:"",
                //用来处理object层级过高
                objectZd: false,
                //多次用印申请
                dcYysqSrc: config.url.frame.dcYysqSrc,
                //获取多次用印接口
                dwjQzSrc: config.url.frame.dwjQzSrc,
                extend:"",
                isDebugger: true,
                //查询员审批通过url
                cxySptgUrl: config.url.frame.cxySpShtgUrl,
                //审批人审批通过url
                sprSptgUrl: config.url.frame.sprSptgUrl,
                //添加审批记录
                addSpjlUrl: config.url.frame.addSpjlUrl,
                isMultiple:true,
                sprId: '',
                sprName: '',
                xyhj: '1',
                currentSpr: '1',
                // 选中组织人员还是常用审批人
                isShowZzry: true,
                // 选中的审批人
                selectedSprStr: '',
                spr: {
                    ids: '',
                    names: ''
                },
                selectedNum: 0,
                isShowSprMenu:false,
                showAddSpr:true,
                // 常用审批人的list
                cysprList: [],
                // 树是复选框的时候v-model绑定的值，点击组织机构树的时候push进来的id集合（不带user_）
                splzOrganTree: [],
                // 选中的审批人的数组
                selectSprList:[],
                // 点击常用审批人的时候push进来的id集合（为了匹配组织机构树的数据手动拼接了user_）
                checkedIdsArr:[],
                // 审批不通过原因字数限制
                showSpbtg:false,
                webSocket: {},
                socketKey: "",
                tabList:[
                    {
                        key: 'spb',
                        name: '审批表'
                    },
                    {
                        key: 'spjl',
                        name: '审批记录'
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
            // 审批不通过
            focusSpbtg:function(){
                this.showSpbtg = true;
            },
            blurSpbtg:function(){
                this.showSpbtg = false;
            },
            // 点击不通过的按钮
            clickBtgsp: function() {
                this.objectZd = true;
                // 打开审批弹框
                this.$refs.btgSpModal.open();
            },
            sqbtgClose:function(){
                this.objectZd = false;
                this.cBtgyy = '';
            },
            spbtgCancel:function(){
                this.objectZd = false;
                this.cBtgyy = '';
            },
            spbtgOk:function(){
                var _this = this;
                if(_this.cBtgyy.length>300){
                	Artery.notice.warning({
                        title: '审批不通过失败',
                        desc:'审批结论不能超过300个字符，请重新输入'
                    });
                	return ;
                }else if(_this.cBtgyy.length==0){
                	Artery.notice.warning({
                        title: '审批不通过失败',
                        desc:'请输入审批不通过原因'
                    });
                	return ;
                }
                var p = {
                    "cBh":_this.cBh,
                    "cBtgyy":_this.cBtgyy,
                };
                //审批不通过
                Artery.ajax.post('/api/v1/cxsq/spbtg', p).then(function (result) {
                    if (result && result.code == "200") {
                    	if(result.zt==16){
                    		Artery.notice.warning({
                                title: '该审批单已被审批不通过，请稍后再试'
                            });
                    	}else{
                    		 Artery.notice.success({
                                 title: '审批不通过完成'
                             });
                    	}
                    	 var data = {
                                 flag:"SxDsp"/*刷新待审批*/
                             }
                             var _data = JSON.stringify(data);
                             window.opener.parent.postMessage(_data, '*');
                       window.close();
                    } else {
                        Artery.notice.error({
                            title: '审批不通过请求出错',
                            desc: result.message || ""
                        });
                    }
                });
                this.objectZd = false;
                this.$refs.btgSpModal.close();
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
            // 切换组织人员以及常用审批人
            clickZzryOrCyspr: function (param) {
                this.isShowZzry = param === '1';
            },

            // 点击审批流转弹窗的取消
            closeFqsp: function(){
            	 this.objectZd = false;
           	  	 var _this = this;
                 _this.spr.ids = '';
                 _this.spr.name = '';
                 _this.deleteAllSpr();
            },

            closeSprMenu: function(){
           	 this.isShowSprMenu = !this.isShowSprMenu;
           },

           sprCancel: function () {
               // var _this = this;
               this.isShowSprMenu = !this.isShowSprMenu;
           },
           // 点击出现选择审批人的下拉框
           xzsprInputFocus: function () {
               this.isShowSprMenu = !this.isShowSprMenu;
               this.isShowZzry = true;
               if (this.isShowSprMenu) {
                   // 阻止点击搜索框冒泡
                   $('.fd-user-tree .aty-tree-search .aty-input').click(function(e) {
                       var ev = e || window.event;
                       ev.stopPropagation();
                   })
                   // 阻止点击取消冒泡
                   $('.fd-user-tree .aty-tree-search .aty-icon').click(function(e) {
                       var ev = e || window.event;
                       ev.stopPropagation();
                   })
               }
           },
            // 点击选中title（复选框）
            clickTitle: function(param) {
                param.selected = !param.selected;
                var _this = this;
                if(param.selected){
                    if(!_this.isMultiple){
                        _this.deleteAllSpr();
                        param.selected = !param.selected;
                    }
                    var sprDetail = {
                        name:param.name,
                        code:param.code,
                        selected:true
                    }
                    _this.selectSprList.push(sprDetail);
                    _this.spr.ids = param.code;
                    //选中常用审批人则对应的组织人员里面的数据也要选中(为了和树中的id匹配进行user_的拼接)
                    _this.checkedIdsArr.push('user_'+ param.code);
                    _this.$refs.jsSplzTree.checkedIds = _this.checkedIdsArr;
                    _this.splzOrganTree.push(param.code);
                }else{
                    // 常用审批人取消选中
                    _this.selectSprList.forEach(function(item,index){
                        if(item.code === param.code){
                            _this.selectSprList.splice(index,1);
                        }
                    })
                    // 常用审批人取消选中的时候要将对应的组织人员中的也取消
                    _this.checkedIdsArr.forEach(function(item,index){
                        if(item === ('user_'+param.code)){
                            _this.checkedIdsArr.splice(index,1)
                        }
                    })
                    _this.splzOrganTree.forEach(function(item,index){
                        if(item === (param.code)){
                            _this.splzOrganTree.splice(index,1)
                        }
                    })
                    _this.$refs.jsSplzTree.checkedIds = _this.checkedIdsArr;
                }
                // 赋值审批人的选中
                _this.selectedNum = _this.selectSprList.length;
            },
            // 点击切换下一环节审批人或者结束审批
            clickSpr: function (param) {
                this.currentSpr = param;
                this.xyhj = param;
                if(param=='2'){
                	this.deleteAllSpr();
                	this.showAddSpr=false;
                }else{
                	this.showAddSpr=true;
                }
            },
            /**
             * @description 点击删除审批人
             */
            clickDelOnlySpr: function(param) {
                var _this = this;
                // 点击删除选中的审批人
                // 取消对应常用审批人里面的数据
                _this.cysprList.forEach(function(item,index){
                    if(item.code === param.code){
                        item.selected = false;
                    }
                })
                // 删除选中的审批人数组里面对应的数据
                _this.selectSprList.forEach(function(item,index){
                    if(item.code === param.code){
                        _this.selectSprList.splice(index,1);
                        _this.spr.ids = '';
                    }
                })
                // 取消对应组织人员里面的数据
                if (_this.selectSprList.length > -1) {
                    // 删除的已选中审批人在组织机构树中的下标
                    var closeCheckedIndex = _this.splzOrganTree.indexOf(param.code);
                    if (closeCheckedIndex > -1) {
                        // 取消组织人员对应的选中
                        if(_this.isMultiple){
                            _this.splzOrganTree.splice(closeCheckedIndex, 1);
                        } else if(!_this.isMultiple){
                            _this.splzOrganTree = '';
                        }
                        _this.checkedIdsArr.splice(closeCheckedIndex,1);
                        _this.$refs.jsSplzTree.checkedIds = _this.checkedIdsArr;
                    }
                }
                // 赋值选中的审批人的数量
                _this.selectedNum = _this.selectSprList.length;
            },
            // 选择组织人员树（单选）
            change: function (newValue, oldValue) {
                var _this = this;
                if(_this.isMultiple){
                    // 判断当前点击的是人还是其他组织机构
                    if (newValue.constructor === Array) {
                        // 把新值加入到选中审批人的数组中
                        // 先定义一个没去过重的数组
                        var moreValue = [];
                        for (var i = 0; i < newValue.length; i++) {
                            var sprDetail = {
                                name:newValue[i].name,
                                code:newValue[i].id,
                                selected:true
                            }
                            moreValue.push(sprDetail)
                        }
                        // 数组去重
                        _this.selectSprList = [];
                        var obj = {};
                        for(var i =0; i<moreValue.length; i++){
                            if(!obj[moreValue[i].code]){
                                _this.selectSprList.push(moreValue[i]);
                            }
                        }
                        // 组织人员勾选了则对应的常用审批人也要勾选
                        _this.cysprList.forEach(function(item,index){
                            _this.selectSprList.forEach(function(itemC,indexC){
                                if(item.code == itemC.code){
                                    item.selected = itemC.selected;
                                }
                            })
                        })
                        // 组织人员取消了则对应的常用审批人也要取消
                        _this.cysprList.forEach(function(item,index){
                            if(_this.splzOrganTree.indexOf(item.code) === -1){
                                item.selected = false;
                            }
                        })
                        // 赋值长度
                        _this.selectedNum = _this.selectSprList.length;
                    }
                }else{
                    if(newValue.type=='user'){
                        _this.deleteAllSpr();
                        var sprDetail = {
                            name:newValue.name,
                            code:newValue.id,
                            selected:true
                        }
                        _this.selectSprList.push(sprDetail);

                        _this.spr.ids = newValue.id;
                        // 单选的时候需要手动添加选中的id，v-model绑定的值不是数组是字符串
                        _this.splzOrganTree.push(newValue.id);
                        // 组织人员勾选了则对应的常用审批人也要勾选
                        _this.cysprList.forEach(function(item,index){
                            _this.selectSprList.forEach(function(itemC,indexC){
                                if(item.code == itemC.code){
                                    item.selected = itemC.selected;
                                }
                            })
                        })
                        // 已选中审批人的个数
                        _this.selectedNum = _this.selectSprList.length;
                    }
                }
            },
            deleteAllSpr: function(){
                var _this = this;
                // 清空选中的审批人数组
                _this.selectSprList = [];
                // 循环数据，处理取消选中
                $.each(_this.cysprList,function(index,val) {
                    val.selected = false;
                });
                // 清除已选的个数
                _this.selectedNum = 0;
                // 清空组织机构树上的选中
                _this.splzOrganTree = [];
                _this.checkedIdsArr = [];
                _this.spr.ids = '';
                _this.$refs.jsSplzTree.checkedIds = _this.checkedIdsArr;
            },
            // 点击审批流转弹窗的确认
            fqspSubmit:function(){
            	var _this = this;

                // 组装选择的审批人的id
                var sprIds = '';
                _this.selectSprList.forEach(function(item,index){
                    sprIds += item.code + ','
                })
            	 if (_this.xyhj == undefined || _this.xyhj == '') {
                     Artery.notice.warning({
                         title: '请选择流转程序'
                     });
                     return;
                 } else if (_this.xyhj == '1' && (sprIds == undefined || sprIds == '')) {
                     Artery.notice.warning({
                         title: '请选择下一环节审批人'
                     });
                     return;
                 }
            	_this.initQz();
            },

            clickPass: function () {
                var _this = this;

                if(!_this.isMultiple){
                	_this.objectZd = true;
                    _this.$refs.splzModal.open();
                    _this.cysprList = [];
                    Artery.ajax.get("/api/v1/cxsq/cyspr").then(function (result) {
                        for (var i = 0; i < result.data.length; i++) {
                            var spr = {
                                code: result.data[i].code,
                                name: result.data[i].name,
                                selected: false
                            }
                            _this.cysprList.push(spr);
                        }
                    });

                }else{
                    if (!!_this.isDebugger) {
                        // submitSh方法会关闭页面，所以后续不再设置gzConfirmButtonLoading为false
                        this.gzConfirmButtonLoading = true;
                        this.tgType = '1';
                        _this.passSp();
                    } else {
                        _this.initQz();
                    }
                }
            },
            clickClose: function () {
                window.close();
            },
            /**
             * 初始化签章
             */
            initQz: function () {
                var _this = this;
                Artery.ajax.get(_this.dcYysqSrc/*this.dwjYysqSrc"/api/v1/bgt/yysq/wjs""/api/v1/bgt/yysq/wj""/api/v1/bgt/plgz"*/, {
                    timeout: 50000,
                    params: {
                        isCover: "1",
                        operateuser: "rs_sd",
                        esealnames: "印章甲",
                        bh: _this.cBh,
                        sqbs: _this.sqbs,
                        timestamp:new Date().getTime()
                    }
                }).then(function (result) {

                    console.log(result)
                    if (result) {
                        _this.info = result;
                        _this.getCurrentInfo();
                    }
                })
            },
            getCurrentInfo:function(){
                var _this = this;
                var isMultiple = _this.isMultiple;
                var xyhj = _this.xyhj;
                var sprId = _this.spr.ids;
                Artery.ajax.post('/api/v1/cxsq/getCurrUserInfo', {}).then(function (result) {
                    console.log(result)
                    if (result) {
                    	if(!isMultiple){
                    		 _this.extend=/*JSON.stringify(*/{"businessType":"sp","userId":result.data.id,"sprId":sprId,"xyhj":xyhj}/*)*/;//此处必须传，方便在签章回调方法里判断了当前业务类型，以进行对应业务操作
                    	
                                    /*if(!_this.isMultiple){
                                        if (!!_this.isDebugger) {
                                            // submitSh方法会关闭页面，所以后续不再设置gzConfirmButtonLoading为false
                                            _this.gzConfirmButtonLoading = true;
                                            _this.tgType = '1';
                                            _this.passSp();
                                        } else {
                                            if (!!_this.qzIframeSrc) {

                                                _this.info.noteflag = "1";//noteflag为非必须要素，如果需要展示批注项按钮则传1，不展示传0
                                                _this.info.extend = _this.extend;

                                                if (_this.info.status == 'true') {
                                                    _this.$refs.splzModal.close();
                                                    _this.initSocketIO();
                                                    _this.info.extend.socketKey = _this.socketKey;
                                                    var gzWindow = window.open(_this.qzIframeSrc + "?info=" + encodeURI(JSON.stringify(_this.info)));
                                                    this.gzWindow = gzWindow
                                                }
                                            }
                                        }
                                    }*/
            

                    	
                    	}else{
                    		_this.extend=/*JSON.stringify(*/{"businessType":"sp","userId":result.data.id}/*)*/;
                    		// _this.loadQzSrc();
                    	}



                            if (!!_this.isDebugger) {
                                // submitSh方法会关闭页面，所以后续不再设置gzConfirmButtonLoading为false
                                _this.gzConfirmButtonLoading = true;
                                _this.tgType = '1';
                                _this.passSp();
                            } else {
                                if (!!_this.qzIframeSrc) {

                                    _this.info.noteflag = "1";//noteflag为非必须要素，如果需要展示批注项按钮则传1，不展示传0
                                    _this.info.extend = _this.extend;

                                    if (_this.info.status == 'true') {
                                        _this.$refs.splzModal.close();
                                        _this.initSocketIO();
                                        _this.info.extend.socketKey = _this.socketKey;
                                        var gzWindow = window.open(_this.qzIframeSrc + "?info=" + encodeURI(JSON.stringify(_this.info)));
                                        this.gzWindow = gzWindow
                                    }
                                }
                            }













                    }
                })
            },
            /**
             * 获取用印接口
             * page是当业务系统进行滚动时，通知书生客户端翻到第page页
             * 触发条件：1.初始化页面  2.当页码改变时，触发请求事件
             *
             */
            loadQzSrc: function () {
                var _this = this;
                Artery.ajax.get(_this.dwjQzSrc).then(function (result) {
                    // _this.info.page = '1';
                    // _this.info.maxpage = '1';
                    console.log("盖章methods:loadQzSrc===>:  ");
                    // console.log(_this.info);
                    // _this.info.noteflag = "1";//noteflag为非必须要素，如果需要展示批注项按钮则传1，不展示传0
                    // _this.info.extend = _this.extend;
                    // if (!!_this.info.status) {
                    //     console.log(JSON.stringify(_this.info))
                        _this.qzIframeSrc = result;// + "?info=" + encodeURI(JSON.stringify(_this.info));
                        console.log("_this.qzIframeSrc = ===>:  "+_this.qzIframeSrc);
                        /*if(!_this.isMultiple){
                            if (!!_this.isDebugger) {
                                // submitSh方法会关闭页面，所以后续不再设置gzConfirmButtonLoading为false
                                this.gzConfirmButtonLoading = true;
                                this.tgType = '1';
                                _this.passSp();
                            } else {
                                if (!!_this.qzIframeSrc) {
                                    var gzWindow = window.open(_this.qzIframeSrc);
                                    this.gzWindow = gzWindow

                                    var timer = setInterval(function () {
                                        Artery.ajax.get("/api/v1/cxsp/zt?cxh=" + _this.cBh + "&time=" + Date.now()).then(function (rs) {
                                            if (rs.data) {
                                                //刷新列表数据
                                                // window.opener && window.opener.location.reload();

                                                //通知上一个页面刷新待审批表格数据
                                                var data = {
                                                    flag:"SxDsp"/!*刷新待审批*!/
                                                }
                                                var _data = JSON.stringify(data);
                                                window.opener.parent.postMessage(_data, '*');

                                                console.log(window.opener);
                                                _this.gzWindow.close();
                                                window.close();
                                                clearInterval(timer);
                                            }
                                        }).catch(function () {
                                            clearInterval(timer);
                                        })
                                    }, 500);

                                }
                            }
                        }*/
                        // _this.qzIframeSrc = result + "?info=" + JSON.stringify(_this.info);
                    // } else {
                    //     console.log(_this.info)
                    // }

                }).catch(function (error) {
                    console.log(error)
                })
            },
            getDebugger: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/cxgz/debugger?time=" + Date.now()).then(function (result) {
                    _this.isDebugger = result;
                })
            },
            passSp: function () {
                var _this = this;
                var url="";
                if(_this.isMultiple){
                	url = _this.cxySptgUrl;
                	Artery.ajax.post(url, {
                        cBh: _this.jbxx.cBh,
                        cCxh: _this.jbxx.cCxh
                    }).then(function (result) {
                        if (result.success) {
                            Artery.notice.success({
                                title: '提交审批结论成功'
                            });
                        } else {
                            Artery.notice.error({
                                title: '操作不正确',
                                desc: result.message || ""
                            });
                        }
                        _this.closeEditShAndReload();
                    }).catch(function (error) {
                        Artery.notice.error({
                            title: '请求超时'
                        });
                        console.log(error);
                        _this.closeEditShAndReload();
                    });
                }else{
                	url = _this.sprSptgUrl;
                	Artery.ajax.post(url, {
                        cBh: _this.jbxx.cBh,
                        cCxh: _this.jbxx.cCxh,
                        sprId: _this.spr.ids,
                        xyhj: _this.xyhj
                    }).then(function (result) {
                        if (result.success) {
                            Artery.notice.success({
                                title: '提交审批结论成功'
                            });
                        } else {
                            Artery.notice.error({
                                title: '操作不正确',
                                desc: result.message || ""
                            });
                        }
                        _this.closeEditShAndReload();
                    }).catch(function (error) {
                        Artery.notice.error({
                            title: '请求超时'
                        });
                        console.log(error);
                        _this.closeEditShAndReload();
                    });
                }

            },
            getMultipleFlag: function (){
            	var _this = this;
            	Artery.ajax.get("/api/v1/cxsq/multiple").then(function (result) {
            		 if(result.code=='200'){
            			 _this.isMultiple = result.data;
            		 }

                 });
            },
            /**
             * 关闭盖章并刷新待盖章列表页面
             */
            closeEditShAndReload: function () {
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
            	window.opener && window.opener.location.reload();
                window.close();
            }
        },

        mounted: function () {
        	var _this = this;
            $(document).click(function () {
                _this.isShowSprMenu = false;
            })
            // 页面一开始进来更新滚动条
            // this.$refs.spbScroll.update();
        },
        created: function () {
            var _this = this;
            _this.getParamsFun();
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

            /**
             * 获取是否可以多选审批人
             */
        	Artery.ajax.get("/api/v1/cxsq/multiple").then(function (result) {
                if (result.code == '200') {
                    _this.isMultiple = result.data;
                    if (_this.isMultiple) {
                        // _this.initQz();
                    }
                }
            });
            this.loadQzSrc();
            this.getDebugger();
        }
    });
    window.vm = vm;
    return vm;
})