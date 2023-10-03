define(['fdGlobal', 'config', 'fdComponent2', 'fdEventBus'],
    function (fdGlobal, config, fdComponent2, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    type: '',
                    form: {
                        fileList: [],
                        wsFile: [],
                        zsFile: []
                    },
                    syncJcsjUrl: config.url.frame.syncJcsjUrl,
                    // 判断是证书还是文书的type：1是证书2是文书
                    zsOrwsType: 1
                }
            },
            methods: {
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 基础数据弹窗
                 */
                modalScjcsj: function (val) {
                    // 判断是上传基础数据的弹框还是上传印模的弹框
                    this.type = val._data.type;
                    this.zsOrwsType = val.zsOrwsType;
                    if (this.type === '1') {
                        //打开上传基础数据弹窗
                        this.$refs["modalUploadJcsj"].open();
                        this.form.wsFile = [];
                        this.form.zsFile = [];
                    } else {
                        //打开上传印模弹窗
                        this.$refs["modalUploadYm"].open();
                        this.form.fileList = [];
                    }
                }, //关闭印模弹窗
                closeModalUploadYm: function () {
                    this.$refs["upload"].clearFiles();
                    this.form.fileList = [];
                    this.$refs["modalUploadYm"].close();
                },
                // 提交印模
                submitModalYm: function () {
                    if (this.form.fileList.length === 0) {
                        return;
                    }
                    this.uploadFile(this.form.fileList);
                },
                
                // 上传印模
                beforeFileList: function (file) {
                    if (this.form.fileList.length > 0) {
                        Artery.message.error("只允许上传一个文件！");
                        return false;
                    }
                    if (file.size > 100 << 20) {
                        Artery.message.error("文件不允许超出100MB！");
                        return false;
                    }
                    var hz=file.name.substr(file.name.lastIndexOf('.'))

                    if (hz != ".PNG" && hz != ".png") {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '上传的印模只能为PNG格式'
                            },
                            interval: 900
                        });
                        return false
                    }
                    this.form.fileList.push(file);
                    return false;
                },
                
                // 删除上传的印模
                deleteFileYm: function (index) {
                    var _this = this;
                    _this.form.fileList.splice(index, 1)
                },
                
                //关闭基础数据弹窗
                closeModalUploadJcsj: function () {
                    if (this.zsOrwsType == 3) {
                        this.$refs["uploadZs"].clearFiles();
                    } else {
                        this.$refs["uploadWs"].clearFiles();
                    }
                    this.form.wsFile = [];
                    this.form.zsFile = [];
                    this.$refs["modalUploadJcsj"].close();
                },
                // 提交基础数据
                submitModalJcsj: function () {
                    //20200508 - 需求变更：证书 文书可以分别上传
                    /*if (this.form.wsFile.length === 0 || this.form.zsFile.length === 0) {
                        return;
                    }*/
                    
                    if (this.form.wsFile.concat(this.form.zsFile).length === 0) {
                        return;
                    }
                    this.uploadFile(this.form.wsFile.concat(this.form.zsFile));
                },
                
                // 上传文书
                beforeWs: function (file) {
                    if (this.form.wsFile.length > 0) {
                        Artery.message.error("只允许上传一个文件！");
                        return false;
                    }
                    if (file.size > 10 * 1024 * 1024) {
                        Artery.message.error("文件不允许超出10MB！");
                        return false;
                    }
                    var hz=file.name.substr(file.name.lastIndexOf('.'))
                    if (hz != ".DOCX" && hz != ".docx"
                    && hz != ".DOC" && hz != ".doc") {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '上传的文书模板只能为DOC或者DOCX格式'
                            },
                            interval: 900
                        });
                        return false
                    }
                    this.form.wsFile.push(file);
                    return false;
                },
                // 上传证书
                beforeZs: function (file) {
                    if (this.form.zsFile.length > 0) {
                        Artery.message.error("只允许上传一个文件！");
                        return false;
                    }
                    // 如果文件的大小大于10M，不允许上传
                    if (file.size > 10 * 1024 * 1024) {
                        Artery.message.error("文件不允许超出10MB！");
                        return false;
                    }
                    var hz=file.name.substr(file.name.lastIndexOf('.'))

                    if (hz != ".PFX" && hz != ".pfx"
                        && hz != ".CER" && hz != ".cer") {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '上传的文书模板只能为PFX或者CER格式'
                            },
                            interval: 900
                        });
                        return false
                    }
                    this.form.zsFile.push(file);
                    return false;
                },
                // 删除文书
                deleteFileWs: function (index) {
                    var _this = this;
                    _this.form.wsFile.splice(index, 1)
                },
                // 删除证书
                deleteFileZs: function (index) {
                    var _this = this;
                    _this.form.zsFile.splice(index, 1)
                },
                
                constructFormData: function (files) {
                    var formData = new FormData();
                    for (var index = 0; index < files.length; index++) {
                        formData.append("file", files[index])
                    }
                    return formData
                },
                
                uploadFile: function (file) {
                    var _this = this;
                    var _type = this.type === '2' ? '02' : _this.zsOrwsType
                    Artery.ajax.post(config.url.frame.jcsjUploadUrl + _type, this.constructFormData(file))
                        .then(function (result) {
                            if (result) {
                                _this.handleSuccess();
                            } else {
                                _this.handleError();
                            }
                        });
                },
                handleSuccess: function () {
                    if (this.type === '1') {
                        this.closeModalUploadJcsj();
                    } else {
                        this.closeModalUploadYm();
                    }
                    $.alert({
                        type: 'success',
                        info: {
                            success: "上传文件成功！"
                        },
                        interval: 1000
                    });
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "backScjcsj",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                    //this.$refs.shTabel.reloadData();
                },
                
                handleError: function () {
                    if (this.type === '1') {
                        this.closeModalUploadJcsj();
                    } else {
                        this.closeModalUploadYm();
                    }
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: "上传文件失败！"
                        },
                        interval: 1000
                    });
                },
                // 同步基础数据弹窗
                modalTbjcsj: function () {
                    this.$refs["modalTbjcsj"].open();
                },
                modalNoTbjcsj: function () {
                    this.$refs["modalNoTbjcsj"].open();
                },
                // 同步基础数据弹窗 -- 点击确定
                clickTbjcsj: function () {
                    var _this = this;
                    Artery.ajax.get(_this.syncJcsjUrl).then(function (result) {
                        if (result.success) {
                            Artery.message.success(result.message);
                            var dataBj = {
                                flag: "backScjcsj",
                                _data: {}
                            };
                            var _data = JSON.stringify(dataBj);
                            window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                            // _this.init();
                        } else {
                            Artery.message.error(result.message);
                        }
                    });
                    this.$refs["modalTbjcsj"].close();
                },
                clickNoTbjcsj: function () {
                    this.$refs["modalNoTbjcsj"].close();
                }
                
                
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appScjcsj', this.modalScjcsj);
                fdEventBus.$on('appTbjcsj', this.modalTbjcsj);
                fdEventBus.$on('appNoTbjcsj', this.modalNoTbjcsj);
                
            },
            // 销毁弹窗
            destoried: function () {
                // 销毁
                fdEventBus.$off('appScjcsj', this.modalScjcsj);
                fdEventBus.$off('appTbjcsj', this.modalTbjcsj);
                fdEventBus.$off('appNoTbjcsj', this.modalNoTbjcsj);
            }
        }
    });
