// 查询记录模块
define(['fdComponent2', 'extend/template1.js'], function (fdComponent, template1) {

    new Vue({
        el: '#jsApp',
        mixins: [template1],
        data: {
            activeId: '',
            pageNow: 2,
            total: 20,
            data2: [],
            // 申请单位
            sqdwList: [{
                key: '1',
                name: '单位1'
            },
                {
                    key: '2',
                    name: '单位2'
                }
            ],
            sqdw: '',
            // 申请部门
            sqbmList: [{
                key: '1',
                name: '部门1'
            },
                {
                    key: '2',
                    name: '部门2'
                }
            ],
            sqbm: '',
            /*基本数据*/
            dataDataList: [],
            queryInfo: {},
            param: {},
            hasRight: false,
            triggerCode: false,// 展开收起标志
            //暂无数据是否显示
            zwsjShow:false,
            tree: null,
            firstTableCode:''
        },
        // 创建
        created: function () {

        },
        methods: {
            /*展开收起下拉树区域*/
            triggerClick: function() {
                this.triggerCode = !this.triggerCode;
            },
            ready: function (scrollbar) {
                scrollbar.update();
            },
            changeSelect: function (name) {
                console.log('name')
            },
            pushAll: function(arr1, arr2) {
                for (var i = arr2.length-1; i >= 0; i--) {
                    arr1.push(arr2[i]);
                }
            },
            findFirstTableId: function () {
                var limit = 100;
                var firstTableId;
                var stack = [];
                var _this=this;
                this.pushAll(stack, this.data2);
                while(stack.length > 0 && limit > 0) {
                    var node = stack.pop();
                    if(node.tabName === 't_xtpz_entityinfo') {
                        firstTableId = node.id;
                        _this.firstTableCode=node.code;
                        break;
                    } else if(node.children && node.children.length > 0) {
                        this.pushAll(stack, node.children);
                    }
                    limit--;
                }
                return firstTableId;
            },
            initTree: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/zyml/sjx/tree").then(function (result) {
                    _this.data2 = result.data;
                    _this.$refs.tree.resetInitData(result.data, true);
                    _this.queryInfo.limit = getLimit();
                    _this.queryInfo.offset = 0;

                    _this.activeId = _this.findFirstTableId();
                    _this.param.stid = _this.firstTableCode;
                    _this.getSjxList();
                    // 更新滚动条的方法
                    _this.updateScroll();
                })
            },
            change: function (pageInfo) {
                this.queryInfo.limit = pageInfo.limit;
                this.queryInfo.offset = pageInfo.offset;
                this.getSjxList();
            },
            select: function (treeNodeData, treeNode, event) {
                var _this = this;
                _this.queryInfo.limit = getLimit();
                _this.queryInfo.offset = 0;
                _this.param.stid = treeNodeData.code;
                _this.getSjxList(function (result) {
                    _this.$refs.pagination.currentPage = 1;
                });
            },
            getSjxList: function(callback) {
                var _this = this;
                _this.queryInfo.splitPage = true;
                Artery.loadPageData("/api/v1/zyml/sjx/list", _this.queryInfo, _this.param).then(function (result) {
                    _this.dataDataList = result.data;
                    // 当数据的长度等于0时，暂无数据显示
                    _this.zwsjShow = _this.dataDataList.data.length <= 0;
                    // _this.$refs.scrollsjx.update();
                    _this.total = result.data.total;
                    _this.pageNow = _this.dataDataList.data.length;
                    if(callback) {
                        callback(result);
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
                    url: "../../../zyxc/gly/zymlgl/asftb/index.html",
                    height: 500,
                    width: 900
                })
            },

            loadRight: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/admin/right/ydxc.zyml.tb")
                    .then(function (result) {
                        _this.hasRight = result;
                    })
            },
            // 搜索条件
            searchInput: function (value) {
                // 选中的元素的距离顶部的位置
                var selectedTreeTop = this.tree.focusTreeNode.$el.offsetTop;
                // 滚动的距离
                this.$refs.jsTreeScroll.updateTop(selectedTreeTop);
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
            _this.loadRight();
        }
    })
});
