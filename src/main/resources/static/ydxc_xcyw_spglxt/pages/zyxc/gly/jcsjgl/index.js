// 查询记录模块
define(['extend/template1.js', 'config', 'fdGlobal'], function (template1, config, fdGlobal) {

    new Vue({
        el: '#jscxjc',
        mixins: [template1],
        data: function () {
            return {
                triggerCode: false,// 展开收起标志
                resizeHeight:0,
                pageshow:true,
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
                //列表数据
                sjglList: [],
                pageNow: 10,
                total: 0,
                //artery封装查询对象
                queryInfo: {},
                query: {
                    offset: 0,
                    pageSize: 10,
                    currentSize: 0,
                    pageNow:1
                },
                //查询条件
                jcsjgl: {
                    //状态
                    zt: '',
                    //上传单位
                    scdw: "",
                    status: ''
                },
                bhList: [],
                zyJcsjListUrl: config.url.frame.zyJcsjListUrl,
                zyJcsjOrganListUrl: config.url.frame.zyJcsjOrganListUrl,
                exportJcsjUrl: config.url.frame.exportJcsjUrl,
                organList: [],
                //暂无数据是否显示
                zwsjShow:false,
                //选中的行
                rowData: [],
            }
        },
        // 创建
        created: function () {
             this.init(this.queryInfo);
        },
        methods: {
            // 选中页面某条数据
            select: function (row) {
                var _this = this;
                _this.rowData = row;
            },
            //  全选页面数据
            selectAll: function (selection) {
                var _this = this;
                if (selection.length === 0) {
                    return;
                }
                _this.rowData = selection;
            },
            /*滚动条滑动*/
            scrollLeft:function(top,left) {
                var tableHead = $('.fd-table-header .aty-table__header-wrapper .aty-table__header');
                if(this.evtDrag) {
                    tableHead.addClass('fd-scrollbar-transition');
                }
                tableHead.css('transform','translate('+left+')');
            },
            /*展开收起下拉树区域*/
            triggerClick: function() {
                this.triggerCode = !this.triggerCode;
            },

            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param {type}
             * @return: {undefined}
             */
            selectSqdw: function (newValue, oldValue) {
                var _this = this;
                if (newValue) {
                    if(newValue.id==0){
                        _this.jcsjgl.uploadCorps = '';
                    }else{
                        _this.jcsjgl.uploadCorps=newValue.id ;
                    }
                } else {
                    _this.jcsjgl.uploadCorps = '';
                }

                _this.init(_this.queryInfo);
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 如果查询条件有值，怎清空后重新请求数据
                // if(this.jcsjgl.uploadCorps || this.jcsjgl.status) {
                //     // 上传单位
                //     this.jcsjgl.uploadCorps = '';
                //     // 状态
                //     this.jcsjgl.status = '';
                // }
                this.jcsjgl.status = '';
                this.reloadFlag = false;
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                // 重新调用接口
                this.init(this.queryInfo);
            },
            /**
             * 初始化列表信息
             * @param queryInfo
             */
            init: function (queryInfo) {
                var _this = this;
                this.queryInfo = queryInfo;
                Artery.loadPageData(this.zyJcsjListUrl, this.queryInfo, this.jcsjgl).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.sjglList = result.data.jcsjList;
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.sjglList.length <= 0 ) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.bhList = [];
                        _this.rowData=[];
                        if (_this.sjglList) {
                            _this.sjglList.forEach(function (item, index) {
                                item.checked = false;
                            });
                        }
                        _this.total = result.data.page.totalSize;
                        _this.sjglList.forEach(function (item, index) {
                            var _item = _this.sjglList[index];
                            if(item.nNew === 1 && item.nValid === 1) {
                                _item.showNewFlag = true;
                            }
                        })
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                });
            },
            /**
             * 查询按钮
             *
             * 根据查询条件获取列表信息
             */
            cx: function () {
                this.init(this.queryInfo);
            },
            /**
             * @Author: wjing
             * @name: dcxzws
             * @description: 导出选择基础数据
             * @return: {undefined}
             */
            dcxzws: function () {
                var _this = this;
                if (!_this.rowData || _this.rowData.length === 0) {
                    Artery.notice.warning({
                        title: '请选择至少一项',
                        duration: 2
                    });
                    return;
                }
                for(var i=0;i<_this.rowData.length;i++){
                    console.log(_this.rowData[i]);
                    _this.bhList.push(_this.rowData[i].cGroupId);
                }
                console.log(this.bhList);
                var _this = this;
                var $windowObj = window.open(this.exportJcsjUrl + "?groupIds=" + _this.bhList);
                var pMessage = {
                    message: 'zy-zyxtgly-jcsjgl'
                }
                var loop = setInterval(function() {
                    console.info('开启定时器：等待打开窗口之后，执行回调函数！')
                    if($windowObj  != null && $windowObj.closed) {
                        clearInterval(loop);
                        //do something 在这里执行回调
                        window.parent.postMessage(pMessage, '*');
                        _this.init(_this.queryInfo);
                        console.info('回调函数执行完毕，关闭定时器！')
                    }
                }, 800);
            },

            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.init(this.queryInfo);
            },
            getOrganList: function () {
                var _this = this;
                Artery.ajax.get(_this.zyJcsjOrganListUrl).then(function (result) {
                    if (result.success) {
                        _this.organList = result.data;
                    }
                })
            },
            exportBaseData: function (item) {
                var _this = this;
                var $windowObj = window.open(this.exportJcsjUrl + "?groupIds=" + item.cGroupId);
                var pMessage = {
                    message: 'zy-zyxtgly-jcsjgl'
                }
                var loop = setInterval(function() {
                    console.info('开启定时器：等待打开窗口之后，执行回调函数！')
                    if($windowObj  != null && $windowObj.closed) {
                        clearInterval(loop);
                        //do something 在这里执行回调
                        window.parent.postMessage(pMessage, '*');
                        _this.init(_this.queryInfo);
                        console.info('回调函数执行完毕，关闭定时器！')
                    }
                }, 800);
            }

        },
        mounted: function () {
            var _this = this;
            // 当拖拽横向滚动条时去掉transition
            _this.$nextTick(function(){
                // 鼠标按下
                $('.aty-scroll-track-h').on('mousedown',function () {
                    _this.evtDrag = false;
                    $('.fd-table-header .aty-table__header-wrapper .aty-table__header').removeClass('fd-scrollbar-transition');
                });
                $(document).on('mouseup',function () { // 鼠标抬起
                    _this.evtDrag = true;
                });

                // 绑定组织机构树的查询输入框的事件
                $('.fd-cxjc-tree .aty-tree-search .aty-input').on('blur', function() {
                    setTimeout(function(){
                        // console.log($('.isFocus').parent())
                        // 选中的元素的距离顶部的位置
                        var selectedTreeTop = $('.isFocus').parent()[0].offsetTop;
                        // 滚动的距离
                        _this.$refs.jsCxjcTreeScroll.updateTop(selectedTreeTop);
                    }, 300)
                })
                // 绑定组织机构树点击选择搜索下拉框的内容
                $('.fd-cxjc-tree .fd-aty-tree .aty-select-dropdown-list .aty-select-item').on('click', function() {
                    setTimeout(function(){
                        // console.log($('.isFocus').parent())
                        // 选中的元素的距离顶部的位置
                        var selectedTreeTop = $('.isFocus').parent()[0].offsetTop;
                        // 滚动的距离
                        _this.$refs.jsCxjcTreeScroll.updateTop(selectedTreeTop);
                    }, 300)
                })
            })
            // 适应大小屏的滚动条
            this.resizeHeight = $('.fd-content-cxjc').height();
            window.addEventListener('resize',function(){
                // 适应大小屏的滚动条
                console.log('resize')
                _this.$nextTick(function(){
                    _this.resizeHeight = $('.fd-content-cxjc').height();
                })
            });
            this.getOrganList();
        },
    })

})
