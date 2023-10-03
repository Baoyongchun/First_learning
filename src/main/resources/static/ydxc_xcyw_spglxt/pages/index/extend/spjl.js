define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config,fdComponent2,fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    jbxxRow:{},
                    // 审批记录的table
                    spjlData: [
                        /*{
                            'xh': 1,
                            'zt': 1,
                            'spr': 1,
                            'spjl': 1,
                            'spyj': 1,
                            'spsj': 1
                        },{
                            'xh': 1,
                            'zt': 1,
                            'spr': 1,
                            'spjl': 1,
                            'spyj': 1,
                            'spsj': 1
                        },{
                            'xh': 1,
                            'zt': 1,
                            'spr': 1,
                            'spjl': 1,
                            'spyj': 1,
                            'spsj': 1
                        },{
                            'xh': 1,
                            'zt': 1,
                            'spr': 1,
                            'spjl': 1,
                            'spyj': 1,
                            'spsj': 1
                        }*/
                    ]
                }
            },
            methods: {
                /**
                 *  * @Author nfj
                 *    @Date 2020/05/29
                 *    @description 打开审批记录弹框
                 */
                modalSpjl:function (val) {

                    var _this = this;
                    _this.jbxxRow = val.data;
                    _this.spjlData = val.spjl;
                    // _this.spjlData.forEach((item, index) => {item.xh = (index+1)});
                    for (var i = 0; i <  _this.spjlData.length; i++) {
                        _this.spjlData[i].xh = i+1;
                    }
                    this.$refs.spjlCxsqModel.open();
                    // this.$nextTick(function () {
                    //     _this.$refs.spjlScroll.update();
                    // })
                },
                // 确定审批记录的弹框
                okSpjlModal: function () {
                    this.$refs["spjlCxsqModel"].close();
                }
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appOpenCxsqSpjl',this.modalSpjl);
            },
            // 销毁弹窗
            destoried:function () {
                // 销毁
                fdEventBus.$off('appOpenCxsqSpjl',this.modalSpjl);
            }
        }
    });
