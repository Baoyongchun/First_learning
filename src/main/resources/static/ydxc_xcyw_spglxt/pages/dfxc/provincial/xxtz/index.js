/*
 * @Author: DengShuai
 * @Date: 2021-04-01
 * @LastEditors: DengShuai
 * @LastEditTime: 2021-04-01
 * @Description: 消息发布
 */
define(['fdEventBus', 'config', 'jquery'], function (fdEventBus, config, $) {

    new Vue({
        el: '#jsAppControllerXxtz',
        data: function () {
            return {
                pageshow: true,
                // 状态列表
                ztList: [
                    {
                        code: '1',
                        name: '未读'
                    }, {
                        code: '2',
                        name: '已读'
                    }
                ],
                //列表数据
                shList: [],
                pageNow: 10,
                total: 0,
                //artery封装查询对象
                queryInfo: {},
                query: {
                    offset: 0,
                    pageNow: 1
                },
                //查询条件
                cxtj: {
                    // 关键字
                    bt: '',
                    // 状态 1 未读 2 已读
                    readed: '',
                    //开始日期
                    publishTimeKs: '',
                    //结束日期
                    publishTimeJs: '',
                    sort: '-DT_PUBLISH_TIME'
                },
                // 默认申请部门不可选
                disabled: false,
                optionKssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.publishTimeJs).valueOf();
                        }
                    }
                })(this),
                optionJssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.publishTimeKs).valueOf() - 86400000;
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
                ckXxForm: {}
            }
        },
        destroyed: function () {
            // 取消事件绑定
            // this.unbindEvent();
        },
        methods: {
            /**
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset: function () {
                // 如果查询条件有值，怎清空后重新请求数据
                this.cxtj.bt = '';
                this.cxtj.readed = '';
                this.cxtj.publishTimeKs = '';
                this.cxtj.publishTimeJs = '';
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function () {//重新渲染分页
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
                _this.queryInfo = queryInfo;
                var _params = {};
                for (var _key in _this.queryInfo) {
                    _params[_key] = _this.queryInfo[_key];
                }
                for (var _key in _this.cxtj) {
                    _params[_key] = _this.cxtj[_key];
                }
                // _params.type = 28;
                Artery.ajax.get("/api/notice/page", {
                    params: _params
                }).then(function (result) {
                    if (result.code) {
                        Artery.notice.error({
                            title: '查询失败！'
                        });
                        return;
                    }
                    _this.shList = result ? result.data : [];
                    if (result.customData) {
                        var pMessage = {
                            message: 'xxtz-df',
                            count: result.customData.unReadCount ? result.customData.unReadCount : 0
                        }
                        // 如果带有查询条件，就不改变左侧数字
                        window.parent.postMessage(pMessage, '*');
                    }
                    // 当数据的长度等于0时，暂无数据显示
                    if (_this.shList.length == 0) {
                        _this.zwsjShow = true;
                    } else {
                        _this.zwsjShow = false;
                    }
                    _this.total = result.total;
                });
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.currentPageIndex = page.offset / page.limit + 1;
                this.init(this.queryInfo);
            },
            // 发布消息通知
            ckXx: function (row) {
                var _this = this;
                var notice = row;
                var _params = {
                    id: row.id,
                    readed: row.noticeReaded
                }
                $.ajax({
                    type: 'get',
                    url: config.url.frame.updateNoticeStatusUrl,
                    data: _params,
                    dataType: "json",
                    success: function (data) {
                        console.info('消息已读：', data);
                        _this.init(_this.queryInfo);
                        if(notice.type==29){//中央通知消息
                            var url = "preview.html?tTzxxID="+_this.id;
                            window.open(url,'_blank');
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        _global.requestError(data, textStatus, errorThrown);
                    }
                });
                var pMessage = {
                    message: 'xxtz-ck',
                    notice: notice
                }
                window.parent.postMessage(pMessage, '*');
            },
            // 查询消息发布
            cxXxfb: function () {
                console.info('click cx！')
                this.init(this.queryInfo);
            }
        },
        created: function () {
            var _this = this;
            this.pageNow = getLimit();

        },
        mounted: function () {
        }
    })
});
