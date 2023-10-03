// 查询记录模块
define(['extend/template1.js'], function (template1) {
    var vm = new Vue({
        el: '#jscxjc',
        mixins: [template1],
        data: function () {
            return {
                // 列表数据
                drfkjgList: [
                    {
                        fkwjmc:'20200507查询结果.zip',
                        drsj:'2019-xx-xx xx:xx:xx',
                        jgcszt:'未传输',
                        jgcssj:'2019-xx-xx xx:xx:xx'
                    },
                    {
                        fkwjmc:'20200507查询结果.zip',
                        drsj:'2019-xx-xx xx:xx:xx',
                        jgcszt:'未传输',
                        jgcssj:'2019-xx-xx xx:xx:xx'
                    },
                    {
                        fkwjmc:'20200507查询结果.zip',
                        drsj:'2019-xx-xx xx:xx:xx',
                        jgcszt:'未传输',
                        jgcssj:'2019-xx-xx xx:xx:xx'
                    },
                    {
                        fkwjmc:'20200507查询结果.zip',
                        drsj:'2019-xx-xx xx:xx:xx',
                        jgcszt:'未传输',
                        jgcssj:'2019-xx-xx xx:xx:xx'
                    },
                    {
                        fkwjmc:'20200507查询结果.zip',
                        drsj:'2019-xx-xx xx:xx:xx',
                        jgcszt:'未传输',
                        jgcssj:'2019-xx-xx xx:xx:xx'
                    }
                ],
                // 状态
                zt:'',
                // 状态列表
                ztList: [{
                    code: '0',
                    name: '未传输'
                }, {
                    code: '1',
                    name: '传输成功'
                }, {
                    code: '3',
                    name: '传输失败'
                }],
                pageNow: 20,
                total: 30,
                queryInfo: {},
                query:{
                    // 分页数据
                    pageNow: 1,
                    pageSize: 10,
                    offset:0,
                    currentSize:''
                }, //查询条件
                cxtj: {
                    drkssj: '',
                    drjssj: '',
                    zt: '0'
                },
                currentPageIndex: 1,
                bhList:new Set(),
                // 设置日期前后选择
                options3: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.drjssj).valueOf() - 86400000;
                        }
                    }
                })(this),
                // 设置日期前后选择
                options4: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.drkssj).valueOf();
                        }
                    }
                })(this),
                //暂无数据是否显示
                zwsjShow:false,
                url: {
                    listDrfkjg: 'api/v1/drfkjg/list',
                    uploadFkjg: 'api/v1/drfkjg/upload'
                }
            }
        },
        // 创建
        created: function () {

        },
        mounted: function () {
            var _this = this;
            _this.$nextTick(function () {
                $('.fd-table-header .aty-checkbox-input').change(function () {
                    _this.selectable1()
                })
            });
            _this.loadData()
        },
        methods: {
            // 设置表格序号
            getIndex: function (index) {
                return (index + 1) + (this.currentPageIndex - 1) * 10
            },

            /**
             * @Author: wlq
             * @name: drjg
             * @description: 点击导入结果
             * @return: {undefined}
             */
            drjg: function() {
                var _this = this;

            },

            /**
             * 加载列表数据
             */
            loadData: function() {
                var _this = this;
                Artery.axios.post(_this.url.listDrfkjg, {
                    drkssj: _this.cxtj.drkssj,
                    drjssj: _this.cxtj.drjssj,
                    limit: _this.query.pageSize,
                    offset: _this.query.offset
                }).then(function (result) {
                    _this.drfkjgList = result.data;
                    _this.total = result.total;
                })
            },

            /**
             * 选择申请开始时间
             * @param date
             */
            selectSqsjStart: function (date) {
                var _this = this;
                if (new Date(this.cxtj.drjssj) < new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    });
                    _this.cxtj.drkssj = "";
                } else {
                    _this.queryInfo.offset = 0;
                    _this.selectddc();
                }
            },
            /**
             * 选择申请结束时间
             * @param date
             */
            selectSqsjEnd: function (date) {
                var _this = this;
                if (new Date(this.cxtj.drkssj) > new Date(date)) {
                    Artery.notice.warning({
                        title:"开始时间不能大于结束时间"
                    });
                    _this.cxtj.drjssj = "";
                } else{
                    _this.queryInfo.offset = 0;
                    _this.selectddc();
                }
            },
            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param {type}
             * @return: {undefined}
             */
            selectDw: function (newValue, oldValue) {
                var _this = this;
                _this.queryInfo.offset = 0;
                _this.selectddc(_this.queryInfo);
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.query.pageNow = Math.ceil((page.offset + 1) / page.limit);
                this.query.offset = (this.query.pageNow -1)* page.limit;
                this.currentPageIndex = pageInfo.offset / page.limit + 1;
                this.selectddc();
            },

            handleChangePageSize: function (page) {
                this.query.pageSize = page;
                this.selectddc();
            }
        }
    })


})
