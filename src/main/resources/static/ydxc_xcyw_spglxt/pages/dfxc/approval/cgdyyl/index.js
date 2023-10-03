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
            factory.printing.header  = "";  //页眉

            factory.printing.footer = "";  //页脚

            factory.printing.portrait = false;  //true为纵向打印，false为横向打印

            factory.printing.leftMargin   =  2.96;

            factory.printing.topMargin   =   1.96;

            factory.printing.rightMargin   =   3.05;

            factory.printing.bottomMargin   =   2.96;

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
        var _vm = new Vue({
            // 控制器id
            el: '#jsAppControllerXxcxspd',
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
                    cxNsrsbhList: [],
                    cxXtcpbmList:[],
                    cxLccpbmList:[],
                    cxBxbdhList:[],
                    cxShdmList:[],
                    cxShddhList: [],
                    cxQgdxxList: [],
                    cxKddhList: [],
                },
                //条形码
                barCodeList:[],
                cBh:'E36F3BAE98DD460EB48F36255B4878D8',
                cxrLx:'',
                showPrintButton: false,
                browser:'',
                positions: [{
                    pageNumber: 789,
                    barcode: 789
                }],
                cbcMcAndSqrq: ''
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
                                data.data.jbxx.nMgxx= data.data.jbxx.nMgxx==1?"是":"否";
                                _this.jbxxDataObj=data.data.jbxx;
                                _this.queriedObj=data.data.queriedObjects;
                                _this.cxrLx=data.data.role;
                                _this.showPrintButton = data.data.showPrintButton;
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
                                _this.computeHeight(793, 793);
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
                    $.ajax({
                        method:config.methodGet,
                        url: _this.serverUrlQueryQrCode1+"/"+cBh,
                        dataType:'json',
                        data:{
                            "width":0,
                            "height":0
                        },
                        success: function (data) {
                            if(data.success){
                                _this.qrCodeList=data.data;
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
                            "width": "350",
                            "height":"55"
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
                        $('.js-page-zs').addClass('fd-hide');
                        $('.js-page-print').removeClass('fd-hide');
                        printReport();
                        $('.js-page-print').addClass('fd-hide');
                        $('.js-page-zs').removeClass('fd-hide');
                    }else{//chrome
                        $('.js-page-zs').addClass('fd-hide');
                        $('.js-page-print').removeClass('fd-hide');
                        if(fdGlobal.checkBrowser().browser ==="Firefox"){
                            window.print();
                        }
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
                    $.get(this.serverUrlRecordPrintOperate + '/' + this.cBh, function (res) {
                        if(res.success) {
                            var dataBj = {
                                flag: "scspbOpen",
                                _data: {}
                            };
                            var _data = JSON.stringify(dataBj);
                            if(window.opener) {
                                if(window.opener.opener) {
                                    window.opener.opener.postMessage(_data, '*');
                                    window.opener.opener.parent.location.reload();
                                } else {
                                    window.opener.postMessage(_data, '*');
                                    window.opener.parent.location.reload();
                                }
                            }
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
                },
                /**
                 * 根据字符串是否为空使用不同的值
                 * @param obj 要判断的对象
                 * @param emptyStr 为空时使用的值
                 * @param notEmptyStr 不为空时使用的值，如果参数为undefiend或者null，返回对象值
                 * @return {string}
                 */
                ifEmptyStr: function (obj, emptyStr, notEmptyStr) {
                    if((obj || '') === '') {
                        return emptyStr;
                    } else {
                        if(!notEmptyStr) {
                            notEmptyStr = obj;
                        }
                        return notEmptyStr;
                    }
                },
                computeHeight: function (pageNumberHeight, barcodeHeight) {
                    var browserInfo = fdGlobal.checkBrowser();
                    this.positions = [];
                    for (var i = 0; i < pageTotal + 1; i++) {
                        this.positions.push({
                            pageNumber: pageNumberHeight * i - 78,
                            barcode: barcodeHeight * i - 78
                        });
                    }
                },
                dateFormatNow: function (value){
                    if (value === null || value === '') {
                        return '';
                    }
                    if (typeof value !== 'string') {
                        return '';
                    }
                    // 把毫秒替换掉，ie不支持
                    var dateStr = value.replace(/\.\d{3}/, '');
                    dateStr = dateStr.replace(/-/g, '/');
                    var date = new Date(dateStr);
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? '0' + m : m;
                    var d = date.getDate();
                    d = d < 10 ? '0' + d : d;
                    var h = date.getHours();
                    h =  h < 10 ? '0' +  h :  h;
                    var min = date.getMinutes();
                    min =  min < 10 ? '0' +  min :  min;
                    var s = date.getSeconds();
                    s =  s < 10 ? '0' +  s :  s;
                    return y + '.' + m + '.' + d + ' '+h+":"+min+":"+s;
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
                        'height: 793px;'+
                        '}'+
                        '.fd-table-wraper01.first{'+
                        'height: 793px;'+
                        '}'+
                        '.fd-table-wraper01.last{'+
                        'height: auto;'+
                        '}'+
                        '.fd-inner-wraper.first{'+
                        'height: 1000px;width: 700px;'+
                        '}'+
                        '.fd-leader-wraper{'+
                        'width: 700px;'+
                        '}'+
                        '.fd-print-page .fd-barCode.first{'+
                        'top: 635px!important;'+
                        '}'+
                        '</style>')
                };
                promiseRequest.then(function(data){
                    _this.cbcMcAndSqrq =  _this.transUndefined(data.jbxx.cCbrMc) +'/时间:'+ _this.dateFormatNow(data.jbxx.dSqrq);
                    var tableDomStr='<div class="fd-table-wraper01">'+
                        '<table class="fd-table-02" cellpadding="0" cellspacing="0" style="width: 100%;" border="1">'+
                        '<tbody class="js-table-01">'+
                        '</tbody >'+
                        '</table> '+
                        '</div>';
                    /*表格头部内容*/
                    var headTitleDomStr='<div class="fd-print-area">'+
                        '<h1 class="fd-title-02">信息查询审批表</h1>'+
                        '<div class="clearfix fd-title-04">'+
                        '<span class="fd-fl">查询号：'+ _this.transUndefined(data.jbxx.cCxh)+'</span>'+
                        '<span class="fd-fr">申请时间：'+ _this.dateFormatM(data.jbxx.dSqrq)+'</span>'+
                        '</div>'+
                        '</div>';
                    var leaderHeight = 321;
                    var leaderLineHeight = 253;
                    if(data.jbxx.cSqdwMc.length > 9 || data.jbxx.cSqbmMc.length > 9) {
                        leaderHeight = leaderHeight - 30;
                        leaderLineHeight = leaderLineHeight - 30;
                    }
                    if(data.jbxx.cQqrMc.length > 9 || data.jbxx.cXzqqrMc.length > 9) {
                        leaderHeight = leaderHeight - 30;
                        leaderLineHeight = leaderLineHeight - 30;
                    }
                    var headDomStr='<tr>'+
                        '<td colspan="2" class="fd-td-label fd-20">查询申请人</td>'+
                        '<td colspan="3" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.cQqrMc) +'</td>'+
                        '<td colspan="2" class="fd-td-label fd-20">申请单位</td>'+
                        '<td colspan="3" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.cSqdwMc) +'</td>'+
                        '</tr>'+
                        '<tr>'+
                        '<td colspan="2" class="fd-td-label fd-20">协助查询人</td>'+
                        '<td colspan="3" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.cXzqqrMc) +'</td>'+
                        '<td colspan="2" class="fd-td-label fd-20">申请部门</td>'+
                        '<td colspan="3" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.cSqbmMc) +'</td>'+
                        '</tr>'+
                        '<tr>'+
                        '<td colspan="2" class="fd-td-label fd-20">事由</td>'+
                        '<td colspan="3" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.cxsyMc) +'</td>'+
                        '<td colspan="2" class="fd-td-label fd-20">是否敏感信息</td>' +
                        '<td colspan="3" class="fd-td-text fd-30">' + _this.transUndefined(data.jbxx.nMgxx==1?"是":"否") + '</td>' +
                        '</tr>'+
                        '<tr>'+
                        '<td colspan="2" class="fd-td-label">查询审批权限</td>'+
                        '<td colspan="8" class="fd-td-text" style="font-size:20px;text-align: left;text-indent: 2em">'+
                        '按照《关于加强纪检监察机关信息查询平台监督管理工作的意见》(中纪办发〔2022〕4号)规定的审批权限报批。'+
                        '</td>'+
                        '</tr>'+
                        // '<tr>'+
                        // '<td colspan="2" class="fd-td-label fd-height-120">申请部门意见</td>'+
                        // '<td colspan="8" class="fd-td-text fd-height-120"></td>'+
                        // '</tr>'+

                        '<tr class="fd-height-52">'+
                            '<td colspan="2" style="border-bottom: none;text-align: center;" class="fd-height-52 fd-td-label ">承办部门</td>'+
                            '<td colspan="8" style="border-bottom: none;text-align: center;" class=" fd-td-text" ></td>'+
                        '</tr>'+
                        '<tr class="fd-height-52">'+
                        '<td colspan="2" style="border-top: none;text-align: center;" class="fd-height-52 fd-td-label ">意&nbsp;&nbsp;见</td>'+
                        '<td colspan="8" style="border-top: none;text-align: center;" class=" fd-td-text ">'+
                            '<span >签名：</span>'+
                        '</td>'+
                         '</tr>'+

                        '<tr class="fd-height-52">'+
                        '<td colspan="2" style="border-bottom: none;text-align: center;" class="fd-height-52 fd-td-label ">协管领导</td>'+
                        '<td colspan="8" style="border-bottom: none;text-align: center;" class=" fd-td-text" ></td>'+
                        '</tr>'+
                        '<tr class="fd-height-52">'+
                        '<td colspan="2" style="border-top: none;text-align: center;" class="fd-height-52 fd-td-label ">意&nbsp;&nbsp;见</td>'+
                        '<td colspan="8" style="border-top: none;text-align: center;" class=" fd-td-text ">'+
                        '<span >签名：</span>'+
                        '</td>'+
                        '</tr>'+

                        '<tr class="fd-height-52">'+
                        '<td colspan="2" style="border-bottom: none;text-align: center;" class="fd-height-52 fd-td-label ">分管领导</td>'+
                        '<td colspan="8" style="border-bottom: none;text-align: center;" class=" fd-td-text" ></td>'+
                        '</tr>'+
                        '<tr class="fd-height-52">'+
                        '<td colspan="2" style="border-top: none;text-align: center;" class="fd-height-52 fd-td-label ">意&nbsp;&nbsp;见</td>'+
                        '<td colspan="8" style="border-top: none;text-align: center;" class=" fd-td-text ">'+
                        '<span >签名：</span>'+
                        '</td>'+
                        '</tr>'+

                        '<tr class="fd-height-52">'+
                        '<td colspan="2" style="border-bottom: none;text-align: center;" class="fd-height-52 fd-td-label ">委主要负责人</td>'+
                        '<td colspan="8" style="border-bottom: none;text-align: center;" class=" fd-td-text" ></td>'+
                        '</tr>'+
                        '<tr class="fd-height-52">'+
                        '<td colspan="2" style="border-top: none;text-align: center;" class="fd-height-52 fd-td-label ">意&nbsp;&nbsp;见</td>'+
                        '<td colspan="8" style="border-top: none;text-align: center;" class=" fd-td-text ">'+
                        '<span >签名：</span>'+
                        '</td>'+
                        '</tr>'+

                        '<tr class="fd-footer-tr">'+
                        '<td colspan="2" style="text-align: center;" class="fd-height-52 fd-td-label">备注</td>'+
                        '<td colspan="8" class=" fd-td-text" style="font-family: fangsong;text-align: left;text-indent: 2em">'+ _this.transUndefined(data.jbxx.bz) +
                        '</td>'+
                        '</tr>';
                    //为了兼容ie使用打印控件scriptX控件时，第一页旋转之后底部打印不出来的问题，需要将打印不出来部分定位到第一页打印范围内，然后旋转拼接到表格上
                    var leaderDomStr='<div class="fd-leader-wraper2">'+
                        '<table class="fd-table-02 leader" cellpadding="0" cellspacing="0" style="width: 100%;">'+
                        '<tbody class="js-table-0">'+
                        '</tbody >'+
                        '</table> '+
                        // '<div class="clearfix fd-title-05">'+
                        // '<span class="fd-fl">查询申请人：'+_this.transUndefined(data.jbxx.cCbrMc)+'</span>'+
                        // '<span class="fd-fr">查询申请人联系方式：'+ _this.transUndefined(data.jbxx.cLxfs) +'</span>'+
                        // '</div>'+
                        // '<div class="clearfix fd-title-05">'+
                        // '<span class="fd-fl">审核员：</span>'+
                        // '<span class="fd-fr" style="margin-right: 158px;">审核员联系方式：</span>'+
                        // '</div>'+
                        '</div>';
                    // 监督检查审查调查对象表格 标题
                    var jdjcscTitleDomStr=' <h1 class="fd-font-SimSun">监督检查审查调查对象</h1>';
                    // 监督检查审查调查对象表格 内容
                    if(data.jbxx.bcsm==null ){
                        data.jbxx.bcsm="";
                    }
                    var jdjcscDomStr='<table class="fd-table-02 fd-table-left" cellpadding="0" cellspacing="0" style="width: 100%;" border="1">'+
                        '<tbody class="js-table-01">'+
                        '<tr>'+
                        '<td colspan="5" class="fd-td-label fd-20">监督检查审查调查<br />对象姓名</td>'+
                        '<td colspan="7" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.cDcdxxm) +'</td>'+
                        '<td colspan="5" class="fd-td-label fd-20">监督检查审查调<br />查对象职务</td>'+
                        '<td colspan="7" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.cZw) +'</td>'+
                        '</tr>'+
                        '<tr>'+
                        '<td colspan="5" class="fd-td-label fd-20">监督检查审查调查<br />对象职级</td>'+
                        '<td colspan="7" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.zjMc) +'</td>'+
                        '<td colspan="5" class="fd-td-label fd-20">监督检查审查调查<br />对象干部管理权限</td>'+
                        '<td colspan="7" class="fd-td-text fd-30">'+ _this.transUndefined(data.jbxx.permissionName) +'</td>'+
                        '</tr>'+
                        '<tr >'+
                        '<td colspan="5" class="fd-td-label fd-20">监督检查审查调查<br />对象工作单位</td>'+
                        '<td colspan="19" class="fd-td-text" >'+ _this.transUndefined(data.jbxx.cGgdw) +'</td>'+
                        '</tr>'+
                        '<tr >'+
                        '<td colspan="5" class="fd-td-label fd-10">补充说明</td>'+
                        '<td colspan="19" class="fd-td-text"  readonly="true" disabled="disabled">'+
                         (data.jbxx.bcsm.indexOf("1")>=0?"☑":"□")+
                            '指定管辖&nbsp;'+
                     (data.jbxx.bcsm.indexOf("2")>=0?"☑":"□")+
                        '交办案件&nbsp;'+
                     (data.jbxx.bcsm.indexOf("3")>=0?"☑":"□")+
                        '“双管”公职人员案件&nbsp;'+
                     (data.jbxx.bcsm.indexOf("4")>=0?"☑":"□")+
                        '协助其他纪检监察机关查询&nbsp;'+
                        '</td>'+
                        '</tr>'+
                        '</tbody >'+
                        '</table> ';
                    //定向查询标题
                    var dxcxTitleDomStr=' <h1 class="fd-font-SimSun">查询对象</h1>';
                    //定向查询标题
                    var hsTitleDomStr=' <h1 class="fd-font-SimSun">查询对象</h1>';
                    $.each(data.pages,function(index,item){
                        $('.js-page-print').append('<div class="fd-table-wraper01 '+ (index==0?"first":"") + (index == data.pages.length-1?"last":"")+ ' table'+index+'">'+
                            '<div class="fd-inner-wraper ' + (index==0?"first":"")+ ' table'+index+'">'+
                            '<table class="fd-table-02" cellpadding="0" cellspacing="0" style="width: 100%;">'+
                            '<tbody class="js-table-'+ index +'">'+
                            '</tbody >'+
                            '</table> '+
                            '</div>'+
                            '</div>');
                        if (index > 0) {
                            $('.js-page-zs').append('<div class="fd-table-wraper01 '+ (index==0?"first":"") + (index == data.pages.length-1?"last":"")+ ' table'+index+'">'+
                                '<div class="fd-inner-wraper ' + (index==0?"first":"")+ ' table'+index+'">'+
                                '<table class="fd-table-02" cellpadding="0" cellspacing="0" style="width: 100%;">'+
                                '<tbody class="js-table-'+ index +'">'+
                                '</tbody >'+
                                '</table> '+
                                '</div>'+
                                '</div>');
                        }
                        if(index==0){
                            $('.js-table-'+index).append(headDomStr);
                            $('.fd-inner-wraper.first').prepend(headTitleDomStr);
                            $('.js-page-print').append(leaderDomStr)
                        };
                        $.each(item.sections,function(sIndex,sItem){
                            if(sItem=='查询主体标题'){
                                $('.fd-inner-wraper.table'+index).prepend(dxcxTitleDomStr);
                            };
                        });
                        //如果存在核实对象
                        if(item.queriedObjects){
                            //定向查询自然人
                            if(item.queriedObjects.cxZrrList!==undefined){
                                if(item.queriedObjects.cxZrrList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxZrrList.length+1)+'"'+'style='+(item.queriedObjects.cxZrrList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">自<br/>然<br/>人</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">姓名</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">证件号</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxZrrDomStr='';
                                $.each(item.queriedObjects.cxZrrList,function(zIndex,zItem){
                                    cxZrrDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(zItem.nXh==undefined?'':(zItem.nXh+1)) +'</td>'+
                                        '<td colspan="2">'+_this.transUndefined(zItem.cXm) +'</td>'+
                                        '<td colspan="6">'+
                                        _this.ifEmptyStr(zItem.cZjhm, '', zItem.cZjhm + '</br>') +
                                        '<span style="font-size: 16px;">'+_this.ifEmptyStr(zItem.zjlxName, '', '（' +zItem.zjlxName+'）') +'</span>'+
                                        '</td>'+
                                        '<td colspan="3">'+_this.transUndefined(zItem.zjName)+
                                        '<td colspan="4">'+_this.transUndefined(zItem.gbglqxName)+'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(zItem.cCxxMc)+'</td>'+
                                        '</tr>'
                                });
                                $('.js-table-'+index).append(cxZrrDomStr);
                            };
                            //定向查询机构
                            if(item.queriedObjects.cxDwList!==undefined){
                                if(item.queriedObjects.cxDwList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxDwList.length+1)+'"'+'style='+(item.queriedObjects.cxDwList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">企业机构</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">企业/机构名称</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">证照号码</div></td>'+
                                        /* '<td ><div class="fd-td-div">延伸查询</div></td>'+*///是否延伸查询暂时隐藏
                                        '<td colspan="10"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxDWDomStr='';
                                $.each(item.queriedObjects.cxDwList,function(dIndex,dItem){
                                    cxDWDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(dItem.nXh==undefined?'':(dItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(dItem.cMc) +'</td>'+
                                        '<td colspan="6">'+
                                        _this.ifEmptyStr(dItem.cTyshxxdm, '', dItem.cTyshxxdm + '</br>') +
                                        '<span style="font-size: 16px;">' + _this.ifEmptyStr(dItem.zjlxName, '', '（' + dItem.zjlxName +'）') +'</span>' +
                                        '</td>'+
                                        /*'<td >'+_this.transUndefined(dItem.nSfyscxTranslateText) +'</td>'+*/
                                        '<td colspan="10">'+_this.transUndefined(dItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                });
                                $('.js-table-'+index).append(cxDWDomStr);
                            };
                            //定向查询车牌号
                            if(item.queriedObjects.cxCphList!==undefined){
                                if(item.queriedObjects.cxCphList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxCphList.length+1)+'"'+'style='+(item.queriedObjects.cxCphList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">机<br/>动<br/>车</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">车牌号</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxCphDomStr='';
                                $.each(item.queriedObjects.cxCphList,function(cIndex,cItem){
                                    cxCphDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxCphDomStr);
                            };
                            //定向查询银行账号
                            if(item.queriedObjects.cxYhzhList!==undefined){
                                if(item.queriedObjects.cxYhzhList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxYhzhList.length+1)+'" style='+(item.queriedObjects.cxYhzhList.length>=1?'"line-height:26px;"':'"line-height:16px;"')+'><div class="fd-td-div fd-font-kaiti">银行账号</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">银行账号</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxYhzhDomStr='';
                                $.each(item.queriedObjects.cxYhzhList,function(yIndex,yItem){
                                    cxYhzhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(yItem.nXh==undefined?'':(yItem.nXh+1)) +'</td>'+
                                        '<td colspan="5">'+(yItem.cValue==null?'':(yItem.cValue)) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(yItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(yItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(yItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(yItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxYhzhDomStr);
                            };
                            //定向查询手机号
                            if(item.queriedObjects.cxSjhList!==undefined){
                                if(item.queriedObjects.cxSjhList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxSjhList.length+1)+'"'+'style='+(item.queriedObjects.cxSjhList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">手<br/>机<br/>号</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">手机号</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxSjhDomStr='';
                                $.each(item.queriedObjects.cxSjhList,function(cIndex,cItem){
                                    cxSjhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxSjhDomStr);
                            };
                            //定向查询信托
                            if(item.queriedObjects.cxXtcpbmList!==undefined){
                                if(item.queriedObjects.cxXtcpbmList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxXtcpbmList.length+1)+'"'+'style='+(item.queriedObjects.cxXtcpbmList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">信托产品编码</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">信托产品编码</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxSjhDomStr='';
                                $.each(item.queriedObjects.cxXtcpbmList,function(cIndex,cItem){
                                    cxSjhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxSjhDomStr);
                            };
                            //定向查询理财
                            if(item.queriedObjects.cxLccpbmList!==undefined){
                                if(item.queriedObjects.cxLccpbmList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxLccpbmList.length+1)+'"'+'style='+(item.queriedObjects.cxLccpbmList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">理财产品编码</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">理财产品编码</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxSjhDomStr='';
                                $.each(item.queriedObjects.cxLccpbmList,function(cIndex,cItem){
                                    cxSjhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxSjhDomStr);
                            };
                            //定向保险保单号
                            if(item.queriedObjects.cxBxbdhList!==undefined){
                                if(item.queriedObjects.cxBxbdhList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxBxbdhList.length+1)+'"'+'style='+(item.queriedObjects.cxBxbdhList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">保险保单号<br/></div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">保险保单号</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxSjhDomStr='';
                                $.each(item.queriedObjects.cxBxbdhList,function(cIndex,cItem){
                                    cxSjhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxSjhDomStr);
                            };
                            //定向商户代码
                            if(item.queriedObjects.cxShdmList!==undefined){
                                if(item.queriedObjects.cxShdmList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxShdmList.length+1)+'"'+'style='+(item.queriedObjects.cxShdmList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">商户代码</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">商户代码</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxSjhDomStr='';
                                $.each(item.queriedObjects.cxShdmList,function(cIndex,cItem){
                                    cxSjhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxSjhDomStr);
                            };
                            //定向商户订单
                            if(item.queriedObjects.cxShddhList!==undefined){
                                if(item.queriedObjects.cxShddhList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxShddhList.length+1)+'"'+'style='+(item.queriedObjects.cxShddhList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">商户订单号</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">商户订单号</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxSjhDomStr='';
                                $.each(item.queriedObjects.cxShddhList,function(cIndex,cItem){
                                    cxSjhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxSjhDomStr);
                            };
                            //定向签购单
                            if(item.queriedObjects.cxQgdxxList!==undefined){
                                if(item.queriedObjects.cxQgdxxList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxQgdxxList.length+1)+'"'+'style='+(item.queriedObjects.cxQgdxxList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">签购单信息</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">签购单信息</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxSjhDomStr='';
                                $.each(item.queriedObjects.cxQgdxxList,function(cIndex,cItem){
                                    cxSjhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxSjhDomStr);
                            };
                            //定向快递单号
                            if(item.queriedObjects.cxKddhList!==undefined){
                                if(item.queriedObjects.cxKddhList.length!=0){
                                    $('.js-table-'+index).append('<tr>'+
                                        '<td class="fd-td-50" rowspan="'+(item.queriedObjects.cxKddhList.length+1)+'"'+'style='+(item.queriedObjects.cxKddhList.length>=1?"line-height:26px;":"line-height:16px;")+'><div class="fd-td-div fd-font-kaiti">快递单号</div></td>'+
                                        '<td colspan="2"><div class="fd-td-div">序号</div></td>'+
                                        '<td colspan="5"><div class="fd-td-div">快递单号</div></td>'+
                                        '<td colspan="4"><div class="fd-td-div">号码所属对象姓名/名称</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">职级</div></td>'+
                                        '<td colspan="3"><div class="fd-td-div">干部管理权限</div></td>'+
                                        '<td colspan="6"><div class="fd-td-div">查询项</div></td>'+
                                        '</tr>');
                                };
                                var cxSjhDomStr='';
                                $.each(item.queriedObjects.cxKddhList,function(cIndex,cItem){
                                    cxSjhDomStr+= '<tr class="fd-List-tr">'+
                                        '<td colspan="2">'+(cItem.nXh==undefined?'':(cItem.nXh+1))  +'</td>'+
                                        '<td colspan="5">'+_this.transUndefined(cItem.cValue) +'</td>'+
                                        '<td colspan="4">'+_this.transUndefined(cItem.cName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.nZjName) +'</td>'+
                                        '<td colspan="3">'+_this.transUndefined(cItem.gbglqxName) +'</td>'+
                                        '<td colspan="6">'+_this.transUndefined(cItem.cCxxMc) +'</td>'+
                                        '</tr>'
                                })
                                $('.js-table-'+index).append(cxSjhDomStr);
                            }
                        };
                        $.each(item.sections,function(sIndex,sItem){
                            if(sItem=='备注'){
                                var newNote = item.note.replace( /^[" "|"　"]+/, "&nbsp;&nbsp;&nbsp;&nbsp;");
                                if(fdGlobal.checkBrowser().browser=="IE") {
                                    newNote = newNote.replace(/&nbsp;/g, '&ensp;');
                                }
                                var bzDomStr =	'<div class="fd-bz-box">'+
                                    '<div>'+
                                    (bzFirst==true?'<p class="fd-font-heiti">备注：</p>':'')+
                                    '<p>'+ newNote +'</p>'+
                                    '</div>'
                                '</div>';
                                $('.fd-inner-wraper.table'+index).append(bzDomStr);
                                bzFirst=false;
                            };
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

                                    $('.fd-inner-wraper.table'+index).append(qrCodeDomStr);
                                },function(){
                                    console.log('请求数据失败');
                                });
                            }
                        })
                        // 插入 监督检查审查调查对象 表
                        if(index === 1){
                            $('.fd-inner-wraper.table1').prepend(jdjcscDomStr);
                            $('.fd-inner-wraper.table1').prepend(jdjcscTitleDomStr);
                        };
                    });
                    var cBh =_this.getParamsFun().cBh;
                    promiseBarcode=_this.requestBarcode(cBh);
                    //条形码添加到页面
                    promiseBarcode.then(function(data){
                        for(var i=0;i<data.length;i++){
                            if(fdGlobal.checkBrowser().browser=="IE"){
                                var firstCode = '';
                                if (i === 0) {
                                    firstCode = '<div class="fd-barCode first"><img src="'+ data[i] +'"/></div>' +
                                        '<div class="fd-pageNo first">承办人：'+_this.cbcMcAndSqrq +'/第1页  共'+ pageTotal+'页</div>';

                                    $('.js-page-print, .js-page-zs .fd-print-area').append(firstCode);
                                    continue
                                }
                                //如果是ie打印的(条形码以及分页的样式，微调nfj)
                                var barCodeDomStr='<div class="fd-barCode '+ (i==0?'first':'') +'" style="top:'+ _this.positions[i+1].barcode +'px"><img src="'+ data[i] +'"/></div>';
                                var pageNoDomStr='<div class="fd-pageNo '+ (i==0?'first':'') +'" style="top:'+ _this.positions[i+1].pageNumber +'px">第'+(i+1)+'页  共'+ pageTotal+'页</div>';
                                // 打印页面的高度
                                $('.js-page-print').css('height',(725 + 793*(data.length-1))-20+'px');
                                // 非打印页面的高度
                                $('.fd-page-zs').css('height',(725 + 793*(data.length-1))+50+'px');
                                // // 二維碼的
                                // $('.fd-ul-qrCode').css('top',(725 + 753*(data.length-1) + 40*(data.length-2) - 173)+'px');
                            }else{
                                var firstCode = '';
                                if (i === 0) {
                                    firstCode = '<div class="fd-barCode2 fd-chrome-page first"><img src="'+ data[i] +'"/></div>' +
                                        '<div class="fd-pageNo2 first">承办人：'+_this.cbcMcAndSqrq +'/第1页  共'+pageTotal+'页</div>';
                                    $('.js-page-print, .js-page-zs .fd-print-area').append(firstCode);
                                    continue
                                }
                                if(fdGlobal.checkBrowser().version < 50){
                                    //如果是chrome浏览器打印的
                                    var barCodeDomStr='<div class="fd-barCode '+ (i==0?'first':'') +'" style="top:'+ (684 + 744*i) +'px"><img src="'+ data[i] +'"/></div>';
                                    var pageNoDomStr='<div class="fd-pageNo '+ (i==0?'first':'') +'" style="top:'+ (684 + 744*i) +'px">承办人：'+_this.cbcMcAndSqrq +'/第'+(i+1)+'页  共'+pageTotal+'页</div>';
                                }else{
                                    //如果是chrome浏览器打印的
                                    var barCodeDomStr='<div class="fd-barCode fd-chrome-page '+ (i==0?'first':'') +'" style="top:'+ (_this.positions[i+1].barcode + 30) +'px"><img src="'+ data[i] +'"/></div>';
                                    var pageNoDomStr='<div class="fd-pageNo '+ (i==0?'first':'') +'" style="top:'+ _this.positions[i+1].pageNumber +'px">承办人：'+_this.cbcMcAndSqrq +'/第'+(i+1)+'页  共'+pageTotal+'页</div>';
                                }
                                // 打印页面的高度
                                $('.js-page-print').css('height',(732 + 792*(data.length-1))+10+'px');
                                // 非打印页面的高度
                                $('.fd-page-zs').css('height',(732 + 792*(data.length-1))+30+'px');
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
                if(fdGlobal.checkBrowser().browser=="IE"){
                    browser="IE";
                    $("#xxcxspdcss").attr('href','../css/module-xxcxspd-ie.css');
                }else if(fdGlobal.checkBrowser().browser=="Firefox"){
                    browser="Firefox";
                }else if(fdGlobal.checkBrowser().browser=="Chrome"){
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
                _this.request(_this.cBh);
                promiseRequest=_this.requestPrint(_this.cBh);
                promiseQrcode=_this.requestQrcode(_this.cBh);
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
        });



    });
