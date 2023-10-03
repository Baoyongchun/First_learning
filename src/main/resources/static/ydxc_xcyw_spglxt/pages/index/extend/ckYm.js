define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config,fdComponent2,fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // 不通过原因  ----- 只传值
                    ckYmSrc: '',
                    // 印模点击缩放的初始大小
                    currentScale: 1
                }
            },
            methods: {
                /**
                 *  * @Author fengyan
                 *    @Date 2021/02/23
                 *    @description 印模弹窗
                 */
                modalCkYm:function (val) {
                    this.ckYmSrc = val._data;
                    this.$refs.ckYmModel.open();
                    this.currentScale = 1;
                    this.$refs.bigImgYm.style.transform = "scale(" + this.currentScale + ")";
                },
                //关闭不通过原因modal
                closeModalRefuseReason: function () {
                    this.$refs["gzBtgyyModel"].close();
                },
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appCkYm',this.modalCkYm);
            },
            // 销毁弹窗
            destoried:function () {
                // 销毁
                fdEventBus.$off('appCkYm',this.modalCkYm);
            }
        }
    });
