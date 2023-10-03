define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config,fdComponent2,fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = false;
        return {
            data: function () {
                return {
                    row: {},
                    jbxx: {
                        cBh: '',
                        cBtgyy: ''
                    },
                    sendBackUrl: _config.url.frame.sendBackUrl,
                    // 退回原因字数限制提示
                    showThyy:false
                }
            },
            methods: {
                // type为5说明描述
                focusThyy:function(){
                    this.showThyy = true;
                },
                blurThyy:function(){
                    this.showThyy = false;
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description  打开重发弹窗
                 */
                modalcxjccf:function (val) {
                    this.$refs["modalCf"].open();
                    this.row = val._data;
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description  点击重发的确认按钮
                 */
                clickCf:function (row) {
                    this.$refs["modalCf"].close();
                    // 定义需要传递过去的数据
                    var dataBj={
                        flag:"CxjcCfParent",
                        _data:{}
                    };
                    // 给首页发消息
                    dataBj._data = row;
                    var _data =JSON.stringify(dataBj);
                    window.postMessage(_data,'*');
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                },
                modalSendBack: function (val) {
                    this.$refs["modalSendBack"].open();
                    this.jbxx = val._data;
                    this.jbxx.cBtgyy = '';
                },
                sendBack: function () {
                    var _this = this;
                    if(!_this.jbxx.cBtgyy) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写退回原因'
                            },
                            interval: 900
                        });
                        return;
                    }

                    Artery.ajax.post(_this.sendBackUrl, _this.jbxx).then(function (result) {
                        if(result.success) {
                            var ddcCxsqListRefresh = {
                                flag: "ddcCxsqListRefresh"
                            };
                            var _data = JSON.stringify(ddcCxsqListRefresh);
                            window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                            _this.$refs["modalSendBack"].close();
                            Artery.notice.success({
                                title: "退回成功"
                            });
                        } else {
                            Artery.notice.error({
                                title: '退回出错',
                                desc: result.message
                            });
                        }
                        _this.jbxx.cBtgyy = '';
                    }).catch(function (error) {
                        console.error(error);
                    });
                },
                clearThyy: function () {
                    this.jbxx.cBtgyy = '';
                },
                modalConfirmExportApply: function(val) {
                    this.$refs["modalConfirmExportApply"].open();
                },
                clickConfirmExportApply: function () {
                    var _data = {
                        flag: "doExportApply"
                    };
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                    this.$refs["modalConfirmExportApply"].close();
                }
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 --- 重发
                fdEventBus.$on('appCxjcCf',this.modalcxjccf);
                fdEventBus.$on('appSendBack',this.modalSendBack);
                fdEventBus.$on('appConfirmExportApply',this.modalConfirmExportApply);
            },
            // 销毁弹窗
            destoried:function () {
                fdEventBus.$off('appCxjcCf',this.modalcxjccf);
                fdEventBus.$off('appSendBack',this.modalSendBack);
                fdEventBus.$off('appConfirmExportApply',this.modalConfirmExportApply);
            }
        }
    });
