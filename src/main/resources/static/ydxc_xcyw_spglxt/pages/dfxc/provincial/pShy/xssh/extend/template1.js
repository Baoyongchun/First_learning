// 分模块
define(['fdGlobal', 'config'],
    function (fdGlobal, config) {
        var _config = JSON.parse(JSON.stringify(config));
        return {
            data: {
                name: '框架页主体信息',
                //信息查询
                serverUrlQueryXxcxspd: _config.url.frame.queryXxcxspd,
                //操作行为list
                jbxxDataObj: {},
                queriedObj: {
                    cxZrrList: [],
                    cxDwList: [],
                    cxCphList: [],
                    cxYhzhList: [],
                    cxSjhList: [],
                    hsZrrList: [],
                    hsJgList: []
                },
                cBh: 'E36F3BAE98DD460EB48F36255B4878D8',
                sqbs: '',
                browser: ''
            },
            // 方法
            methods: {
                //信息查询请求
                request: function (cBh) {
                    var _this = this;
                    var _promise = $.Deferred();
                    $.ajax({
                        method: config.methodGet,
                        url: _this.serverUrlQueryXxcxspd,
                        dataType: 'json',
                        success: function (data) {
                            if (data.code == 1) {
                                _this.jbxxDataObj = data.data.jbxx;
                                _this.queriedObj = data.data.queriedObjects;
                                console.log(_this.queriedObj)
                                _promise.resolve(data.data)
                            } else {
                                _promise.reject()
                            }

                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                        },
                        error: function (data, textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                    return _promise
                },
                //截取参数
                getParamsFun: function () {
                    var params = {};
                    var winParamStr = window.location.search.substring(1);
                    //给全局变量案件赋值
                    params.cBh = getParam("bh");
                    params.sqbs = getParam("sqbs");
                    //单个获取参数函数
                    function getParam(key) {
                        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
                        var r = winParamStr.match(reg);
                        if (r == null) {
                            return "";
                        }
                        return r[2];
                    }
                    return params;
                },
                transUndefined: function (val) {
                    return (val == undefined || val == null) ? '' : val;
                },
                clickPrintYl: function () {
                    $('.js-page-zs').addClass('fd-hide');
                    $('.js-page-print').removeClass('fd-hide');
                },
                clickOutPrintYl: function () {
                    $('.js-page-print').addClass('fd-hide');
                    $('.js-page-zs').removeClass('fd-hide');
                },
                //通过n值获取c值
                getStrByN: function (num1, num2) {
                    var str = fdGlobal.getString(num1, num2);
                    return str;
                },
                dateFormatM: function (value) {

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
                    return y + '年' + m + '月' + d + '日';
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
                    return y + '年' + m + '月' + d + '日';
                }
            },
            computed: {},
            // 更新数据后调用该函数
            updated: function () {

            },
            //  vm创建后调用该函数
            created: function () {
                //获取信息
                var _this = this;
                if (fdGlobal.checkBrowser().browser == "IE") {
                    browser = "IE";
                    $("#xxcxspdcss").attr('href', '../css/module-xxcxspd-ie.css');
                } else if (fdGlobal.checkBrowser().browser == "Chrome") {
                    if (fdGlobal.checkBrowser().version < 50) {
                        browser = "chromelow";
                        $("#xxcxspdcss").attr('href', '../css/module-xxcxspd-chromelow.css');
                    } else {
                        browser = "chrome";
                        $("#xxcxspdcss").attr('href', '../css/module-xxcxspd.css');
                    }
                } else {
                    $("#xxcxspdcss").attr('href', '../css/module-xxcxspd.css');
                }
                var p = Artery.parseUrl();
                _this.cBh = p.bh;
                _this.sqbs = p.sqbs;
                // _this.request(_this.cBh);
            }
        }
    })