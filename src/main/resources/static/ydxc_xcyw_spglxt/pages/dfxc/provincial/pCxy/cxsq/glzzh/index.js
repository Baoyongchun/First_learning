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
                subaccounts:[],
                measures:[],
                priorities:[],
                tabName: 'glzzhxx'

            }

        },
        methods: {
            /**
             * 初始化已反馈列表信息
             */
            initSubAccounts: function () {
                var _this = this;
                if(window.opener){
                    _this.subaccounts = window.opener.vm.subaccounts ? window.opener.vm.subaccounts : [];
                }
            },

            /**
             * 初始化未反馈列表信息
             */
            initMeasures: function () {
                var _this = this;
                if(window.opener){
                    _this.measures = window.opener.vm.measures ? window.opener.vm.measures : [];
                }
            },
            /**
             * 初始化未反馈列表信息
             */
            initPriorities: function () {
                var _this = this;
                if(window.opener){
                    _this.priorities = window.opener.vm.priorities ? window.opener.vm.priorities : [];
                }
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
            getTabName:function(code){
                switch (code) {
                    case '1':
                        return 'glzzhxx';
                    case '2':
                        return 'gyqxx';
                    case '3':
                        return 'qzcsxx';
                    default:
                        return '';
                }
            }
        },
        mounted: function () {
            var params = Artery.parseUrl();

            this.tabName = this.getTabName(params.tab);
            this.initSubAccounts();
            this.initMeasures();
            this.initPriorities();
        },
        created: function () {
            // this.progress();
        }
    });
})