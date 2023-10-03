/**
 * @version:	 		    2017.12.12
 * @createTime: 	 		2017.12.12
 * @updateTime: 			2017.12.12
 * @author:				    wusj
 * @description            appControllerToolBar.js页面下方的工具栏
 */
define('appControllerToolBar',['fdGlobal','config','vue'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     */
    function (fdGlobal,config,Vue,permission) {
        return function (rootScope) {
            // 这里写代码
        	//庭审系统调用增加缩放功能
        	if(rootScope=='contain'){
        		$('.fd-contain').css('transform-origin','0 0')
        	}else{
        		$('.fd-scroll-contain').css('transform-origin','0 0')
        	}
        	
            var _vm = new Vue({
                el: "#jsAppControllerToolBar",
                data:{
                    isVisible:false,
                    percent:100,
                    showOCR:false,/*是否显示ocr操作按钮*/
                    showYspcl:true,/*是否显示音视频卷的跳转按钮*/
                    selectedNodeInfo:null,//当前选中的节点
                    /*页面初始化的显示参数*/
                    curPage:0,/*当前页数*/
                    totalPage:0,/*总页数*/
                    /*放大缩小的相关参数*/
                    zoomWaperClass:"js-zoom-waper",
                    zoomTriggerClass:"js-zoom-trigger",
                    activeClass:"active",
                    zoomAble:false,//是否可以放大
                    zoomWaperWidth:0,//容器的宽度
                    TriggerWidth:0,//触发器宽度
                    zoomWaperOffsetLeft:0,/*容器距离左侧的宽度*/
                    maxLeft:0,/*最大相对位置*/
                    fixedX:0,/*鼠标和触发器的相对位置*/
                    triggerLeft:0,//触发器距离左侧的位置
                    increment:0,/*每次增加和减小的宽度*/
                    interval:6,//默认将缩略图分为6档(7,4,2,1,自适应高度，略微放大)
                    zoomLine:[],/**/
                    curInterval:0,//当前档位
                    oldInterval:0,//当前档位
                    /*thumbMaxInterval:rootScope.thumbMaxInterval,*///缩略图只显示7,4,2张缩略图
                    /*ocr的相关操作*/
                    ocrStatusHideDelay:1000,/*隐藏ocr状态延迟*/
                    ocrWaitList:[],/*需要进行ocr的列表*/
                    ocrFinishNum:0,/*ocr完成数量*/
                    ocrStatusEle:$('<div class="fd-window-ocr fd-hide fd-centerLayout loadding">ocr中...</div>'),/*ocr进度提示*/

                },
                // 方法
                methods: {
                    /*属性方法，当节点改变时需要改变是否显示ocr和音视频材料
                    updateBatchNode:function () {
                        this.batchNodeInfo=fdGlobal.getBatchNodeInfo();
                        刷新权限
                        this.uploadRight();
                    },
                    更新操作权限
                    uploadRight:function () {
                        var _this=this;
                        先设置默认状态
                        _this.setDefaultRight();

                        if(this.batchNodeInfo){
                            var _itemHead=_this.batchNodeInfo.itemHead;
                            var _type=_this.batchNodeInfo.type;
                            获取读写权限
                            var _writePermission=rootScope.appControllerPermission.isNodeHasWritePermission(_itemHead);
                            
                            * 具备ocr权限
                            * 并且具备写的权限
                            * 
                            if ($.inArray(_type,permission.ocr) != -1&&_writePermission) {
                                并且材料没有被ocr
                                var _stautus=parseInt(_itemHead.attr("data-ocrstate"));
                                并且ocr未成功,材料类型能够进行ocr时显示
                                * ocrState:
                                 0 已完成
                                 2  失败
                                 3  进行中
                                 4  新添加
                                 
                                if((_stautus==2 ||_stautus==null ||_stautus=="null")&&_this.getOcrType(_itemHead.attr("data-ot"))){
                                    this.showOCR=true;
                                }
                            }
                            是否具有查看音视频的权限
                            if(_type=="CAI_LIAO"&&_itemHead.find("."+fdGlobal.iconFuJianClss).length){
                                this.showYspcl=true;
                            }
                        }
                    },
                    设置默认权限
                    setDefaultRight:function () {
                        this.showOCR=false;
                        this.showYspcl=false;
                    },
                    刷新总页数
                    updateTotalPage:function (totalPage) {
                        this.totalPage=totalPage;
                    },
                    刷新总页数
                    updateCurPage:function (curPage) {
                        this.curPage=curPage;

                    },
                    updateCurPageByCurPageInPdf :function (curPageInPdf) {
                        var selectedNodeInfo = fdGlobal.getSelectedNodeInfo();
                        var  _pageIndexForFc = isNaN(selectedNodeInfo.dataPage) ?0:Number(selectedNodeInfo.dataPage);
                        this.curPage = _pageIndexForFc + curPageInPdf;
                    },
                    刷新总页数
                    updateCurPage:function (curPage) {
                        this.curPage=curPage;

                    },*/
                    /*初始化拖拽的参数*/
                    initZommParams:function () {
                        /*容器的宽度*/
                        this.zoomWaperWidth=$("."+this.zoomWaperClass).width();
                        /*触发器宽度*/
                        this.TriggerWidth=$("."+this.zoomTriggerClass).width();
                        /*最大拖拽位移*/
                        this.maxLeft=this.zoomWaperWidth-this.TriggerWidth;
                        /*每次增加和减小的宽度*/
                        this.increment=(this.zoomWaperWidth)/(this.interval-1);
                        /*初始化触发器的位置*/
/*                        this.triggerLeft=this.increment*this.curInterval-this.TriggerWidth/2;*/
                        this.updateTriggerPosition();
                        /*更新档位*/
                        this.updateInterval();
                        /*更新分割线的样式*/
                        for(var i=0;i<this.interval;i++){
                            this.zoomLine.push({
                                "left":(i*(1/(this.interval-1))*100).toFixed(2)+"%"
                            });
                        }
                    },
                    //阻止默认事件
                    preventDefault: function (event) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                    },

                    /*
                    * 绑定页面事件
                    * 这里主要是为了实现拖拽事件
                    * */
                    bindEvent: function () {
                        var _this=this;
                        $(this.$el).off("mousedown.toolbarZoom").on("mousedown.toolbarZoom", "."+this.zoomTriggerClass, function (event) {
                        	window.event? window.event.cancelBubble = true : event.stopPropagation();
                        	_this.zoomAble = true;
                            /*因为这个里面的按钮数目会改变，所以不准确*/
                            /*获取鼠标和触发器的相对位置*/
                            _this.fixedX=event.pageX-$("."+_this.zoomTriggerClass).offset().left;
                            /*容器距离左侧的宽度*/
                            _this.zoomWaperOffsetLeft=$("."+_this.zoomWaperClass).offset().left;
                            /*不然会产生复制拖拽事件，日了狗了*/
                            _this.preventDefault(event);
                            /*移动时绑定*/
                            $('body').off("mousemove.toolbarZoom").on("mousemove.toolbarZoom", function (event) {
                                _this.zoomAble && _this.moveTrigger(event);
                            });
                            /*鼠标释放时绑定*/
                            $('body').off("mouseup.toolbarZoom mouseleave.toolbarZoom").on("mouseup.toolbarZoom mouseleave.toolbarZoom", function (event) {
                                _this.clean();
                            })
                            
              /*              fdGlobal.stopPropagation(event);*/
                        })
                        $(this.$el).off("click").on("click", "."+this.zoomWaperClass, function (event) {
                        	window.event? window.event.cancelBubble = true : event.stopPropagation();
                            /*容器距离左侧的宽度*/
                            _this.zoomWaperOffsetLeft=$("."+_this.zoomWaperClass).offset().left;
                            _this.fixedX=_this.TriggerWidth/2;
                            _this.moveTrigger(event);
                        });
                    },
                    /*移动触发器*/
                    moveTrigger: function (event) {
                        /*计算触发器的位置*/
                        this.triggerLeft=event.pageX-this.fixedX-this.zoomWaperOffsetLeft;
                        this.updateTriggerPosition(this.triggerLeft);
                        this.updateInterval();
                    },
                    /*更新触发器的位置*/
                    updateTriggerPosition:function () {
                        /*不能够越界*/
                        if(this.triggerLeft>(this.maxLeft+10)){
                            this.triggerLeft=(this.maxLeft+10);
                            this.clean();
                        }else if(this.triggerLeft<(0-10)){
                            this.triggerLeft=0-10;
                            this.clean();
                        }
                        /*更新触发器的位置*/
                        $("."+this.zoomTriggerClass).css("left",this.triggerLeft+"px");
                    },
                    /*更新缩略图的档位*/
                    updateInterval:function () {
                        this.curInterval=Math.round(this.triggerLeft/this.increment);
                        /*更新全局档位*/
                        if(rootScope=='contain'){
                        	 $('.fd-contain').css('transform','scale('+ (1+parseFloat(this.curInterval/5)) +')')
                    	}else{
                    		 $('.fd-scroll-contain').css('transform','scale('+ (1+parseFloat(this.curInterval/5)) +')')
                    	}
                        
                        this.percent=parseFloat(this.curInterval/5)*100+100
                    },
                    /*刷新视图*/
                    clean: function () {
                        this.zoomAble = false;
                        this.fixedX = 0;
                        /*解除事件绑定*/
                        $('body').off("mousemove.zoom mouseup.zoom mouseleave.zoom");
                    },
                    //  初始化的方法
                    init:function(){
                        /*初始化拖拽的参数*/
                        this.initZommParams();
                        /*初始化缩略图或者是pdf图*/
                        this.updateTriggerPosition();
                        this.updateInterval();
                        /*初始化ocr*/
                       /* this.initOcr();*/
                        /*绑定页面事件*/
                        this.bindEvent();
                    },
                    /*initOcr:function () {
                        var _this=this;
                        _this.ocrStatusEle.appendTo($("body"));
                    },
                    获取材料的ocr类型
                    getOcrType:function (type) {
                        "doc,docx,wps,pdf,gif,jpg,jpeg,tif,tiff,bmp,png,xls,xlsx"
                        var _postfix=type;
                        if(_postfix=="jpg"||_postfix=="png"||_postfix=="gif"||_postfix=="jpeg"){
                            return "IMG";
                        }else if(_postfix=="doc"||_postfix=="docx"){
                            return "TXT";
                        }else if(_postfix=="pdf"){
                            return "PDF";
                        }else {
                            return false;
                        }
                    },
                    点击OCR事件
                    clickOCR:function ($event) {
                        标记为点击态
                        this.cleanActiveClass();
                        $($event.target).addClass(this.activeClass);

                        var _this = this;
                        var _selectedNodeInfo=fdGlobal.getSelectedNodeInfo();
                        var isExist=false;
                        if(_this.ocrWaitList.length){
                            先遍历元素是否已经在ocr
                            for(var i=0;i<_this.ocrWaitList.length;i++){
                                if(_this.ocrWaitList[i].id==_selectedNodeInfo.id){
                                    isExist=true;
                                    break;
                                }
                            }
                            不存在重复的才添加
                            if(!isExist){
                                将节点添加到orc等待序列
                                _this.ocrWaitList.push(_selectedNodeInfo)
                            }
                        }else{
                            将节点添加到orc等待序列
                            _this.ocrWaitList.push(fdGlobal.getSelectedNodeInfo());
                            _this.ocrHandler();
                        }
                    },
                    ocrHandler:function () {
                        var _this=this;
                        var _getSelectedNodeInfo = _this.ocrWaitList[_this.ocrFinishNum];
                        var _itemHead=_getSelectedNodeInfo.itemHead;
                        var _initParams = fdGlobal.getInitParams();
                        var _type = config.methodPost;
                        var _url = config.url.recognize;
                        var _query = {
                            ocrEntity:{
                                "fileProtocol":_itemHead.attr("data-originalfileprotocol"),
                                "id":_getSelectedNodeInfo.id,
                                "corpId":_initParams.jzInfo.unitId,
                                "zhxgsj":_itemHead.attr("data-time"),
                            },
                            fileOrigin:"PERSISTENCE_CL",
                            source:_this.getOcrType(_itemHead.attr("data-ot")),
                        };
                        _url = _url + "/"+_query.fileOrigin+"/doublePdf/"+_query.source;
                        $.ajax({
                            type: _type,
                            url: _url,
                            dataType:"json",
                            contentType:"application/json;charset=UTF-8",
                            data:JSON.stringify(_query.ocrEntity),
                            beforeSend:function () {
                                _this.ocrStatusEle.removeClass("error success").addClass("loadding").text("正在OCR...").show();
                            },
                            success: function (data, status, xhr) {
                                if(data.pdfFilePath !== "" && data.pdfFilePath!==undefined && data.pdfFilePath!==null && data.pdfFilePath!=="null"){
                                    _this.ocrStatusEle.removeClass("loadding").addClass("success").text("OCR成功");
                                    _this.onOcrSuccess();
                                    _this.ocrWaitList.splice(0,1);
                                    _this.batchNodeInfo.itemHead.attr("data-pdfprotocol",data.pdfFilePath);
                                    接口协议
                                    var path="/rest/v4/file?protocol=";
                                    获取ip+端口
                                    var host = window.location.host;
                                    拼接完整pdf获取路径   timeStamp  记录时间戳 是浏览器不使用缓存，请求最新的地址
                                    _this.batchNodeInfo.itemHead.attr("data-pdfurl","http://"+host+path+data.pdfFilePath+"&timeStamp="+ new Date().getTime());
                                    如果全部ocr了，那么隐藏提示
                                    if(!_this.ocrWaitList.length){
                                        setTimeout(function () {
                                            _this.ocrStatusEle.hide();
                                        },_this.ocrStatusHideDelay);
                                    }else{
                                        _this.ocrHandler();
                                    }
                                }else{
                                    this.error(data,status,xhr)
                                }
                            },
                            error: function (data, textStatus, errorThrown) {
                                var errorTxt = data.status == 423? data.responseJSON[0].message : "OCR失败";
                                _this.ocrStatusEle.removeClass("loadding").addClass("error").text(errorTxt);
                                _this.ocrWaitList.splice(0,1);
                                如果全部ocr了，那么隐藏提示
                                if(!_this.ocrWaitList.length){
                                    setTimeout(function () {
                                        _this.ocrStatusEle.hide();
                                    },_this.ocrStatusHideDelay);
                                }else{
                                    _this.ocrHandler();
                                }
                                //fdGlobal.requestError(data, textStatus, errorThrown);
                            }
                        });
                    },
                    ocr成功后执行
                    onOcrSuccess:function () {
                        标记为成功状态
                        $(".tree-hd-selected").attr("data-ocrstate","0");
                        $(".fd-cheked").find(".ocrfail").css("display","none");
                        $(".fd-centerLayout-h").find(".fd-trigger-ocr").css("display","none");
                    },
                    点击音视频材料事件
                    clickYspcl:function ($event) {
                        this.cleanActiveClass();
                        $($event.target).addClass(this.activeClass);
                        播放附件和目录树点击附件的功能是一样的
                        var _clId=this.batchNodeInfo.id;
                        rootScope.appControllerYspj.show();
                        rootScope.appControllerPdf.close();
                        rootScope.appControllerThumb.show();
                        rootScope.appControllerYxj.close();
                        选中对应的音视频文件
                        var _ele=rootScope.appControllerYspj.selectFirstFjNodeByClId(_clId);
                        获取音视频的地址
                        打开视频文件
                        rootScope.appControllerYspj.openPlayerWindow(_ele);
                    },
                    页数切换
                    keyupPageInput:function () {
                        只有处于pdf阅读模式下才有分页效果
                        if(rootScope.appControllerPdf.isVisible){
                            
                             * 先对发送过来的信息做一次验证
                             * 先检查发送的页码是否有效
                             * 
                            var selectedNodeInfo = fdGlobal.getSelectedNodeInfo();
                            var  _pageIndexForFc = isNaN(selectedNodeInfo.dataPage) ?0:Number(selectedNodeInfo.dataPage);
                            var _page=parseInt(this.curPage) -_pageIndexForFc;
                            if(_page>=1&&_page<=this.totalPage){
                                rootScope.appControllerPdf.changePage(_page);
                            }
                        }

                    },*/
                    /*点击缩小*/
                    clickRoomIn:function ($event) {
                        this.cleanActiveClass();
                        $($event.target).addClass(this.activeClass);
                        this.triggerLeft-=this.increment;
                        this.updateTriggerPosition();
                        /*更新档位*/
                        this.updateInterval();

                    },
                    /*点击放大*/
                   clickRoomOut:function ($event) {
                        this.cleanActiveClass();
                        $($event.target).addClass(this.activeClass);
                        this.triggerLeft+=this.increment;
                        this.updateTriggerPosition();
                        //更新档位
                        this.updateInterval();
                    },
                   /* 点击左旋
                    clickZx:function ($event) {
                        this.cleanActiveClass();
                        $($event.target).addClass(this.activeClass);
                        如果pdf可见那么旋转pdf
                        if(rootScope.appControllerPdf.isVisible){
                            rootScope.appControllerPdf.changeRotate(-90);
                        }else{
                            rootScope.appControllerThumb.changeRotate(-90);
                        }
                    },
                    点击右旋
                    clickYx:function ($event) {
                        this.cleanActiveClass();
                        $($event.target).addClass(this.activeClass);
                        如果pdf可见那么旋转pdf
                        if(rootScope.appControllerPdf.isVisible){
                            rootScope.appControllerPdf.changeRotate(90);
                        }else{
                            rootScope.appControllerThumb.changeRotate(90);
                        }
                    },
                    点击自适应
                    clickZsy:function (name,$event) {
                        //样式的处理
                        if($($event.target).hasClass(this.activeClass)){
                            this.curInterval=this.oldInterval;
                            $($event.target).removeClass(this.activeClass);
                            this.updateInterval();
                        }else{
                            //this.oldInterval=this.curInterval;
                            //this.curInterval=3;
                            this.cleanActiveClass();
                            $($event.target).addClass(this.activeClass);
                            更新档位
                            //新版本修改 不用处理档位的问题
                            //this.updateInterval();
                            显示pdf
                            显示对应的视图
                            if(!rootScope.appControllerPdf.isVisible){
                                rootScope.appControllerPdf.show();
                                rootScope.appControllerThumb.close();
                            }
                            rootScope.appControllerPdf.changeScale(name);
                        }
                    },
                    点击全屏
                    clickQp:function ($event) {
                        this.cleanActiveClass();
                        $($event.target).addClass(this.activeClass);
                        this.curInterval=5;
                        this.triggerLeft=this.increment*this.curInterval;
                        this.updateTriggerPosition();
                        更新档位
                        this.updateInterval();
                    },*/
                    /*清除选中样式*/
                    cleanActiveClass: function () {
                        $(this.$el).find("."+this.activeClass).removeClass(this.activeClass)
                    },
                    close:function () {
                        this.isVisible=false;
                        $(this.$el).hide();
                    },
                    show:function () {
                        this.isVisible=true;
                        $(this.$el).show();
                    }

                },
                // 更新数据后调用该函数
                updated: function () {
                },
                //  dom插入后调用该函数
                mounted: function () {
                    // 执行init的方法
                    this.init();
                    //更新档位
       /*             if(!rootScope.appControllerPermission.permission.writePermission){
                        this.curInterval=3;
                        this.triggerLeft=this.increment*this.curInterval;
                        //待入卷隐藏
                        this.updateTriggerPosition();
                        更新档位
                        this.updateInterval();

                    }*/
                },
                //  vm创建后调用该函数
                created: function () {

                }
            });
            return _vm;
        }

    });