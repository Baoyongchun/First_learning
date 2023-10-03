// 查询记录模块
define(['fdGlobal', 'config', '', 'extend/template1.js', 'fdEventBus'],
    function (fdGlobal, config, fdComponent2, template1, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        new Vue({
            el: '#jsApp',
            mixins: [template1],
            data: function() {
                return {
                    gzServiceType:'',//盖章服务商类型
                    name: '模板页面',
                    value: '',
                    // 查看申请表格数据
                    cxsqList: [],
                    // 反馈进度数据
                    fkjdData: {},
                    // 查询流程数据
                    cxlcData: [],
                    //当前页数据量
                    pageNow: '',
                    //总数据量
                    total: 30,
                    progressNum: 0, //进度百分比
                    pageOffset: 0, //分页控件offset
                    //控制表格操作列的显示
                    fdCz: false,
                    isFilter: false,
                    currBh: '',
                    selectedBh: '', //选中的申请的编号
                    refuseReason: '', //不通过理由
                    approvalMethodType:'online',
                    statusList: [{
                        "code": "1",
                        "codeType": "1028",
                        "name": "草稿"
                    }, /*{
                        "code": "14",
                        "codeType": "1028",
                        "name": "待审批"
                    },
                        {
                            "code": "15",
                            "codeType": "1028",
                            "name": "审批通过"
                        },
                        {
                            "code": "16",
                            "codeType": "1028",
                            "name": "审批不通过"
                        },*/
                        {
                            "code": "17",
                            "codeType": "1028",
                            "name": "待打印"
                        }, {
                            "code": "2",
                            "codeType": "1028",
                            "name": "待提交"
                        }, {
                            "code": "3",
                            "codeType": "1028",
                            "name": "待审核"
                        }, {
                            "code": "4",
                            "codeType": "1028",
                            "name": "审核通过"
                        }, {
                            "code": "5",
                            "codeType": "1028",
                            "name": "审核不通过"
                        },
                        // {
                        //     "code": "20",
                        //     "codeType": "1028",
                        //     "name": "系统核验通过"
                        // },
                        {
                            "code": "6",
                            "codeType": "1028",
                            "name": "人工核验通过"
                        }, {
                            "code": "7",
                            "codeType": "1028",
                            "name": "核验不通过"
                        }, {
                            "code": "8",
                            "codeType": "1028",
                            "name": "部分反馈"
                        }, {
                            "code": "9",
                            "codeType": "1028",
                            "name": "全部反馈"
                        }], //状态下拉列表
                    queryInfo: {
                        limit: 10,
                        offset: 0,
                        splitPage: true
                    },
                    //查询条件
                    query: {
                        endDate: '', //申请结束时间
                        startDate: '', //申请开始时间
                        keyword: '', //检索关键词，
                        status: [], //申请状态(多选)
                        cXsxx: 0 //线上线下（1：线下2：线上，0：所有）
                    },

                    dateOptions: {
                        language: 'zh-CN',
                        format: 'yyyy-mm-dd',
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        startDate: fdGlobal.startDate, //设置最小日期
                        endDate: '', //设置最大日期
                        todayHighlight: 1,
                        startView: 2,
                        minView: 2, //Number, String. 默认值：0, 'hour' 日期时间选择器所能够提供的最精确的时间选择视图。
                        forceParse: true
                    },
                    url: {
                        cxsqlb: _config.url.frame.serverUrlCxsqlb, //查询申请列表
                        cxlc: _config.url.frame.serverUrlCxlc, //查询流程
                        fkjd: _config.url.frame.serverUrlFkjd, //反馈进度
                        scsq: _config.url.frame.serverUrlScsq, //删除申请
                        tjsh: _config.url.frame.serverUrlTjsh, //提交审核
                        dzdm: _config.url.frame.serverUrlDzdm, //单值代码
                        ckjg: _config.url.frame.serverUrlCkjg, //查看结果
                        yscspd: _config.url.frame.serverUrlYscspd, //已上传审批单
                        createSpbPermission: _config.url.frame.createSpbPermissionUrl,
                        getPng: _config.url.frame.serverUrlGetPng
                    },

                    pageUrl: {
                        ckspbUrl: '../../../approval/cgdyyl/index.html', //查看审批单
                        cxjgUrl: '../cxsq/cxjg/index.html', //查询结果
                        xjspbUrl: '../../../approval/xjspb/index.html', //新建审批单
                    },

                    codeType: {
                        spdStatus: '1028'
                    },
                    scrollbar: null,
                    storage: '',
                    loadingStatus: false,    //正在上传状态, 正在上传时不能再次点击上传按钮
                    currentPageIndex: 1,
                    // 全部暂无数据是否显示
                    allZwsjShow:false,
                    // 线上或者线下暂无数据是否显示
                    // xsOrXxZwsjShow:false,
                    isShowFilter: '',
                    filterTableName: '全部',
                    filterList: [
                        {key: 0, name: '全部'},
                        {key: 2, name: '线上'},
                        {key: 1, name: '线下'}
                    ],
                    selectedYy: '',
                    data: [
                        {name: '1111'},
                        {name: '1111'},
                        {name: '1111'}
                    ],
                    optionStartDate: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() > new Date(_this.query.endDate).valueOf();
                            }
                        }
                    })(this),
                    optionEndDate: (function (_this) {
                        return {
                            disabledDate: function (date) {
                                return date && date.valueOf() < new Date(_this.query.startDate).valueOf() - 86400000;
                            }
                        }
                    })(this)
                }
            },
            // 创建
            created: function () {
                this.queryInfo.limit = getLimit();
                var _this = this;
                _this.getApprovalMethodType();
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 父页面给子页面发送消息  ---  删除和提交审核
                 */
                window.addEventListener('message', function (evt) {
                    var evts = JSON.parse(evt.data);
                    if (evts.flag === 'CxsqQrscParent' || evts.flag === 'CxsqTjshaPrent' || evts.flag === "scspbOpen" || evts.flag === "CxsqTjshParent" || evts.flag === 'XstjspOpen') {
                        _this.refreshForm();
                    }
                }, false);
            },
            mounted: function () {
                var _this = this;
                //this.initData();
                //更新滚动条方法 ---表格
                // this.$refs.scrollTable.update();
                this.$nextTick(function(){
                    // 点击出现table的筛选框
                    $('.fd-filter-th .filter-wrap').click(function () {
                        _this.isShowFilter = !_this.isShowFilter;
                    })
                })
            },
            computed: {},
            methods: {
                // 查询申请--提交审批的弹框
                openModalTjsp: function(row) {
                	$("#splzSubmit").removeClass("notclick");
                	$('#sprUl').children().filter('li').remove();
                    var _this = this;
                    //先校验审批单必填项是否填写完毕
                    var p = {
                        "cBh":row.cBh
                    };
                    Artery.ajax.post('/api/v1/cxsq/validSpd', p).then(function (result) {
                        if(!!result.success) {
                            if (result.data && result.data.length > 0) {
                                Artery.notice.warning({
                                    title: '警告',
                                    desc: '审批表未填写完整，请继续填写'
                                });
                                return;
                            }

                            var _data = {
                                flag: 'tjspCxsq_2',
                                data: row
                            };
                            var dataBj = JSON.stringify(_data);
                            window.parent.parent.postMessage(dataBj, '*');
                        }
                    });
                },
                /**
                 * 获取审批方式
                 */
                getApprovalMethodType: function(){
                	var _this = this;
                	Artery.ajax.get("/api/v1/cxsq/approvalMethodType").then(function (result) {
                		 if(result.code=='200'){
                			 _this.approvalMethodType = result.data;
                		 }
                     });
                },
                /**
                 * @author nfj
                 * @description 查询申请--审批记录的弹框
                 * @param row
                 */
                openModalSpjl: function(row) {
                    // row.cCxh = '苏监查【2020】 第000080号';
                    Artery.ajax.post('/api/v1/cxsq/spjl', row).then(function (result) {
                        var _data = {
                            flag: 'spjlCxsq',
                            data: row,
                            spjl:[]
                        };
                        if(result !=undefined &&result.data !=undefined && result.data.length !=undefined)
                        {
                            _data.spjl = result.data;
                        }
                        var dataBj = JSON.stringify(_data);
                        window.parent.parent.postMessage(dataBj, '*');
                    });
                },
                // 点击筛选的下拉框里面的值
                clickFilter: function(item) {
                    // 获取选中的值
                    this.filterTableName = item.name;
                    this.query.cXsxx = item.key;
                    console.log(item)
                    // 隐藏下拉框
                    this.isShowFilter = false;
                    this.isFilter = true;
                    // 调用请求表格的方法，得到对应的数据，（需要组装参数，线上还是线下还是全部）
                    this.refreshForm();
                },
                /**
                 *  @Author wlq
                 * @description 查询条件重置
                 * @name searchReset
                 * @return {*} 无
                 */
                searchReset:function(){
                    console.log(this.query.status);
                    // 如果查询条件有值，怎清空后重新请求数据
                    if(this.query.startDate || this.query.endDate || this.query.status || this.query.keyword) {
                        // 信息检索
                        this.query.keyword = '';
                        // 开始时间
                        this.query.startDate = '';
                        // 结束时间
                        this.query.endDate = '';
                        // 状态
                        this.query.status = [];
                        //线上线下
                        this.query.cXsxx= 0;
                        this.filterTableName = "全部";
                        // 设置offset为0
                        this.queryInfo.offset =0;
                        // 设置当前页
                        this.currentPageIndex = 1;
                        // 重新调用接口
                        this.refreshForm();
                    }
                },
                setIndex: function (index) {
                    return (index + 1) + (this.currentPageIndex - 1) * getLimit();
                },
                keyEnter: function () {
                    alert(111111111)
                },
                /**
                 * init spd status
                 */
                initData: function () {
                    var _this = this;
                    Artery.ajax.get(_this.url.dzdm + _this.codeType.spdStatus)
                        .then(function (result) {
                            console.log(result);
                            _this.statusList = result;
                        });
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
                /**
                 *  * @Author qhy
                 *    @Date 2020/03/06
                 *    @description 通过字段修改状态返回class名
                 */
                changeClassZt: function (val) {
                    if (val === '核验通过' || val === '审核通过') {
                        return 'fd-hytg'
                    } else if (val === '待审核' || val === '待盖章') {
                        return 'fd-dsh'
                    } else if (val === '部分审核') {
                        return 'fd-bfsh'
                    } else if (val === '全部反馈') {
                        return 'fd-qbfk'
                    } else if (val === '审核不通过' || val === '核验不通过') {
                        return 'fd-shbtg'
                    } else if (val === '待提交') {
                        return 'fd-dtj'
                    } else if (val === '草稿') {
                        return 'fd-caogao'
                    } else if (val === '部分反馈') {
                        return 'fd-bffk'
                    } else if (val === '已导出') {
                        return 'fd-ydc'
                    }
                },

                //反馈进度弹窗
                openModalFkjd: function (bh, jd, cxh) {
                    if (jd === '无') {
                        return;
                    }
                    window.location.href = "./cxjd/index.html?bh=" + bh + "&jd=" + jd + "&cxh=" + cxh;
                },

                //查询流程弹窗
                openMoalCxlc: function (bh) {
                    var _this = this;
                    Artery.ajax.get(_this.url.cxlc + bh + "?" + Math.random())
                        .then(function (result) {
                            // 定义需要传递过去的数据
                            var dataBj = {
                                flag: "CxsqCxlc",
                                _data: {}
                            };
                            // 给首页发消息
                            dataBj._data = result;
                            var _data = JSON.stringify(dataBj);
                            window.parent.parent.postMessage(_data, '*');
                        });
                },
                //删除确认弹窗
                openModalDelete: function (bh) {
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "CxsqRemove",
                        _data: {}
                    };
                    // 给首页发消息
                    dataBj._data = bh;
                    var _data = JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data, '*');
                },

                //不通过原因弹框
                openModalRefuseReason: function (refuseReason,name) {
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "CxsqShbtg",
                        _data: {}
                    };
                    // 给首页发消息
                    dataBj._data.reason = refuseReason;
                    dataBj._data.name = name;
                    var _data = JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data, '*');
                },

                /**
                 * 上传审批单弹框
                 * @param bh 申请编号
                 * @param isDtj 是否是待提交
                 */
                openModalUploadSpd: function (bh) {
                    var _this = this;
                    Artery.open({
                        targetType: '_blank',
                        url: "../../../../common/scspd/index.html?cBh="+ bh
                    })
                    // window.location.href = "../../../../common/scspd/index.html?cBh="+ bh ;
                    return;
                    /*var fileList = [];
                    //查询已上传文件
                    Artery.ajax.get(_this.url.yscspd + bh + '?v=' + new Date().getTime())
                        .then(function (result) {
                            if (result.length > 0) {
                                for (var index = 0; index < result.length; index++) {
                                    fileList.push({
                                        id: result[index].cId,
                                        wjmc: result[index].cWjmc,
                                        cclj: result[index].cCclj,
                                        order: result[index].nOrder,
                                        srcContent: _this.url.getPng + result[index].cId
                                    })
                                }
                            }

                            // 定义需要传递过去的数据
                            var dataBj = {
                                flag: "CxsqTjsh",
                                _data: {
                                    bh: bh,
                                    files: fileList
                                }
                            };
                            // 给首页发消息
                            // dataBj._data = bh;
                            var _data = JSON.stringify(dataBj);
                            window.parent.parent.postMessage(_data, '*');
                        });*/
                },

                // 提交申请弹窗
                openModalTjsq: function () {
                    var _this = this;
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "CxsqTjsq",
                        _data: {}
                    };
                    // 给首页发消息
                    dataBj._data = {
                        tjsh: _this.url.tjsh,
                        selectedBh: _this.selectedBh
                    };
                    var _data = JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data, '*');
                },
                //加载表单数据
                loadData: function () {
                    console.log("enter loadData method");
                    var _this = this;
                    var _data = _this.isFilter ? _this.query : {};
                    Artery.ajax.post(_this.url.cxsqlb + '?v=' + new Date().getTime(), {
                        conditions: _data,
                        queryInfo: _this.queryInfo
                    }).then(function (result) {
                        console.log(result);
                        _this.allZwsjShow = false;
                        // 如果用户选中的是全部的话
                        if (_this.filterTableName === '全部') {
                            if (result.data.length <= 0 ) {
                                // 当数据的长度等于0时，暂无数据显示
                                _this.allZwsjShow = true;
                            } else {
                                for (var i = 0; i < result.data.length; i++) {
                                    result.data[i].submitSpbBtnLoading = false;
                                    result.data[i].submitSpbBtnText = "生成审批表";
                                }
                            }
                        }
                        _this.cxsqList = result.data;
                        _this.pageNow = _this.cxsqList.length;
                        _this.total = result.total;
                    });
                },
                // 变换页签
                change: function (pageInfo) {
                    var _this = this;
                    _this.queryInfo.offset = pageInfo.offset;
                    _this.pageOffset = pageInfo.offset;
                    _this.queryInfo.limit = pageInfo.limit;
                    _this.currentPageIndex = pageInfo.offset / pageInfo.limit + 1;
                    _this.loadData();
                },

                //条件查询
                commit: function () {
                    var _this = this;
                    //校验开始时间和结束时间
                    if (_this.query.endDate !== '' && _this.query.startDate !== '') {
                        var end = new Date(_this.query.endDate).getTime();
                        var start = new Date(_this.query.startDate).getTime();
                        if (end < start) {
                            Artery.notice.warning({
                                title: "申请开始时间不能大于申请结束时间"
                            });
                            return;
                        }
                    }
                    // 设置offset为0
                    _this.queryInfo.offset =0;
                    // 设置当前页
                    _this.currentPageIndex = 1;

                    _this.isFilter = true;
                    _this.resetPageInfo();
                    _this.loadData();
                    // 定义需要传递过去的数据
                    var dataBj = {
                        flag: "CxsqCx",
                        _data: {}
                    };
                    var _data = JSON.stringify(dataBj);
                    window.parent.parent.postMessage(_data, '*');

                },

                //重置分页信息
                resetPageInfo: function () {
                    console.log("enter resetPageInfo method");
                    var _this = this;
                    _this.queryInfo.offset = 0; //表单分页offset
                    _this.pageOffset = 0; //分页控件offset
                },
                //刷新表单
                refreshForm: function () {
                    console.log("enter refreshForm method");
                    var _this = this;
                    _this.resetPageInfo();
                    _this.loadData();
                },

                //跳转编辑页面
                gotoEdit: function (bh,zt,cxbs) {
                    var _this = this;
                    Artery.open({
                        targetType: '_blank',
                        url: _this.pageUrl.xjspbUrl + '?cBh=' + bh + '&nZt=' + zt + '&cCxbs=' + cxbs
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
                goWhereViewSpd :function(bh,zt){
                    if(zt == 2){
                        Artery.open({
                            targetType: '_blank',
                            url: '../../../approval/cgdyyl/index.html?cBh=' + bh
                        });
                    };
                    var _this = this;
                    _this.gzServiceType = _this.queryGzServiceType();
                    if(1== _this.gzServiceType){//数科
                        _this.gzWindow = window.open(config.url.frame.viewQzOfdCxy+ "?bh=" +bh);
                    }else if(2 == _this.gzServiceType){//书生
                        _this.gotoCkspb(bh);
                    }else{
                        Artery.notice.warning({
                            title: '警告',
                            desc: '盖章服务商配置错误！'
                        });
                    }
                },
                //跳转查看审批表页
                gotoCkspb: function (bh) {
                    var _this = this;
                    // 请求书生的阅读接口
                    Artery.ajax.get("/api/v1/spb/view", {
                        timeout: 50000,
                        params: {
                            sqbh: bh,
                            type: "1",  //1: 地方  2: 中央
                            time: Date.now()
                        }
                    }).then(function (result) {
                        console.log(result);
                        if (result === 'dzurl') {
                            result = _this.pageUrl.ckspbUrl;
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
                                cBh: bh
                            }
                        });
                    })
                },

                //跳转查看结果页
                gotoCkjg: function (bh) {
                    var _this = this;
                    Artery.ajax.get(_this.url.ckjg + bh)
                        .then(function (result) {

                        });

                    Artery.open({
                        targetType: '_blank',
                        url: _this.pageUrl.cxjgUrl,
                        params: {
                            id: bh
                        }
                    })
                },
                //跳转新建审批单页
                gotoXjspb: function () {
                    var _this = this;
                    Artery.ajax.get(_this.url.createSpbPermission).then(function (result) {
                        if (result.success) {
                            if (result.data && JSON.stringify(result.data) !== "{}") {
                                // 弹出弹窗警告
                                Artery.notice.warning({
                                    title: result.data
                                });
                            } else {
                                Artery.open({
                                    targetType: '_blank',
                                    url: _this.pageUrl.xjspbUrl
                                })
                            }
                        }
                    });
                },
                submitSpb:function (row) {
                    row.submitSpbBtnLoading = true;
                    row.submitSpbBtnText = "正在生成";
                    var p = {
                        "tJbxx":{
                        "cBh":row.cBh
                        }
                    };
                    Artery.ajax.post('/api/spd/formPlus', p).then(function (result) {
                        row.submitSpbBtnLoading = false;
                        row.submitSpbBtnText = "生成审批表";
                        if (result && result.success === true) {
                            if(result.message === 'validFailure') {
                                Artery.notice.warning({
                                    title: '警告',
                                    desc: '审批表未填写完整，请继续填写'
                                });
                            } else {
                                Artery.open({
                                    targetType: '_blank',
                                    url: '../../../approval/cgdyyl/index.html?cBh=' + row.cBh
                                });
                            }
                        }
                    }).catch(function (err) {
                        console.log(err);
                        row.submitSpbBtnLoading = false;
                        row.submitSpbBtnText = "生成审批表";
                    });
                }
            }
        })
    });
