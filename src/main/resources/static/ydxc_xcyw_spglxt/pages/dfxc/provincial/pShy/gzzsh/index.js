// 查询记录模块
define(['fdGlobal', 'config', 'fdDataTable', 'scrollbar', 'fdComponent2', "dragFun", 'userBehavior', 'jqueryUi', 'layDate'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     * @param fdDataTable
     */
    function (fdGlobal, config, fdDataTable, scrollbar, fdComponent2, dragFun, userBehavior, jqueryUi, layDate) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var scrollBar1;
        var _vm = new Vue({
            // 控制器id
            el: '#jsAppControllerGzzsp',
            // 数据
            data: function() {
                return {
                    pageshow:true,
                    name: '工作证审批',
                    //信息查询
                    serverUrlGetGzzspLis: _config.url.frame.getGzzspList,
                    // 请求当前登陆人的单位名称
                    getCorpName: config.url.frame.getZzjgCorpName,
                    corpName: '',
                    //查询时间
                    query: {
                        endDate: '',
                        startDate: ''
                    },
                    //信息检索
                    xxJs: '',
                    oldxxJs: '',
                    //查询类型
                    statue: 0,
                    oldQueryType: 0,
                    //分页查询时间
                    oldEndDate: '',
                    oldStartDate: '',
                    sqbmId: null,
                    organType: null,
                    dateOptions: {
                        language: 'zh-CN',
                        format: 'yyyy-mm-dd',
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        startDate: fdGlobal.startDate, //设置最小日期
                        endDate: '', //设置最大日期
                        todayHighlight: 1,
                        startView: 2,
                        minView: 2, //Number, String. 默认值：0, 'hour' 日期时间选择器所能够提供的最精确的时间选择视图。
                        forceParse: true
                    },
                    optionGzzsp: { //信息查询目录分页  optionGzzsp
                        totalPage: 10,
                        totalSize: 100,
                        currentSize: getLimit(),
                        currentPage: 1,
                        showPoint: false,
                        showPage: 4,
                        prev: ' ',
                        next: " ",
                        first: " ",
                        last: " ",
                        callback: function (num) {
                            /* console.log(num)*/
                        }
                    },
                    //部门组织机构
                    sqbmOrganTree: {
                        dataUrl: '../api/organ/children',
                        searchUrl: '../api/organ/search',
                        selectType: 'corp_dept',
                        selectScope: 'all'
                    },
                    //审批表信息list
                    gzzspDataList: [],
                    nZt: 0, //状态
                    bmId: '', //申请部门ID
                    gzzPicAddress: _config.url.frame.getGzzPic,//工作证图片地址
                    // gzzPicAddress: './images/icon-gzz.jpg',
                    cBh: '', //编号
                    queryFlag: false,
                    guanjianci: "",
                    /// 申请单位
                    sqdw: [],
                    // 申请单位选择后绑定的数据
                    gzzshlSqdwValue: '',
                    showOrNot:true,
                    // 申请单位列表
                    sqdwList: [],
                    // 申请部门
                    sqbm: [],
                    // 申请部门列表
                    sqbmList: [],
                    // 申请单位选择后绑定的数据
                    gzzshSqbmValue: [],
                    // 默认申请部门不可选
                    disabled: true,
                    // 状态
                    zt: '',
                    // 不通过原因
                    btgyy:'',
                    optionKssqsj: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() > new Date(_this.query.endDate).valueOf();
                            }
                        }
                    })(this),
                    optionJssqsj: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() < new Date(_this.query.startDate).valueOf() - 86400000;
                            }
                        }
                    })(this),
                    //暂无数据是否显示
                    zwsjShow:false
                }
            },
            // 方法
            methods: {
                /**
                 *  @Author wlq
                 * @description 查询条件重置
                 * @name searchReset
                 * @return {*} 无
                 */
                searchReset:function(){
                    // 如果查询条件有值，怎清空后重新请求数据
                    if(this.gzzshlSqdwValue || this.gzzshSqbmValue || this.nZt || this.query.startDate || this.query.endDate) {
                        // 申请单位
                        this.gzzshlSqdwValue = '';
                        // 申请部门
                        this.gzzshSqbmValue = [];
                        // 开始时间
                        this.query.startDate = '';
                        // 结束时间
                        this.query.endDate = '';
                        // 状态
                        this.nZt = 0;
                        this.optionGzzsp.currentPage = 1;
                        this.optionGzzsp.currentSize = getLimit();
                        this.pageshow = false;//让分页隐藏
                        this.$nextTick(function (){//重新渲染分页
                            this.pageshow = true;
                        });
                        // 重新调用接口
                        this.requestGzzsp(this.optionGzzsp.currentPage, this.optionGzzsp.currentSize);
                    }
                    this.showOrNot = true;
                },
                //通过或者不通过后完刷新页面
                refreshList: function () {
                    var _this = this;
                    $(window).on('message', function (evt) {
                        var mesStr = typeof (evt.originalEvent.data) != 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
                        if (mesStr.flag == 'gzzspRefresh') {
                            var data = {
                                flag: ''
                            };
                            data.flag = "gzzwspNumRefresh";
                            var _data = JSON.stringify(data);
                            window.parent.postMessage(_data, '*');
                            _this.requestGzzsp(_this.optionGzzsp.currentPage, _this.optionGzzsp.currentSize);
                        }
                    })
                },
                //信息查询请求
                requestGzzsp: function (currentPage, currentSize, type) {
                    var _this = this;
                    var _serverData;
                    if (type == "cx") { //点击查询按钮发的请求数据
                        _this.oldStartDate = _this.startDate;
                        _this.oldEndDate = _this.endDate;
                        _this.oldQueryType = _this.queryType;
                        _this.oldxxJs = _this.xxJs;
                        _serverData = {
                        	startDate: _this.query.startDate,
                        	endDate: _this.query.endDate,
                        	nZt: _this.nZt,
                            currentPage: currentPage,
                            currentSize: currentSize,
                            sqdwValue: _this.gzzshlSqdwValue,
                            bmIdList: _this.gzzshSqbmValue
                        };
                    } else { //点击分页发的请求数据
                        _serverData = {
                        		startDate: _this.query.startDate,
                            	endDate: _this.query.endDate,
                            	nZt: _this.nZt,
                                currentPage: currentPage,
                                currentSize: currentSize,
                                sqdwValue: _this.gzzshlSqdwValue,
                                bmIdList: _this.gzzshSqbmValue
                        };
                    }

                    Artery.loadPageData(_this.serverUrlGetGzzspLis,_serverData).then(function (result) {
                        if (result.data!=undefined && result.data.gzzList.length>=0) {
                                 _this.gzzspDataList = result.data.gzzList;
                                 // 当数据的长度等于0时，暂无数据显示
                                 if (_this.gzzspDataList.length <= 0 ) {
                                     _this.zwsjShow = true;
                                 } else {
                                     _this.zwsjShow = false;
                                 }
                                 _this.queryFlag = true;
                                 for (var i = 0; i < _this.gzzspDataList.length; i++) {
                                     _this.gzzspDataList[i].gzzPicAddress = _this.gzzPicAddress + '/' + _this.gzzspDataList[i].cBh;
                                     // _this.gzzspDataList[i].gzzPicAddress = _this.gzzPicAddress;
                                 }
                                 _this.optionGzzsp.totalPage = result.data.pageOut.totalPage;
                                 _this.optionGzzsp.totalSize = result.data.pageOut.totalSize;
                                 _this.optionGzzsp.currentPage = currentPage;
                                 _this.optionGzzsp.currentSize = currentSize;
                                 if(_this.$refs.gzzScroll) {
                                     _this.$refs.gzzScroll.update();
                                 }
                                var pMessage = {
                                    message: 'shy-gzzsh',
                                    count: 0
                                }
                                window.parent.postMessage(pMessage, '*');
                             //输出日志
                             fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', result.data)
                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    });
                },
                //获取状态
                getStatus: function (num1, num2) {
                    var str = fdGlobal.getString(num1, num2);
                    return str;
                },
                changeCorp: function (newValue, oldValue) {
                	var _this = this;
                	if(newValue!=null && newValue!=undefined){
                		_this.gzzshlSqdwValue = newValue.id;
                		_this.showOrNot = false;
                	}else{
                		_this.gzzshlSqdwValue = '';
                		_this.gzzshSqbmValue = [];
                		_this.showOrNot = true;
                	}
                    _this.gzzshSqbmValue = [];
                },
                changeDept: function (newValue, oldValue) {
                	var _this = this;
                	_this.gzzshSqbmValue=[];
                	if (newValue.length > 0){
                		 for (var i = 0; i < newValue.length; i++) {
                			 _this.gzzshSqbmValue.push(newValue[i].id);
                         }
                	  }

                },
                //操作
                clickHandle: function (index, code) {
                    var data = {
                        flag: code,
                        reason: "",
                        cBh: ""
                    };
                    // 定义需要传递过去的数据
                    var dataBj={
                        flag:"Gzzsh",
                        _data:{}
                    };
                    // 给首页发消息
                    dataBj._data = {
                        data:data,
                        index:index,
                        code:code,
                        gzzspDataList: this.gzzspDataList
                    };
                    var _data =JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data,'*');


                    /*新打开弹窗需要的*/
                   /* if (code == "reason") {
                        data.reason = this.gzzspDataList[index].cBtgyy;
                    }
                    data.cBh = this.gzzspDataList[index].cBh;
                    var _data = JSON.stringify(data)
                    window.parent.postMessage(_data, '*')*/

                },
                openGzzzp: function (index) {
                    var url = _config.url.frame.getGzzPic + "/" + this.gzzspDataList[index].cBh;
                    var dataCkgzz = {
                        flag: "ckgzz",
                        _data: url
                    };
                    // 给首页发消息
                    window.parent.parent.postMessage(JSON.stringify(dataCkgzz), '*');
                },
                //申请部门组织结构树值改变
                changeSqbmOrgan: function (newVal, oldVal) {
                    this.sqbmId = newVal.id;
                    this.organType = newVal.customData.type
                },
                //通过n值获取c值
                getStrByN: function (num1, num2) {
                    var str = fdGlobal.getString(num1, num2);
                    return str;
                },
                //子组件传过来日期改变的值
                changeDate: function (obj, name, index) {
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
                        $('#jsAppControllerGzzsp').find('.fd-searchInput-wraper').find('.fd-input-wrap.' + name).find('.fd-date-input').val('')
                    }
                },
                //下拉改变
                changeDropN: function (value, name, index) {
                    var _this = this;
                    _this[name] = value.code;
                    _this.nZt = value.code;
                },
                creatScrollBar1: function () {
                    if (scrollBar1 == undefined) {
                        scrollBar1 = $('#jsScrollBarGzzsp').addScrollBar({
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
                        scrollBar1.scrollBar.update(0, 0);
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
                /**
                 * @Author: wjing
                 * @name: selectSqdw
                 * @description: 点击申请单位
                 * @param {type}
                 * @return: {undefined}
                 */
                selectSqdw: function () {
                    var _this = this;
                    this.$nextTick(function () {
                        if (_this.sqdw.length == 0) {
                            _this.disabled = true;
                        } else {
                            _this.disabled = false;
                        }
                    })
                },
                loadingData2: function (len) {
                    var _data = [];
                    var k = 0;
                    for (var i = 0; i < len; i++) {
                        k++;
                        _data.push({
                            name: '一级 ' + k,
                            id: '' + k,
                            open: true,
                            children: [{
                                id: k + '-' + k,
                                name: '二级 ' + k + '-' + k,
                                children: [{
                                    id: k + '-' + k + '-' + k,
                                    name: '三级 ' + k + '-' + k + '-' + k
                                }]
                            }]
                        })
                    }
                    this.sqbmList = _data;
                },
                handleChangePageNow: function (page) {
                    this.currentPageIndex = page ? (page.offset / this.optionGzzsp.currentSize + 1) : 1;
                    this.requestGzzsp(this.currentPageIndex, this.optionGzzsp.currentSize, '');
                },
                requestGetCorpName: function() {
                    var _this = this;
                    var _this = this;
                    $.ajax({
                        method:config.methodGet,
                        url: _this.getCorpName,
                        data: {
                            parentId: ''
                        },
                        dataType:'json',
                        success: function (data) {
                            if(data.code === '200'){
                                // 单位机构名称
                                _this.corpName = data.data;
                            }
                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                        },
                        error: function (data,textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                },
            },
            filters: {
                dateFormat: function (value) {

                    if (value == null || value == "") {
                        return '';
                    }
                    if (typeof (value) != 'string') {
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
                //状态
                getQueryTypeList: function () {
                    var _dataList = [];
                    $.each(fdDataTable.table1013, function (key, value) {
                        _dataList.push({
                            codeType: '10100003',
                            code: Number(key.replace('table', '')),
                            name: value
                        });
                    });
                    return _dataList;
                },
                // @Version 3.2.6 添加 deptRootId, deptDisabled
                deptRootId: function () {
                    this.gzzshSqbmValue = [];
                    if (this.gzzshlSqdwValue) {
                        if (this.gzzshlSqdwValue instanceof Array) {
                            return this.gzzshlSqdwValue[0];
                        } else {
                            return this.gzzshlSqdwValue;
                        }
                    }
                    return '';
                },
                deptDisabled: function () {
                    return !this.gzzshlSqdwValue;
                }
            },
            // 更新数据后调用该函数
            updated: function () {
                this.creatScrollBar1();
            },
            //  dom插入后调用该函数
            mounted: function () {
                var _this = this;
                this.$nextTick(function () {
                    _this.loadingData2(7);
                })

            },
            //  vm创建后调用该函数
            created: function () {
                //获取信息
                var _this = this;
                _this.requestGzzsp(_this.optionGzzsp.currentPage, _this.optionGzzsp.currentSize);
                _this.refreshList();
                _this.requestGetCorpName();
                //  绑定全局的下拉事件
                fdGlobal.bindDropMenuEvent();
                //禁用浏览器的backspace默认回退事件
                document.onkeypress = function (e) {
                    var ev = e || window.event; //获取event对象
                    var obj = ev.target || ev.srcElement; //获取事件源
                    var t = obj.type || obj.getAttribute('type'); //获取事件源类型
                    if (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && t != "number") {
                        return false;
                    }
                }
                document.onkeydown = function (e) {
                    var ev = e || window.event; //获取event对象
                    var obj = ev.target || ev.srcElement; //获取事件源
                    var t = obj.type || obj.getAttribute('type'); //获取事件源类型
                    if (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && t != "number") {
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
                this.loadingData2(7);
            }
        });
    });
