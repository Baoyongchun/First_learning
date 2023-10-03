// 查询记录模块
define(['extend/template1.js','jquery','fdEventBus','config'],
    function (template1,jquery,fdEventBus,_config) {
    new Vue({
        el: '#rzjcnode1',
        mixins: [template1],
        data: function () {
            return {
                //新加的
                activities: [
                    {
                        eContent: "活动按期开始",
                        eProcessName: "活动按期开始",
                        eProcessStatus: 1,
                        eStartTime: "2022-03-01 12:07:11"                    },
                    {
                        eContent: "活动按期开始",
                        eProcessName: "活动按期开始",
                        eProcessStatus: 1,
                        eStartTime: "2022-03-01 12:07:11"
                    },
                    {
                        eContent: "创建成功",
                        eProcessName: "活动按期开始",
                        eStartTime: "2022-03-01 12:07:11",
                        eProcessStatus: 4,
                    },
                    {
                        eContent: "创建成功",
                        eProcessName: "活动按期开始",
                        eStartTime: "2022-03-01 12:07:11",
                        eProcessStatus: 3,
                    },
                    {
                        eContent: "创建失败",
                        eProcessName: "活动按期开始",
                        eStartTime: "2022-03-01 12:07:11",
                        eProcessStatus: 2,
                    },
                ],
                packagesName: "",
                packagesTime: "",
                eResultRecordCid: "",
                dialogVisible: false,
                reverse: true,
                eHyfl:'',
                isAsc:'true',
                orderText:'时间倒序',
                dialogContent:'',
                rzjcNodeUrl: _config.url.frame.getRzjcNode,
            }
        },
        methods: {
            //新加的
            //通知通告
            getrzjcNodeList: function (eResultRecordCid, eLogType) {
                var _this = this;
                _this.eResultRecordCid = eResultRecordCid;
                _this.eLogType = eLogType;
                var _serverData = {};
                // 点击查询按钮发的请求数据
                _serverData = {
                    eResultRecordCid:_this.eResultRecordCid,
                    eLogType:eLogType,
                    zxfksjDesc:_this.reverse//复用排序方式
                };
                $.ajax({
                    method: _config.methodPost,
                    url: _this.rzjcNodeUrl,
                    data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code === '200') {
                            _this.activities = data.data.data;
                        }
                        // 输出日志
                        // fdGlobal.consoleLogResponse(_config.showLog, _this.name + '静态数据', data);
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        // fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },

            // 跳转结果包节点详情页面
            getDetailInfo: function () {
                var _this = this;
                Artery.open({
                    targetType: '_self',
                    url: '../rzjcresultfile/index.html',
                    params: {
                        eLogType:'02',
                        eResultRecordCid: _this.eResultRecordCid,
                        cZipName:_this.packagesName
                    }
                });
            },

            // 跳转结果包节点详情页面
            getDialog: function (content) {
                this.dialogVisible = true;
                this.dialogContent = content;
            },

            orderBy() {
                this.reverse = !this.reverse;
                this.getrzjcNodeList(this.eResultRecordCid,this.eLogType);
            },

        },

        filters: {
            dateFormat: function (value) {
                if (value === null || value === '') {
                    return '';
                }
                if (typeof value !== 'string') {
                    return '';
                }
                // 把毫秒替换掉，ie不支持
                var dateStr = value.replace(/\.\d{3}/, '');
                dateStr = dateStr.replace(/-/g, '/');
                var date = new Date(dateStr);

                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate();
                d = d < 10 ? '0' + d : d;
                return y + '-' + m + '-' + d;
            }
        },

        computed: {
            orderText() {
                return this.reverse ? "时间倒序" : "时间正序";
            },
        },

        mounted: function () {

        },
        created: function () {

            // 获取信息
            var param = Artery.parseUrl();
            this.packagesName = param.cZipName;
            this.packagesTime = param.dRtime;
            this.eResultRecordCid = param.eResultRecordCid;
            this.eLogType = '01';
            var _this = this;
            _this.getrzjcNodeList(_this.eResultRecordCid,_this.eLogType);
            // 禁用浏览器的backspace默认回退事件
            /*document.onkeypress = function (e) {
                // 获取event对象
                var ev = e || window.event;
                // 获取事件源
                var obj = ev.target || ev.srcElement;
                // 获取事件源类型
                var t = obj.type || obj.getAttribute('type');
                if (ev.keyCode === 8 && t !== 'password' && t !== 'text' && t !== 'textarea' && t !== 'number') {
                    return false;
                }
            };
            document.onkeydown = function (e) {
                // 获取event对象
                var ev = e || window.event;
                // 获取事件源
                var obj = ev.target || ev.srcElement;
                // 获取事件源类型
                var t = obj.type || obj.getAttribute('type');
                if (ev.keyCode === 8 && t !== 'password' && t !== 'text' && t !== 'textarea' && t !== 'number') {
                    return false;
                }
            };
            if (window.history && window.history.pushState) {
                $(window).on('popstate', function () {
                    window.history.pushState('forward', null, '#');
                    window.history.forward(1);
                });
            }
            // 在IE中必须得有这两行
            window.history.pushState('forward', null, '#');
            window.history.forward(1);*/
        }
    })
})
