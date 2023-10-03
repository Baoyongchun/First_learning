
// 查询记录模块
define(['fdGlobal', 'config', 'fdDataTable', 'scrollbar', 'fdComponent2', "dragFun", 'userBehavior', 'jqueryUi', 'layDate'],
    function (fdGlobal, config,fdDataTable, scrollbar, fdComponent2, dragFun, userBehavior, jqueryUi, layDate) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var scrollBar1;
    var _vm = new Vue({
        // 控制器id
        el: '#jsAppControllerzzyhgl',
        // 数据
        data: {
            name: '审批表信息',
            //列表数据
            getZzjgList: _config.url.frame.getZzjgList,
            //配置信息
            getZzjgPzxx:_config.url.frame.getZzjgPzxx,
            //头像地址
            getZzjgTx:_config.url.frame.getZzjgTx,
            //配置角色
            getZzjgPzjs:_config.url.frame.getZzjgPzjs,
            //保存
            getZzjgPzbc:_config.url.frame.getZzjgPzbc,
            //工作证图片地址
            getZzjgGzz: _config.url.frame.getZzjgGzz,
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
            //是否显示工作证？新建不能显示
            gzzShow:false,
            //查询时间
            query:{
                endDate: null,
                startDate: null
            },
            tableShow:true,//显示列表
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
            type:'',//单位还是部门
            pzjsList:[],//配置角色接口数据
            jsList:[],
            pzjsVal:'',//配置角色
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
                passWord:''
            },
            jgname:'',//所属机构
            rank:'',//新建用户职级
            position:'',//新建用户职务
            zazpz:false,//专案组用户配置
            zazpzzp:false,//专案组配置用户照片
            type:'',
            queryFlag:false,
            nSftb:''

        },
        // 方法
        methods: {
            //新建完刷新页面
            refreshList:function(){
                var _this=this;
                window.addEventListener('message', function(evt){
                    if(evt.data=='xjzazRefresh'){
                        _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
                        _this.hqzazxq();
                    }
                }, false);
            },
            //获取url上cDwId和type
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
                _this.cDwId = theRequest.cDwId;
                _this.type = theRequest.type;
                _this.parentId = theRequest.parentId;
                _this.newUser.deptId = theRequest.cDwId;
                _this.newUser.corpId = theRequest.parentId;
                _this.jgname = unescape(theRequest.jgname);
                if(_this.cDwId == _this.parentId){
                    _this.xjzaz = true;
                    $('.fd-search-header').addClass('fd-search-header-xjzaz');
                    $('.fd-content').addClass('fd-content-xjzaz');
                }else {
                    _this.xjzaz = false;
                }
                _this.pdzaz();
                return theRequest;
            } ,
            //信息查询请求  requestZzjgyhgl
            requestZzjgyhgl: function(currentPage,currentSize,type){
                var _this= this;
                var _serverData;
                if(type=="cx"){//点击查询按钮发的请求数据
                    _this.oldStartDate=_this.startDate;
                    _this.oldEndDate=_this.endDate;
                    _this.oldQueryType=_this.queryType;
                    _this.oldxxJs=_this.xxJs;
                    _serverData={
                        currentPage:currentPage,
                        currentSize:currentSize,
                        name: _this.userName,
                        cdwId: _this.cDwId,
                        organType:_this.type,
                        zt:_this.statues
                    };
                }else {//点击分页发的请求数据
                    _serverData={
                        currentPage:currentPage,
                        currentSize:currentSize,
                        name: _this.userName,
                        cdwId: _this.cDwId,
                        organType:_this.type,
                        zt:""
                    };
                }
                $.ajax({
                    method:config.methodGet,
                    url: _this.getZzjgList,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        if(data.code==1){
                            _this.zzjgyhglDataList=data.data.userList;
                            _this.queryFlag=true;
                            for(var i = 0;i<_this.zzjgyhglDataList.length;i++) {
                                _this.getZzjgGzz = _config.url.frame.getZzjgGzz,
                                    _this.getZzjgTx = _config.url.frame.getZzjgTx,
                                    _this.zzjgyhglDataList[i].yhglPicAddress = '';
                                _this.zzjgyhglDataList[i].yhglPicAddress = _this.getZzjgTx + '/' + _this.zzjgyhglDataList[i].cId+"?"+Math.random();
                                _this.zzjgyhglDataList[i].yhglGzzAddress = '';
                                _this.zzjgyhglDataList[i].yhglGzzAddress = _this.getZzjgGzz + '/' + _this.zzjgyhglDataList[i].cId+"?"+Math.random();

                                /*       _this.zzjgyhglDataList[i].yhglLoadImgId = 'loadingyhglimg'+i;
                                       _this.zzjgyhglDataList[i].yhglImgId = 'yhglimg'+i;
                                       $('#'+_this.zzjgyhglDataList[i].yhglImgId).load(function(){
                                           $(this).show();
                                           var idx = this.id.substring('yhglimg'.length, this.id.length);
                                           $('#loadingyhglimg'+idx).hide();

                                       });*/
                            }
                            _this.optionZzjghgl.totalPage=data.data.page.totalPage;
                            _this.optionZzjghgl.totalSize=data.data.page.totalSize;
                            _this.optionZzjghgl.currentPage=currentPage;
                            _this.optionZzjghgl.currentSize=currentSize;

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
            //配置
            clickHandle: function(index,nSftb) {
                var _this = this;
                $(".spdxx").css("padding-top",'10px');
                _this.tableShow = false;
                _this.pzShow = true;
                _this.popType="pz";
                _this.zazpz= true;
                _this.zazpzzp= true;
                _this.picShow = false;
                _this.gzzShow=true;
                _this.nSftb=nSftb;
                _this.pzjsVal = "";
//                	_this.zazShow = false;
                _this.cUserId = _this.zzjgyhglDataList[index].cId;
                _this.getZzjgGzz = _config.url.frame.getZzjgGzz,
                    _this.getZzjgTx = _config.url.frame.getZzjgTx,
                    $.ajax({
                        method:config.methodGet,
                        url: _this.getZzjgPzxx + '/' + _this.zzjgyhglDataList[index].cId,
                        dataType:'json',
                        success: function (data) {
                            if(data.code==1){

                                if(_this.zazShow||_this.nSftb==2) {
                                    _this.getZzjgGzz = _config.url.frame.getZzjgGzz,
                                        _this.getZzjgTx = _config.url.frame.getZzjgTx,
                                        _this.newUser.cId = data.data.cId;
                                    _this.newUser.cMobilePhone = data.data.mobilePhone;
                                    _this.newUser.cTelePhone = data.data.telePhone;
                                    _this.newUser.cRoleId = data.data.cRoleId;
                                    _this.newUser.name = data.data.userName;
                                    _this.newUser.loginId = data.data.name;
                                    _this.newUser.corpId = data.data.corpId;
                                    _this.newUser.position = data.data.cZw;
                                    _this.newUser.passWord = data.data.passWord;
                                    _this.newUser.endDate = data.data.endDate;
                                    _this.newUser.rank = data.data.cZj;
                                    _this.newUser.startDate = data.data.startDate;
                                    _this.newUser.deptId = data.data.deptId;
                                    _this.jgname=data.data.cDeptName;
                                    _this.query.endDate = data.data.endDate;
                                    _this.query.startDate = data.data.startDate;
                                    _this.position = data.data.cZw;
                                    _this.rank = data.data.cZj;
                                    _this.pzjsVal = data.data.cRoleId;
                                    _this.zzjgyhglPzList.cRoleId = data.data.cRoleId;
                                    _this.zzjgyhglPzList.dGzzKssj = data.data.dGzzKssj;
                                    _this.zzjgyhglPzList.dGzzJzsj = data.data.dGzzJzsj;
                                    _this.cRoleId = data.data.cRoleId;
                                    _this.getZzjgGzz = _this.getZzjgGzz + '/' + data.data.cId+"?"+Math.random();
                                    _this.getZzjgTx = _this.getZzjgTx + '/' + data.data.cId+"?"+Math.random();
                                    $(".fd-pz-right .fd-yhzp").css({"position":"absolute","top":"100px"})
                                }else {
                                    _this.zzjgyhglPzList = data.data;
                                    _this.cRoleId = _this.zzjgyhglPzList.cRoleId;
                                    if(_this.zzjgyhglPzList.cDeptName!=null){
                                        _this.zzjgyhglPzList.cCropName += unescape(_this.zzjgyhglPzList.cDeptName)
                                    }
                                    _this.getZzjgGzz = _this.getZzjgGzz + '/' + _this.zzjgyhglPzList.cId;
                                    _this.getZzjgTx = _this.getZzjgTx + '/' + _this.zzjgyhglPzList.cId;
                                }

                                _this.getPzxx();
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
            //获取配置信息
            getPzxx:function(type){
                var _this = this;
                $.ajax({
                    method:config.methodGet,
                    url: _this.getZzjgPzjs,
                    dataType:'json',
                    success: function (data) {
                        if(data.code==1){
                            if(type=='xj'){
                                _this.pzjsList = data.data;

                            }else{
                                _this.pzjsList = data.data;
                                for(var i = 0;i<_this.pzjsList.length;i++){
                                    if(_this.pzjsList[i].cId == _this.zzjgyhglPzList.cRoleId){
                                        _this.pzjsVal = _this.pzjsList[i].cName
                                    }
                                }
                            }

                        }
                        //输出日志
//                            fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
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
                    _this.image = this.result;
                    _this.visiable = true;
                    $(".fd-gzzgl-img").css('visibility','hidden');
                }
                return false;
            },
            submit: function (e) {
                var currentEle = e.currentTarget;
                currentEle.disabled = true;
                var _this = this;
                _this.newUser.startDate = _this.query.startDate==''?_this.query.startDate:_this.query.startDate+" 00:00:00";
                _this.newUser.endDate = _this.query.endDate==''?_this.query.endDate:_this.query.endDate+" 23:59:59";
                _this.newUser.cRoleId = _this.cRoleId;
                _this.newUser.rank = _this.rank;
                _this.newUser.position = _this.position;
                _this._serverData=_this.newUser;
                if(_this.query.startDate&&_this.query.endDate&&(_this.popType=='pz'?true:_this.image!='#')&&_this.newUser.name&&_this.newUser.loginId&&_this.newUser.passWord&&_this.jgname&&_this.position&&_this.rank&&_this.newUser.cMobilePhone&&_this.newUser.cTelePhone&&_this.pzjsVal){
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
                    this.$refs.form.submit(_this.getNewUser).then(function (result) {
                        if (result.code == 1) {
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
                                passWord:''
                            };
                            if(_this.nSftb!=2){
                                _this.newUser.deptId = _this.cDwId;
                            }
                            _this.nSftb='';
                            _this.position = "";
                            _this.rank = "";
                            _this.pzjsVal = "";
                            _this.cRoleId  =  "";
                            _this.zzjgyhglPzList.cRoleId = '';
                            $(".spdxx").css("padding-top",'82px');
                            _this.zazpz= false;
                            _this.zazpzzp= false;
                            _this.query = {
                                endDate: null,
                                startDate: null
                            };
                            _this.tableShow = true;
                            _this.pzShow = false;
                            _this.getZzjgTx = _config.url.frame.getZzjgTx,
                                _this.getZzjgGzz = _config.url.frame.getZzjgGzz,
                                _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
                        }else {
                            $.alert({
                                type:'fail',
                                info :{
                                    fail:result.msg
                                },
                                interval:1800
                            });
                        }
                        currentEle.disabled = false;
                    }).catch(function (error) {
                        // 此错误有以下几种情况
                        // 1. url参数未指定，可以在submit传递或者form中指定url属性
                        // 2. 表单参数格式校验未通过
                        // 3. axios发送请求失败的error
                        /* Artery.message.error(error);*/
                        /*$.alert({
                            type:'fail',
                            info :{
                                fail:'保存失败'
                            },
                            interval:1800
                        });*/
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
                    cDwId:'',
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
                _this.popType='xj';
                _this.tableShow = false;
                _this.pzShow = true;
                _this.zazpzzp = false;
                _this.picShow = false;
                _this.gzzShow=false;
                _this.getPzxx('xj');
                $(".spdxx").css("padding-top",'10px');
            },
            //获取专案组详情
            hqzazxq:function(){
                var _this = this;
                $.ajax({
                    method:config.methodGet,
                    url: _this.getXjzaz+"/"+_this.cDwId,
                    dataType:'json',
                    success: function (data) {
                        if(data.code == 1) {
                            _this.dataList = data.data;
                        }
                    },
                    error: function (data,textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            //创建滚动条
            creatScrollBar1: function () {
                if (scrollBar1 == undefined) {
                    scrollBar1 = $('#jsScrollBarzzjgyhgl').addScrollBar({
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
            //返回
            goback:function() {
                var _this = this;
                $(".spdxx").css("padding-top",'82px');
                _this.tableShow = true;
                _this.pzShow = false;
                console.log(_this.newUser)
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
                    passWord:''
                };
                _this.position= "";
                _this.rank= "";
                _this.query.startDate='';
                _this.query.endDate='';
                _this.pzjsVal='';
                _this.nSftb='';
                _this.newUser.deptId = _this.cDwId;

            },
            //导出组织机构
            exportAgency:function(){
                var _this = this;
                var f = $('<form method="get" action="' + _this.exportZzjg + '" ></form>');
                $(document.body).append(f);
                f.submit();
                f.remove();
            },
            //通过n值获取c值
            getStrByN:function(num1,num2){
                var str=fdGlobal.getString(num1,num2);
                return str;
            },
            //解锁
            clickUnlock: function(index){
                var _this = this;
                var _serverData = {
                    cId : _this.zzjgyhglDataList[index].cId
                };
                $.ajax({
                    method:config.methodPost,
                    url: _this.getUnlock,
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
            //保存
            clickPzbc:function(){
                var _this = this;
                var _serverData = {
                    cUserId: _this.cUserId,
                    roleId: _this.cRoleId
                };
                $.ajax({
                    method:config.methodPost,
                    url: _this.getZzjgPzbc,
                    data: _serverData,
                    dataType:'json',
                    success: function (data) {
                        if(data.code == 1) {
                            $(".spdxx").css("padding-top",'82px');
                            _this.tableShow = true;
                            _this.pzShow = false;
                            _this.zzjgyhglDataList = [];
                            $.alert({
                                type:'success',
                                info :{
                                    success:'保存成功'
                                },
                                interval:1800
                            });

                            _this.getZzjgTx=_config.url.frame.getZzjgTx,
                                //配置角色
                                _this.getZzjgPzjs=_config.url.frame.getZzjgPzjs,
                                _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
                            _this.pdzaz();
                        }else {
                            $.alert({
                                type:'fail',
                                info :{
                                    fail:data.msg
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
            //删除专案组用户
            clickRemove:function(index) {
                var _this = this;
                var codId =_this.zzjgyhglDataList[index].cId;
                $.ajax({
                    method:config.methodPost,
                    url: _this.getPdzaz + "/" + codId + "/negative",
                    contentType:'application/json',
                    success: function (data) {
                        if(data.code==1){
                            $.alert({
                                type:'success',
                                info :{
                                    success:"删除成功"
                                },
                                interval:1800
                            });
                            if(_this.zzjgyhglDataList.length==1&&_this.optionZzjghgl.currentPage!=1){
                                _this.optionZzjghgl.currentPage=_this.optionZzjghgl.currentPage-1
                            }
                            _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);
                        }

                        //输出日志
                        fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
                    },
                    error: function (data,textStatus, errorThrown) {
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
                        _this.cRoleId = _this.pzjsList[i].cId
                    }
                }
            },
            //状态
            changeDropN01: function (value,name,index) {
                var _this=this;
                _this[name] = value.code;
            },
            //职级下拉改变
            changeDropZj: function (value,name,index) {
                var _this=this;
                _this[name] = value.code;
            },
            //职务下拉改变
            changeDropZw: function (value,name,index) {
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
            //配置角色
            getQueryTypeList:function() {
                var  _dataList=[];
                for(var i = 0;i<this.pzjsList.length;i++){
                    _dataList.push({
                        codeType:'10100003',
                        code:i+1,
                        cRoleId:this.pzjsList[i].cId,
                        name:this.pzjsList[i].cName
                    });
                }
                return  _dataList;
            },
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
            //职级
            getZjList:function() {
                var  _dataList=[];
                $.each( fdDataTable.table1015, function (key, value) {
                    _dataList.push({
                        codeType:'10100003',
                        code:key.replace('table',''),
                        name:value
                    });
                });
                return  _dataList;
            },
            //职务
            getZwList:function() {
                var  _dataList=[];
                $.each( fdDataTable.table1022, function (key, value) {
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
            this.$nextTick(function(){
                this.creatScrollBar1();
            })

        },
        //  dom插入后调用该函数
        mounted: function () {
            var _this = this;
            _this.$nextTick(function(){
                _this.creatScrollBar1();
            })
        },
        //  vm创建后调用该函数
        created: function () {
            //获取信息
            var _this = this;
            _this.refreshList();
            _this.GetRequest();
            _this.requestZzjgyhgl(_this.optionZzjghgl.currentPage,_this.optionZzjghgl.currentSize);

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
