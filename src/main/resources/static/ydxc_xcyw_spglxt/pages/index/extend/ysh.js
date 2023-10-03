define(['fdGlobal', 'config', 'fdComponent2', 'fdEventBus'],
    function (fdGlobal, config, fdComponent2, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // 不通过原因  ----- 只传值
                    yshbtgyy: '',
                    row: {},
                    cfUrl: config.url.frame.cfUrl
                }
            },
            methods: {
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 已审核的不通过原弹窗
                 */
                modalysh: function (val) {
                    this.yshbtgyy = val._data.btgyy;
                    this.$refs.btgyyModel.open();
                },
                //关闭不通过原因modal
                closeYshModalRefuseReason: function () {
                    this.$refs.btgyyModel.close();
                },
                // 已审核重发弹窗
                modalyshCf: function (val) {
                    this.$refs["modalYshcf"].open();
                    this.row = val._data;
                },
                // 重发
                resetSend: function () {
                    var _this = this;
                    Artery.ajax.get(_this.cfUrl, {
                        params: {
                            sqbh: _this.row.bh
                        }
                    }).then(function (result) {
                        if (result.success && result.code === "200") {
                            Artery.notice.success({
                                title: '重发成功'
                            });
                            setTimeout(function () {
                                //刷新列表
                                $('#jsAppMainIframe')[0].contentWindow.location.reload();
                            }, 1000)
                        } else {
                            Artery.notice.error({
                                title: '重发出错',
                                desc: result.message || ""
                            });
                        }
                        _this.$refs["modalYshcf"].close();
                    }).catch(function (err) {
                        Artery.notice.error({
                            title: '重发失败',
                        });
                        _this.$refs["modalYshcf"].close();
                    });
                }
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appYshBtgyy', this.modalysh);
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appYshCf', this.modalyshCf);
            },
            // 销毁弹窗
            destoried: function () {
                // 销毁
                fdEventBus.$off('appYshBtgyy', this.modalysh);
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$off('appYshCf', this.modalyshCf);
            }
        }
    });