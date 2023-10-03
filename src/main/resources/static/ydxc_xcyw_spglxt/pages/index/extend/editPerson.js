define(['fdGlobal', 'config', 'fdComponent2'],
    function (fdGlobal, config,fdComponent2) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
    return {
        data: function () {
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
                //上传
                gzz: {
                    cBtgyy: null,
                    endDate: '',
                    startDate: function () {
                        var date = new Date();
                        var y = date.getFullYear();
                        var m = date.getMonth() + 1;
                        m = m < 10 ? '0' + m : m;
                        var d = date.getDate();
                        d = d < 10 ? ('0' + d) : d;
                        return y + '-' + m + '-' + d;
                    },
                    gzzHm: null,
                    zt: null,
                    bh: ""
                },
                // 原始手机号
                originalSjh: '',
                // 原始手机号
                originalZjh: '',
                originalip: '',
                originalmac: '',
                sjh:'', // 手机号
                zjh:'', // 座机号
                ip:'', //IP地址
                mac:'', //MAC地址
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
                // 判断是否改变工作证管理里面的值（未改变为false）
                isResetVal: false,
                // 个人信息设置弹框，确定按钮
                isDisabledSureBtn: false
            }
        },
        // 方法
        methods: {
            openXgzl:function(){
                var _this = this;
                _this.requestUserId();
                _this.showTab='jbzl';
                _this.oldPassWord = '';
                _this.newPassWord = '';
                _this.againNewPassWord = '';
                // $('#jsXgzl').removeClass('fd-hide');
                // $('.fd-mask').removeClass('fd-hide');
                _this.$refs.editPerson.open();
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
                            _this.deptMc = data.data.deptMc;
                            _this.corpMc = data.data.corpMc;
                            _this.sjh = data.data.sjh;
                            _this.ip = data.data.ip;
                            _this.mac = data.data.mac;
                            // 获取原始的手机号
                            _this.originalSjh = data.data.sjh;
                            _this.originalZjh = data.data.zjh;
                            _this.originalip = data.data.ip;
                            _this.originalmac = data.data.mac;
                            _this.zjh = data.data.zjh;
                            if (data.data.gzz != null) {
                                _this.isHaveGzz = true;
                                _this.gzz = data.data.gzz;
                                if(!_this.gzz){
                                    _this.gzz.startDate = _this.nowDateString();
                                }
                                _this.picShow = true;
                                _this.image1 = _config.url.frame.getGrxxGzz + '/' + _this.gzz.bh + "?" + Math.random();
                            } else {
                                _this.isHaveGzz = false;
                            };
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
                    if(this.gzz.startDate instanceof Function){
                        this.gzz.startDate = this.nowDateString();
                    }
                    sign = fdGlobal.dateCompare(this.gzz.startDate, obj);
                }
                if (sign) {
                    this.gzz[name] = obj;
                } else {
                    this.gzz[name] = '';
                    $('#jsXgzl').find('.fd-keyword-wraper').find('.fd-input-wrap.' + name).find('.fd-date-input').val('')
                }
                this.gzzFlag = true;
                // 以改变
                this.isResetVal = true;
            },
            //修改工作证号码
            changeGzzHm: function () {
                this.gzzFlag = true;
                // 以改变工作证号码
                this.isResetVal = true;
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
                    _this.image1 = _config.url.frame.empcardFromTemp + '/' + response.data + "?" + Math.random();
                }
                // 以改变工作证照片
                _this.isResetVal = true;
            },
            submitGrxx: function (e) {
                // window.location.href="/ydxc_xcyw_spglxt/pages/common/xgmm/index.html";
                var _this = this;
                var currentEle = e.currentTarget;
                // 如果用户选中了基本资料或者工作证管理，点击确定的时候需要验证手机号
                if(_this.showTab === 'jbzl' || _this.showTab === 'gzzgl'){
                    var checkTel = /^1(3|4|5|6|7|8|9)\d{9}$/;
                    // 验证手机号
                    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(_this.sjh))) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请在基本资料中填写正确的手机号'
                            },
                            interval: 900
                        });
                        return false;
                    }
                    if (!_this.isResetVal) {
                        // 当手机号和座机号同时没有改变的话，就直接关闭弹框
                        if (_this.originalSjh === _this.sjh && _this.originalZjh === _this.zjh &&
                            _this.originalip === _this.ip && _this.originalmac === _this.mac) {
                            _this.$refs.editPerson.close();
                            return false
                        } else {
                            _this.gzzFlag = false;
                        }
                    }
                }
                if ($('#personInfoSubmit').attr('disabled') == 'disabled') {
                    return false;
                }
                if(_this.showTab === 'gzzgl') {
                    _this.gzzFlag = true;
                    _this.psdFlag = false;
                    // 判断是否重新上传工作证，如果没有上传工作证，则提示上传工作证
                    if (!_this.isResetVal) {
                        // 当手机号和座机号同时没有改变的话，就直接关闭弹框
                        if (_this.originalSjh === _this.sjh && _this.originalZjh === _this.zjh) {
                            _this.$refs.editPerson.close();
                            return false
                        } else {
                            _this.gzzFlag = false;
                        }
                    }
                    if(!_this.isHaveGzz) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请上传工作证'
                            },
                            interval: 900
                        });
                        return false
                    }
                    // 工作证相应信息必填校验
                    if(_this.gzzFlag) {
                        if (!_this.gzz.gzzHm) {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请输入工作证号'
                                },
                                interval: 900
                            });
                            currentEle.disabled = false;
                            return false;
                        }
                        // 有效期开始时间必填校验
                        if (!_this.gzz.startDate) {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请选择有效期开始时间'
                                },
                                interval: 900
                            });
                            currentEle.disabled = false;
                            return false;
                        }
                        // 有效期结束时间必填校验
                        if (!_this.gzz.endDate) {
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
                    }
                }
                if(_this.showTab === 'xgmm') {
                    _this.gzzFlag = false;
                    _this.psdFlag = true;
                    if(!_this.oldPassWord) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请输入原密码'
                            },
                            interval: 900
                        });
                        return false
                    }
                    if(!_this.newPassWord) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请输入新密码'
                            },
                            interval: 900
                        });
                        return false
                    }
                    if(!_this.againNewPassWord) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请再次输入新密码'
                            },
                            interval: 900
                        });
                        return false
                    }
                    /*修改密码相应校验*/
                        var re = /^(?![a-zA-Z]+$)(?!\d+$)(?![\W_]+$)\S{10,}$/;
                        //            	        var   re =/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{10,20}$/;
                        //        				var   re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z](?!\d+$)(?![\W_]+$)\{10,20}$/
                        var result = re.test(_this.newPassWord) || re.test(_this.againNewPassWord);
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
                        if (_this.newPassWord != _this.againNewPassWord) {
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
                }

                //修改IP和MAC
               /* if(!_this.ip) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '请输入IP'
                        },
                        interval: 900
                    });
                    return false
                }*/
                //Ip的校验
                var reIp = /^((((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))[,])*((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
                var reMac = /^((([0-9a-fA-F]{2}[:]){5}([0-9a-fA-F]{2}[,]))*([0-9a-fA-F]{2}[:]){5}([0-9a-fA-F]{2}))$/;
                var resultIp = false;
                var resultMac = false;
                //允许mac和ip为空
                /*if(_this.mac != ''){
                    resultMac = reMac.test(_this.mac);
                } else {
                    resultMac = true;
                }
                if(_this.ip!=''){
                    resultIp = reIp.test(_this.ip);
                } else {
                    resultIp = true;
                }
                if (!resultIp) {
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
                if (!resultMac) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '更新Mac失败，请输入规范Mac地址'
                        },
                        interval: 1800
                    });
                    currentEle.disabled = false;
                    return false;
                }*/

                // 判断当前按钮的状态，如果是禁用的话，不走方法
                if (_this.isDisabledSureBtn) {
                    return false;
                }
                _this.isDisabledSureBtn = true;
                if (_this.gzz.endDate.length >10){
                    _this.gzz.endDate = _this.gzz.endDate.substr(0,10);
                }
                $.ajax({
                    method: _config.methodPost,
                    url: _this.editUser,
                    data: {
                        params: JSON.stringify({
                            userId: _this.userId,
                            avatar: _this.base64Code,
                            gzz: (_this.gzzFlag == true ? {
                                gzzPhoto: _this.empcardTempFile,
                                gzzHm: _this.gzz.gzzHm,
                                startDate: _this.gzz.startDate,
                                endDate: _this.gzz.endDate + ' 23:59:59',
                                cTjrMc: _this.userName
                            } : null),
                            passWord: (_this.psdFlag == true ? {
                                oldPassWord: _this.oldPassWord,
                                newPassWord: _this.newPassWord,
                                againNewPassWord: _this.againNewPassWord
                            } : null),
                            sjh: _this.sjh,
                            zjh: _this.zjh,
                            ip: _this.ip,
                            mac: _this.mac,
                            userRole: _this.loginPerson,
                            newData:new Date().getTime()
                        })
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.code === "200") {
                            // _vm.getWsps();
                            _this.visiable = false;
                            _this.file = null;
                            _this.image = "#";
                            _this.visiable1 = false;
                            _this.image1 = "#";
                            _this.base64Code = "";
                            _this.empcardTempFile = "";
                            _this.gzzFlag = false;
                            _this.psdFlag = false;
                            _this.picShow = false;
                            _this.isResetVal = false;
                            _this.gzz = {
                                cBtgyy: null,
                                endDate: '',
                                startDate: '',
                                gzzHm: null,
                                zt: null
                            };
                            _this.oldPassWord = '';
                            _this.newPassWord = '';
                            _this.againNewPassWord = '';
                            _this.$refs.editPerson.close();
                            $.alert({
                                type: 'success',
                                info: {
                                    success: '保存成功'
                                },
                                interval: 1800
                            });
                            //刷新头像
                            _this.avatar = _config.url.frame.getZzjgTx + '/' + _this.userId + "?" + Math.random()
                            //刷新工作证审批页面
                            var gzzspRefresh = {
                                flag: "gzzspRefresh"
                            }
                            var _data = JSON.stringify(gzzspRefresh)
                            window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                            // this.$refs.editPerson.close();
                        } else {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: result.message
                                },
                                interval: 1800
                            });
                        }
                        _this.isDisabledSureBtn = false;
                        currentEle.disabled = false;
                    },
                    error: function (data, textStatus, errorThrown) {
                        if (textStatus == 401) {
                            window.location.href = '/templates/login.pages'
                        }
                        currentEle.disabled = false;
                    }
                });
            },
            cancelGrxx: function () {
                var _this = this;
                _this.picShow = false;
                _this.visiable = false;
                _this.file = null;
                _this.image = "#";
                _this.visiable1 = false;
                _this.image1 = "#";
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
                // $('#jsXgzl').addClass('fd-hide')
                // $('.fd-mask').addClass('fd-hide')
                _this.$refs.editPerson.close();
            },
            nowDateString: function (){
                var nowDate = new Date();
                var y = nowDate.getFullYear();
                var m = nowDate.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = nowDate.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
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

        }
    }
});
