define(['fdGlobal', 'config', 'fdComponent2', 'fdEventBus'],
    function (fdGlobal, config, fdComponent2, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // 反馈进度弹窗的 数据
                    fkjdData: {},
                    // 查询流程弹窗的 数据
                    // cxlcData: [
                    //     {
                    //         subtitle: '',
                    //         time: '2020-02-03 12:20:20',
                    //         detail: [
                    //             {
                    //                 name: '',
                    //                 value: ''
                    //             }
                    //         ],
                    //         status: '已通过'
                    //     }
                    // ],
                    //"detail": [
                    //                             {"name": "盖章结果", "value": "通过"},
                    //                             {"name": "部门","value": "第二纪检委监察室"},
                    //                             {"name": "盖章管理员", "value": "凤雏"}
                    //                         ],
                    cxlcData: [{
                        "subtitle": "申请查询",
                        "time": "2020-06-01 10:23:49",
                        "detail": ['申请人：曹操', '协助申请人：陈海'],
                        "status": "已完成"
                    }, {
                        "subtitle": "审批",
                        "time": "2020-06-01 10:26:32",
                        "detail": ['【审批结果：<span>通过</span>】', '审批人：法正', '审批时间：2020-05-30', '【审批结果：<span>不通过</span>】', '审批人：法正', '审批时间：2020-05-31'],
                        "status": "已完成"
                    }, {
                        "subtitle": "盖章",
                        "time": "2020-06-01 10:26:32",
                        "detail": ['【盖章结果：<span>通过</span>】', '部门：第二纪检委监察室', '盖章管理员：凤雏', '【盖章结果：<span>不通过</span>】', '部门：第二纪检委监察室', '盖章管理员：凤雏'],
                        "status": "已完成"
                    }],
                    // 提交审核文件
                    files: [],
                    //当前预览图片index
                    currPerviewIndex: '',
                    //预览图片src
                    srcContent: '',
                    // 选中的申请的编号
                    selectedBh: '',
                    url: {
                        cxsqlb: _config.url.frame.serverUrlCxsqlb, //查询申请列表
                        cxlc: _config.url.frame.serverUrlCxlc, //查询流程
                        fkjd: _config.url.frame.serverUrlFkjd, //反馈进度
                        scsq: _config.url.frame.serverUrlScsq, //删除申请
                        tjsh: _config.url.frame.serverUrlTjsh, //提交审核
                        dzdm: _config.url.frame.serverUrlDzdm, //单值代码
                        ckjg: _config.url.frame.serverUrlCkjg, //查看结果
                        updaloadSpd: _config.url.frame.serverUrlScspd, //上传审批单
                        deleteSpd: _config.url.frame.serverUrlDelspd, //删除审批单
                        getPng: _config.url.frame.serverUrlGetPng,
                        scanControlUrl: 'http://127.0.0.1:7000',
                        scanBenTuControlUrl: 'http://127.0.0.1:3883',  // 奔图扫描仪
                        scanUploadUrl: _config.url.frame.scanUploadUrl,
                        getAuthCodeUrl: _config.url.frame.getAuthCodeUrl,
                        getFileUrl: _config.url.frame.getFileUrl
                    },
                    refuseReason: '',
                    // 进度条值
                    progressNum: '',
                    // 图片旋转的度数
                    deg: 0,
                    // 图片放大缩小的值
                    scaleNum: 1,
                    // 图片的高度
                    img_h: '',
                    // 第一张一张图片
                    img: {
                        imgfirst: false,
                        imglast: false,
                        isShow: false
                    },
                    // 判断当前用户点击了几下翻页的按钮
                    imgCount: 0,
                    scanCtrl: {},
                    scanList: [],
                    authCode: '',
                    webSocket: {},
                    socketKey: "",
                    name: '审核不通过'
                }
            },
            methods: {
                /**
                 * @description 提交盖章左右切换图片的方法
                 * @param type 判断是上翻页还是下翻页
                 */
                clickToggleImg: function (type) {
                    var count = 0;
                    count = type === 'prev' ? -1 : 1;
                    console.log(this.imgCount)
                    if (this.imgCount === 0 && type === 'next') {
                        return false;
                    } else if (Math.abs(this.imgCount) === (this.files.length - 4) && type === 'prev') {
                        return false;
                    }
                    this.imgCount = this.imgCount + count;
                },
                changeLc: function (status, dashed, index) {
                    // 当状态为true时 已完成
                    if (status === '已完成') {
                        return 'fd-ywc'
                        // 挡状态为false时 切虚线为true  是 进行中
                    } else if (status === '进行中') {
                        return 'fd-jxz'
                        // 挡状态为false时 切虚线为false  是 未完成
                    } else if (status === '未通过') {
                        return 'fd-wtg'
                    } else if (status === '未开始') {
                        return 'fd-wdd'
                    }
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 反馈进度弹窗
                 */
                modalfkjd: function (val) {
                    // 打开弹窗
                    // 反馈数据赋值
                    this.fkjdData = val._data.fkjdData;
                    // 进度条赋值
                    this.progressNum = val._data.progressNum;
                    this.$refs["scroll03"].update(0, 0);
                    this.$refs["scroll04"].update(0, 0);
                    this.$refs.modalFkjd.open();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 查询流程弹窗
                 */
                modalcxlc: function (val) {
                    var _this = this;
                    console.log(val._data);
                    _this.cxlcData = val._data;

                    if (_this.cxlcData.length > 0) {
                        _this.$refs["modalCxlc"].open();
                        // 调用滚动条更新方法
                        _this.$nextTick(function () {
                            //     var _height = document.getElementById('appControllerCxlc').clientHeight;
                            _this.$refs["popScroll"].update(0, 0);
                            // _this.$refs["popScroll"].update(_height,0,0);
                        })
                    } else {
                        Artery.notice.info({
                            title: '暂无流程信息'
                        });
                    }
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description  提交申请弹窗
                 */
                modaltjsq: function (val) {
                    var _this = this;
                    _this.url.tjsh = val._data.tjsh;
                    _this.selectedBh = val.selectedBh;
                    if (_this.files.length === 0) {
                        Artery.notice.warning({
                            title: '请上传审批表'
                        });
                        return;
                    }
                    _this.$refs["modalTjsq"].open();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 提交审核
                 */
                modaltjsh: function (val) {
                    var _this = this;
                    // 传入的编号值
                    _this.selectedBh = val._data.bh;
                    _this.files = val._data.files;
                    _this.$refs["modalUploadSpd"].open();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 确认删除
                 */
                deleteOk: function () {
                    var _this = this;
                    Artery.ajax.delete(_this.url.scsq + _this.selectedBh)
                        .then(function (result) {
                            if (result.success) {
                                Artery.notice.success({
                                    title: '删除成功'
                                });
                                // 定义需要传递过去的数据
                                var dataBj = {
                                    flag: "CxsqQrscParent",
                                    _data: {}
                                };
                                var _data = JSON.stringify(dataBj);
                                window.postMessage(_data, '*');
                                window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                            } else {
                                Artery.notice.error({
                                    title: '提示',
                                    desc: result.message
                                });
                            }
                            _this.$refs["modalQrsc"].close();
                        }).catch(function (error) {
                        Artery.message.error(error);
                        _this.$refs["modalQrsc"].close();
                    });
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 上传审批单处理
                 */
                handleUploadSPB: function (file) {
                    var _this = this;
                    //check file must end with png
                    var accept = ['png','pdf','jpeg','jpg'];
                    var fileName = file.name;
                    var suffix = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
                    if (!accept.includes(suffix)) {
                        Artery.notice.warning({
                            title: '请上传png/jpg/jpeg或pdf格式的文件'
                        });
                        return false;
                    }
                    //check file size must less than 3M
                    /*var size = file.size;
                    if (suffix == "jpg" && size / Math.pow(1024, 2) > 3) {
                        Artery.message.warning({
                            title: '单个JPG文件大小不可超过3M'});
                        return;
                    }
                    if (suffix == "jpeg" && size / Math.pow(1024, 2) > 3) {
                        Artery.message.warning({
                            title: '单个JPEG文件大小不可超过3M'});
                        return;
                    }
                    if (suffix == "pdf" && size / Math.pow(1024, 2) > 50) {
                        Artery.message.warning({
                            title: '单个PDF文件大小不可超过150M'});
                        return;
                    }
                    if (suffix == "png" && size / Math.pow(1024, 2) > 3) {
                        Artery.message.warning({
                            title: '单个PNG文件大小不可超过3M'});
                        return;
                    }*/

                    Artery.ajax.interceptors.request.use(function (config) {
                        config.timeout = 60000;
                        return config;
                    });
                    //post request server
                    Artery.ajax.post(_this.url.updaloadSpd + _this.selectedBh, _this.getRequestData(file))
                        .then(function (result) {
                            console.log(file);
                            _this.handleUploadSuccess(result, file,suffix);
                        }).catch(function (error) {
                        Artery.notice.error({
                            title: '提交异常',
                            desc: error
                        });
                    });
                    return false;
                },
                handleUploadSuccess: function (result, file,suffix) {
                    var _this = this;
                    if (result.success) {
                        if ("png" == suffix||"jpg" == suffix||"jpeg" == suffix) {
                            Artery.notice.success({
                                title: result.data[0].cWjmc + '上传成功'
                            });
                        }else if("pdf" == suffix){
                            Artery.notice.success({
                                title: file.name + '上传成功'
                            });
                        }

                        if ("png" == suffix||"jpg" == suffix||"jpeg" == suffix) {
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            //把得到的base64赋值到img数组，之后显示
                            reader.onload = function (e) {
                                //添加到已上传文件列表
                                _this.files.push({
                                    id: result.data[0].cId,
                                    wjmc: result.data[0].cWjmc,
                                    cclj: result.data[0].cCclj,
                                    order: result[0].nOrder,
                                    srcContent: this.result
                                });
                            }
                        } else {
                            var resultFiles = result.data;
                            for (var i = 0; i < resultFiles.length; i++) {
                                var resultFile = resultFiles[i];
                                _this.files.push({
                                    id: resultFile.cId,
                                    wjmc: resultFile.cWjmc,
                                    cclj: resultFile.cCclj,
                                    order: resultFile.nOrder,
                                    srcContent: _this.url.getFileUrl + "/" + resultFile.cId
                                });
                            }
                        }

                    } else {
                        Artery.notice.error({
                            title: '提示',
                            desc: result.message
                        });
                    }
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 关闭上传审批单modal
                 */
                closeModalUploadSpd: function () {
                    var _this = this;
                    //清空文件
                    _this.files = [];
                    //清空上传控件
                    _this.$refs["upload"].clearFiles();
                    _this.$refs["modalUploadSpd"].close();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 关闭提交审核modal
                 */
                closeModalSubmitCheck: function () {
                    this.$refs["modalTjsq"].close();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 删除文件
                 */
                deleteFile: function (index, channel) {
                    var _this = this;
                    Artery.ajax.delete(_this.url.deleteSpd + _this.selectedBh, {
                        params: {
                            wjid: _this.files[index].id,
                            cclj: _this.files[index].cclj
                        }
                    }).then(function (result) {
                        if (result.success) {
                            //删除已上传列表
                            _this.files.splice(index, 1);

                            if (channel === 'modal') {
                                _this.refreshSpdPreviewModal()
                            }
                            Artery.notice.success({
                                title: '删除成功'
                            });
                        } else {
                            Artery.notice.error({
                                title: result.message
                            });
                        }
                    });
                },

                /**
                 * 预览框删除的要刷新下
                 * 刷新规则:
                 * 1. 没有图片, 关闭预览框
                 * 2. 上翻一页
                 * 3. 下翻一页
                 */
                refreshSpdPreviewModal: function () {
                    var _this = this;
                    if (_this.files.length === 0) {
                        _this.$refs["fdShowPicture"].close();
                    } else if (_this.currPerviewIndex > 0) {
                        _this.previewTab('pre')
                    } else {
                        _this.currPerviewIndex--;
                        _this.previewTab('next')
                    }
                },

                /**
                 * 在上传列表删除审批单
                 * @param index
                 */
                deleteSpdInTable: function (index) {
                    this.deleteFile(index, 'table');
                },

                /**
                 * 在预览弹框删除审批单
                 */
                deleteSpdInModal: function () {
                    this.deleteFile(this.currPerviewIndex, 'modal');
                },

                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 提交审核
                 */
                submitCheckOk: function () {
                    var _this = this;
                    _this.$refs.loadingModel.open();
                    _this.$refs.modalTjsq.close();
                    Artery.ajax.post(_this.url.tjsh + _this.selectedBh)
                        .then(function (result) {
                            if (result.success) {
                                Artery.notice.success({
                                    title: '提交成功'
                                });
                                _this.files = []; //清空文件列表
                                // 定义需要传递过去的数据
                                var dataBj = {
                                    flag: "CxsqTjshParent",
                                    _data: {}
                                };
                                var _data = JSON.stringify(dataBj);
                                // window.parent.parent.postMessage(_data,'*');
                                window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                                _this.closeModalSubmitCheck();
                                _this.closeModalUploadSpd();
                                // 刷新左侧退回生数字
                                var pMessage = {
                                    message: 'shy-thsq'
                                };
                                window.parent.postMessage(pMessage, '*');
                            } else {
                                Artery.notice.error({
                                    title: '提示信息',
                                    desc: result.message
                                });
                                // _this.$refs.modalTjsq.close();
                            }
                            _this.$refs.loadingModel.close();
                        }).catch(function (error) {
                        _this.$refs.loadingModel.close();
                        Artery.notice.error({
                            title: '提交异常',
                            desc: error
                        });
                    });
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 提交申请弹窗
                 */
                openModalTjsq: function () {
                    var _this = this;
                    if (_this.files.length === 0) {
                        Artery.notice.warning({
                            title: '请上传审批表'
                        });
                        return;
                    }
                    _this.$refs["modalTjsq"].open();
                },

                /**
                 * 打开审批单预览弹窗
                 * @param index
                 */
                openModalPreview: function (index,order) {
                    var _this = this;
                    this.scaleNum = 1;
                    this.deg = 0;
                    if(order == 1){
                        this.deg = -90;
                    }
                    $('.fd-picture-obj').css({
                        'transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-webkit-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-ms-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        'top': '50%',
                        'left': '50%'
                    });
                    // 图片的高度
                    var _h = $(document).height() * 0.9 - 55;
                    _this.currPerviewIndex = index;
                    _this.srcContent = _this.url.getPng + _this.files[index].id;
                    _this.$refs["fdShowPicture"].open();
                    var windowHeight = document.body.clientHeight;
                    var imgHeight = 0;
                    if (fdGlobal.checkBrowser().browser == "IE") {
                        console.log("高度：" + windowHeight);
                        imgHeight = windowHeight > 850 ? 830 : 700;
                    } else {
                        imgHeight = windowHeight > 850 ? 830 : 700;
                    }
                    _this.img_h = imgHeight + 'px';
                    console.log("扫描图img_h外部高度：" + _this.img_h);
                    var img = new Image();
                    img.src = _this.url.getPng + _this.files[index].id;
                    img.onload = function (ev) {
                        // 图片加载时 调用自动缩放；
                        _this.autoSize(img, 800, _h);
                    };
                    // 打开预览页，第一张 上一张按钮置灰
                    if (_this.currPerviewIndex === 0) {
                        _this.img.imgfirst = true;
                        // 打开预览页，最后一张 下一张按钮置灰
                    } else if (_this.currPerviewIndex === _this.files.length - 1) {
                        _this.img.imglast = true;
                    }

                },
                /**
                 * tab切换按钮 划过显示
                 */
                tabisShow: function () {
                    var _this = this;
                    // 当只有一张图片的时候 切换按钮隐藏
                    if (_this.files.length === 1) {
                        _this.img.isShow = false;
                    } else {
                        _this.img.isShow = true;
                    }
                },
                /**
                 * tab切换按钮 离开隐藏
                 */
                tabisHide: function () {
                    var _this = this;
                    // 当只有一张图片的时候 切换按钮隐藏
                    if (_this.img.isShow) {
                        _this.img.isShow = false;
                    }
                },
                /**
                 * tab切换按钮 图片旋转
                 */
                //
                previewRotateZuo: function () {
                    var _this = this;
                    // 图片旋转90deg
                    _this.deg -= 90;
                    if (_this.deg <= -360) {
                        _this.deg = 0;
                    }
                    $('.fd-picture-obj').css({
                        'transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-webkit-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-ms-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')'
                    })
                },
                /**
                 * tab切换按钮 划过显示
                 */
                previewRotateYou: function () {
                    var _this = this;
                    // 图片旋转90deg
                    _this.deg += 90;
                    // 当图片旋转到270deg时 旋转度数置0
                    if (_this.deg >= 360) {
                        _this.deg = 0;
                    }
                    $('.fd-picture-obj').css({
                        'transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-webkit-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-ms-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')'
                    });
                },
                /**
                 * tab切换按钮 图片切换--- 上一张 下一张
                 * @param val
                 */
                previewTab: function (val) {
                    var _this = this;
                    // 图片的高度
                    var _h = $(document).height() * 0.9 - 55;
                    _this.img.imgfirst = false;
                    _this.img.imglast = false;
                    // 旋转度数 为0；
                    _this.deg = 0;
                    $('.fd-picture-obj').css({
                        'transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-webkit-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-ms-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        'top': '50%',
                        'left': '50%'
                    })
                    if (val === 'next') {

                        _this.currPerviewIndex++;
                        if (_this.currPerviewIndex >= _this.files.length - 1) {
                            _this.img.imglast = true;
                            _this.currPerviewIndex = _this.files.length - 1;
                            _this.srcContent = _this.files[_this.currPerviewIndex].srcContent;
                        } else {
                            _this.srcContent = _this.files[_this.currPerviewIndex].srcContent;
                        }
                    } else if (val === 'pre') {
                        _this.currPerviewIndex--;
                        if (_this.currPerviewIndex <= 0) {
                            _this.img.imgfirst = true;
                            _this.currPerviewIndex = 0;
                            _this.srcContent = _this.files[_this.currPerviewIndex].srcContent;
                        } else {
                            _this.srcContent = _this.files[_this.currPerviewIndex].srcContent;
                        }
                    }
                    // 图片切换 调用自动缩放；
                    var img = new Image();
                    img.src = _this.srcContent;
                    img.onload = function (ev) {
                        // 图片加载时 调用自动缩放
                        _this.autoSize(img, 800, _h);
                    };

                },
                /**
                 * 图片等比例缩放
                 * @param Img  传入的图片, maxWidth  最大宽度, maxHeight   最大高度；
                 */
                autoSize: function (Img, maxWidth, maxHeight) {
                    //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
                    // 当图片比图片框小时不做任何改变
                    var imgEle = $('.fd-picture-obj');

                    if (Img.width < maxWidth && Img.height < maxHeight) {
                        imgEle.css('margin-top', -$('.fd-picture-obj').height() / 2 + 'px');
                    } else {//原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
                        if (maxWidth / maxHeight <= Img.width / Img.height) //原图片宽高比例 大于 图片框宽高比例
                        {
                            imgEle.width(maxWidth).height(maxWidth * (Img.height / Img.width));
                        } else {   //原图片宽高比例 小于 图片框宽高比例
                            imgEle.width(maxHeight * (Img.width / Img.height)).height(maxHeight);
                        }
                    }
                },
                /**
                 *  * @Author wlq
                 *    @description 重置图片
                 */
                clickRefresh: function () {
                    this.openModalPreview(this.currPerviewIndex);
                    this.resetImage('.fd-picture-obj', 0, 1, '-50%', '-50%');
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 组装请求数据
                 */
                getRequestData: function (file) {
                    var _this = this;
                    var formData = new FormData();
                    /*for (var index = 0; index < _this.files.length; index++) {
                        formData.append("file", _this.files[index])
                    }*/
                    formData.append("file", file);
                    return formData
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 删除
                 */
                modalremove: function (val) {
                    var _this = this;
                    _this.selectedBh = val._data;
                    _this.$refs["modalQrsc"].open();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 审核不通过
                 */
                modashbtg: function (val) {
                    var _this = this;
                    _this.refuseReason = val._data.reason;
                    _this.name = val._data.name
                    _this.$refs["modalShbtg"].open();
                }, /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 关闭不通过原因modal
                 */
                closeModalRefuseReason1: function () {
                    this.$refs["modalShbtg"].close();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 反馈进度带点击确认
                 */
                fkjdOk: function () {
                    this.$refs.modalFkjd.close();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 点击过滤条件查询的时候
                 */
                modalcx: function () {
                    this.$refs.popScroll.update(0, 0);
                },
                /**
                 *  * @Author wlq
                 *    @Date 2020/04/09
                 *    @description 组装请求数据
                 */
                clickcaleImg: function (code) {
                    if (code === 'big') {
                        this.scaleNum = this.scaleNum + 0.2;
                    } else {
                        this.scaleNum = this.scaleNum - 0.2;
                        if (this.scaleNum < 0) {
                            this.scaleNum = 0;
                        }
                    }
                    $('.fd-picture-obj').css({
                        'transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-webkit-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')',
                        '-ms-transform': 'translate(-50%, -50%)' + 'rotate(' + this.deg + 'deg)' + 'scale(' + this.scaleNum + ')'
                    });
                },

                /**
                 * @Author: wlq
                 * @name: imgbigsmalldown
                 * @description: 可以移动
                 * @return: {undefined}
                 */
                imgbigsmalldown: function (event) {
                    var _this = this;
                    event.preventDefault();
                    // 鼠标按下
                    _this.isMove = true;
                    _this.scaleX = event.clientX;
                    _this.scaleY = event.clientY;
                },
                /**
                 * @Author: wlq
                 * @name: imgbigsmallmove
                 * @description: 可以移动
                 * @return: {undefined}
                 */
                imgbigsmallmove: function (event) {
                    var _this = this;
                    var moveDom = $(".fd-picture-obj").get(0);
                    event.preventDefault();
                    if (_this.isMove) {
                        moveDom.style.left = _this.currntMoveX + (event.clientX - _this.scaleX) + 'px';
                        moveDom.style.top = _this.currntMoveY + (event.clientY - _this.scaleY) + 'px';
                    }
                },
                /**
                 * @Author: wlq
                 * @name: imgbigsmallup
                 * @description: 可以移动
                 * @return: {undefined}
                 */
                imgbigsmallup: function () {
                    var _this = this;
                    var moveDom = $(".fd-picture-obj");
                    // 鼠标松开
                    _this.isMove = false;
                    //保存当前位置
                    _this.currntMoveX = parseInt(moveDom.css("left").replace("px", ""));
                    _this.currntMoveY = parseInt(moveDom.css("top").replace("px", ""));
                },
                resetImage: function (cssName, deg, scaleNum, transX, transY) {
                    this.deg = (deg || deg === 0) ? deg : this.deg;
                    this.scaleNum = (scaleNum || scaleNum === 0) ? scaleNum : this.scaleNum;
                    transX = transX ? transX : 0;
                    transY = transY ? transY : 0;
                    $(cssName).css({
                        'transform': 'translate(' + transX + ', ' + transY + ') rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                        '-webkit-transform': 'translate(' + transX + ', ' + transY + ') rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                        '-ms-transform': 'translate(' + transX + ', ' + transY + ') rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')'
                    });
                },
                scanAndUploadSpd: function () {
                    var _this = this;
                    _this.$refs.loadingModel.open();
                    // _this.initSocketIO();
                    Artery.ajax.get(this.url.getAuthCodeUrl).then(function (result) {
                        if (result.success) {
                            _this.authCode = result.data;
                            var browser = fdGlobal.checkBrowser();
                            // Chrome IE Firefox
                            // 判断是否连接奔图扫描仪
                            var isBentu = _this.checkBentu2();
                           /* if(!isBentu){
                                isBentu = _this.checkBentu2();
                            }*/
                            if (isBentu) {
                                _this.scanBenTu();
                            } else {
                                _this.scanInCommon();
                            }
                        }
                    }).catch(function (err) {
                        _this.$refs.loadingModel.close();
                    });
                },
                scanInIE: function () {
                    var _this = this;
                    _this.scanList = [];
                    _this.scanCtrl = document.getElementById("scanCtrl");
                    // 扫描仪控件参数设置
                    _this.scanCtrl.FieldName = 'file';
                    _this.scanCtrl.ScanImageType = 0;
                    _this.scanCtrl.SpecialDealJpg = false;
                    _this.scanCtrl.ShowSelectSource = false;
                    _this.scanCtrl.SessionId = '';
                    var ip = window.location.host;
                    var index = ip.indexOf(':');
                    _this.scanCtrl.ServerIp = index >= 0 ? ip.substring(0, index) : ip;

                    try {
                        _this.scanCtrl.scan();
                    } catch (e) {
                        console.error(e);
                        Artery.notice.error({
                            title: '提示信息',
                            desc: '连接扫描仪时出现异常，请刷新页面再重试'
                        });
                    }
                },
                scanInCommon: function () {
                    var _this = this;
                    // _this.$refs.loadingModel.open();
                    $.ajax({
                        url: _this.url.scanControlUrl,
                        data: {
                            jbxxbh: _this.selectedBh,
                            authCode: _this.authCode,
                            userid: _this.userId,
                            socketKey: _this.socketKey,
                            apiUrl: _this.url.scanUploadUrl,
                            useHeader: false
                        },
                        success: function (data, status, req) {
                            console.log(data);
                        },
                        error: function (req, status, exp) {
                            console.error(status + exp);
                            Artery.notice.error({
                                title: '提示信息',
                                desc: "连接扫描仪时出现异常，请检查扫描仪驱动是否安装启动"
                            });
                        },
                        complete: function (xhr, status) {
                            _this.$refs.loadingModel.close();
                        }
                    });
                },
                // 调起打印机，获取流信息
                scanBenTu: function () {
                    var _this = this;
                    var param = 'format=.png&src=Automatic+Document+Feeder&mode=Color&dpi=300&doctype=A4&opt=0&pages=0&device=&savePath=&saveBarcodePath=&dodetect=0&ip=156.1.88.50&model=CM7115';
                    var requestUrl = _this.url.scanBenTuControlUrl + '/scan';
                    $.ajax({
                        type: 'GET',
                        url: requestUrl,
                        dataType: "json",   //返回格式为json
                        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
                        data: param,
                        success: function (result) {
                            console.log(result);//打印服务端返回的数据(调试用)
                            if (result.resultCode == 0) {
                                var doc_array = result.docs;
                                for (var i = 0; i < doc_array.length; i++) {
                                    // 获取数据，可以进行后续处理
                                    _this.getStreamByDocId(doc_array[i].docid); //获取扫描图像数据至浏览器
                                }
                            }
                        },
                        error: function (req, status, exp) {
                            console.error(status + exp);
                            Artery.notice.error({
                                title: '提示信息',
                                desc: "连接扫描仪时出现异常，请检查扫描仪驱动是否安装启动"
                            });
                        },
                        complete: function (xhr, status) {
                            _this.$refs.loadingModel.close();
                        }
                    });
                },
                // 据获DocId取数据Blob流
                getStreamByDocId: function (docid) {
                    var _this = this;
                    if (docid <= 0) {
                        console.error("docid not valid");
                    }

                    var url = _this.url.scanBenTuControlUrl + "/getimage?docid=" + docid;
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    // xhr.responseType = 'arraybuffer'; //设置返回响应数据的类型
                    xhr.responseType = 'blob';
                    xhr.setRequestHeader('Accept', 'image/png');
                    xhr.onload = function () {
                        if (this.status === 200) {
                           /* console.log(this.response);
                            var tp = xhr.getResponseHeader('Content-Type');
                            console.log(tp);
                            var blob = new Blob([this.response], {type: tp});
                            _this.uploadScanFile(blob);*/
                            console.log(xhr.response);
                            var blob = xhr.response;
                            var pngFile= new File([blob], _this.uuid() + '.png', { type: 'image/png' });
                            console.log(pngFile);
                            _this.uploadScanFile2(pngFile);
                        } else {
                            console.error("调用后端服务上传接口出差")
                        }
                    }
                    xhr.send();
                },
                // 上传服务器
                uploadScanFile: function (data) {
                    // this.response.filename
                    var _this = this;
                    var xhr = new XMLHttpRequest();
                    var url = _this.url.scanUploadUrl + '/bentu';
                    xhr.open('POST', url, true);
                    xhr.responseType = 'json'; //设置返回响应数据的类型
                    xhr.onload = function () {
                        if (this.status === 200) {
                            console.log(this.response);
                        }
                    }
                    // var objFile = $("#tempFile").get(0).files[0];
                    var fd = new FormData();
                    fd.append("file", data, Artery.uuid() + '.png');
                    fd.append("jbxxbh", this.selectedBh);
                    fd.append("authCode", this.authCode);
                    fd.append("userid", this.userId);
                    fd.append("socketKey", this.socketKey);
                    xhr.send(fd);
                },
                // 上传服务器
                uploadScanFile2: function (data) {
                    var _this = this;
                    var fd2 = new FormData();
                    fd2.append('file', data);

                    // post request server
                    Artery.ajax.post(_this.url.updaloadSpd + _this.selectedBh, fd2)
                        .then(function (result) {
                            _this.handleUploadSuccess(result.data, data,'png');
                        })
                        .catch(function (error) {
                            if (error.status === 401){
                                Artery.notice.error({
                                    title: '提交异常',
                                    desc: '登录已经失效，请重新登录后提交'
                                });
                            }else {
                                Artery.notice.error({
                                    title: '提交异常',
                                    desc: error
                                });
                            }
                        });
                },

                // 检查奔图浏览器
                checkBentu: function () {
                    var b = false;
                    $.ajax({
                        type: 'GET',
                        url: this.url.scanBenTuControlUrl + '/get_device_list',
                        dataType: "json",   //返回格式为json
                        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
                        success: function (result) {
                            // var status = "\nStatus: "+result.resultCode+"\n"+result.msg;
                            if (parseInt(result.resultCode) == 0) {
                                b = true;
                            } else {
                                b = false;
                            }
                        },
                        error: function () {
                            console.log("An error occurred: get_device_list");
                            b = false;
                        }
                    });
                    return b;
                },
                // 检查奔图浏览器
                checkBentu2: function () {
                    var b = false;
                    $.ajax({
                        type: 'GET',
                        url: this.url.scanBenTuControlUrl + '/get_device_list2',
                        dataType: "json",   //返回格式为json
                        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
                        success: function (result) {d
                            if (parseInt(result.resultCode) == 0) {
                                b = true;
                            } else {
                                b = false;
                            }
                        },
                        error: function () {
                            console.log("An error occurred: get_device_list2");
                            b = false;
                        }
                    });
                    return b;
                },

                // 控件提交后，文件扫描完成，执行提交
                onScan: function (file) {
                    var _this = this;
                    _this.scanList.push(file);
                    if (window.scanCtrl.HasMoreFile) {
                        window.scanCtrl.Upload(_this.url.scanUploadUrl, 'jbxxbh=' + _this.selectedBh +
                            '&authCode=' + _this.authCode + '&userid=' + _this.userId + '&socketKey=' + _this.socketKey);
                    }
                },
                // 单张图片上传结束
                onUploadOver: function () {
                },
                // 所有图片上传结束
                onScanOver: function () {
                    var _this = this;
                    window.scanCtrl.Terminated = true;
                    if (_this.scanList.length === 0) {
                        Artery.notice.info({
                            title: '扫描取消'
                        });
                    }
                },
                generateScoketKey: function () {
                    // 当前毫秒值加6位随机数
                    var randomNum = "";
                    for (var i = 0; i < 6; i++) {
                        randomNum += Math.floor(Math.random() * 10);
                    }
                    this.socketKey = new Date().getTime() + randomNum;
                },
                initSocketIO: function () {
                    var baseWebSocketUrl = _config.dirProjectPath.replace('http', 'ws');
                    if (!this.webSocket || !this.webSocket.readyState || this.webSocket.readyState > 1) {
                        this.generateScoketKey();
                        try {
                            var webSocket = new WebSocket(baseWebSocketUrl + 'socket/' + this.socketKey);
                            webSocket.onopen = this.socketOnOpen;
                            webSocket.onclose = this.socketOnClose;
                            webSocket.onerror = this.socketOnError;
                            webSocket.onmessage = this.socketOnMessage;
                            this.webSocket = webSocket;
                        } catch (e) {
                            console.error(e);
                        }
                    }
                },
                socketOnOpen: function (event) {
                    console.log('Socket opened.');
                },
                socketOnClose: function (event) {
                    console.log('Socket closed. Try reconnect.');
                },
                socketOnError: function (event) {
                    console.error(event);
                },
                socketOnMessage: function (event) {
                    var message = event.data;
                    // console.log('Socket receive data:' + message);
                    var data = JSON.parse(message);
                    this.handleUploadSuccess(data);
                }
            },
            mounted: function () {

            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 --- 反馈进度
                fdEventBus.$on('appCxsqFkjd', this.modalfkjd);
                // 调用多少个弹窗 就写对应的这个接收 --- 查询流程
                fdEventBus.$on('appCxsqCxlc', this.modalcxlc);
                // 调用多少个弹窗 就写对应的这个接收 --- 提交申请
                fdEventBus.$on('appCxsqTjsq', this.modaltjsq);
                // 调用多少个弹窗 就写对应的这个接收 --- 提交审核
                fdEventBus.$on('appCxsqTjsh', this.modaltjsh);
                // 调用多少个弹窗 就写对应的这个接收 --- 删除
                fdEventBus.$on('appCxsqRemove', this.modalremove);
                // 调用多少个弹窗 就写对应的这个接收 --- 审核不通过
                fdEventBus.$on('appCxsqShbtg', this.modashbtg);
                // 调用多少个弹窗 就写对应的这个接收 --- 查询
                fdEventBus.$on('appCxsqCx', this.modalcx);

                // 扫描控件
                window.scanVm = this;
            },
            // 销毁弹窗
            destoried: function () {
                // 销毁 反馈进度
                fdEventBus.$off('appCxsqFkjd', this.modalfkjd);
                // 销毁 查询流程
                fdEventBus.$off('appCxsqTjsq', this.modalcxlc);
                // 销毁 提交申请
                fdEventBus.$off('appCxsqTjsq', this.modaltjsq);
                // 销毁 提交审核
                fdEventBus.$off('appCxsqTjsh', this.modaltjsh);
                // 销毁 --- 删除
                fdEventBus.$off('appCxsqRemove', this.modalremove);
                // 销毁 --- 审核不通过
                fdEventBus.$off('appCxsqShbtg', this.modashbtg);
                // 销毁 ---  查询
                fdEventBus.$off('appCxsqCx', this.modalcx);
            }
        }
    });
