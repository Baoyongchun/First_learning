define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config,fdComponent2,fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    currentSpr: '1',
                    isShowSprMenu: false,
                    // 选中组织人员还是常用审批人
                    isShowZzry: true,
                    // 审批人的名字
                    userName: '',
                    cysprList: [],
                    cyspr:[],
                    isShowJsspMenu: true,
                    chooseEndPoint: true,
                    spjlData: [],
                    spr: {
                        ids:'',
                        names:''
                    },
                    isMultiple:true,
                    currentRow:{},
                    sprIds:[],
                    sprNames:'',
                    selectedNum:0,
                    // 选中的审批人
                    selectedSprStr: '',
                    // 是否展示审批流转弹窗的内容，主要是为了防止首页加载时就向后台请求数据
                    showSplzModelContent: false,
                    // 审批流转中树是复选框的时候v-model绑定的值，点击组织机构树的时候push进来的id集合（不带user_）
                    splzOrganTree: [],
                    // 选中的审批人的数组
                    selectSprList:[],
                    // 点击常用审批人的时候push进来的id集合（为了匹配组织机构树的数据手动拼接了user_）
                    checkedIdsArr:[]
                }
            },
            methods: {
                /**
                 *  * @Author nfj
                 *    @Date 2020/03/06
                 *    @description 打开提交审批的弹框
                 */
                modalCxsqTjsp_2:function (val) {
                    var _this = this;
                    _this.currentRow = val.data;
                    if(_this.currentRow.nZt!=undefined && _this.currentRow.nZt=='15'){
                    	_this.isShowJsspMenu = true;
                    }else{
                    	_this.isShowJsspMenu = false;
                    }

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
                    // _this.$refs.splzSelectSprlScroll && _this.$refs.splzSelectSprlScroll.update();
                    _this.getSpjlByCbh(val.data);
                    _this.selectedNum = 0;
                    _this.showSplzModelContent = true;
                    _this.$refs.splzModal.open();
                    // 是否要做重置？？？？？wjing
                    // _this.spr.ids = ''
                    // _this.spr.name = ''
                    // $('#sprUl').children().remove();
                    // // 循环数据，所有重置处理取消选中
                    // $.each(_this.cysprList,function(index,val) {
                    //     val.selected = false;
                    // });

                    _this.getMultipleFlag();
                },
                //关闭不通过原因modal
                closeYgzModalRefuseReason: function () {
                    this.$refs["splzModal"].close();
                },
                // 点击切换下一环节审批人或者结束审批
                clickSpr: function(param) {
                    this.currentSpr = param;
                    this.serverData.xyhj = param;
                    if(param=='2'){
                    	this.chooseEndPoint=false;
                    }else{
                    	this.chooseEndPoint=true;
                    }
                },
                // 点击出现选择审批人的下拉框
                xzsprInputFocus: function() {
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
                // 切换组织人员以及常用审批人
                clickZzryOrCyspr: function(param) {
                    this.isShowZzry = param === '1';
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
                    _this.splzOrganTree = [];
                    // _this.$refs.splzSelectSprlScroll && _this.$refs.splzSelectSprlScroll.update();
                },
                getMultipleFlag: function (){
                	var _this = this;
                	Artery.ajax.get("/api/v1/cxsq/multiple").then(function (result) {
                		 if(result.code=='200'){
                			 _this.isMultiple = result.data;
                		 }

                     });


                },
                // 选择组织人员树
                change: function (newValue, oldValue) {
                	var _this = this;
                    _this.spr.names = "";
                    _this.spr.ids = "";
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
                            _this.selectSprList.push(sprDetail)
                            // 单选的时候需要手动添加选中的id，v-model绑定的值不是数组是字符串
                            _this.splzOrganTree.push(newValue.id)
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

                sprCancel: function () {
                    this.isShowSprMenu = !this.isShowSprMenu;
                },
                // 点击审批流转弹窗的取消（需要此项操作来清空吗？？？wjing）
                fqspClose: function (){
                	  var _this = this;
                	  _this.spr.ids = '';
                     _this.spr.name = '';
                     _this.deleteAllSpr();

                },

                // 点击审批流转弹窗的确定
                fqspSubmit : function () {
                    var _this = this;
                    // 组装选择的审批人的id
                    var sprIds = '';
                    _this.selectSprList.forEach(function(item,index){
                        sprIds += item.code + ','
                    })
                    if( _this.serverData.xyhj==undefined || _this.serverData.xyhj==''){
                    	_this.serverData.xyhj='1';
                    }
                    if(_this.serverData.xyhj=='1' && (sprIds==undefined ||sprIds=='')){
                    	Artery.notice.warning({
                            title: '请选择下一环节审批人'
                        });
                    	return ;
                    }

                    if(sprIds!=undefined&& sprIds.length!=undefined && sprIds!='' && sprIds.charAt(sprIds.length-1) === ','){
                        sprIds = sprIds.substring(0,sprIds.length-1);
                    }
                    _this.serverData.sprIds = sprIds;
                    //将指定的下级审批人ID数组转为字符串连接
                    var obj={};
                    obj=JSON.parse(JSON.stringify(_this.serverData));
                    //线上审批模态框确定按钮事件(保存类型，1：暂存；2：生成审批表,3:发起审批)
                    obj.tJbxx = _this.currentRow;
                    _this.$refs.loadingModel.open();
                    Artery.ajax.post("/api/spd/applyAgain", obj,{timeout:300000}).then(function (result) {
                        if(result.code=='200'){
                            // 已选的个数等于li的长度
                            $('#sprUl').children().remove();
                            var data = {
                                flag:"Xstjsp",
                                message: 'shy-thsq'
                            }
                            var _data = JSON.stringify(data);
                            window.parent.postMessage(_data ,"*");
                            _this.$refs.loadingModel.close();
                            _this.$refs.splzModal.close();
                        }else if (result.code == '500') {
                        	Artery.notice.error({
                                desc: result.message || ""
                            });
                            _this.$refs.loadingModel.close();
                        }
                    });
                },
                //在编辑情况下，根据jbxx的主键获取c_cxh，再根据c_cxh来获取审批记录信息
                getSpjlByCbh:function(row) {
                    var _this = this;
                    Artery.ajax.get("/api/v1/cxjcjl/getShjlByJbxxCid?cId="+row.cBh).then(function (result) {
                        _this.spjlData = result;
                        setTimeout(function(){
                            // _this.$refs.splzSpjlScroll.update()
                        }, 100)
                    });

                },
                closeSprMenu: function(){
               	 this.isShowSprMenu = !this.isShowSprMenu;
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
                        _this.selectSprList.push(sprDetail)
                        //选中常用审批人则对应的组织人员里面的数据也要选中(为了和树中的id匹配进行user_的拼接)
                        _this.checkedIdsArr.push('user_'+ param.code)
                        _this.splzOrganTree.push(param.code);
                        _this.$refs.jsSplzTree.checkedIds = _this.checkedIdsArr;
                	}else{
                        // 点击常用审批人取消
                        _this.selectSprList.forEach(function(item,index){
                            if(item.code === param.code){
                                _this.selectSprList.splice(index,1);
                            }
                        })
                        // 点击常用审批人的取消的时候对应取消掉组织人员树中的数据
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
                }
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appOpenCxsqTjsp_2',this.modalCxsqTjsp_2);
            },
            mounted: function() {
                var _this = this;
                // 点击其他区域，隐藏弹框和树
                $(document).click(function() {
                    _this.isShowSprMenu = false;
                })
            },
            // 销毁弹窗
            destoried:function () {
                // 销毁
                fdEventBus.$off('appOpenCxsqTjsp_2',this.modalCxsqTjsp_2);
            }
        }
    });
