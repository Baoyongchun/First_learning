define(['fdGlobal', 'config','fdDataTable', 'scrollbar', 'fdComponent2', "dragFun", 'userBehavior', 'jqueryUi', 'layDate'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     * @param fdDataTable
     */
    function (fdGlobal, config,fdDataTable, scrollbar, fdComponent2, dragFun, userBehavior, jqueryUi, layDate) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var scrollBar1;
        var _vm = new Vue({
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
                    currentSize: getLimit(),
                    currentPage: 1,
                    showPoint: false,
                    showPage: 4,
                    prev:' ',
                    next:" ",
                    first: " ",
                    last:" ",
                    callback:function(num){
                        /* console.log(num)*/
                    }
                },
                //操作行为list
                ipglDataList:[],
                //需要编辑的信息
                editorList:[],
                //是否显示表格
                contentShow:false,
                //组织机构名称
                zzjgmc:'',
                cDwBh:'0',//单位编号   默认先写死
                type:'dept',//单位还是部门   默认先写死
                jgname:'',
                queryFlag:false,
                //暂无数据是否显示
                zwsjShow:false
            },
            // 方法
            methods: {
                setIndex: function (index) {
                    return (index + 1) + (this.optionIpgl.currentPage - 1) * 10
                },
                ready: function (scrollbar) {
                    scrollbar.update();
                },
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
                    /*$(window).on('message',function(evt){
                         var mesStr = typeof(evt.originalEvent.data) != 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
                         if(mesStr.flag=='ipRefresh'){
                             _this.requestIpgl(_this.optionIpgl.currentPage,_this.optionIpgl.currentSize);
                         }
                    })*/
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
                            if (_this.ipglDataList.length <= 0 ) {
                                _this.zwsjShow = true;
                            } else {
                                _this.zwsjShow = false;
                            }
                            _this.queryFlag=true;
                            _this.optionIpgl.totalPage=data.data.page.totalPage;
                            _this.optionIpgl.totalSize=data.data.page.totalSize;
                            _this.optionIpgl.currentPage=currentPage;
                            _this.optionIpgl.currentSize=currentSize;
                            // 刷新滚动条
                            // _this.$refs.ippzScroll.update(0,0);
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
                clickEditor: function(item) {
                    var _this = this;
                    // _this.editorList = _this.ipglDataList[index];
                    _this.editorList = item;
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
                    if(item){
                        dataBj.flag = "ipglBj";
                        dataBj._dataList = item;
                        var _serverData = {
                            cBH: item.cBh
                        };
                        $.ajax({
                            method:config.methodPost,
                            url: _this.ipGlBianji,
                            data: _serverData,
                            dataType:'json',
                            success: function (data) {
                                if(data.code === "200") {
                                    dataBj.name = data.data;
                                    if(dataBj._dataList.dYxqJz) {
                                        dataBj._dataList.dYxqJz = dataBj._dataList.dYxqJz.substr(0,10);
                                        dataBj._dataList.dYxqQs = dataBj._dataList.dYxqQs.substr(0,10);
                                    }
                                    var _data=JSON.stringify(dataBj);
                                    // 给首页发消息
                                    window.parent.parent.postMessage(_data,'*');
                                }
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
                clickRermove:function(item){
                    var data={
                        flag:"ipglSc",
                        cBh:''
                    };
                    if(item){
                        data.cBh = item.cBh;
                        // data.cBh = this.ipglDataList[index].cBh;
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
                },
                handleChangePageNow: function (page) {
                    this.currentPageIndex = page ? (page.offset / this.optionIpgl.currentSize + 1) : 1;
                    this.requestIpgl(this.currentPageIndex, this.optionIpgl.currentSize, '');
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
                var _this = this.$refs;
                // _this.$refs.ippzScroll && _this.$refs.ippzScroll.update(0,0);
                // 刷新滚动条
            },
            //  vm创建后调用该函数
            created: function () {
                //获取信息
                var _this = this;
                // 获取url上的信息先注释掉，传参先写死
                // _this.GetRequest();
                _this.optionIpgl.currentSize = getLimit();
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
        });
    });
