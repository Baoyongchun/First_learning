// 查询记录模块
define(['extend/template1.js', 'fdGlobal', 'config'], function (template1, fdGlobal, config, fdEventBus) {

    var vm = new Vue({
        el: '#jsAppControllerCxwhpz',
        mixins: [template1],
        data: {
            //文号ID
            whId: '',
            optionCxwhpz: { //信息查询目录分页
                totalPage: 10,
                totalSize: 100,
                currentSize: 10,
                currentPage: 1,
                showPoint: false,
                showPage: 4,
                prev: ' ',
                next: " ",
                first: " ",
                last: " ",
                callback: function (num) {
                    /* console.log(num)*/
                }
            },
            // 总记录数
            zjls: 10,
            // 数据总数
            zh: 2,
            //操作列
            cz: {
                bj: "编辑",
                qd: "启动",
                ty: "停用",
                sc: "删除"
            },
            //启用提示
            qyTs:'只能有一个生效文号，当前生效，其他自动失效',
            // 查询记录list
            cxwhpzDataList: [],
            // modal里面数据集合
            modealObj: {
                //id
                cId: null,
                // 一级行政
                cYjxzqhDz: '江苏',
                cYjxzqhJc: '苏',
                // // 二级行政区划代字数据列表
                // erjxzqhlist: [{
                //     code: 'beijing',
                //     codeType: 'beijing',
                //     name: '北京市mm'
                // }, {
                //     code: 'shanghai',
                //     codeType: 'shanghai',
                //     name: '上海市'
                // }, {
                //     code: 'shenzhen',
                //     codeType: 'shenzhen',
                //     name: '深圳市'
                // }],
                // // 二级行政区划代字数据列表选中值
                // erjxzqhValue: null,
                // // 二级行政简称
                // ejjc: '苏2',
                // 所属行业代字
                cSshyDz: '监',
                // 业务类型代字
                cYwlxDz: '查',
                // 流水号
                lsh: '监',
                // 流水号开始
                cLshksz: '000001',
                dYxqKs: null,
                dYxqJs: null,
                // 开始年份
                nKsnf: 2020,
                // // 适用范围数据列表
                // syfwList: [{
                //     code: 'beijing',
                //     codeType: 'beijing',
                //     name: '北京市'
                // }, {
                //     code: 'shanghai',
                //     codeType: 'shanghai',
                //     name: '上海市'
                // }, {
                //     code: 'shenzhen',
                //     codeType: 'shenzhen',
                //     name: '深圳市'
                // }],
                // // 适用范围数据列表选中值
                // syfwValue: null,
            },
            //是否查询过
            queryFlag: false,
            //保存文号配置 获取文号配置 删除文号配置
            cxwhpzUrl: config.url.frame.cxwhpzUrl,
            //编辑保存文号配置
            bjcxwhpzUrl: config.url.frame.bjcxwhpzUrl,
            //启用文号配置
            qywhpzUrl: config.url.frame.qywhpzUrl,
            //停用文号配置
            tywhpzUrl: config.url.frame.tywhpzUrl,
            //获取文号配置列表数据
            hqwhpzlbUrl: config.url.frame.hqwhpzlbUrl,
            startModalInfo: null,
            queryInfo: {},
            query: {
                // 分页数据
                pageNow: 1,
                pageSize: getLimit(),
                offset: 0,
                currentSize: ''
            },
            //暂无数据是否显示
            zwsjShow:false
        },
        // 创建
        created: function () {
            var _this = this;
            _this.init();
            /**
             *  * @Author qhy
             *    @Date 2020/03/06
             *    @description 父页面给子页面发送消息  --- 删除
             */
            window.addEventListener('message', function (evt) {
                if (evt.data.flag == 'CxwhpzScParent') {
                    _this.init();
                    window.location.reload();
                }
            }, false);
        },
        methods: {
            ready: function (scrollbar) {
                scrollbar.update();
            },
            // 查询文号配置按钮绑定事件
            requestCzwhpz: function () {
                var _this = this;
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "CxwhpzXj",
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = {
                    id: '',
                    cxwhpzUrl: _this.cxwhpzUrl
                };
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
            },
            // 编辑链接打开editModel绑定事件
            openModel: function (id) {
                var _this = this;
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "CxwhpzBj",
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = {
                    id: id,
                    cxwhpzUrl: _this.cxwhpzUrl
                };
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
                // _this.whId = id;
            },
            //editModel确定按钮绑定事件
            // subEdit: function () {
            //     var _this = this;
            //     if(_this.modealObj.cId != null ){
            //         _this.saveCxwhByEdit();
            //     } else {
            //         _this.saveCxwhByInsert();
            //     }
            //     _this.$refs.editRquest.close();
            //     parent.window.location.reload();
            // },

            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                this.query.offset = (this.query.pageNow - 1) * page.limit;
                this.init();
            },

            handleChangePageSize: function (page) {
                this.query.pageSize = page;
                this.init();
            },

            /**
             * 初始化列表数据
             */
            init: function () {
                var _this = this;
                _this.queryInfo.limit = _this.query.pageSize;
                _this.queryInfo.offset = _this.query.offset;
                Artery.ajax.post(this.hqwhpzlbUrl, this.queryInfo).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.cxwhpzDataList = result.data.data;
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.cxwhpzDataList.length <= 0 ) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.zjls = result.data.total;
                        if (parseInt(_this.zjls / _this.query.pageSize) == _this.query.pageNow - 1) {
                            _this.query.currentSize = _this.zjls;
                        } else {
                            _this.query.currentSize = _this.query.pageSize * (_this.query.pageNow);
                        }
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                    if(_this.$refs.whpzScroll){
                        _this.$refs.whpzScroll.update();
                    }
                });
            },

            /**
             * 获取文号配置
             */
            getCxwh: function () {
                var _this = this;
                Artery.ajax.get(this.cxwhpzUrl, {
                    params: {
                        whId: this.whId
                    }
                }).then(function (result) {
                    console.log(result);
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
            // 点击启用  调取弹窗
            start: function (id) {
                var _this = this;
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "CxwhpzQy",
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = {
                    id: id,
                    startModalInfo: _this.qyTs
                };
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
                // _this.startModalInfo = _this.cz.qd;
                // _this.whId = id;
                // _this.$refs.startWidiow.open();
            },
            // 点击停用  调取弹窗
            stop: function (id) {
                var _this = this;
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "CxwhpzTy",
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = {
                    id: id,
                    startModalInfo: _this.cz.ty
                };
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
            },

            // delModel
            openDel: function (id) {
                var _this = this;
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "CxwhpzSc",
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = {
                    id: id
                };
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
                // _this.whId = id;
                // _this.$refs.delWidiow.open();
            },

        }

    })
    window.vm = vm
    return vm

})