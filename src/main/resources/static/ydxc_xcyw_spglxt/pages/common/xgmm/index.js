/**
 * @version:                2018.10.14
 * @createTime:             2018.10.14
 * @updateTime:             2018.10.14
 * @author:                 liuxiaolong
 * @description             监督员登录=>查询申请记录
 */
define(['fdGlobal', 'fdCxxCode', 'config', 'fdDataTable', 'scrollbar', 'fdComponent', "dragFun", 'userBehavior', 'jqueryUi', 'layDate'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     * @param fdDataTable
     * @param fdCxxCode
     * @param scrollbar
     * @param fdComponent
     * @param dragFun
     * @param userBehavior
     * @param jqueryUi
     * @param layDate
     */
    function (fdGlobal,fdCxxCode, config, fdDataTable, scrollbar, fdComponent, dragFun, userBehavior, jqueryUi, layDate) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var _vm = new Vue({
            // 控制器id
            el: '#jsAppControllerXgmm',
            data: function() {
                return {
                    showTab: 'jbzl', //展示哪个页签
                    //个人信息
                    getUserId: _config.url.frame.getUserId,
                    uploadAddress: _config.url.frame.uploadAddress,
                    userId: '', //登录人id
                    deptMc: "", //部门
                    corpMc:"",//单位名称
                    avatar: '#', //头像
                    loginId: '', //账号
                    isShowPassword: false,
                    //上传
                    gzz: {
                        cBtgyy: null,
                        endDate: '',
                        startDate: '',
                        gzzHm: null,
                        zt: null,
                        bh: ""
                    },
                    sjh:'', // 手机号
                    zjh:'', // 座机号
                    picShow: false, //是否显示工作证预览图片，有工作证号时代表有图片
                    visiable: false,
                    image: "#",
                    base64Code: '',
                    file: null,
                    visiable1: false,
                    image1: "#",
                    empcardTempFile: '',
                    user: {},
                    gzzh: '',
                    getZzjgTx: _config.url.frame.getZzjgTx, //头像src
                    dateOptions: {
                        language: 'zh-CN',
                        format: 'yyyy-mm-dd',
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        startDate: fdGlobal.endDate, //设置最小日期
                        endDate: '', //设置最大日期
                        todayHighlight: 1,
                        startView: 2,
                        minView: 2, //Number, String. 默认值：0, 'hour' 日期时间选择器所能够提供的最精确的时间选择视图。
                        forceParse: true
                    },
                    editUser: _config.url.frame.editUser,
                    //修改密码
                    oldPassWord: '',
                    newPassWord: '', //input的value
                    againNewPassWord: '',
                    //是否修改标志位
                    baseInfoFlag: false,
                    gzzFlag: false,
                    psdFlag: false,
                    //是否有工作证
                    isHaveGzz: false,
                    //登录人名称
                    userName: '',
                    // 上传工作证按钮是否显示加载中
                    uploadLoading: false,
                    options1: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() > new Date(_this.gzz.endDate).valueOf();
                            }
                        }
                    })(this),
                    options2: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() < new Date(_this.gzz.startDate).valueOf();
                            }
                        }
                    })(this),
                    // 记录当前的工作证的展示情况
                    currentGzzImgSrc: '#',
                    // 登录人身份请求地址
                    serverUrlLoginPerson: config.url.frame.loginPerson,
                    // 当前用户角色
                    userRoles: '',
                    serverUrlXgmm: _config.url.frame.serverUrlXgmm,
                    hasChangeGzzValue: false,
                    isDisabledSureBtn: false
                }
            },
            // 方法
            methods: {
                cancel: function() {
                    window.location.href = "/logout";
                },
                openXgzl:function(){
                    var _this = this;
                    _this.requestUserId();
                    _this.showTab='jbzl';
                    _this.oldPassWord = '';
                    _this.newPassWord = '';
                    _this.againNewPassWord = '';
                },
                /**
                 * @Author: nfj
                 * @name: requestCurrent
                 * @description: 请求登录人身份
                 * @return: {undefined}
                 */
                requestCurrent: function () {
                    var _this = this;
                    $.ajax({
                        method: config.methodGet,
                        url: _this.serverUrlLoginPerson,
                        dataType: 'json',
                        success: function (data) {
                            if (data.code == 200) {
                                // 当前角色
                                _this.userRoles = data.data.roles[0];
                                _this.isShowPassword = (data.data.isFirstLoginAndUpdatePasswd !== 2);
                            }
                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                        },
                        error: function (data, textStatus, errorThrown) {
                            console.log(data, textStatus, errorThrown)
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                },
                //获取当前登录人id
                requestUserId: function () {
                    var _this = this;
                    $.ajax({
                        method: _config.methodGet,
                        url: _this.getUserId,
                        dataType: "json",
                        success: function (data) {
                            if (data.code === "200") {
                                _this.userId = data.data.id;
                                _this.requestCurrent();
                                _this.deptMc = data.data.deptMc;
                                _this.corpMc = data.data.corpMc;
                                _this.sjh = data.data.sjh;
                                _this.zjh = data.data.zjh;
                                if (data.data.gzz != null) {
                                    _this.isHaveGzz = true;
                                    _this.gzz = data.data.gzz;
                                    _this.picShow = true;
                                    _this.image1 = _config.url.frame.getGrxxGzz + '/' + _this.gzz.bh + "?" + Math.random();
                                } else {
                                    _this.isHaveGzz = false;
                                    _this.image1 = './images/icon-gzz-default.png';
                                };
                                // 判断工作证状态
                                if (_this.getStrByN('1013',_this.gzz.zt)) {
                                    // 待审核、未通过、已过期跳转工作证管理的页签
                                    if (_this.gzz.zt === 1 || _this.gzz.zt === 2 || _this.gzz.zt === 4) {
                                        _this.showTab = 'gzzgl';
                                    }
                                } else {
                                    // 未上传跳转基本资料的页签
                                    _this.showTab = 'jbzl';
                                }

                                _this.loginId = data.data.loginId;
                                _this.userName = data.data.userName;
                                _this.avatar = _config.url.frame.getZzjgTx + '/' + data.data.id + "?" + Math.random();
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
                changeTab: function (val) {
                    this.showTab = val
                },
                //子组件传过来日期改变的值
                changeGzzDate: function (obj, name, index) {
                    var sign = true;
                    if (name == "startDate") {
                        sign = fdGlobal.dateCompare(obj, this.gzz.endDate);
                    } else {
                        this.gzz.startDate = this.gzzStartDateFommater(this.gzz.startDate);
                        sign = fdGlobal.dateCompare(this.gzz.startDate, obj);
                    }
                    if (sign) {
                        this.gzz[name] = obj;
                    } else {
                        this.gzz[name] = '';
                        $('#jsXgzl').find('.fd-keyword-wraper').find('.fd-input-wrap.' + name).find('.fd-date-input').val('')
                    }
                    this.gzzFlag = true;
                },
                gzzStartDateFommater: function(param) {
                    var date = new Date(param);
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? '0' + m : m;
                    var d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    return y + '-' + m + '-' + d;
                },
                //修改工作证号码
                changeGzzHm: function () {
                    this.gzzFlag = true;
                },
                changeBaseInfo: function() {
                    this.baseInfoFlag = true;
                },
                changePassword: function() {
                    this.psdFlag = true;
                },
                //通过n值获取c值
                getStrByN: function (num1, num2) {
                    var str = fdGlobal.getString(num1, num2);
                    return str;
                },
                //上传工作证
                handleUpload01: function (f) {
                    var _this = this;
                    if (((f.size) / 1048576) > 2) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '上传的照片不能大于2M'
                            },
                            interval: 900
                        });
                        return false
                    };
                    if (/\.[^\.]+/.exec(f.name) != ".JPG" && /\.[^\.]+/.exec(f.name) != ".jpg") {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '上传的照片只能为JPG格式'
                            },
                            interval: 900
                        });
                        return false
                    }
                    _this.visiable1 = true;
                    _this.gzzFlag = true;
                    // 上传照片和提交按钮置无效
                    _this.uploadLoading = true;
                    $('#empcardUpload .aty-upload-list').hide();
                    $('#empcardUpload :file').attr('disabled', 'disabled');
                    $('#personInfoSubmit').attr({
                        'disabled': 'disabled',
                        'class': 'fd-btn fd-btn-cancel'
                    });
                    return true;
                },
                uploadGzxxSuccess: function (response, file, fileList) {
                    var _this = this;
                    _this.$refs.empcardUpload.clearFiles();
                    // 恢复上传照片和提交按钮
                    _this.uploadLoading = false;
                    $('#empcardUpload :file').attr('disabled', false);
                    $('#personInfoSubmit').attr({
                        'disabled': false,
                        'class': 'fd-btn fd-btn-confirm'
                    });
                    _this.isHaveGzz = true;
                    if (fdGlobal.checkString(response.data)) {
                        _this.empcardTempFile = response.data;
                        // _this.currentGzzImgSrc = _config.url.frame.empcardFromTemp + '/' + response.data + "?" + Math.random();
                        _this.image1 = _config.url.frame.empcardFromTemp + '/' + response.data + "?" + Math.random();
                    }
                    _this.gzzFlag = true;
                },
                submitGrxx: function (e) {
                    var _this = this;
                    var currentEle = e.currentTarget;
                    if(!_this.baseInfoFlag && !_this.gzzFlag && !_this.psdFlag && !_this.isShowPassword) {
                        _this.cancel();
                        return false;
                    }
                    if(!_this.validateBaseInfo()) {
                        return false;
                    }
                    // 如果是查询员，验证工作证
                    if(this.userRoles === 'cxy') {
                        if(!_this.validateGzz(currentEle)) {
                            return false;
                        }
                    }

                    if(!_this.validatePassword(currentEle)) {
                        return false;
                    }

                    var gzzParam = {};
                    if(_this.gzzFlag) {
                        _this.gzz.startDate = _this.gzzStartDateFommater(_this.gzz.startDate);
                        _this.gzz.endDate = _this.gzzStartDateFommater(_this.gzz.endDate);
                        gzzParam = {
                            gzzPhoto: _this.empcardTempFile,
                            gzzHm: _this.gzz.gzzHm,
                            startDate: _this.gzzStartDateFommater(_this.gzz.startDate),
                            endDate: _this.gzzStartDateFommater(_this.gzz.endDate) + ' 23:59:59',
                            cTjrMc: _this.userName
                        };
                    }

                    var passwordParam = {};
                    if(_this.psdFlag && _this.isShowPassword) {
                        passwordParam = {
                            oldPassWord: _this.oldPassWord,
                            newPassWord: _this.newPassWord,
                            againNewPassWord: _this.againNewPassWord
                        };
                    }

                    // 判断当前按钮的状态，如果是禁用的话，不走方法
                   /* if (_this.isDisabledSureBtn) {
                        return false;
                    }*/
                    //_this.isDisabledSureBtn = true;
                    $.ajax({
                        method: _config.methodPost,
                        url: _this.editUser,
                        data: {
                            params: JSON.stringify({
                                userId: _this.userId,
                                avatar: _this.base64Code,
                                gzz: gzzParam,
                                passWord: passwordParam,
                                sjh: _this.sjh,
                                zjh: _this.zjh,
                                userRole: _this.userRoles
                            })
                        },
                        dataType: 'json',
                        success: function (result) {
                            if (result.code === "200") {
                                $.alert({
                                    type: 'success',
                                    info: {
                                        success: '保存成功'
                                    },
                                    interval: 1800
                                });
                                //刷新头像
                                _this.avatar = _config.url.frame.getZzjgTx + '/' + _this.userId + "?" + Math.random()
                                if (_this.userRoles === 'zyxtgly' || _this.userRoles === 'zyjdy' || _this.userRoles === 'gly' || _this.userRoles === 'shy') {
                                    _this.submit();
                                } else {
                                    _this.cancel();
                                }
                            } else {
                                $.alert({
                                    type: 'fail',
                                    info: {
                                        fail: result.message
                                    },
                                    interval: 1800
                                });
                            }
                           // currentEle.disabled = false;
                        },
                        error: function (data, textStatus, errorThrown) {
                            if (textStatus == 401) {
                                window.location.href = '/templates/login.pages'
                            }
                            //currentEle.disabled = false;
                        }
                    });
                },
                validateBaseInfo: function() {
                    console.log(this.sjh);
                    // 点击确定的时候需要验证手机号
                    var checkTel = /^1([3456789])\d{9}$/;
                    // 验证手机号
                    if (!(checkTel.test(this.sjh))) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请在基本资料中填写正确的手机号'
                            },
                            interval: 900
                        });
                        return false;
                    }
                    return true;
                },
                validateGzz: function(currentEle) {
                    var _this = this;
                    if (_this.image1 === './images/icon-gzz-default.png') {
                        // 如果没有上传工作证，则提示上传工作证
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请上传工作证'
                            },
                            interval: 900
                        });
                        return false;
                    } else if (!_this.gzz.gzzHm) {
                        // 工作证号必填校验
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请输入工作证号'
                            },
                            interval: 900
                        });
                        currentEle.disabled = false;
                        return false;
                    } else if (!_this.gzz.startDate) {
                        // 有效期开始时间必填校验
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请选择有效期开始时间'
                            },
                            interval: 900
                        });
                        currentEle.disabled = false;
                        return false;
                    } else if (!_this.gzz.endDate) {
                        // 有效期结束时间必填校验
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请选择有效期结束时间'
                            },
                            interval: 900
                        });
                        currentEle.disabled = false;
                        return false;
                    }
                    return true;
                },
                validatePassword: function(currentEle) {
                    var _this = this;
                    if(!_this.isShowPassword) {
                        return true;
                    }

                    if (!_this.oldPassWord) {
                        // 原始密码必填验证
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请输入原密码'
                            },
                            interval: 900
                        });
                        return false
                    } else if (!_this.newPassWord) {
                        // 新密码必填验证
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请输入新密码'
                            },
                            interval: 900
                        });
                        return false
                    } else if (!_this.againNewPassWord) {
                        // 再次输入新密码必填验证
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请再次输入新密码'
                            },
                            interval: 900
                        });
                        return false
                    }

                    // 修改密码格式相应校验
                    var re = /^(?![a-zA-Z]+$)(?!\d+$)(?![\W_]+$)\S{10,}$/;
                    var result = re.test(_this.newPassWord) && re.test(_this.againNewPassWord);
                    if (!result) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '修改密码失败，密码长度10位以上，包含数字、字符、字母中的最少两种，不得为弱密码'
                            },
                            interval: 1800
                        });
                        currentEle.disabled = false;
                        return false;
                    }
                    if (_this.newPassWord !== _this.againNewPassWord) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '两次输入的新密码不一致'
                            },
                            interval: 900
                        });
                        currentEle.disabled = false;
                        return false;
                    }
                    if (_this.oldPassWord === _this.newPassWord) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '新密码不能与旧密码相同'
                            },
                            interval: 900
                        });
                        currentEle.disabled = false;
                        return false;
                    }
                    return true;
                },
                submit: function () {
                    window.location.href = "/";
                },
                /**
                 * @auther nfj
                 * @description 取消修改密码
                 * @name cancelGrxx
                 */
                cancelGrxx: function () {
                    var _this = this;
                    _this.picShow = false;
                    _this.visiable = false;
                    _this.file = null;
                    _this.image = "#";
                    _this.visiable1 = false;
                    _this.image1 = _config.url.frame.getGrxxGzz + '/' + _this.gzz.bh + "?" + Math.random();
                    _this.base64Code = "";
                    _this.empcardTempFile = "";
                    _this.gzz = {
                        cBtgyy: null,
                        endDate: '',
                        startDate: '',
                        gzzHm: null,
                        zt: null
                    };
                    _this.gzzFlag = false;
                    _this.psdFlag = false;
                    _this.oldPassWord = '';
                    _this.newPassWord = '';
                    _this.againNewPassWord = '';
                    _this.cancel();
                }
            },
            computed: {
                userName: function () {
                    var cookies = document.cookie.split(";");
                    for (var i = 0; i < cookies.length; i++) {
                        var cks = cookies[i].split("=");
                        if (cks[0].trim() == "userName") {
                            return decodeURI(cks[1]);
                        }
                    }
                },
                uploadLoadingText: function () {
                    return this.uploadLoading ? '正在上传...' : '上传照片';
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
            created: function () {
                this.requestUserId();
            },
            mounted: function () {
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                this.gzz.startDate = y + '-' + m + '-' + d;
            }
        });
    });
