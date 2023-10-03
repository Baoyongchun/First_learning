// 查询记录模块
define(['extend/template1.js', 'config'], function (template1, config) {
    var _config = JSON.parse(JSON.stringify(config));
    var vm = new Vue({
        el: '#jcsjgl',
        mixins: [template1],
        data: function () {
            return {
                //列表数据
                sjglList: [],
                // 总页数
                total: 2,
                // 分页参数
                queryInfo: {
                    limit: null,
                    offset: null,
                    px: 'desc',
                    type: ''
                },
                ymPicAddress: _config.url.frame.getYmPic,//印模地址
                // 当前页
                currentPageIndex: 1,
                // 暂无数据是否显示
                zwsjShow: false,
                // 同步基础数据是否可以点击
                tbjcsjDsiabled: false
            }
        },

        methods: {
            /**
             * 序号设置
             */
            setIndex: function (index) {
                return (index + 1) + (this.currentPageIndex - 1) * 10
            },
            /**
             * 初始化列表信息
             */
            init: function () {
                var _this = this;
                /*       _this.sjglList = _this.sjglList;
                       //当数据的长度等于0时，暂无数据显示
                       if (_this.sjglList.length <= 0 ) {
                           _this.zwsjShow = true;
                       } else {
                           _this.zwsjShow = false;
                       }
                       _this.total = result.total;*/
                // 重置标志位 防止重新加载无法刷新值
                _this.tbjcsjDsiabled = false;
                Artery.loadPageData(config.url.frame.jcsjListUrl, _this.queryInfo)
                    .then(function (result) {
                        _this.sjglList = result.data;
                        for (var i = 0; i < _this.sjglList.length; i++) {
                            _this.sjglList[i].filepath = _this.ymPicAddress + '?minioPath=' + _this.sjglList[i].filepath;
                            _this.sjglList[i].sfzk = true;
                            if (_this.sjglList[i].valid === 2) {
                                _this.tbjcsjDsiabled = true;
                            }
                            if (_this.sjglList[i].children) {
                                for (var j = 0; j < _this.sjglList[i].children.length; j++) {
                                    _this.sjglList[i].children[j].filepath = _this.ymPicAddress + '?minioPath=' + _this.sjglList[i].children[j].filepath;
                                }
                            }
                        }
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.sjglList.length <= 0) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.total = result.total;
                        var pMessage = {
                            message: 'shy-jcsjgl'
                        }
                        window.parent.postMessage(pMessage, '*');
                        _this.$refs.jcsjglTabel.collapseExpansion();
                    });
            },
            // 点击历史记录
            clickExtendRow: function (e, row) {
                this.$refs.jcsjglTabel.toggleRowExpansionByKey(row.type);
                row.sfzk = !row.sfzk;
            },
            // 表格绑定type值，点击展开收起的时候需要
            getRowKey: function (row) {
                return row.type
            },
            /**
             * 获取type
             */
            getKey: function () {
                // 从url里面获取type是印模还是上传基础数据
                this.queryInfo.type = Artery.parseUrl().type;
                this.uploadUrl += this.queryInfo.type;
            },
            /**
             * 排序触发
             * @param param
             */
            sortChange: function (param) {
                if (param.order === 'ascending') {
                    this.queryInfo.px = 'asc'
                } else {
                    this.queryInfo.px = 'desc'
                }
                this.$refs.jcsjglTabel.reloadData();
            },

            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.currentPageIndex = page.offset / page.limit + 1;
                this.init();
            },

            /**
             * 点击下载
             * @param props
             */
            clickLow: function (props) {
                window.open(config.url.frame.jcsjDownloadUrl + "?ids=" + props.id + '&type=' + props.type);
            },
            //上传基础数据
            uploadJcsj: function (row) {
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "scjcsj",
                    _data: {},
                    // 判断是证书还是文书的弹框
                    zsOrwsType: row.type
                };
                // 判断是印模还是上传基础数据
                dataBj._data = {
                    type: this.queryInfo.type
                };
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
            },
            // 打开同步基础数据弹窗
            openJcsj: function () {
                if (!this.tbjcsjDsiabled) {
                    var dataBj = {
                        flag: "notbjcsj",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data, '*');
                } else {
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "tbjcsj",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data, '*');
                }
            },
            //点击印模后弹框
            openYm: function (url) {
                var dataCkYm = {
                    flag: "ckYm",
                    _data: url
                };
                // 给首页发消息
                window.parent.parent.postMessage(JSON.stringify(dataCkYm), '*');
            },
            getIndex: function (index) {
                return this.queryInfo.offset + index + 1;
            }
        },

        created: function () {
            /**
             *  * @Author qhy
             *    @Date 2020/03/06
             *    @description 父页面给子页面发送消息  ---
             */
            var _this = this;

            // 获取是印模还是上传基础数据
            _this.getKey();

            window.addEventListener('message', function (evt) {
                var evts = JSON.parse(evt.data);
                if (evts.flag === 'backScjcsj') {
                    _this.$refs.jcsjglTabel.reloadData()
                }
            }, false);


        }
    });

});
