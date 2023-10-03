// 查询记录模块
define(['extend/template1.js', 'fdGlobal', 'config'], function (template1, fdGlobal, config) {

    new Vue({
        el: '#jsAppControllerCxjl',
        mixins: [template1],
        data: function () {
            return {
                gzServiceType:'',//盖章服务商类型
                loginPersonRole: config.url.frame.loginPerson,
                showSelectCorp:false,
                pageshow:true,
                // sqdw为申请单位下拉框绑定的数据
                sqdw: [{
                    code: 'beijing',
                    codeType: 'beijing',
                    name: '北京市'
                }, {
                    code: 'shanghai',
                    codeType: 'shanghai',
                    name: '上海市'
                }],
                // 申请单位选择后绑定的数据
                sqdwValue: null,
                //承办人
                cbrList:[],
                // sqbm为申请单位下拉框绑定的数据
                /*   sqbm: [{
                       code: 'beijing1',
                       codeType: 'beijing1',
                       name: '北京市1'
                   }, {
                       code: 'shanghai1',
                       codeType: 'shanghai1',
                       name: '上海市1'
                   }],*/
                // 申请部门选择后绑定的数据
                sqbm: '',
                // 信息检索关键字
                keyword: '',
                bmIdList: [],
                showOrNot: true,
                cbrShowOrNot:true,
                //申请开始时间
                sqsj_start: '',
                //申请结束时间
                sqsj_end: '',
                optionCxjl: { //信息查询目录分页
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
                query: {
                    // 分页数据
                    pageNow: 1,
                    pageSize: getLimit(),
                    offset: 0,
                    currentSize: ''
                },
                // 总记录数
                zjls: 1,
                // 数据总数
                zh: 2,
                // 查询记录list，表格数据
                cxjlDataList: [],
                //是否查询过
                queryFlag: false,
                total: 0,
                //查询条件
                cxtj: {
                    sqdw: '',
                    bmId: '',
                    cbrList:[],
                    sqkssj: '',
                    sqjssj: '',
                    zt: '',
                    //信息检
                    xxjs: '',
                    //时间戳
                    time: ''
                },
                options3: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.sqjssj).valueOf() - 86400000;
                        }
                    }
                })(this),
                options4: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.sqkssj).valueOf();
                        }
                    }
                })(this),
                zwsjShow: false
            }
        },
        methods: {
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 如果查询条件有值，怎清空后重新请求数据
                if(this.bmIdList || this.sqdwValue || this.sqbm || this.cbrList || this.keyword || this.cxtj.cxh || this.cxtj.sqkssj || this.cxtj.sqjssj) {
                    // 申请单位
                    this.sqdwValue = '';
                    // 申请部门
                    this.sqbm = '';
                    //承办人
                    this.cbrList = [];
                    this.bmIdList = [];
                    //开始时间
                    this.cxtj.sqkssj = this.firstDateOfCurYear();
                    //结束时间
                    this.cxtj.sqjssj = this.currentDate();
                    // 信息检索
                    this.keyword = '';
                    this.query.pageNow = 1;
                    this.query.offset = 0;
                    this.pageshow = false;//让分页隐藏
                    this.$nextTick(function (){//重新渲染分页
                        this.pageshow = true;
                    });
                    // 重新调用接口
                    this.loadPageData();
                }
                this.cbrShowOrNot = true;
                // if(this.siCleanDw){
                //     this.showOrNot = true;
                // }
                // 申请部门disabled置为true
                this.showOrNot = true;
            },
            check: function () {
                this.requestCxjl();
            },

            // 查询按钮绑定事件
            requestCxjl: function () {
                console.log("requestCxjl");
                var _this = this;
                _this.queryFlag = true;
                _this.query.pageNow = 1;
                _this.query.offset = 0;
                _this.loadPageData();
            },
            changeCorp: function (newValue, oldValue) {
                var _this = this;
                if(newValue!=null && newValue!=undefined){
                    _this.sqdwValue = newValue.id;
                    _this.showOrNot = false;
                }else{
                    _this.sqdwValue = '';
                    _this.cxtj.bmId = '';
                    _this.showOrNot = true;
                }
                _this.sqbm = '';
                _this.cbrList = [];
                _this.bmIdList = [];

            },
            changeDept : function (newValue, oldValue) {
                var _this = this;
                _this.bmIdList=[];
                if (newValue.length > 0){
                    for (var i = 0; i < newValue.length; i++) {
                        _this.bmIdList.push(newValue[i].id);
                    }
                }
                _this.cbrList = [];
            },
            changeUser : function (newValue, oldValue) {
                var _this = this;
                _this.cbrList=[];
                if (newValue.length > 0){
                    for (var i = 0; i < newValue.length; i++) {
                        _this.cbrList.push(newValue[i].id);
                    }
                }
            },

            //查询盖章服务类型
            queryGzServiceType:function(){
                var gzType="";
                $.ajax({
                    method: config.methodPost,
                    url: config.url.frame.queryGzServiceType,
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        console.log("盖章服务类型为："+data);
                        gzType = data;
                    },
                    error: function (data, textStatus, errorThrown) {
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
                return gzType;
            },
            //    查看审批表打开弹框页面
            goWhereViewSpd :function(row){
                if(row.mgxx == 1  && row.canView != 1){
                    Artery.notice.warning({
                        title: "申请单包含敏感信息，无法查看！"
                    });
                    return
                }

                var _this = this;
                _this.gzServiceType = _this.queryGzServiceType();
                if(1== _this.gzServiceType){//数科
                    _this.gzWindow = window.open(config.url.frame.viewQzOfdCxy+ "?bh=" +row.bh);
                }else if(2 == _this.gzServiceType){//书生
                    _this.openSqb(row.bh);
                }
            },
            openSqb: function (bh) {
                // 请求书生的阅读接口
                Artery.ajax.get("/api/v1/spb/view", {
                    timeout: 50000,
                    params: {
                        sqbh: bh,
                        type: "1",  //1: 地方  2: 中央
                        time: Date.now()
                    }
                }).then(function (result) {
                    if (result === 'dzurl') {
                        result = '../../../approval/cgdyyl/index.html';
                    } else if(!(result && /(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(result))) {
                        Artery.notice.warning({
                            title: '无法连接上电子签章服务，请联系管理员',
                            desc: ''
                        });
                        return;
                    }
                    Artery.open({
                        targetType: "_blank",
                        url: encodeURI(result),
                        params: {
                            cBh: bh
                        }
                    });
                })
            },

            // 申请单位
            selectSqdw: function () {

            },
            // 申请部门函数
            selectSqbm: function () {

            },
            selectSqsjStart: function (date) {
                if (new Date(this.cxtj.sqjssj) < new Date(date)) {
                    Artery.notice.warning({
                        title: "开始时间不能大于结束时间"
                    })
                    this.cxtj.sqkssj = "";
                }
            },
            selectSqsjEnd: function (date) {
                if (new Date(this.cxtj.sqkssj) > new Date(date)) {
                    Artery.notice.warning({
                        title: "开始时间不能大于结束时间"
                    })
                    this.cxtj.sqjssj = "";
                }
            },

            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                this.query.offset = (this.query.pageNow - 1) * page.limit;
                this.loadPageData();
            },

            handleChangePageSize: function (page) {
                this.query.pageSize = page;
                this.loadPageData();
            },
            ready: function (scrollbar) {
                scrollbar.update();
            },
            loginPersonData: function () {
                var _this = this;
                Artery.ajax.get(_this.loginPersonRole).then(function (result) {
                    if ("zyjdy" == result.data.roles[0]) {
                        _this.showSelectCorp = true;
                    }else {
                        _this.showOrNot=false;
                    }
                })

            },

            loadPageData: function () {
                var _this = this;
                _this.cxtj.time = Date.now();
                if (_this.queryFlag == false) {
                    _this.cxtj.xxjs = '';
                    _this.cxtj.sqdw = '';
                    _this.cxtj.bmId = '';
                    _this.cxtj.cbrList = [],
                        _this.bmIdList= [],
                    _this.cxtj.sqkssj = _this.firstDateOfCurYear();
                    _this.cxtj.sqjssj = _this.currentDate();
                } else {
                    _this.bmIdList = _this.bmIdList,
                    _this.cxtj.xxjs = _this.keyword;
                    _this.cxtj.sqdw = _this.sqdwValue;
                    _this.cxtj.bmId = _this.sqbm;
                    _this.cxtj.cbrList = _this.cbrList;
                }
                this.cxtj.bmIdList = _this.bmIdList;
                Artery.loadPageData('/api/v1/cxjcjl/getCxjlData',{
                    condition:_this.cxtj,
                    queryInfo:_this.query
                }).then(function (result) {
                    //           Artery.loadPageData("../../../../../../api/v1/cxjcjl/getCxxxData", _this.queryInfo, _this.cxtj)
                    //             .then(function(result) {
                    if (result.success) {
                        _this.cxjlDataList = result.data.data;
                        if(_this.cxjlDataList.length <= 0 ) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.total = result.data.total;
                        if (parseInt(_this.total / _this.query.pageSize) == _this.query.pageNow - 1) {
                            _this.query.currentSize = _this.total;
                        } else {
                            _this.query.currentSize = _this.query.pageSize * (_this.query.pageNow);
                        }
                    } else {
                        Artery.message.error(result.message);
                    }
                })
            },
            firstDateOfCurYear: function() {
                return new Date().getFullYear() + '-01-01';
            },
            currentDate: function () {
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var date = now.getDate();
                return year + '-' + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date);
            }
        },
        mounted: function () {
            var _this = this;
            _this.loadPageData();
            _this.loginPersonData();
        },
        // @Version 3.2.6 添加 computed
        computed: {
            deptRootId: function () {
                this.bmIdList = [];
                if (this.sqdwValue) {
                    if (this.sqdwValue instanceof Array) {
                        return this.sqdwValue[0];
                    } else {
                        return this.sqdwValue;
                    }
                }
                return '';
            },
            deptDisabled: function () {
                return !this.sqdwValue;
            }
        }
    })
});
