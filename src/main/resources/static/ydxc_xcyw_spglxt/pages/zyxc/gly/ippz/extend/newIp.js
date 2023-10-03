// 分模块
define(['fdGlobal', 'config','fdDataTable', 'scrollbar', 'fdComponent2', "dragFun", 'userBehavior', 'jqueryUi', 'layDate',],
    function (fdGlobal, config,fdDataTable, scrollbar, fdComponent2, dragFun, userBehavior, jqueryUi, layDate) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var scrollBar1;
    // 新建ip分配
    var ipglPop = new Vue({
        el: "#appControllerNewIpgl",
        data: {
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
                endDate: '',
                startDate: ''
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
            name:[],
            yxq :''
        },
        methods: {
            bindMessage: function () {
                var _this = this;
                $(window).on('message', function (evt) {
                    var mesStr = typeof(evt.originalEvent.data) != 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
                    if (mesStr.flag == 'ipglxj') {  //新建
                        $('#appControllerIpgl').removeClass('fd-hide');
                        $('.fd-mask').removeClass('fd-hide');
                        _this.editorList = mesStr._dataList;
                        _this.cDwBh = mesStr.cDwBh;
                        _this.type = mesStr.type;
                        $("#ipbjimg").css('display', 'none');
                        _this.editorList.cBh = "";
                        /* _this.ipbjShow = false;*/
                        _this.ipxjShow = true;
                        _this.ipglTitle = '新建IP分配规则';
                        _this.visiable = false;
                        _this.ipxjPicShow = false;
                    } else if (mesStr.flag == 'ipglbj') { //编辑
                        var serverUrlQueryIpinfo = _config.url.frame.getYjPic;
                        var ipdL = [];
                        var ipL = [];
                        $('#appControllerIpgl').removeClass('fd-hide');
                        $('.fd-mask').removeClass('fd-hide');
                        _this.editorList = mesStr._dataList;
                        _this.name=mesStr.name;
                        _this.cDwBh = mesStr.cDwBh;
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
                            /*_this.ipdList[i].first = ipdL[i][0];*/
                            /*_this.ipdList[i].last = ipdL[i][1];*/
                        }
                        ipL = _this.editorList.cIp==''?[]:_this.editorList.cIp.split(",");
                        _this.ipList = [];

                        for (var i = 0; i < ipL.length; i++) {
                            _this.ipList.push({
                                ipCode: ''
                            });
                            _this.$set(_this.ipList[i], 'ipCode', ipL[i]);
                            /*_this.ipList[i].ipCode = ipL[i];*/
                        }
                        _this.query.endDate = _this.editorList.dYxqJz;
                        _this.query.startDate = _this.editorList.dYxqQs;
                        _this.ipxjPicShow = true;
                        _this.ipxjShow = true;
                        _this.ipglTitle = '编辑IP分配规则';
                        /* _this.ipbjShow = true;*/
                    }
                })
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
                }
                _this.ipdList.push(_data)
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
                this[type].splice(index, 1)
            },
            //关闭弹窗
            ipglPopClose: function () {
                var _this = this;
                _this.cGzmc = '';
                _this.name=[];
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
                    endDate: "",
                    startDate: ""
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
            /*handleUpload: function (f) {

                var _this = this;
                if(((f.size)/1048576)>20){
                      $.alert({
                          type: 'fail',
                          info: {
                              fail: '上传的照片不能大于20M'
                          },
                          interval: 900
                      });
                      return false
                 };
                this.name.push(f);
                this.file.push(f);
                var reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onload = function (e) {
                    //把得到的base64赋值到img标签显示
                    _this.visiable = true;
                    _this.ipxjPicShow = false;
                }
                _this.visiable = true;
                this.ipxjPicShow = false;
                return false;
            },
            uploadSuccess: function(response, file, fileList) {
                var _this = this;

                _this.$refs.adminEmpcardUpload.clearFiles();
                // 恢复上传照片和提交按钮
                _this.uploadLoading = false;
                $('#empcardUpload :file').attr('disabled', false);
                $('#personInfoSubmit').attr({
                    'disabled': false,
                    'class': 'fd-btn fd-btn-confirm'
                });

                if(fdGlobal.checkString(response.data)) {
                    _this.empcardTempFile = response.data;
                    _this.image1 = _config.url.frame.empcardFromTemp + '/' + response.data + "?" + Math.random();
                }
            },*/



            //上传工作证
            handleUpload: function (f) {
                var _this = this;
                /* if(((f.size)/1048576)>2){
                     $.alert({
                         type: 'fail',
                         info: {
                             fail: '上传的文件不能大于2M'
                         },
                         interval: 900
                     });
                     return false
                };*/
                /*this.name.push(f);*/
                this.file.push(f);
                this.visiable = true;
                this.ipxjPicShow = false;
                return true;
            },
            uploadSuccess: function(response, file, fileList) {
                var _this = this;
                this.name.push(response.data);
                _this.$refs.ipGlMoreUpload.clearFiles();

                // 恢复上传照片和提交按钮
                /*_this.uploadLoading = false;
                $('#empcardUpload :file').attr('disabled', false);
                $('#personInfoSubmit').attr({
                    'disabled': false,
                    'class': 'fd-btn fd-btn-confirm'
                });*/

                /*if(fdGlobal.checkString(response.data)) {
                    _this.empcardTempFile = response.data;
                    _this.image1 = _config.url.frame.empcardFromTemp + '/' + response.data + "?" + Math.random();
                }*/
            },
            //删除上传的批准依据
            removeClick:function(index) {
                var _this = this;
                if(this.name[index].id) {
                    _this.fileIds.push(this.name[index].id);
                    _this.name.splice(index,1);
                }else {
                    var _serverData = {
                        luJing : this.name[index].luJing
                    };
                    $.ajax({
                        method:config.methodPost,                            url: _this.ipGlDelete,
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
                            _this.name.splice(index,1);
                            //输出日志
                            fdGlobal.consoleLogResponse(config.showLog,_this.name+'静态数据',data)
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

                var ext = this.name[index].fileName;
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
                var url = _config.url.frame.ipGlLook + '?fileName='+ this.name[index].fileName + '&luJing=' + this.name[index].luJing+ '&id=' + this.name[index].id +'&fileType='+fileType
                window.open(url);
            },





            submit: function () {
                var _this = this;
                var count=0;

                //判断策略名称是否填写
                if (_this.cGzmc == '') {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '请填写策略名称！'
                        },
                        interval: 1800
                    });
                    return false;
                };
                /*   if (_this.ipdList.length < 1 && _this.ipList.length < 1) {
                       $.alert({
                           type: 'fail',
                           info: {
                               fail: '请至少填写一组IP或者ip段 ！'
                           },
                           interval: 1800
                       });
                       return false;
                   }*/
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
                            fail: '请至少填写一组IP或者ip段 ！'
                        },
                        interval: 1800
                    });
                    _this.saveIpList=[];
                    _this.saveIpdList=[];
                    return false;
                }
                /*                    if (_this.ipList.length > 0) {
                                        $.each(_this.ipList, function (index, val) {
                                            if (val.ipCode == '') {
                                                ipFlag = true
                                            }
                                        });
                                    }*/

                /*                    if (ipFlag) {
                                        $.alert({
                                            type: 'fail',
                                            info: {
                                                fail: '请填写完整的ip信息 ！'
                                            },
                                            interval: 1800
                                        });
                                        return false;
                                    }*/
                //判断有效期是否填写
                if (!(_this.query.startDate && _this.query.endDate)) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '请填写有效期！'
                        },
                        interval: 1800
                    });
                    _this.saveIpList=[];
                    _this.saveIpdList=[];
                    return false;
                }
                //判断依据是否上传
                if (_this.ipxjPicShow == true) {
                    if (_this.file.length == 0&&_this.name.length == 0) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请上传依据！'
                            },
                            interval: 1800
                        });
                        _this.saveIpList=[];
                        _this.saveIpdList=[];
                        return false;
                    }
                }else{
                    if (_this.name.length == 0) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请上传依据！'
                            },
                            interval: 1800
                        });
                        _this.saveIpList=[];
                        _this.saveIpdList=[];
                        return false;
                    }
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
                var cip = _this.getTableContent(_this.saveIpList);
                var cipd = _this.getIpdTableContent(_this.saveIpdList);
                _this._serverData = {
                    cBh: _this.editorList.cBh,
                    cDwBh: _this.cDwBh,
                    type: _this.type,
                    cGzmc: _this.cGzmc,
                    cIp: cip,
                    cIpd: cipd,
                    dYxqQs: _this.query.startDate == "" ? _this.query.startDate : _this.query.startDate + " 00:00:00",
                    dYxqJz: _this.query.endDate == "" ? _this.query.startDate : _this.query.endDate + " 23:59:59"
                }
                var _fileAdds = [];//只有新上传的才给后台发送，有id的不再向后台发送
                for(var i = 0;i < _this.name.length;i++) {
                    if(_this.name[i].id == '' || _this.name[i].id == null ) {
                        _fileAdds.push(_this.name[i])
                    }
                }
                this.$refs.form.getData(function (data) {
                    data.params = JSON.stringify(_this._serverData);
                    data.fileAdds = JSON.stringify(_fileAdds);
                    data.fileIds =  JSON.stringify(_this.fileIds);
                })
                this.$refs.form.submit(_this.serverUrlxjip).then(function (result) {
                    if (result.code == 1) {
                        _this.saveIpList=[];
                        _this.saveIpdList=[];
                        _this.file = [];
                        _this.fileIds = [];
                        _this.name=[];
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
                            dYxqQs: "",
                            dYxqJz: ""
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
                            endDate: '',
                            startDate: ''
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
                        window.document.getElementById("fd-ldjf-mainiframe").contentWindow.postMessage(flag, '*');
                    }
                }).catch(function (error) {
                    // 此错误有以下几种情况
                    // 1. url参数未指定，可以在submit传递或者form中指定url属性
                    // 2. 表单参数格式校验未通过
                    // 3. axios发送请求失败的error
                    /* Artery.message.error(error);*/
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
            this.bindMessage();
        }
    });
})
