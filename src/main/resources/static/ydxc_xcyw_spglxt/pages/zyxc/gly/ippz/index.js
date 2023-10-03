define(['fdGlobal', 'config','fdDataTable', 'scrollbar', 'fdComponent2', "dragFun", 'userBehavior', 'jqueryUi', 'layDate','extend/newIp.js','extend/removeIp.js'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     * @param fdDataTable
     */
    function (fdGlobal, config,fdDataTable, scrollbar, fdComponent2, dragFun, userBehavior, jqueryUi, layDate, newIp, removeIp) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var scrollBar1;
        /*var _vm = new Vue({
            // 控制器id
            el: '#jsAppControllerCzxw',
            // 数据
            data: {
                name: '框架页主体信息',
                //ip管理数据
                serverUrlQueryIpinfo: _config.url.frame.getIpinfo,
                //删除
                serverUrlQueryIpsc:_config.url.frame.scIp,
                //下载地址
                downloadUrl: _config.url.frame.getYjPic,
                //编辑时请求文件name和id地址
                ipGlBianji: _config.url.frame.ipGlBianji,
                //查询时间
                query:{
                    endDate: null,
                    startDate: null
                },
                cDwBh:'',
                keyword:'',
                oldKeyword:'',
                //分页查询时间
                oldEndData: null,
                oldStartDate: null,
                dateOptions: {
                    language: 'zh-CN',
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    startDate: fdGlobal.startDate,    //设置最小日期
                    endDate: fdGlobal.endDate,      //设置最大日期
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2, //Number, String. 默认值：0, 'hour' 日期时间选择器所能够提供的最精确的时间选择视图。
                    forceParse: true
                },
                optionIpgl: {//信息查询目录分页
                    totalPage: 10,
                    totalSize: 100,
                    currentSize: 10,
                    currentPage: 1,
                    showPoint: false,
                    showPage: 4,
                    prev:' ',
                    next:" ",
                    first: " ",
                    last:" ",
                    callback:function(num){
                        /!* console.log(num)*!/
                    }
                },
                //操作行为list
                ipglDataList:[
                ],
                //需要编辑的信息
                editorList:[],
                //是否显示表格
                contentShow:false,
                //组织机构名称
                zzjgmc:'',
                cDwBh:'E5D2D2CD39CA5674B9D3313883b12776',//单位编号   默认先写死
                type:'dept',//单位还是部门   默认先写死
                jgname:'',
                queryFlag:false
            },
            // 方法
            methods: {
                //获取url上cDwBh和type
                GetRequest:function () {
                    var _this = this;
                    var _url = location.search; //获取url中"?"符后的字串
                    var theRequestArr = [];
                    var theRequest = {};
                    if (_url.indexOf("?") != -1) {
                        var str = _url.substr(1);
                        strs = str.split("&");
                        for(var i = 0; i < strs.length; i ++) {
                            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                        }
                    }
                    _this.cDwBh = theRequest.cDwBh;
                    _this.type = theRequest.type;
                    return theRequest;
                },
                //新建和编辑完刷新页面
                refreshList:function(){
                    var _this=this;
                    /!*$(window).on('message',function(evt){
                         var mesStr = typeof(evt.originalEvent.data) != 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
                         if(mesStr.flag=='ipRefresh'){
                             _this.requestIpgl(_this.optionIpgl.currentPage,_this.optionIpgl.currentSize);
                         }
                    })*!/
                    window.addEventListener('message', function(evt){
                        if(evt.data=='ipRefresh'){
                            _this.requestIpgl(_this.optionIpgl.currentPage,_this.optionIpgl.currentSize);
                        }else if(evt.data=='ipDelete'){
                            //删除请求成功后，重新请求当前分页的数据，如果当前页是最后一页，且数据被删光了，那么跳转前一页
                            if(_this.ipglDataList.length==1&&_this.optionIpgl.currentPage!=1){
                                _this.optionIpgl.currentPage=_this.optionIpgl.currentPage-1
                            }
                            _this.requestIpgl(_this.optionIpgl.currentPage,_this.optionIpgl.currentSize);
                        }
                    }, false);
                },
                //信息查询请求
                requestIpgl: function(currentPage,currentSize,type){
                    this.contentShow = true;
                    var _this= this;
                    var _serverData;
                    _serverData={
                        currentPage:currentPage,
                        currentSize:currentSize,
                        cDwBh: _this.cDwBh
                    };
                    $.ajax({
                        method:config.methodGet,
                        url: _this.serverUrlQueryIpinfo,
                        data: _serverData,
                        dataType:'json',
                        success: function (data) {
                            _this.ipglDataList = data.data.ipList;
                            _this.queryFlag=true;
                            _this.optionIpgl.totalPage=data.data.page.totalPage;
                            _this.optionIpgl.totalSize=data.data.page.totalSize;
                            _this.optionIpgl.currentPage=currentPage;
                            _this.optionIpgl.currentSize=currentSize;
                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                        },
                        error: function (data,textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                },
                //子组件传过来日期改变的值
                changeDate: function (obj,name,index) {
                    this.query[name]=obj;
                },
                //获取状态
                getStatus:function(num1,num2){
                    var str=fdGlobal.getString(num1,num2);
                    return str;
                },
                //创建滚动条
                creatScrollBar1: function () {
                    if (scrollBar1 == undefined) {
                        scrollBar1 = $('#jsScrollBarIpgl').addScrollBar({
                            // 滚动条参数
                            hasScrollBar: true, // 是否有滚动条
                            direction: 'vertical', //  垂直滚动还是水平滚动条，可选参数 horizontal（水平滚动条）
                            scrollContentContainClass: 'fd-scroll-content', // 内容容器的class
                            scrollBarContainClass: 'fd-scroll-track', // 滚动条容器
                            scrollBarClass: 'fd-scroll-bar', // 滚动条
                            pressClass: 'pressed', // 滚动条按下类名
                            scrollBarMinHeight: 5, //  滚动条最小高度
                            scrollBarMinWidth: 50, //  滚动条最小宽度
                            scrollStep: 80, // 一次滚动的距离
                            scrollTweenTime: 60, // 滚动耗时
                            hideScrollBar: true, //Boolearn值,默认为false,是否绑定鼠标移入和移除事件
                            callback: function () {
                                //console.log('滚动后的回调函数')

                            }
                        });
                    } else {
                        scrollBar1.scrollBar.update(0,0);
                    }
                },
                //点击编辑
                clickEditor: function(index) {
                    var _this = this;
                    _this.editorList = _this.ipglDataList[index];
                    var dataBj={
                        flag:"ipglxj",
                        cDwBh:_this.cDwBh,
                        type:_this.type,
                        _dataList:{
                            cBh:'',
                            cDwBh:'',
                            cDwMc:'',
                            cGzmc:'',
                            cFileName:'',
                            cIp:'',
                            cIpd:'',
                            dYxqJz:'',
                            dYxqQs:'',
                            nZt:''
                        },
                        name:[]
                    };
                    if(index != undefined){
                        dataBj.flag = "ipglbj";
                        dataBj._dataList = this.ipglDataList[index];
                        var _serverData = {
                            cBH:_this.ipglDataList[index].cBh
                        }
                        $.ajax({
                            method:config.methodPost,
                            url: _this.ipGlBianji,
                            data: _serverData,
                            dataType:'json',
                            success: function (data) {
                                dataBj.name = data.data;
                                var _data=JSON.stringify(dataBj);
                                console.log(_data)

                                window.parent.parent.postMessage(_data,'*');
                                //输出日志
                                fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                            },
                            error: function (data,textStatus, errorThrown) {
                                //  报错信息
                                fdGlobal.requestError(data, textStatus, errorThrown);
                            }
                        });
                    }else {
                        var _data=JSON.stringify(dataBj);
                        window.parent.parent.postMessage(_data,'*')
                    }
                },
                //删除
                clickRermove:function(index){
                    var data={
                        flag:"ipglsc",
                        cBh:''
                    };
                    if(index != undefined){
                        data.cBh = this.ipglDataList[index].cBh;
                    }
                    var _data=JSON.stringify(data)
                    window.parent.parent.postMessage(_data,'*')
                },
                //添加class
                getClass: function(code) {
                    if(code == 2) {
                        className = 'fd-wsx'
                    }
                },
                //截取参数
                getParamByUrl: function (key, url) {
                    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
                    var r = url.match(reg);
                    if (r == null) {
                        return "";
                    }
                    return r[2];
                },
                convertObjectToKv: function (obj) {
                    var str = "";
                    for (var key in obj) {
                        str = str + "&" + key + "=" + obj[key];
                    }
                    str = str.substr(1, str.length);
                    return str;
                },
                filterQuerySeg: function (text) {
                    var _scope = this;
                    if (!text) {
                        return "";
                    }
                    //智库那边参数长度限制100.暂时不做限制，将来会影响到其他参数在地址栏传参可以加上。
//                	var limit=100;
//                	text=text.substr(0,limit);
                    text = _scope.doubleEncode(text);
                    return text;
                },
                doubleEncode: function (text) {
                    return encodeURI(encodeURI(text));
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
                    return y + '-' + m + '-' + d;
                }
            },
            computed: {
            },
            // 更新数据后调用该函数
            updated: function () {
                this.creatScrollBar1();
            },
            //  dom插入后调用该函数
            mounted: function () {
                var _this = this;

            },
            //  vm创建后调用该函数
            created: function () {
                //获取信息
                var _this = this;
                // 获取url上的信息先注释掉，传参先写死
                // _this.GetRequest();
                _this.requestIpgl(_this.optionIpgl.currentPage,_this.optionIpgl.currentSize);
                _this.refreshList();
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
        });*/
        // 新建ip分配
        /*var ipglPop = new Vue({
            el: "#appControllerIpgl",
            data: {
                editorList: {},
                serverData: {},
                ipxjShow: true,
                /!*ipbjShow:false,*!/
                ipblPopshow: false,
                ipdList: [
                    {
                        first: '',
                        last: ''
                    }
                ],
                ipList: [
                    {
                        ipCode: ''
                    }
                ],
                //保存时的ip列表
                saveIpList:[],
                saveIpdList:[],
                query: {
                    endDate: '',
                    startDate: ''
                },
                dateOptions: {
                    language: 'zh-CN',
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    startDate: fdGlobal.endDate,    //设置最小日期
                    endDate: '',      //设置最大日期
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2, //Number, String. 默认值：0, 'hour' 日期时间选择器所能够提供的最精确的时间选择视图。
                    forceParse: true
                },
                //新建ip请求地址
                serverUrlxjip: _config.url.frame.xjip,
                //下载地址
                downloadUrl: _config.url.frame.getYjPic,
                //上传多个的下载地址
                ipGlDownLoad: _config.url.frame.ipGlDownLoad,
                //上传多个的删除地址
                ipGlDelete: _config.url.frame.ipGlDelete,
                ipGlLook:_config.url.frame.ipGlLook,
                cGzmc: '',//策略名称
                file: [],
                fileIds:[],//需要去数据库中删除的文件id
                image: "#",
                user: {},
                base64Code: "",
                visiable: false,
                ipbjImgsrc: '#',
                scTpShow: false,
                ipxjPicShow: true,
                cDwBh: 'E5D2D2CD39CA5674B9D3313883b12776',//单位id
                type: '',//部门或是单位
                isip: false,
                ipglTitle: '',//标题
                name:[],
                yxq :''
            },
            methods: {
                bindMessage: function () {
                    var _this = this;
                    var mesStr = {
                        "flag": "ipglbj",
                        "cDwBh": "E5D2D2CD39CA5674B9D3313883b12776",
                        "type": "dept",
                        "_dataList": {
                            "cBh": "b7ff3abef6b74f278624945d7622aee1",
                            "cDwBh": "E5D2D2CD39CA5674B9D3313883b12776",
                            "cDwMc": "第一监督所",
                            "cGzmc": "3",
                            "cIp": "172.16.192.133,172.16.192.133,172.16.192.133",
                            "cIpd": "172.16.192.130:172.16.192.139;172.16.192.130:172.16.192.139;172.16.192.130:172.16.192.139;",
                            "dYxqJz": 1614527999000,
                            "dYxqQs": 1581955200000,
                            "nZt": 2
                        },
                        "name": [{
                            "fileName": "bg-sy.png",
                            "filePath": "s3.minio111:dzsjdc/ipspyj/674ffc5dc80844b98bfedf9950da691c/bg-sy.png",
                            "id": "4915abd8434c487dba34188548500749",
                            "ipId": "b7ff3abef6b74f278624945d7622aee1"
                        },
                            {
                                "fileName": "ccPic20200109160732.jpg",
                                "filePath": "s3.minio111:dzsjdc/ipspyj/f4441cf951b64ae29a8a0d91455fc767/ccPic20200109160732.jpg",
                                "id": "4bf0fac5050c42b1a87dba262d001c27",
                                "ipId": "b7ff3abef6b74f278624945d7622aee1"
                            }]
                    }
                    if (mesStr.flag == 'ipglbj') { //编辑
                        var serverUrlQueryIpinfo = _config.url.frame.getYjPic;
                        var ipdL = [];
                        var ipL = [];
                        $('#appControllerIpgl').removeClass('fd-hide');
                        $('.fd-mask').removeClass('fd-hide');
                        _this.editorList = mesStr._dataList;
                        _this.name=mesStr.name;
                        _this.cDwBh = mesStr.cDwBh;
                        _this.cGzmc = _this.editorList.cGzmc;
                        _this.ipbjImgsrc = serverUrlQueryIpinfo + '/' + _this.editorList.cBh + "?" + Math.random();
                        ipdL = _this.editorList.cIpd.split(";");
                        ipdL.pop();
                        _this.ipdList = [];
                        for (var i = 0; i < ipdL.length; i++) {
                            _this.ipdList.push({
                                first: '',
                                last: ""
                            });
                            ipdL[i] = ipdL[i].split(":");
                            _this.$set(_this.ipdList[i], 'first', ipdL[i][0]);
                            _this.$set(_this.ipdList[i], 'last', ipdL[i][1]);
                            /!*_this.ipdList[i].first = ipdL[i][0];*!/
                            /!*_this.ipdList[i].last = ipdL[i][1];*!/
                        }
                        ipL = _this.editorList.cIp==''?[]:_this.editorList.cIp.split(",");
                        _this.ipList = [];

                        for (var i = 0; i < ipL.length; i++) {
                            _this.ipList.push({
                                ipCode: ''
                            });
                            _this.$set(_this.ipList[i], 'ipCode', ipL[i]);
                            /!*_this.ipList[i].ipCode = ipL[i];*!/
                        }
                        _this.query.endDate = _this.editorList.dYxqJz;
                        _this.query.startDate = _this.editorList.dYxqQs;
                        _this.ipxjPicShow = true;
                        _this.ipxjShow = true;
                        _this.ipglTitle = '编辑IP分配规则';
                        /!* _this.ipbjShow = true;*!/
                    }
                    /!*$(window).on('message', function (evt) {
                        var mesStr = typeof(evt.originalEvent.data) != 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
                        if (mesStr.flag == 'ipglxj') {  //新建
                            $('#appControllerIpgl').removeClass('fd-hide');
                            $('.fd-mask').removeClass('fd-hide');
                            _this.editorList = mesStr._dataList;
                            _this.cDwBh = mesStr.cDwBh;
                            _this.type = mesStr.type;
                            $("#ipbjimg").css('display', 'none');
                            _this.editorList.cBh = "";
                            /!* _this.ipbjShow = false;*!/
                            _this.ipxjShow = true;
                            _this.ipglTitle = '新建IP分配规则';
                            _this.visiable = false;
                            _this.ipxjPicShow = false;
                        } else if (mesStr.flag == 'ipglbj') { //编辑
                            var serverUrlQueryIpinfo = _config.url.frame.getYjPic;
                            var ipdL = [];
                            var ipL = [];
                            $('#appControllerIpgl').removeClass('fd-hide');
                            $('.fd-mask').removeClass('fd-hide');
                            _this.editorList = mesStr._dataList;
                            _this.name=mesStr.name;
                            _this.cDwBh = mesStr.cDwBh;
                            _this.cGzmc = _this.editorList.cGzmc;
                            _this.ipbjImgsrc = serverUrlQueryIpinfo + '/' + _this.editorList.cBh + "?" + Math.random();
                            ipdL = _this.editorList.cIpd.split(";");
                            ipdL.pop();
                            _this.ipdList = [];
                            for (var i = 0; i < ipdL.length; i++) {
                                _this.ipdList.push({
                                    first: '',
                                    last: ""
                                });
                                ipdL[i] = ipdL[i].split(":");
                                _this.$set(_this.ipdList[i], 'first', ipdL[i][0]);
                                _this.$set(_this.ipdList[i], 'last', ipdL[i][1]);
                                /!*_this.ipdList[i].first = ipdL[i][0];*!/
                                /!*_this.ipdList[i].last = ipdL[i][1];*!/
                            }
                            ipL = _this.editorList.cIp==''?[]:_this.editorList.cIp.split(",");
                            _this.ipList = [];

                            for (var i = 0; i < ipL.length; i++) {
                                _this.ipList.push({
                                    ipCode: ''
                                });
                                _this.$set(_this.ipList[i], 'ipCode', ipL[i]);
                                /!*_this.ipList[i].ipCode = ipL[i];*!/
                            }
                            _this.query.endDate = _this.editorList.dYxqJz;
                            _this.query.startDate = _this.editorList.dYxqQs;
                            _this.ipxjPicShow = true;
                            _this.ipxjShow = true;
                            _this.ipglTitle = '编辑IP分配规则';
                            /!* _this.ipbjShow = true;*!/
                        }
                    })*!/
                },
                //添加ip
                addIp: function () {
                    var _this = this;
                    if (_this.ipList.length >= 10) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: 'ip最多添加10条！'
                            },
                            interval: 1800
                        });
                        return false;
                    }
                    var _data = {
                        ipCode: ''
                    }
                    _this.ipList.push(_data);
                },
                //添加ip段
                addIpd: function () {
                    var _this = this;
                    if (_this.ipdList.length >= 5) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: 'ip段最多添加5条！'
                            },
                            interval: 1800
                        });
                        return false;
                    }

                    var _data = {
                        first: '',
                        last: ''
                    }
                    _this.ipdList.push(_data)
                },
                //校验ip
                isValidIP: function (value, type) {
                    var _this = this;
                    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                    if (value) {
                        if (!reg.test(value)) {
                            if (type == 'ipd') {
                                $.alert({
                                    type: 'fail',
                                    info: {
                                        fail: '请填写正确的ip段地址！'
                                    },
                                    interval: 1800
                                });
                            } else {
                                $.alert({
                                    type: 'fail',
                                    info: {
                                        fail: '请填写正确的ip地址！'
                                    },
                                    interval: 1800
                                });
                            }

                            _this.isip = true;
                        } else {
                            _this.isip = false;
                        }
                    }
                },
                clickDeleteItem: function (type, index) {
                    this[type].splice(index, 1)
                },
                //关闭弹窗
                ipglPopClose: function () {
                    var _this = this;
                    _this.cGzmc = '';
                    _this.name=[];
                    _this.file = [];
                    _this.fileIds=[];
                    _this.ipdList = [
                        {
                            first: '',
                            last: ''
                        }
                    ],
                        _this.ipList = [
                            {
                                ipCode: ''
                            }
                        ],
                        _this.ipxjShow = false;
                    _this.ipbjShow = false;

                    _this.query = {
                        endDate: "",
                        startDate: ""
                    }
                    _this.visiable = false;
                    _this.ipxjPicShow = true;
                    $('#appControllerIpgl').addClass('fd-hide');
                    $('.fd-mask').addClass('fd-hide');
                    _this.yxq = "";
                },
                //获取ip
                getTableContent: function (list) {
                    var data = '';
                    for (var i = 0; i < list.length; i++) {
                        var _data = list[i].ipCode + ","
                        data += _data
                    }
                    data = data.substring(0, data.length - 1)
                    return data;
                },
                //获取ipd
                getIpdTableContent: function (list) {
                    var data = '';
                    for (var i = 0; i < list.length; i++) {
                        var _data = list[i].first + ":" + list[i].last + ";";
                        data += _data
                    }
                    return data;
                },
                //子组件传过来日期改变的值
                changeDate: function (obj, name, index,event) {

                    var sign = true;
                    if (name == "startDate") {
                        sign = fdGlobal.dateCompare(obj, this.query.endDate);
                    } else {
                        sign = fdGlobal.dateCompare(this.query.startDate, obj);
                    }
                    if (sign) {
                        this.query[name] = obj;
                    } else {
                        this.query[name] = '';
                        $('#appControllerIpgl').find('.fd-ipgl-yxq').find('.fd-input-wrap.' + name).find('.fd-date-input').val('')
                    }

                },
                /!*handleUpload: function (f) {

                    var _this = this;
                    if(((f.size)/1048576)>20){
                          $.alert({
                              type: 'fail',
                              info: {
                                  fail: '上传的照片不能大于20M'
                              },
                              interval: 900
                          });
                          return false
                     };
                    this.name.push(f);
                    this.file.push(f);
                    var reader = new FileReader();
                    reader.readAsDataURL(f);
                    reader.onload = function (e) {
                        //把得到的base64赋值到img标签显示
                        _this.visiable = true;
                        _this.ipxjPicShow = false;
                    }
                    _this.visiable = true;
                    this.ipxjPicShow = false;
                    return false;
                },
                uploadSuccess: function(response, file, fileList) {
                    var _this = this;

                    _this.$refs.adminEmpcardUpload.clearFiles();
                    // 恢复上传照片和提交按钮
                    _this.uploadLoading = false;
                    $('#empcardUpload :file').attr('disabled', false);
                    $('#personInfoSubmit').attr({
                        'disabled': false,
                        'class': 'fd-btn fd-btn-confirm'
                    });

                    if(fdGlobal.checkString(response.data)) {
                        _this.empcardTempFile = response.data;
                        _this.image1 = _config.url.frame.empcardFromTemp + '/' + response.data + "?" + Math.random();
                    }
                },*!/



                //上传工作证
                handleUpload: function (f) {
                    var _this = this;
                    /!* if(((f.size)/1048576)>2){
                         $.alert({
                             type: 'fail',
                             info: {
                                 fail: '上传的文件不能大于2M'
                             },
                             interval: 900
                         });
                         return false
                    };*!/
                    /!*this.name.push(f);*!/
                    this.file.push(f);
                    this.visiable = true;
                    this.ipxjPicShow = false;
                    return true;
                },
                uploadSuccess: function(response, file, fileList) {
                    var _this = this;
                    _this.name.push(response.data);
                    _this.$refs.ipGlMoreUpload.clearFiles();

                    // 恢复上传照片和提交按钮
                    /!*_this.uploadLoading = false;
                    $('#empcardUpload :file').attr('disabled', false);
                    $('#personInfoSubmit').attr({
                        'disabled': false,
                        'class': 'fd-btn fd-btn-confirm'
                    });*!/

                    /!*if(fdGlobal.checkString(response.data)) {
                        _this.empcardTempFile = response.data;
                        _this.image1 = _config.url.frame.empcardFromTemp + '/' + response.data + "?" + Math.random();
                    }*!/
                },
                //删除上传的批准依据
                removeClick:function(index) {
                    var _this = this;
                    if(this.name[index].id) {
                        _this.fileIds.push(this.name[index].id);
                        _this.name.splice(index,1);
                    }else {
                        var _serverData = {
                            luJing : this.name[index].luJing
                        };

                        $.ajax({
                            method:config.methodPost,
                            url: _this.ipGlDelete,
                            data: _serverData,
                            dataType:'json',
                            success: function (data) {
                                /!*if(data.data == "success") {
                                    $.alert({
                                        type: 'success',
                                        info: {
                                            success: '删除成功！'
                                        },
                                        interval: 1800
                                    });
                                }*!/
                                _this.name.splice(index,1);
                                //输出日志
                                fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                            },
                            error: function (data,textStatus, errorThrown) {
                                //  报错信息
                                fdGlobal.requestError(data, textStatus, errorThrown);
                            }
                        });
                    }
                },
                //查看
                lookClick:function(index) {

                    var ext = this.name[index].fileName;
                    var fileType =ext.substring(ext.lastIndexOf(".")+1).toLowerCase();
                    if(fileType!='pdf' && fileType !='txt' && fileType !='jpg' && fileType !='bmp' && fileType !='gif'
                        && fileType !='jpeg' && fileType !='ico' && fileType !='png'){
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '此文件不支持预览，请下载查看'
                            },
                            interval: 900
                        });
                        return false
                    };
                    var url = _config.url.frame.ipGlLook + '?fileName='+ this.name[index].fileName + '&luJing=' + this.name[index].luJing+ '&id=' + this.name[index].id +'&fileType='+fileType
                    window.open(url);
                },





                submit: function () {
                    var _this = this;
                    var count=0;

                    //判断策略名称是否填写
                    if (_this.cGzmc == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写策略名称！'
                            },
                            interval: 1800
                        });
                        return false;
                    };
                    /!*   if (_this.ipdList.length < 1 && _this.ipList.length < 1) {
                           $.alert({
                               type: 'fail',
                               info: {
                                   fail: '请至少填写一组IP或者ip段 ！'
                               },
                               interval: 1800
                           });
                           return false;
                       }*!/
                    var ipdFlag;
                    if (_this.ipdList.length > 0) {
                        $.each(_this.ipdList, function (index, val) {
                            if(val.first!=''|| val.last != ''){
                                _this.saveIpdList.push(val);
                                if (val.first == '' || val.last == '') {
                                    ipdFlag = true
                                }
                            }
                        });
                    };
                    if (_this.ipList.length > 0) {
                        $.each(_this.ipList, function (index, val) {
                            if(val.ipCode!= ''){
                                _this.saveIpList.push(val);
                            }
                        });
                    };
                    if (ipdFlag) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写完整的ip段信息 ！'
                            },
                            interval: 1800
                        });
                        return false;
                    };
                    if (_this.saveIpList.length + _this.saveIpdList.length==0){
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请至少填写一组IP或者ip段 ！'
                            },
                            interval: 1800
                        });
                        _this.saveIpList=[];
                        _this.saveIpdList=[];
                        return false;
                    }
                    /!*                    if (_this.ipList.length > 0) {
                                            $.each(_this.ipList, function (index, val) {
                                                if (val.ipCode == '') {
                                                    ipFlag = true
                                                }
                                            });
                                        }*!/

                    /!*                    if (ipFlag) {
                                            $.alert({
                                                type: 'fail',
                                                info: {
                                                    fail: '请填写完整的ip信息 ！'
                                                },
                                                interval: 1800
                                            });
                                            return false;
                                        }*!/
                    // 判断有效期是否填写
                    // 有效期改为非必填
                    // if (!(_this.query.startDate && _this.query.endDate)) {
                    //     $.alert({
                    //         type: 'fail',
                    //         info: {
                    //             fail: '请填写有效期！'
                    //         },
                    //         interval: 1800
                    //     });
                    //     _this.saveIpList=[];
                    //     _this.saveIpdList=[];
                    //     return false;
                    // }
                    //判断依据是否上传
                    //依据改为非必填
                    // if (_this.ipxjPicShow == true) {
                    //     if (_this.file.length == 0&&_this.name.length == 0) {
                    //         $.alert({
                    //             type: 'fail',
                    //             info: {
                    //                 fail: '请上传依据！'
                    //             },
                    //             interval: 1800
                    //         });
                    //         _this.saveIpList=[];
                    //         _this.saveIpdList=[];
                    //         return false;
                    //     }
                    // }else{
                    //     if (_this.name.length == 0) {
                    //         $.alert({
                    //             type: 'fail',
                    //             info: {
                    //                 fail: '请上传依据！'
                    //             },
                    //             interval: 1800
                    //         });
                    //         _this.saveIpList=[];
                    //         _this.saveIpdList=[];
                    //         return false;
                    //     }
                    // }

                    //判断是否填写正确ip段
                    if (_this.ipdList.length > 0) {
                        for (var i = 0; i < _this.ipdList.length; i++) {
                            _this.isValidIP(_this.ipdList[i].first, 'ipd');
                            _this.isValidIP(_this.ipdList[i].last, 'ipd');
                            if (_this.isip) {
                                _this.saveIpList=[];
                                _this.saveIpdList=[];
                                return false;
                            }
                        }
                    }
                    //判断是否填写正确ip
                    if (_this.ipList.length > 0) {
                        for (var i = 0; i < _this.ipList.length; i++) {
                            _this.isValidIP(_this.ipList[i].ipCode, 'ip');
                            if (_this.isip) {
                                _this.saveIpList=[];
                                _this.saveIpdList=[];
                                return false;
                            }
                        }
                    }
                    var cip = _this.getTableContent(_this.saveIpList);
                    var cipd = _this.getIpdTableContent(_this.saveIpdList);
                    _this._serverData = {
                        cBh: _this.editorList.cBh,
                        cDwBh: _this.cDwBh,
                        type: _this.type,
                        cGzmc: _this.cGzmc,
                        cIp: cip,
                        cIpd: cipd,
                        dYxqQs: _this.query.startDate == "" ? _this.query.startDate : _this.query.startDate + " 00:00:00",
                        dYxqJz: _this.query.endDate == "" ? _this.query.startDate : _this.query.endDate + " 23:59:59"
                    }
                    var _fileAdds = [];//只有新上传的才给后台发送，有id的不再向后台发送
                    for(var i = 0;i < _this.name.length;i++) {
                        if(_this.name[i].id == '' || _this.name[i].id == null ) {
                            _fileAdds.push(_this.name[i])
                        }
                    }
                    this.$refs.form.getData(function (data) {
                        data.params = JSON.stringify(_this._serverData);
                        data.fileAdds = JSON.stringify(_fileAdds);
                        data.fileIds =  JSON.stringify(_this.fileIds);
                    })
                    this.$refs.form.submit(_this.serverUrlxjip).then(function (result) {
                        if (result.code == 1) {
                            _this.saveIpList=[];
                            _this.saveIpdList=[];
                            _this.file = [];
                            _this.fileIds = [];
                            _this.name=[];
                            _this.image = "#";
                            _this.user = {};
                            _this.base64Code = "";
                            _this._serverData = {
                                cBh: "",
                                cDwBh: "",
                                type: "",
                                cGzmc: "",
                                cIp: "",
                                cIpd: "",
                                dYxqQs: "",
                                dYxqJz: ""
                            }
                            $('#appControllerIpgl').addClass('fd-hide');
                            $('.fd-mask').addClass('fd-hide');
                            // 清空
                            _this.cGzmc = '';
                            _this.editorList.cBh = "";
                            _this.ipdList = [
                                {
                                    first: '',
                                    last: ''
                                }
                            ],
                                _this.ipList = [
                                    {
                                        ipCode: ''
                                    }
                                ],
                                _this.ipxjShow = false;
                            _this.query = {
                                endDate: '',
                                startDate: ''
                            }
                            _this.yxq = '';
                            _this.ipxjPicShow = false;
                            $.alert({
                                type: 'success',
                                info: {
                                    success: '提交成功'
                                },
                                interval: 1800
                            })
                            _this.visiable = false;
                            var flag = "ipRefresh";
                            window.document.getElementById("fd-ldjf-mainiframe").contentWindow.postMessage(flag, '*');
                        }
                    }).catch(function (error) {
                        // 此错误有以下几种情况
                        // 1. url参数未指定，可以在submit传递或者form中指定url属性
                        // 2. 表单参数格式校验未通过
                        // 3. axios发送请求失败的error
                        /!* Artery.message.error(error);*!/
                        if (error.status == 401) {
                            window.location.href = '/templates/login.pages'
                        }else{
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '提交失败'
                                },
                                interval: 1800
                            });
                        }
                    });
                },
                //去空格
                valueTrim:function(type,index,name){
                    this[type][index][name]=this[type][index][name].trim()
                },
                changeYxq:function(e){
                    _this = this;
                    yxqradio = e.currentTarget;
                    var nowD = new Date();
                    _this.query.startDate = nowD.getFullYear() + '-' + (nowD.getMonth() + 1) + '-' + nowD.getDate();
                    var yxqv = yxqradio.value;
                    if(yxqv == 3){
                        nowD.setMonth(nowD.getMonth()+3);
                    }else if(yxqv == 6){
                        nowD.setMonth(nowD.getMonth()+6);
                    }else if(yxqv == 12){
                        nowD.setMonth(nowD.getMonth()+12);
                    }else if(yxqv == 24){
                        nowD.setMonth(nowD.getMonth()+24);
                    }
                    nowD = new Date(nowD.getFullYear(), (nowD.getMonth() + 1), 0);
                    _this.query.endDate = nowD.getFullYear() + '-' + (nowD.getMonth() + 1) + '-' + nowD.getDate();
                }
            },
            filters: {
                dateFormat: function (value) {

                    if (value == null || value == "") {
                        return '';
                    }
                    if (typeof(value) != 'string') {
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
                    return y + '-' + m + '-' + d;
                }
            },
            created: function () {
                this.bindMessage();
            }
        });*/


    });
