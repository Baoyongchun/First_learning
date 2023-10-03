(function () {
    // 这句必须，引入httpVueLoader的；
    // Vue.use(httpVueLoader);
    var vue = new Vue({
        el: '#app',
        data() {
            return {
                activeName: 'first',
                total: 0,
                current: 0,
                ipAddress: '',
                connectType: '',
                connectOptions: [{
                    value: 'USB连接',
                    label: 'USB连接'
                },{
                    value: '网络连接',
                    label: '网络连接'
                }],
                // 扫描仪品牌
                brandValue: '奔图',
                brandOptions: [{
                    value: '奔图',
                    label: '奔图',
                    disabled: false,
                    scanOptions:[{
                        value: 'M7100DN',
                        label: 'M7100DN'
                    },
                        {
                            value: 'M7165DN',
                            label: 'M7165DN'
                        },
                        {
                            value: 'BM5150ADN',
                            label: 'BM5150ADN'
                        },
                        {
                            value: 'CM1150ADN',
                            label: 'CM1150ADN'
                        },
                        {
                            value: 'M7185DN',
                            label: 'M7185DN'
                        },
                        {
                            value: 'CM1155ADN',
                            label: 'CM1155ADN'
                        },
                        {
                            value: 'BM5155ADN',
                            label: 'BM5155ADN'
                        },
                        {
                            value: 'CM2270ADN',
                            label: 'CM2270ADN'
                        },
                        {
                            value: 'CM9505DN',
                            label: 'CM9505DN'
                        },
                        {
                            value: 'DS-230',
                            label: 'DS-230'
                        },
                        {
                            value: 'M7107DN',
                            label: 'M7107DN'
                        },
                        {
                            value: 'CM9707DN',
                            label: 'CM9707DN'
                        },
                        {
                            value: 'M9105DN',
                            label: 'M9105DN'
                        },
                        {
                            value: 'CM9105DN',
                            label: 'CM9105DN'
                        },
                        {
                            value: 'CM9705DN',
                            label: 'CM9705DN'
                        },
                        {
                            value: 'CM5055DN',
                            label: 'CM5055DN'
                        },
                        {
                            value: 'CM7000FDN',
                            label: 'CM7000FDN'
                        },
                        {
                            value: 'CM7115',
                            label: 'CM7115'
                        },
                        {
                            value: 'CM7000',
                            label: 'CM7000'
                        },
                        {
                            value: 'CM8505DN',
                            label: 'CM8505DN'
                        },
                        {
                            value: 'M9005DN',
                            label: 'M9005DN'
                        },
                        {
                            value: 'DS-329',
                            label: 'DS-329'
                        },
                        {
                            value: 'DS-339',
                            label: 'DS-339'
                        },
                        {
                            value: 'DS-320',
                            label: 'DS-320'
                        },
                        {
                            value: 'DS-330',
                            label: 'DS-330'
                        },
                        {
                            value: 'DS-370',
                            label: 'DS-370'
                        },
                        {
                            value: 'DS-327',
                            label: 'DS-327'
                        },
                        {
                            value: 'DS-337',
                            label: 'DS-337'
                        },
                        {
                            value: 'DS-377',
                            label: 'DS-377'
                        }],
                }, {
                    value: '佳能',
                    label: '佳能',
                    disabled: false,
                    scanOptions:[{
                        value: 'M3240N',
                        label: 'M3240N'
                    },{
                        value: 'M3260N',
                        label: 'M3260N'
                    }]
                }, {
                    value: '汉王',
                    label: '汉王',
                    disabled: false,
                    scanOptions:[{
                        value: 'HWA230U',
                        label: 'HWA230U'
                    }]
                }],
                // 扫描仪型号
                modelValue: '',
                modelOptions:[],
                // 图片list
                files: [],
                urlPre: '',
                dialogImageUrl: '',
                dialogVisible: false,
                // 预览图片src
                srcContent: '',
                selectedBh:'',
                imgCount: 0,
                // 图片旋转的度数
                deg: 0,
                // 图片放大缩小的值
                scaleNum: 1,
                // 图片的高度
                imgh: '',
                // 第一张一张图片
                img: {
                    imgfirst: false,
                    imglast: false,
                    isShow: false
                },
                currPerviewIndex: '',
                localIpPort: '',
                getPng: '',
                btnShow: true,
                // 奔图扫描仪
                scanBenTuControlUrl: 'http://127.0.0.1:3883',
                userScan: {},
                // 本地扫描仪服务地址
                scanControlUrl: 'http://127.0.0.1:7000',
                //佳能web端扫描仪地址
                canonWebScan: new WebScan({
                    url:'http://localhost:18989/WebScan',
                    wsUrl:'http://localhost:28989/',
                    licence:'X4ySyskvh6todHOVxQ4l6g==' //测试用授权码
                }),
                // 汉王扫描仪
                hwWebScan: {
                    url: 'ws://localhost:18596',
                    g_splitDataFlag: "$@$",
                    g_splitCodeFlag: "@HWStateInfo@",
                    base64_head: "data:image/png;base64,",
                    command: {
                        command: "scan",
                        resolution: 150, //分辨率  常用值为 200 300(有识别要求)
                        duplex: 2, //0单面  1双面  2跳过空白页  3单面(背面)
                        pixeltype: 1, //0黑白  1灰度  2彩色
                        rotation: 4, //旋转角度  0不旋转  1旋转90度  2旋转180度  3旋转270度  4自动识别文本方向(如果能保证放纸时的方向一致，不要设置自动识别)
                        jpeg_quality: 75, // jpg文件压缩质量 范围10-100
                        typefile: 0
                    }
                },
                jbxxZt: 0,
                imgOrder: '',
                tabIndex: '',
                isHt: '',
                fjtableData:[],
                fileNameList:[],
                errMsgList:[],
                jbxxSqrq:null,
                wjxxSqrq:null,
                cleanBtnShow:true,
                messageContent:""
            }
        },
        methods: {
            cleanFile:function(){
                var _this=this;
                let url = _this.urlPre + 'api/v1/cxsq/deleteSpdBatch/'
                Artery.ajax.delete(url + _this.selectedBh)
                    .then(function (result) {
                        $('.abc')
                            .addClass('fd-hide');
                        _this.refreshFiles();
                    })
            },
            openCleanModal:function(){
                var _this = this;
                if (_this.files.length === 0) {
                    _this.showLogWarning('审批单不存在');
                    return;
                }
                _this.messageContent="确认清空审批单？";
                $('#pop-wrap-commit2')
                    .removeClass('fd-hide');
            },
            getFjtableData(){
                var _this = this;
                var _serverData =  {
                    cbh: this.selectedBh,
                };
                $.ajax({
                    method: "post",
                    url:  this.urlPre +'/api/spd/querySpdFjList',
                    data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code === 1) {
                            _this.fileNameList =[];
                            _this.fjtableData =data.data;
                            if(_this.fjtableData.length>0){
                                $.each(_this.fjtableData, function (index, item) {
                                    _this.fileNameList.push(item.wjmc);
                                });
                            }
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        // fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            delFj(index, row){
                var _this = this;
                var _serverData =  {
                    cId: row.cId,
                };
                $.ajax({
                    method: "post",
                    url:  this.urlPre +'/api/spd/delFj',
                    data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code === 1) {
                            if(0==data.data){
                                _this.showLogError('审批单不存在');
                            }else{
                                // _this.getFjtableData();
                            }
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            handleUploadFj(file){
                var _this = this;
                if(_this.jbxxZt == 2){
                    _this.showLogWarning('申请单已提交审核，请不要再次上传申请单');
                    return;
                }
                if(_this.fileNameList.length>0){
                    var a = true;
                    $.each(_this.fileNameList, function (index, item) {
                        if(item==file.name){
                            _this.showLogError(file.name+'文件已存在，请勿重复上传');
                            a = false;
                        }
                    });
                   if(!a){
                       return a;
                   }
                }
                _this.$refs.loadingModel.open();

                Artery.ajax.interceptors.request.use(function (config) {
                    config.timeout = 60000;
                    return config;
                });
                let uploadUrl = _this.urlPre + '/api/spd/uploadFj/'
                Artery.ajax.post(uploadUrl + _this.selectedBh, _this.getRequestData(file))
                    .then(function (result) {
                        _this.handleUploadFjSuccess(result.data, file);
                    })
                    .catch(function (error) {
                        if (error.status === 401){
                            _this.showLogError('登录已经失效，请重新登录后提交');
                        }else {
                            _this.showLogError(error);
                        }
                    });
                return false;
            },
            handleTabClick(tab, event) {
                this.tabIndex = tab.index;
                if( tab.index==0){
                    this.cleanBtnShow=true;
                }else{
                    this.cleanBtnShow=false;
                }
            },
            handleUploadSPB(file){
                var _this = this;
                if(_this.jbxxZt == 2){
                    _this.showLogError('申请单已提交审核，请不要再次上传申请单');
                    return;
                }
                var accept = ['png','pdf','jpeg','jpg','tiff','tif'];
                var fileName = file.name;
                var suffix = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
                if (!accept.includes(suffix)) {
                    _this.showLogError('请上传png/jpg/jpeg/tiff/tif或pdf格式的文件');
                    return;
                }
                // check file size must less than 3M
               /* var size = file.size;
                if (suffix == "jpg" && size / Math.pow(1024, 2) > 3) {
                    Artery.notice.error({
                        title: '提交异常',
                        desc: '单个JPG文件大小不可超过3M'
                    });
                    return;
                }
                if (suffix == "jpeg" && size / Math.pow(1024, 2) > 3) {
                    Artery.notice.error({
                        title: '提交异常',
                        desc: '单个JPEG文件大小不可超过3M'
                    });
                    return;
                }
                if (suffix == "pdf" && size / Math.pow(1024, 2) > 50) {
                    Artery.notice.error({
                        title: '提交异常',
                        desc: '单个PDF文件大小不可超过50M'
                    });
                    return;
                }
                if (suffix == "png" && size / Math.pow(1024, 2) > 3) {
                    Artery.notice.error({
                        title: '提交异常',
                        desc: '单个PNG文件大小不可超过3M'
                    });
                    return;
                }*/

                _this.$refs.loadingModel.open();

                Artery.ajax.interceptors.request.use(function (config) {
                    config.timeout = 60000;
                    return config;
                });
                let uploadUrl = _this.urlPre + 'api/v1/cxsq/uploadSpd/'
                Artery.ajax.post(uploadUrl + _this.selectedBh, _this.getRequestData(file))
                    .then(function (result) {
                        _this.handleUploadSuccess(result, file,suffix);
                    })
                    .catch(function (error) {
                        if (error.status === 401){
                            _this.showLogError('登录已经失效，请重新登录后提交');
                        }else {
                            _this.showLogError(error);
                        }
                    });
                return false;
            },
            /**
             *  * @Author juxiang
             *    @description 组装请求数据
             */
            getRequestData (file) {
                var formData = new FormData();
                formData.append('file', file);
                return formData;
            },
            /**
             * @Author juxiang
             * @param result 上传成功后台的响应信息
             * @param file 上传的文件
             */
            handleUploadSuccess: function (result, file,suffix) {
                var _this = this;
                if (result.success) {
                    let errMsgArr = result.data.filter(item => item.errorMsg > '').map(item => item.errorMsg);
                    if (errMsgArr.length > 1) {
                        this.errMsgList = errMsgArr
                        $("#errTip").removeClass('fd-hide');
                    } else if (errMsgArr.length == 1) {
                        _this.showLogError(errMsgArr[0]);
                    } else
                    if ("png" == suffix||"jpg" == suffix||"jpeg" == suffix) {
                        _this.showLogSuccess(result.data[0].cWjmc + '上传成功');
                    }else if("pdf" == suffix){
                        _this.showLogSuccess(file.name + '上传成功');
                    }
                    _this.$refs.loadingModel.close();
                } else {
                    _this.showLogError(result.message);
                    _this.$refs.loadingModel.close();
                }
                _this.refreshFiles();
            },
            handleUploadFjSuccess: function (result, file) {
                var _this = this;
                if (result.success) {
                    _this.showLogSuccess(file.name + '上传成功');
                    // _this.getFjtableData();
                } else {
                    _this.showLogError(result.message);
                }
                _this.$refs.loadingModel.close();
            },
            // 扫描仪品牌回调
            brandChange(val) {
                this.brandValue = val
                //扫描仪型号下拉
                for (let i = 0; i < this.brandOptions.length; i++) {
                    if (val == this.brandOptions[i].value) {
                        this.modelOptions = this.brandOptions[i].scanOptions
                        if (this.modelOptions.map(item => item.value).indexOf(this.modelValue) == -1) {
                            this.modelValue = ''
                        }
                    }
                }
            },
            // 扫描仪型号回调
            modelChange(val) {
                this.modelValue = val
            },
            // 扫描仪连接方式回调
            connentChange(val) {
                var _this = this
                this.connectType = val
                _this.brandValue = ''
                _this.modelValue = ''
                //网络连接没有汉王
                _this.brandOptions.forEach(item => {
                    if (item.value == '汉王') {
                        item.disabled = val && val.indexOf('网络') > -1;
                    }
                })
            },

            // 编辑
            saveScan() {
                var _this = this;
                _this.userScan.scanIp = _this.ipAddress;
                _this.userScan.scanMode = _this.modelValue;
                _this.userScan.scanMake = _this.brandValue;
                _this.userScan.remark = _this.connectType;
                let saveUrl = _this.urlPre + 'api/tUserScan/update'
                $.ajax({
                    method: 'POST',
                    url: saveUrl,
                    contentType: 'application/json',
                    data: JSON.stringify(_this.userScan),
                    success: function (result) {
                        if (result.success) {
                            _this.showLogSuccess('保存成功');
                        } else {
                            Artery.notice.error({
                                title: '保存失败',
                                desc: result.message || ""
                            });
                            _this.showLogError('保存失败');
                        }
                    }
                });

            },
            getLocalPath(isAbsUrl) {
                var curWwwPath = window.location.href;
                var pathName = window.location.pathname;
                var pos = curWwwPath.lastIndexOf(pathName);
                var localhostPath = curWwwPath.substring(0, pos);
                return isAbsUrl ? (localhostPath + '/') : '';
            },
            getParamsFun() {
                var params = {};
                var winParamStr = window.location.search.substring(1);

                // 单个获取参数函数
                function getParam(key) {
                    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
                    var r = winParamStr.match(reg);
                    if (r === null) {
                        return '';
                    }
                    return r[2];
                }
                this.selectedBh = getParam('cBh');
                // 给全局变量案件赋值
                params.cBh = getParam('cBh');
                params.cxrLx = getParam('cxrLx');
                params.zt = getParam('zt');
                this.isHt = getParam("isHt");
                return params;
            },
            deleteSpdInTable (index) {
                this.deleteFile(index, 'table');
            },
            /** @Author juxiang
             * 在预览弹框删除审批单
             */
            deleteSpdInModal: function () {
                this.deleteFile(this.currPerviewIndex, 'modal');
            },
            /**
             *  * @Author juxiang
             *    @description 删除文件
             */
            deleteFile (index, channel) {
                var _this = this;
                let delurl = _this.urlPre + 'api/v1/cxsq/deleteSpd/';
                Artery.ajax.delete(delurl + _this.selectedBh, {
                    params: {
                        wjid: _this.files[index].id,
                        cclj: _this.files[index].cclj
                    }
                }).then(function (data) {
                    if (data.success) {
                        // 删除已上传列表
                        _this.files.splice(index, 1);
                        _this.refreshFiles();
                        if(_this.current > 0){
                            _this. current --;
                        }
                        if (channel === 'modal') {
                            _this.refreshSpdPreviewModal();
                        }
                        _this.showLogSuccess('删除成功');
                    } else {
                        Artery.notice.error({
                            title: '删除失败',
                            desc: data.message || ""
                        });
                        _this.showLogError('删除失败');
                    }
                });
            },
            /** @Author juxiang
             * tab切换按钮 划过显示
             */
            /** @Author juxiang
             * 预览框删除的要刷新下
             * 刷新规则:
             * 1. 没有图片, 关闭预览框
             * 2. 上翻一页
             * 3. 下翻一页
             */
            refreshSpdPreviewModal: function () {
                var _this = this;
                if (_this.files.length === 0) {
                    _this.dialogVisible = false;
                } else if (_this.currPerviewIndex > 0) {
                    _this.previewTab('pre');
                } else {
                    _this.currPerviewIndex--;
                    _this.previewTab('next');
                }
            },
            tabisShow() {
                var _this = this;
                // 当只有一张图片的时候 切换按钮隐藏
                if (_this.files.length === 1) {
                    _this.img.isShow = false;
                } else {
                    _this.img.isShow = true;
                }
            },
            /** @Author juxiang
             * tab切换按钮 离开隐藏
             */
            tabisHide () {
                var _this = this;
                // 当只有一张图片的时候 切换按钮隐藏
                if (_this.img.isShow) {
                    _this.img.isShow = false;
                }
            },
            /** @Author juxiang
             * 打开审批单预览弹窗
             * @param index
             */
            openModalPreview (index,order) {
                var _this = this;
                _this.scaleNum = 1;
                _this.deg = 0;
                _this.imgOrder = order;
                $('.fd-picture-obj').css({
                    'transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-webkit-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-ms-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg)  scale(' + this.scaleNum + ')'
                });

                // 图片的高度
                // var _h = $(document).height() * 0.7;
                _this.currPerviewIndex = index;
                _this.srcContent = _this.getPng + _this.files[index].id;
                _this.dialogVisible = true;

                var windowHeight = document.body.clientHeight;
                var imgHeight = 650;

                _this.imgh = imgHeight + 'px';
                var img = new Image();
                img.src = _this.getPng + _this.files[index].id;
                img.onload = function () {
                    // 图片加载时 调用自动缩放；
                    if(order == 1){
                        _this.autoSize(img, 660, 660,order);
                    }else {
                        _this.autoSize(img, 660, 660,order);
                    }
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
             * 刷新已上传或扫描申请单
             */
            refreshFiles (){
                var _this = this;
                let yscUrl = _this.urlPre + 'api/v1/cxsq/spd/';
                Artery.ajax.get(yscUrl + _this.selectedBh + '?v=' + new Date().getTime())
                    .then(function (result) {
                        // var data = result.data;
                        var data = result;
                        if (data.length > 0) {
                            _this.total = data[0].pageNumbers;
                            _this.current = data.length;
                            // _this.addUploadInfo();
                            _this.files = [];
                            for (var index = 0; index < data.length; index++) {
                                _this.files.push({
                                    id: data[index].cId,
                                    wjmc: data[index].cWjmc,
                                    cclj: data[index].cCclj,
                                    srcContent: _this.getPng + data[index].cId,
                                    order: data[index].nOrder
                                });
                                _this.wjxxSqrq=data[index].sqrq;
                            }
                        }else{
                            _this.current=0
                            _this.total =0;
                            _this.files = [];
                            _this.wjxxSqrq=null;
                        }
                    });
            },
            /** @Author juxiang
             * tab切换按钮 图片旋转
             */
            previewRotateZuo () {
                var _this = this;
                // 图片旋转90deg
                _this.deg -= 90;
                if (_this.deg <= -360) {
                    _this.deg = 0;
                }
                $('.fd-picture-obj').css({
                    'transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-webkit-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-ms-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')'
                });
            },
            /** @Author juxiang
             * tab切换按钮 划过显示
             */
            previewRotateYou () {
                var _this = this;
                // 图片旋转90deg
                _this.deg += 90;
                // 当图片旋转到270deg时 旋转度数置0
                if (_this.deg >= 360) {
                    _this.deg = 0;
                }
                $('.fd-picture-obj').css({
                    'transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-webkit-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-ms-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')'
                });
            },
            /** @Author juxiang
             * tab切换按钮 图片切换--- 上一张 下一张
             * @param val
             */
            previewTab (val) {
                var _this = this;
                // 图片的高度
                _this.img.imgfirst = false;
                _this.img.imglast = false;
                // 旋转度数 为0；
                _this.deg = 0;
                $('.fd-picture-obj').css({
                    'transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-webkit-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-ms-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')'
                });
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
                img.onload = function () {
                    // 图片加载时 调用自动缩放
                    _this.autoSize(img, 660, 660);
                };
            },
            /** @Author juxiang
             * @description 点击图片放大或缩小
             * @param type 判断是放大还是缩小
             */
            clickcaleImg: function (code) {
                if (code === 'big') {
                    this.scaleNum = this.scaleNum + 0.2;
                    this.currentScale += 0.2;
                } else {
                    this.scaleNum = this.scaleNum - 0.2;
                    this.currentScale -= 0.2;
                    if (this.scaleNum < 0) {
                        this.scaleNum = 0;
                    }
                }
                $('.fd-picture-obj').css({
                    'transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-webkit-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')',
                    '-ms-transform': 'translate(0%, 0%) rotate(' + this.deg + 'deg) scale(' + this.scaleNum + ')'
                });
            },
            /** juxiang
             * 图片等比例缩放
             * @param Img  传入的图片, maxWidth  最大宽度, maxHeight   最大高度；
             */
            autoSize: function (Img, maxWidth, maxHeight,order) {
                // 原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
                // 当图片比图片框小时不做任何改变
                var imgEle = $('.fd-picture-obj');
                // if(order == 1){
                   // imgEle.css({'transform':'rotate(-90deg)'});
                   imgEle.width(maxWidth).height(maxHeight);
                // }else {
                //     imgEle.width(maxWidth).height(maxHeight);
                // }
               /* // 原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
                // 原图片宽高比例 大于 图片框宽高比例
                if (maxWidth / maxHeight >= Img.width / Img.height) {
                    // imgEle.width(maxWidth).height(maxWidth * (Img.height / Img.width));
                    imgEle.width(850).height(600);
                } else {
                    // 原图片宽高比例 小于 图片框宽高比例
                    // imgEle.width(maxHeight * (Img.width / Img.height)).height(maxHeight);
                    imgEle.width(850).height(600);
                }*/
            },
            /**
             *  * @Author juxiang
             *    @description 提交申请弹窗
             */
            openModalTjsq: function () {
                var _this = this;
                var flag=true;
                if (_this.wjxxSqrq!=null ) {
                    var url = _this.urlPre + 'api/spd/getJbxxByCbh/' + _this.selectedBh;
                    $.ajax({
                        method: "get",
                        url: url,
                        async: false,
                        dataType: 'json',
                        success: function (data) {
                            if (_this.wjxxSqrq != data.data.dSqrq) {
                                flag=false;
                            }
                        },
                        error: function (data, textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                }
                if(!flag){
                    _this.messageContent="审批单信息有变更，请重新生成！";
                    $('#pop-wrap-commit2')
                        .removeClass('fd-hide');
                    return;
                }
                if (_this.files.length === 0) {
                    _this.showLogWarning('请上传审批表');
                    return;
                }
                if(_this.current !=  _this.total){
                    _this.showLogError('审批表还有未上传的信息');
                    return;
                }
                $('#pop-wrap-commit')
                    .removeClass('fd-hide');
            },
            submitCheckOk: function () {
                var _this = this;
                _this.$refs.loadingModel.open();
                // _this.$refs.modalTjsq.close();
                $('.fd-newip-pop-wrap')
                    .addClass('fd-hide');
                let tjshUrl = _this.urlPre + 'api/v1/cxsq/tjsh/';
                Artery.ajax.post(tjshUrl + _this.selectedBh,{
                    timeout: 5000
                }).then(function (data) {
                    // var data = result.data;
                    if (data.success) {
                        // _this.showLogSuccess('提交成功,1秒后页面自动关闭');
                        _this.jbxxZt = 2;
                        _this.btnShow = false;
                        //刷新列表，关闭页面
                        var dataBj = {
                            flag: "scspbOpen",
                            _data: {}
                        };
                        var _data = JSON.stringify(dataBj);
                        if(window.opener) {
                            if(window.opener.opener) {
                                window.opener.opener.postMessage(_data, '*');
                                window.opener.opener.parent.location.reload();
                            } else {
                                window.opener.postMessage(_data, '*');
                            }
                        }
                        setTimeout(function(){
                            window.close();
                        },1000);
                    } else {
                        Artery.notice.error({
                            title: '提交失败',
                            desc: data.message
                        });
                        _this.showLogError('提交失败'+data.message==""?'':(+","+data.message));
                    }
                    _this.$refs.loadingModel.close();
                })
                    .catch(function (error) {
                        _this.$refs.loadingModel.close();
                        if(typeof(error) != "undefined"){
                            if (error.status === 401){
                                _this.showLogError('登录已经失效，请重新登录后提交');
                            }else {
                                Artery.notice.error({
                                    title: 'error',
                                    desc: error.data
                                });
                                _this.showLogError(error.data);
                            }
                        }

                    });
            },
            /**
             * 获取用户信息
             */
            queryUserId () {
                var _this = this;
                let userUrl = _this.urlPre +  'api/tUserScan/userScan';
                $.ajax({
                    method: "get",
                    url: userUrl,
                    async: false,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code == 200 && data.data) {
                            _this.userId = data.data.userId;
                            _this.userScan = data.data;
                            _this.ipAddress = data.data.scanIp;
                            if(data.data.scanMake){
                                _this.brandValue = data.data.scanMake;
                            }
                            if(data.data.scanMode){
                                _this.modelValue = data.data.scanMode;
                            }
                            if(_this.userScan.remark){
                                _this.connectType = _this.userScan.remark;
                                //网络连接没有汉王
                                if (_this.userScan.remark && _this.userScan.remark.indexOf("网络") > -1) {
                                    //网络连接没有汉王
                                    _this.brandOptions.forEach(item => {
                                        if (item.value == '汉王') {
                                            item.disabled = true
                                        }
                                    })
                                    if (_this.userScan.scanMade && _this.userScan.scanMade.indexOf('汉王') > -1) {
                                        _this.brandValue = ''
                                        _this.modelValue = ''
                                    }
                                }
                            }
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },

            /**
             * 扫描上传入口
             */
            scanAndUploadSpd () {
                var _this = this;
                _this.initSocketIO();
                if(_this.jbxxZt == 2){
                    _this.showLogWarning('申请单已提交审核，请不要再次扫描');
                    return;
                }
                if(_this.connectType == '网络连接' && !_this.ipAddress){
                    _this.showLogWarning('请维护扫描仪IP信息，并保存！');
                    return;
                }
               /* if(_this.userScan.userIp != _this.userScan.currentIp){
                    Artery.notice.warning({
                        title: '用户电脑ip发生变化，请确认扫描仪ip和型号'
                    });
                    return;
                }*/
                // _this.queryUserId();
                let codeUrl = _this.urlPre + 'api/spd/files/authcode/';
                Artery.ajax.get(codeUrl,{
                    timeout: 5000
                }).then(function (result) {
                    if (result.success) {
                        _this.authCode = result.data;
                        // 判断是否连接奔图扫描仪
                        if (_this.brandValue == '奔图') {
                            let isBentu;
                            if(_this.connectType == '网络连接'){
                                isBentu = _this.checkBentu2();
                            }else {
                                isBentu = _this.checkBentu();
                            }
                            if (isBentu) {
                                _this.$refs.loadingModel.open();
                                _this.scanBenTu();
                            }
                        } else if (_this.brandValue == '佳能') {
                            // return;
                            // _this.scanInCommon();
                            //佳能扫描仪
                            _this.scanCanon();
                        } else if (_this.brandValue == '汉王') {
                            _this.scanHw()
                        } else {
                            _this.showLogWarning('不支持的扫描仪品牌');
                        }
                    }
                }).catch(function (err) {
                    _this.$refs.loadingModel.close();
                });
            },
            // 所有图片上传结束
            onScanOver () {
                var _this = this;
                window.scanCtrl.Terminated = true;
                if (_this.scanList.length === 0) {
                    Artery.notice.error({
                        title: '扫描取消'
                    });
                    _this.showLogError('扫描取消');
                }
            },
            generateScoketKey () {
                // 当前毫秒值加6位随机数
                var randomNum = '';
                for (var i = 0; i < 6; i++) {
                    randomNum += Math.floor(Math.random() * 10);
                }
                this.socketKey = new Date().getTime() + randomNum;
            },
            initSocketIO () {
                // var baseWebSocketUrl = _config.dirProjectPath.replace('http', 'ws');
                if (!this.webSocket || !this.webSocket.readyState || this.webSocket.readyState > 1) {
                    this.generateScoketKey();
                    try {
                        var webSocket = new WebSocket('ws://' + this.localIpPort + '/socket/' + this.socketKey);
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
            socketOnOpen () {
                console.log('Socket opened.');
            },
            socketOnClose () {
                console.log('Socket closed. Try reconnect.');
            },
            socketOnError (event) {
                console.error(event);
            },
            socketOnMessage (event) {
                var message = event.data;
                var data = JSON.parse(message);
                this.handleUploadSuccess(data);
            },
            scanInCommon () {
                var _this = this;

                var socket = new WebSocket("ws://127.0.0.1:50020/");
                try {

                    socket.onclose = function (msg) {
                        _this.showLogError('连接Canon扫描仪网页服务程序失败!');
                    };

                    socket.onopen = function (msg) {
                        socket.onclose = function (msg) {};

                        socket.onmessage = function (msg) {
                            if (typeof msg.data == "string") {
                                alert(msg.data);}
                        }

                        var obj={"ServerUrl": "http://baidu.com","ReadBarcode": 0,"Batch": "0000001","HttpPostString":"","CheckDriver":"true"};
                        socket.send(JSON.stringify(obj))


                        ;
                    }

                }
                catch (ex) {
                    log(ex);
                }

                /*_this.$refs.loadingModel.open();
                $.ajax({
                    url: _this.scanControlUrl,
                    data: {
                        jbxxbh: _this.selectedBh,
                        authCode: _this.authCode,
                        userid: _this.userId,
                        socketKey: _this.socketKey,
                        apiUrl: _this.scanUploadUrl,
                        useHeader: false
                    },
                    error: function () {
                        Artery.notice.error({
                            title: '提示信息',
                            desc: '连接扫描仪时出现异常，请检查扫描仪驱动是否安装启动'
                        });
                    },
                    complete: function () {
                        _this.$refs.loadingModel.close();
                    }
                });*/
            },
            // 检查奔图浏览器
            checkBentu () {
                var b = false;
                $.ajax({
                    type: 'GET',
                    url: this.scanBenTuControlUrl + '/get_device_list',
                    // 返回格式为json
                    dataType: 'json',
                    // 请求是否异步，默认为异步，这也是ajax重要特性
                    async: false,
                    success: function (result) {
                        if (parseInt(result.resultCode) === 0) {
                            b = true;
                        } else {
                            b = false;
                        }
                    },
                    error: function () {
                        console.log('An error occurred: get_device_list');
                        b = false;
                    }
                });
                return b;
            },
            // 检查奔图浏览器
            checkBentu2 () {
                var b = false;
                $.ajax({
                    type: 'GET',
                    url: this.scanBenTuControlUrl + '/get_device_list2',
                    // 返回格式为json
                    dataType: 'json',
                    // 请求是否异步，默认为异步，这也是ajax重要特性
                    async: false,
                    success: function (result) {
                        if (parseInt(result.resultCode) === 0) {
                            b = true;
                        } else {
                            b = false;
                        }
                    },
                    error: function () {
                        console.log('An error occurred: get_device_list2');
                        b = false;
                    }
                });
                return b;
            },
            scanBenTu () {
                var _this = this;
                var param;
                if(_this.connectType == '网络连接' && !_this.ipAddress){
                    param = 'format=.png&src=Automatic+Document+Feeder&mode=Color&dpi=300&doctype=A4&opt=0&pages=0&device=&savePath=&saveBarcodePath=&dodetect=0&ip='+_this.ipAddress+'&model='+ _this.modelValue;
                }else {
                    param = 'format=.png&src=Automatic+Document+Feeder&mode=Color&dpi=300&doctype=A4&opt=0&pages=0&device=&savePath=&saveBarcodePath=&dodetect=0&model='+ _this.modelValue;
                }
                var requestUrl = _this.scanBenTuControlUrl + '/scan';
                $.ajax({
                    type: 'GET',
                    url: requestUrl,
                    // 返回格式为json
                    dataType: 'json',
                    // 请求是否异步，默认为异步，这也是ajax重要特性
                    async: true,
                    data: param,
                    success: function (result) {
                        // 打印服务端返回的数据(调试用)
                        if (result.resultCode === 0) {
                            var docArray = result.docs;
                            for (var i = 0; i < docArray.length; i++) {
                                // 获取扫描图像数据至浏览器
                                _this.getStreamByDocId(docArray[i].docid);
                            }
                        }
                    },
                    error: function () {
                        _this.showLogError('连接扫描仪时出现异常，请检查扫描仪驱动是否安装启动');
                    },
                    complete: function () {
                        _this.$refs.loadingModel.close();
                    }
                });
            },
            //佳能扫描仪
            scanCanon() {
                let _this = this
                if (_this.canonWebScan.licence == '') {
                    _this.showLogError('授权码为空');
                    return;
                }
                //扫描仪授权
                _this.canonWebScan.initSef('', function (result) {
                    if (result.code != 200) {
                        _this.showLogError('初始化失败，返回错误：' + result.msg);
                        return;
                    }
                    //获取型号
                    _this.canonWebScan.getDevices(function (result) {
                        if (result.code != 200) {
                            _this.showLogError("获取参数失败，返回错误：" + result.msg);
                            return;
                        }
                        if (_this.connectType == 'USB连接') {
                            const devices = result.data;
                            if (!devices || devices.filter(item => item.startsWith(_this.modelValue)).length == 0) {
                                _this.showLogError("该型号扫描仪未连接");
                                return;
                            }
                        }
                        //设定参数
                        var form = {
                            "autofeeder": true, //是否自动进纸，1：是，0：否
                            "device": _this.modelValue, //扫描仪型号
                            "format": "png", //图片格式,支持 jpeg、png、bmp、tiff 等常见图像格式
                            "isActual": true, //是否实时回传页面图像
                            "pixel": 1, //颜色模式，0：黑白 1：灰色 2：彩色
                            "resolution": 150, //分辨率，72-1200dpi
                            "mode": 1, //色彩校正，0:无，1：文本 2：图片 3：图文混合(仅支持 linux)
                            "scanSystem": { //系统设置
                                "datePattern": "yyyyMMdd", //追加日期时格式，格式遵循 java 格式化日期格式，例：yyyy-MM-dd
                                "imagePath": "", //图片存放路径，默认在安装目录的config/images
                                "imagePreName": 'IMAGE', //图片命名前缀
                                "isDate": false, //图片命名追加日期
                                "isTime": false, //图片命名追加时间
                                "licence": "", //授权码
                                "random": 1, //图片追加流水号或随机数0:流水号1:随机数
                                "randomCover": 1, //图片追加流水号时是否同名覆盖
                                "randomLength": 4 //图片追加流水号时流水号长度
                            },
                            "single": false, //单双面，true:单面，false:双面
                            "upload": { //图像上传信息
                                "fileName": "", //http 接收文件名称
                                "ftpMode": "2", //ftp 连接模式，1：主动模式，2：被动模式
                                "ftpPassword": "", //ftp 密码
                                "ftpPath": "/images", //ftp 上传文
                                "ftpPort": 21, //ftp 端
                                "ftpUrl": "", //ftp 上传地址
                                "ftpUser": "", //ftp 用户名
                                "header": "", //http 上传携带头信息
                                "httpMethod": "", //http 请求方式
                                "httpUrl": "", //http 上传地址
                                "param": "", //http 上传携带参数信息
                                "uploadMode": 2 //上传方式，0：HTTP 1：FTP 2：无
                            },
                            "white": true, //是否去白页
                            "params": [{ //扩展参数
                                "code":"rotate",
                                "value":"Auto Orientation" //Linux自动旋转
                            },{
                                "code":"auto-orientation-mode",
                                "value":"Quick" //Linux自动旋转模式 快速
                            },{
                                "code":"1152",
                                "value":"1", //Windows自动旋转
                                "type":"6"
                            }],
                            "netWorkScanParam" : { //网络扫描仪参数，仅 linux 下使用
                                "isNetScan": _this.connectType == '网络连接',
                                "IpAddr": _this.connectType == '网络连接' ? _this.ipAddress : "",
                            }
                        }
                        _this.canonWebScan.setParams(form, function (result) {
                            if (result.code != 200) {
                                _this.showLogError(result.msg);
                                return;
                            }
                            //扫描
                            _this.canonWebScan.startScan(_this.canonScanCallBack, null);
                        })
                    })
                })

            },
            //佳能扫描仪扫描结果回调
            canonScanCallBack(result) {
                var _this = this
                var code = result.code;
                if (code == 201) {
                    var urlData = result.image;
                    let file = _this.base64Decode(urlData)

                    _this.uploadScanFile2(file);
                }
                if (code == 500) {
                    _this.showLogError(result.msg);
                }
            },
            //汉王扫描仪
            scanHw() {
                let _this = this
                let socket;
                var strmsg = '连接汉王扫描仪网页服务程序失败!';

                try {
                    socket = new WebSocket(_this.hwWebScan.url);

                    socket.onclose = function (msg) {
                        if (strmsg != "") {
                            _this.showLogError(strmsg);
                        }
                    };

                    socket.onopen = function (msg) {
                        strmsg = "连接异常中断";
                        //扫描仪型号
                        _this.hwWebScan.command.device = _this.modelValue
                        socket.send(JSON.stringify(_this.hwWebScan.command));
                    }

                    socket.onmessage = function (msg) {
                        // console.log(msg)
                        if (typeof (msg.data) == "string") {
                            strmsg = "";
                            var str = msg.data;
                            if (str.length <= 0) {
                                return;
                            }
                            //获取状态值
                            if (str.indexOf(_this.hwWebScan.g_splitCodeFlag) >= 0) {
                                var strs = str.split(_this.hwWebScan.g_splitCodeFlag);
                                // console.log("当前扫描状态:" + strs[1])
                                if (strs[1] != '0') {
                                    _this.showLogError("当前扫描状态:" + strs[1]);
                                }
                                strs = null;
                                return;
                            }

                            //图片数据
                            if (str.indexOf(_this.hwWebScan.g_splitDataFlag) >= 0) {
                                var strs = str.split(_this.hwWebScan.g_splitDataFlag);
                                let urlData = _this.hwWebScan.base64_head + strs[1]
                                strs = null;
                                let file = _this.base64Decode(urlData)
                                _this.uploadScanFile2(file);
                            }
                            str = null;
                        }
                    }

                } catch (ex) {
                    console.error(ex);
                }
            },
            //base64解码成png文件
            base64Decode(urlData) {
                let _this = this
                let arr = urlData.split(',');
                // let mime = arr[0].match(/:(.*?);/)[1];
                let bytes = atob(arr[1]); // 解码base64
                let n = bytes.length
                let ia = new Uint8Array(n);
                while (n--) {
                    ia[n] = bytes.charCodeAt(n);
                }
                let file = new File([ia], _this.uuid() + '.png', {type: 'image/png'});
                return file
            },
            // 据获DocId取数据Blob流
            getStreamByDocId (docid) {
                var _this = this;
                if (docid <= 0) {
                    console.error('docid not valid');
                }
                var url = _this.scanBenTuControlUrl + '/getimage?docid=' + docid;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                // 设置返回响应数据的类型
                xhr.responseType = 'blob';
                xhr.setRequestHeader('Accept', 'image/png');
                xhr.onload = function () {
                    if (this.status === 200) {
                        // var tp = xhr.getResponseHeader('Content-Type');
                        console.log(xhr.response);
                        console.log(_this.response);
                        // var blob = new Blob([xhr.response]);
                        var blob = xhr.response;
                        // _this.uploadScanFile(blob);
                        var pngFile= new File([blob], _this.uuid() + '.png', { type: 'image/png' });
                        console.log(pngFile);
                        _this.uploadScanFile2(pngFile);
                    }
                }
                xhr.send();
            },
            // 上传服务器
            uploadScanFile (data) {
                var _this = this;
                var xhr = new XMLHttpRequest();
                var url = _this.scanUploadUrl + '/bentu';
                xhr.open('POST', url, true);
                // 设置返回响应数据的类型
                xhr.responseType = 'json';
                xhr.onload = function () {
                    if (this.status !== 200) {
                        console.error(xhr.response);
                    }
                }
                var fd = new FormData();
                fd.append('file', data, this.uuid() + '.png');
                fd.append('jbxxbh', this.selectedBh);
                fd.append('authCode', this.authCode);
                fd.append('userid', this.userId);
                fd.append('socketKey', this.socketKey);
                xhr.send(fd);
            },
            // 上传服务器
            uploadScanFile2 (data) {
                var _this = this;
                var fd2 = new FormData();
                fd2.append('file', data);
                let uploadSpdUrl = _this.urlPre + 'api/v1/cxsq/uploadSpd/';
                // post request server
                Artery.ajax.post(uploadSpdUrl + _this.selectedBh, fd2,{
                    timeout: 10000
                })
                    .then(function (result) {
                        _this.handleUploadSuccess(result, data,'png');
                    })
                    .catch(function (error) {
                        if (error.status === 401){
                            _this.showLogError('登录已经失效，请重新登录后提交');
                        }else {
                            _this.showLogError(error);
                        }
                    });
            },
            uuidPart () {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
            },

            uuid () {
                return this.uuidPart() + this.uuidPart() + '-' + this.uuidPart() +
                    '-' + this.uuidPart() + '-' + this.uuidPart() + '-' +
                    this.uuidPart() + this.uuidPart() + this.uuidPart();
            },
            getLocalIPPort () {
                var _this = this;
                Artery.ajax.get('/api/admin/ip', {
                    params: {}
                }).then(function (result) {
                    if (!result.success) {
                        _this.localIpPort = result.data;
                    } else {
                        _this.showLogError(result.message || '');
                    }
                });

            },
            showLogWarning(log){
                const h = this.$createElement;
                this.$message(
                    {
                        showClose:true,
                        message:h('p', {style:'weight:200px;height:30px'}, [
                            h('span', {style:'font-size:20px;color:#e6a23c;weight:500;align:center'}, log)]),
                        type:'warning'
                    }
                );
            },
            showLogError(log){
                const h = this.$createElement;
                this.$message(
                    {
                        showClose:true,
                        message:h('p', {style:'weight:200px;height:30px'}, [
                            h('span', {style:'font-size:20px;color:#e6a23c;weight:500;align:center'}, log)]),
                        type:'error'
                    }
                );
            },
            showLogSuccess(log){
                const h = this.$createElement;
                this.$message(
                    {
                        showClose:true,
                        message:h('p', {style:'weight:200px;height:30px'}, [
                            h('span', {style:'font-size:20px;color:#e6a23c;weight:500;align:center'}, log)]),
                        type:'success'
                    }
                );
            },
            closeModal() {
                var _this = this;
                if (_this.files.length === 0) {
                    _this.showLogWarning('请上传审批表');
                    return;
                }
                if(_this.current !=  _this.total){
                    _this.showLogWarning('审批表还有未上传的信息');
                    return;
                }
                // 刷新审批表列表
                var frameTab = window.open('', 'frame');
                frameTab.document.getElementById('fd-ldjf-mainiframe')
                    .contentWindow
                    .location
                    .reload();
                window.close();
            },
            addUploadInfo(){
                $('.top_info').html('');
                var _this = this;
                let topInfo = '<div>扫描件上传情况</div>'
                            + '<div class="info">'
                            + '<div>扫描件共计' + _this.total + '页</div>'
                            + '<div>已上传' + _this.current + '页</div>'
                            + '<div>剩余'+ (_this.total- _this.current) + '页未上传</div>'
                            + '</div>'
                if(_this.current > 0){
                    $('.top_info').append(topInfo);
                }else {
                    $('.top_info').html('');
                }
            },
            cancel () {
                $('.fd-newip-pop-wrap')
                    .addClass('fd-hide');
            },
            cancel2 () {
                $('.abc')
                    .addClass('fd-hide');
            },
        },
        created (){
            this.urlPre = this.getLocalPath(true);
            this.getPng = this.urlPre + '/api/spd/files/png/';
            this.queryUserId();
            this.getParamsFun();
            this.refreshFiles();
            // this.getFjtableData();
            this.brandChange(this.brandValue);
        }
    })
})()
