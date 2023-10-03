// 查询记录模块
define(['extend/template1.js', 'fdGlobal', 'config','fdComponent2'], function (template1, fdGlobal, _config,fdComponent2) {
    new Vue({
        el: '#jsAppControllerCzxw',
        mixins: [template1],
        data: function() {
            return {
                pageshow:true,
                //地级才展示所属单位
                showSelectCorp:false,
                //查询时间
                query: {
                    endDate: '',
                    startDate: ''
                },
                // sqdw为申请单位下拉框绑定的数据
                sqdw: [{
                    code: 'beijing',
                    codeType: 'beijing',
                    name: '北京市'
                }],
                // 申请单位选择后绑定的数据
                czxwjlSqdwValue: null,
                // sqbm为申请单位下拉框绑定的数据
                sqbm: [{
                    code: 'beijing1',
                    codeType: 'beijing1',
                    name: '北京市1'
                }],
                // 申请单位选择后绑定的数据
                czxwjlSqbmValue: null,
                // 信息检索关键字
                keyword: '',
                password: '',
                msg : '',
                serverUrlQueryCzxw: _config.url.frame.queryCzxw,
                queryLoginPersonRoleByUrl: _config.url.frame.loginPerson,
                optionCzxw: { //信息查询目录分页
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
                // 总记录数
                zjls: 2,
                // 数据总数
                zh: 2,
                // 查询记录list
                // 查询记录list，表格数据
                czxwDataList: [],
                //是否查询过
                queryFlag: false,
                showOrNot: true,
                //申请部门
                bmIdList: [],
                //暂无数据是否显示
                zwsjShow:false,
                showCzxwDc:false,//地级才可以导出
                optionStartDate: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.query.endDate).valueOf();
                        }
                    }
                })(this),
                optionEndDate: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.query.startDate).valueOf() - 86400000;
                        }
                    }
                })(this)
            };
        },
        mounted:function(){
            this.$refs.scrollTable.update();
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
                if(this.czxwjlSqdwValue || this.bmIdList || this.keyword || this.query.startDate || this.query.endDate) {
                    // 申请单位
                    if(this.showSelectCorp){
                        this.czxwjlSqdwValue = '';
                        this.showOrNot = true;
                    }
                    this.czxwjlSqdwValue = '';
                    // 申请部门
                    this.bmIdList = [];
                    // 开始时间
                    this.query.startDate = '';
                    // 结束时间
                    this.query.endDate = '';
                    // 信息检索
                    this.keyword = '';
                    this.optionCzxw.currentPage = 1;
                    this.optionCzxw.currentSize = getLimit();
                    this.pageshow = false;//让分页隐藏
                    this.$nextTick(function (){//重新渲染分页
                        this.pageshow = true;
                    });
                    // 重新调用接口
                    this.requestCzxw(this.optionCzxw.currentPage, this.optionCzxw.currentSize, 'cx');
                }
            },
            //信息查询请求
            requestCzxw: function (currentPage, currentSize, type) {
                var _this = this;
                var _serverData;
                if (type === "cx") { //点击查询按钮发的请求数据
                    _this.oldStartDate = _this.query.startDate;
                    _this.oldEndDate = _this.query.endDate;
                    _this.oldKeyword = _this.keyword;
                    _serverData = {
                        currentPage: currentPage,
                        currentSize: currentSize,
                        keyWord: _this.keyword,
                        startDate: _this.query.startDate,
                        endDate: _this.query.endDate,
                        bmIdList: _this.bmIdList,
                        sqdwValue: _this.czxwjlSqdwValue
                    };
                } else { //点击分页发的请求数据
                    _serverData = {
                        currentPage: currentPage,
                        currentSize: currentSize,
                        keyWord: _this.oldKeyword,
                        startDate: _this.oldStartDate,
                        endDate: _this.oldEndDate,
                        bmIdList: _this.bmIdList,
                        sqdwValue: _this.czxwjlSqdwValue
                    };
                }
                Artery.loadPageData(_this.serverUrlQueryCzxw,_serverData).then(function (data) {
                	if (data.code === "200") {
                        _this.czxwDataList = data.data.xwList;
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.czxwDataList.length <= 0 ) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.$refs.scrollTable.update();
                        _this.queryFlag = true;
                        _this.optionCzxw.totalPage = data.data.page.totalPage;
                        _this.optionCzxw.totalSize = data.data.page.totalSize;
                        _this.optionCzxw.currentPage = currentPage;
                        _this.optionCzxw.currentSize = currentSize;
                    }

                    //输出日志
                    fdGlobal.consoleLogResponse(_config.showLog, _this.name + '静态数据', data)
                });

            },
            changeCorp: function (newValue, oldValue) {
            	var _this = this;
            	if(newValue!=null && newValue!=undefined){
            		_this.czxwjlSqdwValue = newValue.id;
            		_this.showOrNot = false;
            	}else{
            		_this.czxwjlSqdwValue = '';
            		_this.bmIdList = [];
            		_this.showOrNot = true;
            	}
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

            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.currentPageIndex = page ? (page.offset / this.optionCzxw.currentSize + 1) : 1;
                this.requestCzxw(this.currentPageIndex, this.optionCzxw.currentSize, '');
            },

            loginPersonData: function () {
                var _this = this;
                Artery.ajax.get(_this.queryLoginPersonRoleByUrl).then(function (result) {
                    if ("zyjdy" != result.data.roles[0]) {
                    _this.showSelectCorp = false;
                    _this.showCzxwDc=true;
                    _this.showOrNot=false;
                    }else{
                    _this.showOrNot=false;
                    _this.showCzxwDc=false;
                        //baseOrgan为纪委监察委下第一个子节点，中央为中央纪委监察委
                    //_this.czxwjlSqdwValue = result.data.baseOrgan.id;
                }
                })
            },
            modalPage: function (url) {
                this.$refs.editWidiow.open();
            },
            cancelModal: function () {
                var _this = this;
                _this.password = '';
                this.msg = '';
            },
            exportHandle: function () {
                if (this.password && this.password.length > 9) {
                    var parr = /^(?![^a-zA-Z]+$)(?!\D+$)/;
                    if (parr.test(this.password)) {
                        this.downloadFile(this.query.startDate, this.query.endDate, this.bmIdList,this.password,
                            this.keyword,this.czxwjlSqdwValue)
                    } else {
                        this.msg = "提示：密码至少包含包含数字和字母两种字符，位数要在10位以上（包含10位）";
                    }
                } else {
                    this.msg = "提示：密码至少包含包含数字和字母两种字符，位数要在10位以上（包含10位）";
                }
            },
            downloadFile: function (startDate, endDate, bmIdList,password,keyword,sqdwValue) {
                var _this = this;
                var data=new Array();
                for(var i = 0; i < 9; i++) {
                    data[i] = new Array();
                };
                data[0][0]='startDate';
                data[0][1]=startDate;
                data[1][0]='endDate';
                data[1][1]=endDate;
                data[2][0]='bmIdList';
                data[2][1]=bmIdList;
                data[3][0]='password';
                data[3][1]=password;
                data[4][0]='keyword';
                data[4][1]=keyword;
                data[5][0]='sqdwValue';
                data[5][1]=sqdwValue;
                _this.openPostWindow("/api/sjrz/exportCzxw",data,i);
                _this.$refs.editWidiow.close();
                _this.password='';
            },
            openPostWindow:function (url, args){
                // 组装form表单
                var downloadForm = document.createElement("form");
                downloadForm.action=url;
                downloadForm.method='post';
                for(var i=0; i<args.length; i++){
                    var input=document.createElement("input");
                    input.type='hidden';
                    input.name=args[i][0];
                    input.value=args[i][1];
                    downloadForm.appendChild(input);
                };
                window.document.body.appendChild(downloadForm);
                downloadForm.submit();
                document.body.removeChild(downloadForm);
            }
        },
        // vm创建后调用该函数
        created: function () {
            //获取信息
            var _this = this;
            _this.requestCzxw(_this.optionCzxw.currentPage, _this.optionCzxw.currentSize, 'cx');
            _this.loginPersonData();
        },
        // @Version 3.2.6 添加
        computed: {
            deptRootId: function () {
                this.bmIdList = [];
                if (this.czxwjlSqdwValue) {
                    if (this.czxwjlSqdwValue instanceof Array) {
                        return this.czxwjlSqdwValue[0];
                    } else {
                        return this.czxwjlSqdwValue;
                    }
                }
                return '';
            },
            deptDisabled: function () {
                return !this.czxwjlSqdwValue;
            }
        }
    })
});