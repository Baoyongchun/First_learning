
// 查询记录模块
define(['fdGlobal', 'config', 'fdDataTable', 'scrollbar', 'fdComponent2', "dragFun", 'userBehavior', 'jqueryUi', 'layDate','fdEventBus','fdMessage'],
    function (fdGlobal, config,fdDataTable, scrollbar, fdComponent2, dragFun, userBehavior, jqueryUi, layDate, fdEventBus,fdMessage) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var scrollBar1;
    var _vm = new Vue({
        // 控制器id
        el: '#jsAppControllerzzyhgl',
        // 数据
        data: {
            pageshow:true,
            name: '审批表信息',
            //列表数据
            getZzjgList: _config.url.frame.getZzjgList,
            //配置信息
            getZzjgPzxx:_config.url.frame.getZzjgPzxx,
            //头像地址
            getZzjgTx:_config.url.frame.getZzjgTx,
            //配置角色
            getZzjgPzjs:_config.url.frame.getZzjgPzjs,
            //配置权限
            getZzjgPzqx:_config.url.frame.getZzjgPzqx,
            //保存
            getZzjgPzbc:_config.url.frame.getZzjgPzbc,
            //非组织机构工作证图片地址
            getZzjgGzz: _config.url.frame.getZzjgGzz,
            //工作证图片地址
            getZzjgGzzZy: _config.url.frame.getZzjgGzzZy,
            //导出组织机构
            exportZzjg: _config.url.frame.exportZzjg,
            //解锁
            getUnlock: _config.url.frame.getUnlock,
            //判断专案组
            getPdzaz:_config.url.frame.getPdzaz,
            //获取专案组详情
            getXjzaz:_config.url.frame.getXjzaz,
            //新建用户
            getNewUser:_config.url.frame.getNewUser,
            // 地方同步组织机构接口
            tbzzjgUrl:_config.url.frame.tbzzjgUrl,
            // 重置密码
            czmmUrl:_config.url.frame.czmmUrl,
            // 解锁
            jsUrl:_config.url.frame.jsUrl,
            //清除ip或mac
            ipOrMacUrl:_config.url.frame.ipOrMacUrl,
            // 登录人身份请求地址
            serverUrlLoginPerson: config.url.frame.loginPerson,
            // 请求当前部门的单位名称
            getCorpName: config.url.frame.getZzjgCorpName,
            //根据单位id获取单位信息
            getCorpByTreeId: config.url.frame.getCorpByTreeId,
            //编辑单位配置信息
            editCorpConfig: config.url.frame.editCorpConfig,
            //是否显示工作证？新建不能显示
            gzzShow:false,
            //查询时间
            query:{
                endDate: null,
                startDate: null
            },
            tableShow:false,//显示列表
            pzShow:false,//配置信息显示
            //配置信息
            cXm:'',
            cYhm:'',
            cSsjg:'',
            cZw:'',
            cZj:'',
            cDh:'',
            cStartTime:'',
            cEndTime:'',
            statue:'',
            //查询类型
            queryType:0,
            oldQueryType:0,
            //分页查询时间
            oldEndData: null,
            oldStartDate: null,
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
            optionZzjghgl: {//信息查询目录分页
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
                    /* console.log(num)*/
                }
            },
            //审批表信息list
            zzjgyhglDataList:[],
            //配置信息
            zzjgyhglPzList:{},
            userName:'',//用户名
            cDwId:'',//单位编号
            type:'dept',//单位还是部门
            pzjsList:[],//配置角色接口数据
            pzjsValId:'',//配置角色id
            /*pzjsValId:[],//配置角色id*/
            cRoleId:'',//配置角色code
            cUserId:'',//用户id
            statues:'',//状态
            parentId:'',//最外层机构id，需要传给页面，判断是否显示新建专案组按钮
            xjzaz:false,//新建专案组
            zazShow:false,//是专案组
            dataList:{},//专案组详情
            picShow:false,
            file: null,
            image: "#",
            user: {},
            base64Code: "",
            visiable: false,
            newUser:{//新建用户传参
                cId: "",
                cMobilePhone: "",
                cTelePhone: "",
                cRoleId: "",
                name: "",
                loginId: "",
                corpId: "",
                deptId: "",
                position: "",
                endDate: "",
                rank: "",
                startDate: "",
                passWord:'*********',
                gzzKssj:'',// 工作证开始时间
                gzzJssj:''// 工作证结束时间
            },
            corpName:'',//所属机构
            deptName:'',//所属部门
            rank:'',//新建用户职级
            position:'',//新建用户职务
            zazpz:false,//专案组用户配置
            zazpzzp:false,//专案组配置用户照片
            queryFlag:false,
            nSftb:'',
            // 状态
            zt:'',
            // 状态列表
            ztList: [{
                code: '1',
                name: '有效'
            }, {
                code: '3',
                name: '锁定'
            }],
            //角色列表
            jsList:[{
                    code: '查询员',
                    name: '查询员'
                },{
                    code: '审核员',
                    name: '审核员'
                }, {
                    code: '监督员',
                    name: '监督员'
                }, {
                    code: '系统管理员',
                    name: '系统管理员'
                }, {
                    code: '审核监督员',
                    name: '审核监督员'
                }
            ],
            jsName:'',
            triggerCode: false,// 展开收起标志
            evtDrag:true,
            // 当前分页的页码 1,2,3,4,默认第一页
            currentPageIndex: 1,
            center: false,
            zwsjShow: false,// 判断是否显示暂无数据
            isPzjsDisabled: false, // 是否禁用配置角色
            // 选中的角色的key
            currentItemKey: '',
            /*currentItemKey: [],*/
            // 功能权限的list
            authList: [],
            // 配置的时候回显权限的选中
            qxcode: [],
            // 是否显示工作证
            isShowZzz: true,
            isHasCorpName: false,
            //解锁用户id
            lockUserId: '',
            resizeHeight:0,
            //选中的行
            rowData: [],
            exportOrganByFilter: _config.url.frame.exportOrganByFilter,
            getUserId: _config.url.frame.getUserId,
            currentUserCorp: '',
            ip: '',
            mac: '',
            jglx: '',
            canEdit: false,
            dwObject:{
                id:'',
                name: '',
                ext:{
                    JGBM:''
                }
            },
            confirmMessage:''
        },
        // 方法
        methods: {
            /**
             *  @Author nfj
             * @description 点击系统角色的list
             * @name clickRolesItem
             * @param {object} item 选中的item
             * @return {*} 无
             */
            clickRolesItem: function(item) {
                // 当前选中的角色的名称（适用于回显）
                this.currentItemKey = item.name;
                // 系统角色id
                this.pzjsValId = item.code;
                /*if(this.currentItemKey.indexOf(item.name)>-1){
                    this.currentItemKey.splice(this.currentItemKey.indexOf(item.name),1)
                    this.pzjsValId.splice(this.currentItemKey.indexOf(item.code),1)
                }else {
                    this.currentItemKey.push(item.name);
                    // 系统角色id
                    this.pzjsValId.push(item.code);
                }*/
                // this.getQxxx(item.code);
            },
            /**
             *  @Author nfj
             * @description 点击功能权限的list
             * @name clickAuthItem
             * @param {object} item 选中的item
             * @return {*} 无
             */
            clickAuthItem: function(item) {
                item.active = !item.active;
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 如果查询条件有值，怎清空后重新请求数据
                if(this.userName || this.zt || this.jsName) {
                    // 用户姓名
                    this.userName = '';
                    // 状态
                    this.zt = '';
                    this.jsName = '';
                }
                this.currentPageIndex = 1;
                this.optionZzjghgl.currentPage = 0;
                this.optionZzjghgl.currentSize = getLimit();
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                // 重新调用接口
                this.requestZzjgyhgl(this.optionZzjghgl.currentPage,this.optionZzjghgl.currentSize);
            },
            setIndex: function(index) {
                return (index + 1) + (this.currentPageIndex - 1) * getLimit();
            },
            /**
             * @description 分页改变的时候的方法
             * @name changePage
             * @param {object} 分页的当前页
             * @return {*} 无
             */
            changePage: function(pageInfo) {
                // offset为当前页的偏移量，limit当前页的显示最大条数
                var currentPage = Math.ceil(pageInfo.offset/pageInfo.limit) + 1;
                // 当前页
                this.currentPageIndex = currentPage;
                this.requestZzjgyhgl(currentPage, pageInfo.limit);
            },
            /**
             *  @Author wlq
             * name tbzzjgClick
            * description 同步组织机构
            * */
            tbzzjgClick: function() {
                var _this = this;
                var _serverData = {};
                $.ajax({
                    method:config.methodPost,
                    url: _this.tbzzjgUrl,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        $.alert({
                            type: 'success',
                            info: {
                                success: '同步组织机构成功'
                            },
                            interval: 900
                        });
                        //输出日志
                        fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },

            /**
             *  * @Author wlq
             *    @Date 2020/03/19
             *    @description 重置密码
             */
            clickInit: function() {
                var _this = this;
                var _serverData = {
                    userId: _this.newUser.cId
                };
                $.ajax({
                    method:config.methodPost,
                    url: _this.czmmUrl,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        $.alert({
                            type: 'success',
                            info: {
                                fail: '同步组织机构成功'
                            },
                            interval: 900
                        });
                        //输出日志
                        fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            /**
             *  * @Author wlq
             *    @Date 2020/03/19
             *    @description 解锁
             */
            clickUnlock: function(index){
                var _this = this;
                var _serverData = {
                    lockUserId: _this.zzjgyhglPzList.id
                };
                $.ajax({
                    method:config.methodPost,
                    url: _this.jsUrl,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        $.alert({
                            type:'success',
                            info :{
                                success:'解锁成功'
                            },
                            interval:1800
                        });
                        _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize)
                        //输出日志
//                                fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
                        $.alert({
                            type:'faile',
                            info :{
                                faile:'解锁失败'
                            },
                            interval:1800
                        });
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            /**
             *  * @Author wlq
             *    @Date 2020/03/19
             *    @description 清除IP
             */
            clickIp: function(){
                var _this = this;
                var _serverData = {
                    userId: _this.newUser.cId,
                    ip: '',
                    mac: _this.mac
                };
                $.ajax({
                    method:config.methodPost,
                    url: _this.ipOrMacUrl,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        $.alert({
                            type:'success',
                            info :{
                                success:'清除成功'
                            },
                            interval:1800
                        });
                        _this.ip = '';
                        _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize)
                        //输出日志
//                                fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
                        $.alert({
                            type:'faile',
                            info :{
                                faile:'清除失败'
                            },
                            interval:1800
                        });
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            /**
             *  * @Author wlq
             *    @Date 2020/03/19
             *    @description 清除Mac
             */
            clickMac: function(){
                var _this = this;
                var _serverData = {
                    userId: _this.newUser.cId,
                    ip: _this.ip,
                    mac: ''
                };
                $.ajax({
                    method:config.methodPost,
                    url: _this.ipOrMacUrl,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        $.alert({
                            type:'success',
                            info :{
                                success:'清除成功'
                            },
                            interval:1800
                        });
                        _this.mac = ''
                        _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize)
                    },
                    error: function (data,textStatus, errorThrown) {
                        $.alert({
                            type:'faile',
                            info :{
                                faile:'清除失败'
                            },
                            interval:1800
                        });
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            /*滚动条滑动*/
            scrollLeft:function(top,left) {
                var tableHead = $('.fd-table-header .aty-table__header-wrapper .aty-table__header');
                if(this.evtDrag) {
                    tableHead.addClass('fd-scrollbar-transition');
                };
                tableHead.css('transform','translate('+left+')');
            },
            /*展开收起下拉树区域*/
            triggerClick: function() {
                this.triggerCode = !this.triggerCode;
            },
            // 导出组织机构
            exportJson:function(exportAll){
                var _this = this;
                fdGlobal.initNoticeLogs().then(function (res) {
                    res.noticeList.forEach(function (item) {
                        var params = {
                            id: item.id,
                            readed: item.readed
                        }
                        $.ajax({
                            type: 'get',
                            url: config.url.frame.updateNoticeStatusUrl,
                            data: params,
                            dataType: "json",
                            success: function (data) {
                                console.info('消息已读：',data);
                                window.parent.postMessage('reload-Message', '*');
                            }
                        });
                    })
                });

                // 创建这次导出的唯一标识，当前毫秒数、6位随机数再加上下载的序号，以下划线分隔
                var exportKey = new Date().getTime() + '_' + Math.floor((Math.random()*1000000)+1);

                // 同时下载两个文件，组织机构数据json文件和组织机构统计txt文件
                var fs = new Array(1);
                for(var i=0;i<1;i++) {
                    var f = $('<iframe style="display:none;hight:0px" src="/api/syncorgan/action/exportOrgan?exportAll=' + exportAll +
                        '&exportKey=' + exportKey +'_' + i+'" ></iframe>');
                    $(document.body).append(f);
                    fs[i] = f;
                }
                setTimeout(function(){
                    for (var i = 0; i < fs.length; i++) {
                        fs[i].remove();
                    }
                }, 60*1000);
            },
            //新建完刷新页面
            refreshList:function(){
                var _this=this;
                window.addEventListener('message', function(evt){
                    if(evt.data==='xjzazRefresh'){
                        _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
                        _this.hqzazxq();
                        _this.reloadZzjgs();
                    } else if(evt.data==='xjzazRemoveRefresh') {
                        _this.reloadZzjgs();
                    }
                }, false);
            },
            // 切换部门单位
            atyTreeClick:function(newValue) {
                this.tableShow = true;
                this.pzShow = false;
                this.cDwId = newValue.id; //单位编号
                this.type = newValue.customData.type; //单位还是部门
                this.parentId = newValue.parentId;
                this.deptName = newValue.name;
                // 如果点击的是部门
                if (newValue.type === 'dept') {
                    // 获取当前部门的单位名称
                    this.requestGetCorpName(newValue.parentId)
                }
                this.requestZzjgyhgl(1,getLimit());
                // 是否可以新建专案组
                if(newValue.type === 'corp') {
                    this.xjzaz = true;
                    this.zazShow = false;
                } else if(newValue.type === 'dept')  {
                    this.xjzaz = false;
                }
                this.pdzaz();
                this.getDwxx();
            },
            // 请求得到单位组织机构的名称
            requestGetCorpName: function(parentId) {
                var _this = this;
                $.ajax({
                    method:config.methodGet,
                    url: _this.getCorpName,
                    data: {
                        parentId: parentId
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
            //信息查询请求  requestZzjgyhgl
            requestZzjgyhgl: function(pageObj,currentSize,type){
                var _this= this;
                var _serverData;
                // artery表格控件传递的是一个对象{limit:10, splitPage: true, tableId: 'aty-table_1', offset: undefined}
                var currentPage = 1;
                if (pageObj && pageObj instanceof Object) {
                    currentPage = pageObj.offset ? pageObj.offset : 1;
                    currentSize = pageObj.limit;
                } else if(pageObj){
                    currentPage = pageObj;
                }
                _this.currentPageIndex = currentPage;
                currentSize = currentSize ? currentSize : 10;
                _this.zzjgyhglDataList = [];
                if(type=="cx"){//点击查询按钮发的请求数据
                    _this.oldStartDate=_this.startDate;
                    _this.oldEndDate=_this.endDate;
                    _this.oldQueryType=_this.queryType;
                    _this.oldxxJs=_this.xxJs;
                    _serverData={
                        currentPage:currentPage,
                        currentSize:currentSize,
                        id:_this.cDwId,//单位编号
                        type:_this.type,//单位还是部门
                        gjc:_this.userName,// 关键词
                        nZt:_this.zt,// 关键词
                        jsName:_this.jsName//角色名称
                    };
                }else {//点击分页发的请求数据
                    _serverData={
                        currentPage:currentPage,
                        currentSize:currentSize,
                        id:_this.cDwId,//单位编号
                        type:_this.type,//单位还是部门
                        gjc:_this.userName,// 关键词
                        nZt:_this.zt// 关键词
                    };
                }
                $.ajax({
                    method:config.methodGet,
                    url: _this.getZzjgList,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        if(data.code === '200'){
                            if(data.data.userList.length == 0){
                                _this.zzjgyhglDataList = [];
                                return
                            }
                            _this.zzjgyhglDataList=data.data.userList;
                            _this.queryFlag=true;
                           for(var i = 0;i<_this.zzjgyhglDataList.length;i++) {
                               if(_this.zzjgyhglDataList[i].valid === 1){
                                   _this.zzjgyhglDataList[i].valid = "有效"
                               }else if(_this.zzjgyhglDataList[i].valid === 2){
                                   _this.zzjgyhglDataList[i].valid = "无效"
                               } else {
                                   _this.zzjgyhglDataList[i].valid = "锁定"
                               }
                                _this.getZzjgGzz = _config.url.frame.getZzjgGzz;
                                _this.getZzjgTx = _config.url.frame.getZzjgTx;
                                _this.zzjgyhglDataList[i].yhglPicAddress = '';
                                _this.zzjgyhglDataList[i].yhglPicAddress = _this.getZzjgTx + '/' + _this.zzjgyhglDataList[i].id+"?"+Math.random();
                                _this.zzjgyhglDataList[i].yhglGzzAddress = '';
                                _this.zzjgyhglDataList[i].yhglGzzAddress = _this.getZzjgGzz + '/' + _this.zzjgyhglDataList[i].id+"?"+Math.random();
                            }
                            _this.optionZzjghgl.totalPage=data.data.pageOut.totalPage;
                            _this.optionZzjghgl.totalSize=data.data.pageOut.totalSize;
                            _this.optionZzjghgl.currentPage=data.data.pageOut.totalPage;
                            // _this.optionZzjghgl.currentSize=data.data.pageOut.totalSize;
                            if(_this.zzjgyhglDataList.length) {
                                _this.zwsjShow = true;
                            }else {
                                _this.zwsjShow = false;
                            }
                            _this.$nextTick(function(){
                                // 适应大小屏的滚动条
                                _this.resizeHeight = $('.fd-content-cxjc').height();
                            })
                        }

                        //输出日志
                        fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
                // 鼠标按下
                    $(document).on('mousedown',function () {
                        _this.evtDrag = false;
                        $('.fd-table-header .aty-table__header-wrapper .aty-table__header').removeClass('fd-scrollbar-transition');
                    });
                    $(document).on('mouseup',function () { // 鼠标抬起
                        _this.evtDrag = true;
                    });

            },
            /**
             * 刷新组织机构树
             */
            reloadZzjgs: function() {
                var _this = this;
                _this.$refs.organTreeAll.requestDataUrl="/artery/Organ/children?time="+Math.random();
                _this.$refs.organTreeAll.resetDatas();
            },
            //配置
            clickHandle: function(rows) {
                var _this = this;
                // 配置信息页面---系统角色的选中
                _this.currentItemKey = rows.roleName;
               /* _this.currentItemKey = [];
                _this.pzjsValId = [];*/
                _this.tableShow = false;
                _this.pzShow = true;
                _this.zazpz= true;
                _this.zazpzzp= true;
                _this.picShow = false;
                _this.gzzShow=true;
                _this.corpName= rows.corpName;
                _this.newUser.corpId= rows.corpId;
                _this.qxcode = rows.qxcode;
                _this.authList = [];
                _this.ip = rows.ip;
                _this.mac = rows.mac;
                if(rows) {
                    /*if(rows.roleName){
                        _this.currentItemKey= rows.roleName.split(',');
                    }*/
                    // 如果当前是中央用户的话，判断角色名称是否存在，存在的话显示工作证
                    if (_this.center === 'zyxtgly' || _this.center === 'zyjdy') {
                        // 启用配置角色
                        _this.isPzjsDisabled = false;
                        // 隐藏工作证
                        _this.isShowZzz = false;
                        // 判断角色名称是否存在
                        if (rows.userExt.JSMC) {
                            // 禁用配置角色
                            _this.isPzjsDisabled = true;
                            // 显示工作证
                            _this.isShowZzz = true;
                        }
                    } else { // 当前用户为地级用户
                        // 启用配置角色
                        _this.isPzjsDisabled = false;
                        // 隐藏工作证
                        _this.isShowZzz = false;
                        // 判断工作证有效期是否存在，存在的话显示工作证
                        if (rows.userExt.GZZYXQ) {
                            // 显示工作证
                            _this.isShowZzz = true;
                        }
                    }
                    _this.popType="pz";
                    _this.nSftb=rows.deptExt.SFTB;
                    if (rows.userExt.ZHYXQ) {
                        rows.userExt.ZHYXQ = rows.userExt.ZHYXQ.split(' ')[0];
                    }
                    _this.zzjgyhglPzList = rows;
                    _this.zzjgyhglPzList.passWord = "********";
                    _this.newUser.cId = rows.id;
                    _this.newUser.cMobilePhone = rows.userExt.SJH;
                    _this.newUser.cTelePhone = rows.userExt.ZJH;
                    _this.newUser.name = rows.name;
                    _this.newUser.loginId = rows.loginId;
                    // _this.newUser.corpId = rows.corpId;  暂时没有
                    _this.newUser.position = rows.userExt.ZW;
                    _this.newUser.passWord = "*********";
                    _this.newUser.gzzJssj = rows.userExt.GZZYXQ;  // 只给了有效期，没有给开始和结束时间
                    _this.newUser.rank = rows.userExt.ZJ;
                    _this.newUser.gzzKssj = rows.userExt.GZZKSSJ;
                    _this.newUser.deptId = rows.deptId;
                    _this.deptName= rows.deptName;
                    _this.query.endDate = rows.userExt.ZHYXQ;
                    _this.query.startDate = rows.userExt.ZHKSSJ;
                    _this.position = rows.userExt.ZW;
                    _this.rank = rows.userExt.ZJ;
                    // _this.getZzjgGzz = _config.url.frame.getZzjgGzz;
                    _this.getZzjgTx = _config.url.frame.getZzjgTx;
                    _this.getZzjgGzzZy = _config.url.frame.getZzjgGzzZy;
                    _this.getZzjgGzzZy = _this.getZzjgGzzZy + '/' + rows.id + "?"+Math.random();
                    _this.getZzjgTx = _this.getZzjgTx + '/' + rows.id + "?"+Math.random();
                    $(".fd-pz-right .fd-yhzp").css({"position":"absolute","top":"100px"})
                    _this.getPzxx(_this.type);
                } else {
                    _this.popType='xj';
                    _this.getPzxx('xj');
                }
            },
            //获取配置信息
            getPzxx:function(type){
                var _this = this;
                $.ajax({
                    method:config.methodGet,
                    url: _this.getZzjgPzjs,
                    dataType:'json',
                    success: function (data) {
                        if(data.code === "200"){
                            if(type ==='xj'){
                                _this.pzjsList = data.data;
                                _this.getQueryTypeList();
                                // 新建用户的时候角色id为空
                                _this.pzjsValId = '';
                               /* _this.pzjsValId = [];*/
                            }else{
                                _this.pzjsList = data.data;
                                _this.getQueryTypeList();
                                /*var roleNames = _this.zzjgyhglPzList.roleName.split(',')*/
                                for(var i = 0;i<_this.pzjsList.length;i++){
                                    if(_this.pzjsList[i].name == _this.zzjgyhglPzList.roleName){
                                        _this.pzjsValId = _this.pzjsList[i].code;
                                    }
                                    /*if(roleNames.includes(_this.pzjsList[i].name)){
                                        _this.pzjsValId.push(_this.pzjsList[i].code);
                                    }*/
                                }
                            }
                            // _this.getQxxx(_this.pzjsValId.join(','));
                        }
                    },
                    error: function (data,textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },

           /* //获取权限信息
            getQxxx:function(roleId){
            	 var _this = this;
                 $.ajax({
                     method:config.methodGet,
                     url: _this.getZzjgPzqx,
                     data: {
                         roleId: roleId
                     },
                     dataType:'json',
                     success: function (data) {
                         if(data.code === "200"){
                            _this.authList = data.data;
                            // 如果原先配置过权限的话，设置权限的选中
                            if (_this.qxcode.length) {
                                _this.authList.forEach(function(item) {
                                    if (_this.qxcode.indexOf(item.code) > -1) {
                                        item.active = true;
                                    }
                                })
                            }
                       }
                     },
                     error: function (data,textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                 });
            },*/
            //配置角色
            getQueryTypeList:function() {
                var  _dataList=[];
                for(var i = 0;i<this.pzjsList.length;i++){
                    if(this.jglx==1){
                        if(this.pzjsList[i].name == '审核监督员'){
                            continue;
                        }
                        _dataList.push({
                            codeType:'10100003',
                            code:this.pzjsList[i].code,
                            name:this.pzjsList[i].name
                        });
                    }else if(this.jglx==2) {
                        if(this.pzjsList[i].name == '审核员'||this.pzjsList[i].name == '监督员'){
                            continue;
                        }
                        _dataList.push({
                            codeType:'10100003',
                            code:this.pzjsList[i].code,
                            name:this.pzjsList[i].name
                        });
                    }

                }
                this.pzjsList = _dataList;
            },
            //上传照片
            handleUpload: function (f) {
                var _this = this;
                if(((f.size)/1048576)>2){
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '上传的照片不能大于2M'
                        },
                        interval: 900
                    });
                    return false
                };
                if(/\.[^\.]+/.exec(f.name)!= ".JPG"&&/\.[^\.]+/.exec(f.name) != ".jpg"){
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '上传得照片只能为JPG格式'
                        },
                        interval: 900
                    });
                    return false
                }
                _this.file = f;
                _this.picShow = true;
                _this.zazpzzp= false;
                _this.zazpz= true;

                $(".fd-imageStyle img").css('height','100px')
                var reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onload = function (e) {
                    //把得到的base64赋值到img标签显示
                    _this.base64Code = this.result;
                    _this.getZzjgTx = this.result;
                    _this.visiable = true;
                    $(".fd-gzzgl-img").css('visibility','hidden');
                }
                return false;
            },
            submit: function (e) {
                var _this = this;
                var sftg = _this.checkPhone(_this.newUser.cMobilePhone);
                if(!sftg){
                    return;
                }
                var currentEle = e.currentTarget;
                currentEle.disabled = true;
                _this.newUser.startDate = _this.query.startDate;
                _this.newUser.endDate = _this.query.endDate;
                _this.newUser.cRoleId = _this.pzjsValId;
                /*_this.newUser.cRoleId = _this.pzjsValId.join(',');*/
                _this.newUser.rank = _this.rank;
                _this.newUser.position = _this.position;
                _this.newUser.corpId = _this.parentId;
                _this.newUser.deptId = _this.cDwId;
                _this.newUser.roleId = _this.pzjsValId;
                /*_this.newUser.roleId = _this.pzjsValId.join(',');*/
                var codeList = [];
                /*// 得到用户选中的权限
                _this.authList.forEach(function(item) {
                    if (item.active) {
                        codeList.push(item.code);
                    }
                });*/
                _this.newUser.code = codeList.length === 0 ? '' : codeList.join(',');
                _this._serverData=_this.newUser;
                if(_this.query.startDate&&_this.query.endDate&&(_this.popType=='pz'?true:_this.getZzjgTx!='#')
                        &&_this.newUser.name&&_this.newUser.loginId&&_this.deptName
                        &&_this.position&&_this.rank&&_this.newUser.cMobilePhone&&_this.newUser.cTelePhone){
                    timestamp1 = Date.parse(new Date(_this.query.startDate));
                    timestamp2 = Date.parse(new Date(_this.query.endDate));
                    if(timestamp2<timestamp1){
                        $.alert({
                            type:'fail',
                            info :{
                                fail:'有效期结束时间应大于开始时间'
                            },
                            interval:1800
                        });
                        currentEle.disabled = false;
                        return false;
                    }
                    this.$refs.form.getData(function (data) {
                        data.logo = _this.base64Code;
                        data.params =JSON.stringify(_this._serverData) ;
                    })
                    // 给首页发消息，控制打开转圈的loading图
                    var dataBj = {
                        flag: 'openLoading',
                        data: true
                    };
                    var _data =JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data,'*');
                    this.$refs.form.submit(_this.getNewUser).then(function (result) {
                        if (result.code === '200') {
                            // 给首页发消息，控制打开转圈的loading图
                            var dataBj = {
                                flag: 'openLoading',
                                data: false
                            };
                            var _data =JSON.stringify(dataBj);
                            window.parent.parent.postMessage(_data,'*');
                            _this.file = null;
                            _this.image = "#";
                            _this.user = {};
                            _this.base64Code = "";
                            $.alert({
                                type:'success',
                                info :{
                                    success:'保存成功'
                                },
                                interval:1800
                            });
                            _this.newUser = {//新建用户传参
                                cId: "",
                                cMobilePhone: "",
                                cTelePhone: "",
                                cRoleId: "",
                                name: "",
                                loginId: "",
                                corpId: "",
                                deptId: "",
                                position: "",
                                endDate: "",
                                rank: "",
                                startDate: "",
                                passWord:'*********',
                                gzzKssj:'',// 工作证开始时间
                                gzzJssj:''// 工作证结束时间
                            };
                            if(_this.nSftb!=2){
                                _this.newUser.deptId = _this.cDwId;
                            }
                            _this.nSftb='';
                            _this.position = "";
                            _this.rank = "";
                            _this.cRoleId  =  "";
                            _this.cropName  =  "";
                            _this.zzjgyhglPzList.cRoleId = '';
                            /*$(".spdxx").css("padding-top",'82px');*/
                            _this.zazpz= false;
                            _this.zazpzzp= false;
                            _this.query = {
                                endDate: null,
                                startDate: null
                            };
                            _this.tableShow = true;
                            _this.pzShow = false;
                            _this.getZzjgTx = _config.url.frame.getZzjgTx;
                            _this.getZzjgGzz = _config.url.frame.getZzjgGzz;
                            _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
                        }else {
                            // 给首页发消息，控制打开转圈的loading图
                            var dataBj = {
                                flag: 'openLoading',
                                data: false
                            };
                            var _data =JSON.stringify(dataBj);
                            window.parent.parent.postMessage(_data,'*');
                            $.alert({
                                type:'fail',
                                info :{
                                    fail:result.message
                                },
                                interval:1800
                            });
                        }
                        currentEle.disabled = false;
                    }).catch(function (error) {
                        if (error.status == 401) {
                            window.location.href = '/templates/login.pages'
                        }
                        currentEle.disabled = false;
                    });
                }else {
                    $.alert({
                        type:'fail',
                        info :{
                            fail:'请填写完整信息'
                        },
                        interval:1800
                    });
                    currentEle.disabled = false;
                }

            },
            //判断是否是专案组
            pdzaz:function() {
                var _this = this;
                $.ajax({
                    method:config.methodGet,
                    url: _this.getPdzaz+'/'+_this.cDwId,
                    dataType:'json',
                    success: function (data) {
                        if(data.data){
                            _this.zazShow = true;

                        }else {
                            _this.zazShow = false;
                        }
                        _this.hqzazxq();
                    },
                    error: function (data,textStatus, errorThrown) {
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            //新建专案组
            clickXjzaz:function(code) {
                var _this = this;
                var data={
                    flag:"xjzaz",
                    title:'',
                    parentId:_this.parentId,
                    cDwId:_this.cDwId,
                    dataList:{}
                };
                switch (code) {
                    case 'xjzaz':
                        data.title = "xjzaz";
                        break;
                    case 'bjzaz':
                        data.title = "bjzaz";
                        data.dataList = _this.dataList;
                        break;
                    case 'sczaz':
                        data.title = "sczaz";
                        data.cDwId = _this.cDwId;
                        break;
                    case 'ckzaz':
                        data.title = "ckzaz";
                        data.dataList = _this.dataList;
                        break;
                }
                var _data=JSON.stringify(data)
                window.parent.parent.postMessage(_data,'*')
            },
            //新建用户
            clickNew:function() {
                var _this = this;
                // 设置默认用户照片
                _this.getZzjgTx = './images/icon-gzz-default.png';
                _this.goback();
                _this.popType='xj';
                _this.tableShow = false;
                _this.pzShow = true;
                _this.zazpzzp = false;
                _this.picShow = false;
                _this.gzzShow=false;
                // 启用角色配置
                _this.isPzjsDisabled = false;
                // 不显示工作证，显示默认图片
                _this.isShowZzz = false;
                _this.currentItemKey = '';
               /* _this.currentItemKey = [];*/
                _this.getPzxx('xj');
            },
            //获取专案组详情
            hqzazxq:function(){
                var _this = this;
                $.ajax({
                    method:config.methodGet,
                    url: _this.getXjzaz+"/"+_this.cDwId,
                    dataType:'json',
                    success: function (data) {
                        if(data) {
                            _this.dataList = data;
                            _this.zzjgyhglPzList = data;
                            _this.nSftb = data.ext.SFTB;
                            // 适应大小屏的滚动条
                            _this.resizeHeight = $('.fd-content-cxjc').height();
                        }
                    },
                    error: function (data,textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            //返回
            goback:function() {
                var _this = this;
                /*$(".spdxx").css("padding-top",'82px');*/
                _this.tableShow = true;
                _this.pzShow = false;
                _this.newUser = {//新建用户传参
                    cId: "",
                    cMobilePhone: "",
                    cTelePhone: "",
                    cRoleId: "",
                    name: "",
                    loginId: "",
                    corpId: "",
                    deptId: "",
                    position: "",
                    endDate: "",
                    rank: "",
                    startDate: "",
                    passWord:'*********',
                    gzzKssj:'',// 工作证开始时间
                    gzzJssj:''// 工作证结束时间
                };
                _this.position= "";
                _this.rank= "";
                _this.query.startDate='';
                _this.query.endDate='';
                _this.nSftb='';
                _this.newUser.deptId = _this.cDwId;
                /*_this.currentItemKey = [];
                _this.pzjsValId = [];*/
                // _this.corpName = '';
            },
            //导出组织机构
            exportAgency:function(){
                var _this = this;
                var f = $('<form method="get" action="' + _this.exportZzjg + '" ></form>');
                $(document.body).append(f);
                f.submit();
                f.remove();
            },
            //保存
            clickPzbc:function(){
                var _this = this;
                var codeList = []
                _this.authList.forEach(function(item) {
                    if (item.active) {
                        codeList.push(item.code);
                    }
                });
                var _serverData = {
                    userId: _this.zzjgyhglPzList.id,
                    roleId: _this.pzjsValId,
                   /* roleId: _this.pzjsValId.join(','),*/
                    code: codeList.length === 0 ? '' : codeList.join(',')
                }
                $.ajax({
                    method:config.methodPost,
                    url: _this.getZzjgPzbc,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        if(data.code === '200') {
                            /*$(".spdxx").css("padding-top",'82px');*/
                            _this.tableShow = true;
                            _this.pzShow = false;
                            _this.zzjgyhglDataList = [{}];
                          /*  _this.currentItemKey = [];
                            _this.pzjsValId = [];*/
                            $.alert({
                                type:'success',
                                info :{
                                    success:'保存成功'
                                },
                                interval:1800
                            });

                            _this.getZzjgTx=_config.url.frame.getZzjgTx;
                            //配置角色
                            _this.getZzjgPzjs=_config.url.frame.getZzjgPzjs;
                            _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
                            _this.pdzaz();
                        }else {
                            $.alert({
                                type:'fail',
                                info :{
                                    fail:data.message
                                },
                                interval:1800
                            });
                        }
                        //输出日志
//                                fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
                        $.alert({
                            type:'fail',
                            info :{
                                fail:'保存失败'
                            },
                            interval:1800
                        });
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            /**
             *  * @Author wlq
             *    @Date 2020/03/19
             *    @description 保存ip和mac
             */
            clickMacAndIp: function(){
                var _this = this;
                //校验ip和mac
                var reIp = /^((((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))[,])*((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
                var reMac = /^((([0-9a-fA-F]{2}[:|-]){5}([0-9a-fA-F]{2}[,]))*([0-9a-fA-F]{2}[:|-]){5}([0-9a-fA-F]{2}))$/;
                var resultIp = false;
                var resultMac = false;
                if(_this.mac!=''){
                    resultMac = reMac.test(_this.mac);
                } else {
                    resultMac = true;
                }
                if(_this.ip!=''){
                    resultIp = reIp.test(_this.ip);
                } else {
                    resultIp = true;
                }
                if (!resultIp && _this.ip) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '更新Ip失败，请输入规范Ip地址'
                        },
                        interval: 1800
                    });
                    currentEle.disabled = false;
                    return false;
                }
                if (!resultMac && _this.mac) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '更新Mac失败，请输入规范Mac地址'
                        },
                        interval: 1800
                    });
                    currentEle.disabled = false;
                    return false;
                }
                var _serverData = {
                    userId: _this.newUser.cId,
                    ip: _this.ip,
                    mac: _this.mac
                };
                $.ajax({
                    method:config.methodPost,
                    url: _this.ipOrMacUrl,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        $.alert({
                            type:'success',
                            info :{
                                success:'清除成功'
                            },
                            interval:1800
                        });
                        _this.mac = ''
                        _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize)
                    },
                    error: function (data,textStatus, errorThrown) {
                        $.alert({
                            type:'faile',
                            info :{
                                faile:'清除失败'
                            },
                            interval:1800
                        });
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            clickPzbcNew:function (){
                var _this = this;
                _this.clickMacAndIp();
                _this.clickPzbc();
            },
            //删除专案组用户
            clickRemove:function(code) {
                var _this = this;
                // 给首页发消息，控制打开转圈的loading图
                var dataBj = {
                    flag: 'openLoading',
                    data: true
                };
                var _data =JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data,'*');
                $.ajax({
                    method:config.methodPost,
                    url: _this.getPdzaz + "/" + code + "/negative",
                    contentType:'application/json',
                    success: function (data) {
                        if(data.code === "200"){
                            var dataBj = {
                                flag: 'openLoading',
                                data: false
                            };
                            var _data =JSON.stringify(dataBj);
                            window.parent.parent.postMessage(_data,'*');
                            $.alert({
                                type:'success',
                                info :{
                                    success:"删除成功"
                                },
                                interval:1800
                            });
                            // 删除过后跳转到第一页 -----2021-03-25  已和测试确认
                            // if(_this.zzjgyhglDataList.length==1&&_this.optionZzjghgl.currentPage!=1){
                            //     _this.optionZzjghgl.currentPage=_this.optionZzjghgl.currentPage-1
                            // }
                            _this.optionZzjghgl.currentPage = 1;
                            _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
                        }

                        //输出日志
                        fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
                        var dataBj = {
                            flag: 'openLoading',
                            data: false
                        };
                        var _data =JSON.stringify(dataBj);
                        window.parent.parent.postMessage(_data,'*');
                        //  报错信息
                        $.alert({
                            type:'fail',
                            info :{
                                fail:"删除失败"
                            },
                            interval:1800
                        });
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            //子组件传过来日期改变的值
            changeDate: function (obj,name,index) {
                var sign=true;
                if (name == "startDate") {
                    sign  = fdGlobal.dateCompare(obj,this.query.endDate);
                }else{
                    sign = fdGlobal.dateCompare(this.query.startDate,obj);
                }
                if(sign){
                    this.query[name] = obj;
                }else{
                    this.query[name] = '';
                    $('#jsAppControllerzzyhgl').find('.fd-queryType-wraper').find('.fd-input-wrap.'+name).find('.fd-date-input').val('')
                }
            },
            //下拉改变
            changeDropN: function (value,name,index) {
                var _this=this;
                _this[name] = value.name;
                for(var i = 0;i<_this.pzjsList.length;i++){
                    if(_this.pzjsList[i].cName == value.name){
                        _this.cRoleId = _this.pzjsList[i].code;
                    }
                }
            },
            //状态
            changeDropN01: function (value,name,index) {
                var _this=this;
                _this[name] = value.code;
            },
            checkPhone:function (value,name,index) {
                var _this=this;
                if(!fdGlobal.checkPhone(value)){
                    $.alert({
                        type:'fail',
                        info :{
                            fail:'请输入正确格式的手机号码'
                        },
                        interval:1800
                    });
                    return false;
                }
                return true;
            },
            // 选中页面某条数据
            select: function (row) {
                var _this = this;
                _this.rowData = row;
            },
            //  全选页面数据
            selectAll: function (selection) {
                var _this = this;
                if (selection.length === 0) {
                    return;
                }
                _this.rowData = selection;
            },
            exportByFilxter: function (isAll){
                var _this = this;
                var serverData = {};
                var cIds = '';
                if(isAll == 'all'){
                    cIds = '';
                }else {
                    if(_this.rowData.length>0){
                        for(var i=0;i<_this.rowData.length;i++){
                            if(i==_this.rowData.length-1){
                                cIds += _this.rowData[i].id;
                            }else {
                                cIds += _this.rowData[i].id +",";
                            }
                        }
                    }else {
                        //  报错信息
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: "请选择要导出的人员！"
                            },
                            interval: 1800
                        });
                        return ;
                    }
                }
                var id = 'downloadframe';
                var frame = document.getElementById(id);
                if (!frame) {
                    frame = document.createElement('iframe');
                    frame.id = id;
                    frame.width = '0px';
                    frame.height = '0px';
                    // frame.display = 'none';
                    frame.hidden = true
                    document.body.appendChild(frame);
                }
                frame.src = _this.exportOrganByFilter + '?cIds=' + cIds+ '&deptId=' +_this.cDwId +'&userName='+_this.userName+ '&zt='+ _this.statues+'&organType='+ _this.type + '&jsName=' + _this.jsName;
                setTimeout(function(){
                    document.body.removeChild(frame)
                }, 60*1000);
            },
            //获取当前登录人id
            requestUser: function () {
                var _this = this;
                $.ajax({
                    method: _config.methodGet,
                    url: _this.getUserId,
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "200") {
                            _this.currentUserCorp = data.data.corpMc;
                            console.log(_this.currentUserCorp)
                        };
                        //输出日志
                        fdGlobal.consoleLogResponse(config.showLog, _this.name + '框架页请求数据成功', data)
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            openDwxx: function (){
                this.$refs.dwxxModal.open();
            },
            closeModal: function (){
                this.jglx = this.dwObject.jglx;
                this.$refs.dwxxModal.close();
            },
            confirmModal: function (){
                var _this = this;
                if(_this.jglx==''){
                    _this.$refs.dwxxModal.close();
                }else if(_this.jglx == _this.dwObject.jglx){
                    _this.$refs.dwxxModal.close();
                }else {
                    if(_this.jglx==1){
                        _this.confirmMessage = '修改为四员后审核监督员角色会失效，是否确认修改？'
                    }else {
                        _this.confirmMessage = '修改为三员后审核员、监督员角色会失效，是否确认修改？'
                    }
                    _this.$refs.confirmModal.open();
                }
            },
            confirmChange: function (){
                this.saveCorpConfig()
                this.$refs.dwxxModal.close();
            },
            selectType: function (val) {
                this.jglx = val;
            },
            // 请求得到单位组织机构的名称
            getDwxx: function() {
                var _this = this;
                $.ajax({
                    method:config.methodGet,
                    url: _this.getCorpByTreeId,
                    data: {
                        treeId: _this.cDwId
                    },
                    dataType:'json',
                    success: function (data) {
                        if(data.code === '200'){
                            // 单位机构名称
                            _this.dwObject = data.data;
                            _this.canEdit =_this.dwObject.canEdit;
                            _this.jglx = _this.dwObject.jglx;
                            console.log(_this.dwObject)
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
            saveCorpConfig: function () {
                var _this = this;
                let _serverData = {
                    cId: _this.dwObject.configId,
                    corpId: _this.cDwId,
                    jgbm: _this.dwObject.ext.JGBM.replaceAll(' ',''),
                    jglx: _this.jglx
                }
                $.ajax({
                    method: config.methodPost,
                    url: _this.editCorpConfig,
                    data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code === '200') {
                            $.alert({
                                type: 'success',
                                info: {
                                    success: '保存成功'
                                },
                                interval: 1800

                            });
                            _this.$refs.confirmModal.close();
                        } else {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: data.message
                                },
                                interval: 1800
                            });
                        }
                    }
                });
            },

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
            //状态
            getStatusList:function() {
                var  _dataList=[];
                $.each( fdDataTable.table1019, function (key, value) {
                    _dataList.push({
                        codeType:'10100003',
                        code:key.replace('table',''),
                        name:value
                    });
                });
                return  _dataList;
            }

        },
        // 更新数据后调用该函数
        updated: function () {

        },
        //  dom插入后调用该函数
        mounted: function () {
            var _this = this;
            _this.$nextTick(function(){
                // 鼠标按下
                $('.aty-scroll-track-h').on('mousedown',function () {
                    _this.evtDrag = false;
                    $('.fd-table-header .aty-table__header-wrapper .aty-table__header').removeClass('fd-scrollbar-transition');
                });
                $('.fd-content-cxjc').on('mouseup',function () { // 鼠标抬起
                    _this.evtDrag = true;
                });
                    // 树的外框的高度
                    // var treeBoxHeight = $('.fd-aty-scroll-tree').height();
                    // // 树的实际的高度
                    // var treeUlHeight = $('.fd-aty-scroll-tree .aty-scroll-area').height();
                    // // 相差的高度(需要滚动的高度)
                    // var _height = treeUlHeight - treeBoxHeight;
                    // 绑定组织机构树的查询输入框的事件
                    $('.fd-aty-scroll-tree .aty-tree-search .aty-input').on('blur', function() {
                        setTimeout(function(){
                            // console.log($('.isFocus').parent())
                            // 选中的元素的距离顶部的位置
                            var selectedTreeTop = $('.isFocus').parent()[0].offsetTop;
                            // 滚动的距离
                            _this.$refs.jsTreeScroll.updateTop(selectedTreeTop);
                        }, 300)
                    })
                    // 绑定组织机构树点击选择搜索下拉框的内容
                    $('.fd-aty-scroll-tree .fd-aty-tree .aty-select-dropdown-list .aty-select-item').on('click', function() {
                        setTimeout(function(){
                            // console.log($('.isFocus').parent())
                            // 选中的元素的距离顶部的位置
                            var selectedTreeTop = $('.isFocus').parent()[0].offsetTop;
                            // 滚动的距离
                            _this.$refs.jsTreeScroll.updateTop(selectedTreeTop);
                        }, 300)
                    })
            })
            // 适应大小屏的滚动条
            this.resizeHeight = $('.fd-content-cxjc').height();
            window.addEventListener('resize',function(){
                // 适应大小屏的滚动条
                console.log('resize')
                _this.$nextTick(function(){
                    _this.resizeHeight = $('.fd-content-cxjc').height();
                })
            })
        },
        //  vm创建后调用该函数
        created: function () {
            //获取信息
            var _this = this;
            window.vm = _this;
            _this.requestUser();
            _this.refreshList();
            _this.optionZzjghgl.currentSize = getLimit();
           /* _this.GetRequest();*/
            _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
            // 获取当前的登录角色
            _this.center = Artery.parseUrl().role;
            //  绑定全局的下拉事件
            fdGlobal.bindDropMenuEvent();
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


})
