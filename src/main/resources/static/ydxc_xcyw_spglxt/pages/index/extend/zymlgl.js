define(['fdGlobal', 'config', 'fdComponent2', 'fdEventBus'],
    function (fdGlobal, config, fdComponent2, fdEventBus) {
        var _config = JSON.parse(JSON.stringify(config));
        //  单独设置，便于调试
        _config.showLog = true;
        return {
            data: function () {
                return {
                    // 弹框的标题
                    modalTitle: '添加表',
                    zdlxList: [
                        {
                            code: 0,
                            name: '数值型'
                        },
                        {
                            code: 1,
                            name: '字符型'
                        }
                    ],
                    sfwkList: [
                        {
                            code: 1,
                            name: '是'
                        },
                        {
                            code: 2,
                            name: '否'
                        }
                    ],
                    sfwkValue: 1,
                    //
                    cxdwList: [],
                    cCxdw: [],
                    provinceSelectList: [],
                    provinceList: [
                        {
                            "code": "110000000000",
                            "name": "北京市监委",
                            "key": "110000000000",
                            "selected": false,
                            "children":[{
                                "code": "110101000000",
                                "name": "北京市东城区监委",
                                "key": "110101000000",
                                "selected": false
                            },{
                                "code": "110103000000",
                                "name": "北京市海淀区监委",
                                "key": "110103000000",
                                "selected": false
                            },{
                                "code": "110102000000",
                                "name": "北京市西城区监委",
                                "key": "110102000000",
                                "selected": false
                            },
                            ]
                        },
                        {
                            "code": "120000000000",
                            "name": "天津市监委",
                            "key": "120000000000",
                            "selected": false
                        },
                        {
                            "code": "130000000000",
                            "name": "河北省监委",
                            "key": "130000000000",
                            "selected": false
                        },
                        {
                            "code": "140000000000",
                            "name": "山西省监委",
                            "key": "140000000000",
                            "selected": false
                        },
                        {
                            "code": "150000000000",
                            "name": "内蒙古自治区监委",
                            "key": "150000000000",
                            "selected": false
                        },
                        {
                            "code": "210000000000",
                            "name": "辽宁省监委",
                            "key": "210000000000",
                            "selected": false
                        },
                        {
                            "code": "220000000000",
                            "name": "吉林省监委",
                            "key": "220000000000",
                            "selected": false
                        },
                        {
                            "code": "230000000000",
                            "name": "黑龙江省监委",
                            "key": "230000000000",
                            "selected": false
                        },
                        {
                            "code": "310000000000",
                            "name": "上海市监委",
                            "key": "310000000000",
                            "selected": false
                        },
                        {
                            "code": "320000000000",
                            "name": "江苏省监委",
                            "key": "320000000000",
                            "selected": false
                        },
                        {
                            "code": "330000000000",
                            "name": "浙江省监委",
                            "key": "330000000000",
                            "selected": false
                        },
                        {
                            "code": "340000000000",
                            "name": "安徽省监委",
                            "key": "340000000000",
                            "selected": false
                        },
                        {
                            "code": "350000000000",
                            "name": "福建省监委",
                            "key": "350000000000",
                            "selected": false
                        },
                        {
                            "code": "360000000000",
                            "name": "江西省监委",
                            "key": "360000000000",
                            "selected": false
                        },
                        {
                            "code": "370000000000",
                            "name": "山东省监委",
                            "key": "370000000000",
                            "selected": false,
                            "children":[{
                                "code": "370100000000",
                                "name": "济南市监委",
                                "key": "370100000000",
                                "selected": false,
                                "children":[{
                                    "code": "370101000000",
                                    "name": "历下区监委",
                                    "key": "370101000000",
                                    "selected": false
                                },{
                                    "code": "370102000000",
                                    "name": "历城区监委",
                                    "key": "370102000000",
                                    "selected": false
                                },{
                                    "code": "370103000000",
                                    "name": "市中区监委",
                                    "key": "370103000000",
                                    "selected": false
                                }]
                            },{
                                "code": "370200000000",
                                "name": "青岛市监委",
                                "key": "370200000000",
                                "selected": false
                            },{
                                "code": "370300000000",
                                "name": "淄博市监委",
                                "key": "370300000000",
                                "selected": false
                            },
                            ]
                        },
                        {
                            "code": "410000000000",
                            "name": "河南省监委",
                            "key": "410000000000",
                            "selected": false
                        },
                        {
                            "code": "420000000000",
                            "name": "湖北省监委",
                            "key": "420000000000",
                            "selected": false
                        },
                        {
                            "code": "430000000000",
                            "name": "湖南省监委",
                            "key": "430000000000",
                            "selected": false
                        },
                        {
                            "code": "440000000000",
                            "name": "广东省监委",
                            "key": "440000000000",
                            "selected": false
                        },
                        {
                            "code": "450000000000",
                            "name": "广西壮族自治区监委",
                            "key": "450000000000",
                            "selected": false
                        },
                        {
                            "code": "460000000000",
                            "name": "海南省监委",
                            "key": "460000000000",
                            "selected": false
                        },
                        {
                            "code": "500000000000",
                            "name": "重庆市监委",
                            "key": "500000000000",
                            "selected": false
                        },
                        {
                            "code": "510000000000",
                            "name": "四川省监委",
                            "key": "510000000000",
                            "selected": false
                        },
                        {
                            "code": "520000000000",
                            "name": "贵州省监委",
                            "key": "520000000000",
                            "selected": false
                        },
                        {
                            "code": "530000000000",
                            "name": "云南省监委",
                            "key": "530000000000",
                            "selected": false
                        },
                        {
                            "code": "540000000000",
                            "name": "西藏自治区监委",
                            "key": "540000000000",
                            "selected": false
                        },
                        {
                            "code": "610000000000",
                            "name": "陕西省监委",
                            "key": "610000000000",
                            "selected": false
                        },
                        {
                            "code": "620000000000",
                            "name": "甘肃省监委",
                            "key": "620000000000",
                            "selected": false
                        },
                        {
                            "code": "630000000000",
                            "name": "青海省监委",
                            "key": "630000000000",
                            "selected": false
                        },
                        {
                            "code": "640000000000",
                            "name": "宁夏回族自治区监委",
                            "key": "640000000000",
                            "selected": false
                        },
                        {
                            "code": "650000000000",
                            "name": "新疆维吾尔自治区监委",
                            "key": "650000000000",
                            "selected": false
                        },
                        {
                            "code": "660000000000",
                            "name": "新疆生产建设兵团监委",
                            "key": "660000000000",
                            "selected": false
                        }
                    ],
                    cxl: '',
                    entityMember: {'cZxmc': '', 'cCymc': '', 'nZdlx': 0, 'nSfwk': 1, 'cSm': ''},
                    entityInfo: {'cZxmc': '', 'cStmc': '', 'cSm': ''},
                    sjy: {'cName': '', 'cBm': '', 'nSfxzrq': '', 'cSm': '', 'cCxdw': []},
                    sjyFl: {'cName': '', 'cDm': '', 'cSm': ''},
                    hy: {'cHymc': '', 'cHydm': '', 'cDm': '', 'cSm': ''},
                    // 展示用
                    tableDataList: [],
                    // 原生
                    originalTableDataList: [],
                    selectEntityEInfo: {},//选择的实体信息
                    selectSjy: {},//选择的数据源信息
                    authInfos: [],//编辑数据源弹框的授权信息
                    selectSjyFl: {},//选择的数据源信息
                    selectHy: {},
                    selectCxdw: [],//选择的查询单位信息
                    data: {},
                    row: {},
                    provinceInput: '',
                    provinceInputTable: '',
                    // 行业分类字数限制提示
                    showHyfl: false,
                    // 行业描述字数限制提示
                    showHyms: false,
                    // 查询项描述字数限制提示
                    showCxxms: false,
                    // 说明字数限制提示
                    showSm: false,
                    // type为5的时候说明字数限制提示
                    showSm2: false,
                    selectCxdwName: ''
                }
            },
            computed: {
                modalFormType: function () {
                    if (this.modalTitle === '添加行业分类' || this.modalTitle === '编辑行业分类') {
                        return '1'
                    } else if (this.modalTitle === '添加协查单位' || this.modalTitle === '编辑协查单位') {
                        return '2'
                    } else if (this.modalTitle === '添加查询项' || this.modalTitle === '编辑查询项') {
                        return '3'
                    } else if (this.modalTitle === '添加表' || this.modalTitle === '编辑表') {
                        return '4'
                    } else {
                        return '5'
                    }
                }
            },
            created: function () {
                document.querySelector('body').addEventListener('mousedown', this.clickCxdw, false);
                // 调用多少个弹窗 就写对应的这个接收 ---
                fdEventBus.$on('appOpenZymlglModal', this.modalZymlgl);
            },
            destroyed: function () {
                document.querySelector('body').removeEventListener('mousedown', this.clickCxdw, true);
                // 销毁
                fdEventBus.$off('appOpenZymlglModal', this.modalZymlgl);
            },
            mounted: function () {
                this.provinceSelectList = this.provinceList;
                //this.initXcdw();
            },
            methods: {
                // 处理全选
                operateAllChecked: function (groupName) {
                    var _codes = []
                    // 循环下拉列表找到该组数据
                    this.cxdwList.forEach(function (item) {
                        // 找到同组数据
                        if (item.groupName === groupName) {
                            _codes.push(item.code);
                        }
                    });
                    // 当前下拉框中的值
                    var _currentCCxdw = this.sjy.cCxdw;
                    // 循环所有的code, 添加到 sjy.cCxdw 中
                    _codes.forEach(function (code) {
                        // 如果下拉框中不存在该值，就应该添加进去
                        if (_currentCCxdw.indexOf(code) === -1) {
                            _currentCCxdw.push(code)
                        }
                    });
                    // 最终的值
                    this.sjy.cCxdw = _currentCCxdw;
                },
                // 处理取消全选
                operateCancelAllChecked: function (groupName) {
                    var _codes = []
                    // 循环下拉列表找到该组数据
                    this.cxdwList.forEach(function (item) {
                        // 找到同组数据
                        if (item.groupName === groupName) {
                            _codes.push(item.code);
                        }
                    });
                    // 最终的code
                    var _resultCodes = [];
                    // 循环当前的值
                    this.sjy.cCxdw.forEach(function (code) {
                        // 如果该类的下拉框中不存在该值，那么该值就应该继续保留
                        if (_codes.indexOf(code) === -1) {
                            _resultCodes.push(code)
                        }
                    });
                    // 最终的值
                    this.sjy.cCxdw = _resultCodes;
                },
                // 查询单位
                clickCxdw: function (event) {
                    var _event = event;
                    // 如果点击的是下拉组的标题
                    if (_event.target.classList.contains('aty-select-group-title')) {
                        // 切换 checked状态
                        _event.target.classList.toggle('checked');
                        // 获取当前组的名称
                        var _groupName = _event.target.innerHTML;
                        // 如果是全选，选中旗下所有子节点
                        if (_event.target.classList.contains('checked')) {
                            // 处理全选
                            this.operateAllChecked(_groupName)
                        } else {
                            // 处理取消全选
                            this.operateCancelAllChecked(_groupName)
                        }
                    }
                    // 全选后，单个取消全选，去除全选框选中样式
                    if(_event.target.classList.contains('aty-select-item-selected')) {
                        Array.from(_event.target.parentNode.children).every(function(item){
                            if(item.classList.contains('aty-select-item-selected')) {
                                event.target.parentNode.parentNode.children.item(0).classList.remove('checked');
                            }
                        });
                    }
                    // 如果全都选中，增加全选框选中样式
                    if(_event.target.classList.contains('aty-select-item')&&!_event.target.classList.contains('aty-select-item-selected')) {
                        var selectedNum = 0;
                        var selectedLen = _event.target.parentNode.childElementCount;
                        Array.from(_event.target.parentNode.children).forEach(function(item){
                            if(item.classList.contains('aty-select-item-selected')) {
                                selectedNum++;
                                if(selectedNum===selectedLen-1) {
                                    event.target.parentNode.parentNode.children.item(0).classList.add('checked');
                                }
                            }
                        });
                    }
                },
                // 点击下拉输入框中的删除按钮时，去掉全选框选中样式
                changeCxdw: function (event) {
                    var _event = event;
                    // 获取aty-select-selection的内容
                    var _atySelection = _event.target.parentNode.parentNode.children;
                    var _searchText = '';
                    // 获取aty-select-group-wrap的内容
                    if(_atySelection.item(_atySelection.length-1).children.item(1).children.length>0) {
                        var _atySelectGroupWrap = _atySelection.item(_atySelection.length-1).children.item(1).children.item(0).children;
                    }
                    // 循环银行列表，获取当前点击删除的银行属于全国银行还是各省银行
                    this.cxdwList.forEach(function(ele) {
                        if(_event.target.parentNode.children.item(0).innerText===ele.name){
                            _searchText = ele.groupName;
                        }
                    });
                    if(_atySelectGroupWrap && _searchText === '全国银行') {
                        _atySelectGroupWrap.item(0).children.item(0).classList.remove('checked');
                    }
                    if(_atySelectGroupWrap && _searchText === '各省银行') {
                        _atySelectGroupWrap.item(1).children.item(0).classList.remove('checked');
                    }
                },
                // 行业分类
                focusHyfl: function () {
                    this.showHyfl = true;
                },
                blurHyfl: function () {
                    this.showHyfl = false;
                },
                // 行业描述
                focusHyms: function () {
                    this.showHyms = true;
                },
                blurHyms: function () {
                    this.showHyms = false;
                },
                // 查询项描述
                focusCxxms: function () {
                    this.showCxxms = true;
                },
                blurCxxms: function () {
                    this.showCxxms = false;
                },
                // 说明描述
                focusSm: function () {
                    this.showSm = true;
                },
                blurSm: function () {
                    this.showSm = false;
                },
                // type为5说明描述
                focusSm2: function () {
                    this.showSm2 = true;
                },
                blurSm2: function () {
                    this.showSm2 = false;
                },
                /**
                 * @description 授权管理--全部--搜索查询，失去焦点
                 */
                blurSearchProvince: function () {
                    var _this = this;
                    var selectName = [];
                    // 循环原始数据
                    $.each(_this.provinceList, function (index, val) {
                        // 得到用户当前搜索的数据
                        if (val.name.indexOf(_this.provinceInput) > -1) {
                            selectName.push(val);
                        }
                    });
                    // 如果用户搜索的数据没有符合条件的，就显示默认的
                    /*if (selectName.length === 0) {
                        _this.provinceSelectList = _this.provinceList;
                    } else {*/
                    _this.provinceSelectList = selectName;
                    // }
                    this.$nextTick(function () {
                        _this.$refs.cxxFormScroll_left && _this.$refs.cxxFormScroll_left.update();
                        // _this.$refs.cxxTableScroll_right && _this.$refs.cxxTableScroll_right.update();
                    })
                },
                blurSearchProvinceTable: function () {
                    var _this = this;
                    var searchData = [];
                    $.each(this.originalTableDataList, function (index, val) {
                        if (val.cSfName.indexOf(_this.provinceInputTable) > -1) {
                            searchData.push(val);
                        }
                    })
                    // if (searchData.length !== 0) {
                    this.tableDataList = searchData;
                    /* } else {
                         this.tableDataList = this.originalTableDataList;
                     }*/
                },
                /**
                 *  * @Author nfj]
                 *    @description 打开弹框弹窗
                 */
                modalZymlgl: function (val) {
                    var _this = this;
                    _this.modalTitle = val.title;
                    _this.selectEntityEInfo = val.selectEntityEInfo;
                    _this.selectSjy = val.selectSjy;
                    _this.selectSjyFl = val.selectSjyFl;
                    _this.selectHy = val.selectHy;
                    _this.provinceInput = '';
                    _this.provinceInputTable = '';

                    var t = _this.modalFormType;

                    //初始化弹出框信息
                    _this.data = {};
                    _this.entityMember = {'cZxmc': '', 'cCymc': '', 'nZdlx': 0, 'nSfwk': 1, 'cSm': ''};
                    _this.entityInfo = {'cZxmc': '', 'cStmc': '', 'cSm': ''};
                    _this.sjy = {'cName': '', 'cBm': '', 'nSfxzrq': '', 'cSm': '', 'cCxdw': []};
                    _this.sjyFl = {'cName': '', 'cDm': '', 'cSm': ''};
                    _this.hy = {'cHymc': '', 'cHydm': '', 'cDm': '', 'cSm': ''};
                    _this.tableDataList = [];
                    _this.originalTableDataList = [];
                    _this.sjy.cCxdw = [];
                    if(val.selectCxdw!==undefined) {
                        _this.cxdwList = val.selectCxdw;
                    }
                    /*if (val.selectCxdw && val.selectCxdw.length && val.selectCxdw.length > 0) {
	                	for(var i=0;i<val.selectCxdw.length;i++){
	                		_this.sjy.cCxdw = val.selectCxdw[i].code.split(',');
	                	}
                    }*/
                    for (var i = 0; i < _this.provinceList.length; i++) {
                        _this.provinceList[i].selected = false;
                    }

                    //如果是编辑，那么就将数据填入表单
                    if (val.data && val.data.isEdit === true) {
                        //初始化查询单位下拉列表，防止列表数据重复携带
                        _this.sjy.cCxdw = [];
                        _this.cxdwList = [];
                        _this.data = val.data;
                        _this.row = val.row;
                        // 数据回填
                        switch (t) {
                            case "1":
                                _this.sjyFl.cName = _this.row.CNAME;
                                _this.sjyFl.cDm = _this.row.CDM;
                                _this.sjyFl.cSm = _this.row.CSM == undefined ? '' : _this.row.CSM;
                                _this.sjyFl.cId = _this.row.ID;
                                break;
                            case "2":
                                _this.hy.cHymc = _this.row.CHYMC;
                                _this.hy.cHydm = _this.row.CHYDM;
                                _this.hy.cDm = _this.row.CDM;
                                _this.hy.cSm = _this.row.CSM == undefined ? '' : _this.row.CSM;
                                _this.hy.cId = _this.row.ID;
                                break;
                            case "3":
                                _this.sjy.cName = _this.row.CNAME;
                                _this.sjy.cBm = _this.row.CBM;
                                _this.sjy.nSfxzrq = _this.row.NSFXZRQ;
                                _this.cxdwList = _this.row.CCXDW;
                                _this.sjy.cCxdw = _this.row.dws;
                                //查询单位是逗号拼接的，且最后多个逗号（如：a,b,c,）
                                /*if (_this.row.CCXDW && _this.row.CCXDW.length && _this.row.CCXDW.length > 0) {
                                    _this.sjy.cxdw = _this.row.CCXDW.split(',');
                                    //去掉最后一个空字符串
                                    if (_this.sjy.cxdw[_this.sjy.cxdw.length - 1] == '') {
                                        _this.sjy.cxdw.pop();
                                    }
                                	for(var i=0;i<_this.row.CCXDW.length;i++){
                                		_this.sjy.cCxdw = _this.row.CCXDW[i].code.split(',');
                                	}
                                }*/
                                _this.authInfos = val.authInfos;
                                _this.tableDataList = [];
                                _this.originalTableDataList = [];
                                for (var i = 0; i < val.authInfos.length; i++) {
                                    _this.tableDataList.push(
                                        {
                                            'key': val.authInfos[i].c_sf,
                                            'code': val.authInfos[i].c_sf,
                                            'name': val.authInfos[i].c_sf_name,
                                            'cSfName': val.authInfos[i].c_sf_name,
                                            'cSf': val.authInfos[i].c_sf,
                                            'cQueryStart': val.authInfos[i].c_query_start,
                                            'cQueryEnd': val.authInfos[i].c_query_end,
                                            'cQueryCount': val.authInfos[i].c_query_count,
                                            'cIdSjy': val.row.ID,
                                            'cId': val.authInfos[i].c_id
                                        }
                                    );
                                    for (var j = 0; j < _this.provinceList.length; j++) {
                                        if (val.authInfos[i].c_sf == _this.provinceList[j].code) {
                                            _this.provinceList[j].selected = true;
                                        }
                                    }
                                }
                                _this.sjy.cSm = _this.row.CSM == undefined ? '' : _this.row.CSM;
                                _this.sjy.cId = _this.row.ID;
                                break;
                            case "4":
                                _this.entityInfo.cZxmc = _this.row.CZXMC;
                                _this.entityInfo.cStmc = _this.row.CSTMC;
                                _this.entityInfo.cSm = _this.row.CSM == undefined ? '' : _this.row.CSM;
                                _this.entityInfo.cId = _this.row.ID;
                                break;
                            case "5":
                                _this.entityMember.cCymc = _this.row.CCYMC;
                                _this.entityMember.cSm = _this.row.CSM == undefined ? '' : _this.row.CSM;
                                _this.entityMember.cZxmc = _this.row.CZXMC;
                                _this.entityMember.nSfwk = _this.row.NSFWK;
                                _this.entityMember.nZdlx = _this.row.NZDLX;
                                _this.entityMember.cId = _this.row.CID;
                                break;
                            default:
                        }
                    }

                    _this.originalTableDataList = JSON.parse(JSON.stringify(_this.tableDataList));
                    this.$refs.zymlglModel.open();
                    this.$nextTick(function () {
                        // 更新查询项弹框的滚动条
                        _this.$refs.zymlglCxxFormScroll && _this.$refs.zymlglCxxFormScroll.update();
                        _this.$refs.cxxFormScroll_left && _this.$refs.cxxFormScroll_left.update();
                        // _this.$refs.cxxTableScroll_right && _this.$refs.cxxTableScroll_right.update();

                        // 点击编辑，判断全选框需不需要加全选样式
                        this.$nextTick(function(){
                            try {
                                var tkqz = document.getElementById('cxdw').children.item(0).children.length;
                                var xldiv = document.getElementById('cxdw').children.item(0).children.item(tkqz - 1).children.item(1).children.item(0).children
                                // console.dir(document.getElementById('cxdw').children.item(0).children.item(tkqz-1).children.item(1).children.item(0).children)
                                Array.from(xldiv).forEach(function (item) {
                                    // 下拉列表的长度
                                    var xlall = item.children.item(1).children.length;
                                    // class为aty-select-item的元素
                                    var xllis = item.children.item(1).children;
                                    // 全选
                                    var xltitle = item.children.item(0);
                                    var xllen = 0;
                                    Array.from(xllis).forEach(function (xlli) {
                                        // console.dir(xlli.classList)
                                        _this.$nextTick(function () {
                                            if (xlli.classList.contains('aty-select-item-selected')) {
                                                xllen++;
                                                if (xllen === xlall) {
                                                    xltitle.classList.add('checked');
                                                } else {
                                                    xltitle.classList.remove('checked');
                                                }
                                            } else {
                                                xltitle.classList.remove('checked');
                                            }
                                        })

                                    })
                                })
                            }catch (e) {

                            }
                        })
                    })
                },
                okZymlglModal: function () {
                    var _this = this;
                    var url = "";
                    var t = _this.modalFormType;
                    var p;
                    var flag = true;
                    switch (t) {
                        case '1':
                            //校验必填项
                            flag = _this.validTjhyfl();
                            url = "/api/v1/zyml/addSjyFl";
                            p = _this.sjyFl;
                            if (_this.data && _this.data.isEdit == true) {
                                url = "/api/v1/zyml/editSjyFl";
                            } else {
                                p.cPid = _this.selectSjyFl.id;
                            }
                            break;
                        case '2':
                            //校验必填项
                            flag = _this.validTjhy();
                            url = "/api/v1/zyml/addHy";
                            p = _this.hy;
                            if (_this.data && _this.data.isEdit == true) {
                                url = "/api/v1/zyml/editHy";
                            }
                            p.cSjyFl = _this.selectSjyFl.id;
                            p.cMs = p.cSm;
                            break;
                        case '3':
                            //校验必填项
                            flag = _this.validSjy();
                            if(flag){
                                url = "/api/v1/zyml/addSjyAndAuth";
                                p = _this.sjy;
                                // 2021-04-20防止cxdw多次进入被变成string处理
                                if(typeof p.cCxdw == 'object') {
                                    var cxdw_temp = '';
                                    for (var i = 0; i < p.cCxdw.length; i++) {
                                        cxdw_temp += (p.cCxdw[i] + ",");
                                    }
                                    p.cCxdw = cxdw_temp;
                                }
                                if (_this.data && _this.data.isEdit == true) {
                                    url = "/api/v1/zyml/editSjyAndAuth";
                                } else {
                                    //新增查询项的时候，需要数据源的分类信息，修改则不需要
                                    p.cIdFl = _this.selectSjyFl.id;
                                    p.cIdHy = _this.selectHy.id;
                                }
                                p = {"tXtpzSjy": p, "auth": this.originalTableDataList};
                            }
                            break;
                        case '4':
                            //校验必填项
                            flag = _this.validEntityInfo();
                            url = "/api/v1/zyml/addEntityInfo";
                            p = _this.entityInfo;
                            if (_this.data && _this.data.isEdit == true) {
                                url = "/api/v1/zyml/editEntityinfo";
                            } else {
                                p.cId = _this.selectSjy.id + _this.selectSjyFl.id;
                                p.cIdFl = _this.selectSjyFl.id;
                                p.cIdSjy = _this.selectSjy.id;
                            }
                            break;
                        case '5':
                            //校验必填项
                            flag = _this.validEntityMember();
                            url = "/api/v1/zyml/addEntityMember";
                            p = _this.entityMember;
                            if (_this.data && _this.data.isEdit == true) {
                                url = "/api/v1/zyml/editEntityMember";
                            } else {
                                p.cStbh = _this.selectEntityEInfo.code;
                                p.cIdFl = _this.selectSjyFl.id;
                            }
                            break;

                    }
                    if (!flag) {
                        return false;
                    }
                    Artery.ajax.post(url, p).then(function (result) {
                        if (result && result === "success") {
                            Artery.notice.success({
                                title: '请求成功'
                            });
                            // 重置所有的数据
                            _this.sjyFl.cName = '';
                            _this.sjyFl.cDm = '';
                            _this.sjyFl.cSm = '';
                            _this.hy.cHymc = '';
                            _this.hy.cHydm = '';
                            _this.hy.cDm = '';
                            _this.hy.cSm = '';
                            _this.sjy.cName = '';
                            _this.sjy.cBm = '';
                            _this.sjy.nSfxzrq = '';
                            _this.sjy.cCxdw = [];
                            _this.sjy.cSm = '';
                            _this.entityInfo.cZxmc = '';
                            _this.entityInfo.cStmc = '';
                            _this.entityInfo.cSm = '';
                            _this.entityMember.cZxmc = '';
                            _this.entityMember.cCymc = '';
                            _this.entityMember.nZdlx = '';
                            _this.entityMember.nSfwk = '';
                            _this.entityMember.cSm = '';

                            // 循环当前的导航，得到资源目录的导航信息
                            $.each(_this.navDataList, function (index, val) {
                                if (val.key === 'zymlgl') {
                                    _this.clickNavList(val, index)
                                }
                            })
                        } else {
                            Artery.notice.error({
                                title: '请求出错',
                                desc: result.message || ""
                            });
                        }
                        _this.$refs.zymlglModel.close();
                    });
                },
                resetSearch: function () {
                    this.provinceSelectList = this.provinceList;
                },
                clickProvinceList: function (data) {
                    debugger
                    var _this = this;
                    event.stopPropagation()
                    data.selected = !data.selected;
                    if (data.selected == true) {
                        //将信息保存到右侧表格中去
                        var x = false;
                        for (var i = 0; i < this.tableDataList.length; i++) {
                            if (this.tableDataList[i].key == data.key) {
                                x = true;
                            }
                        }
                        if (!x) {
                            data.cSfName = data.name;
                            data.cSf = data.code;
                            data.cQueryStart = '';
                            data.cQueryEnd = '';
                            data.cQueryCount = '';
                            data.cIdSjy = this.selectSjy.id;
                            this.authDataListOperate(data.key, 'add', null, data);
                        }
                    } else if (data.selected == false) {
                        this.authDataListOperate(data.key, 'delete');
                    }
                    _this.$refs.cxxFormScroll_left && _this.$refs.cxxFormScroll_left.update();
                },
                /*initXcdw: function (data) {
                    var _this = this;
                    var p = {};
                    Artery.ajax.post("/api/v1/zyml/getXcdw").then(function (result) {
                        for (var i = 0; i < result.length; i++) {
                            result[i].name = result[i].c_dwmc;
                            result[i].code = result[i].c_id;
                        }
                        _this.cxdw = result;
                    });
                },*/
                clickDeleteAuth: function (key) {
                    var _this = this;
                    this.authDataListOperate(key, 'delete');

                    for (var j = 0; j < _this.provinceList.length; j++) {
                        if (key === _this.provinceList[j].code) {
                            _this.provinceList[j].selected = false;
                        }
                    }
                },
                //在添加行业分类的时候，校验必填项等
                validTjhyfl: function () {
                    var _this = this;
                    if (!_this.sjyFl.cName || _this.sjyFl.cName.trim() == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写行业分类名称！'
                            },
                            interval: 1800
                        });
                        return false
                    } else if (!_this.sjyFl.cDm || _this.sjyFl.cDm.trim() == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写行业分类代码！'
                            },
                            interval: 1800
                        });
                        return false
                    }
                    return true;
                },
                //在添加协查单位的时候，校验必填项等
                validTjhy: function () {
                    var _this = this;
                    if (!_this.hy.cHymc || _this.hy.cHymc.trim() == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写协查单位名称！'
                            },
                            interval: 1800
                        });
                        return false
                    } else if (!_this.hy.cHydm || _this.hy.cHydm.trim() == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写协查单位代码！'
                            },
                            interval: 1800
                        });
                        return false
                    }
                    return true;
                },
                //在添加查询项的时候，校验必填项等
                validSjy: function () {
                    var _this = this;
                    if (!_this.sjy.cName || _this.sjy.cName.trim() === '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写查询项名称！'
                            },
                            interval: 1800
                        });
                        return false
                    } else if (!_this.sjy.cBm || _this.sjy.cBm.trim() === '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写查询项编码！'
                            },
                            interval: 1800
                        });
                        return false
                    } else if (!_this.sjy.nSfxzrq) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请选择是否可选时间段！'
                            },
                            interval: 1800
                        });
                        return false
                    } else if(this.cxdwList.length > 0) {
                        // 存在查询单位时才进行校验
                        if (!_this.sjy.cCxdw || _this.sjy.cCxdw.length === 0) {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请选择查询单位！'
                                },
                                interval: 1800
                            });
                            return false
                        }

                    }
                    //校验授权数据
                    if (_this.originalTableDataList && _this.originalTableDataList.length > 0) {
                        for (var i = 0; i < _this.originalTableDataList.length; i++) {
                            var authEle = _this.originalTableDataList[i];
                            var messageTemp = '';
                            if (!authEle.cQueryStart || !authEle.cQueryEnd) {
                                messageTemp = '查询时间不能为空；';
                            } else {
                                //如果开始和结束时间都不为空，那么比较大小
                                var startTime = new Date(authEle.cQueryStart + ' 00:00:00').getTime();
                                var endTime = new Date(authEle.cQueryEnd + ' 23:59:59').getTime();
                                if (startTime > endTime) {
                                    messageTemp = messageTemp + '查询开始时间不能大于结束时间；';
                                }
                            }
                            if (!authEle.cQueryCount) {
                                messageTemp = messageTemp + '查询量不能为空；';
                            }
                            if (!(Number(authEle.cQueryCount) > 0 && Number(authEle.cQueryCount) < 2147483647)) {
                                messageTemp = messageTemp + '查询量非法或太大；';
                            }
                            if (messageTemp) {
                                $.alert({
                                    type: 'fail',
                                    info: {
                                        fail: '已授权列表中的' + authEle.cSfName + messageTemp
                                    },
                                    interval: 1800
                                });
                                return false;
                            }
                        }
                    }
                    return true;
                },
                //在添加表的时候，校验必填项等
                validEntityInfo: function () {
                    var _this = this;
                    if (!_this.entityInfo.cZxmc || _this.entityInfo.cZxmc.trim() == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写表名称！'
                            },
                            interval: 1800
                        });
                        return false
                    } else if (!_this.entityInfo.cStmc || _this.entityInfo.cStmc.trim() == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写表代码！'
                            },
                            interval: 1800
                        });
                        return false
                    }
                    return true;
                },
                //在添加字段的时候，校验必填项等
                validEntityMember: function () {
                    var _this = this;
                    if (!_this.entityMember.cZxmc || _this.entityMember.cZxmc.trim() == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写字段名称！'
                            },
                            interval: 1800
                        });
                        return false
                    } else if (!_this.entityMember.cCymc || _this.entityMember.cCymc.trim() == '') {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '请填写字段代码！'
                            },
                            interval: 1800
                        });
                        return false
                    }
                    return true;
                },
                changeAuthProp: function (key, prop, value) {
                    this.authDataListOperate(key, 'change', prop, value);
                },
                authDataListOperate: function (key, operate, prop, value) {
                    if (operate === 'add') {
                        this.tableDataList.push(value);
                        this.originalTableDataList.push(value);
                        return;
                    }

                    for (var i = 0; i < this.tableDataList.length; i++) {
                        var data = this.tableDataList[i];
                        if (data.key === key) {
                            if (operate === 'change') {
                                data[prop] = value;
                            } else if (operate === 'delete') {
                                this.tableDataList.splice(i, 1);
                            }
                            break;
                        }
                    }

                    for (var j = 0; j < this.originalTableDataList.length; j++) {
                        var orignData = this.originalTableDataList[j];
                        if (orignData.key === key) {
                            if (operate === 'change') {
                                orignData[prop] = value;
                            } else if (operate === 'delete') {
                                this.originalTableDataList.splice(j, 1);
                            }
                            break;
                        }
                    }
                }
            },
            // created: function () {
            //     document.querySelector('body').addEventListener('mousedown', this.clickCxdw, false);
            //     // 调用多少个弹窗 就写对应的这个接收 ---
            //     fdEventBus.$on('appOpenZymlglModal', this.modalZymlgl);
            // },
        }
    });
