define(['fdGlobal', 'config', 'fdComponent2','fdEventBus','fdMessage'],
    function (fdGlobal, config, fdComponent2, fdEventBus,fdMessage) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
    return {
        data: function () {
            return {

                editorList: {},
                serverData: {},
                ipxjShow: true,
                /*ipbjShow:false,*/
                ipblPopshow: false,
                ipdList: [
                    {
                        first: '',
                        last: ''
                    }
                ],
                ipList: [
                    {
                        ipCode: ''
                    }
                ],
                //保存时的ip列表
                saveIpList:[],
                saveIpdList:[],
                query: {
                    endDate: null,
                    startDate: null
                },
                //查询条件
                cxtj: {
                    sqkssj: '',
                    sqjssj: ''
                },
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
                //新建ip请求地址
                serverUrlxjip: _config.url.frame.xjip,
                //下载地址
                downloadUrl: _config.url.frame.getYjPic,
                //上传多个的下载地址
                ipGlDownLoad: _config.url.frame.ipGlDownLoad,
                //上传多个的删除地址
                ipGlDelete: _config.url.frame.ipGlDelete,
                ipGlLook:_config.url.frame.ipGlLook,
                // 批准依据
                pzyjUrl: _config.url.frame.ipGlMoreFile,
                cGzmc: '',//策略名称
                file: [],
                fileIds:[],//需要去数据库中删除的文件id
                image: "#",
                user: {},
                base64Code: "",
                visiable: false,
                ipbjImgsrc: '#',
                scTpShow: false,
                ipxjPicShow: true,
                cDwBh: '',//单位id
                type: '',//部门或是单位
                isip: false,
                ipglTitle: '',//标题
                scyjList: [],// 上传依据
                yxq :'',
                options3: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            // 如果结束时间为空，说明没有选中时间
                            if (!_this.cxtj.sqjssj) {
                                return date && date.valueOf() < Date.now() - 86400000;
                            }
                            // 今天以前的日期不能选择，以及大于结束日期的也不能选中
                            return date && (date.valueOf() > new Date(_this.query.endDate).valueOf() - 86400000 || date.valueOf() < Date.now() - 86400000);
                        }
                    }
                })(this),
                options4: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            // 如果开始时间为空，说明没有选中时间
                            if (!_this.cxtj.sqkssj) {
                                return date && date.valueOf() < Date.now() - 86400000;
                            }
                            // 今天以前的日期不能选择，以及小于开始日期的也不能选中
                            return date && (date.valueOf() < Date.now() - 86400000 || date.valueOf() < new Date(_this.query.startDate).valueOf());
                        }
                    }
                })(this)
            }
        },
        methods: {
            // // 选中开始时间
            selectSqsjStart: function (date) {
                this.query.startDate = this.cxtj.sqkssj;
            },
            // 选中结束时间
            selectSqsjEnd: function (date) {
                this.query.endDate = this.cxtj.sqjssj;
            },
            // 刷新滚动条
            ready: function (scrollbar) {
                scrollbar.update();
            },
            // 新建
            ipglXj:function(data) {
                var _this = this;
                $('#appControllerIpgl').removeClass('fd-hide');
                $('.fd-mask').removeClass('fd-hide');
                _this.editorList = data._dataList;
                _this.cDwBh = data.cDwBh;
                _this.type = data.type;
                _this.scyjList = data.name;
                $("#ipbjimg").css('display', 'none');
                _this.editorList.cBh = "";
                /* _this.ipbjShow = false;*/
                _this.ipxjShow = true;
                _this.ipglTitle = '新建IP分配规则';
                _this.visiable = false;
                _this.ipxjPicShow = false;
                // 刷新滚动条
                if( _this.$refs.xjipScroll) {
                    _this.$refs.xjipScroll.update(0,0);
                }
            },
            // 编辑
            ipglBj:function(data) {
                var _this = this;
                _this.scyjList = [];
                var serverUrlQueryIpinfo = _config.url.frame.getYjPic;
                var ipdL = [];
                var ipL = [];
                $('#appControllerIpgl').removeClass('fd-hide');
                $('.fd-mask').removeClass('fd-hide');
                _this.editorList = data._dataList;
                _this.cDwBh = data.cDwBh;
                _this.type = data.type;
                _this.scyjList = data.name;
                _this.cGzmc = _this.editorList.cGzmc;
                _this.ipbjImgsrc = serverUrlQueryIpinfo + '/' + _this.editorList.cBh + "?" + Math.random();
                ipdL = _this.editorList.cIpd.split(";");
                ipdL.pop();
                _this.ipdList = [];
                for (var i = 0; i < ipdL.length; i++) {
                    _this.ipdList.push({
                        first: '',
                        last: ""
                    });
                    ipdL[i] = ipdL[i].split(":");
                    _this.$set(_this.ipdList[i], 'first', ipdL[i][0]);
                    _this.$set(_this.ipdList[i], 'last', ipdL[i][1]);
                }
                ipL = _this.editorList.cIp==''?[]:_this.editorList.cIp.split(",");
                _this.ipList = [];

                for (var i = 0; i < ipL.length; i++) {
                    _this.ipList.push({
                        ipCode: ''
                    });
                    _this.$set(_this.ipList[i], 'ipCode', ipL[i]);
                }
                _this.cxtj.sqjssj = _this.editorList.dYxqJz;
                _this.cxtj.sqkssj = _this.editorList.dYxqQs;
                _this.query.startDate = _this.editorList.dYxqQs;
                _this.query.endDate = _this.editorList.dYxqJz;
                _this.ipxjPicShow = true;
                _this.ipxjShow = true;
                _this.ipglTitle = '编辑IP分配规则';
                if( _this.$refs.xjipScroll) {
                    _this.$refs.xjipScroll.update(0,0);
                }
            },
            //添加ip
            addIp: function () {
                var _this = this;
                if (_this.ipList.length >= 10) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: 'ip最多添加10条！'
                        },
                        interval: 1800
                    });
                    return false;
                }
                var _data = {
                    ipCode: ''
                }
                _this.ipList.push(_data);
                _this.$refs.xjipScroll.update();
            },
            //添加ip段
            addIpd: function () {
                var _this = this;
                if (_this.ipdList.length >= 5) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: 'ip段最多添加5条！'
                        },
                        interval: 1800
                    });

                    return false;
                }

                var _data = {
                    first: '',
                    last: ''
                };
                _this.ipdList.push(_data);
                _this.$refs.xjipScroll.update();
            },
            //校验ip
            isValidIP: function (value, type) {
                var _this = this;
                var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (value) {
                    if (!reg.test(value)) {
                        if (type == 'ipd') {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请填写正确的ip段地址！'
                                },
                                interval: 1800
                            });
                        } else {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请填写正确的ip地址！'
                                },
                                interval: 1800
                            });
                        }

                        _this.isip = true;
                    } else {
                        _this.isip = false;
                    }
                }
            },
            clickDeleteItem: function (type, index) {
                this[type].splice(index, 1);
                // 更新滚动条
                this.$refs.xjipScroll.update();
            },
            //关闭弹窗
            ipglxjPopClose: function () {
                var _this = this;
                _this.cGzmc = '';
                _this.scyjList=[];
                _this.file = [];
                _this.fileIds=[];
                _this.ipdList = [
                    {
                        first: '',
                        last: ''
                    }
                ],
                    _this.ipList = [
                        {
                            ipCode: ''
                        }
                    ],
                    _this.ipxjShow = false;
                _this.ipbjShow = false;

                _this.query = {
                    endDate: null,
                    startDate: null
                }
                _this.cxtj = {
                    sqkssj: null,
                    sqjssj: null
                }
                _this.visiable = false;
                _this.ipxjPicShow = true;
                $('#appControllerIpgl').addClass('fd-hide');
                $('.fd-mask').addClass('fd-hide');
                _this.yxq = "";
            },
            //获取ip
            getTableContent: function (list) {
                var data = '';
                for (var i = 0; i < list.length; i++) {
                    var _data = list[i].ipCode + ","
                    data += _data
                }
                data = data.substring(0, data.length - 1)
                return data;
            },
            //获取ipd
            getIpdTableContent: function (list) {
                var data = '';
                for (var i = 0; i < list.length; i++) {
                    var _data = list[i].first + ":" + list[i].last + ";";
                    data += _data
                }
                return data;
            },
            //子组件传过来日期改变的值
            changeDate: function (obj, name, index,event) {

                var sign = true;
                if (name == "startDate") {
                    sign = fdGlobal.dateCompare(obj, this.query.endDate);
                } else {
                    sign = fdGlobal.dateCompare(this.query.startDate, obj);
                }
                if (sign) {
                    this.query[name] = obj;
                } else {
                    this.query[name] = '';
                    $('#appControllerIpgl').find('.fd-ipgl-yxq').find('.fd-input-wrap.' + name).find('.fd-date-input').val('')
                }

            },
            beforeUpload: function (f) {
                var _this = this;
                if(((f.size)/1048576)>2){
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '上传的文件不能大于2M'
                        },
                        interval: 900
                    });
                    return false
                }
                var str = f.name.split(".")[1];
                if(!(str === 'png' || str === 'jpg')){
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '请上传正确格式文件'
                        },
                        interval: 900
                    });
                    return false
                }
                // this.scyjList.push(f);
                this.file.push(f);
                this.visiable = true;
                this.ipxjPicShow = false;
                return true;
            },
            uploadSuccess: function(response, file, fileList) {
                var _this = this;
                _this.scyjList.push(response.data);
                _this.$refs.ipGlMoreUpload.clearFiles();
                // 更新滚动条
                _this.$refs.xjipScroll.update();

            },

            //删除上传的批准依据
            removeClick:function(index) {
                var _this = this;
                if(this.scyjList[index].id) {
                    _this.fileIds.push(this.scyjList[index].id);
                    _this.scyjList.splice(index,1);
                    _this.$refs.xjipScroll.update();
                }else {
                    var _serverData = {
                        luJing : this.scyjList[index].luJing
                    };
                    $.ajax({
                        method:config.methodPost,
                        url: _this.ipGlDelete,
                        data: _serverData,
                        dataType:'json',
                        success: function (data) {
                            /*if(data.data == "success") {
                                $.alert({
                                    type: 'success',
                                    info: {
                                        success: '删除成功！'
                                    },
                                    interval: 1800
                                });
                            }*/
                            _this.scyjList.splice(index,1);
                            _this.$refs.xjipScroll.update();
                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog,_this.scyjList+'静态数据',data)
                        },
                        error: function (data,textStatus, errorThrown) {
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                }
            },
            //查看
            lookClick:function(index) {

                var ext = this.scyjList[index].fileName;
                var fileType =ext.substring(ext.lastIndexOf(".")+1).toLowerCase();
                if(fileType!='pdf' && fileType !='txt' && fileType !='jpg' && fileType !='bmp' && fileType !='gif'
                    && fileType !='jpeg' && fileType !='ico' && fileType !='png'){
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '此文件不支持预览，请下载查看'
                        },
                        interval: 900
                    });
                    return false
                };
                var url = _config.url.frame.ipGlLook + '?fileName='+ this.scyjList[index].fileName + '&luJing=' + this.scyjList[index].luJing+ '&id=' + this.scyjList[index].id +'&fileType='+fileType
                window.open(url);
            },





            submit: function () {
                var _this = this;
                var count=0;

                //判断策略名称是否填写
                if (_this.cGzmc === '') {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '请填写策略名称！'
                        },
                        interval: 1800
                    });
                    return false;
                }
                var ipdFlag;
                if (_this.ipdList.length > 0) {
                    $.each(_this.ipdList, function (index, val) {
                        if(val.first!=''|| val.last != ''){
                            _this.saveIpdList.push(val);
                            if (val.first == '' || val.last == '') {
                                ipdFlag = true
                            }
                        }
                    });
                };
                if (_this.ipList.length > 0) {
                    $.each(_this.ipList, function (index, val) {
                        if(val.ipCode!= ''){
                            _this.saveIpList.push(val);
                        }
                    });
                };
                if (ipdFlag) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '请填写完整的ip段信息 ！'
                        },
                        interval: 1800
                    });
                    return false;
                };
                if (_this.saveIpList.length + _this.saveIpdList.length==0){
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '请至少填写一组ip或者ip段 ！'
                        },
                        interval: 1800
                    });
                    _this.saveIpList=[];
                    _this.saveIpdList=[];
                    return false;
                }
                //判断是否填写正确ip段
                if (_this.ipdList.length > 0) {
                    for (var i = 0; i < _this.ipdList.length; i++) {
                        _this.isValidIP(_this.ipdList[i].first, 'ipd');
                        _this.isValidIP(_this.ipdList[i].last, 'ipd');
                        if (_this.isip) {
                            _this.saveIpList=[];
                            _this.saveIpdList=[];
                            return false;
                        }
                    }
                }
                //判断是否填写正确ip
                if (_this.ipList.length > 0) {
                    for (var i = 0; i < _this.ipList.length; i++) {
                        _this.isValidIP(_this.ipList[i].ipCode, 'ip');
                        if (_this.isip) {
                            _this.saveIpList=[];
                            _this.saveIpdList=[];
                            return false;
                        }
                    }
                }
                if(_this.query.startDate) {
                    if(!_this.query.endDate) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写结束日期！'
                            },
                            interval: 1800
                        });
                        return
                    }
                }
                if(_this.query.endDate) {
                    if(!_this.query.startDate) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写开始日期！'
                            },
                            interval: 1800
                        });
                        return
                    }
                }
                var cip = _this.getTableContent(_this.saveIpList);
                var cipd = _this.getIpdTableContent(_this.saveIpdList);
                _this._serverData = {
                    cBh: _this.editorList.cBh,
                    cDwBh: _this.cDwBh,
                    type: _this.type,
                    cGzmc: _this.cGzmc,
                    cIp: cip,
                    cIpd: cipd,
                    dYxqQs: (_this.query.startDate === null ||  _this.query.startDate === '') ? null : _this.query.startDate + " 00:00:00",
                    dYxqJz: (_this.query.endDate === null || _this.query.endDate === '') ? null : _this.query.endDate + " 23:59:59"
                };
                //只有新上传的才给后台发送，有id的不再向后台发送
                var _fileAdds = [];
                for(var i = 0;i < _this.scyjList.length;i++) {
                    if(_this.scyjList[i].id == '' || _this.scyjList[i].id == null ) {
                        _fileAdds.push(_this.scyjList[i])
                    }
                }
                
                
                var _formData = {
                        params: JSON.stringify(_this._serverData),
                        fileAdds: JSON.stringify(_fileAdds),
                        fileIds:  JSON.stringify(_this.fileIds)
                    }

                    $.ajax({
                        method: config.methodPost,
                        url: _this.serverUrlxjip,
                        data: _formData,
                        dataType: 'json',
                        success: function (result) {
                            if (result.code === "200") {
                                _this.saveIpList=[];
                                _this.saveIpdList=[];
                                _this.file = [];
                                _this.fileIds = [];
                                _this.scyjList=[];
                                _this.image = "#";
                                _this.user = {};
                                _this.base64Code = "";
                                _this._serverData = {
                                    cBh: "",
                                    cDwBh: "",
                                    type: "",
                                    cGzmc: "",
                                    cIp: "",
                                    cIpd: "",
                                    dYxqQs: null,
                                    dYxqJz: null
                                }
                                $('#appControllerIpgl').addClass('fd-hide');
                                $('.fd-mask').addClass('fd-hide');
                                // 清空
                                _this.cGzmc = '';
                                _this.editorList.cBh = "";
                                _this.ipdList = [
                                    {
                                        first: '',
                                        last: ''
                                    }
                                ],
                                    _this.ipList = [
                                        {
                                            ipCode: ''
                                        }
                                    ],
                                    _this.ipxjShow = false;
                                _this.query = {
                                    endDate: null,
                                    startDate: null
                                }
                                _this.cxtj = {
                                    sqkssj: null,
                                    sqjssj: null
                                }
                                _this.yxq = '';
                                _this.ipxjPicShow = false;
                                $.alert({
                                    type: 'success',
                                    info: {
                                        success: '提交成功'
                                    },
                                    interval: 1800
                                })
                                _this.visiable = false;
                                var flag = "ipRefresh";
                                window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(flag, '*');
                            } else {
                                $.alert({
                                    type: 'fail',
                                    info: {
                                        fail: result.message
                                    },
                                    interval: 1800
                                })
                                _this.saveIpList=[];
                                _this.saveIpdList=[];
                            }
                        },
                        error: function (data, textStatus, errorThrown) {
                            if (error.status == 401) {
                                window.location.href = '/templates/login.pages'
                            }else{
                                $.alert({
                                    type: 'fail',
                                    info: {
                                        fail: '提交失败'
                                    },
                                    interval: 1800
                                });
                            }
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });
                         
            },
            //去空格
            valueTrim:function(type,index,name){
                this[type][index][name]=this[type][index][name].trim()
            },
            changeYxq:function(e){
                _this = this;
                yxqradio = e.currentTarget;
                var nowD = new Date();
                _this.query.startDate = nowD.getFullYear() + '-' + (nowD.getMonth() + 1) + '-' + nowD.getDate();
                var yxqv = yxqradio.value;
                if(yxqv == 3){
                    nowD.setMonth(nowD.getMonth()+3);
                }else if(yxqv == 6){
                    nowD.setMonth(nowD.getMonth()+6);
                }else if(yxqv == 12){
                    nowD.setMonth(nowD.getMonth()+12);
                }else if(yxqv == 24){
                    nowD.setMonth(nowD.getMonth()+24);
                }
                nowD = new Date(nowD.getFullYear(), (nowD.getMonth() + 1), 0);
                _this.query.endDate = nowD.getFullYear() + '-' + (nowD.getMonth() + 1) + '-' + nowD.getDate();
            }
        },
        filters: {
            dateFormat: function (value) {

                if (value == null || value == "") {
                    return '';
                }
                if (typeof(value) != 'string') {
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
            // 接收消息
            fdEventBus.$on('appIpglXj',this.ipglXj);
            fdEventBus.$on('appIpglBj',this.ipglBj);
        },
        mounted: function() {
     //     this.$refs.xjipScroll.update();
        },
        destoried:function () {
            fdEventBus.$off('appIpglXj',this.ipglXj);
            fdEventBus.$off('appIpglBj',this.ipglBj);
        }
    }
});
