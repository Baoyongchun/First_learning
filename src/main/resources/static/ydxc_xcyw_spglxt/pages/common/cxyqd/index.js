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
                    showAll:true,
                    name: '查询员清单',
                    //查询员清单列表查询
                    serverUrlGetSubOrgans: config.dirProjectPath + "/api/v1/admin/getSubOrgans",
                    getUserId: _config.url.frame.getUserId,
                    //登陆人信息
                    loginPersonRole: _config.url.frame.loginPerson,
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
                    gjc:'',
                    bmId: '', //申请部门ID
                    // gzzPicAddress: _config.url.frame.getGzzPic,//工作证图片地址
                    // gzzPicAddress: './images/icon-gzz.jpg',
                    cBh: '', //编号
                    queryFlag: false,
                    guanjianci: "",
                    /// 申请单位
                    sqdw: [],
                    // 申请单位选择后绑定的数据
                    gzzshlSqdwValue: null,
                    gzzshlSqdwValueInit: null,
                    showOrNot:false,
                    // 申请单位列表
                    sqdwList: [],
                    // 申请部门
                    sqbm: [],
                    // 申请部门列表
                    sqbmList: [],
                    // 申请单位选择后绑定的数据
                    sqbmValue:[],
                    // 默认申请部门不可选
                    disabled: true,
                    // 状态
                    zt: '',
                    // 不通过原因
                    btgyy:'',
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
                    if(this.gzzshlSqdwValue || this.sqbmValue || this.nZt || this.gjc ) {
                        // 申请单位
                        this.gzzshlSqdwValue = '';
                        // 申请部门
                        this.sqbmValue = [];
                        // 状态
                        this.nZt = 0;
                        // 关键词
                        this.gjc = '';
                        // @version 3.2.6 去掉重置默认单位节点选中
                        // this.gzzshlSqdwValue = this.gzzshlSqdwValueInit;
                        this.optionGzzsp.currentPage = 1;
                        this.optionGzzsp.currentSize = getLimit();
                        this.pageshow = false;//让分页隐藏
                        this.$nextTick(function (){//重新渲染分页
                            this.pageshow = true;
                        });
                        // 重新调用接口
                        this.requestCxyqd(this.optionGzzsp.currentPage, this.optionGzzsp.currentSize);
                    }
                },
                loginPersonData: function () {
                    var _this = this;
                    Artery.ajax.get(_this.loginPersonRole).then(function (result) {
                        if ("shy" == result.data.roles[0]) {
                            _this.showAll = false;
                        }else {
                            _this.showOrNot = false;
                        }
                    })

                },
                //信息查询请求
                requestCxyqd: function (currentPage, currentSize, type) {
                    var _this = this;
                    var _serverData;
                    if (type == "cx") { //点击查询按钮发的请求数据
                        _this.oldStartDate = _this.startDate;
                        _this.oldEndDate = _this.endDate;
                        _this.oldQueryType = _this.queryType;
                        _this.oldxxJs = _this.xxJs;
                        _serverData = {
                            gjc: _this.gjc,
                        	nZt: _this.nZt,
                            currentPage: currentPage,
                            currentSize: currentSize,
                            sqdwValue: _this.gzzshlSqdwValue,
                            sqbmValue: _this.sqbmValue
                        };
                    } else { //点击分页发的请求数据
                        _serverData = {
                                gjc: _this.gjc,
                            	nZt: _this.nZt,
                                currentPage: currentPage,
                                currentSize: currentSize,
                                sqdwValue: _this.gzzshlSqdwValue,
                                sqbmValue: _this.sqbmValue
                        };
                    }

                    Artery.loadPageData(_this.serverUrlGetSubOrgans,_serverData).then(function (result) {
                        if (result.data!=undefined && result.data.userList.length>=0) {
                                 _this.gzzspDataList = result.data.userList;
                                 // 当数据的长度等于0时，暂无数据显示
                                 if (_this.gzzspDataList.length <= 0 ) {
                                     _this.zwsjShow = true;
                                 } else {
                                     _this.zwsjShow = false;
                                 }
                                 _this.queryFlag = true;
                                 _this.optionGzzsp.totalPage = result.data.pageOut.totalPage;
                                 _this.optionGzzsp.totalSize = result.data.pageOut.totalSize;
                                 _this.optionGzzsp.currentPage = currentPage;
                                 _this.optionGzzsp.currentSize = currentSize;
                                 if(_this.$refs.gzzScroll) {
                                     _this.$refs.gzzScroll.update();
                                 }

                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    });
                },
                //获取状态
                getStatus: function (valid) {
                    if(valid === 1){
                        return "有效";
                    }else if(valid === 2){
                        return "无效";
                    } else {
                        return "锁定";
                    }
                },
                changeCorp: function (newValue, oldValue) {
                	var _this = this;
                	if(newValue!=null && newValue!=undefined){
                		_this.gzzshlSqdwValue = newValue.id;
                		_this.showOrNot = false;
                	}else{
                		_this.gzzshlSqdwValue = '';
                		_this.showOrNot = true;
                	}
                    _this.sqbmValue = [];
                },
                changeDept: function (newValue, oldValue) {
                    var _this = this;
                    _this.sqbmValue=[];
                    if (newValue.length > 0){
                        for (var i = 0; i < newValue.length; i++) {
                            _this.sqbmValue.push(newValue[i].id);
                        }
                    }
                },

                //申请部门组织结构树值改变
                changeSqbmOrgan: function (newVal, oldVal) {
                    this.sqbmId = newVal.id;
                    this.organType = newVal.customData.type
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
                handleChangePageNow: function (page) {
                    this.currentPageIndex = page ? (page.offset / this.optionGzzsp.currentSize + 1) : 1;
                    this.requestCxyqd(this.currentPageIndex, this.optionGzzsp.currentSize, '');
                },
                openGzzzp: function (index) {
                    var url =config.dirProjectPath + '/api/gzz/getGzzzp/' + this.gzzspDataList[index].id;
                    var dataCkgzz = {
                        flag: "ckgzz",
                        _data: url
                    };
                    // 给首页发消息
                    window.parent.parent.postMessage(JSON.stringify(dataCkgzz), '*');
                }
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

            },
            // 更新数据后调用该函数
            updated: function () {
                this.creatScrollBar1();
            },
            //  dom插入后调用该函数
            mounted: function () {
                var _this = this;
                _this.loginPersonData();
                this.$nextTick(function () {

                })

            },
            //  vm创建后调用该函数
            created: function () {
                //获取信息
                var _this = this;


                    $.ajax({
                        method: _config.methodGet,
                        url: "/api/v1/admin/currently/userOrgan",//_this.getUserId,
                        dataType: "json",
                        success: function (data) {
                            // @Version 3.2.6 注释掉 修改为默认查询全部 _this.gzzshlSqdwValue = data.data.id;
                            _this.gzzshlSqdwValueInit = data.data.id;
                            _this.gzzshlSqdwValue = data.data.id;
                            _this.requestCxyqd(_this.optionGzzsp.currentPage, _this.optionGzzsp.currentSize);
                        }, error: function (data, textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }});




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
            },
            // @Version 3.2.6 添加
            computed: {
                deptRootId: function () {
                    this.sqbmValue = [];
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
            }
        });
    });
