//新建专案组
define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config, fdComponent2, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    getSczaz: _config.url.frame.getSczaz,//删除
                    getXjzaz: _config.url.frame.getXjzaz,//新建编辑
                    getXjZazCode: _config.url.frame.getXjZazCode,//获取新建专案组编码
                    titleCode: '',//弹窗 标题
                    dataList: {},//数据
                    sczazShow: true,//新建专案组
                    cCode: "",//专案组编码
                    cCorp: "",//父级id
                    cName: "",//专案组名称
                    nValid: 1,//是否有效
                    nOrder: '',//顺序
                    cdwId: '',
                    bjzazShow: false
                }
            },
            methods: {
                // 新建专案组弹窗
                xjzazPop: function(data) {
                    var _this = this;
                    _this.sczazShow = true;
                    _this.bjzazShow = false;
                    switch (data.title) {
                        case 'xjzaz':
                            _this.titleCode = "新建专案组";
                            _this.cCorp = data.cDwId;
                            _this.nOrder = '';
                            _this.cId = '';
                            _this.requestZazCode();
                            break;
                        case 'bjzaz':
                            _this.titleCode = "编辑专案组";
                            _this.dataList = data.dataList;
                            _this.cCode = data.dataList.ext.BMBM;
                            _this.cName = data.dataList.name;
                            _this.nOrder = data.dataList.order;
                            _this.nValid = data.dataList.valid;
                            _this.cId = data.dataList.id;
                            _this.cCorp = data.dataList.corpId;
                            break;
                        case 'sczaz':
                            _this.titleCode = "删除专案组";
                            _this.sczazShow = false;
                            _this.cdwId = data.cDwId;
                            break;
                        case 'ckzaz':
                            _this.titleCode = "查看部门信息";
                            _this.dataList = data.dataList;
                            _this.cCode = data.dataList.ext.BMBM;
                            _this.cName = data.dataList.name;
                            _this.nOrder = data.dataList.order;
                            _this.nValid = data.dataList.valid;
                            _this.cId = data.dataList.id;
                            _this.cCorp = data.dataList.corpId;
                            break;
                    }
                    $('#appControllerXjzaz').removeClass('fd-hide');
                    $('.fd-mask').removeClass('fd-hide');
                },
                /*提交*/
                confirmBtn: function () {
                    var _this = this;
                    var _serverData = {
                        bmbm: "",//专案组编码
                        bmlx: "",// 部门类型
                        id: "", // 部门id
                        regioncode: "",
                        xzqhbm: "", // 行政区划编码
                        sftb: "2",
                        add:'',//判断是否导出组织机构
                        dept: {//部门中的字段
                            alias:'',//部门简称
                            corpId: '',//单位（父级）id
                            ext:{},//扩展字段
                            id:'',//当前部门id
                            longUpdateTime:'',
                            name:'',//当前部门（专案组）名称
                            order:'',//显示顺序
                            pdeptId:'',//父部门id
                            showName:'',
                            type:'',//部门类型
                            updateTime:'',//当前更新时间
                            valid: 1//是否有效
                        }
                    };
                    _serverData.dept.valid = _this.nValid;
                    _serverData.dept.name = _this.cName;
                    _serverData.dept.order = _this.nOrder;
                    _serverData.bmbm = _this.cCode;
                    _serverData.dept.id = _this.cId;
                    _serverData.dept.corpId = _this.cCorp;

                    if (!(_this.nValid && _this.nOrder && _this.cName && _this.cCode)) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fali: "请填写完整"
                            },
                            interval: 1800
                        });
                        return false
                    }
                    $('.fd-loading-div').removeClass('fd-hide');
                    $.ajax({
                        method: config.methodPost,
                        url: _this.getXjzaz,
                        data: JSON.stringify(_serverData),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.code === "200") {
                                $('.fd-mask').addClass('fd-hide');
                                $('.fd-loading-div').addClass('fd-hide');
                                $('#appControllerXjzaz').addClass('fd-hide');
                                $.alert({
                                    type: 'success',
                                    info: {
                                        success: "保存成功"
                                    },
                                    interval: 1800
                                });
                                _this.nValid = 1;
                                _this.cName = '';
                                _this.nOrder = '';
                                _this.cCode = '';
                                _this.cCorp = '';
                                var flag = "xjzazRefresh";
                                window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(flag, '*');
                            } else {
                                $.alert({
                                    type: 'fail',
                                    info: {
                                        fail: data.message
                                    },
                                    interval: 1800
                                });
                                $('.fd-loading-div').addClass('fd-hide');
                            }

                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                        },
                        error: function (data, textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                },
                requestZazCode: function(){
                    var _this = this;
                    $.ajax({
                        method: config.methodGet,
                        url:_this.getXjZazCode,
                        data: 'json',
                        success: function (data) {
                            if (data.code === '200') {
                                _this.cCode = data.data;
                            }

                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                        },
                        error: function (data, textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    })
                },
                //是否有效
                selectType: function (val, item) {
                    this.nValid = val;
                },
                //删除
                clickRemove: function () {
                    var _this = this;
                    var _serverData = {
                        deptId:_this.cdwId
                    };
                    $('.fd-loading-div').removeClass('fd-hide');
                    $.ajax({
                        method: config.methodGet,
                        url: _this.getSczaz,
                        data: _serverData,
                        contentType: 'application/json',
                        success: function (data) {
                            $('#appControllerXjzaz').addClass('fd-hide')
                            $('.fd-mask').addClass('fd-hide')
                            var flag = "xjzazRemoveRefresh";
                            window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(flag, '*');
                            if (data.code === "200") {
                                $.alert({
                                    type: 'success',
                                    info: {
                                        success: "删除成功"
                                    },
                                    interval: 1800
                                });
                                $('#appControllerXjzaz').addClass('fd-hide')
                                $('.fd-mask').addClass('fd-hide')
                                var flag = "xjzazRemoveRefresh";
                                window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(flag, '*');
                            }
                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                            window.$('iframe#jsAppMainIframe')[0].contentWindow.location.reload();
                            $('.fd-loading-div').addClass('fd-hide');
                        },
                        error: function (data, textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                },
                cancel: function () {
                    var _this = this;
                    $('#appControllerXjzaz').addClass('fd-hide');
                    $('.fd-mask').addClass('fd-hide');
                    _this.nValid = 1;
                    _this.cName = '';
                    _this.nOrder = '';
                    _this.cCode = '';
                    _this.cCorp = '';
                }
            },
            created: function () {
                fdEventBus.$on('appXjzaz',this.xjzazPop);
            },
            computed: {},
            mounted: function () {}
        }
    });
