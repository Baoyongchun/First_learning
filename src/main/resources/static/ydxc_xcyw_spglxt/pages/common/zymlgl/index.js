// 查询记录模块
define(['fdComponent2', 'extend/template1.js'], function (fdComponent, template1) {

    new Vue({
        el: '#jsApp',
        mixins: [template1],
        data: {
            pageNow: 2,
            total: 10,
            data2: [],
            // 申请单位
            sqdwList: [],
            sqdw: '',
            // 申请部门
            sqbmList: [],
            sqbm: '',
            optionData: { //目录分页
                totalPage: 10,
                totalSize: 100,
                currentSize: 10,
                currentPage: 1,
                showPoint: false,
                showPage: 4,
                prev: ' ',
                next: " ",
                first: " ",
                last: " ",
                callback: function (num) {
                }
            },
            queryInfo: {},
            param: {},
            /*基本数据*/
            dataDataList: {
                customData: {},
                data: [],
                total: 0,
                limit: 15,
                offset: 0
            },
            // 展开收起的标志
            triggerCode: false,
            //暂无数据是否显示
            zwsjShow: false,
            cxl: '',
            // 这个值根据选中的树的节点的不同，而改变，加载对应的表格以及对应的操作button
            treeTableType: '1',
            selectEntityEInfo: {},//选择的实体信息
            selectSjy: {},//选择的数据源信息
            selectSjyFl: {},//选择的数据源信息
            selectHy: {},//行业
            selectCxdw: [],//查询单位集合
            tree: null
        },
        computed: {
            tableOperaBtn: function () {
                if (this.treeTableType === '1') {
                    return '添加行业分类'
                } else if (this.treeTableType === '2') {
                    return '添加协查单位'
                } else if (this.treeTableType === '3') {
                    return '添加查询项'
                } else if (this.treeTableType === '4') {
                    return '添加表'
                } else {
                    return '添加字段'
                }
            }
        },
        methods: {
            clickZymlglOpenModal: function () {
                var _this = this;
                // this.treeTableType
                var _data = {
                    flag: 'openZymlglModal',
                    title: this.tableOperaBtn,
                    data: {"isEdit": false},
                    selectEntityEInfo: _this.selectEntityEInfo,
                    selectSjy: _this.selectSjy,
                    selectSjyFl: _this.selectSjyFl,
                    selectHy: _this.selectHy,
                    selectCxdw: _this.selectCxdw
                };
                var _dataBj = JSON.stringify(_data);
                window.parent.parent.postMessage(_dataBj, '*')
            },
            changeSelect: function (name) {
            },
            ready: function (scrollbar) {
                scrollbar.update();
            },
            /*展开收起下拉树区域*/
            triggerClick: function () {
                this.triggerCode = !this.triggerCode;
            },
            select: function (treeNodeData, treeNode, event) {
                var _this = this;
                var pNode = treeNode.$props.parent.treeNodeData;

                //加载表格
                _this.queryInfo.limit = getLimit();
                _this.queryInfo.offset = 0;
                _this.queryInfo.splitPage = true;
                _this.param.id = treeNodeData.id;
                var url = '';
                //和按钮联动
                if (treeNodeData.id == '-1' && treeNodeData.tabName == 't_xtpz_sjy_fl') {
                    _this.treeTableType = "1";
                    url = '/api/v1/zyml/getSjyFlByPid';
                    _this.selectSjyFl = treeNodeData;
                } else if (treeNodeData.id != '-1' && pNode.id == '-1' && treeNodeData.tabName == 't_xtpz_sjy_fl') {
                    _this.treeTableType = "2";
                    // url = '/api/v1/zyml/getSjyFlByPid';
                    url = '/api/v1/zyml/getHyBySjyFlId';
                    _this.selectSjyFl = treeNodeData;//pNode;
                    // _this.selectHy = treeNodeData;
                } else if (treeNodeData.id != '-1' && pNode.id != '-1' && treeNodeData.tabName == 't_xtpz_hy') {
                    _this.treeTableType = "3";
                    // url = '/api/v1/zyml/getSjyBySjyFlId';
                    url = '/api/v1/zyml/getSjyByHyId';
                    // _this.selectSjyFl = treeNodeData;
                    _this.selectHy = treeNodeData;
                } else if (treeNodeData.tabName == 't_xtpz_sjy') {
                    _this.treeTableType = "4";
                    url = '/api/v1/zyml/getEntityInfoBySjyId';
                    _this.selectSjy = treeNodeData;
                    _this.selectSjyFl = pNode;
                } else if (treeNodeData.tabName == 't_xtpz_entityinfo') {
                    url = '/api/v1/zyml/sjx/getEMemeberByEInfo';
                    _this.treeTableType = "5";
                    _this.param.stid = treeNodeData.code;
                    _this.selectEntityEInfo = treeNodeData;
                    _this.selectSjy = pNode;
                    _this.selectSjyFl = treeNode.$props.parent.parent.treeNodeData;
                }


                Artery.loadPageData(url, _this.queryInfo, _this.param).then(function (result) {
                    _this.dataDataList = result.data;
                    //获取查询单位list用于添加查询项下拉列表展示
                    for (var i = 0; i < result.data.data.length; i++) {
                        _this.selectCxdw = result.data.data[0].CCXDW;
                    }

                    // 当数据的长度等于0时，暂无数据显示
                    if (_this.dataDataList.data.length <= 0) {
                        _this.zwsjShow = true;
                    } else {
                        _this.zwsjShow = false;
                    }
                    _this.$refs.scrollTable && _this.$refs.scrollTable.update && _this.$refs.scrollTable.update();
                    _this.total = result.data.total;
                    _this.pageNow = _this.dataDataList.data.length;
                    _this.$refs.pagination.currentPage = 1;
                })

            },
            initTree: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/zyml/sjx/tree").then(function (result) {
                    _this.openNodes(result.data);
                    _this.data2 = result.data;
                    _this.$refs.tree.resetInitData(result.data, true);
                    /*if(((_this.data2[0].children)[0].children)[0]!=undefined)
                    {
                        _this.activeId = ((_this.data2[0].children)[0].children)[0].children[0].id;
                    }*/
                    _this.queryInfo.limit = getLimit();
                    _this.queryInfo.offset = 0;
                    _this.queryInfo.splitPage = true;
                    _this.param.id = _this.data2[0].id;


                    _this.treeTableType = "1";
                    _this.selectSjyFl = _this.data2[0];

                    Artery.loadPageData("/api/v1/zyml/getSjyFlByPid", _this.queryInfo, _this.param).then(function (result) {
                        _this.dataDataList = result.data;
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.dataDataList.data.length <= 0) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.$refs.scrollTable && _this.$refs.scrollTable.update();
                        _this.total = result.data.total;
                        _this.pageNow = _this.dataDataList.data.length;
                    })
                    // 更新滚动条的方法
                    _this.updateScroll();
                })
            },
            openNodes: function (treeNodes) {
                var _this = this;
                if (!treeNodes || !treeNodes.length) return;
                for (var i = 0; i < treeNodes.length; i++) {
                    var childs = treeNodes[i].children;
                    if (treeNodes[i].disabled != undefined) treeNodes[i].disabled = false;
                    if (childs && childs.length > 0) {
                        _this.openNodes(childs);
                    }
                }
            },

            /**
             * 表格分页事件
             * @param pageInfo
             */
            change: function (pageInfo) {
                var _this = this;
                _this.queryInfo.limit = pageInfo.limit;
                _this.queryInfo.offset = pageInfo.offset;
                _this.queryInfo.splitPage = true;


                var url = '';
                if (_this.treeTableType === "1") {
                    url = '/api/v1/zyml/getSjyFlByPid';
                } else if (_this.treeTableType === "2") {
                    // url = '/api/v1/zyml/getSjyFlByPid';
                    url = '/api/v1/zyml/getHyBySjyFlId';
                } else if (_this.treeTableType === "3") {
                    // url = '/api/v1/zyml/getSjyBySjyFlId';
                    url = '/api/v1/zyml/getSjyByHyId';
                } else if (_this.treeTableType === "4") {
                    url = '/api/v1/zyml/getEntityInfoBySjyId';
                } else if (_this.treeTableType === "5") {
                    url = '/api/v1/zyml/sjx/getEMemeberByEInfo';
                }

                Artery.loadPageData(url, _this.queryInfo, _this.param).then(function (result) {
                    _this.dataDataList = result.data;
                    // 当数据的长度等于0时，暂无数据显示
                    if (_this.dataDataList.data.length <= 0) {
                        _this.zwsjShow = true;
                    } else {
                        _this.zwsjShow = false;
                    }
                    _this.$refs.scrollTable.update();
                    _this.total = result.data.total;
                    _this.pageNow = _this.dataDataList.data.length;
                })
            },
            clickEditEntityMember: function (row) {
                var _this = this;
                var _data = {
                    flag: 'openZymlglModal',
                    title: '编辑字段',//this.tableOperaBtn,
                    data: {"isEdit": true},
                    row: row,
                    selectEntityEInfo: _this.selectEntityEInfo,
                    selectSjy: _this.selectSjy,
                    selectSjyFl: _this.selectSjyFl,
                    selectHy: _this.selectHy
                };
                var _dataBj = JSON.stringify(_data);
                window.parent.parent.postMessage(_dataBj, '*')
            },
            clickDeleteEntityMember: function (row) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除？',
                    onOk: function () {
                        var p = [];
                        p.push(row.CID)
                        Artery.ajax.post('/api/v1/zyml/deleteEntityMember', p).then(function (result) {
                            if (result && result === "success") {
                                _this.initTree();
                                Artery.notice.success({
                                    title: '删除字段成功'
                                });

                            } else {
                                Artery.notice.error({
                                    title: '请求出错',
                                    desc: result.message || ""
                                });
                            }
                        });

                    }
                });
            },
            clickEditEntityInfo: function (row) {
                var _this = this;
                var _data = {
                    flag: 'openZymlglModal',
                    title: '编辑表',//this.tableOperaBtn,
                    data: {"isEdit": true},
                    row: row,
                    selectEntityEInfo: _this.selectEntityEInfo,
                    selectSjy: _this.selectSjy,
                    selectSjyFl: _this.selectSjyFl,
                    selectHy: _this.selectHy
                };
                var _dataBj = JSON.stringify(_data);
                window.parent.parent.postMessage(_dataBj, '*')
            },
            clickDeleteEntityInfo: function (row) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除？',
                    onOk: function () {
                        var p = [];
                        p.push(row.ID);
                        Artery.ajax.post('/api/v1/zyml/deleteEntityinfo', p).then(function (result) {
                            if (result && result === "success") {
                                _this.initTree();
                                Artery.notice.success({
                                    title: '删除表成功'
                                });
                            } else {
                                Artery.notice.error({
                                    title: '请求出错',
                                    desc: result.message || ""
                                });
                            }
                        });
                    }
                });
            },
            // 添加查询项
            clickEditSjy: function (row) {
                var _this = this;
                Artery.ajax.post("/api/v1/zyml/getAuth", [row.ID]).then(function (result) {
                    var _data = {
                        flag: 'openZymlglModal',
                        title: '编辑查询项',//_this.tableOperaBtn,
                        data: {"isEdit": true},
                        row: row,
                        selectEntityEInfo: _this.selectEntityEInfo,
                        selectSjy: _this.selectSjy,
                        selectSjyFl: _this.selectSjyFl,
                        selectHy: _this.selectHy,
                        authInfos: result
                    };
                    var _dataBj = JSON.stringify(_data);
                    window.parent.parent.postMessage(_dataBj, '*')
                });
            },
            clickDeleteSjy: function (row) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除？',
                    onOk: function () {
                        var p = [];
                        p.push(row.ID);
                        Artery.ajax.post('/api/v1/zyml/deleteSjy', p).then(function (result) {
                            if (result && result === "success") {
                                _this.initTree();
                                Artery.notice.success({
                                    title: '删除查询项成功'
                                });
                            } else {
                                Artery.notice.error({
                                    title: '请求出错',
                                    desc: result.message || ""
                                });
                            }
                        });
                    }
                });
            },
            clickEditHy: function (row) {
                var _this = this;
                var _data = {
                    flag: 'openZymlglModal',
                    title: '编辑协查单位',//this.tableOperaBtn,
                    data: {"isEdit": true},
                    row: row,
                    selectEntityEInfo: _this.selectEntityEInfo,
                    selectSjy: _this.selectSjy,
                    selectSjyFl: _this.selectSjyFl,
                    selectHy: _this.selectHy
                };
                var _dataBj = JSON.stringify(_data);
                window.parent.parent.postMessage(_dataBj, '*')
            },
            clickDeleteHy: function (row) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除？',
                    onOk: function () {
                        var p = [];
                        p.push(row.ID);
                        Artery.ajax.post('/api/v1/zyml/deleteHy', p).then(function (result) {
                            if (result && result === "success") {
                                _this.initTree();
                                Artery.notice.success({
                                    title: '删除协查单位成功'
                                });
                            } else {
                                Artery.notice.error({
                                    title: '请求出错',
                                    desc: result.message || ""
                                });
                            }
                        });
                    }
                });
            },
            clickEditSjyFl: function (row) {
                var _this = this;
                var _data = {
                    flag: 'openZymlglModal',
                    title: '编辑行业分类',//this.tableOperaBtn,
                    data: {"isEdit": true},
                    row: row,
                    selectEntityEInfo: _this.selectEntityEInfo,
                    selectSjy: _this.selectSjy,
                    selectSjyFl: _this.selectSjyFl,
                    selectHy: _this.selectHy
                };
                var _dataBj = JSON.stringify(_data);
                window.parent.parent.postMessage(_dataBj, '*')
            },
            clickDeleteSjyFl: function (row) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除？',
                    onOk: function () {
                        var p = [];
                        p.push(row.ID);
                        Artery.ajax.post('/api/v1/zyml/deleteSjyFl', p).then(function (result) {
                            if (result && result === "success") {
                                _this.initTree();
                                Artery.notice.success({
                                    title: '删除行业分类成功'
                                });
                            } else {
                                Artery.notice.error({
                                    title: '请求出错',
                                    desc: result.message || ""
                                });
                            }
                        });
                    }
                });
            },
            syncAll: function () {
                Artery.ajax.get("/api/v1/zyml/syncAll").then(function (result) {
                    if (result.code == "200") {
                        Artery.notice.success({
                            title: 'Success',
                            desc: '已成功向数据协同系统发送资源目录同步请求！'
                        });
                    } else {
                        Artery.notice.error({
                            title: 'Error',
                            desc: '向数据协同系统发送资源目录同步请求失败！'
                        })
                    }
                });
            },
            gotoSyncSelected: function () {
                var _this = this;
                Artery.open({
                    targetType: '_window',
                    url: "../../zyxc/gly/zymlgl/asftb/index.html",
                    height: 500,
                    width: 900,
                    title: '按省份同步',
                    className: 'fd-asftb-model'
                })
            },
            searchInput: function (value) {
                var _this = this;
                // 选中的元素的距离顶部的位置
                var selectedTreeTop = this.tree.focusTreeNode.$el.offsetTop;
                // 滚动的距离
                _this.$refs.jsTreeScroll.updateTop(selectedTreeTop);
            },
            readyTree: function(tree) {
                this.tree = tree;
                // 更新滚动条的方法
                this.updateScroll();
            },
            // 树节点展开
            expand:function (treeNodeData, treeNode, event) {
                // alert('展开')
                // 更新滚动条的方法
                this.updateScroll();
            },
            // 树节点折叠
            collapse:function (treeNodeData, treeNode, event) {
                // alert('折叠')
                // 更新滚动条的方法
                this.updateScroll();
            },
            // 更新滚动条的方法
            updateScroll:function () {
                var _this = this;
                _this.$refs.jsTreeScroll && _this.$refs.jsTreeScroll.update();
            }
        },
        mounted: function () {
            var _this = this;
            _this.initTree();
        }
    })


})
