// 查询记录模块
define(['extend/template1.js', 'config'], function (template1, config) {
    var _config = JSON.parse(JSON.stringify(config));
    var vm = new Vue({
        el: '#jcsjgl',
        mixins: [template1],
        data: function () {
            return {
                // 状态
                zt: '',
                // 状态列表
                ztList: [{
                    code: 1,
                    name: '生效'
                }, {
                    code: 2,
                    name: '失效'
                }],
                //已反馈列表数据
                yfkList: [],
                // 未反馈列表数据
                wfkList:[],
                wfkPageNow: 1,
                wfkTotal: 0,
                yfkTotal: 1,
                yfkPageNow: 0,
                //artery封装查询对象
                queryInfoyfk: {
                    limit: 10,
                    offset: 0
                },
                //artery封装查询对象
                queryInfowfk: {
                    limit: 10,
                    offset: 0
                },
                // 进度条值
                progressNum:'30',
                // 进度, 分数形式
                progressFenshu: '',
                // 申请编号
                sqbh: '',
                // 查询号
                cxh: '',
                url: {
                    fkjd: _config.url.frame.serverUrlFkjd   //反馈进度
                },
            }

        },
        methods: {
            /**
             * 初始化已反馈列表信息
             */
            initYfk: function () {
                var _this = this;
                Artery.loadPageData(this.url.fkjd + _this.sqbh, _this.queryInfoyfk, {
                    status: 'yfk'
                }).then(function (result) {
                    _this.yfkList = result.data;
                    _this.yfkPageNow = _this.yfkList.length;
                    _this.yfkTotal = result.total;
                });
            },

            /**
             * 初始化未反馈列表信息
             */
            initWfk: function () {
                var _this = this;
                Artery.loadPageData(this.url.fkjd + _this.sqbh, _this.queryInfowfk, {
                    status: 'wfk'
                }).then(function (result) {
                    _this.wfkList = result.data;
                    _this.wfkPageNow = _this.wfkList.length;
                    _this.wfkTotal = result.total;
                });
            },
            uploadJcsj: function () {},

            goBack: function () {
                // window.location.href = '../index.html'

                window.history.go(-1);//返回上一页不刷新
            },

            // 已反馈切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNowYfk: function (page) {
                this.queryInfoyfk.offset = page.offset;
                this.initYfk(this.queryInfoyfk);
            },
            // 未反馈切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNowWfk: function (page) {
                this.queryInfowfk.offset = page.offset;
                this.initWfk(this.queryInfowfk);
            },
            // 进度条
            progress:function(){
                var _this = this;
                var url = location.search;
                var theRequest = new Object();
                if(url.indexOf("?" != -1)){
                    var str = url.substr(1);
                    var strs = str.split("&");
                    for(var i = 0; i<strs.length;i++){
                        theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
                    }
                }

                _this.progressFenshu = theRequest.jd.replace('%', '');
                _this.progressNum = Math.round(parseInt(_this.progressFenshu.split('/')[0])/parseInt(_this.progressFenshu.split('/')[1]) * 100);
                _this.sqbh = theRequest.bh;
                _this.cxh = decodeURI(theRequest.cxh);
            }
        },
        mounted: function () {
            this.initYfk();
            this.initWfk();
        },
        created: function () {
            this.progress();
        }
    });
})