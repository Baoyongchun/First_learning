/**
 * 查询项反馈时长
 * @author qinzf
 * @date 2021.3.9
 */
define(['fdGlobal', 'config'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     * @param fdDataTable
     */
    function (fdGlobal, config) {
        // var _config = JSON.parse(JSON.stringify(config));
        // //  单独设置，便于调试
        // _config.showLog = true;
        new Vue({
            el: '#jsAppControllerCxxfksc',
            data: {
                name: '查询项反馈时长',
                feedbackInfoUrl: '/api/v1/catalog/feedback-infos',
                feedbackList: [{
                    corp: '公安部',
                    queryItem: '户籍人口',
                    duration: '30分钟',
                    yduration: '12小时',
                    mergeCount: 1
                }]
            },
            methods: {
                loadData: function () {
                    var _this = this;
                    Artery.ajax.get('/api/v1/catalog/feedback-infos').then(function (res) {
                        if (res) {
                            _this.feedbackList = res;
                        } else {
                            _this.feedbackList = [];
                        }
                    });
                }
            },
            created: function () {
                this.loadData();
            }
        });
    });
