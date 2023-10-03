/*
 * @Author: nfj
 * @Date: 2020-05-07
 * @LastEditors: nfj
 * @LastEditTime: 2020-05-07
 * @Description: 反馈意见管理弹框：查看详情/答复
 */
define(['fdGlobal', 'config', 'fdComponent2', 'fdEventBus'],
    function (fdGlobal, config, fdComponent2, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // 答复内容
                    dfContent: '审批表缺少部室领导签字，故不予盖章。',
                    // 意见内容
                    yjContent: '审批表缺少部室领导签字，故不予盖章。',
                    // 判断是答复还是查看详情1是查看详情2是答复
                    type: 1,
                    // 答复内容
                    dfTextarea: '',
                    // 意见id
                    id: '',
                    //参数列表
                    params: {
                        id: '',
                        reply: ''

                    },
                    wordLength: 0,
                    // 展示字数限制提示
                    showFkyjLimit:false
                }
            },
            methods: {
                //反馈意见聚焦
                focusfkyj:function(){
                    this.showFkyjLimit = true;
                },
                //反馈意见失焦
                blurfkyj:function(){
                    this.showFkyjLimit = false;
                },
                /**
                 *  * @Author nfj
                 *    @Date 2020/05/07
                 *    @description 反馈意见管理弹框
                 */
                modalFkyjglCkxq: function (val) {
                    this.wordLength = 0;
                    // 回复内容
                    this.dfContent = val._data.reply;
                    // 意见内容
                    this.yjContent = val._data.content;
                    this.params.id = val._data.id;
                    // 是详情的弹框还是答复的弹框
                    this.type = val.type;
                    this.$refs.fkyjglCkxqModel.open();
                },
                // 用户输入的方法
                inputWord: function() {
                    // 用户输入的长度
                    this.wordLength = this.dfTextarea.length;
                },
                // 答复取消按钮
                cancelFkyjglModal:function(){
                    this.dfTextarea = '';
                },
                // 答复确认按钮
                okFkyjglModal: function () {
                    var _this = this;
                    _this.params.reply = _this.dfTextarea;
                    if(!_this.dfTextarea.length>0){
                    	$.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写答复内容！'
                            },
                            interval: 1000
                        });
                    	
                    	return false;
                    }       
                    Artery.loadPageData("/api/feedback/reply", _this.params).then(function (result) {
                        if (result.success && result.code === "200") {                           
                          	 $.alert({
                                 type: 'success',
                                 info: {
                                     success: '答复成功！'
                                 },
                                 interval: 1800
                             })
                            _this.dfTextarea = '';
                            _this.$refs.fkyjglCkxqModel.close();
                            // 反馈意见管理的url
                            var _data = {
                                name: '反馈意见管理',
                                key: 'fkyjgl',
                                count: 0,
                                url: './../zyxc/gly/fkyjgl/index.html',
                                children: [],
                                show: false
                            };
                            _this.clickNavList(_data, 18);
                        } else {                           
                        	 $.alert({
                                 type: 'fail',
                                 info: {
                                     fail: '提交失败！'
                                 },
                                 interval: 1800
                             });                        	
                        }
                    });
                },
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appFkyjglCkxq', this.modalFkyjglCkxq);
            },
            // 销毁弹窗
            destoried: function () {
                // 销毁
                fdEventBus.$off('appFkyjglCkxq', this.modalFkyjglCkxq);
            }
        }
    });
