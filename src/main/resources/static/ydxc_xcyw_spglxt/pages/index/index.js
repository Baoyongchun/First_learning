/**
 * version      20200218
 * createTime   20200218
 * updateTime    20200218
 * author        whf
 * name          index.js
 *description    主体框架页面js
 */
define(['fdGlobal', 'fdEventBus', 'extend/navTaboOperation .js', 'extend/editPerson.js', 'extend/xjip.js', 'extend/xjzaz.js'
        , 'extend/cxsqPop.js', 'extend/gzzsh.js', 'extend/cxjc.js', 'extend/cxwhpz.js', 'extend/ysh.js', 'extend/ygz.js','extend/ckYm.js'
        , 'extend/scip.js', 'extend/scjcsj.js', 'extend/ckgzz.js', 'extend/fkyjglCkxq.js', 'extend/tjsp.js', 'extend/spjl.js', 'extend/zymlgl.js', 'extend/cxsqTjsp.js', 'config'],
    function (fdGlobal, fdEventBus, navTaboOperation, editPerson, xjip, xjzaz, cxsqPop, gzzsh, cxjc, cxwhpz, ysh, ygz, scip, scjcsj, ckgzz
        ,ckYm, fkyjglCkxq, tjsp, spjl, zymlgl, cxsqTjsp, config) {
        var _config = JSON.parse(JSON.stringify(config));
        var indexVm = new Vue({
            el: '#jsMainApp',
            mixins: [fdEventBus, navTaboOperation, editPerson, xjip, xjzaz, cxsqPop, gzzsh, cxjc, cxwhpz, ysh, ygz, scip, scjcsj, ckgzz,ckYm, fkyjglCkxq, tjsp, spjl, zymlgl, cxsqTjsp],
            data: {
                name: '主体框架页面',
                updateNoticeStatusUrl: config.url.frame.updateNoticeStatusUrl,
                // 点击缩放的初始大小
                currentScale: 1,
                // 图片的高度
                img_h: '',
                // 图片位置
                currntMoveX: 0,
                currntMoveY: 0,
                scaleX: 0,
                scaleY: 0,
                // 鼠标是否按下
                isMove: false,
                // 判断是否改变工作证管理里面的值（未改变为false）
                isResetVal: false,
                // 上传图片接口
                uploadEmpPhoto: _config.url.frame.uploadEmpPhoto
            },
            beforeCreate: function () {
                if (window.top !== window) {
                    window.top.location.reload(true);
                }
            },
            // 创建
            created: function () {
                // document.querySelector('body').addEventListener('mousedown', this.clickDxfz, false);
                fdEventBus.$on("appscspb", function (val) {
                    var dataBj = {
                        flag: "scspbOpen",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                });
                fdEventBus.$on("appXstjsp", function (val) {
                    var dataBj = {
                        flag: "XstjspOpen",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                })
                fdEventBus.$on("appSxDsp", function (val) {
                    var dataBj = {
                        flag: "SxDspOpen",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                });
                fdEventBus.$on("appSxDgz", function (val) {
                    var dataBj = {
                        flag: "SxDgzOpen",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                });
                fdEventBus.$on("appSxDsh", function (val) {
                    var dataBj = {
                        flag: "SxDshOpen",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                });
                fdEventBus.$on('appOpenLoading', this.openLoading);
            },
            destoried: function() {
                fdEventBus.$off('appOpenLoading', this.openLoading);
            },
            // destroyed: function() {
            //     document.querySelector('body').removeEventListener('mousedown', this.clickDxfz, true);
            // },
            methods: {
                // clickDxfz: function(event) {
                //     var _event = event;
                //     console.log(_event.target);
                //     console.dir(_event.target);
                //     if (_event.target.classList.contains('aty-select-group-title')){
                //         _event.target.classList.toggle('checked')
                //     }
                // },
                // 点击意见反馈
                clickFkyj: function () {
                    Artery.open({
                        targetType: '_blank',
                        url: '../../pages/common/fkyj/index.html'
                    });
                },
                // 点击扫描仪下载
                clickScanUp: function () {
                    this.gGownloadScanUpload();
                },
                // 点击下载扫描仪插件
                gGownloadScanUpload: function() {
                    var id = 'downloadFrame';
                    var frame = document.getElementById(id);
                    if (!frame) {
                        frame = document.createElement('iframe');
                        frame.id = id;
                        frame.width = '0px';
                        frame.height = '0px';
                        document.body.appendChild(frame);
                    }
                    frame.src = '/ydxc_xcyw_spglxt/download/ScanUpload.exe';
                },
                logout: function () {
                    Artery.open("/logout");
                },
                openLoading: function(data) {
                    if (data.data) {
                        $('.fd-loading-div').removeClass('fd-hide');
                    } else {
                        $('.fd-loading-div').addClass('fd-hide');
                    }

                },
                clickHelp: function (event) {
                    event.target.children[0].click();
                },
                // 放大工作证
                clickfd: function () {
                    var _this = this;
                    _this.currentScale += 0.1;
                    _this.$refs.bigImg.style.transform = "scale(" + _this.currentScale + ")";
                },
                // 缩小工作证
                clicksx: function () {
                    var _this = this;
                    _this.currentScale -= 0.1;
                    if (_this.currentScale < 0) {
                        _this.currentScale = 0
                    } else {
                        _this.$refs.bigImg.style.transform = "scale(" + _this.currentScale + ")";
                    }
                },
                // 工作证大小还原
                clickRe: function () {
                    this.currentScale = 1;
                    this.$refs.bigImg.style.transform = "scale(" + this.currentScale + ")";
                    // 图片容器复位
                    this.$refs.bigImgW.style.top = "0";
                    this.$refs.bigImgW.style.left = "0";
                },

                // 工作证可以移动
                imgbigsmalldown: function (event) {
                    var _this = this;
                    event.preventDefault();
                    // 鼠标按下
                    _this.isMove = true;
                    _this.scaleX = event.clientX;
                    _this.scaleY = event.clientY;
                },
                // 工作证可以移动
                imgbigsmallmove: function (event) {
                    var _this = this;
                    event.preventDefault();
                    var moveDom = $(".fd-ckgzz-img").get(0);
                    if (_this.isMove && _this.currentScale > 1) {
                        moveDom.style.left = _this.currntMoveX + (event.clientX - _this.scaleX) + 'px';
                        moveDom.style.top = _this.currntMoveY + (event.clientY - _this.scaleY) + 'px';
                    }
                },
                // 工作证可以移动
                imgbigsmallup: function () {
                    var _this = this;
                    var moveDom = $(".fd-ckgzz-img");
                    // 鼠标松开
                    _this.isMove = false;
                    //保存当前位置
                    _this.currntMoveX = parseInt(moveDom.css("left").replace("px", ""));
                    _this.currntMoveY = parseInt(moveDom.css("top").replace("px", ""));
                },
                // 放大印模
                clickYmfd: function () {
                    var _this = this;
                    _this.currentScale += 0.1;
                    _this.$refs.bigImgYm.style.transform = "scale(" + _this.currentScale + ")";
                },
                // 缩小印模
                clickYmsx: function () {
                    var _this = this;
                    _this.currentScale -= 0.1;
                    if (_this.currentScale < 0) {
                        _this.currentScale = 0
                    } else {
                        _this.$refs.bigImgYm.style.transform = "scale(" + _this.currentScale + ")";
                    }
                },
                // 印模大小还原
                clickYmRe: function () {
                    this.currentScale = 1;
                    this.$refs.bigImgYm.style.transform = "scale(" + this.currentScale + ")";
                    // 图片容器复位
                    this.$refs.bigImgY.style.top = "0";
                    this.$refs.bigImgY.style.left = "0";
                },
                // 印模可以移动
                imgymbigsmalldown: function (event) {
                    var _this = this;
                    event.preventDefault();
                    // 鼠标按下
                    _this.isMove = true;
                    _this.scaleX = event.clientX;
                    _this.scaleY = event.clientY;
                },
                // 印模可以移动
                imgymbigsmallmove: function (event) {
                    var _this = this;
                    event.preventDefault();
                    var moveDom = $(".fd-ckgzz-img").get(1);
                    if (_this.isMove && _this.currentScale > 1) {
                        moveDom.style.left = _this.currntMoveX + (event.clientX - _this.scaleX) + 'px';
                        moveDom.style.top = _this.currntMoveY + (event.clientY - _this.scaleY) + 'px';
                    }
                },
                // 印模可以移动
                imgymbigsmallup: function () {
                    var _this = this;
                    var moveDom = $(".fd-ckgzz-img");
                    // 鼠标松开
                    _this.isMove = false;
                    //保存当前位置
                    _this.currntMoveX = parseInt(moveDom.css("left").replace("px", ""));
                    _this.currntMoveY = parseInt(moveDom.css("top").replace("px", ""));
                },
                //上传图片
                handleUpload: function (f) {
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
                    // 上传照片和提交按钮置无效
                    _this.uploadLoading = true;
                    $('#empPhotoUpload .aty-upload-list').hide();
                    $('#empPhotoUpload :file').attr('disabled', 'disabled');
                    return true;
                },
                uploadPhotoSuccess: function (response, file, fileList) {
                    var _this = this;
                    _this.$refs.empPhotoUpload.clearFiles();
                    // 恢复上传照片和提交按钮
                    _this.uploadLoading = false;
                    $('#empPhotoUpload :file').attr('disabled', false);
                    if (fdGlobal.checkString(response.data)) {
                        _this.empcardTempFile = response.data;
                        _this.loginSrc = _config.url.frame.empcardFromTemp + '/' + response.data + "?" + Math.random();
                    }
                }
            }
        });
        window.indexVm = indexVm;
        return indexVm;
    });
