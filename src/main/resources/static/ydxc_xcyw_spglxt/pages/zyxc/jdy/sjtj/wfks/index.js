// 查询记录模块
define(['extend/template1.js'], function (template1) {

    new Vue({
        el: '#jsApp',
        mixins: [template1],
        data: {
            queryInfo: {},
            query:{
                // 分页数据
                pageNow: 1,
                pageSize: getLimit(),
                offset:0,
                currentSize:''
            },
            //查询条件
            cxtj: {
                endDate: '', //申请结束时间
                startDate: '', //申请开始时间
                xcdw:'',
                sqdw:'',
                sjy:'',
                tjfs: '',//申请状态
                //时间戳
                time: ''
            },
            tjfsList: [],
            // 当前页码
            pageNow: 10,
            // 总条数
            total: '',
            // 表格数据
            wfkDataList: []
        },

        created: function () {
            var params = Artery.parseUrl();
            var _this = this;
            _this.cxtj.endDate = params.endDate;
            _this.cxtj.startDate = params.startDate;
            _this.cxtj.xcdw = params.xcdwId;
            _this.cxtj.sjy = params.sjyId;
            _this.cxtj.sqdw = params.sqdw;
            var tdObj = $('.fd-table-wraper02 tr th');
            var len = tdObj.length;
            // 表头th的宽度等于td的宽度
            for (var i = 0; i < len; i++) {
                $('.fd-table-01 tr td').eq(i).css('width', tdObj.eq(i).width() + 'px');
            }
        },
        methods: {
            goBack:function(){
                window.location.href = "../index.html"
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                this.query.offset = (this.query.pageNow -1)* page.limit;
                this.loadPageData();
            },

            handleChangePageSize: function (page) {
                this.query.pageSize = page;
                this.loadPageData();
            },
            loadPageData : function () {
                var _this = this;
                _this.queryInfo.limit = _this.query.pageSize;
                _this.queryInfo.offset = _this.query.offset;
                _this.cxtj.time = Date.now();
                //设置ajax请求超时时间
                Artery.ajax.interceptors.request.use(function(config){
                    config.timeout = 30000;
                    return config;
                });
                Artery.loadPageData("/api/v1/sjtj/getWfkData", _this.queryInfo, _this.cxtj)
                    .then(function (result) {
                        if (result.success) {
                            _this.wfkDataList = result.data.data;
                            _this.total = result.data.total;
                            if(parseInt(_this.total/_this.query.pageSize) === _this.query.pageNow -1){
                                _this.query.currentSize = _this.total;
                            } else {
                                _this.query.currentSize = _this.query.pageSize * (_this.query.pageNow);
                            }
                            _this.$refs.wfksScroll.update();
                        } else {
                            Artery.message.error(result.message);
                        }
                    });
            }
        }

    })

});
