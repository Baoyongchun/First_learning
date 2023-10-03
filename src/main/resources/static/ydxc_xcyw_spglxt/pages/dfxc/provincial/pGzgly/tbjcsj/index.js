// 查询记录模块
define(['extend/template1.js', 'config'], function (template1, config) {
    var vm = new Vue({
        el: '#jcsjgl',
        mixins: [template1],
        data: function () {
            return {
                pageshow:true,
                currentPage:1,
                // 状态列表
                ztList: [{
                    code: 1,
                    name: '生效'
                }, {
                    code: 2,
                    name: '无效'
                }],
                // 基础数据类型列表
                jcsjlxList: [
                    {
                        code: 1,
                        name: '文书'
                    },
                    {
                        code: 2,
                        name: '印模'
                    },
                    {
                        code: 3,
                        name: '证书'
                    }
                ],
                //列表数据
                sjglList: [{}],
                total: 0,
                //artery封装查询对象
                queryInfo: {
                    limit: getLimit(),
                    offset: 0,
                    px: 'desc',
                    syc: '',
                    zt: '',
                    type: ''
                },
                syncJcsjUrl: config.url.frame.syncJcsjUrl,
                //暂无数据是否显示
                zwsjShow:false,
                ymPicAddress: config.url.frame.getYmPic

            }
        },
        methods: {
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 如果查询条件有值，怎清空后重新请求数据
                if(this.queryInfo.type || this.queryInfo.zt) {
                    // 基础数据类型
                    this.queryInfo.type = '';
                    // 状态
                    this.queryInfo.zt = '';
                }
                this.queryInfo.limit = getLimit();
                this.queryInfo.offset = 0;
                this.currentPage = 1;
                this.queryInfo.px = 'desc';
                this.queryInfo.syc = '';
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                // 重新调用接口
                this.init();
            },
            /**
             * 获取序号
             * @param index
             * @returns {*}
             */
            getIndex: function(index){
                return this.queryInfo.offset + index + 1;
            },
            /**
             * 初始化列表信息
             */
            init: function () {
                var _this = this;
                Artery.loadPageData(config.url.frame.tbJcsjListUrl, this.queryInfo)
                    .then(function (result) {
                        _this.sjglList = result.data;
                        for (var i = 0; i < _this.sjglList.length; i++) {
                            _this.sjglList[i].filepath = _this.ymPicAddress + '?minioPath=' + _this.sjglList[i].filepath;
                        }
                        console.log(_this.sjglList)
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.sjglList.length <= 0 ) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.total = result.total;
                    });
            },

            //开发修改这里
            sortChange: function (parma) {
                if(parma.prop === 'uploadtime'){
                    if(parma.order === 'ascending'){
                        this.queryInfo.px = 'asc';
                        this.queryInfo.syc = '';
                        this.init();
                    }
                    if(parma.order === 'descending'){
                        this.queryInfo.px = 'desc';
                        this.queryInfo.syc = '';
                        this.init();
                    }
                }
                if(parma.prop === 'synctime'){
                    if(parma.order === 'ascending'){
                        this.queryInfo.syc = 'asc';
                        this.queryInfo.px = '';
                        this.init();
                    }
                    if(parma.order === 'descending'){
                        this.queryInfo.syc = 'desc';
                        this.queryInfo.px = '';
                        this.init();
                    }
                }
            },

            // 查询
            clickCx: function () {
                this.queryInfo.offset = 0;
                this.init();
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.init();
            },

            // 打开同步基础数据弹窗
            openJcsj: function () {
                // 定义需要传递过去的数据
                var dataBj={
                    flag:"tbjcsj",
                    _data:{}
                };
                var _data =JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data,'*');
            },

            /**
             * 点击下载
             * @param props
             */
            clickLow: function (props) {
                window.open(config.url.frame.jcsjDownloadUrl + "?ids=" + props.id);
            },
            /**
             * 获取type对应name
             */
            getTypeName:function (type) {
                if (type == '01'){
                    return '文书';
                }else if(type == '02'){
                    return '印模';
                }else{
                    return '证书';
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
            }
        },

        mounted: function () {
            //初始化列表
            this.init();
        },
        created:function(){
            /**
             *  * @Author qhy
             *    @Date 2020/03/06
             *    @description 父页面给子页面发送消息  ---
             */
            var _this = this;
            window.addEventListener('message', function(evt){
                var evts = JSON.parse(evt.data);
                if(evts.flag ==='backTbjcsj'){
                    _this.init()
                }
            }, false);
        }

    });
});
