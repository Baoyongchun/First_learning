
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
                //头像地址
                getZzjgTx:_config.url.frame.getZzjgTx,
                //配置角色
                getZzjgPzjs:_config.url.frame.getZzjgPzjs,
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
                // 请求当前部门的单位名称
                getCorpName: config.url.frame.getZzjgCorpName,
                //根据单位id获取单位信息
                getCorpByTreeId: config.url.frame.getCorpByTreeId,
                //同时更新单位和用户角色
                updateRoleBatch: config.url.frame.updateRoleBatch,
                //是否显示工作证？新建不能显示
                gzzShow:false,
                //查询时间
                query:{
                    endDate: null,
                    startDate: null
                },
                tableShow:false,//显示列表
                pzShow:false,//配置信息显示
                //查询类型
                queryType:0,
                oldQueryType:0,
                //分页查询时间
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
                jsList:[],
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
                ztList: [
                    //用户删除、或置为无效后不在页面显示，所以无效选项已不再需要--程彦涛
                    /* {
                     code: '0',
                     name: '无效'
                 }, */{
                        code: '1',
                        name: '有效'
                    }, {
                        code: '3',
                        name: '锁定'
                    }],
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
                canSave: false,
                dwObject:{
                    id:'',
                    name: '',
                    ext:{
                        JGBM:''
                    }
                },
                corpId:'',
                confirmMessage:'',//弹窗信息
                confirmType:'',//弹窗选择
                jueSeSelected:'',//选中的角色名
                jueSeSelectedCode:'',//选中的角色code
                corpConfig: null, //需要配置的单位角色
                isSelected: false
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
                 *  @Author wlq
                 * @description 查询条件重置
                 * @name searchReset
                 * @return {*} 无
                 */
                searchReset:function(){
                    // 如果查询条件有值，怎清空后重新请求数据
                    if(this.userName || this.zt) {
                        // 用户姓名
                        this.userName = '';
                        // 状态
                        this.zt = '';
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
                    // 是否可以新建专案组
                    if(newValue.type === 'corp') {
                        this.xjzaz = true;
                        this.zazShow = false;
                    } else if(newValue.type === 'dept')  {
                        this.xjzaz = false;
                    }
                    this.getDwxx();
                    this.tableShow = true;
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
                            // currentSize:currentSize,
                            id:_this.cDwId,//单位编号
                            type:_this.type,//单位还是部门
                            gjc:_this.userName,// 关键词
                            nZt:_this.zt,// 关键词
                            lx: 'js'
                        };
                    }else {//点击分页发的请求数据
                        _serverData={
                            currentPage:currentPage,
                            // currentSize:currentSize,
                            id:_this.cDwId,//单位编号
                            type:_this.type,//单位还是部门
                            gjc:_this.userName,// 关键词
                            nZt:_this.zt,// 关键词
                            lx: 'js'
                        };
                    }
                    $.ajax({
                        method:config.methodGet,
                        url: _this.getZzjgList,
                        data: _serverData,
                        dataType:'json',
                        success: function (data) {
                            if(data.code === '200'){
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
                                    //角色复选框
                                    _this.zzjgyhglDataList[i].jueSeSelected = _this.zzjgyhglDataList[i].roleName === _this.jueSeSelected
                                }
                                _this.optionZzjghgl.totalPage=data.data.pageOut.totalPage;
                                _this.optionZzjghgl.totalSize=data.data.pageOut.totalSize;
                                _this.optionZzjghgl.currentPage=data.data.pageOut.totalPage;
                                _this.optionZzjghgl.currentSize=data.data.pageOut.totalSize;
                                if(_this.zzjgyhglDataList.length) {
                                    _this.zwsjShow = true;
                                }else {
                                    _this.zwsjShow = false;
                                }
                                //根据选中角色排序
                                _this.zzjgyhglDataList.sort((a, b) => Boolean(b.jueSeSelected) - Boolean(a.jueSeSelected))
                                _this.$nextTick(function(){
                                    // 适应大小屏的滚动条
                                    _this.resizeHeight = $('.fd-content-cxjc').height();
                                    //自动勾选复选框
                                    _this.zzjgyhglDataList.forEach(item => {
                                        _this.$refs.multipleTable.toggleRowSelection(item, item.jueSeSelected);
                                    })
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
                    _this.$refs.organTreeAll.requestDataUrl="/artery/organ/children?"+Math.random();
                    _this.$refs.organTreeAll.resetDatas();
                },
                //获取配置信息
                getPzxx:function(){
                    var _this = this;
                    $.ajax({
                        method:config.methodGet,
                        async:false,  //同步
                        url: _this.getZzjgPzjs,
                        dataType:'json',
                        success: function (data) {
                            if (data.code === "200") {
                                _this.pzjsList = data.data;
                                var xtgly = data.data.filter(item => item.name == '系统管理员')[0]
                                _this.jueSeSelected = xtgly.name;
                                _this.jueSeSelectedCode = xtgly.code;
                                _this.requestZzjgyhgl(1, getLimit());
                            }
                        },
                        error: function (data,textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
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
                //获取当前登录人id
                requestUser: function () {
                    var _this = this;
                    $.ajax({
                        method: _config.methodGet,
                        url: _this.getUserId,
                        dataType: "json",
                        async:false,  //同步
                        success: function (data) {
                            if (data.code === "200") {
                                _this.user = data.data
                                _this.currentUserCorp = data.data.corpMc;
                                _this.cDwId = data.data.corpId;
                                _this.getDwxx();
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
                confirmModal: function (){
                    if(!this.jueSeSelected){
                        Artery.notice.error({
                            title: '未选择角色',
                        });
                        return
                    }
                    var _this = this;
                    _this.corpConfig = null;
                    _this.saveAllRole()
                },
                // 请求得到单位组织机构的名称
                getDwxx: function() {
                    var _this = this;
                    _this.zzjgyhglDataList = [];
                    $.ajax({
                        method:config.methodGet,
                        url: _this.getCorpByTreeId,
                        data: {
                            treeId: _this.cDwId
                        },
                        async:false,  //同步
                        dataType:'json',
                        success: function (data) {
                            if(data.code === '200'){
                                // 单位机构名称
                                _this.dwObject = data.data;
                                _this.canEdit =_this.dwObject.canEdit;
                                _this.canSave =_this.dwObject.canSave;
                                _this.jglx = _this.dwObject.jglx;
                                _this.getPzxx()
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

                //保存页面
                saveAllRole: function () {
                    const _this = this;
                    //不用更新单位角色，切换三员四员 的时候已经更新
                    let corpConfig = null;
                    //用户角色
                    let userIds = null;
                    let cleanUserIds = null;
                    if (_this.tableShow) {
                        userIds = _this.$refs.multipleTable.selection.map(user => user.id)
                        cleanUserIds = _this.zzjgyhglDataList.filter(item => item.jueSeSelected && $.inArray(item.id, userIds) === -1).map(user => user.id)
                        if (userIds.length > 0 && _this.jueSeSelectedCode == '') {
                            Artery.notice.error({
                                title: '未选择角色',
                            });
                            return
                        }
                    }
                    /*if (corpConfig == null && userIds == null) {
                        Artery.notice.warning({
                            title: '提示',
                            desc: "未选择数据"
                        });
                        return;
                    }*/
                    let _serverData = {
                        corpConfig: corpConfig,
                        userIds: userIds,
                        cleanUserIds: cleanUserIds,
                        roleId: _this.jueSeSelectedCode,
                        code: '',
                    }
                    $.ajax({
                        method: config.methodPost,
                        url: _this.updateRoleBatch,
                        data: JSON.stringify(_serverData),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === '200') {
                                $.alert({
                                    type: 'success',
                                    info: {
                                        success: '保存成功'
                                    },
                                    interval: 1800
                                });
                                _this.requestZzjgyhgl(1, getLimit())
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
                },
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
                _this.type = 'corp'
                _this.requestUser();
                _this.refreshList();
                _this.optionZzjghgl.currentSize = getLimit();
                /* _this.GetRequest();*/
                // _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
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
