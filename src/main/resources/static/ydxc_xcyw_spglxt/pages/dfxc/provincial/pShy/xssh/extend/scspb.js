/**
 * @version:                2018.10.14
 * @createTime:             2018.10.14
 * @updateTime:             2018.10.14
 * @author:                 liuxiaolong
 * @description             监督员登录=>查询申请记录
 */
define(['fdGlobal', 'config', 'vue', 'fdDataTable', 'scrollbar', 'fdComponent', "dragFun", 'userBehavior', 'jqueryUi', 'layDate'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     * @param fdDataTable
     */
    function (fdGlobal, config, Vue, fdDataTable, scrollbar, fdComponent, dragFun, userBehavior, jqueryUi, layDate) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var    hkey_root,hkey_path,hkey_key;

        hkey_root="HKEY_CURRENT_USER";

        hkey_path="\\Software\\Microsoft\\Internet   Explorer\\PageSetup\\";
        //设置网页打印的页眉页脚为空
        function   pagesetup_null()
        {

            try{

                var   RegWsh   =   new   ActiveXObject("WScript.Shell")

                hkey_key="header"

                RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")

                hkey_key="footer"

                RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")

            }catch(e){}

        }
        //用于设置打印参数

        function printBase() {

            factory.printing.header  = "";   //页眉

            factory.printing.footer = "";   //页脚

            factory.printing.portrait = false;   //true为纵向打印，false为横向打印

            factory.printing.leftMargin   =  2.96;

            factory.printing.topMargin   =   1.96;

            factory.printing.rightMargin   =   3.05;

            factory.printing.bottomMargin   =   2.96

        }
        //用于调用设置打印参数的方法和显示预览界面

        function printReport(){

            printBase();

            pagesetup_null();

            factory.printing.Preview();

        }
        //使界面最大化

        maxWin();

        function maxWin()

        {
            var aw = screen.availWidth;

            var ah = screen.availHeight;

            window.moveTo(0, 0);

            window.resizeTo(aw, ah);

        }



        function printTure()

        {

            printBase();

            //factory.printing.Preview();

            factory.printing.Print(false);


        }
        var Fragment,promiseRequest,promiseQrcode,promiseBarcode,bzFirst=true;
        var pageTotal;
        return {
            // 数据
            data: {
                name: '框架页主体信息',
                //信息查询
                serverUrlQueryXxcxspd: _config.url.frame.queryXxcxspd,
                //打印信息查询
                serverUrlQueryXxcxspdPrint: _config.url.frame.queryXxcxspdPrint,
                //二维码查询
                serverUrlQueryQrCode1: _config.url.frame.queryQrCode1,
                //条形码查询
                serverUrlQueryBarCode: _config.url.frame.querybarCode,
                serverUrlRecordPrintOperate: _config.url.frame.recordPrintOperate,
                //操作行为list
                jbxxDataObj:{},
                queriedObj:{
                    cxZrrList:[],
                    cxDwList:[],
                    cxCphList:[],
                    cxYhzhList:[],
                    cxSjhList:[],
                    cxNsrsbhList: []
                },
                //条形码
                barCodeList:[],
                cBh:'E36F3BAE98DD460EB48F36255B4878D8',
                cxrLx:'',
                browser:''
            },
            // 方法
            methods: {
                //信息查询请求
                request: function(cBh){
                    var _this= this;
                    var _promise=$.Deferred();
                    $.ajax({
                        method:config.methodGet,
                        url: _this.serverUrlQueryXxcxspd + '/' + cBh,
                        dataType:'json',
                        success: function (data) {
                            if(data.success){
                                _this.jbxxDataObj=data.data.jbxx;
                                // _this.queriedObj=data.data.queriedObjects;
                                // _promise.resolve(data.data)
                            }else {
                                // _promise.reject()
                            }

                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                        },
                        error: function (data,textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                    return _promise
                },
                //打印信息查询请求
                requestPrint: function(cBh){
                    var _this= this;
                    var _promise= $.Deferred();
                    $.ajax({
                        method:config.methodGet,
                        url: _this.serverUrlQueryXxcxspdPrint+"/"+cBh+"/"+browser,
                        dataType:'json',
                        success: function (data) {
                            if(data.success){
                                pageTotal= data.data.totalPage;
                                _promise.resolve(data.data)
                            }else {
                                _promise.reject()
                            }
                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                        },
                        error: function (data,textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                    return _promise;
                },
                //获取二维码
                requestQrcode: function(cBh){
                    var _this= this;
                    var _promise=$.Deferred();
                    // 20200423 盖章页面不需要获取二维码
                    return _promise;
                },
                //获取条形码
                requestBarcode: function(cBh){
                    var _promise=$.Deferred();
                    var _this= this;
                    $.ajax({
                        method:config.methodGet,
                        url: _this.serverUrlQueryBarCode,
                        data:{
                            "id":cBh,
                            "totalPage": pageTotal,
                            "width": "0",
                            "height":"40"
                        },
                        dataType:'json',
                        success: function (data) {
                            if(data.success){
                                _this.barCodeList=data.data;
                                _promise.resolve(data.data)
                            }else {
                                _promise.reject()
                            }
                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                        },
                        error: function (data,textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                    return _promise
                },
                //打印
                clickPrint: function(){
                    if(fdGlobal.checkBrowser().browser=="IE"||fdGlobal.checkBrowser().browser=="Edge"){//ie

                        /*$('.js-page-zs').addClass('fd-hide');
                          $('.js-page-print').removeClass('fd-hide');
                          window.print();
                         $('.js-page-print').addClass('fd-hide');
                        $('.js-page-zs').removeClass('fd-hide');*/
                        $('.js-page-zs').addClass('fd-hide');
                        $('.js-page-print').removeClass('fd-hide');
                        printReport();
                        $('.js-page-print').addClass('fd-hide');
                        $('.js-page-zs').removeClass('fd-hide')
                    }else{//chrome
                        $('.js-page-zs').addClass('fd-hide');
                        $('.js-page-print').removeClass('fd-hide');
                        if(fdGlobal.checkBrowser().version >=50){
                            window.print();
                        }else{
                            var res = document.execCommand('print');
                            $('.js-page-print').addClass('fd-hide');
                            $('.js-page-zs').removeClass('fd-hide')
                        }
                    }
                    this.recordPrintOperate();
                },
                recordPrintOperate: function() {
                    $.get(this.serverUrlRecordPrintOperate + '/' + this.bh, function (res) {
                        if(res.success) {
                            console.log('打印成功');
                        }
                    });
                },
                //截取参数
                getParamsFun:function(){
                    var params={};
                    var winParamStr = window.location.search.substring(1);
                    //给全局变量案件赋值
                    params.cBh = getParam("cBh");
                    params.cxrLx = getParam("cxrLx");
                    //单个获取参数函数
                    function getParam(key){
                        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
                        var r = winParamStr.match(reg);
                        if(r == null){
                            return "";
                        }
                        return r[2];
                    }
                    return params;
                },
                transUndefined:function(val){
                    return (val===undefined || val==null)?'':val;
                },
                clickPrintYl:function(){
                    $('.js-page-zs').addClass('fd-hide');
                    $('.js-page-print').removeClass('fd-hide');
                },
                clickOutPrintYl:function(){
                    $('.js-page-print').addClass('fd-hide');
                    $('.js-page-zs').removeClass('fd-hide');
                },
                //通过n值获取c值
                getStrByN:function(num1,num2){
                    var str=fdGlobal.getString(num1,num2);
                    return str;
                },
                dateFormatM : function(value){

                    if(value == null||value == ""){
                        return '';
                    }
                    if(typeof(value)!='string'){
                        return '';
                    }
                    //把毫秒替换掉，ie不支持
                    var dateStr = value.replace(/\.\d{3}/, "");
                    dateStr = dateStr.replace(/-/g, "/");
                    var date = new Date(dateStr);

                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? '0' + m : m;
                    var d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    return y + '年' + m + '月' + d+'日';
                }
            },
            filters : {
                dateFormat : function(value){
                    if(value == null||value == ""){
                        return '';
                    }
                    if(typeof(value)!='string'){
                        return '';
                    }
                    //把毫秒替换掉，ie不支持
                    var dateStr = value.replace(/\.\d{3}/, "");
                    dateStr = dateStr.replace(/-/g, "/");
                    var date = new Date(dateStr);

                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? '0' + m : m;
                    var d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    return y + '年' + m + '月' + d+'日';
                }
            },
            computed: {
            },
            // 更新数据后调用该函数
            updated: function () {


            },
            //  dom插入后调用该函数
            mounted: function () {
                var _this = this;
                if(fdGlobal.checkBrowser().browser=="IE"){
                    $('head').append('<style type="text/css">'+
                        '.fd-table-wraper01 {'+
                        'height: 792px;'+
                        '}'+
                        '.fd-table-wraper01.first{'+
                        'height:  792px;'+
                        '}'+
                        '.fd-table-wraper01.last{'+
                        'height: auto;'+
                        '}'+
                        '.fd-inner-wraper.first{'+
                        'height: 1000px;width: 673px;'+
                        '}'+
                        '.fd-leader-wraper{'+
                        'width: 673px;'+
                        '}'+
                        '.fd-print-page .fd-barCode.first{'+
                        'top: 635px!important;'+
                        '}'+
                        '</style>')
                };
                promiseRequest.then(function(data){
                    var tableDomStr='<div class="fd-table-wraper01">'+
                        '<table class="fd-table-02" cellpadding="0" cellspacing="0" style="width: 100%;">'+
                        '<tbody class="js-table-01">'+
                        '</tbody >'+
                        '</table> '+
                        '</div>';
                    /*表格头部内容*/
                    var headTitleDomStr='<div class="fd-print-area">'+
                        '<h1 class="fd-font-SimSun">信息查询审批表</h1>'+
                        '<div class="clearfix fd-title-04">'+
                        '<span class="fd-fl fd-font-yahei">查询号：'+ _this.transUndefined(data.jbxx.cCxh)+'</span>'+
                        '<span class="fd-fr fd-font-yahei">申请时间：'+ _this.dateFormatM(data.jbxx.dSqrq)+'</span>'+
                        '</div>'+
                        '</div>';
                    var headDomStr='<tr>'+
                        '<td colspan="2" class="fd-td-label fd-font-yahei">申请单位</td>'+
                        '<td colspan="4" class="fd-td-text">'+ _this.transUndefined(data.jbxx.cSqdwMc) +'</td>'+
                        '<td colspan="2" class="fd-td-label fd-font-yahei">申请部门</td>'+
                        '<td colspan="2" class="fd-td-text">'+ _this.transUndefined(data.jbxx.cSqbmMc) +'</td>'+
                        '</tr>'+
                        '<tr>'+
                        '<td colspan="2" class="fd-td-label fd-font-yahei">查询申请人</td>'+
                        '<td colspan="4" class="fd-td-text">'+ _this.transUndefined(data.jbxx.cQqrMc) +'</td>'+
                        '<td colspan="2" class="fd-td-label fd-font-yahei">协助查询人</td>'+
                        '<td colspan="2" class="fd-td-text">'+ _this.transUndefined(data.jbxx.cXzqqrMc) +'</td>'+
                        '</tr>'+
                        '<tr>'+
                        '<td colspan="2" class="fd-td-label fd-font-yahei">事由</td>'+
                        '<td colspan="8" class="fd-td-text">'+ _this.transUndefined(data.jbxx.cQqrMc) +'</td>'+
                        '</tr>'+
                        '<tr>'+
                        '<td colspan="2" class="fd-td-label fd-font-yahei">审批权限</td>'+
                        '<td colspan="8" class="fd-td-text" >'+ (!data.jbxx.cSpqx ? "":("此件由"+_this.transUndefined(data.jbxx.cSpqx)+"审批")) +'</td>'+
                        '</tr>'+
                        '<tr class="fd-footer-tr">'+
                        '<td colspan="2" class="fd-td-label fd-font-yahei fd-height-200">领导批示</td>'+
                        '<td colspan="8" class="fd-height-200-relative"></td>'+
                        '</tr>';
                    //为了兼容ie使用打印控件scriptX控件时，第一页旋转之后底部打印不出来的问题，需要将打印不出来部分定位到第一页打印范围内，然后旋转拼接到表格上
                    var leaderDomStr='<div class="fd-leader-wraper">'+
                        '<table class="fd-table-02 leader" cellpadding="0" cellspacing="0" style="width: 100%;">'+
                        '<tbody class="js-table-0">'+
                        '</tbody >'+
                        '</table> '+
                        '<div class="clearfix fd-title-05" >'+
                        '<span class="fd-fl fd-font-yahei">承办人：'+_this.transUndefined(data.jbxx.cCbrMc)+'</span>'+
                        '<span class="fd-fr fd-font-yahei">联系方式：'+ _this.transUndefined(data.jbxx.cLxfs) +'</span>'+
                        '</div>'+
                        '</div>';


                        $('.js-table-0').append(headDomStr);
                        $('.fd-inner-wraper.first').prepend(headTitleDomStr);
                        $('.js-page-print').append(leaderDomStr)
                    var cBh =_this.getParamsFun().cBh;
                    promiseBarcode=_this.requestBarcode(_this.bh);
                     $.each(data.pages,function(index,item){
                        // 添加二维码
                        $.each(item.sections,function(sIndex,sItem){
                            if(sItem=='二维码'){
                                var qrCodeDomStr='';
                                //二维码添加到页面
                                promiseQrcode.then(function(data){
                                    $.each(_this.qrCodeList,function(index,item){
                                        qrCodeDomStr+= '<li class="fd-item"><img src="'+item +'"/></li>';
                                    });
                                    qrCodeDomStr=  '<ul class="fd-ul-qrCode">'+
                                        qrCodeDomStr +
                                        '</ul>';
                                    $('.fd-print-area').append(qrCodeDomStr);
                                },function(){
                                    console.log('请求数据失败');
                                });
                            }
                        });
                    });
                    //条形码添加到页面
                    promiseBarcode.then(function(data){
                        var length = data.length === 0 ? 0 : 1;
                        for(var i=0;i<length;i++){
                            if(fdGlobal.checkBrowser().browser=="IE"){
                                //如果是ie打印的
                                var barCodeDomStr='<div class="fd-barCode '+ (i==0?'first':'') +'" style="top:'+ (650 + 793*i) +'px"><img  src="'+ data[i] +'" /></div>';
                                var pageNoDomStr='<div class="fd-pageNo '+ (i==0?'first':'') +'" style="top:'+ (650 + 793*i) +'px">第'+(i+1)+'页  共'+ pageTotal+'页</div>';
                            }else{
                                if(fdGlobal.checkBrowser().version < 50){
                                    //如果是chrome浏览器打印的
                                    var barCodeDomStr='<div class="fd-barCode '+ (i==0?'first':'') +'" style="top:'+ (684 + 744*i) +'px"><img  src="'+ data[i] +'" /></div>';
                                    var pageNoDomStr='<div class="fd-pageNo '+ (i==0?'first':'') +'" style="top:'+ (684 + 744*i) +'px">第'+(i+1)+'页  共'+pageTotal+'页</div>';
                                }else{
                                    //如果是chrome浏览器打印的
                                    var barCodeDomStr='<div class="fd-barCode '+ (i==0?'first':'') +'" style="top:'+ (732 + 792*i) +'px"><img  src="'+ data[i] +'" /></div>';
                                    var pageNoDomStr='<div class="fd-pageNo '+ (i==0?'first':'') +'" style="top:'+ (732 + 792*i) +'px">第'+(i+1)+'页  共'+pageTotal+'页</div>';
                                }
                            }
                            $('.js-page-print, .js-page-zs').append(barCodeDomStr).append(pageNoDomStr);
                        }
                    },function(e){
                        console.log('请求数据失败');
                    });
                },function(){
                    console.log('请求数据失败');
                });
            },
            //  vm创建后调用该函数
            created: function () {
                //获取信息
                var _this = this;
                var params = Artery.parseUrl();
                this.bh = params.bh || '';
                if(fdGlobal.checkBrowser().browser=="IE"){
                    browser="IE";
                    $("#xxcxspdcss").attr('href','../css/module-xxcxspd-ie.css');
                } else if(fdGlobal.checkBrowser().browser=="Firefox") {
                    browser="Firefox";
                } else if(fdGlobal.checkBrowser().browser=="Chrome"){
                    if(fdGlobal.checkBrowser().version < 50){
                        browser="chromelow";
                        $("#xxcxspdcss").attr('href','../css/module-xxcxspd-chromelow.css');
                    }else{
                        browser="chrome";
                        $("#xxcxspdcss").attr('href','../css/module-xxcxspd.css');
                    }
                }else{
                    $("#xxcxspdcss").attr('href','../css/module-xxcxspd.css');
                }
                _this.cBh =_this.getParamsFun().cBh;
                _this.cxrLx=_this.getParamsFun().cxrLx;
                _this.request(_this.bh);
                promiseRequest=_this.requestPrint(_this.bh);
                promiseQrcode=_this.requestQrcode(_this.bh);
                //打印监听
                if(fdGlobal.checkBrowser().browser="Chrome" && fdGlobal.checkBrowser().version >=50){
                    var afterPrint = function() {
                        $('.js-page-print').addClass('fd-hide');
                        $('.js-page-zs').removeClass('fd-hide');
                    };

                    var mediaQueryList = window.matchMedia('print');
                    mediaQueryList.addListener(function(mql) {
                        if (mql.matches) {
                            /*beforePrint();*/
                        } else {
                            afterPrint();
                        }
                    });
                }
                //禁用浏览器的backspace默认回退事件
                document.onkeypress = function (e) {
                    var ev = e || window.event;//获取event对象
                    var obj = ev.target || ev.srcElement;//获取事件源
                    var t = obj.type || obj.getAttribute('type');//获取事件源类型
                    if (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"&& t != "number") {
                        return false;
                    }
                }
                document.onkeydown = function (e) {
                    var ev = e || window.event;//获取event对象
                    var obj = ev.target || ev.srcElement;//获取事件源
                    var t = obj.type || obj.getAttribute('type');//获取事件源类型
                    if (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"&& t != "number") {
                        return false;
                    }
                }
                var counter = 0;
                if (window.history && window.history.pushState) {
                    $(window).on('popstate', function () {
                        window.history.pushState('forward', null, '#');
                        window.history.forward(1);
                    });
                }

                window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
                window.history.forward(1);

            }
        }



    });
