// 查询记录模块
define(['jquery'], function (jquery) {
    new Vue({
        // 控制器id
        el: '#jsCxtj',
        // 数据
        data: {
            // 列列表
            // colList: new Array(46),
            colList: new Array(64),
            dColList: new Array(63),
            //左侧列列表
            // leftColList: new Array(10),
            leftColList: new Array(2),
            dfleftColList: new Array(4),
            //统计时间
            endDate: '',
            startDate: '',
            // 申请单位
            sqdw: [],
            // 申请单位名称
            sqdwName: '',
            // 申请部门
            sqbm: '',
            deptList: [],
            // 申请单位选择后绑定的数据
            sqdwValue: null,
            // 表格数据-中央
            dataList: [],
            // 表格数据-地方
            dataListDf: [],
            // 总计数据-中央
            dataZj: {},
            // 总计数据-地方
            dataZjDf: {},
            loading: false,
            isCenter: false,
            page: 1,
            limit: 15,
            nothing: false,
            realStarTime: '',
            realEndTime: '',
            timer: null,
            options3: {
                disabledDate: function (date) {
                    return date
                }
            },
            //暂无数据是否显示
            zwsjShow: false,
            resizeHeight: 0,
            //统计表类型(默认为：1)：1:基本信息表  2:明细表 (必传)
            tjbType: '1',
            // 统计表类型列表
            tjlxList: [
                {
                    code: '1',
                    name: '基本信息表'
                },
                {
                    code: '2',
                    name: ' 明细表'
                }
            ],
            //查询层级(默认为：1)：1:全国  2:省本级 3：市本级 4：区县本级 (必传)
            cxcj: '1',
            // 查询层级
            cxcjList: [
                {
                    code: '1',
                    name: '全国'
                },
                {
                    code: '2',
                    name: '省级'
                },
                {
                    code: '3',
                    name: '市级'
                },
                {
                    code: '4',
                    name: '区县级'
                }
            ],
            // 基本信息表与明细表展示，默认展示基本信息表
            isMxb: false,
            // 明细表表格是否鼠标划过
            isMxbHover: false,
            // 设置明细表左侧最后一列样式
            mxbLeftLastTdClass: false,
            cancelRequest:null,
            isDept: false,
            sqdwPrev: '',
            level: '1',
            level1:{
                flag: true,
                id:'',
                name:'中央纪委国家监委',
                level:'1'
            },
            level2:{
                flag: false,
                id:'',
                name:'',
                level:'2'
            },
            level3:{
                flag: false,
                id:'',
                name:'',
                level:'3'
            },
            level4:{
                flag: false,
                id:'',
                name:'',
                level:'4'
            },
            isDoubleClick:false,
            initsqdw:'',
            initsqdwName:''
        },
        // 方法
        methods: {
            // 明细表鼠标划过时
            mxbtdmouseover: function (item) {
                item.isMxbHover = true;
                this.$forceUpdate();
            },
            // 明细表鼠标划出时
            mxbtdmouseout: function (item) {
                item.isMxbHover = false;
                this.$forceUpdate();
            },
            /**
             *  @Author wlq
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset: function () {
                this.isDept = false;
                this.sqdwPrev = '';
                if(!this.isCenter){
                    this.level1.flag = false;
                }
                this.level2.flag = false;
                this.level3.flag = false;
                this.level4.flag = false;
                this.sqbm = '';
                this.level = '1';
                this.sqdwName = '中央纪委国家监委';
                this.cxcj='1';
                // 重置查询项(中央端和地方端分别处理)
                if (this.isCenter == true) {
                    this.sqdw = '';
                    this.initTree();
                } else {
                    // @Version 3.2.6 添加处理单位
                    this.sqdw = this.initsqdw;
                    this.sqbm = '';
                    this.initTime();
                }
            },
            searchResetDf: function () {
                // 重置查询项(中央端和地方端分别处理)
                this.isDept = false;
                this.sqdwPrev = '';
                if(!this.isCenter){
                    this.level1.flag = false;
                }
                this.level2.flag = false;
                this.level3.flag = false;
                this.level4.flag = false;
                this.sqbm = '';
                if (this.isCenter == true) {
                    this.sqdw = '';
                    this.initTree();
                } else {
                    // @Version 3.2.6 添加处理单位
                    this.sqdw = this.initsqdw;
                    this.sqbm = '';
                    this.initTime();
                }
            },

            /**
             * 统计总数-中央
             */
            count: function () {
                var _this = this;
                _this.initnav(_this.sqdwName,_this.sqdw);
                if(_this.isCenter){
                    _this.zyJbxxScrollEvent();
                    _this.zyMxbScrollEvent();
                } else {
                    _this.zyScrollEvent();
                }
                // 根据tjbType判断基本统计表与明细表的展示
                if (this.tjbType === "1") {
                    _this.isMxb = false;
                } else if (this.tjbType === "2") {
                    _this.isMxb = true;
                }
                _this.page = 1;
                _this.limit = 15;
                _this.dataList = [];
                _this.nothing = false;
                _this.loadata();
                Artery.axios.get("/api/v1/cxtj/total?tjbType=" + this.tjbType + "&corpid=" + _this.sqdw + "&cxcj=" + _this.cxcj
                    + "&startime=" + this.date2Str(_this.startDate) + "&endtime=" + this.date2Str(_this.endDate))
                    .then(function (result) {
                        _this.dataZj = result.data.total;
                        _this.$nextTick(function () {
                            // 适应大小屏的滚动条
                            _this.resizeHeight = $('.fd-content-table').height();
                        })
                    });
                // 中央端查询统计表格滚动条置顶 置左
                Array.prototype.forEach.call(document.querySelectorAll('.js-zy-scroll-table .fd-scroll-table-content, .js-zy-mxb-scroll-table .js-mxb-right-con'), function (item) {
                    item.scrollTop = 0;
                    item.scrollLeft = 0;
                });
            },
            /**
             * 统计总数-地方
             */
            countDf: function () {
                var _this = this;
                _this.initnav(_this.sqdwName,_this.sqdw);
                // 同步滚动
                _this.dfScrollEvent();
                // 根据tjbType判断基本统计表与明细表的展示
                if (this.tjbType === "1") {
                    _this.isMxb = false;
                } else if (this.tjbType === "2") {
                    _this.isMxb = true;
                }
                _this.page = 1;
                _this.limit = 15;
                _this.dataListDf = [];
                _this.nothing = false;
                _this.loadataDf();
                //截掉sqbm前5位  @Version 3.2.6 注释掉
                // _this.bm = _this.isEmpty(_this.sqbm) ? '' : _this.sqbm.slice(5);
                // @Version 3.2.6 添加处理部门
                var bm = '';
                if(typeof this.sqbm == 'object'){
                    for (var i = 0; i < this.sqbm.length; i++) {
                        bm += (this.sqbm[i] + ',')
                    }
                }
                Artery.axios.get("/api/v1/cxtj/totalDf?tjbType=" + this.tjbType + "&corpid=" + this.sqdw + "&deptid=" + bm + "&startime=" +
                    this.date2Str(_this.startDate) + "&endtime=" + this.date2Str(_this.endDate))
                    .then(function (result) {
                        _this.dataZjDf = result.data.total;
                        _this.$nextTick(function () {
                            // 适应大小屏的滚动条
                            _this.resizeHeight = $('.fd-content-table').height();
                        })
                    });
                // 地方端查询统计表格滚动条置顶 置左
                Array.prototype.forEach.call(document.querySelectorAll('.js-df-scroll-table .fd-scroll-table-content, .js-df-mxb-scroll-table .js-mxb-right-con'), function (item) {
                    item.scrollTop = 0;
                    item.scrollLeft = 0;
                });
            },
            /**
             * 加载列表数据-中央
             * @param top
             * @param left
             * @param scrollbar
             */
            loadata: function (top, left, scrollbar) {
                var _this = this;
                Artery.axios.get("/api/v1/cxtj/result?tjbType=" + _this.tjbType + "&corpid=" + _this.sqdw + "&cxcj=" + _this.cxcj
                    + "&startime=" + this.date2Str(_this.startDate) + "&endtime=" + this.date2Str(_this.endDate) +
                    "&page=" + _this.page + "&limit=" + _this.limit)
                    .then(function (result) {
                        _this.nothing = result.data.data.length < _this.limit;
                        _this.dataList = _this.dataList.concat(result.data.data);
                        // 循环添加isMxbHover字段
                        _this.dataList.forEach(function (item) {
                            item.isMxbHover = false;
                        });
                        _this.loading = false;
                        if (_this.dataList.length === 0) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.$nextTick(function () {
                            // 左侧表格内容
                            var mxbLeftCon = this.$refs.jsMxbLeftCon;
                            if(mxbLeftCon.scrollHeight > mxbLeftCon.clientHeight) {
                                // 有滚动条时
                                this.mxbLeftLastTdClass = true;
                            } else {
                                // 无滚动条时
                                this.mxbLeftLastTdClass =  false;
                            }
                        })
                    });
            },
            // @Version 3.2.6 地方数据去重
            dataListDfUnique:function(dataList){
                for (var i = 0; i < dataList.length;i++){
                    for (var j = i+1; j < dataList.length;j++){
                        if(dataList[i].sqbmid === dataList[j].sqbmid){
                            dataList.splice(dataList[i], 1);
                            j--;
                        }
                    }
                }
                return dataList;
            },
            /**
             * 加载列表数据-地方
             * @param top
             * @param left
             * @param scrollbar
             */
            loadataDf: function () {
                var _this = this;
                //截掉sqbm前5位  @Version 3.2.6 注释掉
                var bm = '';
                // _this.bm = _this.isEmpty(_this.sqbm) ? '' : _this.sqbm.slice(5);
                // @Version 3.2.6 添加处理部门
                if(typeof this.sqbm == 'object'){
                    for (var i = 0; i < this.sqbm.length; i++) {
                        bm += (this.sqbm[i] + ',')
                    }
                }
                // @Version 3.2.6 添加单位corpid参数
                Artery.axios.get("/api/v1/cxtj/resultDf?tjbType=" + _this.tjbType + "&corpid=" + this.sqdw + "&deptid=" + bm + "&startime=" +
                    this.date2Str(_this.startDate) + "&endtime=" + this.date2Str(_this.endDate) +
                    "&page=" + _this.page + "&limit=" + _this.limit)
                    .then(function (result) {
                        _this.nothing = result.data.data.length < _this.limit;
                        _this.dataListDf = _this.dataListDf.concat(result.data.data);
                        // @Version 3.2.6 数组去重
                        // _this.dataListDf = _this.dataListDfUnique(_this.dataListDf);
                        // 循环添加isMxbHover字段
                        _this.dataListDf.forEach(function (item) {
                            item.isMxbHover = false;
                        });
                        _this.loading = false;
                        if (_this.dataListDf.length === 0) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.$nextTick(function(){
                            // 左侧表格内容
                            var mxbLeftCon = this.$refs.jsDfMxbLeftCon;
                            if(mxbLeftCon.scrollHeight > mxbLeftCon.clientHeight) {
                                // 有滚动条时
                                this.mxbLeftLastTdClass = true;
                            } else {
                                // 无滚动条时
                                this.mxbLeftLastTdClass =  false;
                            }
                        })

                    });
            },
            /**
             *
             * 导出excle-中央
             */
            exportExcle: function () {
                window.open("/api/v1/cxtj/excle?tjbType=" + this.tjbType + "&corpid=" + this.sqdw + "&cxcj=" + this.cxcj
                    + "&startime=" +
                    this.date2Str(this.startDate != '' ? this.startDate : today.getFullYear() + '-01-01') + "&endtime=" + this.date2Str(this.endDate));
            },
            /**
             *
             * 导出excle-地方
             */
            exportExcleDf: function () {
                var _this = this;
                //截掉sqbm前5位  @Version 3.2.6 注释掉
                // _this.bm = _this.isEmpty(_this.sqbm) ? '' : _this.sqbm.slice(5);
                // @Version 3.2.6 添加处理部门
                var bm = '';
                if(typeof _this.sqbm == 'object'){
                    for (var i = 0; i < _this.sqbm.length; i++) {
                        bm += (_this.sqbm[i] + ',')
                    }
                }
                // @Version 3.2.6 添加单位corpid参数
                window.open("/api/v1/cxtj/excleDf?tjbType=" + _this.tjbType + "&corpid=" + this.sqdw + "&deptid=" + bm + "&startime=" +
                    this.date2Str(this.startDate != '' ? this.startDate : today.getFullYear() + '-01-01') + "&endtime=" + this.date2Str(this.endDate));
            },
            /**
             * 判空
             * @param obj
             * @returns {boolean}
             */
            isEmpty: function (obj) {
                if (typeof obj === 'undefined' || obj === null || obj === '' || Object.keys(obj).length === 0 || obj.length === 0) {
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * 滚动加载
             * @param top
             * @param left
             * @param scrollbar
             * @returns {boolean}
             * @Version 3.2.6 注释掉无用代码
             */
            /*scrolltolower: function (top, left, scrollbar) {
                var _this = this;
                //判断此时是否正在更新数据
                if (_this.loading) {
                    return false;
                }

                if (_this.nothing) {
                    if (_this.timer == null) {
                        _this.timer = setTimeout(function () {
                            Artery.message.info("已经到底了。。。");
                            _this.timer = null;
                        }, 2000);
                    }
                    return false;
                }
                //加载定时器更新状态
                // _this.loading = true;
                //更新滚动条距离
                // scrollbar.update(top + 60, left, function () {
                //     Artery.message.info("数据加载中。。。")
                // });
                _this.page++;
                if (_this.isCenter === true) {
                    _this.loadata(top, left, scrollbar);
                } else {
                    _this.loadataDf(top, left, scrollbar);
                }

            },*/
            // 监听table滚动事件，滚动到底部时加载数据
            getDistance: function (event, flag) {
                var _this = this;
                //判断此时是否正在更新数据
                if (_this.loading) {
                    return false;
                }

                if (_this.nothing) {
                    // if (_this.timer == null) {
                    //     _this.timer = setTimeout(function () {
                    //         _this.timer = null;
                    //     }, 2000);
                    // }
                    return false;
                }
                var dom = event.target;
                var scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
                //等于0证明已经到底，可以请求接口
                if (scrollDistance <= 0) {
                    //加载定时器更新状态
                    // _this.loading = true;
                    _this.page++;
                    if(_this.isCenter === true){
                        _this.loadata();
                    }else if(_this.isDept === false){
                        _this.loadata();
                    }else{
                        _this.loadataDf();
                    }

                }
            },

            /**
             * @Author: wjing
             * @name: selectSqdw
             * @description: 点击申请单位
             * @param treeNodeData {treeNodeData}
             * @return: {undefined}
             */
            selectSqdw: function (treeNodeData) {
                // this.sqdw = treeNodeData.id || '';
                // // 申请单位名称
                // this.sqdwName = treeNodeData.name || '';
                if (treeNodeData.length==1){
                    this.sqdw = treeNodeData[0].id;
                    this.level = '2';
                    this.sqdwName = treeNodeData[0].name;
                } else if(treeNodeData.length==0){
                    this.sqdwName = '中央纪委国家监委'
                    this.level = '1';
                } else if(treeNodeData.length>1){
                    this.sqdwName = '中央纪委国家监委'
                    this.level = '1';
                }
            },
            changeDept: function (newValue, oldValue) {
                var _this = this;
                _this.sqbm = newValue.id;
            },
            // 切换统计表
            selectTjb: function (val) {
                this.tjbType = val;
                if(this.isCenter || (!this.isCenter&&!this.isDept)){
                    this.searchReset()
                    // this.count();
                }
                if (!this.isCenter && this.isDept){
                    this.searchResetDf()
                    // this.countDf()
                }
            },
            // 切换层级
            selectCxcj: function (val) {
                this.cxcj = val;
            },
            /**
             * 开始时间改变事件
             * @param time
             */
            startimeChange: function (time) {
                var _this = this;
                if (_this.endDate && time > _this.date2Str(this.endDate)) {
                    Artery.message.info("开始时间不能大于结束时间！");
                    _this.startDate = _this.realStarTime;
                } else {
                    _this.startDate = time;
                    _this.realStarTime = time;
                }
            },

            /**
             * 结束时间改变事件
             * @param time
             */
            endtimeChange: function (time) {
                var _this = this;
                if (_this.startDate && time < _this.date2Str(this.startDate)) {
                    Artery.message.info("结束时间不能小于开始时间！");
                    _this.endDate = _this.realEndTime;
                } else {
                    _this.endDate = time;
                    _this.realEndTime = time;
                }
            },

            /**
             * 初始化树
             */
            initTree: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/cxtj/center").then(function (result) {
                    _this.isCenter = result;
                    _this.initTime();
                    // @Version 3.2.6 注释掉
                    /*if (result) {
                        Artery.ajax.get("/api/v1/cxtj/treeData").then(function (array) {
                            _this.$refs.xlsRefs.tree.resetInitData(array, true);
                            _this.$refs.xlsRefs.update(array);
                            _this.initTime();
                        });
                    } else {
                        _this.initTime();
                    }*/
                });
            },
            /**
             * 初始化时间
             */
            initTime: function () {
                var _this = this;
                _this.resetDateRange();
                _this.realStarTime = _this.startDate;
                _this.realEndTime = _this.endDate;
                _this.initData();
            },

            /**
             * @description: init申请单位
             * @author: baoyongchun
             * @date: 2022/11/14 12:17
             * @param: null null
             **/
            initSqdw: function () {
                var _this = this;
                Artery.axios.get("/api/v1/cxtj/getSqdw")
                    .then(function (result) {
                        _this.initsqdw =result.data.id;
                        _this.initsqdwName =result.data.name;
                        _this.initsqdwLevel =result.data.level;
                        _this.sqdw = _this.initsqdw;
                        if(_this.initsqdw == '000000000000'){
                            _this.sqdw = '';
                        }
                        _this.sqdwPrev = _this.initsqdw;
                        _this.sqdwName = _this.initsqdwName;
                        _this.level = _this.initsqdwLevel;
                        _this.initnav(_this.initsqdwName,_this.initsqdw);
                    });
            },
            /**
             * 初始化数据
             */
            initData: function () {
                var _this = this;
                if(!_this.isCenter){
                    _this.level1.flag = false;
                }
                if (_this.isCenter == true) {
                    _this.count();
                } else if(_this.isDept == false) {
                    this.tjbType = "2"
                    // _this.isMxb = true;
                    _this.count();
                } else {
                    this.tjbType = "2"
                    // _this.isMxb = true;
                    _this.countDf();
                }
            },

            /**
             * 日期转换字符串
             * @param date
             * @returns {string|*}
             */
            date2Str: function (date) {
                if (Object.prototype.toString.call(date) === "[object Date]") {
                    return this.formatDate(date);
                }
                return date;
            },

            /**
             * 格式化日期
             * @param date
             * @returns {string}
             */
            formatDate: function (date) {
                var month = date.getMonth() + 1;
                var day = date.getDate();
                return date.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
            },
            resetDateRange: function () {
                var today = new Date();
                var tomorrow = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                this.startDate = today.getFullYear() + '-01-01';
                this.endDate = this.formatDate(tomorrow);
            },
            // 鼠标划入事件
            mouseenterHandler: function (name) {
                this[ name + 'ScrollFlag'] = true;
            },
            // 鼠标划出事件
            mouseleaveHandler: function (name) {
                this[ name + 'ScrollFlag'] = false;
            },

            //中央端基本信息表同步滚动
            zyJbxxScrollEvent: function () {
                // 获取左侧表格内容部分
                var mxbLeft = this.$refs.zyJbxxjsMxbLeftCon;
                // 获取右侧表格内容部分
                var mxbRight = this.$refs.zyJbxxjsMxbRightCon;
                // 左侧表格和右侧表格同步滚动
                // mxbLeft.removeEventListener('scroll', this.zyJbxxscrollLeftHandler);
                // 左侧表格和右侧表格同步滚动
                mxbRight.removeEventListener('scroll', this.zyJbxxscrollRightHandler);
                // 左侧表格和右侧表格同步滚动
                // mxbLeft.addEventListener('scroll', this.zyJbxxscrollLeftHandler);
                // 左侧表格和右侧表格同步滚动
                mxbRight.addEventListener('scroll', this.zyJbxxscrollRightHandler);
            },
            // 滚动左边的处理函数
            zyJbxxscrollLeftHandler: function () {
                // 如果是左边滚动的，那么需要设置左边区域的滚动条
                if (this.leftScrollFlag){
                    // 获取左侧表格内容部分
                    this.$refs.zyJbxxjsMxbRightCon.scrollTop = this.$refs.zyJbxxjsMxbLeftCon.scrollTop;
                    this.$refs.zyJbxxjsMxbLeftHeaderCon.scrollLeft = this.$refs.zyJbxxjsMxbLeftCon.scrollLeft;
                    this.$refs.zyJbxxjsMxbLeftFooterCon.scrollLeft = this.$refs.zyJbxxjsMxbLeftCon.scrollLeft;
                }
            },
            // 滚动右边的处理函数
            zyJbxxscrollRightHandler: function () {
                // 如果是左边滚动的，那么需要设置右边区域的滚动条
                if (this.rightScrollFlag){
                    // 获取右侧表格内容部分
                    // this.$refs.zyJbxxjsMxbLeftCon.scrollTop = this.$refs.zyJbxxjsMxbRightCon.scrollTop;
                    // 获取右侧表格头部
                    // this.$refs.zyJbxxjsMxbRightHeaderCon.scrollLeft = this.$refs.zyJbxxjsMxbRightCon.scrollLeft;
                    // 获取右侧表格底部
                    this.$refs.zyJbxxjsMxbRightFooterCon.scrollLeft = this.$refs.zyJbxxjsMxbRightCon.scrollLeft;
                }
            },

            //中央端明细表同步滚动
            zyMxbScrollEvent: function () {
                // 获取左侧表格内容部分
                var mxbLeft = this.$refs.zyMxbjsMxbLeftCon;
                // 获取右侧表格内容部分
                var mxbRight = this.$refs.zyMxbjsMxbRightCon;
                // 左侧表格和右侧表格同步滚动
                // mxbLeft.removeEventListener('scroll', this.zyMxbscrollLeftHandler);
                // 左侧表格和右侧表格同步滚动
                mxbRight.removeEventListener('scroll', this.zyMxbscrollRightHandler);
                // 左侧表格和右侧表格同步滚动
                // mxbLeft.addEventListener('scroll', this.zyMxbscrollLeftHandler);
                // 左侧表格和右侧表格同步滚动
                mxbRight.addEventListener('scroll', this.zyMxbscrollRightHandler);
            },
            // 滚动左边的处理函数
            zyMxbscrollLeftHandler: function () {
                // 如果是左边滚动的，那么需要设置左边区域的滚动条
                if (this.leftScrollFlag){
                    // 获取左侧表格内容部分
                    this.$refs.zyMxbjsMxbRightCon.scrollTop = this.$refs.zyMxbjsMxbLeftCon.scrollTop;
                    this.$refs.zyMxbjsMxbLeftHeaderCon.scrollLeft = this.$refs.zyMxbjsMxbLeftCon.scrollLeft;
                    this.$refs.zyMxbjsMxbLeftFooterCon.scrollLeft = this.$refs.zyMxbjsMxbLeftCon.scrollLeft;
                }
            },
            // 滚动右边的处理函数
            zyMxbscrollRightHandler: function () {
                // 如果是左边滚动的，那么需要设置右边区域的滚动条
                if (this.rightScrollFlag){
                    // 获取右侧表格内容部分
                    // this.$refs.zyMxbjsMxbLeftCon.scrollTop = this.$refs.zyMxbjsMxbRightCon.scrollTop;
                    // 获取右侧表格头部
                    // this.$refs.zyMxbjsMxbRightHeaderCon.scrollLeft = this.$refs.zyMxbjsMxbRightCon.scrollLeft;
                    // 获取右侧表格底部
                    this.$refs.zyMxbjsMxbRightFooterCon.scrollLeft = this.$refs.zyMxbjsMxbRightCon.scrollLeft;
                }
            },

            // 【中央端】同步滚动
            zyScrollEvent: function () {
                // 获取左侧表格内容部分
                var mxbLeft = this.$refs.jsMxbLeftCon;
                // 获取右侧表格内容部分
                var mxbRight = this.$refs.jsMxbRightCon;
                // 左侧表格和右侧表格同步滚动
                mxbLeft.removeEventListener('scroll', this.scrollLeftHandler);
                // 左侧表格和右侧表格同步滚动
                mxbRight.removeEventListener('scroll', this.scrollRightHandler);
                // 左侧表格和右侧表格同步滚动
                mxbLeft.addEventListener('scroll', this.scrollLeftHandler);
                // 左侧表格和右侧表格同步滚动
                mxbRight.addEventListener('scroll', this.scrollRightHandler);
            },
            // 滚动左边的处理函数
            scrollLeftHandler: function () {
                // 如果是左边滚动的，那么需要设置左边区域的滚动条
                if (this.leftScrollFlag){
                    // 获取左侧表格内容部分
                    this.$refs.jsMxbRightCon.scrollTop = this.$refs.jsMxbLeftCon.scrollTop;
                    this.$refs.jsMxbLeftHeaderCon.scrollLeft = this.$refs.jsMxbLeftCon.scrollLeft;
                    this.$refs.jsMxbLeftFooterCon.scrollLeft = this.$refs.jsMxbLeftCon.scrollLeft;
                }
            },
            // 滚动右边的处理函数
            scrollRightHandler: function () {
                // 如果是左边滚动的，那么需要设置右边区域的滚动条
                if (this.rightScrollFlag){
                    // 获取右侧表格内容部分
                    this.$refs.jsMxbLeftCon.scrollTop = this.$refs.jsMxbRightCon.scrollTop;
                    // 获取右侧表格头部
                    this.$refs.jsMxbRightHeaderCon.scrollLeft = this.$refs.jsMxbRightCon.scrollLeft;
                    // 获取右侧表格底部
                    this.$refs.jsMxbRightFooterCon.scrollLeft = this.$refs.jsMxbRightCon.scrollLeft;
                }
            },
            // 【地方端】同步滚动
            dfScrollEvent: function () {
                // 获取左侧表格内容部分
                var mxbLeft = this.$refs.jsDfMxbLeftCon;
                // 获取右侧表格内容部分
                var mxbRight = this.$refs.jsDfMxbRightCon;
                // 左侧表格和右侧表格同步滚动
                mxbLeft.removeEventListener('scroll', this.dfScrollLeftHandler);
                // 左侧表格和右侧表格同步滚动
                mxbRight.removeEventListener('scroll', this.dfScrollRightHandler);
                // 左侧表格和右侧表格同步滚动
                mxbLeft.addEventListener('scroll', this.dfScrollLeftHandler);
                // 左侧表格和右侧表格同步滚动
                mxbRight.addEventListener('scroll', this.dfScrollRightHandler);
            },
            // 滚动左边的处理函数
            dfScrollLeftHandler: function () {
                // 如果是左边滚动的，那么需要设置右边区域的滚动条
                if (this.leftScrollFlag){
                    // 获取右侧表格内容部分
                    this.$refs.jsDfMxbRightCon.scrollTop = this.$refs.jsDfMxbLeftCon.scrollTop;
                }
            },
            // 滚动右边的处理函数
            dfScrollRightHandler: function () {
                // 如果是左边滚动的，那么需要设置右边区域的滚动条
                if (this.rightScrollFlag){
                    // 获取右侧表格内容部分
                    this.$refs.jsDfMxbLeftCon.scrollTop = this.$refs.jsDfMxbRightCon.scrollTop;
                    // 获取右侧表格头部
                    this.$refs.jsDfMxbRightHeaderCon.scrollLeft = this.$refs.jsDfMxbRightCon.scrollLeft;
                    // 获取右侧表格底部
                    this.$refs.jsDfMxbRightFooterCon.scrollLeft = this.$refs.jsDfMxbRightCon.scrollLeft;
                }
            },
            bindEvents: function() {
                var _this = this;
                // 适应大小屏的滚动条
                this.resizeHeight = $('.fd-content-table').height();
                window.addEventListener('resize', function () {
                    // 适应大小屏的滚动条
                    _this.$nextTick(function () {
                        _this.resizeHeight = $('.fd-content-table').height();
                    })
                });
                // 查询统计表格滚动监听
                // Array.prototype.forEach.call(document.querySelectorAll('.js-zy-scroll-table .fd-scroll-table-content,' +
                //     '.js-df-scroll-table .fd-scroll-table-content, .js-mxb-right-con, .js-mxb-left-con'), function (item) {
                //     item.addEventListener('scroll', function (event) {
                //         debugger
                //         _this.getDistance(event,true);
                //     });
                // });
                Array.prototype.forEach.call(document.querySelectorAll('.js-zy-scroll-table .fd-scroll-table-content,' +
                    '.js-df-scroll-table .fd-scroll-table-content, .js-mxb-right-con, .js-mxb-left-con'), function (item) {
                    item.addEventListener('scroll', function (event) {
                        _this.getDistance(event);
                    });
                });
            },
            /**
             * @description: 点击下钻
             * @author: baoyongchun
             * @date: 2022/11/8 19:04
             * @param: null null
             **/
            clickXz: function (copId,level,name) {
                var _this = this;
                _this.sqdw = copId;
                _this.level = level;
                _this.sqdwName = name;
                // _this.initnav(_this.sqdwName,_this.sqdw);
                if((!_this.isCenter && _this.sqdwPrev!='' && _this.sqdwPrev == _this.sqdw)|| (!_this.isCenter && _this.level == '4')){
                    if(_this.isDoubleClick){
                        _this.sqdwPrev = copId;
                        _this.isDept = false;
                        _this.count();
                        _this.isDoubleClick = false;
                    }else{
                        _this.sqdwPrev = copId;
                        _this.isDept = true;
                        _this.countDf();
                        _this.isDoubleClick = true;
                    }
                } else {
                    _this.sqdwPrev = copId;
                    _this.isDept = false;
                    _this.isDoubleClick = false;
                    _this.count();
                }
            },
            initnav:function (name,copId){
                var _this = this;
                if(!_this.isCenter){
                    _this.level1.flag = false;
                }
                if(_this.level == '1'){
                    _this.level1.flag = true;
                    _this.level1.name = _this.initsqdwName;
                    // _this.level1.id = _this.initsqdw;
                    _this.level1.id = '';
                    _this.level2.flag = false;
                    _this.level3.flag = false;
                    _this.level4.flag = false;
                }
                if(_this.level == '2'){
                    _this.level2.flag = true;
                    _this.level2.name = name;
                    _this.level2.id = copId;
                    _this.level3.flag = false;
                    _this.level4.flag = false;
                }
                if(_this.level == '3'){
                    _this.level3.flag = true;
                    _this.level3.name = name;
                    _this.level3.id = copId;
                    _this.level4.flag = false;
                }
                if(_this.level == '4'){
                    _this.level4.flag = true;
                    _this.level4.name = name;
                    _this.level4.id = copId;
                }
            }
        },

        mounted: function () {
            this.initTree();
            this.bindEvents();
        },
        <!--@Version 3.2.6  地方端添加申请单位，并且单位、部门联动-->
        computed: {
            deptRootId: function () {
                this.sqbm='';
                if (this.sqdw) {
                    if (this.sqdw instanceof Array) {
                        return this.sqdw[0];
                    } else {
                        return this.sqdw;
                    }
                }
                return '';
            },
            deptDisabled: function () {
                return !this.sqdw;
            }
        },
        created: function () {
            var _this = this;
            _this.initSqdw();
            _this.initnav(_this.initsqdwName,_this.initsqdw);
        },
    });

});
