// 查询记录模块
define(['extend/template1.js', 'config'], function (template1, config) {
    var vm = new Vue({
        el: '#jscxsqsh',
        mixins: [template1],
        data: function () {
            return {
                gzServiceType:'',//盖章服务商类型
                pageshow:true,
                currentPage:1,
                /// 申请单位
                sqdw: [],
                // 申请单位列表
                sqdwList: [],
                // 申请部门列表
                sqbmList: [],
                // 状态
                zt: '',
                // 状态列表
                ztList: [ {
                    code: 2,
                    name: '审核通过',
                }, {
                    code: 3,
                    name: '审核不通过',
                }],
                xxjs: '',
                //列表数据
                shList: [],
                pageNow: 10,
                total: 0,
                //artery封装查询对象
                queryInfo: {},
                //查询条件
                cxtj: {
                    //状态
                    zt: '',
                    //申请单位
                    sqdw: "",
                    //申请部门 @Version 3.2.6 由""改为[]
                    sqbm: [],
                    //开始日期
                    kssqsj: "",
                    //结束日期
                    jssqsj: "",
                    //信息检索
                    xxjs: ""
                },
                hqcxshlbUrl: config.url.frame.hqcxshlbUrl,
                cfUrl: config.url.frame.cfUrl,
                shUrl: '../../sh/index.html',
                ckspbUrl: '../../../../approval/cgdyyl/index.html',
                // 默认申请部门不可选
                disabled: false,
                //不通过原因
                btgyy: '',
                hqdwbmUrl: config.url.frame.hqdwbmUrl,
                optionKssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.jssqsj).valueOf();
                        }
                    }
                })(this),
                optionJssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.kssqsj).valueOf() - 86400000;
                        }
                    }
                })(this),
                currentPageIndex: 1,
                //暂无数据是否显示
                allZwsjShow:false,
                dataLength: 15,
                isShowFilter: false,
                filterTableName: '全部',
                filterList: [
                    {key: 0, name: '全部'},
                    {key: 2, name: '线上'},
                    {key: 1, name: '线下'}
                ],
                xsOrXxZwsjShow: false,
                corpId: ''
            }
        },
        methods: {
            // 点击筛选的下拉框里面的值
            clickFilter: function(item) {
                // 获取选中的值
                this.filterTableName = item.name;
                this.cxtj.cXsxx = item.key;
                // 隐藏下拉框
                this.isShowFilter = false;
                // 调用请求表格的方法，得到对应的数据，（需要组装参数，线上还是线下还是全部）
                this.init(this.queryInfo);
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset:function(){
                // 如果查询条件有值，怎清空后重新请求数据
                if(this.cxtj.sqdw || this.cxtj.sqbm || this.sqbmValue || this.cxtj.xxjs || this.cxtj.zt || this.cxtj.kssqsj || this.cxtj.jssqsj) {
                    // 申请单位 @Version 3.2.6 添加
                    this.cxtj.sqdw = '';
                    // 申请部门 @Version 3.2.6  ""改为[]
                    this.cxtj.sqbm = [];
                    // 开始时间
                    this.cxtj.kssqsj = '';
                    // 结束时间
                    this.cxtj.jssqsj = '';
                    // 信息检索
                    this.cxtj.xxjs = '';
                    // 状态
                    this.cxtj.zt = '';
                    //线上线下
                    this.cxtj.cXsxx= 0;
                    this.filterTableName = "全部";
                }
                this.queryInfo.limit = getLimit();
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                // 重新调用接口
                this.init(this.queryInfo);
            },
            setIndex: function (index) {
                return (index + 1) + (this.currentPageIndex - 1) * getLimit()
            },
            /**
             * 表格头部宽度赋值
             */
            // td_w_methods:function(obj,td_obj){
            //     // 这是表格主体的td宽度
            //     for(var i=0;i < obj.find('td').length;i++) {
            //         // 给表格赋值
            //         td_obj.eq(i).width(obj.find('td').eq(i).width());
            //     }
            // },
            /**
             * 初始化列表信息
             * @param queryInfo
             */
            init: function (queryInfo) {
                var _this = this;
                this.queryInfo = queryInfo;
                // @Version 3.2.6 添加处理部门
                var bm = '';
                if(typeof this.cxtj.sqbm == 'object'){
                    for (var i = 0; i < this.cxtj.sqbm.length; i++) {
                        if(i<this.cxtj.sqbm.length -1){
                            bm += (this.cxtj.sqbm[i] + ',')
                        }else {
                            bm += this.cxtj.sqbm[i]
                        }
                    }
                }
                //由于组织树的数据可能有前缀（corp_、user_、……），此处查询前对参数进行处理，去掉前缀
                var param = JSON.parse(JSON.stringify(this.cxtj));//深克隆对象
                if(this.cxtj.sqdw.indexOf("_")!=-1)
                {
                    param.sqdw = this.cxtj.sqdw.split("_")[1];
                }
                param.sqbm = bm;
                Artery.loadPageData(this.hqcxshlbUrl, this.queryInfo, param).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.shList = result.data;
                        _this.dataLength = _this.shList.data.length;
                        if (_this.filterTableName === '全部') {
                            // 当数据的长度等于0时，暂无数据显示
                            if (_this.shList.data.length <= 0 ) {
                                _this.allZwsjShow = true;
                            } else {
                                _this.allZwsjShow = false;
                            }
                        } else {
                            // 当数据的长度等于0时，暂无数据显示
                            if (_this.shList.data.length <= 0 ) {
                                _this.xsOrXxZwsjShow = true;
                            } else {
                                _this.xsOrXxZwsjShow = false;
                            }
                        }
                        _this.total = result.data.total
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                });
            },
            /**
             * 操作列--审核
             */
            openSh: function (row) {
                Artery.open({
                    targetType: '_blank',
                    url: this.shUrl,
                    params: {
                        bh: row.bh
                    }
                })
            },
            //查询盖章服务类型
            queryGzServiceType:function(){
                var gzType="";
                $.ajax({
                    method: config.methodPost,
                    url: config.url.frame.queryGzServiceType,
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        console.log("盖章服务类型为："+data);
                        gzType = data;
                    },
                    error: function (data, textStatus, errorThrown) {
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
                return gzType;
            },
            /**
             * 操作列--查看审核表
             */
            goWhereViewSpd :function(row){
                var _this = this;
                if(row.mgxx == 1  && row.canView != 1){
                    Artery.notice.warning({
                        title: "申请单包含敏感信息，无法查看！"
                    });
                    return
                }
                _this.gzServiceType = _this.queryGzServiceType();
                if(1== _this.gzServiceType){//数科
                    _this.gzWindow = window.open(config.url.frame.viewQzOfd+ "?bh=" +row.bh);
                }else if(2 == _this.gzServiceType){//书生
                    _this.openCkspb(row);
                }else{
                    Artery.notice.error({
                        title: '警告',
                        desc: '盖章服务商配置错误！'
                    });
                }
            },
            openCkspb: function (row) {
                // 请求书生的阅读接口
                var _this = this;
                Artery.ajax.get("/api/v1/spb/view", {
                    timeout: 50000,
                    params: {
                        sqbh: row.bh,
                        type: "1",  //1: 地方  2: 中央
                        time: Date.now()
                    }
                }).then(function (result) {
                    console.log(result);
                    if (result === 'dzurl') {
                        result = _this.ckspbUrl;
                    } else if(!(result && /(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(result))) {
                        Artery.notice.warning({
                            title: '无法连接上电子签章服务，请联系管理员',
                            desc: ''
                        });
                        return;
                    }
                    Artery.open({
                        targetType: "_blank",
                        url: encodeURI(result),
                        params: {
                            cBh: row.bh
                        }
                    });

                })

            },
            /**
             * 操作列--打开不通过原因
             */
            openBtgyy: function (row) {
                // 定义需要传递过去的数据
                var dataBj = {
                    flag: "YshBtgyy",
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = row;
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
                // this.btgyy = row.btgyy;
                // this.$refs.btgyyModel.open();
            },

            /**
             * 查询按钮
             *
             * 根据查询条件获取列表信息
             */
            cxshByCxtj: function () {
                var _this =this;
                _this.$refs.shTabel.reloadData(true);
                // 当数据的长度等于0时，暂无数据显示
                if (_this.shList.data.length <= 0 ) {
                    _this.zwsjShow = true;
                } else {
                    _this.zwsjShow = false;
                }
                // 设置offset为0
                this.queryInfo.offset =0;
                // 设置当前页
                this.currentPageIndex = 1;
            },

            changeSelect: function (name) {
                console.log('name')
            },
            getRowKey: function (row) {
                return row.name
            },
            /**
             * @Author: wjing
             * @name: clickSh
             * @description: 跳转到审核页面
             * @param {type}
             * @return: {undefined}
             */
            clickSh: function () {
                window.open("../../sh/index.html")
            },
            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param newValue 新选择的节点
             * @param oldValue 上一次选择的节点
             * @return: {undefined}
             */
            /*selectSqdw: function (newValue, oldValue) {
                var _this = this;
                this.$nextTick(function () {
                    if (_this.sqdw.length == 0) {
                        _this.disabled = true;
                    } else {
                        _this.disabled = false;
                    }
                })
                Artery.ajax.get(_this.hqdwbmUrl, {
                    cropId: newValue.code
                }).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.sqbmList = result.data
                        Artery.notice.success({
                            title: '获取部门数据成功'
                        });
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }

                });
            },*/
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.currentPageIndex = page.offset / page.limit + 1;
                this.init(this.queryInfo);
            },
            // 打开重发弹窗
            openResetSend: function (row) {
                var dataBj = {
                    flag: "YshCf",
                    _data: {}
                };
                // 给首页发消息
                dataBj._data = row;
                dataBj._data = row;
                var _data = JSON.stringify(dataBj);
                window.parent.parent.postMessage(_data, '*');
            },
            /**
             *  * @Author qhy
             *    @Date 2020/03/06
             *    @description 修改反馈进度对应class名
             */
            changeClass: function (val) {
                if (val) {
                    if (val === '无') {
                        // 无反馈进度
                        return 'fd-td-fkjd-wu'
                    } else if (val.indexOf('100') > -1) {
                        // 反馈进度100%
                        return 'fd-td-fkjd-over'
                    } else {
                        // 反馈进度0-99%
                        return 'fd-td-fkjd-more'
                    }
                }
            },
            //反馈进度弹窗
            openModalFkjd: function (bh, jd, cxh) {
                if (jd === '无') {
                    return;
                }
                window.location.href = "../../../pCxy/cxsq/cxjd/index.html?bh=" + bh + "&jd=" + jd + "&cxh=" + cxh;
            },
            requestCurrent: function () {
                var _this = this;
                $.ajax({
                    method: config.methodGet,
                    url: "/api/v1/admin/user/current",
                    // data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code == 200) {
                            _this.corpId = data.data.corpId;
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                        console.log(data, textStatus, errorThrown)
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            }
        },

        mounted: function () {
            var _this = this;
            this.$nextTick(function(){
                // 点击出现table的筛选框
                $('.fd-filter-th .filter-wrap').click(function () {
                    _this.isShowFilter = !_this.isShowFilter;
                })
            })
        },
        // @Version 3.2.6 添加 computed
        computed: {
            deptRootId: function () {
                this.cxtj.sqbm = [];
                if (this.cxtj.sqdw) {
                    if (this.cxtj.sqdw instanceof Array) {
                        return this.cxtj.sqdw[0];
                    } else {
                        return this.cxtj.sqdw;
                    }
                }
                return '';
            },
            deptDisabled: function () {
                return !this.cxtj.sqdw;
            }
        },
        created: function () {
            this.pageNow = getLimit();
            this.requestCurrent();
        }
    })

    return vm;
})
