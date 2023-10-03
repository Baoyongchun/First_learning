/**
 * version      20200218
 * createTime   20200218
 * updateTime    20200218
 * author        whf
 * name          navTaboOperation .js
 *description    导航页签操作js
 */
define(['config', 'fdGlobal', 'Promise'], function (config, fdGlobal, Promise) {
    var _config = JSON.parse(JSON.stringify(config));
    return {
        data: {
            // 导航数据（20个）
            navDataList: [
                {
                    name: '组织用户管理',   //0
                    key: 'zzyhgl',
                    count: 0,
                    url: './../common/zzyhgl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '数据统计',  //1
                    key: 'sjtj',
                    count: 0,
                    url: './../zyxc/jdy/sjtj/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '查询监测', //2
                    key: 'cxjc',
                    count: 0,
                    url: './../zyxc/gly/cxjc/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: 'IP配置', //3
                    key: 'ippz',
                    count: 0,
                    url: './../common/ippz/index.html',
                    children: [],
                    show: false,
                },
                // {
                //     name: '书印管理',
                //     key: 'sygl',
                //     count: 0,
                //     url: '',
                //     show: false,
                //     children: [{
                //             name: '文书管理',
                //             key: 'wsgl',
                //             count: 0,
                //             url: '',
                //         },
                //         {
                //             name: '印模管理',
                //             key: 'ymgl',
                //             count: 0,
                //             url: '',
                //         }
                //     ]
                // },
                {
                    name: '导出查询申请', //4
                    key: 'dccxsq',
                    count: 0,
                    url: './../zyxc/gly/ddccxsq/index.html',
                    show: false,
                    children: [
                        {
                            name: '待导出',
                            key: 'ddc',
                            count: 0,
                            show: false,
                            url: './../zyxc/gly/ddccxsq/index.html'
                        },
                        {
                            name: '已导出',
                            key: 'ydc',
                            count: 0,
                            show: false,
                            url: './../zyxc/gly/ydccxsq/index.html'
                        },
                        // {
                        //     name: '已退回',
                        //     key: 'yth',
                        //     count: 0,
                        //     show: false,
                        //     url: './../zyxc/gly/ythcxsq/index.html'
                        // },
                        {
                            name: '退回记录',
                            key: 'bhjl',
                            count: 0,
                            url: './../dfxc/provincial/bhjl/bhlb/index.html?flag=zy',
                            show: false,
                        }
                    ]
                },
                {
                    name: '查询记录', //5
                    key: 'cxjl',
                    count: 0,
                    url: './../dfxc/provincial/pJdy/cxjl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '操作行为记录', //6
                    key: 'czxwjl',
                    count: 0,
                    url: './../common/czxwjl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '查询统计', //7
                    key: 'cxtj',
                    count: 0,
                    url: './../common/cxtj/index.html',
                    children: [],
                    show: false,
                },
                /*{
                    name: '资源目录',//8
                    key: 'zyml',
                    count: 0,
                    url: './../common/zyml/zymlXcdw/index.html',
                    show: false,
                    children: [{
                            name: '协查单位',
                            key: 'xcdw',
                            show: false,
                            count: 0,
                            url: './../common/zyml/zymlXcdw/index.html',
                        },
                        {
                            name: '数据项',
                            show: false,
                            key: 'sjx',
                            count: 0,
                            url: './../common/zyml/zymlSjx/index.html',
                        }
                    ]
                },*/
                {
                    name: '资源目录',//8
                    key: 'zyml',
                    count: 0,
                    url: './../common/zyml/zymlGraph/index.html',
                    children: [],
                    show: false
                },
                {
                    name: '查询申请', //9
                    key: 'cxsq',
                    count: 0,
                    url: './../dfxc/provincial/pCxy/cxsq/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '查询流程', //10
                    key: 'cxlc',
                    count: 0,
                    url: './../dfxc/provincial/pCxy/cxlct/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '查询申请审核', //11
                    key: 'cxsqsh',
                    count: 0,
                    url: './../dfxc/provincial/pShy/cxsqsh/dsh/index.html',
                    children: [{
                            name: '待审核',
                            key: 'dsh',
                            count: 0,
                            show: false,
                            url: './../dfxc/provincial/pShy/cxsqsh/dsh/index.html',
                        },
                        {
                            name: '已审核',
                            key: 'ysh',
                            count: 0,
                            show: false,
                            url: './../dfxc/provincial/pShy/cxsqsh/ysh/index.html',
                        }
                    ],
                    show: false,
                },
                {
                    name: '查询申请盖章', //12
                    key: 'pGzgly',
                    count: 0,
                    url: './../dfxc/provincial/pGzgly/dgz/index.html',
                    children: [{
                            name: '待盖章',
                            key: 'dgz',
                            count: 0,
                            show: false,
                            url: './../dfxc/provincial/pGzgly/dgz/index.html',
                        },
                        {
                            name: '已盖章',
                            key: 'ygz',
                            count: 0,
                            show: false,
                            url: './../dfxc/provincial/pGzgly/ygz/index.html',
                        }],
                    show: false,
                },
                {
                    name: '工作证审核', //13
                    key: 'gzzsh',
                    count: 0,
                    url: './../dfxc/provincial/pShy/gzzsh/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '查询文号配置', //14
                    key: 'cxwhpz',
                    count: 0,
                    url: './../dfxc/provincial/pGly/cxwhpz/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '基础数据管理', //15
                    key: 'jcsjgl',
                    count: 0,
                    url: './../zyxc/gly/jcsjgl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '印模管理', //16
                    key: 'ymgl',
                    type: 2,
                    count: 0,
                    url: './../dfxc/provincial/pGzgly/dfjcsjgl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '基础数据管理', //17
                    key: 'jcsjgl',
                    type: 1,
                    count: 0,
                    url: './../dfxc/provincial/pGzgly/dfjcsjgl/index.html',
                    children: [],
                    show: false
                },
                {
                    name: '反馈意见管理', //18
                    key: 'fkyjgl',
                    count: 0,
                    url: './../zyxc/gly/fkyjgl/index.html',
                    children: [],
                    show: false
                },
                {
                    name: '资源目录管理', //19
                    key: 'zymlgl',
                    count: 0,
                    url: './../common/zymlgl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '查询申请审批', //20
                    key: 'cxsqsp',
                    count: 0,
                    url: './../dfxc/provincial/pSpy/cxsqsp/dsp/index.html',
                    children: [{
                            name: '待审批',
                            key: 'dsp',
                            count: 0,
                            show: false,
                            url: './../dfxc/provincial/pSpy/cxsqsp/dsp/index.html',
                        },
                        {
                            name: '已审批',
                            key: 'ysp',
                            count: 0,
                            show: false,
                            url: './../dfxc/provincial/pSpy/cxsqsp/ysp/index.html',
                        }
                    ],
                    show: false
                },
                {
                    name: '查询员清单', //21
                    key: 'cxyqd',
                    count: 0,
                    url: './../common/cxyqd/index.html',
                    children: [],
                    show: false,
                },
                {
                    name:'查看结果', //22
                    key: 'cxjg',
                    count: 0,
                    url: './../dfxc/provincial/pCxy/cxjg/index.html',
                    children: [],
                    show: false,
                },
                {
                    name:'退回申请', //23
                    key: 'thsq',
                    count: 0,
                    // url: './../dfxc/provincial/pCxy/thsq/index.html',
                    url: './../dfxc/provincial/bhjl/bhlb/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '消息发布', //24
                    key: 'xxfb',
                    count: 0,
                    url: './../zyxc/gly/newxxfb/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '查询监测', //25
                    key: 'cxjc',
                    count: 0,
                    url: './../dfxc/provincial/cxjc/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '反馈时长', //26
                    key: 'fksc',
                    count: 0,
                    url: './../dfxc/provincial/fksc/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '组织用户管理',   //27
                    key: 'zzyhgl',
                    count: 0,
                    url: './../common/zzyhgljdy/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '日志监测',  //28
                    key: 'rzjc',
                    count: 0,
                    url: './../zyxc/gly/rzjc/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '角色配置',  //29
                    key: 'rzjc',
                    count: 0,
                    url: './../common/xtjspz/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '资源授权管理', //30
                    key: 'zysqgl',
                    count: 0,
                    url: './../common/zysqgl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '意见反馈', //31
                    key: 'newyjfkgl',
                    count: 0,
                    url: './../common/newyjfkgl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '意见回复', //32
                    key: 'newzyyjfkgl',
                    count: 0,
                    url: './../common/newzyyjfkgl/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '统计分析', //33
                    key: 'tjfx',
                    count: 0,
                    url: './../common/tjfx/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '申请单比对',  //34
                    key: 'sqdbd',
                    count: 0,
                    url: './../zyxc/gly/sqdbd/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '退回记录',  //35
                    key: 'bhjl',
                    count: 0,
                    url: './../dfxc/provincial/bhjl/bhlb/index.html',
                    children: [],
                    show: false,
                },
                /* { 根据最新反馈，暂时不需要这个模块，先注释掉
                     name: '导入反馈结果',
                     key: 'drfkjg',
                     count: 0,
                     url: './../zyxc/gly/drfkjg/index2.html',
                     children: [],
                     show: false
                 }*/
                {
                    name: '系统管理员配置',  //36
                    key: 'ippz',
                    count: 0,
                    url: './../common/xtglypz/index.html',
                    children: [],
                    show: false,
                },
                {
                    name: '消息发布',  //37  地方消息发布
                    key: 'xxfb',
                    count: 0,
                    url: './../dfxc/xxfb/index.html',
                    children: [],
                    show: false,
                },
            ],
            // iframe src路径
            iframeSrcPath: '',
            // 默认显示导航中的第一个
            navIndex: 0,
            // 子导航默认显示第一个
            navChildIndex: 0,
            // 登录人身份请求地址
            serverUrlLoginPerson: config.url.frame.loginPerson,
            // 登录人身份
            loginPerson: '',
            // 登录人姓名
            loginName:'',
            // 登录人id
            loginId:'',
            // 登录人单位
            loginDept:'',
            // 登录人职位
            loginZw:'',
            // 登录人职级
            loginZj:'',
            // 登录人头像
            loginSrc:'',
            childrenUl: true,
            userManualUrl: '',
            noticeUrl: '/api/notice/getnotices',
            noticeCount: 0,
            noticeList: [],
            // 判断是中央的还是地级的logo
            zyOrdfLogo: 'zy',
            // 是否展示消息提醒的框
            isShowInfo: false,
            ryqx: []
        },
        created: function () {
            this.requestCurrent();
        },
        // 方法
        methods: {
            /*
             *  getLocalPathNavUrlIframe 获取url路径
             * */
            getLocalPathNavUrlIframe: function (isAbsUrl) {
                // 获取当前页面的url地址
                var curWwwPath = window.location.href;
                // 获取当前的ip以及端口号后面的路径
                var pathName = window.location.pathname;
                var pos = curWwwPath.indexOf(pathName);
                var localhostPath = curWwwPath.substring(0, pos);
                return isAbsUrl ? (localhostPath + '/') : '';
            },
            getFrameUrl: function(item, key) {
                var url = this.getLocalPathNavUrlIframe(false) + item.url + "?type=" + item.type;
                if(key === 'zzyhgl') {
                    url = url + '&role=' + this.loginPerson;
                }
                return url;
            },
            // ./../zyxc/jdy/sjtj/index2.html?type=undefined
            /*
            *  clickClose 点击收起
            * */
            clickClose: function(item, key) {
                if(key === this.navIndex && this.childrenUl ) {
                    this.childrenUl = false;
                } else if(!this.childrenUl && key === this.navIndex) {
                    this.childrenUl = true;
                }else{
                    this.childrenUl = true;
                }
            },
            /*
             *  clickNavList 点击左侧导航
             * */
            clickNavList: function (item, key){
                var _this = this;
                // 说明有子级，选中子级中的
                if (item.children.length !== 0) {
                    // 获取显示的子级的url
                    var urlList = [];
                    item.children.forEach(function(itemC, indexC) {
                        // 匹配第一个数据
                        if (indexC === 0) {
                            // 判断第一个数据是否显示
                            if (itemC.show) {
                                _this.navChildIndex = 0;
                                urlList.push(itemC.url);
                            } else {
                                _this.navChildIndex = 1;
                            }
                        } else {
                            // 判断第二个数据是否显示
                            if (itemC.show) {
                                urlList.push(itemC.url);
                            }
                        }
                    })
                    item.url = urlList[0]
                }
                this.childrenUl = true;
                this.navIndex = key;
                this.$refs.jsMainIframe.src = this.getFrameUrl(item, item.key);
                this.$refs.scrollTable.update();
                if (item.key === 'cxjc'){
                    fdGlobal.devareLocalStorage('cxjc-search');
                }
            },
            /*
             *  clickNavChildList 点击左侧子导航
             * */
            clickNavChildList: function (item, itemChild, key) {
                if (item.children.length > 0) {
                    this.$refs.jsMainIframe.src = this.getFrameUrl(itemChild, key);
                    this.iframeSrcPath = this.$refs.jsMainIframe.src;
                    this.navChildIndex = key;
                }
            },
            /*
             *  clickNavList 点击左侧导航
             * */
            iframeSrc: function (item) {
                this.iframeSrcPath = this.$refs.jsMainIframe.src;
            },
            /**
             * @Author: wjing
             * @name: requestCurrent
             * @description: 请求登录人身份
             * @param {type}
             * @return: {undefined}
             */
            requestCurrent: function () {
                var _this = this;
                $.ajax({
                    method: config.methodGet,
                    url: _this.serverUrlLoginPerson,
                    // data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        if (data.code == 200) {
                            _this.loginPerson = data.data.roles.toString();
                            _this.corpLevel = data.data.corpLevel;
                            fdGlobal.saveSessionStorage("loginPerson", _this.loginPerson);
                            _this.loginName = data.data.name;
                            _this.loginDept = data.data.deptName;
                            _this.loginZw = data.data.position;
                            _this.loginZj = data.data.rank;
                            _this.ryqx = data.data.ryqx;
                            _this.userManualUrl = data.data.userManualUrl;
                            if(data.data.photo){
                                _this.loginSrc = data.data.photo;
                            }else{
                                _this.loginSrc="./images/info/icon-default.png";
                            }
                            _this.showNavList();
                            // 地方端所有用户加上，消息通知模块
                            if(_this.zyOrdfLogo === 'df') {
                                _this.navDataList.push({
                                    name: '消息通知',
                                    key: 'xxtz',
                                    count: 0,
                                    url: './../dfxc/provincial/xxtz/index.html',
                                    children: [],
                                    show: true
                                });
                            }
                            //请求得到消息提醒树的方法
                            _this.initNoticeLogs();
                            if(_this.loginPerson == 'gzgly') {
                                _this.getCxsqgzDgz();
                            }else if(_this.loginPerson == 'shy') {
                                // 如果是审核员，获取工作证的待审核数量
                                _this.getGzzshList();
                                _this.getJcsjgl();
                            }else if(_this.loginPerson == 'zyjdy') {
                                _this.getDccxsqDdc();
                                _this.getZyFkyjgl();
                            }else if(_this.loginPerson == 'zyxtgly') {
                                _this.getZyJcsjgl();
                                _this.getZyFkyjgl();
                            }else if (_this.loginPerson == 'cxy') {
                                // _this.getThsq();
                                _this.getCxjg();
                            } else if (_this.zyOrdfLogo === 'df' && _this.loginPerson == 'gly' && _this.corpLevel == 2) {
                                //省管理员显示反馈意见管理
                                _this.getZyFkyjgl();
                            }
                        }
                        //输出日志
                        fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                    },
                    error: function (data, textStatus, errorThrown) {
                        console.log(data, textStatus, errorThrown)
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            initNoticeLogs: function () {
                console.info('initNoticeLogs');
                var _this = this;
                $.ajax({
                    method: config.methodGet,
                    url: _this.noticeUrl,
                    dataType: 'json',
                    success: function (data) {
                        if(data.success) {
                            // 处理所有的消息通知
                            var xxtzList = data.data.filter(function (item) {
                                return item.type === 28 ||item.type === 29;
                            });
                            if(xxtzList.length >= 0) {
                                _this.navDataList.forEach(function (_item) {
                                    if (_item.key === 'xxtz') {
                                        _item.count = xxtzList.length;
                                        return false;
                                    }
                                })
                            }
                            // 如果是审核员 保留查询申请发送失败通知
                            if(_this.loginPerson === 'shy') {
                                _this.noticeList = data.data.filter(function (item) {
                                    return item.type === 4 || item.type === 6 || item.type === 7;
                                });
                            }else {
                                _this.noticeList = data.data.filter(function (item) {
                                    return item.type === 6 || item.type === 7 ||item.type === 29;
                                });
                            }
                            if (_this.noticeList.length > 0) {
                                // 20210105 默认收起
                                // 20210107 又展开了
                                _this.isShowInfo = true;
                            } else {
                                _this.isShowInfo = false;
                            }
                            _this.noticeCount = _this.noticeList.length;
                            var notice = fdGlobal.getNoticeCounts4LoginPerson(data.data, data.data.length, _this.loginPerson);
                            _this.navDataList.forEach(function (_item) {
                                if(_item.key === notice.key) {
                                    _item.count = notice.noticeCount;
                                }
                            });
                        }
                        //输出日志
                        fdGlobal.consoleLogResponse(config.showLog, _this.name + '静态数据', data)
                    },
                    error: function (data, textStatus, errorThrown) {
                        console.log(data, textStatus, errorThrown)
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            // 消息提醒展开
            clickExtendInfo: function() {
                var _this = this;
                // 如果消息为list为空的话，不显示弹框
                if (_this.noticeList.length === 0) {
                    _this.isShowInfo = false;
                } else {
                    _this.isShowInfo = true;
                }
                _this.$nextTick(function() {
                    _this.$refs.scrollInfo.update();
                })
            },
            // 消息提醒收起
            clickCloseInfo: function() {
                var _this = this;
                _this.isShowInfo = false;
            },
            // 点击消息提醒的list跳转页面
            clickGotoPage: function(notice, index) {
                var _this = this;
                // 反馈意见回复的消息不在首页置为已读,cxid为空的时候，点击置为已读
                var _sffkyj = true;
                    if(notice.type == 7  && notice.cxId){
                        _sffkyj = false;
                    }
                if(index < 0){
                    _this.noticeList.forEach((item,ind)=>{
                        if(item.id == notice.id){
                            return index = ind;
                        }
                    })
                }
                if(_sffkyj && index >= 0) {
                    Artery.ajax.get(_this.updateNoticeStatusUrl, {
                        params: {
                            id: notice.id,
                            readed: notice.readed
                        }
                    }).then(function (res) {
                        if(res.success) {
                            _this.noticeList.splice(index, 1);
                            if (_this.noticeCount <= 0){
                                _this.noticeCount = 0;
                            } else {
                                _this.noticeCount--;
                            }
                            _this.$refs.scrollInfo && _this.$refs.scrollInfo.update();
                            // 如果消息为list为空的话，不显示弹框
                            if (_this.noticeList.length === 0) {
                                _this.isShowInfo = false;
                            } else {
                                _this.isShowInfo = true;
                            }
                            _this.initNoticeLogs();
                        }
                    });
                }
                if(!notice.url) {
                    return;
                }
                var openType = notice.openType;
                if(openType === '_blank') {
                    Artery.open({
                        targetType: openType,
                        url:config.dirHtmlPath + notice.url + notice.cxId
                    });
                } else if(openType === '_parent') {
                    this.navDataList.forEach(function(itemS, indexS){
                        if (itemS.url === notice.url) {
                            _this.clickNavList(itemS, indexS)
                        } else {
                            itemS.children.forEach(function(itemV, indexV) {
                                if (itemV.url === notice.url) {
                                    _this.navIndex = indexS;
                                    _this.clickNavChildList(itemS,itemV,indexV)
                                }
                            })
                        }
                    });
                }
            },
            // 得到权限配置的导航信息
            getNavList: function(data) {
                var _navList = {
                    "ydxc.cxtj": {
                        nav: this.navDataList[7],
                        parentCode: 7
                    },
                    "ydxc.jcsjgl.scjcsj": {
                        nav: this.navDataList[17].children[0],
                        parentCode: 17
                    },
                    "ydxc.jcsjgl.tbjcsj": {
                        nav: this.navDataList[17].children[1],
                        parentCode: 17
                    },
                    "ydxc.jcsjgl": {
                        nav: this.navDataList[17],
                        parentCode: 17
                    },
                    "ydxc.gzzsh": {
                        nav: this.navDataList[13],
                        parentCode: 13
                    },

                    "ydxc.zyml":{
                    	nav: this.navDataList[8],
                        parentCode: 8
                    },
                    // "ydxc.zyml.sjx":{
                    // 	nav: this.navDataList[8].children[0],
                    //     parentCode:8
                    // },
                    // "ydxc.zyml.xcdw":{
                    // 	nav: this.navDataList[8].children[1],
                    //     parentCode:8
                    // },
                    "ydxc.cxwhpz":{
                    	nav: this.navDataList[14],
                    	parentCode:14
                    },

                    "ydxc.cxlc":{
                    	nav: this.navDataList[10],
                        parentCode:10
                    },
                    "ydxc.jcsjgl.ym":{
                    	nav: this.navDataList[16],
                        parentCode:16
                    },
                    "ydxc.cxsqsp":{
                    	nav: this.navDataList[20],
                        parentCode:20
                    },
                    "ydxc.cxsqsp.dsp":{
                    	nav: this.navDataList[20].children[0],
                        parentCode:20
                    },
                    "ydxc.cxsqsp.ysp":{
                    	nav: this.navDataList[20].children[1],
                        parentCode:20
                    },
                    "ydxc.cxyqd":{
                        nav: this.navDataList[21],
                        parentCode:21
                    },
                }[data];
                return _navList;
            },
            /**
             * @Author: wjing
             * @name: showNavList
             * @description: 导航展示情况
             * @param {type}
             * @return: {undefined}
             */
            showNavList: function () {
                var _this = this;
                var dataNav = JSON.parse(JSON.stringify(_this.navDataList));
                /**
                 * TODO wlq  按原型显示目录顺序
                 * */
                var _arr = [];
                if (_this.loginPerson === 'zyxtgly') {
                    // 中央登录
                    _this.zyOrdfLogo = 'zy';
                    _arr = [];
                    // 组织用户管理
                    _this.navDataList[0].show = true;
                    // 数据统计
                    // _this.navDataList[1].show = true;
                    //迁移至中央监督员
                    //又迁回来了，中央监督员名字更改为查询管理员，查询管理员与中央系统管理员都有查询监测功能
                    // 查询监测2
                    _this.navDataList[2].show = true;
                    // IP配置3
                    _this.navDataList[3].show = true;
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[7].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    // 基础数据管理15
                    _this.navDataList[15].show = true;
                    //资源目录管理
                    _this.navDataList[19].show = true;
                    //消息发布
                    _this.navDataList[24].show = true;
                    //日志监测
                    _this.navDataList[28].show = true;
                    _this.navDataList[30].show = true;
                    _this.navDataList[31].show = true;
                    _this.navDataList[32].show = true;
                    _this.navDataList[33].show = true;
                    _this.navDataList[34].show = true;
                    _arr.push(_this.navDataList[0]);
                    _arr.push(_this.navDataList[8]);
                    // 资源目录管理
                    // _arr.push(_this.navDataList[1]);
                    _arr.push(_this.navDataList[2]);
                    _arr.push(_this.navDataList[3]);
                    _arr.push(_this.navDataList[15]);
                    _arr.push(_this.navDataList[4]);
                    _arr.push(_this.navDataList[19]);
                    _arr.push(_this.navDataList[24]);
                    // _arr.push(_this.navDataList[7]);
                    //日志监测
                    _arr.push(_this.navDataList[28]);
                    //资源授权
                    _arr.push(_this.navDataList[30]);
                    //新意见反馈
                    _arr.push(_this.navDataList[31]);
                    _arr.push(_this.navDataList[32]);
                    _arr.push(_this.navDataList[33]);
                    _arr.push(_this.navDataList[34]);
                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                            _this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                    _this.navDataList = _arr;
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)
                } else if (_this.loginPerson === 'zyjdy') {
                    // 中央登录
                    _this.zyOrdfLogo = 'zy';
                    _this.navDataList[27].show = true;
                    // 查询监测2
                    _this.navDataList[2].show = true;
                    // 导出查询申请4
                    _this.navDataList[4].show = true;
                    _this.navDataList[4].children[0].show = true;
                    _this.navDataList[4].children[1].show = true;
                    _this.navDataList[4].children[2].show = true;
                    // _this.navDataList[4].children[3].show = true;
                    // 查询记录5 v3.1.2 不展示查询记录
                    // _this.navDataList[5].show = true;
                    // 操作行为记录6
                    _this.navDataList[6].show = true;
                    // 查询统计7
                    _this.navDataList[7].show = true;
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    _this.navDataList[21].show = true;
                    // 查询统计7
                    // _this.navDataList[33].show = true;
                    _arr.push(_this.navDataList[27]);
                    _arr.push(_this.navDataList[2]);
                    _arr.push(_this.navDataList[4]);
                    _arr.push(_this.navDataList[6]);
                    _arr.push(_this.navDataList[7]);
                    _arr.push(_this.navDataList[8]);
                    _arr.push(_this.navDataList[21]);
                    // _arr.push(_this.navDataList[33]);
                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                            _this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                        _this.navDataList = _arr;
                        // 页面加载的时候，默认展示第一个页签
                        _this.clickNavList(_this.navDataList[0], 0)
                    } else if (_this.loginPerson === 'cxy') {
                        // 地方登录
                    _this.zyOrdfLogo = 'df';
                    _arr = [];
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    // 查询申请9
                    _this.navDataList[9].show = true;
                    // 查询流程10
                    _this.navDataList[10].show = true;
                    // 查看结果22
                    _this.navDataList[22].show = true;
                    // 退回申请23
                    _this.navDataList[23].show = true;
                    //意见反馈
                    _this.navDataList[31].show = true;
                    // _this.navDataList[35].show = true;
                    _arr.push(_this.navDataList[9]);
                    _arr.push(_this.navDataList[22]);
                    _arr.push(_this.navDataList[23]);
                    _arr.push(_this.navDataList[8]);
                    _arr.push(_this.navDataList[10]);
                    _arr.push(_this.navDataList[31]);
                    // _arr.push(_this.navDataList[35]);
                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                            if(item==='ydxc.jcsjgl.ym'){
                                _arr.push(_this.getNavList(item).nav);
                            }
                            _this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                    _this.navDataList = _arr;
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)

                } else if (_this.loginPerson === 'shy') {
                    // 地方登录
                    _this.zyOrdfLogo = 'df';
                    _arr = [];
                    /*// 查询监测2
                    _this.navDataList[2].show = true;*/
                    // 查询统计7
                    _this.navDataList[7].show = true;
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    // 查询申请审核11
                    _this.navDataList[11].show = true;
                    _this.navDataList[11].children[0].show = true;
                    _this.navDataList[11].children[1].show = true;
                    // 工作证审核13
                    _this.navDataList[13].show = true;
                    // 查询文号配置14
                    _this.navDataList[14].show = true;
                    // 基础数据管理17
                    _this.navDataList[17].show = true;
//                    _this.navDataList[17].children[0].show = true;
//                    _this.navDataList[17].children[1].show = true;
                    _this.navDataList[21].show = true;
                    _this.navDataList[25].show = true;
                    _this.navDataList[26].show = true;
                    _this.navDataList[31].show = true;
                    _this.navDataList[35].show = true;
                    // _arr.push(_this.navDataList[2]);
                    _arr.push(_this.navDataList[11]);
                    _arr.push(_this.navDataList[13]);
                    _arr.push(_this.navDataList[14]);
                    _arr.push(_this.navDataList[17]);
                    _arr.push(_this.navDataList[8]);
                    _arr.push(_this.navDataList[7]);
                    _arr.push(_this.navDataList[21]);
                    _arr.push(_this.navDataList[25]);
                    _arr.push(_this.navDataList[26]);
                    _arr.push(_this.navDataList[31]);
                    _arr.push(_this.navDataList[35]);
                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                        	if(item==='ydxc.jcsjgl.ym'){
                            	_arr.push(_this.getNavList(item).nav);
                            	}
                        	_this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                    _this.navDataList = _arr;
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)
                } else if (_this.loginPerson === 'gly') {
                    // 地方登录
                    _this.zyOrdfLogo = 'df';
                    // 组织用户管理
                    _this.navDataList[0].show = true;
                    // IP配置3
                    _this.navDataList[3].show = true;
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[7].show = true;
                    //消息发布
                    _this.navDataList[37].show = true;
                    _this.navDataList[29].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    _this.navDataList[31].show = true;
                    //反馈意见管理--地方端只有省的管理员才有此菜单，需要判断是省单位登录--todo
                    var corpLevel = _this.corpLevel;//所在单位级别
                    if (corpLevel == 2) {//省级
                        _this.navDataList[36].show = true;
                        _this.navDataList[32].show = true;
                    }

                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                            _this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)
                } else if (_this.loginPerson === 'jdy') {
                    // 地方登录
                    _this.zyOrdfLogo = 'df';
                    _arr = [];
                    // 查询记录5
                    _this.navDataList[5].show = true;
                    // 操作行为记录6
                    _this.navDataList[6].show = true;
                    // 查询统计7
                    _this.navDataList[7].show = true;
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    _this.navDataList[25].show = true;
                    _this.navDataList[31].show = true;
                    _this.navDataList[33].show = true;
                    // _this.navDataList[35].show = true;
                    _arr.push(_this.navDataList[5]);
                    _arr.push(_this.navDataList[7]);
                    _arr.push(_this.navDataList[8]);
                    _arr.push(_this.navDataList[6]);
                    _arr.push(_this.navDataList[25]);
                    _arr.push(_this.navDataList[31]);
                    _arr.push(_this.navDataList[33]);
                    _arr.push(_this.navDataList[35]);
                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                        	if(item==='ydxc.jcsjgl.ym'){
                            	_arr.push(_this.getNavList(item).nav);
                            	}
                            _this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                    _this.navDataList = _arr;
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)
                } else if(_this.loginPerson === 'gzgly'){
                    // 地方登录
                    _this.zyOrdfLogo = 'df';
                    _arr = [];
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    // 查询申请盖章12
                    _this.navDataList[12].show = true;
                    _this.navDataList[12].children[0].show = true;
                    _this.navDataList[12].children[1].show = true;
                    // 基础数据管理16
                    _this.navDataList[16].show = true;
                    _this.navDataList[31].show = true;
                    _this.navDataList[19].show = true;
                    _arr.push(_this.navDataList[12]);
                    _arr.push(_this.navDataList[16]);
                    _arr.push(_this.navDataList[8]);
                    _arr.push(_this.navDataList[31]);
                    _arr.push(_this.navDataList[19]);
                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                            _this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                    _this.navDataList = _arr;
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)
                } else if (_this.loginPerson === 'spy') {
                    // 地方登录
                    _this.zyOrdfLogo = 'df';
                    _arr = [];
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    _this.navDataList[20].show = true;
                    _this.navDataList[31].show = true;
                    _this.navDataList[20].children[0].show = true;
                    _this.navDataList[20].children[1].show = true;
                    _arr.push(_this.navDataList[20]);
                    _arr.push(_this.navDataList[8]);
                    _arr.push(_this.navDataList[31]);
                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                        	if(item==='ydxc.jcsjgl.ym'){
                            	_arr.push(_this.getNavList(item).nav);
                            	}
                            _this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                    _this.navDataList = _arr;
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)
                }else if(_this.loginPerson ==='cxjcy') {
                    // 中央登录
                    _this.zyOrdfLogo = 'zy';
                    _arr = [];
                    // 组织用户管理
                    _this.navDataList[0].show = true;
                    // 查询监测2
                    _this.navDataList[2].show = true;
                    // 资源目录
                    _this.navDataList[8].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    //资源目录管理
                    _this.navDataList[19].show = true;
                    _this.navDataList[31].show = true;
                    _arr.push(_this.navDataList[0]);
                    _arr.push(_this.navDataList[2]);
                    _arr.push(_this.navDataList[8]);
                    _arr.push(_this.navDataList[19]);
                    _arr.push(_this.navDataList[31]);
                    _this.navDataList = _arr;
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)
                }else if(_this.loginPerson ==='shjdy') {
                    // 地方登录
                    _this.zyOrdfLogo = 'df';
                    _arr = [];
                    // 查询记录5
                    _this.navDataList[5].show = true;
                    // 操作行为记录6
                    _this.navDataList[6].show = true;
                    // 查询统计7
                    _this.navDataList[7].show = true;
                    // 资源目录8
                    _this.navDataList[8].show = true;
                    // _this.navDataList[8].children[0].show = true;
                    // _this.navDataList[8].children[1].show = true;
                    // 查询申请审核11
                    _this.navDataList[11].show = true;
                    _this.navDataList[11].children[0].show = true;
                    _this.navDataList[11].children[1].show = true;
                    // 工作证审核13
                    _this.navDataList[13].show = true;
                    // 查询文号配置14
                    _this.navDataList[14].show = true;
                    // 基础数据管理17
                    _this.navDataList[17].show = true;
                    _this.navDataList[21].show = true;
                    //查询监测
                    _this.navDataList[25].show = true;
                    _this.navDataList[26].show = true;
                    _this.navDataList[31].show = true;
                    _this.navDataList[35].show = true;
                    _arr.push(_this.navDataList[11]);
                    _arr.push(_this.navDataList[25]);
                    _arr.push(_this.navDataList[7]);
                    _arr.push(_this.navDataList[5]);
                    _arr.push(_this.navDataList[6]);
                    _arr.push(_this.navDataList[13]);
                    _arr.push(_this.navDataList[14]);
                    _arr.push(_this.navDataList[17]);
                    _arr.push(_this.navDataList[8]);
                    _arr.push(_this.navDataList[21]);
                    _arr.push(_this.navDataList[26]);
                    _arr.push(_this.navDataList[31]);
                    _arr.push(_this.navDataList[35]);
                    _this.ryqx.forEach(function(item) {
                        // 判断是否是子级的隐藏与显示
                        if (item.split('.').length === 3) {
                            if(item==='ydxc.jcsjgl.ym'){
                                _arr.push(_this.getNavList(item).nav);
                            }
                            _this.getNavList(item).nav.show = true;
                        } else {
                            _this.getNavList(item).nav.show = true;
                            _arr.push(_this.getNavList(item).nav);
                        }

                    });
                    _this.navDataList = _arr;
                    // 页面加载的时候，默认展示第一个页签
                    _this.clickNavList(_this.navDataList[0], 0)
                }
            },
            showChildNav:function (item){
                // 判断是否是子级的隐藏与显示
                if (item.split('.').length === 3) {
                    if(this.getNavList(item)){
                        this.getNavList(item).nav.show = true;
                    }
                } else {
                    if(this.getNavList(item)) {
                        this.getNavList(item).nav.show = true;
                    }
                }
            },
            // 地方端-获取工作证审核列表
            getGzzshList: function () {
                var _this = this;
                var _params = {
                    nZt: 1,
                    currentPage: 1,
                    currentSize: 15
                }
                Artery.loadPageData(config.url.frame.getGzzspList,_params).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.navDataList.forEach(function (item) {
                            if(item.key == 'gzzsh') {
                                item.count = result.data.pageOut.totalSize;
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

            // 地方端-获取基础管理数据
            getJcsjgl: function () {
                var _this = this;
                var _queryInfo = {
                    px: "desc",
                    type: "1"
                };
                Artery.loadPageData(config.url.frame.jcsjListUrl, _queryInfo)
                    .then(function (result) {
                        var _arr = result.data.filter(function (item){ return item.valid == 2});
                        _this.navDataList.forEach(function (item) {
                            if(item.key == 'jcsjgl') {
                                item.count = _arr.length;
                            }
                        })
                    });
            },

            // 地方端-获取退回申请
            getThsq: function() {
                var _this = this;
                var queryInfo = {
                    limit: 10,
                    offset: 0,
                    splitPage: true
                };
                //查询条件
                var query = {
                    endDate: '', //退回结束时间
                    startDate: '', //退回开始时间
                    keyword: '', //检索关键词，
                    status: [], //申请状态(多选)
                    cXsxx: 0 //线上线下（1：线下2：线上，0：所有）
                };
                Artery.ajax.post(config.url.frame.bhjl + 'tableInfo?v=' + new Date().getTime(), {
                    conditions: query,
                    queryInfo: queryInfo
                }).then(function (result) {
                    _this.navDataList.forEach(function (item) {
                        if (item.key == 'thsq') {
                            item.count = result.total;
                        }
                    });
                });
            },
            // 地方端-获取查看结果
            getCxjg: function() {
                var _this = this;
                Artery.ajax.get(config.url.frame.serverUrlCxJgCount, {
                    params: {
                        sjzt: '1',
                    }
                }).then(function(result) {
                    _this.navDataList.forEach(function (item) {
                        if (item.key == 'cxjg') {
                            item.count = result.data;
                        }
                    });
                });
            },

            // 中央端-获取导出查询申请-待导出数据
            getDccxsqDdc: function () {
                var _this = this;
                var _cxtj = {
                    zt: 6
                }
                _cxtj.time = Date.now();
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                _cxtj.sqkssj = year + '-01-01';
                _cxtj.sqjssj = year + "-" + (month > 9 ? month : '0' + month) + "-" + (day > 9 ? day : '0' + day);
                var _queryInfo = {
                    offset: 15,
                    offset: 0
                }
                Artery.loadPageData("/api/v1/cxsqxx", _queryInfo, _cxtj)
                    .then(function (result) {
                        if (result.success && result.code === "200") {
                            _this.navDataList.forEach(function (item) {
                                if(item.key == 'dccxsq') {
                                    item.count = result.data.total;
                                    item.children[0].count = result.data.total;
                                }
                            })
                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                    })
            },

            // 中央端-中央系统管理员-获取基础数据管理
            getZyJcsjgl: function () {
                var _this = this;
                var _jcsjgl = {
                    //状态
                    status: 1
                };
                var _queryInfo = {
                    limit: 1000,
                    splitPage: true,
                    tableId: "aty-table_1"
                };
                Artery.loadPageData(config.url.frame.zyJcsjListUrl, _queryInfo, _jcsjgl).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.navDataList.forEach(function (item) {
                            if(item.key == 'jcsjgl') {
                                item.count = result.data.jcsjList.filter(function (item) {
                                    return item.nNew === 1 && item.nValid === 1
                                }).length;
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

            // 中央端-中央系统管理员-获取反馈意见管理
            getZyFkyjgl: function () {
                var _this = this;
                var _queryInfo = {
                    limit: 1000,
                    offset: 0
                };
                Artery.loadPageData("/api/feedback/receiver/list", _queryInfo, null).then(function (result) {
                    if (result.success && result.code === "200") {
                        var _arr = result.data.data.filter(function (item) {
                            return item.status == 2;
                        });
                        _this.navDataList.forEach(function (item) {
                            if(item.key == 'fkyjgl') {
                                item.count = _arr.length;
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
            getCxsqgzDgz: function () {
                var _this = this;
                var _queryInfo = {
                    limit: 15,
                    offset: 0
                };
                var param = {
                    zt: 1
                };
                Artery.loadPageData(config.url.frame.cxgzlbUrl, _queryInfo, param).then(function (result) {
                    if (result.success && result.code === "200") {
                        _this.navDataList.forEach(function (item) {
                            if(item.key == 'pGzgly') {
                                item.count = result.data.total;
                                item.children[0].count = result.data.total;
                            }
                        })
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                });
            }
        },
        mounted: function () {
            var _this = this;
            window.addEventListener('message', function (evt) {
                if(evt.data == 'reload-Message') {
                    _this.initNoticeLogs();
                }else if(evt.data.message == 'spy-dsp') {
                    _this.navDataList.forEach(function (item) {
                        if(item.key == 'cxsqsp') {
                            item.children[0].count = evt.data.count;
                            item.count = evt.data.count;
                        }
                    })
                }else if(evt.data.message == 'shy-cxsqsh-dsh') {
                    _this.navDataList.forEach(function (item) {
                        if(item.key == 'cxsqsh') {
                            item.children[0].count = evt.data.count;
                            item.count = evt.data.count;
                        }
                    })
                }else if(evt.data.message == 'xxtz-df') {
                    _this.navDataList.forEach(function (item) {
                        if(item.key == 'xxtz') {
                            item.count = evt.data.count;
                        }
                    })
                }else if(evt.data.message == 'shy-cxjg') {
                    _this.getCxjg();
                }else if(evt.data.message == 'gzgly-dgz') {
                    _this.getCxsqgzDgz();
                }else if(evt.data.message == 'shy-gzzsh') {
                    _this.getGzzshList();
                }else if(evt.data.message == 'shy-jcsjgl') {
                    _this.getJcsjgl();
                }else if(evt.data.message == 'zy-jdy-dccxsq') {
                    _this.getDccxsqDdc();
                }else if(evt.data.message == 'zy-zyxtgly-jcsjgl') {
                    _this.getZyJcsjgl();
                }else if(evt.data.message == 'zy-zyxtgly-fkyjgl') {
                    _this.getZyFkyjgl();
                }else if(evt.data.message == 'shy-thsq' || (!evt.data.message&&JSON.parse(evt.data).message == 'shy-thsq')) {
                    // _this.getThsq();
                }else if(evt.data.message == 'xxtz-ck'){
                    _this.clickGotoPage(evt.data.notice,-1);
                }
                // _this.requestCurrent();
            }, false);
        }
    }
});
