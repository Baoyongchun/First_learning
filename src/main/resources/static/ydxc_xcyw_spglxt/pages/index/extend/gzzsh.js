define(['fdGlobal', 'config', 'fdComponent2','fdEventBus'],
    function (fdGlobal, config,fdComponent2,fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // 不通过原因  ----- 只传值
                    btgyy:'',
                    // 弹窗code值
                    gzzCode:'',
                    // 弹窗index值
                    gzzIndex:0,
                    // 传值
                    gzzspDataList:'',
                    // 不通过原因 --- 在textarea框里
                    btgReason:'',
                    getGzzSftg: _config.url.frame.getGzzSftg,
                    cBtgyy: '',//不通过原因
                    cBh: '',//编号
                    reason: '',//不通过原因,
                    // 不通过原因字数限制提示
                    showBtgyy:false
                }
            },
            methods: {
                // 不通过原因
                focusBtgyy:function(){
                    this.showBtgyy = true;
                },
                blurBtgyy:function(){
                    this.showBtgyy = false;
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 打开工作证里的弹窗
                 */
                modalgzzsh:function (val) {
                    var _this = this;
                    // this.gzzCode = val._data.code;
                    this.gzzIndex = val._data.index;
                    this.gzzspDataList = val._data.gzzspDataList;
                    var data =  val._data.data;
                    if(data.flag == 'pass'){
                        // 通过弹窗
                        this.$refs["modalTg"].open();
                    }else if(data.flag == 'failed'){
                        //不通过弹窗
                        this.$refs["modalBtg"].open();
                        //不通过原因弹窗
                    }else if (data.flag == "reason") {
                        this.$refs["modalBtgyy"].open();
                        this.btgyy = this.gzzspDataList[this.gzzIndex].cBtgyy;
                    }
                    /*新打开弹窗需要的*/
                    // if (data.flag === "reason") {
                    //      data.reason = this.gzzspDataList[index].cBtgyy;
                    //  }
                     _this.cBh = this.gzzspDataList[this.gzzIndex].cBh;
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 关闭通过弹窗
                 */
                gzzTgOk:function (index) {
                    this.btgBtn(index,"modalTg");
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 关闭不通过弹窗
                 */
                gzzBtgOk:function (index) {
                    this.btgBtn(index,"modalBtg");
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 打开不通过原因弹窗
                 */
                gzzBtgyyOk:function () {
                    this.$refs["modalBtgyy"].close();
                },
                //不通过或者通过
                btgBtn: function (index,modelName) {
                    var _this = this;
                    var msg = '';
                    var _serverData = {};
                    _serverData.cBtgyy = _this.btgReason;
                    _serverData.cBh = _this.cBh;
                    if (index === 2) {
                        _serverData.nZt = 2;
                        msg = "不通过成功";
                        if(!_this.btgReason){
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请填写不通过原因'
                                },
                                interval: 900
                            });
                            return false
                        }
                    } else if (index === 3) {
                        _serverData.nZt = 3;
                        msg = "通过成功";
                    }
                    $.ajax({
                        method: config.methodPost,
                        url: _this.getGzzSftg,
                        data: _serverData,
                        dataType: 'json',
                        success: function (data) {
                            if (data.code === "200") {
                                $('.fd-mask').addClass('fd-hide');
                                _this.$refs[modelName].close();
                                _this.failedText = true;
                                _this.btgReason = '';
                                _this.cBh = '';
                                $.alert({
                                    type: 'success',
                                    info: {
                                        success: msg
                                    },
                                    interval: 1800
                                });
//                         		刷新工作证审批页面
                                var gzzspRefresh = {
                                    flag: "gzzspRefresh"
                                }
                                var _data = JSON.stringify(gzzspRefresh)
                                window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                            }
                            _this.$refs["modalTg"].close();
                            //输出日志
                            // fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                        },
                        error: function (data, textStatus, errorThrown) {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '操作失败'
                                },
                                interval: 1800
                            });
                            //  报错信息
                            fdGlobal.requestError(data, textStatus, errorThrown);
                        }
                    });

                },
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                var _this = this;
                fdEventBus.$on('appGzzsh',_this.modalgzzsh);
            },
            // 销毁弹窗
            destoried:function () {
                // 销毁
                fdEventBus.$off('appGzzsh',this.modalgzzsh);
            }
        }
    });
