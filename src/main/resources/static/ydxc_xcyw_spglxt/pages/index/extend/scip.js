define(['fdGlobal', 'config', 'fdComponent2','fdEventBus','fdMessage'],
    function (fdGlobal, config, fdComponent2, fdEventBus,fdMessage) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
    return {
        data: function() {
            return {
                cBh: '',
                //删除
                serverUrlQueryIpsc: _config.url.frame.scIp,
                flag:'',
                cId:'',//消息提醒删除
                tztgRemove: _config.url.frame.tztgRemove,//删除暂存数据
                serverUrl:''
            }
        },

        methods: {
            ipglSc:function(data) {
                var _this = this;
                _this.cBh = data.cBh;
                $('#appControllerIpsc').removeClass('fd-hide');
                $('.fd-mask').removeClass('fd-hide');
                _this.serverUrl = _this.serverUrlQueryIpsc + '/' + _this.cBh;
                _this.flag = "ipDelete";
            },
            //删除
            clickRermove: function (index) {
                var _this = this;
                $.ajax({
                    method: config.methodGet,
                    url: _this.serverUrl,
                    dataType: 'json',
                    success: function (data) {
                        $.alert({
                            type: 'success',
                            info: {
                                success: '删除成功'
                            },
                            interval: 1800
                        });
                        $('#appControllerIpsc').addClass('fd-hide');
                        $('.fd-mask').addClass('fd-hide');
                        window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_this.flag, '*');
                        fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                    },
                    error: function (data, textStatus, errorThrown) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '删除失败'
                            },
                            interval: 1800
                        });
                        $('#appControllerIpsc').addClass('fd-hide');
                        $('.fd-mask').removeClass('fd-hide');
                        var flag = "ipRefresh";
                        window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(flag, '*');
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            //关闭弹窗
            ipglPopClose: function () {
                $('#appControllerIpsc').addClass('fd-hide');
                $('.fd-mask').addClass('fd-hide');
            }
        },
        created: function () {
            fdEventBus.$on('appIpglSc',this.ipglSc);
        },
        destoried:function() {
            fdEventBus.$off('appIpglSc');
        }
    }
});
