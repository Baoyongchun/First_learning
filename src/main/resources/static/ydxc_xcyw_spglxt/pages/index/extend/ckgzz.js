define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config,fdComponent2,fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // 不通过原因  ----- 只传值
                    ckgzzSrc: '',
                    // 工作证点击缩放的初始大小
                    currentScale: 1
                }
            },
            methods: {
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 已审核的不通过原弹窗
                 */
                modalCkgzz:function (val) {
                    this.ckgzzSrc = val._data;
                    this.$refs.ckgzzModel.open();
                    // 每次点击查看工作证时，工作证处于正常大小（没放大也没缩小）
                    this.currentScale = 1;
                    this.$refs.bigImg.style.transform = "scale(" + this.currentScale + ")";
                    // 每次点击查看工作证时，工作证容器处于原始位置
                    this.$refs.bigImgW.style.top = 0;
                    this.$refs.bigImgW.style.left = 0;
                },
                //关闭不通过原因modal
                closeModalRefuseReason: function () {
                    this.$refs["gzBtgyyModel"].close();
                },
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appCkgzz',this.modalCkgzz);
            },
            // 销毁弹窗
            destoried:function () {
                // 销毁
                fdEventBus.$off('appCkgzz',this.modalCkgzz);
            }
        }
    });
