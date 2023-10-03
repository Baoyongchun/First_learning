define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config,fdComponent2,fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // 不通过原因  ----- 只传值
                    ygzbtgyy: '审批表缺少部室领导签字，故不予盖章。'
                }
            },
            methods: {
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 已审核的不通过原弹窗
                 */
                modalygz:function (val) {
                    this.ygzbtgyy = val._data.btgyy;
                    this.$refs.gzBtgyyModel.open();
                },
                //关闭不通过原因modal
                closeygzModalRefuseReason: function () {
                    this.$refs["gzBtgyyModel"].close();
                },
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appYgzBgzyy',this.modalygz);
            },
            // 销毁弹窗
            destoried:function () {
                // 销毁
                fdEventBus.$off('appYgzBgzyy',this.modalygz);
            }
        }
    });
