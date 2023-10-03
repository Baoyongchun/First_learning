/*
 * @Author: DengShuai
 * @Date: 2021-04-01
 * @LastEditors: DengShuai
 * @LastEditTime: 2021-04-01
 * @Description: 消息通知
 */
define(['fdEventBus', 'config', 'fdGlobal', 'Promise'], function (fdEventBus, config, fdGlobal, Promise) {
    new Vue({
        el: '#jsAppControllerSqdbd',
        data: function () {
            return {
                pageshow:true,
                // 状态列表
                ztList: [{
                    code: 1,
                    name: '已完成',
                }, {
                    code: 2,
                    name: '未完成',
                }],
                //列表数据
                shList: [],
                pageNow: 10,
                total: 0,
                //artery封装查询对象
                queryInfo: {},
                query: {
                    offset: 0,
                    pageNow:1
                },
                // 初始化sort
                initSort:true,
                // 初始化sorelist
                initSortList:[],
                //查询条件
                cxtj: {
                    //差异处理状态 1已完成 2未完成
                    status: 1,
                    //申请单位
                    deptId: "",
                    //开始日期
                    startDate: "",
                    //结束日期
                    endDate: "",
                    //信息检索
                    keyword: ""
                },
                // 默认申请部门不可选
                disabled: false,
                disabledFbfw:false,
                optionKssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.startDate).valueOf();
                        }
                    }
                })(this),
                optionJssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.endDate).valueOf() - 86400000;
                        }
                    }
                })(this),
                currentPageIndex: 1,
                //暂无数据是否显示
                zwsjShow: false,
                // table 意见内容或者答复内容的重写title是否显示
                tableToolTipIsShow: false,
                // title 的内容
                tableToolTipCon: '',
                delRow: {},
                isClick: true,
                xxlbFlag:true,
            }
        },
        destroyed: function () {
            // 取消事件绑定
            // this.unbindEvent();
        },
        methods: {
            /**
             *  * @Author juxiang
             *    @description 组装请求数据
             */
            getRequestData (file) {
                var formData = new FormData();
                formData.append('file', file);
                return formData;
            },
            /**
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset: function () {
                // 如果查询条件有值，怎清空后重新请求数据
                this.cxtj = {
                    //差异处理状态 1已完成 2未完成
                    status: 1,
                    //申请单位
                    deptId: "",
                    //开始日期
                    startDate: "",
                    //结束日期
                    endDate: "",
                    //信息检索
                    keyword: ""
                }
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.pageshow = false;//让分页隐藏
                this.$refs.shTabel.clearSort();
                this.queryInfo.sortList = [{column: '1', dir: '2'}];
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.init(this.queryInfo);
            },
            setIndex: function (index) {
                return (index + 1) + (this.currentPageIndex - 1) * 10
            },
            /**
             * 初始化列表信息
             * @param queryInfo
             */
            init: function (queryInfo) {
                var _this = this;
                return new Promise(function(resolve, reject){
                    _this.queryInfo = queryInfo;
                    let sortListElement = {column: '1', dir: '2'}
                    if (_this.queryInfo.sortList && _this.queryInfo.sortList.length > 0) {
                        sortListElement = _this.queryInfo.sortList[0];
                    }
                    var queryCond = JSON.parse(JSON.stringify(_this.queryInfo));
                    delete queryCond.sortList
                    queryCond.sortField = sortListElement.column
                    queryCond.sortDir = sortListElement.dir
                    let _params = Object.assign(queryCond, _this.cxtj);
                    Artery.ajax.get("/itemBdResult/applyFormBdCountPage", {
                        params: _params
                    }).then(function (result) {
                        if(result.code) {
                            Artery.notice.error({
                                title: '查询失败！'
                            });
                            return;
                        }
                        _this.shList = result.data;
                        // 当数据的长度等于0时，暂无数据显示
                        _this.zwsjShow = _this.shList.length <= 0;
                        _this.total = result.total;
                        resolve(true);
                    }).catch(function (err) {
                        console.info(err);
                        reject(false);
                    });
                })
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.currentPageIndex = page.offset / page.limit + 1;
                this.init(this.queryInfo);
            },
            // 查询
            queryTable: function () {
                var _this = this
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.$refs.shTabel.clearSort();
                _this.queryInfo.sortList = [{column: '1', dir: '2'}];
                this.init(this.queryInfo);
            },
            // 列表排序查询
            sortChange: function (sort) {
                if (sort && sort.order) {
                    this.query.pageNow = 1;
                    this.queryInfo.offset = 0;
                    this.currentPageIndex = 1;
                    var queryInfo = this.queryInfo;
                    queryInfo.offset = 0;
                    var dir = sort.order === 'descending' ? '2' : '1';
                    var prop = '1'
                    if (sort.prop === "dSqrq") {
                        prop = '1'
                    } else if (sort.prop === "notResolvedCount") {
                        prop = '2'
                    }
                    queryInfo.sortList = [{column: prop, dir: dir}];
                    this.initSort = false;
                    this.init(queryInfo)
                }
            },
            headerCellClassName: function(rowItem) {
                if (this.initSort) {
                    if (this.initSortList.length === 1 && this.initSortList[0].column === rowItem.column.property) {
                        const sort = this.initSortList[0].dir;
                        this.initSortList = [];
                        return sort.dir === 'desc' ? 'descending' : 'ascending'
                    }else if(rowItem.column.property === 'dSqrq') {
                        return 'descending'
                    }
                }
            },
            //点击查询项查看详情
            clickXq: function (row) {
                const query = JSON.parse(JSON.stringify(this.cxtj));
                query.limit = this.queryInfo.limit;
                query.offset = this.queryInfo.offset;
                query.sortList = this.queryInfo.sortList;
                query.pageNow = this.query.pageNow;
                fdGlobal.saveLocalStorage("cxjc-search", JSON.stringify(query));
                window.location.href = '../sqdbdInfo/index.html?bh=' + row.cBh + "&cxh=" + row.cCxh;
            },
        },
        created: function () {
            var _this = this;
            _this.xxlbFlag=true;
            this.pageNow = getLimit();
        },
        mounted: function () {

        }
    })
});
