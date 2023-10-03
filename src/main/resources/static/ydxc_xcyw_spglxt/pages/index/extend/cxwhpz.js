define(['fdGlobal', 'config', 'fdComponent2', 'fdEventBus'],
    function (fdGlobal, config, fdComponent2, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // modal里面数据集合
                    modealObj: {
                        //id
                        cId: null,
                        // 一级行政
                        cYjxzqhDz: '江苏',
                        // cYjxzqhJc: '苏',
                        // 所属行业代字
                        // cSshyDz: '监',
                        // // 业务类型代字
                        // cYwlxDz: '查',
                        // // 流水号
                        // lsh: '监',
                        // 流水号开始
                        cLshksz: '000001',
                        dYxqKs: null,
                        dYxqJs: null,
                        // 开始年份
                        nKsnf: 2020,
                    },
                    startModalInfo: null,
                    // 文号的id
                    whId: '',
                    //操作列
                    cz: {
                        bj: "编辑",
                        qd: "启动",
                        ty: "停用",
                        sc: "删除"
                    },
                    //保存文号配置 获取文号配置 删除文号配置
                    cxwhpzUrl: config.url.frame.cxwhpzUrl,
                    //编辑保存文号配置
                    bjcxwhpzUrl: config.url.frame.bjcxwhpzUrl,
                    //启用文号配置
                    qywhpzUrl: config.url.frame.qywhpzUrl,
                    //停用文号配置
                    tywhpzUrl: config.url.frame.tywhpzUrl
                }
            },
            methods: {
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 编辑弹窗
                 */
                modalcxwhbjPz: function (val) {
                    var _this = this;
                    // 传id值
                    _this.whId = val._data.id;
                    _this.cxwhpzUrl = val._data.cxwhpzUrl;
                    _this.$refs.editRquest.open();
                    // 获取文号配置
                    _this.getCxwh();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 新建弹窗
                 */
                modalcxwhbjXj: function (val) {
                    var _this = this;
                    // 传id值
                    _this.whId = val._data.id;
                    _this.cxwhpzUrl = val._data.cxwhpzUrl;
                    _this.$refs.editRquest.open();
                    // 获取文号配置
                    _this.getCxwh();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 停用弹窗
                 */
                modalcxwhbjTy: function (val) {
                    var _this = this;
                    _this.startModalInfo = val._data.startModalInfo;
                    _this.whId = val._data.id;
                    _this.$refs.startWidiow.open();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 启用弹窗
                 */
                modalcxwhbjQy: function (val) {
                    var _this = this;
                    _this.startModalInfo = val._data.startModalInfo;
                    _this.whId = val._data.id;
                    _this.$refs.qyWidiow.open();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 删除弹窗
                 */
                modalcxwhbjSc: function (val) {
                    var _this = this;
                    _this.whId = val._data.id;
                    _this.$refs.delWidiow.open();
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 获取文号配置
                 */
                getCxwh: function () {
                    var _this = this;
                    Artery.ajax.get(_this.cxwhpzUrl, {
                        params: {
                            whId: this.whId
                        }
                    }).then(function (result) {
                        if (result.success && result.code === "200") {
                            _this.modealObj = result.data;

                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    });
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 点击停用 确认按钮
                 */
                closeTy: function () {
                    var _this = this;
                    _this.inactiveWh();
                    _this.$refs.startWidiow.close();
                    _this.reloadCxwh();
                },
                /**
                 *  * @Author gxd
                 *    @Date 2020/03/19
                 *    @description 点击启动 确认按钮
                 */
                closeQy: function () {
                    var _this = this;
                    _this.activeWh();
                    _this.$refs.qyWidiow.close();
                    _this.reloadCxwh();
                },

                /**
                 * 停用
                 */
                inactiveWh: function () {
                    Artery.ajax.get(this.tywhpzUrl, {
                        params: {
                            whId: this.whId
                        }
                    }).then(function (result) {
                        if (result.success && result.code === "200") {
                            Artery.notice.success({
                                title: '保存查询文号配置成功'
                            });
                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    });
                },
                /**
                 * 启用
                 */
                activeWh: function () {
                    Artery.ajax.get(this.qywhpzUrl, {
                        params: {
                            whId: this.whId
                        }
                    }).then(function (result) {
                        if (result.success && result.code === "200") {
                            Artery.notice.success({
                                title: '修改查询文号配置成功'
                            });
                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    });
                },
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description editModel确定按钮绑定事件
                 */
                subEdit: function () {
                    var _this = this;
                    var success = false;
                    var flag = this.validateCxwh();
                    if (flag) {
                        if (_this.modealObj.cId != null) {
                            success = _this.saveCxwhByEdit();
                        } else {
                            success = _this.saveCxwhByInsert();
                        }
                        if(success){
                            _this.$refs.editRquest.close();
                            _this.reloadCxwh();
                        }
                    } else {
                        Artery.notice.warning({
                            title: '请填写必填项！'
                        })
                    }

                },
                /**
                 * 验证查询文号
                 */
                validateCxwh: function () {
                    var flag = true;
                    // var arr = ["cYjxzqhDz", "cYjxzqhJc", "cSshyDz", "cYwlxDz"];
                    var arr = ["cYjxzqhDz"];
                    for (var item in arr) {
                        if (!this.modealObj[arr[item]] || this.modealObj[arr[item]].trim() === "") {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                },
                /**
                 * 刷新文号页面
                 */
                reloadCxwh: function () {
                    window.$('iframe#jsAppMainIframe')[0].contentWindow.location.reload();
                },
                /**
                 * 保存查询文号配置
                 */
                saveCxwhByInsert: function () {
                    var success = false;
                    $.ajax({
                        url: this.cxwhpzUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify(this.modealObj),
                        contentType:"application/json;charset=utf-8",
                        async: false,
                        success: function(result) {
                            if (result.success && result.code === "200") {
                                Artery.notice.success({
                                    title: '保存查询文号配置成功'
                                });
                                success = true;
                            } else {
                                Artery.notice.error({
                                    title: '保存失败',
                                    desc: result.message || "文号配置重复,请重新配置文号"
                                });
                            }
                        },
                        error: function(error) {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: error.message || "",
                                duration: 3000
                            });
                        }
                    });
                    return success;
                    /*Artery.ajax.post(this.cxwhpzUrl, this.modealObj).then(function (result) {
                        if (result.success && result.code === "200") {

                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    });*/

                },
                /**
                 * 编辑保存查询文号配置
                 */
                saveCxwhByEdit: function () {
                    var success = false;
                    $.ajax({
                        url: this.bjcxwhpzUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify(this.modealObj),
                        contentType:"application/json;charset=utf-8",
                        async: false,
                        success: function(result) {
                            if (result.success && result.code === "200") {
                                Artery.notice.success({
                                    title: '保存查询文号配置成功'
                                });
                                success = true;
                            } else {
                                Artery.notice.error({
                                    title: '保存失败',
                                    desc: result.message || "文号配置重复,请重新配置文号",
                                    duration: 3000
                                });
                            }
                        },
                        error: function(error) {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: error.message || ""
                            });
                        }
                    });
                    return success;
                   /* Artery.ajax.post(this.bjcxwhpzUrl, this.modealObj).then(function (result) {
                        if (result.success && result.code === "200") {
                            Artery.notice.success({
                                title: '保存查询文号配置成功'
                            });
                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    });*/
                },
                // 删除弹窗里的确认按钮
                closeDel: function () {
                    var _this = this;
                    _this.delCxwh();
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "CxwhpzScParent",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    // window.parent.parent.postMessage(_data,'*');
                    window.document.getElementById("jsAppMainIframe").contentWindow.postMessage(_data, '*');
                    _this.$refs.delWidiow.close();
                },
                /**
                 * 删除文号配置
                 */
                delCxwh: function () {
                    var _this = this;
                    Artery.ajax.delete(_this.cxwhpzUrl, {
                        params: {
                            whId: _this.whId
                        }
                    }).then(function (result) {
                        if (result.success && result.code === "200") {
                            Artery.notice.success({
                                title: '删除查询文号配置成功'
                            });
                            // 刷新列表页面
                            _this.reloadCxwh();
                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    });
                }
            },
            created: function () {
                // 调用多少个弹窗 就写对应的这个接收 --- 编辑
                fdEventBus.$on('appCxwhpzBj', this.modalcxwhbjPz);
                // 调用多少个弹窗 就写对应的这个接收 --- 停用
                fdEventBus.$on('appCxwhpzTy', this.modalcxwhbjTy);
                // 调用多少个弹窗 就写对应的这个接收 --- 启用
                fdEventBus.$on('appCxwhpzQy', this.modalcxwhbjQy);
                // 调用多少个弹窗 就写对应的这个接收 --- 删除

                fdEventBus.$on('appCxwhpzSc', this.modalcxwhbjSc);
                // 调用多少个弹窗 就写对应的这个接收 --- 新建
                fdEventBus.$on('appCxwhpzXj', this.modalcxwhbjXj);
            },
            // 销毁弹窗
            destoried: function () {
                // 销毁 编辑
                fdEventBus.$off('appCxwhpzBj', this.modalcxwhbjPz);
                // 销毁 停用
                fdEventBus.$off('appCxwhpzTy', this.modalcxwhbjTy);
                // 销毁 启用
                fdEventBus.$off('appCxwhpzQy', this.modalcxwhbjQy);
                // 销毁 删除
                fdEventBus.$off('appCxwhpzXj', this.modalcxwhbjXj);
            }
        }
    });
