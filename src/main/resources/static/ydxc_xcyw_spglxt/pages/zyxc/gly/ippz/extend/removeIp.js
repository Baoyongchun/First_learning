// 分模块
define(['fdGlobal', 'config','fdDataTable', 'scrollbar', 'fdComponent2', "dragFun", 'userBehavior', 'jqueryUi', 'layDate'],
    function (fdGlobal, config,fdDataTable, scrollbar, fdComponent2, dragFun, userBehavior, jqueryUi, layDate) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        var scrollBar1;
    // ip分配删除
    var ipglsc = new Vue({
        el: "#appControllerIpsc",
        data: {
            cBh: '',
            //删除
            serverUrlQueryIpsc: _config.url.frame.scIp,
            flag:'',
            cId:'',//消息提醒删除
            tztgRemove: _config.url.frame.tztgRemove,//删除暂存数据
            serverUrl:''
        },

        methods: {
            bindMessage: function () {
                var _this = this;
                $(window).on('message', function (evt) {
                    var mesStr = typeof(evt.originalEvent.data) != 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
                    if (mesStr.flag == 'ipglsc') {
                        _this.cBh = mesStr.cBh;
                        $('#appControllerIpsc').removeClass('fd-hide');
                        $('.fd-mask').removeClass('fd-hide');
                        _this.serverUrl = _this.serverUrlQueryIpsc + '/' + _this.cBh;
                        _this.flag = "ipDelete";
                    }else if (mesStr.flag == 'xxtxsc') {//删除
                        _this.cId = mesStr.cId;
                        $('#appControllerIpsc').removeClass('fd-hide');
                        $('.fd-mask').removeClass('fd-hide');
                        _this.serverUrl = _this.tztgRemove + '/' + _this.cId;
                        _this.flag = "xxtxRe";
                    }
                })
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
                        window.document.getElementById("fd-ldjf-mainiframe").contentWindow.postMessage(_this.flag, '*');
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
                        $('.fd-mask').addClass('fd-hide');
                        var flag = "ipRefresh";
                        window.document.getElementById("fd-ldjf-mainiframe").contentWindow.postMessage(flag, '*');
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
            this.bindMessage();

        }
    });
})
