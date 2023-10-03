define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config,fdComponent2,fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    scrollable: true,
                    title:'提交审批表',
                    // 提交审批的信息（是否提交审批）
                    message: '审批表中内容尚未填写完整，请补充完整后再提交审批。'
                }
            },
            methods: {
                /**
                 *  * @Author nfj
                 *    @Date 2020/05/29
                 *    @description 打开提交审批弹框
                 */
                modalTjsp:function (val) {
                    // 需要显示的内容（根据返回的数据渲染）
                    // this.message = val.data.btgyy;
                    var msg = '';
                    for (var i = 0; i < val.data.length; i++) {
                        msg += ("<p style=\"text-align:left\">"+(i+1)+"、"+val.data[i]+"；</p>");
                    }
                    this.message = msg;
                    this.title = '提示';
                    this.$refs.tjspCxsqModel.open();
                },
                // 确定提交审批的弹框
                okTjspModal: function () {
                    this.$refs["tjspCxsqModel"].close();
                },
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appOpenCxsqTjsp',this.modalTjsp);
            },
            // 销毁弹窗
            destoried:function () {
                // 销毁
                fdEventBus.$off('appOpenCxsqTjsp',this.modalTjsp);
            }
        }
    });
