/**
 * @version:                2017.05.01
 * @createTime:            2017.06.13
 * @updateTime:            2017.06.13
 * @author:                    wuwg
 * @moduleName              fd+component   前缀 +名字
 * @description             fdComponent.js ,全局的组件
 ***/

/**
 *    Vue.component(id,[definition])
 *     id=String
 *    definition =function||Object
 */

define('fdComponent2', ['fdGlobal', 'config', 'uiModel', 'datetimepicker', 'layDate', 'Pagination'], function (fdGlobal, config, uiModel, datetimepicker, layDate, Pagination) {
    var _config = JSON.parse(JSON.stringify(config)) //全局组件 多选框
    //全局组件 单选框
    Vue.component('component-radio', {
        props: {
            data: {
                type: Array,
                require: true
            },
            val: {
                type: String,
                default: ''
            }
        },
        template: "<div class='fd-ajxx-radio'>" +
            "<a href='javascript:void(0);' v-for='(item,index) in data' :class='{current:val==item.name}' @click='clickRadio'>{{item.name}}</a>" +
            "</div>",
        methods: {
            clickRadio: function (event) {
                $(event.target).addClass('current').siblings().removeClass('current');
            }
        }
    });
    // 分页
    Vue.component('component-pagination', {
        props: {
            //  总页数
            options: {
                required: true,
                type: Object
            },
            request: {
                required: true,
                type: Function
            }
        },
        template: '<div class="fd-pagination"   v-if="pagination.totalPage>0">' +
            '<div class="fd-page-text aty-panel"  v-if="pagination.showPageInfo"  >' +
            '<span class="aty-text">本页显示：<em  v-text="(pagination.currentPage-1)*pagination.currentSize+1"></em>-<em  v-text="pagination.currentPage*pagination.currentSize>pagination.totalSize?pagination.totalSize:pagination.currentPage*pagination.currentSize"></em></span>' +

            '<span class="aty-text">总记录数：<em  v-text="pagination.totalSize"></em></span>' +
            '</div>' +
            /* '<div style="position: absolute;right: 550px;" v-if="pagination.role==1">如有问题，请联系信息中心系统管理员，金飞(59598236、13910166892)</div>'+*/
            '<ul class="fd-operate"  >' +
            /* '<li class="fd-first"   v-if="!pagination.showPoint"   :class="{ disabled:pagination.currentPage==1}"   v-text="pagination.first"  @click=pagination.gotoPage(1) ></li>' +*/
            '<li class="fd-prev"    :class="{ disabled:pagination.currentPage==1}"  v-text="pagination.prev"  @click=pagination.gotoPrevPage()></li>' +
            '<li class="fd-page-count"   v-if="pagination.showPoint" :class="{active:pagination.isCurrentPage(1)}"  v-text="1"  @click=pagination.gotoPage(1) ></li>' +
            '<li class="fd-point"   v-if="pagination.showLeftPoint()" >...</li>' +
            '<li class="fd-page-count "   v-if="pagination.showThisPage(item)"    :class="{active:pagination.isCurrentPage(item)}" @click=pagination.gotoPage(item)  v-for="item in  pagination.getInitPages()"      v-text="item"></li>' +
            '<li class="fd-point"  v-if="pagination.showRightPoint()">...</li>' +
            '<li class="fd-page-count"   v-if="pagination.showPoint" :class="{active:pagination.isCurrentPage(pagination.totalPage)}"  v-text="pagination.totalPage"  @click=pagination.gotoPage(pagination.totalPage) ></li>' +
            '<li class="fd-next"    :class="{ disabled:pagination.currentPage==pagination.totalPage}"  v-text="pagination.next"  @click=pagination.gotoNextPage()>下一页</li>' +
            /*'<li class="fd-last"  v-if="!pagination.showPoint"  :class="{ disabled:pagination.currentPage==pagination.totalPage}"   v-text="pagination.last"  @click=pagination.gotoPage(pagination.totalPage)></li>' +*/
            '</ul>' +
            //  '<div class="fd-jump">第&nbsp&nbsp<input type="text" v-model="pagination.jumpPage" onkeyup="this.value=this.value.match(/^[1-9]{1}[0-9]*$/)" @keyup.enter=pagination.gotoPage(pagination.jumpPage)>' +
            //  '</div>'+
            '</div>',
        //  私有作用域数据
        data: function () {
            return {
                pagination: new Pagination(this.options, this.request)
            };
        },
        watch: {
            //当重新查询数据时，要更新分页
            "options.totalSize": function () {
                this.pagination = new Pagination(this.options, this.request)
            }
        },
        update: function () {

        }
    });


    /**
     *@descroption   这里是下拉组件component-select-dlr
     *@date  20170830
     * @author   wuwg
     */
    //  全局组件
    Vue.component('component-select-dlr', {

        /**
         * @example
         * <component-select
         *  v-on:change="changeDrop"  //  事件分发
         *  :data-list="dataList"   //  数据列表
         *  ></component-select>
         */
        // 属性
        // props: ['dataList','count'],
        props: {
            name: {
                type: String,
                required: true
            },
            // 值
            val: {
                type: null, //  null 代表任意类型
                validator: function (value) {
                    return value + "200";
                    //  return [{key:'',value:''}]
                }
            },
            // 是多选框
            isCheckbox: {
                type: Boolean, //  null 代表任意类型
                default: false
            },
            // 选择全部
            selectAll: {
                type: Boolean, //  null 代表任意类型
                default: false
            },
            //  是否显示清除按钮(默认隐藏)
            showClear: {
                type: Boolean,
                default: false
            },
            //  是否显示错误信息(默认隐藏)
            showError: {
                type: Boolean,
                default: false
            },
            // 是否扩大点击区域
            extendTriggerArea: {
                type: Boolean,
                default: true
            },
            //  是否显示下拉菜单按钮(默认隐藏)
            showDropMenu: {
                type: Boolean,
                default: false
            },
            allName: {
                type: String,
                default: '全部'
            },
            index: {
                type: null,
                default: ''
            },
            ygDlr: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: ''
            },
            lx: {
                type: String,
                default: ''
            },
            dataList: {
                // 必传且是数组
                required: true,
                type: Array, // 多种类型 [String,Number]
                default: [{
                    key: '',
                    value: ''
                }] //，有默认值
                //默认值应由一个工厂函数返回
                /* default: function () {
                 return [{key:'',value:''}]                 }*/
                /*  //  // 自定义验证函数
                 validator: function (value) {
                 return value>10
                 }*
            }
            /* ,count:{
             type:[Number,String]
					*/
            },
        },
        //  模板
        template: '<div class="fd-component-dropdown" :class="{ extend: scope.showDropMenu,disabled:isDisabledDrop(scope.dataList)  }">' +
            ' <div class="fd-dropdown-value-box js-dropdown-checkbox"  :class="{ error: scope.showError }">' +
            '<span class="fd-dropdown-icon"     :class="{ up: scope.showDropMenu,disabled:dropDownSelect(scope.dataList)}" >下拉图标</span>' +
            '<span class="fd-clear-icon"        @click="clickClear()"    :class="{ hide: !scope.showClear }" >清除</span>' +
            '<input  class="fd-dropdown-value"    v-model="scope.val" :class="{disabled:dropDownSelect(scope.dataList)}"/>' +
            '<div class="fd-dropdown-value-mask"  :class="{show:extendTriggerArea,disabled:dropDownSelect(scope.dataList)}"></div>' +
            '</div>' +
            '<div  class="fd-dropdown-menu js-dropdown-menu hide"  :class="{ checkbox:scope.isCheckbox }">' +
            '<dl class="fd-dropdown-checkbox"  v-if="scope.isCheckbox" >' +
            '<dt   @click="clickSelectAll()"  v-show="false"  :class="{active:scope.selectAll}" >{{scope.allName}}</dt>' +
            '<dd   @click="clickCheckboxItem(item,index,$event)" v-if="item.name"' +
            'v-for="(item,index) in scope.dataList"  :class="{active: item.active,disabled:isDisabled(item,index)}"  class="fd-dropdown-text">' +
            '<span  v-text="item.name"></span>' +
            '<span class="fd-sf"  v-text="getLx(item.lx)"></span>' +
            '</dd>' +
            '<dd class="fd-dropdown-operate right-btn">' +
            '<p class="fd-tips">最多添加两个委托代理人</p>' +
            '<span class="fd-dropdown-confirm" @click="clickConfirm($event)">确定</span>' +
            '<span class="fd-dropdown-cancel" @click="clickToggleDropMenu($event)">取消</span>' +
            '</dd>' +
            '</dl>' +
            '</div>' +
            '</div>',
        //  私有作用域数据
        data: function () {
            return {
                scope: {
                    //  input 中的name属性
                    name: this.name,
                    //改变之前的值
                    oldVal: '',
                    //  input 中的值
                    val: this.val,
                    // 是否是复选框
                    isCheckbox: this.isCheckbox,
                    // 选择全部
                    selectAll: this.selectAll,
                    // 显示清除按钮
                    showClear: this.showClear,
                    // 显示错误信息
                    showError: this.showError,
                    // 是否扩大点击区域
                    extendTriggerArea: this.extendTriggerArea,
                    // 显示下拉菜单
                    showDropMenu: this.showDropMenu,
                    // 下拉菜单的数据列表
                    dataList: this.dataList,
                    allName: this.allName,
                    index: this.index,
                    ygDlr: this.ygDlr,
                    id: this.id,
                    lx: this.lx,
                    isClickclearAll:false,
                }
            }
        },
        watch: {
            // 下拉的数据咧白哦
            dataList: {
                deep: true,
                handler: function (newValue, oldValue) {
                    var _this = this;
                    _this.scope.dataList = JSON.parse(JSON.stringify(_this.dataList));
                    // 设置下拉菜单选项
                    this.setDropMenu();
                    // 设置状态
                    this.setStatus();
                }
            },
            // 类型
            lx: {
                deep: true,
                handler: function (newValue, oldValue) {
                    // 设置下拉菜单选项
                    this.setDropMenu();
                    // 设置状态
                    this.setStatus();
                }
            }
        },
        // 方法
        methods: {
            // 设置下拉菜单选项
            setDropMenu: function () {
                var _this = this;
                //            	$.each(_this.scope.dataList,function(index,value){
                //        			if(_this.lx!=='' &&_this.lx=='委托代理' ){
                //        				if(value.wtDlrCount==2  &&  $.inArray(_this.id,value.wtDlrId)==-1  ){
                //        				     _this.scope.dataList.splice(index,1);
                //        				}
                //        			}
                //        		});
                _this.scope.dataList = _this.scope.dataList.filter(function (ele, index) {
                    if (_this.lx !== '' && (_this.lx == '委托代理' || _this.lx == '委托代理人')) {
                        if (ele.wtDlrCount == 2 && $.inArray(_this.id, ele.wtDlrId) == -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });
            },
            //  设置状态
            setStatus: function () {
                var _this = this;
                var _valArray = this.val.split(';');
                var _flag = true;
                $.each(this.scope.dataList, function (index, value) {
                    if (value.name !== '') {
                        var _searchIndex = $.inArray(value.name, _valArray);
                        if (_searchIndex != -1) {
                            value.active = true;
                        } else {
                            value.active = false;
                            _flag = false;
                        }
                    } else {
                        value.active = false;
                        _flag = false;
                    }

                });
                // 设置selectAll的状态
                this.scope.selectAll = _flag;
                this.scope.val = this.val;
                this.scope.id = this.id;
                this.scope.index = this.index;
            },
            isDisabled: function (item, index) {
                var _this = this;
                var _flag = false;
                var _wtDlr = [];
                // 如果该数据类型是 "委托代理人"，并且没有被激活，
                // 那么需要判断已经选中的 委托代理人个数，
                // 如果已经等于2，那么就不能再选了
                if (item.lx != '法定代理' || item.lx != '法定代理人') {
                    if (!item.active) {
                        var _count = 0;
                        // 循环当前的数据列表
                        $.each(_this.scope.dataList, function (index, value) {
                            //   如果是 委托代理人 而且是激活的
                            if (value.lx != '法定代理' || value.lx != '法定代理人') {
                                if (value.active) {
                                    _count++;
                                    if (_count > 2) {
                                        _count = 2;
                                    }
                                }
                                if (_count == 2) {
                                    // 改变值为false
                                    _flag = true;
                                }
                            }
                        });
                    }
                }
                return _flag;
            },
            ////当事人或者代理人的姓名全为空或者长度为0  让其选不中
            isDisabledDrop: function (list) {
                var count = 0;
                $.each(list, function (index, value) {
                    if (value.name == '') {
                        count++;
                    }
                });
                if (count == list.length) {
                    return true;
                }
                return false;
            },
            //获取代理人类型
            getLx: function (lx) {

                return (lx == '法定代理' || lx == '法定代理人') ? '法定代理人' : '委托代理人';
            },
            // 点击下拉框
            clickItem: function (item) {
                // 赋值
                this.val = item.value;
                //显示清空按钮
                this.scope.showClear = true;
                // 发送消息到父级
                this.$emit('change', item, this.scope.name);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;
            },
            // 清空值
            clickClear: function () {
                // 清空值
                this.val = '';
                //隐藏清空按钮
                this.scope.showClear = false;
                // 发送消息到父级
                this.$emit('change', {}, this.name);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;
                if (this.scope.isCheckbox) {
                    this.dataList.forEach(function (value, index) {
                        value.active = false;
                    });
                }
            },
            // 点击显示隐藏下拉菜单
            clickToggleDropMenu: function (event) {
                // 显示隐藏
                //this.scope.showDropMenu=!this.scope.showDropMenu;
                //点击取消时隐藏下拉框
                $(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
            },
            // 点击多选框的item
            clickCheckboxItem: function (item, index, event) {
                if (!$(event.currentTarget).hasClass('disabled')) {
                    // 转变active状态
                    item.active = !item.active;
                    var _flag = item.active;
                    // 更新对象
                    this.scope.dataList.splice(index, 1, item);
                    // 判断是否选择了全部
                    if (_flag) {
                        for (var i = 0, _len = this.scope.dataList.length; i < _len; i++) {
                            if (!this.scope.dataList[i].active) {
                                //跳出循环
                                this.scope.selectAll = false;
                                _flag = false;
                                break;
                            }
                        }
                    }
                    // 设置selectAll的状态
                    this.scope.selectAll = _flag;
                }
            },
            // 点击选择全部或者取消全部选择
            clickSelectAll: function () {
                this.scope.selectAll = !this.scope.selectAll;
                var _flag = this.scope.selectAll;
                this.scope.dataList.forEach(function (value, index) {
                    value.active = _flag;
                });
            },
            // 点击确定按钮
            clickConfirm: function (event) {
                var _val = [];
                var _valObj = [];
                this.scope.dataList.forEach(function (value, index) {
                    if (value.active) {
                        _val.push(value.name);
                        _valObj.push(value);
                    }
                });
                // 清空值
                this.scope.val = _val.join('；');
                //隐藏或者隐藏清空按钮
                this.scope.showClear = this.val;

                // 发送消息到父级
                this.$emit('change', _valObj, this.scope.name, this.scope.index, this.scope.id);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;

                //点击取消时隐藏下拉框
                $(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
            },
            //下拉框是否可以点击下拉
            dropDownSelect: function (list) {
                if (list.length == 0) {
                    return true;
                } else {
                    return false;
                }

            }
        },
        // 计算属性
        computed: {},
        mounted: function () {
            // 设置状态
            this.setStatus();
            //点击下拉框中的内容的时候组织冒泡事件
            $('.js-dropdown-menu').on('click', function (e) {
                if (e && e.stopPropagation) {
                    // this code is for Mozilla and Opera
                    e.stopPropagation();
                } else if (window.event) {
                    // this code is for IE
                    window.event.cancelBubble = true;
                }
            });
        }
    });


    /**
     *@descroption   这里是下拉组件component-select
     *@date  20170410
     * @author   wuwg
     */
    //  全局组件
    Vue.component('component-select', {

        /**
         * @example
         * <component-select
         *  v-on:change="changeDrop"  //  事件分发
         *  :data-list="dataList"   //  数据列表
         *  ></component-select>
         */
        // 属性
        // props: ['dataList','count'],
        props: {
            name: {
                type: String,
                required: true
            },
            // 值
            val: {
                type: null, //  null 代表任意类型
                validator: function (value) {
                    return value + "200";
                    //  return [{key:'',value:''}]
                }
            },
            // 是多选框
            isCheckbox: {
                type: Boolean, //  null 代表任意类型
                default: false
            },
            // 选择全部
            selectAll: {
                type: Boolean, //  null 代表任意类型
                default: false
            },
            //  是否显示清除按钮(默认隐藏)
            showClear: {
                type: Boolean,
                default: false
            },
            //  是否显示错误信息(默认隐藏)
            showError: {
                type: Boolean,
                default: false
            },
            // 是否扩大点击区域
            extendTriggerArea: {
                type: Boolean,
                default: true
            },
            //  是否显示下拉菜单按钮(默认隐藏)
            showDropMenu: {
                type: Boolean,
                default: false
            },
            allName: {
                type: String,
                default: '全部'
            },
            index: {
                type: null,
                default: ''
            },
            ygDlr: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: ''
            },
            lx: {
                type: String,
                default: ''
            },
            dataList: {
                // 必传且是数组
                required: true,
                type: Array, // 多种类型 [String,Number]
                default: [{
                    key: '',
                    value: ''
                }] //，有默认值
                //默认值应由一个工厂函数返回
                /* default: function () {
                 return [{key:'',value:''}]                 }*/
                /*  //  // 自定义验证函数
                 validator: function (value) {
                 return value>10
                 }*
            }
            /* ,count:{
             type:[Number,String]
					*/
            },
        },
        //  模板
        template: '<div class="fd-component-dropdown" :class="{ extend: scope.showDropMenu,disabled:isDisabledDrop(scope.dataList) }">' +
            ' <div class="fd-dropdown-value-box js-dropdown-checkbox"  :class="{ error: scope.showError }">' +
            '<span class="fd-dropdown-icon"    :class="{ up: scope.showDropMenu,disabled:dropDownSelect(scope.dataList)}" >下拉图标</span>' +
            '<span class="fd-clear-icon"        @click="clickClear()"    :class="{ hide: !scope.showClear }" >清除</span>' +
            '<input  class="fd-dropdown-value"    v-model="scope.val" :class="{disabled:dropDownSelect(scope.dataList)}"/>' +
            '<div class="fd-dropdown-value-mask"   :class="{show:extendTriggerArea,disabled:dropDownSelect(scope.dataList)}"></div>' +
            '</div>' +
            '<div  class="fd-dropdown-menu js-dropdown-menu hide"  :class="{ checkbox:scope.isCheckbox }">' +
            '<dl class="fd-dropdown-checkbox"  v-if="scope.isCheckbox" >' +
            '<dt   @click="clickSelectAll()"   :class="{active:scope.selectAll}" v-if="checkAllBol(scope.dataList)">{{scope.allName}}</dt>' +
            '<dd   @click="clickCheckboxItem(item,index)"  v-for="(item,index) in scope.dataList"  v-if="item.name" :class="{active: item.active}"  class="fd-dropdown-text">{{item.name}}</dd>' +
            '<dd class="fd-dropdown-operate right-btn">' +
            '<span class="fd-dropdown-confirm" @click="clickConfirm($event)">确定</span>' +
            '<span class="fd-dropdown-cancel" @click="clickToggleDropMenu($event)">取消</span>' +
            '</dd>' +
            '</dl>' +
            '<dl class="fd-dropdown-radio"   v-else :class="{ hide: !scope.showDropMenu }">' +
            '<dt  @click="clickClear()"  >清空</dt>' +
            ' <dd  @click="clickItem(item)"  v-for="(item,index) in dataList"   :class="{active:item.name==scope.val}"     v-text="item.name"   ></dd>' +
            '</dl>' +
            '</div>' +
            '</div>',
        //  私有作用域数据
        data: function () {
            return {
                scope: {
                    //  input 中的name属性
                    name: this.name,
                    //改变之前的值
                    oldVal: '',
                    //  input 中的值
                    val: this.val,
                    // 是否是复选框
                    isCheckbox: this.isCheckbox,
                    // 选择全部
                    selectAll: this.selectAll,
                    // 显示清除按钮
                    showClear: this.showClear,
                    // 显示错误信息
                    showError: this.showError,
                    // 是否扩大点击区域
                    extendTriggerArea: this.extendTriggerArea,
                    // 显示下拉菜单
                    showDropMenu: this.showDropMenu,
                    // 下拉菜单的数据列表
                    dataList: this.dataList,
                    allName: this.allName,
                    index: this.index,
                    ygDlr: this.ygDlr,
                    id: this.id,
                    lx: this.lx
                }
            }
        },
        watch: {
            // 监听值发生变化
            val: {
                deep: true,
                handler: function (newValue, oldValue) {
                    this.scope.val = JSON.parse(JSON.stringify(this.val));
                }
            },
            // 下拉的数据咧白哦
            dataList: {
                deep: true,
                handler: function (newValue, oldValue) {
                    var _this = this;
                    _this.scope.dataList = JSON.parse(JSON.stringify(_this.dataList));
                    // 设置下拉菜单选项
                    this.setDropMenu();
                    // 设置状态
                    this.setStatus();
                }
            },
            // 类型
            lx: {
                deep: true,
                handler: function (newValue, oldValue) {
                    var _this = this;
                    _this.scope.dataList = JSON.parse(JSON.stringify(_this.dataList));
                    // 设置下拉菜单选项
                    this.setDropMenu();
                    // 设置状态
                    this.setStatus();
                }
            }
        },
        // 方法
        methods: {
            // 设置下拉菜单选项
            setDropMenu: function () {
                var _this = this;
                //            	$.each(_this.scope.dataList,function(index,value){
                //        			if(_this.lx!=='' &&_this.lx=='委托代理' ){
                //        				if(value.wtDlrCount==2  &&  $.inArray(_this.id,value.wtDlrId)==-1  ){
                //        				     _this.scope.dataList.splice(index,1);
                //        				}
                //        			}
                //        		});
                _this.scope.dataList = _this.scope.dataList.filter(function (ele, index) {
                    if (_this.lx !== '' && (_this.lx == '委托代理' || _this.lx == '委托代理人')) {
                        if (ele.wtDlrCount == 2 && $.inArray(_this.id, ele.wtDlrId) == -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });
            },
            //  设置状态
            setStatus: function () {
                var _this = this;
                var _valArray = _this.scope.val.split(';');
                var _flag = true;
                $.each(_this.scope.dataList, function (index, value) {
                    if (value.name !== '') {
                        var _searchIndex = $.inArray(value.name, _valArray);
                        if (_searchIndex != -1) {
                            value.active = true;
                        } else {
                            value.active = false;
                            _flag = false;
                        }
                    }

                });
                // 设置selectAll的状态
                this.scope.selectAll = _flag;
                this.scope.val = this.val;
                this.scope.id = this.id;
                this.scope.index = this.index;
            },
            // 点击下拉框
            clickItem: function (item) {
                // 赋值
                this.val = item.value;
                //显示清空按钮
                this.scope.showClear = true;
                // 发送消息到父级
                this.$emit('change', item, this.scope.name);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;
            },
            // 清空值
            clickClear: function () {
                // 清空值
                this.val = '';
                //隐藏清空按钮
                this.scope.showClear = false;
                // 发送消息到父级
                this.$emit('change', {}, this.name);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;
                if (this.scope.isCheckbox) {
                    this.dataList.forEach(function (value, index) {
                        value.active = false;
                    });
                }
            },
            // 点击显示隐藏下拉菜单
            clickToggleDropMenu: function (event) {
                // 显示隐藏

                //                this.scope.showDropMenu=!this.scope.showDropMenu;
                //点击取消时隐藏下拉框
                $(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
            },
            // 点击多选框的item
            clickCheckboxItem: function (item, index) {
                // 转变active状态
                item.active = !item.active;
                var _flag = item.active;
                // 更新对象
                this.scope.dataList.splice(index, 1, item);
                // 判断是否选择了全部
                if (_flag) {
                    for (var i = 0, _len = this.scope.dataList.length; i < _len; i++) {
                        if (!this.scope.dataList[i].active) {
                            //跳出循环
                            this.scope.selectAll = false;
                            _flag = false;
                            break;
                        }
                    }
                }
                // 设置selectAll的状态
                this.scope.selectAll = _flag;
            },
            // 点击选择全部或者取消全部选择
            clickSelectAll: function () {
                this.scope.selectAll = !this.scope.selectAll;
                var _flag = this.scope.selectAll;
                this.scope.dataList.forEach(function (value, index) {
                    value.active = _flag;
                });
            },
            // 点击确定按钮
            clickConfirm: function () {
                var _val = [];
                var _valObj = [];
                this.scope.dataList.forEach(function (value, index) {
                    if (value.active) {
                        _val.push(value.name);
                        _valObj.push(value);
                    }
                });
                // 清空值
                this.scope.val = _val.join('；');
                //隐藏或者隐藏清空按钮
                this.scope.showClear = this.val;

                // 发送消息到父级
                this.$emit('change', _valObj, this.scope.name, this.scope.index, this.scope.id);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;

                //点击取消时隐藏下拉框
                $(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
            },
            checkAllBol: function (list) {
                if (list.length == 0 || (list.length == 1 && list[0].name == '')) {
                    return false;
                } else {
                    return true;
                }
            },
            //下拉框是否可以点击下拉
            dropDownSelect: function (list) {
                if (list.length == 0) {
                    return true;
                } else {
                    return false;
                }

            },
            ////当事人或者代理人的姓名全为空或者长度为0  让其选不中
            isDisabledDrop: function (list) {
                var count = 0;
                $.each(list, function (index, value) {
                    if (value.name == '') {
                        count++;
                    }
                });
                if (count == list.length) {
                    return true;
                }
                return false;
            },
        },
        // 计算属性
        computed: {},
        mounted: function () {
            // 设置状态
            this.setStatus();
            //点击下拉框中的内容的时候组织冒泡事件
            $('.js-dropdown-menu').on('click', function (event) {
                event.stopPropagation();
            });
        }
    });


    /**
     *@descroption   这里是下拉组件component-select
     *@date  20170410
     * @author   wuwg
     */
    //  全局组件
    Vue.component('component-select-simple', {
        /**
         * @example
         * <'component-select-simple
         *  v-on:change="changeDrop"  //  事件分发
         *  :data-list="dataList"   //  数据列表
         *  ></'component-select-simple>
         */
        // 属性
        // props: ['dataList','count'],
        props: {
            name: {
                type: String,
                required: true
            },
            // 循环中用到
            index: {
                type: null, //  null 代表任意类型,
                default: ''
            },
            kbslindex: {
                type: null, //  null 代表任意类型,
                default: ''
            },
            // 值
            val: {
                type: null, //  null 代表任意类型
                validator: function (value) {
                    return value + "200";
                    //  return [{key:'',value:''}]
                }
            },
            dataList: {
                // 必传且是数组
                required: true,
                type: Array, // 多种类型 [String,Number]
                default: [{
                    key: '',
                    value: ''
                }]
            },
            date: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: ''
            },
            bol: {
                type: null
            },
            bgsf: {
                type: String,
                default: ''
            },
            bgxm: {
                type: String,
                default: ''
            },
            code: {
                type: [String, Number],
                default: ''
            }
        },
        //  模板
        template: '<div class="fd-component-simple-dropdown js-drop-menu-contain">' +
            '<div class="fd-dropdown-value-box js-drop-menu-trigger" >' +
            '<div class="fd-dropdown-value"  v-text="scope.val" :title="scope.val"></div>' +
            '<div class="fd-clear-icon   js-fd-clear-icon"  :class="{show:getVal}"  @click="clickClear()" ></div>' +
            '</div>' +
            '<div class="fd-dropdown-menu fd-hide js-drop-menu">' +
            '<dl class="fd-dropdown-radio">' +
            '<dd  class="js-drop-item" v-for="item in scope.dataList"  :class="{active:item.name==scope.val}"   v-text="item.name" @click="clickItem(item)" :title="item.name">1</dd>' +
            '</dl>' +
            '</div>' +
            '</div>',
        //  私有作用域数据
        data: function () {
            return {
                scope: {
                    index: this.index,
                    //  input 中的name属性
                    name: this.name,
                    //  input 中的值
                    val: (this.val === '' || this.val === undefined || !this.val) ? '请选择......' : this.val,
                    // 显示错误信息
                    showError: this.showError,
                    // 下拉菜单的数据列表
                    dataList: this.dataList,
                    // 数据长度
                    len: this.len
                }
            }
        },
        // 监听值的变化
        watch: {
            // 监听值发生变化
            val: {
                deep: true,
                handler: function (newValue, oldValue) {
                    if (newValue !== oldValue && newValue !== this.scope.val) {
                        if (newValue === '' && oldValue !== '') {
                            this.scope.val = '请选择......';
                        }
                        if (newValue !== '' && oldValue === '') {
                            this.scope.val = newValue;
                        }

                        if (newValue === '' && oldValue === '') {
                            this.scope.val = '请选择......';
                        }

                        if (newValue !== '' && oldValue !== '') {
                            this.scope.val = newValue;
                        }
                    }
                }
            },
            // 监听数据长度
            len: {
                deep: true,
                handler: function (newValue, oldValue) {
                    if (newValue !== oldValue && newValue !== this.scope.dataList.length) {
                        this.scope.dataList = this.dataList;
                    }
                }

            },
            // 下拉的数据咧白哦
            dataList: {
                immediate: true,
                deep: true,
                handler: function (newValue, oldValue) {
                    var _this = this;
                    _this.scope.dataList = JSON.parse(JSON.stringify(_this.dataList));
                    _this.changeVal();
                }
            },
            code: {
                immediate: true,
                handler: function (newVal, oldValue) {
                    this.changeVal();
                }
            }
            /*  val: function (newValue,oldValue) {
                  if(newValue!=this.scope.val){
                      this.scope.val=typeof (newValue)=='undefined'?'':newValue;
                  }
              }*/
        },
        // 方法
        methods: {
            // 点击下拉框
            clickItem: function (item) {
                // 赋值
                this.scope.val = item.name;
                // 发送消息到父级
                this.$emit('change', item, this.scope.name, this.index, this.kbslindex, this.date, this.id, this.bol, this.bgsf, this.bgxm, this);
            },
            // 清空值
            clickClear: function () {
                // 清空值
                this.scope.val = '请选择......';
                // 发送消息到父级
                this.$emit('change', {}, this.scope.name, this.index, this.kbslindex, this.date, this.id, this.bol, this.bgsf, this.bgxm);
            },
            emptyShowVal: function () {
                this.scope.val = '';
            },
            changeVal: function () {
                var _this = this;
                if (!_this.code || _this.code === '' || !_this.scope.dataList) {
                    _this.scope.val = '请选择......';
                    return;
                }
                for (var i = 0; i < _this.scope.dataList.length; i++) {
                    var c = _this.scope.dataList[i];
                    if (c.code == _this.code) {
                        _this.scope.val = c.name;
                        break;
                    }
                }
            }
        },
        // 计算属性
        computed: {
            //  根据值判断是否显示×
            getVal: function () {
                return this.scope.val !== '' && this.scope.val !== '请选择......' ? true : false;
            }
        },
        mounted: function () {
            $('.fd-dropdown-menu').on('mousewheel', function (event) {
                event.stopPropagation();
            });
        }
    });
    //转换为中文

    (function ($) {
        $.fn.datetimepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            suffix: [],
            meridiem: ["上午", "下午"]
        };
    }(jQuery));

    var Hub = new Vue();
    //  日期控件
    /*     Vue.component('datetime-picker', {
             template: '<div class="fd-controls" :class="{date: hasComponent}">'
             + '<input class="fd-date-input" unselectable="on" readonly :value="fifterDate(scope.date)" @click.stop="scope.show=!scope.show"> <span class="fd-clear-icon " :class={show:scope.date} @click="clickClear()"></span>'
             + '<span class="fd-add-on" v-if="hasComponent"><i class="fd-icon-remove"></i></span>'
             +'<span class="fd-add-on" v-if="hasComponent"><i class="fd-icon-th"></i></span>'
             +'</div>',

             props: {

                 date: {
                     type: String,
                     default: ''
                 },
                 datepickerOptions: {
                     type: Object,
                     default: function () {
                         return {};
                     }
                 },
                 name:{
                     type: String,
                     default: ''
                 },
                 // 循环中用到
                 index:{
                     type: null,//  null 代表任意类型,
                     default: ''
                 },
                 onChange: {
                     required: false,
                     default: null
                 },
                 //是否有组件
                 hasComponent: {
                     type: Boolean,
                     default: false
                 },
                 //是否有组件重置
                 hasRest: {
                     type: Boolean,
                     default: false
                 },
                 id:{
                	 type:String,
            	 	default:''
                 },
                 show:{
                 	type: Boolean,
                 	default: false
                 }
             },
             data: function () {

               return  {
                   scope:{
                       date:this.date,
                       show: this.show
                   }
               }
             },
             //  深度兼容 date的变化
             watch:{
                 date:{
                     deep:true,
                     handler: function(newValue,oldValue){
                         if(newValue!==oldValue && newValue!==this.scope.date ){
     						this.scope.date=newValue;
                         }
                     }
                 },
                 "scope.show":{
                 	deep:true,
                     handler: function(newValue,oldValue){
                     	var _this = this;
                         if(newValue == true){
    			             //获取日历控件元素，如果有组件就是对应的div上添加日历控件，如果没有组件就在对应的input元素上添加
    			             _this.$datetimepickerEle = _this.hasComponent ? $(_this.$el) : $(_this.$el).find('input');
    			             // 如果是input元素直接绑定日历控件，则直接获取input的值，如果是父级，则获取子集input的值
    			             _this.input=_this.$datetimepickerEle.is('input')?_this.$datetimepickerEle:_this.$datetimepickerEle.find('input');
    			             //创建日期控件
    			             _this.$datetimepickerEle.datetimepicker(this.datepickerOptions).on('changeDate', function (e) {
    			                 _this.changeDate();
    			                 _this.scope.show = false;
    			             }).on('show', function(event){
    			                 //  更新日期
    			                 _this.$datetimepickerEle.datetimepicker('update');
    			             });
    			             //显示日期控件
    			             //刚创建日期的时候 直接显示  主要为了解决  vue中日期框的显示 会
    			             //创建dom  如果过多的日期框显示 会导致vue渲染的速度很慢
    			             _this.$datetimepickerEle.datetimepicker('show');
                         }else{
                         	//隐藏日期控件
                         	_this.$datetimepickerEle.datetimepicker('remove');
                         }
                     }
                 }
             },
             methods: {
                 clickClear: function () {
                     var _this = this;
                     var dateValue = _this.scope.date='';
                     //如果是input元素直接绑定日历控件，则直接获取input的值，如果是父级，则获取子集input的值
                     _this.input.val('');
                     // 激活事件
                     _this.$emit('change', dateValue,_this.name,_this.index,_this.id);

                     if (_this.onChange) {
                         _this.onChange(e);  //触发回调函数
                     }
                 },
                 changeDate: function () {
                     var _this = this;
                     var dateValue =  _this.input.val();
                     _this.$emit('change', dateValue,_this.name,_this.index,_this.id);
                     if (_this.onChange) {
                         _this.onChange(e);  //触发回调函数
                     }
                 },
                 //截取时间 去掉时分秒毫秒
                 fifterDate:function(date){
                	 if(date == null||date == ""){
    	                    return '';
    	                }
    	                if(typeof(date)!='string'){
    	                    return '';
    	                }
    					var oldDate = date.substring(10,23);
    					var newDate=date.replace(oldDate,'');
    					return newDate;
    			}
             },
             mounted: function () {
                 var _this = this;
                 $(document).on('click',function(){
                 	event.stopPropagation();
                 	_this.scope.show = false;
                 });
             }
         });*/
    Vue.component('datetime-picker', {
        template: '<div class="fd-controls" :class="{date: hasComponent}">' +
            '<input class="fd-date-input" readonly :value="scope.date"> <span class="fd-clear-icon " :class={show:scope.date} @click="clickClear($event)"></span>' +
            '<span class="fd-add-on" v-if="hasComponent"><i class="fd-icon-remove"></i></span>' +
            '<span class="fd-add-on" v-if="hasComponent"><i class="fd-icon-th"></i></span>' +
            '</div>',

        props: {

            date: {
                type: null,
                default: ''
            },
            datepickerOptions: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            name: {
                type: String,
                default: ''
            },
            // 循环中用到
            index: {
                type: null, //  null 代表任意类型,
                default: ''
            },
            _index: {
                type: null, //  null 代表任意类型,
                default: ''
            },
            idx: {
                type: null, //  null 代表任意类型,
                default: ''
            },
            onChange: {
                required: false,
                default: null
            },
            //是否有组件
            hasComponent: {
                type: Boolean,
                default: false
            },
            //是否有组件重置
            hasRest: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ''
            },
            mc: {
                type: String,
                default: ''
            },
            isShow: {
                type: Boolean,
                default: true
            }
        },
        data: function () {

            return {
                scope: {
                    date: this.date
                }
            }
        },
        //  深度兼容 date的变化
        watch: {
            date: {
                deep: true,
                handler: function (newValue, oldValue) {
                    if (newValue !== oldValue && newValue !== this.scope.date) {
                        this.scope.date = newValue;
                    }
                }
            }
        },
        methods: {
            clickClear: function (event) {
                if (!$(event.target).parents('.fd-edit').hasClass('disabled')) {
                    var _this = this;
                    var dateValue = _this.scope.date = '';
                    //如果是input元素直接绑定日历控件，则直接获取input的值，如果是父级，则获取子集input的值
                    _this.input.val('');
                    // 激活事件
                    _this.$emit('change', dateValue, _this.name, _this.index, _this.id, _this.mc, _this.$el);

                    if (_this.onChange) {
                        _this.onChange(e); //触发回调函数
                    }
                }
            },
            changeDate: function () {
                var _this = this;
                var dateValue = _this.input.val();
                _this.$emit('change', dateValue, _this.name, _this.index, _this.id, _this.mc, _this.$el);
                if (_this.onChange) {
                    _this.onChange(e); //触发回调函数
                }
            }
            //截取时间 去掉时分秒毫秒
            //             fifterDate:function(date){
            //					var oldDate = date.substring(10,23);
            //					var newDate=date.replace(oldDate,'');
            //					return newDate;
            //			}
        },
        mounted: function () {

            var _this = this;
            if (_this.isShow) {
                //获取日历控件元素，如果有组件就是对应的div上添加日历控件，如果没有组件就在对应的input元素上添加
                _this.$datetimepickerEle = _this.hasComponent ? $(_this.$el) : $(_this.$el).find('input');
                // 如果是input元素直接绑定日历控件，则直接获取input的值，如果是父级，则获取子集input的值
                _this.input = _this.$datetimepickerEle.is('input') ? _this.$datetimepickerEle : _this.$datetimepickerEle.find('input');
                //创建日期控件
                _this.$datetimepickerEle.datetimepicker(this.datepickerOptions).on('changeDate', function (e) {
                    _this.changeDate();
                }).on('show', function (event) {
                    //  更新日期
                    _this.$datetimepickerEle.datetimepicker('update');
                });

            }
        }
    });
    /**
     *@descroption   这里是普通的下拉组件component-dropDown-multiSelect
     *@date  20180305
     * @author   huazhiqiang
     */
    //  全局组件
    Vue.component('component-dropdown-multidelect', {

        /**
         * @example
         * <component-select
         *  v-on:change="changeDrop"  //  事件分发
         *  :data-list="dataList"   //  数据列表
         *  ></component-select>
         */
        // 属性
        // props: ['dataList','count'],
        props: {
            name: {
                type: String,
                required: true
            },
            // 值
            val: {
                type: null, //  null 代表任意类型
                validator: function (value) {
                    return value + "200";
                    //  return [{key:'',value:''}]
                }
            },
            // 是多选框
            isCheckbox: {
                type: Boolean, //  null 代表任意类型
                default: false
            },
            // 选择全部
            selectAll: {
                type: Boolean, //  null 代表任意类型
                default: false
            },
            //  是否显示清除按钮(默认隐藏)
            showClear: {
                type: Boolean,
                default: false
            },
            //  是否显示错误信息(默认隐藏)
            showError: {
                type: Boolean,
                default: false
            },
            // 是否扩大点击区域
            extendTriggerArea: {
                type: Boolean,
                default: true
            },
            //  是否显示下拉菜单按钮(默认隐藏)
            showDropMenu: {
                type: Boolean,
                default: false
            },
            allName: {
                type: String,
                default: '全部'
            },
            index: {
                type: null,
                default: ''
            },
            id: {
                type: String,
                default: ''
            },
            dataList: {
                // 必传且是数组
                required: true,
                type: Array, // 多种类型 [String,Number]
                default: [{
                    key: '',
                    value: ''
                }] //，有默认值
                //默认值应由一个工厂函数返回
                /* default: function () {
                 return [{key:'',value:''}]                 }*/
                /*  //  // 自定义验证函数
                  validator: function (value) {
                  return value>10
                  }*
             }
             /* ,count:{
              type:[Number,String]
 					*/
            },
        },
        //  模板
        template: '<div class="fd-component-dropdown" :class="{ extend: scope.showDropMenu,disabled:isDisabledDrop(scope.dataList) }">' +
            ' <div class="fd-dropdown-value-box js-dropdown-checkbox"  :class="{ error: scope.showError }">' +
            '<span class="fd-dropdown-icon"    :class="{ up: scope.showDropMenu,disabled:dropDownSelect(scope.dataList)}" >下拉图标</span>' +
            '<span class="fd-clear-icon"        @click="clickClear()"    :class="{ hide: !scope.showClear }" >清除</span>' +
            '<input  class="fd-dropdown-value"    v-model="scope.val" :class="{disabled:dropDownSelect(scope.dataList)}"/>' +
            '<div class="fd-dropdown-value-mask"   :class="{show:extendTriggerArea,disabled:dropDownSelect(scope.dataList)}"></div>' +
            '</div>' +
            '<div  class="fd-dropdown-menu js-dropdown-menu hide"  :class="{ checkbox:scope.isCheckbox }">' +
            '<dl class="fd-dropdown-checkbox"  v-if="scope.isCheckbox" >' +
            '<dt   @click="clickSelectAll()"   :class="{active:scope.selectAll}" v-if="checkAllBol(scope.dataList)">{{scope.allName}}</dt>' +
            '<dd   @click="clickCheckboxItem(item,index)"  v-for="(item,index) in scope.dataList"  v-if="item.name" :class="{active: item.active}"  class="fd-dropdown-text">{{item.name}}</dd>' +
            '<dd class="fd-dropdown-operate right-btn">' +
            '<span class="fd-dropdown-confirm" @click="clickConfirm($event)">确定</span>' +
            '<span class="fd-dropdown-cancel" @click="clickToggleDropMenu($event)">取消</span>' +
            '</dd>' +
            '</dl>' +
            '<dl class="fd-dropdown-radio"   v-else :class="{ hide: !scope.showDropMenu }">' +
            '<dt  @click="clickClear()"  >清空</dt>' +
            ' <dd  @click="clickItem(item)"  v-for="(item,index) in dataList"   :class="{active:item.name==scope.val}"     v-text="item.name"   ></dd>' +
            '</dl>' +
            '</div>' +
            '</div>',
        //  私有作用域数据
        data: function () {
            return {
                scope: {
                    //  input 中的name属性
                    name: this.name,
                    //改变之前的值
                    oldVal: '',
                    //  input 中的值
                    val: this.val,
                    // 是否是复选框
                    isCheckbox: this.isCheckbox,
                    // 选择全部
                    selectAll: this.selectAll,
                    // 显示清除按钮
                    showClear: this.showClear,
                    // 显示错误信息
                    showError: this.showError,
                    // 是否扩大点击区域
                    extendTriggerArea: this.extendTriggerArea,
                    // 显示下拉菜单
                    showDropMenu: this.showDropMenu,
                    // 下拉菜单的数据列表
                    dataList: this.dataList,
                    allName: this.allName,
                    index: this.index,
                    id: this.id
                }
            }
        },
        watch: {
            // 下拉的数据咧白哦
            dataList: {
                deep: true,
                handler: function (newValue, oldValue) {
                    var _this = this;
                    _this.scope.dataList = JSON.parse(JSON.stringify(_this.dataList));
                    // 设置状态
                    this.setStatus();
                }
            },
            //监测value值的变化并更新到组件中
            val: {
                deep: true,
                handler: function (newValue, oldValue) {
                    var _this = this;
                    _this.scope.val = _this.val;
                    // 设置状态
                    this.setStatus();
                }
            }
        },
        // 方法
        methods: {
            //  设置状态
            setStatus: function () {
                var _this = this;
                //TODO
                if (_this.scope.val != undefined) {
                    var _valArray = _this.scope.val.split(';');
                } else {
                    var _valArray = _this.scope.val;
                }
                var _flag = true;
                $.each(_this.scope.dataList, function (index, value) {
                    if (value.name !== '') {
                        var _searchIndex = $.inArray(value.name, _valArray);
                        if (_searchIndex != -1) {
                            //value.active=true;
                            _this.$set(_this.scope.dataList[index], "active", true);
                        } else {
                            //value.active=false;
                            _this.$set(_this.scope.dataList[index], "active", false);
                            _flag = false;
                        }
                    }

                });
                // 设置selectAll的状态
                this.scope.selectAll = _flag;
                this.scope.val = this.val;
                this.scope.id = this.id;
                this.scope.index = this.index;
            },
            // 点击下拉框
            clickItem: function (item) {
                // 赋值
                this.val = item.value;
                //显示清空按钮
                this.scope.showClear = true;
                // 发送消息到父级
                this.$emit('change', item, this.scope.name);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;
            },
            // 清空值
            clickClear: function () {
                // 清空值
                this.val = '';
                //隐藏清空按钮
                this.scope.showClear = false;
                // 发送消息到父级
                this.$emit('change', {}, this.name);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;
                if (this.scope.isCheckbox) {
                    this.dataList.forEach(function (value, index) {
                        value.active = false;
                    });
                }
            },
            // 点击显示隐藏下拉菜单
            clickToggleDropMenu: function (event) {
                // 显示隐藏

                //                 this.scope.showDropMenu=!this.scope.showDropMenu;
                //点击取消时隐藏下拉框
                $(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
            },
            // 点击多选框的item
            clickCheckboxItem: function (item, index) {
                // 转变active状态
                item.active = !item.active;
                var _flag = item.active;
                // 更新对象
                this.scope.dataList.splice(index, 1, item);
                // 判断是否选择了全部
                if (_flag) {
                    for (var i = 0, _len = this.scope.dataList.length; i < _len; i++) {
                        if (!this.scope.dataList[i].active) {
                            //跳出循环
                            this.scope.selectAll = false;
                            _flag = false;
                            break;
                        }
                    }
                }
                // 设置selectAll的状态
                this.scope.selectAll = _flag;
            },
            // 点击选择全部或者取消全部选择
            clickSelectAll: function () {
                this.scope.selectAll = !this.scope.selectAll;
                var _flag = this.scope.selectAll;
                this.scope.dataList.forEach(function (value, index) {
                    value.active = _flag;
                });
            },
            // 点击确定按钮
            clickConfirm: function (event) {
                var _val = [];
                var _valObj = [];
                this.scope.dataList.forEach(function (value, index) {
                    if (value.active) {
                        _val.push(value.name);
                        _valObj.push(value);
                    }
                });
                // 清空值
                this.scope.val = _val.join(';');
                //隐藏或者隐藏清空按钮
                this.scope.showClear = this.val;

                // 发送消息到父级
                this.$emit('change', _valObj, this.scope.name, this.scope.index, this.scope.id);
                //隐藏下拉菜单
                this.scope.showDropMenu = false;

                //点击取消时隐藏下拉框
                $(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
            },
            checkAllBol: function (list) {
                /*if(list.length==0||(list.length==1&&list[0].name=='')){
                	return false;
                }else{
                	return true;
                }*/
                return false;
            },
            //下拉框是否可以点击下拉
            dropDownSelect: function (list) {
                if (list.length == 0) {
                    return true;
                } else {
                    return false;
                }

            },
            ////当事人或者代理人的姓名全为空或者长度为0  让其选不中
            isDisabledDrop: function (list) {
                var count = 0;
                $.each(list, function (index, value) {
                    if (value.name == '') {
                        count++;
                    }
                });
                if (count == list.length) {
                    return true;
                }
                return false;
            },
        },
        // 计算属性
        computed: {},
        mounted: function () {
            // 设置状态
            this.setStatus();
            //点击下拉框中的内容的时候组织冒泡事件
            $('.js-dropdown-menu').on('click', function (event) {
                event.stopPropagation();
            });
        }
    });
    /*单选下拉组件 created by huazhiqiang
   	此下拉组件是根据v-model的原理弄的 不用单独处理后台给的c值还是n值
   	所传的参数都是必传参数
   	优点是  取消了回掉函数
   	使用方法如下*/
    /*<component-select-simple2
  		v-model="xb"
  		:data-list="getSexList"
  		value-type="n"></component-select-simple2>*/
    Vue.component('component-select-simple2', {
        props: {
            value: {
                type: null,
                required: ''
            },
            valueType: {
                type: String,
                required: 'c'
            },
            placeholder: {
                type: String,
                default: ''
            },
            dataList: {
                // 必传且是数组
                required: true,
                type: Array, // 多种类型 [String,Number]
                default: [{
                    key: '',
                    value: ''
                }] //，有默认值
                //默认值应由一个工厂函数返回
                /* default: function () {
                 return [{key:'',value:''}]                 }*/
                /*  //  // 自定义验证函数
                 validator: function (value) {
                 return value>10
                 }*
                 }
                 /* ,count:{
                 type:[Number,String]
                 */
            }
        },
        //  模板
        template: '<div class="fd-component-simple-dropdown js-drop-menu-contain">' +
            '<div class="fd-dropdown-value-box js-drop-menu-trigger" >' +
            '<input class="fd-dropdown-value"  :value="scope.currentVal" :title="scope.currentVal" unselectable="on" readonly :placeholder="scope.placeholder">' +
            '<div class="fd-clear-icon   js-fd-clear-icon"  :class="{show:getVal}"  @click="clickClear($event)" ></div>' +
            '</div>' +
            '<div class="fd-dropdown-menu fd-hide js-drop-menu">' +
            '<dl class="fd-dropdown-radio">' +
            '<dd  class="js-drop-item" v-for="item in scope.dataList"  :class="{active:item.name==scope.currentVal}"   v-text="item.name" @click="clickItem(item,$event)" :title="item.name">1</dd>' +
            '</dl>' +
            '</div>' +
            '</div>',
        //  私有作用域数据
        data: function () {
            return {
                scope: {
                    value: this.value,
                    placeholder: this.placeholder,
                    currentVal: this.getCurrentVal(),
                    dataList: this.dataList
                }
            }
        },
        watch: {
            dataList: {
                deep: true,
                handler: function (newValue, oldValue) {
                    var _this = this;
                    _this.scope.dataList = JSON.parse(JSON.stringify(_this.dataList));
                    //如果是n值 则 给currentVal赋值
                }
            },
            value: {
                deep: true,
                handler: function (newVal, oldVal) {
                    var _this = this;
                    //如果数据变化了 及时更新到组件中
                    _this.scope.value = newVal;
                    _this.scope.currentVal = _this.getCurrentVal();
                }
            }
        },
        // 方法
        methods: {
            // 点击下拉框
            clickItem: function (item, event) {
                // 赋值
                var resultVal = null;
                this.scope.currentVal = item.name;
                resultVal = this.valueType == 'c' ? item.name : item.code;
                // 发送消息到父级
                this.$emit('input', resultVal);
                this.$emit('change', resultVal);
            },
            // 清空值
            clickClear: function (event) {
                // 赋值
                this.scope.currentVal = '';
                // 发送消息到父级
                this.$emit('input', this.valueType == 'c' ? '' : null);
                this.$emit('change', this.valueType == 'c' ? '' : null);
            },
            getCurrentVal: function () {
                var _this = this,
                    resultVal = null;
                //此处取得都是props中的值 因为 执行此方法的时候 scope中的值 还没加载
                //此处只是给个初始值
                //如果为n值得时候 此处得从datalist中拿到相应的name值显示出来
                if (_this.valueType == 'n') {
                    $.each(_this.dataList, function (index, value) {
                        if (value.code == _this.value) {
                            resultVal = value.name;
                        }
                    });
                } else {
                    resultVal = _this.value;
                }
                return resultVal;
            }
        },
        // 计算属性
        computed: {
            //  根据值判断是否显示×
            getVal: function () {
                return this.scope.currentVal ? true : false;
            }
        },
        mounted: function () {
            $('.fd-dropdown-menu').on('mousewheel', function (event) {
                event.stopPropagation();
            })
        }
    });

    //  日期控件 created by huazhiqiang  2018/3/27
    //取消了回调函数 减少了很多代码
    /*<lay-date
       v-model="item.DKtrq"
       :datepicker-options="dateOptions"
   ></lay-date>*/
    Vue.component('lay-date', {
        template: '<div class="fd-controls">' +
            '<input type="text" readonly unselectable="on" :value="scope.value | filterDateFormate" :title="scope.value | filterDateFormate">' +
            '</div>',

        props: {
            value: {
                type: String,
                default: ''
            },
            datepickerOptions: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        data: function () {
            return {
                scope: {
                    value: this.value
                }
            }
        },
        watch: {
            value: {
                deep: true,
                handler: function (newVal, oldVal) {
                    var _this = this;
                    _this.scope.value = newVal;
                }
            }
        },
        filters: {
            filterDateFormate: function (value) {
                if (value == null) {
                    return "";
                } else if (value != "") {
                    return value.slice(0, 10);
                }
            }
        },
        methods: {
            changeDate: function (value) {
                var _this = this;
                //触发福组件中input事件
                _this.$emit('input', value);
                _this.$emit('change', value);
            }
        },
        mounted: function () {
            var _this = this;
            var datepickerOptions = $.extend({
                elem: ($(_this.$el).find('input'))[0], //指定元素
                trigger: 'click', //采用click弹出
                ready: function (date) {
                    //$(window).trigger('resize');
                },
                done: function (value, date, endDate) {
                    _this.changeDate(value);
                }
            }, _this.datepickerOptions);
            //执行一个laydate实例
            var date = layDate.render(datepickerOptions);
        }
    });
    //  全局组件联想组件
    Vue.component('component-select-associate', {
        /**
         * @example
         * <'component-select-simple
         *  v-on:change="changeDrop"  //  事件分发
         *  :data-list="dataList"   //  数据列表
         *  ></'component-select-simple>
         */
        // 属性
        // props: ['dataList','count'],
        props: {
            name: {
                type: String,
                required: true
            },
            // 循环中用到
            index: {
                type: null, //  null 代表任意类型,
                default: ''
            },
            kbslindex: {
                type: null, //  null 代表任意类型,
                default: ''
            },
            // 值
            val: {
                type: null, //  null 代表任意类型
                validator: function (value) {
                    return value + "200";
                    //  return [{key:'',value:''}]
                }
            },
            dataList: {
                // 必传且是数组
                required: true,
                type: Array, // 多种类型 [String,Number]
                default: [{
                    key: '',
                    value: ''
                }] //，有默认值
            },
            id: {
                type: String,
                default: ''
            },
            //是否需要校验
            isCheckout: {
                type: Boolean,
                default: true
            },
            //最大可输入的长度
            maxlength: {
                type: Number,
                default: 524288
            }
        },
        //  模板
        template: '<div class="fd-component-simple-dropdown js-drop-menu-contain">' +
            '<div class="fd-dropdown-value-box js-drop-menu-trigger" >' +
            '<input class="fd-dropdow-input" :maxlength="maxlength" v-model="scope.val" :title="scope.val"  @blur="isQkValFun(scope.isQkVal)" @input="inputVal()"/>' +
            '<div class="fd-clear-icon   js-fd-clear-icon"  :class="{show:getVal}"  @click="clickClear($event)" >{{getVal}}</div>' +
            '</div>' +
            '<div class="fd-dropdown-menu fd-hide js-drop-menu">' +
            '<dl class="fd-dropdown-radio">' +
            '<dd  class="js-drop-item" v-for="(item,index) in scope.dataList"  :class="getClass(index)"   v-text="item.name" @click="clickItem(item)" :title="item.name">1</dd>' +
            '</dl>' +
            '</div>' +
            '</div>',
        //  私有作用域数据
        data: function () {
            return {
                scope: {
                    index: this.index,
                    //  input 中的name属性
                    name: this.name,
                    //  input 中的值
                    val: this.val,
                    code: "",
                    // 显示错误信息
                    showError: this.showError,
                    // 下拉菜单的数据列表
                    dataList: this.dataList,
                    // 是否清空标识
                    isQkVal: false,
                    // 数据长度
                    isCheckout: this.isCheckout
                }
            }
        },
        watch: {
            //这个监听是用于用户输入数据匹配
            'scope.val': function (newVal, oldVal) {
                this.scope.val = newVal;

            },
            //这个监听是处理组件接受数据之后改用新的值来渲染
            val: {
                deep: true,
                handler: function (newVal, oldVal) {
                    if (newVal !== oldVal && newVal !== this.scope.val) {
                        this.scope.val = newVal
                    }
                }
            },
            dataList: {
                deep: true,
                handler: function (newVal, oldVal) {
                    var _this = this;
                    _this.scope.dataList = JSON.parse(JSON.stringify(_this.dataList));
                }
            }
        },
        // 方法
        methods: {
            //监听是否清空输入框的数据 input失去焦点的时候执行
            isQkValFun: function (newVal) {
                var _this = this;
                //如果需要清空值
                setTimeout(function () {
                    //增加判断条件
                    if (_this.scope.isQkVal == newVal && newVal) {
                        _this.scope.val = '';
                        _this.scope.isQkVal = false;
                    }
                }, 100)

            },
            inputVal: function () {
                //如果为true 则需要校验数据
                if (this.scope.isCheckout) {
                    for (var i = 0; i < this.scope.dataList.length; i++) {
                        if (this.scope.val == this.scope.dataList[i].name) {
                            //如果输入的名称和数据列表中有完整匹配 则需要触发保存事件
                            // 发送消息到父级
                            this.$emit('change', this.scope.dataList[i], this.scope.name, this.index, this.id);
                            this.scope.isQkVal = false;
                            //跳出循环
                            return;
                        }
                    }
                    //如果值没有匹配需要清空之前填写的值
                    this.scope.isQkVal = true;
                    this.$emit('change', {
                        code: ''
                    }, this.scope.name, this.index, this.id);
                    //调用方法判断是否要清空
                } else {
                    //采用对象赋值
                    var newobj = {};
                    newobj.name = this.scope.val;
                    newobj.code = this.scope.code;
                    //如果不要校验数据 则直接保存 (保险公司名称)
                    this.$emit('change', newobj, this.scope.name, this.index, this.id);
                }
            },
            // 点击下拉框
            clickItem: function (item) {
                // 赋值
                this.scope.val = item.name;
                this.scope.code = item.code;
                //把清空置为false
                this.scope.isQkVal = false;
                // 发送消息到父级
                this.$emit('change', item, this.scope.name, this.index, this.id);

            },
            // 清空值
            clickClear: function (event) {
                // 清空值
                this.scope.val = '';
                // 发送消息到父级
                //此处{name:'',code:''}必须加上
                this.$emit('change', {
                    name: '',
                    code: ''
                }, this.scope.name, this.index, this.id);
            },
            //搜索通过添加class fd-hide来实现
            getClass: function (index) {
                var fdClass = "";
                if (this.scope.isCheckout) {
                    var dataName = this.scope.dataList[index].name;

                    if (this.scope.val != '' && dataName.indexOf(this.scope.val) == -1) { //搜索
                        fdClass = "fd-hide";
                    }
                    for (var i = 0; i < this.scope.dataList.length; i++) {
                        var dataItem = this.scope.dataList[i].name;
                        if (dataItem.indexOf(this.scope.val) == -1) {
                            return fdClass
                        }
                    }
                }
                return fdClass;
            }
        },
        // 计算属性
        computed: {
            //  根据值判断是否显示×
            getVal: function () {
                return this.scope.val !== '' ? true : false;
            }
        },
        mounted: function () {
            var _this = this;
            $('.fd-dropdown-menu').on('mousewheel', function (event) {
                event.stopPropagation();
            });
        }
    });
    /**
     *@descroption   这里是查询项组件component-select-cxx
     *@date  20181108
     * @author   liuxl
     */
    //查询项组件
    Vue.component('component-select-cxx', {
        props: {
            name: {
                type: String,
                required: true
            },
            serverData: { //
                type: Object,
                required: true
            },
            //最大选择数
            maxyxsize: {
                type: Number,
                default: 20
            },
            index: {
                type: null,
                default: ''
            },
            //选中项数组
            cCxxList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            //code：自然人1，单位2，车牌号3，银行账号4，主体核实自然人5，机构 6
            code: {
                type: Number,
                required: true
            },
            zjlx: '', //证件类型
            isEdit: {
                type: Boolean,
                default: false
            }

        },
        //  模板
        template: '<div class="fd-component-dropdown js-drop-menu-contain cxx">' +
            '<div class="fd-dropdown-value-box js-drop-menu-trigger" >' +
            '<div class="fd-dropdown-value"><div style="position:relative;display:inline-block" v-show="item.extend!=2||item.sjyList.length!=0" v-for="(item,index) in cCxxList" @mouseenter="hoverShowjtCxx(item,$event)" @mouseleave="hoverHidejtCxx(item,$event)">{{item.extend !=2?item.name:(item.name+\'(\'+item.sjyList.length+\')\')}}{{index==cCxxList.length-1?"" : index== 1 && cCxxList[2].sjyList.length === 0 ? "" : index== 0 && cCxxList[1].sjyList.length === 0 ? "" : "，"}}<ul class="fd-cxxyc-ul fd-hide clearfix"><li class="fd-item" v-for="(itemS,indexS) in item.sjyList">{{itemS.name}}{{indexS==item.sjyList.length-1?"":""}}</li></ul></div></div>' +
            '<div class="fd-clear-icon js-fd-clear-icon"  :class="{show:getYxStringList.length !== 0}"  @click="clickClear($event)" ></div>' +
            '</div>' +
            '<div class="fd-dropdown-menu fd-hide js-drop-menu">' +
            '<div class="fd-cxx-mask ">' +
            '</div><div v-show="isShowCheckedTip" class="fd-checked-tip">最多只能选择20家银行！</div>' +
            '<div class="fd-cxx-content active">' +
            '<div class="fd-cxx-header">' +
            '<span class="fd-cxx-title">查询项选择</span>' +
            '<i class="fd-dropdown-close" @click="clickClose($event)" title="关闭"></i></div>' +
            '<div class="fd-center-main"><ul class="fd-ul-06 clearfix active">' +
            '<li class="fd-item" v-for="(item,index) in scope.cxxList">' +
            '<div class="fd-title-cxx" v-text="item.name" @click="clickShowOrHide(item,$event)"></div>' +
            '<ul class="fd-ul-07">' +
            '<li class="fd-item fd-1" v-for="(itemC,indexC) in item.children" @click="itemC.extend!=2?clickCheckboxItem(itemC,$event):clickOpenOrCloseTab(itemC,indexC)" ' +
            ':class="{active:ul07LiIndex === indexC, edit: itemC.edit}">' +
            '<i class="fd-edit" v-show="itemC.extend==2"></i><label v-text="itemC.name" ></label>' +
            '</li>' +
            '</ul>' +
            '</li>' +
            '</ul>' +
            '<div class="fd-cxxXq fd-cxxXq-syyh" :class="{\'fd-no-header\': !(selectedItem.id==\'001001002\' || selectedItem.id==\'060000000002\' || selectedItem.id==\'060000000003\')}">' +
            '<div class="fd-cxxXq-header" v-if="selectedItem.id==\'001001002\' || selectedItem.id==\'060000000002\' || selectedItem.id==\'060000000003\'">' +
            '<div class="fd-cxxXq-title">{{selectedItem.name}}</div>' +
            '<div class="fd-searchInput-wraper">' +
            '<label class="fd-date-label" v-if="selectedItem.id==\'001001002\'|| selectedItem.id==\'060000000003\'">起止时间</label>' +
            '<label class="fd-date-label" v-if="selectedItem.id==\'060000000002\'">证券持有时间</label>' +
            '<div class="fd-input-wrap date fd-must-set startDate" >' +
            '<datetime-picker name="startDate" :index="0" :date="startDate | dateFormat" :datepicker-options="dateOptions" @change="changeDate" ></datetime-picker>' +
            // '<aty-date-picker type="date" v-model="startDate" @change="changeDate" :options="dateOptions"></aty-date-picker>' +
            '</div>' +
            '</div>' +
            '<div class="fd-searchInput-wraper fd-ml10" v-if="selectedItem.id==\'001001002\' || selectedItem.id==\'060000000003\'">' +
            '<label class="fd-date-label fd-btn-zhi">至</label>' +
            '<div class="fd-input-wrap date fd-must-set endDate">' +
            '<datetime-picker name="endDate" :index="0" :date="endDate | dateFormat" :datepicker-options="dateOptions" @change="changeDate" ></datetime-picker>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div style="width: 100%;height: 100%;overflow-y:auto" v-if="selectedItem.id==\'001001002\' || selectedItem.id==\'020000000002\' || selectedItem.id==\'001001003\' || selectedItem.id==\'001001001\'">' +
            '<div class="fd-section-01">' +
            '<div class="fd-yxcs-title"><span>已选{{selectedItem.id=="020000000002"?"城市":"银行"}}</span><span style="color: #3186ff;padding-left:10px;">({{getYxList.length}}{{selectedItem.id=="020000000002"?"/"+maxyxsize:""}})</span><span v-show="selectedItem.id==\'020000000002\'" class="fd-ts-btn" @click.stop="clickTs">同上</span></div>' +

            '<ul class="fd-ul-08">' +
            '<li class="fd-item" @click.stop="clickDeleteYx(item,index)" v-for="(item,index) in getYxList"><span v-text="item.name"></span><i></i></li>' +
            '</ul>' +
            '<div class="fd-clear-btn" @click="clickClearAll">全部清除</div>' +
            '</div>' +
            '<div class="fd-section-02" v-for="(item,index) in activeList">' +
            '<div class="fd-section-title01"><span v-text="item.name"></span><span v-if="selectedItem.id!==\'020000000002\'" class="fd-allSelect" @click="clickSelectAll(item,index,$event)" :class="{select: item.active}">全选</span><span class="fd-tip-yh">最多只能选择20家银行！</span></div>' +
            // '<div class="fd-cxxXq-inputWrap" @click.stop="" v-if="selectedItem.id==\'001001002\' || selectedItem.id==\'020000000002\'">' +
            '<div class="fd-cxxXq-inputWrap" @click.stop="">' +
            '<input type="text" class="fd-input" v-model="searchInput" style="height:30px;border: 1px solid #abbfd5;" @keyup.enter="clickSearchInput($event)" :placeholder="\'请输入搜索\'+(selectedItem.id==\'020000000002\'?\'城市\':\'银行\')+\'...\'"/><span @click="clickSearchInput($event)" title="搜索" ></span>' +
            '<div class="fd-searchList-wrap fd-hide">' +
            '<ul class="fd-searchList-ul">' +
            '<li v-for="item in searchList" v-text="item.name" class="fd-item" @click="clickSelectSearch(item,$event)"></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<ul class="fd-ul-09" :class="{level:item.level==1}"> ' +
            '<li v-for="(xItem,xIndex) in item.children" v-text="xItem.name" class="fd-item" :class="{active:xItem.active}" @click="item.level==1?clickCheckEjDqItem(xItem,xIndex,$event):clickCheckEjYhItem(xItem,xIndex,$event)"></li>' +
            '</ul>' +
            '<div class="fd-section-02" v-if="item.level==1" :class="{level:item.level==1}">' +
            '<ul class="fd-ul-09">' +
            '<li class="fd-item fd-city" :class="{active:eItem.active}" v-for="(eItem,eIndex) in ejActiveList" v-text="eItem.name"  @click="clickCheckSjItem(eItem,eIndex,$event)"></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            /*'<div class="fd-btn-wrap">'+
            	'<div class="fd-btn-cancel">取消</div>'+
            	'<div class="fd-btn-confirm">确定</div>'+
            '</div>'+*/
            '</div>' +
            '</div></div>' +
            '<div class="fd-cxxbtn-wraper">' +
            '<div class="fd-cancel-btn" @click="clickClose($event)">取消</div>' +
            '<div class="fd-confirm-btn" @click="clickConfirm($event)">确认</div>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '</div>',
        //  私有作用域数据
        data: function () {
            return {
                serverUrlCxxSlectTree: _config.url.frame.CxxSlectTree,
                serverUrlCxxSlectTreeCity: _config.url.frame.CxxSlectTreeCity,
                serverUrlCxxSlectTreeBack: _config.url.frame.CxxSlectTreeBack,
                serverUrlCxxSearchChild: _config.url.frame.cxxSearchChild,

                //拓展项第一层列表
                activeList: [{}, {}, {}], //后台返回的全的数据（例如银行代码等）
                //拓展项第二层列表
                ejActiveList: [],
                //当前选中拓展项
                selectedItem: {}, //当前选中的带有二级页面的查询项
                //右侧展示面板
                showTab: false, //右侧面板是否展开
                saveObj: {}, //这个参数貌似没啥用
                dateOptions: {
                    language: 'zh-CN',
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    startDate: '', //设置最小日期
                    endDate: '', //设置最大日期
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2, //Number, String. 默认值：0, 'hour' 日期时间选择器所能够提供的最精确的时间选择视图。
                    forceParse: true
                },
                //搜索框
                searchInput: "",
                //搜索返回的数据列表
                searchList: [],
                scope: {
                    isEdit: this.isEdit,
                    //左侧查询项列表
                    cxxList: [], //后台返回的所有的查询项，点击后会修改是否选中状态
                    //上一次的查询项列表，用于取消用
                    lastCxxList: [], //点击确定后把cxxList赋值给lastCxxList，当下次选择选择取消后，还原cxxList
                    cCxxCloneList: [] //把选中的查询项赋值给它，后续会回传给列表页面显示使用
                },
                _jylsLst: [],// 如果选了账户信息，看交易流水里是否有值，如果交易流水里有值，赋值给账户信息
                _zhxxLst: [],
                // 是否显示【最多只能选择20家银行】的提示框
                isShowCheckedTip: false,
                // 控制用户是否编辑右侧面板
                isEditRight: false,
                // 银行金融信息里面的项的选中
                ul07LiIndex: 0,
                cCxxListNew: [],
                // 判断是否全选
                isSelectedAll: false
            }
        },
        watch: {
            'cCxxList': {
                immediate: true,
                handler: function (newVal, oldVal) {
                    var _this = this;
                    if (newVal && newVal.length > 0) {
                        _this.scope.cCxxCloneList = JSON.parse(JSON.stringify(_this.cCxxList));
                    }
                }
            },
            'zjlx': {
                deep: true,
                handler: function (newVal, oldVal) {
                    var _this = this;
                    _this.$nextTick(function () {
                        if (_this.scope.isEdit) {
                            _this.scope.isEdit = false;
                            _this.$nextTick(function () {
                                _this.request(_this.code, newVal);
                            });
                            return false
                        }
                        _this.saveObj = {};
                        _this.activeList = [{}, {}, {}];
                        _this.selectedItem = {};
                        _this.ejActiveList = [];
                        _this.showTab = false;
                        _this.scope.cxxList = [];
                        _this.scope.lastCxxList = [];
                        _this.cCxxList = [];
                        _this.scope.cCxxCloneList = [];
                        _this.$emit('change', _this.getYxStringList, _this.name, _this.index, []);
                        _this.request(_this.code, newVal);
                    });
                }
            }
        },
        methods: { //需求改了几十次,此处功能极为紊乱
            request: function (code, zjlx) {
                var _this = this;
                $.ajax({
                    type: "post",
                    // url: "../api/sjy/select",
                    url: _this.serverUrlCxxSlectTree,
                    /*contentType: "application/json",*/
                    dataType: "JSON",
                    async: true,
                    data: {
                        params: JSON.stringify({
                            "cCxxList": _this.cCxxList,
                            "cSyzt": code,
                            "zjLx": zjlx
                        })
                    },
                    success: function (data) {
                        if (data.success) {
                            var _data = data.data;
                            $.each(_data, function (index, val) {
                                $.each(val.children, function (indexC, valC) {
                                    if (valC.active) {
                                        // 给原始数据添加用户是否操作的字段
                                        valC.edit = true
                                    } else {
                                        // 给原始数据添加用户是否操作的字段
                                        valC.edit = false
                                    }

                                });
                            });
                            // 这个数据只有账户信息、交易流水、金融理财的数据，不包含里面的银行信息
                            _this.scope.cxxList = _data;
                            console.log('222中的cxxList',_this.scope.cxxList);
                            _this.scope.lastCxxList = JSON.parse(JSON.stringify(_data));
                            // 调用点击左侧账户信息、交易流水、金融理财的方法，默认选中账户信息
                            _this.clickOpenOrCloseTab(_data[0].children[0], _this.ul07LiIndex);
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                    }
                });
            },
            // 设置左侧tab的显示
            setTabIndex: function(tabIndex) {
                console.log(tabIndex)
                this.ul07LiIndex = tabIndex;
            },
            //请求二级目录
            requestEj: function (item) {

                var _this = this;
                $.ajax({
                    type: "post",
                    url: _this.serverUrlCxxSlectTreeBack,
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        qyCodeType: item.qyCodeType,
                        code: item.id,
                        cxlx: _this.code
                    }),
                    success: function (data) {
                        if (data.success) {
                            if (_this.saveObj[item.id + 'List'] == undefined || _this.saveObj[item.id + 'List'].length == 0) {
                                _this.$set(_this.saveObj, item.id + 'List', data.data)
                            }
                            // 当前选中的左侧银行金融信息对应的右侧的银行信息的list
                            _this.activeList = _this.saveObj[item.id + 'List'];
                            // 添加判断当前是账户信息的银行信息，交易流水的银行信息或者是金融理财的银行信息
                            _this.$set(_this.activeList[0], 'parentId', item.id);
                            _this.operaRequestEj(item);
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        /* fdGlobal.requestError(data, textStatus, errorThrown); */
                    }
                });
            },
            /**
             * @description 处理方法
             */
            operaRequestEj: function(item) {
                var _this = this;
                // 001001001 为账户信息id
                // 001001002 为交易流水id
                // 001001003 为金融理财id
                var selectAllCxx = ['001001001', '001001002', '001001003'];
                if (selectAllCxx.includes(item.id)) {
                    // 账户信息或者交易流水或者金融理财（其中之一）的原始数据
                    var _dataList = JSON.parse(JSON.stringify(_this.activeList[0].children));
                    // 如果选了账户信息，看交易流水里是否有值，如果交易流水里有值，赋值给账户信息
                    _this._jylsLst = [];
                    // 如果选了交易流水，看账户信息里是否有值，如果账户信息里有值，赋值给交易流水
                    _this._zhxxLst = [];
                    // 选中的是账户信息
                    if (item.id === '001001001') {

                        // 循环判断账户信息和交易流水里面是否存在选中的银行的值
                        $.each(_this.scope.cCxxCloneList, function (index, val) {
                            if (val.id === '001001001') {
                                // 账户信息里面的全国银行是否全选的状态
                                val.active = _this.isSelectedAll;
                                // 账户信息的选中的值
                                $.each(val.sjyList, function (index, val) {
                                    if (val.active) {
                                        _this._zhxxLst.push(val);
                                    }
                                })
                            }
                            if (val.id === '001001002') {
                                // 交易流水里面的全国银行是否全选的状态
                                val.active = _this.isSelectedAll;
                                // 交易流水的选中的值
                                $.each(val.sjyList, function (index, val) {
                                    if (val.active) {
                                        _this._jylsLst.push(val);
                                    }
                                })
                            }
                        });
                        // 给账户信息赋值
                        $.each(_this.scope.cCxxCloneList, function (index, val) {
                            // 匹配账户信息
                            if (val.id === '001001001') {
                                // 改变账户信息里面的全国的选中状态
                                _this.activeList[0].active = _this.isSelectedAll;
                                // 循环数据里面的所有值的选中状态，设置为false
                                _this.activeList[0].children.forEach(function (activeItem, activeIdx) {
                                    // 循环数据里面的所有值的选中状态，设置为false
                                    activeItem.active = false
                                });
                                // 如果交易流水里有已选中的数据
                                if (_this._jylsLst.length) {
                                    // 循环账户信息，根据交易流水里面选中的银行（_jylsLst），匹配账户信息里面的银行，并且选中，渲染页面
                                    _this.activeList[0].children.forEach(function (activeItem, activeIdx) {
                                        // 循环交易流水里面选中的银行的值
                                        _this._jylsLst.forEach(function (jylsItem, jylsIndex) {
                                            if (jylsItem.name === activeItem.name) {
                                                activeItem.active = true
                                            }
                                        })
                                    });
                                    // 返显选中的数据
                                    val.sjyList = _this.activeList[0].children;
                                    item.edit = true;
                                } else if (_this._zhxxLst.length) {
                                    // 循环账户信息，根据账户信息里面选中的银行（_zhxxLst），匹配账户信息里面的银行，并且选中，渲染页面
                                    _this.activeList[0].children.forEach(function (activeItem, activeIdx) {
                                        // 循环交易流水里面选中的银行的值
                                        _this._zhxxLst.forEach(function (jylsItem, jylsIndex) {
                                            if (jylsItem.name === activeItem.name) {
                                                activeItem.active = true
                                            }
                                        })
                                    });
                                    // 返显选中的数据
                                    val.sjyList = _this.activeList[0].children;
                                    item.edit = true;
                                } else {
                                    // 改变【getYxList】的值
                                    $.each(_dataList, function (index, item) {
                                        item.active = false;
                                    })
                                    val.sjyList = _dataList;
                                    item.edit = false;
                                }
                                _this.selectedItem.active = true;
                            }
                        })
                    } else if (item.id === '001001002') { // 选中的是交易流水
                        // 循环判断账户信息和交易流水里面是否存在选中的银行的值
                        $.each(_this.scope.cCxxCloneList, function (index, val) {
                            if (val.id === '001001001') {
                                // 改变账户信息里面的全国的选中状态
                                val.active = _this.isSelectedAll;
                                // 得到账户信息的选中的银行的值
                                $.each(val.sjyList, function (index, val) {
                                    if (val.active) {
                                        _this._zhxxLst.push(val);
                                    }
                                })
                            }
                            if (val.id === '001001002') {
                                // 改变交易流水里面的全国的选中状态
                                val.active = _this.isSelectedAll;
                                // 得到交易流水的选中的银行的值
                                $.each(val.sjyList, function (index, val) {
                                    if (val.active) {
                                        _this._jylsLst.push(val);
                                    }
                                })
                            }
                        });
                        // 给交易流水赋值
                        $.each(_this.scope.cCxxCloneList, function (index, val) {
                            if (val.id === '001001002') {
                                // 改变交易流水里面的全国的选中状态
                                _this.activeList[0].active = _this.isSelectedAll;
                                // 循环数据里面的所有值的选中状态，设置为false
                                _this.activeList[0].children.forEach(function (activeItem, activeIdx) {
                                    // 循环数据里面的所有值的选中状态，设置为false
                                    activeItem.active = false
                                });
                                // 如果账户信息里有数据，应该用同一组数据
                                if (_this._zhxxLst.length) {
                                    // 循环交易流水，根据账户信息里面选中的银行，匹配交易流水里面的银行，并且选中，activeList渲染页面
                                    _this.activeList[0].children.forEach(function (activeItem, activeIdx) {
                                        // 循环账户信息里面选中的银行的值
                                        _this._zhxxLst.forEach(function (jylsItem, jylsIndex) {
                                            if (jylsItem.name === activeItem.name) {
                                                activeItem.active = true
                                            }
                                        })
                                    });

                                    val.sjyList = _this.activeList[0].children;
                                    item.edit = true;
                                } else if (_this._jylsLst.length) {
                                    // 循环交易流水，根据交易流水里面选中的银行，匹配交易流水里面的银行，并且选中，activeList渲染页面
                                    _this.activeList[0].children.forEach(function (activeItem, activeIdx) {
                                        // 循环交易流水里面选中的银行的值
                                        _this._jylsLst.forEach(function (jylsItem, jylsIndex) {
                                            if (jylsItem.name === activeItem.name) {
                                                activeItem.active = true
                                            }
                                        })
                                    });
                                    // 返显选中的数据
                                    val.sjyList = _this.activeList[0].children;
                                    item.edit = true;
                                } else {
                                    // 改变【getYxList】的值
                                    $.each(_dataList, function (index, item) {
                                        item.active = false;
                                    })
                                    val.sjyList = _dataList;
                                    item.edit = false;
                                }
                                _this.selectedItem.active = true;
                            }
                        })
                    } else {
                        var jrlcList = [];
                        // 循环判断金融理财里面是否存在选中的银行的值
                        $.each(_this.scope.cCxxCloneList, function (index, val) {
                            if (val.id === '001001003') {
                                // 改变金融理财里面的全国的选中状态
                                val.active = _this.isSelectedAll;
                                // 得到金融理财的选中的银行的值
                                $.each(val.sjyList, function (index, val) {
                                    if (val.active) {
                                        jrlcList.push(val);
                                    }
                                })
                            }
                        });

                        // 处理金融理财数据
                        $.each(_this.scope.cCxxCloneList, function (index, val) {
                            if (val.id === '001001003') {
                                _this.activeList[0].children.forEach(function (activeItem, activeIdx) {
                                    // 循环数据里面的所有值的选中状态，设置为false
                                    activeItem.active = false
                                });
                                // 如果金融理财里有选中的数据
                                if (jrlcList.length) {
                                    // 循环金融理财，匹配金融理财jrlcList里面的银行，并且选中，activeList渲染页面
                                    _this.activeList[0].children.forEach(function (activeItem, activeIdx) {
                                        // 循环金融理财里面选中的银行的值
                                        jrlcList.forEach(function (jylsItem, jylsIndex) {
                                            if (jylsItem.name === activeItem.name) {
                                                activeItem.active = true
                                            }
                                        })
                                    });
                                    val.sjyList = _this.activeList[0].children;
                                    item.edit = true;
                                } else {
                                    // 改变【getYxList】的值
                                    $.each(_dataList, function (index, item) {
                                        item.active = false;
                                    })
                                    val.sjyList = _dataList;
                                    item.edit = false;
                                }
                                _this.selectedItem.active = true;
                            }
                        });
                    }
                }
            },
            //鼠标hover显示具体被选项
            hoverShowjtCxx: function (item, event) {
                if (item.sjyList.length != 0) {
                    $(event.currentTarget).find('.fd-cxxyc-ul').removeClass('fd-hide')
                }

            },
            //鼠标hover隐藏具体被选项
            hoverHidejtCxx: function (item, event) {
                if (item.sjyList.length != 0) {
                    $(event.currentTarget).find('.fd-cxxyc-ul').addClass('fd-hide')
                }
            },
            /**
             * @description 点击全选按钮
             * @param item 点击的item
             * @param index
             * @param event
             */
            clickSelectAll: function (item, index, event) {
                var _this = this;
                // 改变全国银行的选中的状态
                item.active = !item.active;
                $.each(_this.scope.cCxxCloneList, function (index, val) {
                    $.each(val.sjyList, function (indexS, valS) {
                        // 如果用户选中的是账户信息或者交易流水
                        if (_this.selectedItem.id === '001001001' || _this.selectedItem.id === '001001002') {
                            // 改变账户信息和交易流水的选框的状态
                            if (val.id === '001001001' || val.id === '001001002') {
                                // 改变交易流水和账户信息的全选的状态（和全选的状态是同步）
                                val.active = item.active;
                                // 循环数据源list，改变里面active的值（和全选的状态是同步）;
                                valS.active = item.active;
                                // 标记账户信息或者交易流水是否点击了全部选中
                                _this.isSelectedAll = item.active;
                            }
                        } else { // 金融理财的情况
                            if (val.id === '001001003') {
                                // 循环数据源list，改变里面active的值（和全选的状态是同步）;
                                valS.active = item.active;
                            }
                        }
                    })
                });
                // var _dataList = JSON.parse(JSON.stringify(_this.activeList[index].children));
                // 标记用户操作的标识（状态和全选也是同步的）
                _this.selectedItem.edit = item.active;
                $.each(_this.activeList[index].children, function (index, val) {
                    // 循环数据源list，改变里面active的值（和全选的状态是同步）;
                    val.active = item.active;
                })
            },
            /**
             * @description 点击全部清除按钮
             * @name clickClearAll
             */
            clickClearAll: function () {
                var _this = this;
                _this.isClickclearAll = true;
                $.each(_this.activeList, function (aIndex, val) {
                    val.active = false;
                    $.each(val.children, function (cIndex, cVal) {
                        cVal.active = false;
                    });
                });
                $.each(_this.scope.cCxxCloneList, function (indexC, valC) {
                    // 和左侧面板选中的id匹配
                    if (valC && _this.selectedItem.id !== '001001003') {
                        // 选中的是账户信息（清除的是账户信息里面的值）
                        if (valC.id == '001001001') {
                            valC.active = false;
                            // 标记账户信息或者交易流水是否点击了全部选中
                            _this.isSelectedAll = false;
                            // 取消所有银行的选中状态
                            $.each(valC.sjyList, function (sIndex, sItem) {
                                sItem.active = false
                            })
                            //去除左侧激活状态取消
                            // _this.selectedItem.active = false;
                            // 去除已经操作的状态
                            _this.selectedItem.edit = false;
                            //账户信息和交易流水需要同时取消激活状态
                            $.each(_this.scope.cxxList, function (indexL, valL) {
                                $.each(valL.children, function (indexR, valR) {
                                    // 从数组中找到交易流水
                                    if (valR.id == '001001002') {
                                        // flag = true;
                                        // 取消选中状态
                                        valR.active = false;
                                        // 取消用户操作的标识
                                        valR.edit = false;
                                    }
                                })
                            })
                        } else if (valC.id == '001001002') { // 选中的交易流水
                            valC.active = false;
                            // 标记账户信息或者交易流水是否点击了全部选中
                            _this.isSelectedAll = false;
                            // 取消所有银行的选中状态
                            valC.sjyList.forEach(function (sItem, sIndex) {
                                sItem.active = false
                            });
                            //去除左侧激活状态取消
                            // _this.selectedItem.active = false;
                            // 去除已经操作的状态
                            _this.selectedItem.edit = false;
                            //账户信息和交易流水需要同时取消激活状态
                            $.each(_this.scope.cxxList, function (indexL, valL) {
                                $.each(valL.children, function (indexR, valR) {
                                    // 从数组中找到账户信息
                                    if (valR.id == '001001001') {
                                        // flag = true;
                                        // 取消选中状态
                                        valR.active = false;
                                        // 取消用户操作的标识
                                        valR.edit = false;
                                    }
                                })
                            })
                        }
                    } else { // 用户选中金融理财
                        // 用户选中左侧金融理财的时候，对应把金融理财里面的全部数据设置为false
                        if (valC.id === '001001003') {
                            valC.active = false;
                            // 取消所有银行的选中状态
                            valC.sjyList.forEach(function (sItem, sIndex) {
                                sItem.active = false
                            });
                            //去除左侧激活状态取消
                            // _this.selectedItem.active = false;
                            //去除左侧用户操作标识状态取消
                            _this.selectedItem.edit = false;
                        }
                    }
                })
                console.log('点击全部清除',_this.scope.cCxxCloneList)
            },
            //收起取消整个下拉弹窗
            clickClose: function (event) {
                var _this = this;
                this.showTab = false;
                // 判断进弹框的时候是否已经存在查询项选中的值，如果不存在的话
                if (this.cCxxList.length === 0) {
                    _this.isSelectedAll = false;
                    // 改变全国的选中的状态
                    this.activeList[0].active = false;
                    // 循环数据，选中的状态改为false
                    this.scope.cCxxCloneList.forEach(function(item,index){
                        item.sjyList.forEach(function(itemS,indexS){
                            itemS.active = false;
                        })
                    });
                    // 循环页面的绑定数据，选中的状态改为false
                    this.activeList[0].children.forEach(function(item,index){
                        item.active = false;
                    })
                    // 修改用户操作的标识
                    $.each(_this.scope.cxxList, function (index, val) {
                        $.each(val.children, function (indexC, valC) {
                            valC.edit = false
                        });
                    });
                } else { // 如果进弹框的时候已经存在查询项选中的值，取消的时候只是把用户又选择的值改变状态
                    // 账户信息选中的银行的list
                    var zhxxList = [];
                    // 交易流水选中的银行的list
                    var jylsList = [];
                    // 金融理财选中的银行的list
                    var jrlcList = [];
                    this.cCxxList.forEach(function(item,index){
                        if (item.id === '001001001') {
                            // 得到账户信息选中的银行的list
                            //判断是否点击取消全部 同时 又点击了取消按钮
                            if(_this.isClickclearAll){
                                zhxxList = [];
                            }else{
                                zhxxList = item.sjyList;
                            }
                        } else if (item.id === '001001002') {
                            // 得到交易流水选中的银行的list
                            if(_this.isClickclearAll){
                                zhxxList = [];
                            }else{
                                zhxxList = item.sjyList;
                            }
                            jylsList = item.sjyList;
                        } else {
                            // 得到金融理财选中的银行的list
                            jrlcList = item.sjyList;
                        }
                    });
                    this.scope.cCxxCloneList.forEach(function(item,index){
                        // 判断账户信息，还原账户信息里面银行的选中的值
                        if (item.id === '001001001') {
                            item.sjyList = zhxxList;
                        } else if (item.id === '001001002') { // 判断是交易流水，还原交易流水里面银行的选中的值
                            item.sjyList = jylsList;
                        } else { // 判断是金融理财，还原金融理财里面银行的选中的值
                            item.sjyList = jrlcList;
                        }
                    });
                    // 如果当前是账户信息
                    if (this.activeList[0].parentId === '001001001') {
                        // 还原账户信息的activeList页面绑定的值的银行的选中的状态
                        _this.operateClickClose(zhxxList)
                    } else if (this.activeList[0].parentId === '001001002') { // 如果当前是交易流水
                        // 还原交易流水的activeList页面绑定的值的银行的选中的状态
                        _this.operateClickClose(jylsList)
                    } else { // 如果当前是金融理财
                        // 还原金融理财的activeList页面绑定的值的银行的选中的状态
                        _this.operateClickClose(jrlcList)
                    }
                }
                // this.$set(this.scope, 'cxxList', JSON.parse(JSON.stringify(this.scope.lastCxxList)));
                // $('.fd-ul-07 .fd-item label').removeClass('selected');
                $(event.currentTarget).parents('.fd-dropdown-menu').addClass('fd-hide');
            },
            // 点击取消的时候，还原弹框里面的数据
            operateClickClose: function(data) {
                var _this = this;
                // 循环页面的绑定数据，先全部改为false
                this.activeList[0].children.forEach(function(item,index){
                    item.active = false;
                });
                // 循环选中的数据
                data.forEach(function(item,index){
                    _this.activeList[0].children.forEach(function(itemA,indexA){
                        if (itemA.name === item.name) {
                            // 改变状态为true
                            itemA.active = true;
                        }
                    })
                })
            },
            //确定收起整个下拉弹窗
            clickConfirm: function (e) {
                var _this = this;
                var validate = true;
                $.each(_this.scope.cCxxCloneList, function (index, val) {
                    if (val.id == '001001002' && (val.startDate || val.endDate)) {
                        if (!val.endDate || !val.startDate) {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请将交易流水中的查询日期填全！'
                                },
                                interval: 1800
                            });
                            validate = false;
                        }
                    }
                    if (val.id == '060000000002' && (val.startDate || val.endDate)) {
                        if (!val.endDate || !val.startDate) {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请填写证券持有日期！'
                                },
                                interval: 1800
                            });
                            validate = false;
                        }
                    }
                    if (val.id == '060000000003' && (val.startDate || val.endDate)) {
                        if (!val.endDate || !val.startDate) {
                            $.alert({
                                type: 'fail',
                                info: {
                                    fail: '请将证券持有变动中的查询日期填全！'
                                },
                                interval: 1800
                            });
                            validate = false;
                        }
                    }
                })
                if (!validate) {
                    return false;
                }
                var arr = JSON.parse(JSON.stringify(_this.scope.cCxxCloneList));
                var i = 0;
                //确定时去除所有没选择下一集的拓展项
                $.each(arr, function (index, val) {
                    var flag = false;
                    if (val.extend == 2 && val.sjyList.length == 0) {
                        i++;
                        flag = true;
                    }
                    ;
                    if (i == 1 && flag) {
                        _this.scope.cCxxCloneList.splice(index, 1)
                    } else if (i > 1 && flag) {
                        _this.scope.cCxxCloneList.splice(index - i + 1, 1)
                    }
                });

                var _data = JSON.parse(JSON.stringify(_this.scope.cCxxCloneList));
                // 最多只能选择20家银行，超出提示
                for (var i = 0; i < _data.length; i++) {
                    var newSjyList = [];
                    _data[i].sjyList.forEach(function (subItem, subIndex) {
                        if (subItem.active) {
                            newSjyList.push(subItem);
                        }
                    })
                    _data[i].sjyList = newSjyList;
                    if (newSjyList.length > 20) {
                        $.alert({
                            type: 'fail',
                            info: {
                                fail: '最多只能选择20家银行！'
                            },
                            interval: 1800
                        });
                        return false
                    }
                }
                _this.$emit('change', _this.getYxStringList, _this.name, _this.index, _data, this.ul07LiIndex);
                this.$set(this.scope, 'lastCxxList', JSON.parse(JSON.stringify(this.scope.cxxList)));
                this.showTab = false;
                $('.fd-ul-07 .fd-item label').removeClass('selected');
                setTimeout(function () {
                    $(e.target).parents('.fd-dropdown-menu').addClass('fd-hide');
                }, 100)


            },
            //清除值
            clickClear: function () {
                var _this = this;
                //清空已选之前要将左侧列表选中状态取消
                $.each(_this.scope.cxxList, function (indexA, valA) {
                    $.each(valA.children, function (indexD, valD) {
                        valD.active = false
                        valD.edit = false
                    })
                })
                //清空已选之前要将左侧列表选中状态取消
                $.each(_this.scope.lastCxxList, function (indexA, valA) {
                    $.each(valA.children, function (indexD, valD) {
                        valD.active = false
                        valD.edit = false
                    })
                })
                //清空已选
                _this.cCxxList = [];
                // _this.scope.cCxxCloneList = [];
                // 清除所有选中项
                $.each(_this.scope.cCxxCloneList, function (index, val) {
                    $.each(val.sjyList, function (indexS, valS) {
                        valS.active = false;
                    })
                })
                $.each(_this.activeList, function (index, val) {
                    $.each(val.children, function (indexS, valS) {
                        valS.active = false;
                    })
                })
                _this.$emit('change', _this.getYxStringList, _this.name, _this.index, []);
                //右侧面板收起
                _this.showTab = false;
            },
            //展开和收起左侧列表
            clickShowOrHide: function (item, event) {
                $(event.currentTarget).toggleClass('active').siblings('.fd-ul-07').toggleClass("fd-hide")
            },
            // 点击多选框的item
            clickCheckboxItem: function (item, event) {
                var _this = this;
                $('.fd-ul-07 .fd-item label').removeClass('selected');
                $('.fd-ul-07 .fd-item').removeClass('active');
                $(event.currentTarget).find('label').addClass('selected');
                $(event.currentTarget).addClass('active');
                if (item.id == '060000000002' || item.id == '060000000003') {
                    _this.selectedItem = item;
                    _this.showTab = true;
                } else {
                    _this.showTab = false;
                }
                // 转变active状态
                if (item.active == false) {
                    item.active = true;
                    var _data = {
                        name: item.name,
                        id: item.id,
                        extend: item.extend,
                        sjyList: [],
                        nSfxzrq: item.nSfxzrq,
                        qyCodeType: item.qyCodeType
                    };
                    if (item.id == '060000000002') {
                        _data.startDate = _this.getLastDate();
                        _data.endDate = _this.getLastDate();
                    } else if (item.id == '060000000003') {
                        _data.startDate = _this.getLast10YearDate();
                        _data.endDate = _this.getNowDate();
                    }
                    _this.scope.cCxxCloneList.push(_data);
                    if (item.id == '080000000002' && (_this.code == 1 || _this.code == 2)) {
                        $.each(_this.scope.cxxList, function (indexL, valL) {
                            $.each(valL.children, function (indexR, valR) {
                                if (valR.id == '080000000001') {
                                    if (valR.active == false) {
                                        valR.active = true;
                                        var _data2 = {
                                            name: valR.name,
                                            id: valR.id,
                                            extend: valR.extend,
                                            sjyList: [],
                                            nSfxzrq: valR.nSfxzrq,
                                            qyCodeType: valR.qyCodeType
                                        };
                                        _this.scope.cCxxCloneList.push(_data2);
                                    }
                                }
                            })
                        })
                    }
                    if (item.id == '140000000003' && (_this.code == 2)) {
                        $.each(_this.scope.cxxList, function (indexL, valL) {
                            $.each(valL.children, function (indexR, valR) {
                                if (valR.id == '140000000001') {
                                    if (valR.active == false) {
                                        valR.active = true;
                                        var _data2 = {
                                            name: valR.name,
                                            id: valR.id,
                                            extend: valR.extend,
                                            sjyList: [],
                                            nSfxzrq: valR.nSfxzrq,
                                            qyCodeType: valR.qyCodeType
                                        };
                                        _this.scope.cCxxCloneList.push(_data2);
                                    }
                                }
                            })
                        })
                    }
                } else {
                    item.active = false;
                    if (item.extend == 2) {
                        _this.showTab = false;
                        _this.searchInput = '';
                    }
                    ;
                    var _index;
                    $.each(_this.scope.cCxxCloneList, function (index, val) {
                        if (item.id == val.id) {
                            $.each(_this.scope.cCxxCloneList[index].sjyList, function (indexC, valC) { //此处现在暂时没用，原来是为了实现选中某一个城市或者银行要有背景色
                                valC.active = false
                            })
                            _index = index;

                        }
                    })
                    _this.scope.cCxxCloneList.splice(_index, 1);
                    if (item.id == '080000000001' && (_this.code == 1 || _this.code == 2)) {
                        $.each(_this.scope.cCxxCloneList, function (indexL, valL) {
                            if (valL.id == '080000000002') {
                                _this.scope.cCxxCloneList.splice(indexL, 1);
                            }
                        })
                        $.each(_this.scope.cxxList, function (indexL, valL) {
                            $.each(valL.children, function (indexR, valR) {
                                if (valR.id == '080000000002') {
                                    valR.active = false;
                                }
                            })
                        })
                    }
                    if (item.id == '140000000001' && (_this.code == 2)) {
                        $.each(_this.scope.cCxxCloneList, function (indexL, valL) {
                            if (valL.id == '140000000003') {
                                _this.scope.cCxxCloneList.splice(indexL, 1);
                            }
                        })
                        $.each(_this.scope.cxxList, function (indexL, valL) {
                            $.each(valL.children, function (indexR, valR) {
                                if (valR.id == '140000000003') {
                                    valR.active = false;
                                }
                            })
                        })
                    }
                }
            },
            getNowDate: function () {
                return this.formateDate(new Date());
            },
            getLastDate: function () {
                var varcurrentDate = new Date();
                varcurrentDate.setDate(varcurrentDate.getDate() - 1);
                return this.formateDate(varcurrentDate);
            },
            getLast10YearDate: function () {
                var varcurrentDate = new Date();
                varcurrentDate.setFullYear(varcurrentDate.getFullYear() - 10);
                return this.formateDate(varcurrentDate);
            },
            formateDate: function (date) {
                return date.toISOString().substring(0, 10);
            },
            //打开右侧面板
            clickOpenOrCloseTab: function (item, index) {
                var _this = this;
                _this.ul07LiIndex = index;
                var i = 0;
                // 判断是否是原始状态，查询项里面没有该值
                $.each(_this.scope.cCxxCloneList, function (indexC, valC) {
                    if (item.id == valC.id) {
                        i++;
                    }
                });
                // 如果i等于0，代表这一项之前没选中
                if (i == 0) {
                    var _data = {
                        name: item.name,
                        id: item.id,
                        extend: item.extend,
                        sjyList: [],
                        nSfxzrq: item.nSfxzrq,
                        qyCodeType: item.qyCodeType
                    }
                    _this.scope.cCxxCloneList.push(_data);
                }
                // 用户联动交易流水和账户信息之间的值
                var _sjyListToggle = [];
                // 循环list
                $.each(_this.scope.cCxxCloneList, function (index, val) {
                    // 用户当前选中的是账户信息（或者交易流水）的话
                    if (item.id === '001001001' || item.id === '001001002') {
                        // 判断交易流水里面是否存在值
                        if (val.id === '001001002') {
                            var _sjyList = [];
                            // 获的交易流水里面用户选中的银行的值
                            $.each(val.sjyList, function (indexSub, valSub) {
                                if (valSub.active) {
                                    _sjyList.push(valSub)
                                }
                            });
                            // 如果交易流水里面有选中的值
                            if (_sjyList.length) {
                                // 取出交易流水的sjyList
                                _sjyListToggle = val.sjyList;
                                $.each(_this.scope.cxxList, function (index, val) {
                                    $.each(val.children, function (subIndex, subVal) {
                                        if (subVal.id === item.id) {
                                            subVal.edit = true;
                                        }
                                    })
                                })
                            }
                        }

                        // 判断账户信息里面是否存在值
                        if (val.id === '001001001') {
                            var _sjyList = [];
                            // 获的账户信息里面的银行的选中的值
                            $.each(val.sjyList, function (indexSub, valSub) {
                                if (valSub.active) {
                                    _sjyList.push(valSub)
                                }
                            });
                            // 如果账户信息里面的银行信息有被选中的话
                            if (_sjyList.length) {
                                // 取出账户信息里面的sjyList
                                _sjyListToggle = val.sjyList;
                                $.each(_this.scope.cxxList, function (index, val) {
                                    $.each(val.children, function (subIndex, subVal) {
                                        if (subVal.id === item.id) {
                                            subVal.edit = true;
                                        }
                                    })
                                })
                            }
                        }
                        // 同步更新账户信息和交易流水的sjyList
                        if (val.id === '001001001' || val.id === '001001002') {
                            val.sjyList = _sjyListToggle;
                        }
                    }
                })
                // 左侧面板选中的项
                _this.selectedItem = item;
                _this.showTab = true;
                _this.searchInput = '';
                _this.ejActiveList = [];
                // 改变数据里面的active的值
                $.each(_this.scope.cxxList, function (index, val) {
                    $.each(val.children, function (subIndex, subVal) {
                        if (subVal.id === item.id) {
                            subVal.active = true;
                        } else {
                            subVal.active = false;
                        }
                    })
                })
                //如果有二级目录
                _this.requestEj(item)
            },
            //不动产精准查询点击同上
            // clickTs: function () {
            //     var _this = this;
            //     if (_this.name == "cxZrrList") {
            //         if (_this.index > 0) { //如果不是自然人第一条数据
            //             var zrrIndex, zrrI;
            //             var flag = false;
            //             for (var i = _this.index - 1; i >= 0; i--) {
            //                 if (!flag) {
            //                     $.each(_this.serverData.cxZrrList[i].cCxxList, function (index, val) {
            //                         if (val.id == "020000000002" && val.sjyList.length > 0) {
            //                             zrrI = i;
            //                             zrrIndex = index;
            //                             flag = true;
            //                         }
            //                     });
            //                 }
            //             }
            //             ;
            //             if (zrrIndex != undefined) {
            //                 //如果选项子项都取消了，再重新选择时，要将父级项push进去
            //                 var flag1 = false;
            //                 $.each(_this.scope.cCxxCloneList, function (indexC, valC) {
            //                     if (valC.id == _this.selectedItem.id) {
            //                         flag1 = true;
            //                     }
            //                 });
            //                 if (!flag1) {
            //                     var _data = {
            //                         name: _this.selectedItem.name,
            //                         id: _this.selectedItem.id,
            //                         extend: _this.selectedItem.extend,
            //                         sjyList: [],
            //                         nSfxzrq: _this.selectedItem.nSfxzrq,
            //                         qyCodeType: _this.selectedItem.qyCodeType
            //                     }
            //                     _this.scope.cCxxCloneList.push(_data);
            //                 }
            //                 ;
            //                 $.each(_this.scope.cCxxCloneList, function (indexC, valC) {
            //                     if (valC.id == _this.selectedItem.id) {
            //                         valC.sjyList = JSON.parse(JSON.stringify(_this.serverData.cxZrrList[zrrI].cCxxList[zrrIndex].sjyList));
            //                         _this.selectedItem.active = true;
            //                     }
            //                 });
            //             } else {
            //                 $.alert({
            //                     type: 'fail',
            //                     info: {
            //                         fail: '上一条数据未选择不动产精准查询'
            //                     },
            //                     interval: 1800
            //                 });
            //                 return
            //             }
            //
            //         } else { //如果是自然人第一条
            //             $.alert({
            //                 type: 'fail',
            //                 info: {
            //                     fail: '上一条数据未选择不动产精准查询'
            //                 },
            //                 interval: 1800
            //             });
            //             return
            //         }
            //     }
            //     ;
            //     if (_this.name == "cxDwList") {
            //         if (_this.index > 0) { //如果不是机构第一条数据
            //             var dwIndex, dwI;
            //             var flag = false;
            //             var markName;
            //             for (var i = _this.index - 1; i >= 0; i--) {
            //                 if (!flag) {
            //                     $.each(_this.serverData.cxDwList[i].cCxxList, function (index, val) {
            //                         if (val.id == "020000000002" && val.sjyList.length > 0) {
            //                             dwI = i;
            //                             dwIndex = index;
            //                             flag = true;
            //                             markName = 'cxDwList';
            //                         }
            //                     });
            //                 }
            //             }
            //             ;
            //             if (dwIndex == undefined) { //如果机构列表都没有选择不动产精准查询，那么要到自然人中找同上的数据
            //                 if (_this.serverData.cxZrrList.length > 0) {
            //                     for (var i = _this.serverData.cxZrrList.length - 1; i >= 0; i--) {
            //                         if (!flag) {
            //                             $.each(_this.serverData.cxZrrList[i].cCxxList, function (index, val) {
            //                                 if (val.id == "020000000002" && val.sjyList.length > 0) {
            //                                     dwI = i;
            //                                     dwIndex = index;
            //                                     flag = true;
            //                                     markName = 'cxZrrList';
            //                                 }
            //                             });
            //                         }
            //                     }
            //                     ;
            //                 } else {
            //                     $.alert({
            //                         type: 'fail',
            //                         info: {
            //                             fail: '上一条数据未选择不动产精准查询'
            //                         },
            //                         interval: 1800
            //                     });
            //                     return
            //                 }
            //             }
            //             ;
            //             if (dwIndex != undefined) {
            //                 //如果选项子项都取消了，再重新选择时，要将父级项push进去
            //                 var flag1 = false;
            //                 $.each(_this.scope.cCxxCloneList, function (indexC, valC) {
            //                     if (valC.id == _this.selectedItem.id) {
            //                         flag1 = true;
            //                     }
            //                 });
            //                 if (!flag1) {
            //                     var _data = {
            //                         name: _this.selectedItem.name,
            //                         id: _this.selectedItem.id,
            //                         extend: _this.selectedItem.extend,
            //                         sjyList: [],
            //                         nSfxzrq: _this.selectedItem.nSfxzrq,
            //                         qyCodeType: _this.selectedItem.qyCodeType
            //                     }
            //                     _this.scope.cCxxCloneList.push(_data);
            //                 }
            //                 ;
            //                 $.each(_this.scope.cCxxCloneList, function (indexC, valC) {
            //                     if (valC.id == _this.selectedItem.id) {
            //                         valC.sjyList = JSON.parse(JSON.stringify(_this.serverData[markName][dwI].cCxxList[dwIndex].sjyList));
            //                         _this.selectedItem.active = true;
            //                     }
            //                 });
            //             } else {
            //                 $.alert({
            //                     type: 'fail',
            //                     info: {
            //                         fail: '上一条数据未选择不动产精准查询'
            //                     },
            //                     interval: 1800
            //                 });
            //                 return
            //             }
            //         } else { //如果是机构第一条,那么要到自然人中去找上一条
            //             if (_this.serverData.cxZrrList.length > 0) {
            //                 var dwIndex, dwI;
            //                 var flag = false;
            //                 for (var i = _this.serverData.cxZrrList.length - 1; i >= 0; i--) {
            //                     if (!flag) {
            //                         $.each(_this.serverData.cxZrrList[i].cCxxList, function (index, val) {
            //                             if (val.id == "020000000002" && val.sjyList.length > 0) {
            //                                 dwI = i;
            //                                 dwIndex = index;
            //                                 flag = true
            //                             }
            //                         });
            //                     }
            //                 }
            //                 ;
            //                 if (dwIndex != undefined) { //如果自然人中上一条选了不动产精准查询
            //                     //如果选项子项都取消了，再重新选择时，要将父级项push进去
            //                     var flag1 = false;
            //                     $.each(_this.scope.cCxxCloneList, function (indexC, valC) {
            //                         if (valC.id == _this.selectedItem.id) {
            //                             flag1 = true;
            //                         }
            //                     });
            //                     if (!flag1) {
            //                         var _data = {
            //                             name: _this.selectedItem.name,
            //                             id: _this.selectedItem.id,
            //                             extend: _this.selectedItem.extend,
            //                             sjyList: [],
            //                             nSfxzrq: _this.selectedItem.nSfxzrq,
            //                             qyCodeType: _this.selectedItem.qyCodeType
            //                         }
            //                         _this.scope.cCxxCloneList.push(_data);
            //                     }
            //                     ;
            //                     $.each(_this.scope.cCxxCloneList, function (indexC, valC) {
            //                         if (valC.id == _this.selectedItem.id) {
            //                             valC.sjyList = JSON.parse(JSON.stringify(_this.serverData.cxZrrList[dwI].cCxxList[dwIndex].sjyList));
            //                             _this.selectedItem.active = true;
            //                         }
            //                     });
            //                 } else {
            //                     $.alert({
            //                         type: 'fail',
            //                         info: {
            //                             fail: '上一条数据未选择不动产精准查询'
            //                         },
            //                         interval: 1800
            //                     });
            //                     return
            //                 }
            //             } else {
            //                 $.alert({
            //                     type: 'fail',
            //                     info: {
            //                         fail: '上一条数据未选择不动产精准查询'
            //                     },
            //                     interval: 1800
            //                 });
            //                 return
            //             }
            //
            //         }
            //     }
            //     ;
            // },
            /**
             * @description 点击各个银行并且选中
             * @param item
             * @param index
             * @param event
             * @returns {boolean}
             */
            clickCheckEjYhItem: function (item, index, event) {
                var _this = this;
                var target = event.target;
                if (!item.active) {
                    if (_this.getYxList.length > 19) {
                        // 获取用户点击的x的距离
                        var screenX = event.clientX;
                        // 获取用户点击的Y的距离
                        var screenY = event.clientY;
                        _this.isShowCheckedTip = true;
                        $('.fd-checked-tip').css({
                            'top': screenY + 15,
                            'left': screenX + 3
                        });

                        setTimeout(function () {
                            _this.isShowCheckedTip = false;
                        }, 2000)
                        return false;
                    }
                }
                // 如果选中择去掉选中状态，如果未选中，添加选中状态
                item.active = !item.active;
                // 点击某个银行的值状态为不选中的时候，改变全国银行的全选状态
                if (!item.active) {
                    $.each(_this.activeList, function (aIndex, val) {
                        val.active = false;
                    });
                }
                if (this.ejActiveList) {
                    $.each(this.ejActiveList, function (eIndex, eVal) {
                        if (eVal.id === item.id) { //如果已经被选中了 什么也不做直接return
                            // 如果已经被选中，择取消选中状态
                            eVal.active = item.active;
                        }
                    });
                }
                if (_this.selectedItem.id == "020000000002" && _this.getYxList.length >= _this.maxyxsize) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '已选择数量已达上限'
                        },
                        interval: 1800
                    });
                    return
                }
                // 用来判断数组里面是否含有点击的银行的信息值
                var flag = false;
                // 循环原始数据，改变对应的选中的银行的状态
                $.each(_this.scope.cCxxCloneList, function (cIndex, cVal) {
                    // 匹配当前的选中的左侧的项【账户信息，交易流水，金融理财等】
                    if (cVal.id == _this.selectedItem.id) {
                        $.each(cVal.sjyList, function (sIndex, sVal) {
                            // 匹配
                            if (sVal.name === item.name) {
                                // 改变选中的状态
                                sVal.active = item.active;
                                flag = true;
                            }
                        })
                    }
                })
                $.each(_this.scope.cCxxCloneList, function (cIndex, cVal) {
                    // 匹配当前的选中的左侧的项【账户信息，交易流水，金融理财等】
                    if (cVal.id == _this.selectedItem.id) {
                        // 不含有用户点击的银行的信息值
                        if (!flag) {
                            // 添加当前选中的银行的信息值
                            cVal.sjyList.push(item);
                        }
                    }
                })

                // 点击选择银行，判断已选银行的长度大于1的话，给左侧面板对应的选中的项加图标代表用户已经操作过了
                if (_this.getYxList.length > 0) {
                    $.each(_this.scope.cxxList, function (index, val) {
                        // 循环左侧账户信息、交易流水、金融理财的数据
                        $.each(val.children, function (subIndex, subVal) {
                            if (_this.selectedItem.id === subVal.id) {
                                subVal.edit = true;
                            }
                        })
                    })
                    // 判断已选银行的长度是否等于数据源的长度，等于的话，控制全选按钮选中
                    if (_this.getYxList.length === _this.activeList[0].children.length) {
                        _this.activeList[0].active = true
                    }
                } else if (_this.getYxList.length === 0) {
                    $.each(_this.scope.cxxList, function (index, val) {
                        // 循环左侧账户信息、交易流水、金融理财的数据
                        $.each(val.children, function (subIndex, subVal) {
                            // 如果选中的值是账户信息或者交易流水的值，说明用户清空的是交易流水或者账户信息里面的值
                            if (_this.selectedItem.id === '001001001' || _this.selectedItem.id === '001001002') {
                                // 改变交易流水、账户信息的用户操作标识状态
                                if (subVal.id === '001001002' || subVal.id === '001001001') {
                                    subVal.edit = false;
                                }
                            } else { // 用户选中的是金融理财
                                // 只改变金融理财的用户操作标识的状态
                                if (subVal.id === '001001003') {
                                    subVal.edit = false;
                                }
                            }
                        })
                    })
                }
                flag = false;
                _this.selectedItem.active = true;
            },
            //二级地区或省份选择
            clickCheckEjDqItem: function (item, index, event) {
                $(event.currentTarget).addClass('active').siblings().removeClass('active');
                this.ejActiveList = item.children;
            },
            //三级银行或城市选择
            clickCheckSjItem: function (item, index) {
                var _this = this;
                // 如果选中择去掉选中状态，如果未选中，添加选中状态
                item.active = !item.active;

                /*反选热门城市*/
                if (_this.activeList) {
                    $.each(_this.activeList, function (aIndex, aVal) {
                        if (aVal.id === item.id) {
                            // 如果已经被选中，择取消选中状态
                            aVal.active = item.active;
                        }
                    });
                }
                if (_this.getYxList.length >= _this.maxyxsize) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: '已选择数量已达上限'
                        },
                        interval: 1800
                    });
                    return false
                }
                $.each(_this.scope.cCxxCloneList, function (cIndex, cVal) {
                    if (cVal.id == _this.selectedItem.id) {
                        var flag = true;
                        //如果之前有选中，就遍历当前选中的项是否已经被选中了
                        $.each(cVal.sjyList, function (sIndex, sVal) {
                            if (sVal.id == item.id) { //如果已经被选中了 什么也不做直接return
                                flag = false;
                                // 如果已经被选中，择取消选中状态
                                cVal.sjyList.splice($.inArray(sVal, cVal.sjyList), 1);
                                sVal.active = false;
                            }
                        });
                        /* val.sjyList.push(_data) */
                        if (flag) {
                            cVal.sjyList.push(item)
                        }
                    }
                });
                _this.selectedItem.active = true;
            },
            //删除已选
            clickDeleteYx: function (item, index) {
                var _this = this;
                var flag1 = false;
                var flag2 = false;
                var i1, i2;
                // 去掉选中状态
                item.active = false;
                // 下面列表中对应的去掉选中状态
                $.each(_this.activeList, function (aIndex, val) {
                    val.active = false;
                    $.each(val.children, function (cIndex, cVal) {
                        if (item.name === cVal.name) {
                            cVal.active = false;
                        }
                    });
                });
                $.each(_this.scope.cCxxCloneList, function (sIndex, val) {
                    if (val.id == _this.selectedItem.id) {
                        // 用户选中的是账户信息（即用户删除的是账户信息里面的选中的银行）
                        if (val.id == "001001001") {
                            $.each(_this.scope.cCxxCloneList, function (dIndex, dVal) {
                                // 得到交易流水
                                if (dVal.id == '001001002') {
                                    flag1 = true;
                                    dVal.sjyList = val.sjyList;
                                    // 循环交易流水，改变交易流水里面的对应的银行的状态
                                    $.each(val.sjyList, function (indexS, valS) {
                                        if (valS.name === item.name) {
                                            valS.active = false;
                                        }
                                    })
                                    if (dVal.sjyList.length == 0) {
                                        flag2 = true;
                                        i1 = _this.scope.cCxxCloneList.indexOf(dVal);
                                        i2 = _this.scope.cCxxCloneList.indexOf(val);
                                    }
                                }
                            })
                            // else if 用户选中的是交易流水（即用户删除的是交易流水选中的银行）
                        } else if (val.id == "001001002") {
                            $.each(_this.scope.cCxxCloneList, function (dIndex, dVal) {
                                // 判断账户信息里面的银行的选中的状态
                                if (dVal.id == '001001001') {
                                    flag1 = true;
                                    dVal.sjyList = val.sjyList;
                                    // 循环改变用户当前删除的银行对应账户信息里面的银行的取消选中状态
                                    $.each(val.sjyList, function (indexS, valS) {
                                        if (valS.name === item.name) {
                                            valS.active = false;
                                        }
                                    })
                                    if (dVal.sjyList.length == 0) {
                                        flag2 = true;
                                        i1 = _this.scope.cCxxCloneList.indexOf(dVal);
                                        i2 = _this.scope.cCxxCloneList.indexOf(val);
                                    }
                                }
                            })
                            // else if 用户选中的是金融理财
                        } else if (val.id == "001001003") {
                            flag1 = true;
                            // 循环改变用户当前删除的银行对应金融理财里面的银行的取消选中状态
                            $.each(val.sjyList, function (indexS, valS) {
                                if (valS.name === item.name) {
                                    valS.active = false;
                                }
                            })
                        };
                        var _sjyList = [];
                        $.each(val.sjyList, function (sIndex, sVal) {
                            if (sVal.active) {
                                _sjyList.push(sVal);
                            }
                        });
                        //子项删光之后改变左侧激活状态
                        if (_sjyList.length == 0) {
                            _this.selectedItem.active = false;
                            _this.selectedItem.edit = false;
                            if (val.id == "001001001" || val.id == "001001002") {
                                $.each(_this.scope.cxxList, function (indexC, valC) {
                                    $.each(valC.children, function (indexR, valR) {
                                        if (valR.id == '001001001' || valR.id == '001001002') {
                                            valR.active = false
                                            valR.edit = false
                                        }
                                    })
                                })
                            }
                        }
                    }
                });
            },
            changeDate: function (date, name, index, event, el) {
                var _this = this;
                var sign = true;
                var i;
                $.each(_this.scope.cCxxCloneList, function (sIndex, val) {
                    if (val.id == _this.selectedItem.id) {
                        i = sIndex;
                    }
                    if (val.id == '060000000002') {
                        _this.scope.cCxxCloneList[i].endDate = date;
                    }
                });
                if (name == "startDate") {
                    sign = fdGlobal.dateCompare(date, _this.scope.cCxxCloneList[i].endDate);
                } else {
                    sign = fdGlobal.dateCompare(_this.scope.cCxxCloneList[i].startDate, date);
                }
                if (sign) {
                    _this.$set(_this.scope.cCxxCloneList[i], name, date);
                } else {
                    _this.$set(_this.scope.cCxxCloneList[i], name, '');
                    $('.fd-table-wraper.' + _this.name).find('.fd-input-contain.cxx').eq(_this.index).find('.fd-input-wrap.' + name).find('.fd-date-input').val('')
                }

            },
            /**
             * @description 点击搜索按钮
             * @name clickSearchInput
             * @param event
             */
            clickSearchInput: function (event) {
                $(event.currentTarget).siblings('.fd-searchList-wrap').removeClass('fd-hide');
                var _this = this;
                _this.searchList = [];
                var _data = {
                    name: _this.searchInput,
                    codeType: _this.selectedItem.qyCodeType
                };
                //选择城市的时候，为了避免搜索出两个直辖市，要过滤
                if (_this.selectedItem.id == "020000000002") {
                    _data.notIds = _this.getFilterSearchList
                };
                $.ajax({
                    type: "post",
                    url: _this.serverUrlCxxSearchChild,
                    data: JSON.stringify(_data),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            _this.searchList = data.data;
                            $(event.currentTarget).siblings('.fd-searchList-wrap').removeClass('.fd-hide');
                        }
                        //输出日志
                        /* fdGlobal.consoleLogResponse(config.showLog, _scope.name + '框架页请求数据成功', data) */
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        /* fdGlobal.requestError(data, textStatus, errorThrown); */
                    }
                });
            },
            /**
             * @description 点击搜索下拉选项（点击的时候，会选中所点击的银行信息）
             * @name clickSelectSearch
             * @param event
             */
            clickSelectSearch: function (item, event) {
                var _this = this;
                $(event.currentTarget).parents('.fd-searchList-wrap').addClass('fd-hide');
                $.each(_this.scope.cCxxCloneList, function (cIndex, cVal) {
                    if (cVal.id == _this.selectedItem.id) {
                        // var flag = true;
                        // 就遍历当前搜索的项，并且选中
                        $.each(cVal.sjyList, function (sIndex, sVal) {
                            if (sVal.id == item.id) {
                                sVal.active = true;
                            }
                        });
                        _this.selectedItem.active = true;
                        _this.selectedItem.edit = true;
                    }
                })
                $.each(_this.activeList[0].children, function (cIndex, cVal) {
                    if (cVal.id == item.id) {
                        cVal.active = true;
                    }
                });
                _this.searchInput = item.name;
            }
        },
        computed: {
            getYxList: function () {
                var _this = this;
                var dataList = [];
                var dataSubList = [];
                $.each(_this.scope.cCxxCloneList, function (index, val) {
                    if (val.id == _this.selectedItem.id) {
                        dataList = val.sjyList
                    }
                });
                $.each(dataList, function (index, val) {
                    if (val.active) {
                        dataSubList.push(val);
                    }
                });
                return dataSubList;
            },
            //已选查询项的字符串
            getYxStringList: function () {
                var _this = this;
                var strList = [];
                $.each(_this.scope.cCxxCloneList, function (index, val) {
                    if (val.extend != 2) {
                        strList.push(val.name)
                    } else {
                        if (val.sjyList.length != 0) {
                            var _length = 0;
                            $.each(val.sjyList, function (indexS, valS) {
                                if (valS.active) {
                                    _length++;
                                }
                            });
                            if (_length) {
                                var str;
                                // var len = val.sjyList.length;
                                str = val.name + "(" + _length + ")";
                                strList.push(str)
                            }
                        }
                    }
                });
                // 返回已选查询项的字符串，比如账户信息(20)，交易流水(20)
                return strList.join(',')
            },
            startDate: function () {
                var _this = this;
                var _index;
                $.each(_this.scope.cCxxCloneList, function (index, val) {
                    if (val.nSfxzrq == 1) {
                        if (val.startDate != undefined && val.id == _this.selectedItem.id) {
                            _index = index
                        }
                    }
                })
                return _index == undefined ? null : _this.scope.cCxxCloneList[_index].startDate
            },
            endDate: function () {
                var _this = this;
                var _index;
                $.each(_this.scope.cCxxCloneList, function (index, val) {
                    if (val.nSfxzrq == 1) {
                        if (val.endDate != undefined && val.id == _this.selectedItem.id) {
                            _index = index
                        }
                    }
                })
                return _index == undefined ? null : _this.scope.cCxxCloneList[_index].endDate
            },
            //搜索时要过滤不可选的项
            getFilterSearchList: function () {
                var _this = this;
                var _dataList = [];
                $.each(_this.activeList, function (index, val) {
                    if (val.level == 1) {
                        _dataList.push(val.id)
                    }
                })
                return _dataList
            },
            // 全国银行的全选按钮控制 ---- 是否全选
            //是否全选
            getSeletedAll: function () {
                return function (_index) {
                    var _this = this;
                    var flag = false;
                    $.each(_this.scope.cCxxCloneList, function (index, val) {
                        if (val.id == _this.selectedItem.id) {
                            var listActive = [];
                            $.each(val.sjyList, function (indexS, valS) {
                                if (valS.active) {
                                    listActive.push(valS);
                                }
                            });
                            if (typeof (listActive) != "undefined" && typeof (_this.activeList[_index].children) != "undefined" && listActive.length == _this.activeList[_index].children.length) {
                                flag = true
                            }
                        }
                    })
                    return flag
                }
            }
        },
        filters: {
            dateFormat: function (value) {

                if (value == null || value == "") {
                    return '';
                }
                if (typeof (value) != 'string') {
                    return '';
                }
                //把毫秒替换掉，ie不支持
                var dateStr = value.replace(/\.\d{3}/, "");
                dateStr = dateStr.replace(/-/g, "/");
                var date = new Date(dateStr);

                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            }
        },
        created: function () {
            this.request(this.code, this.zjlx);
        },
        updated: function () {

        },
        mounted: function () {
                console.log(this.tabIndex, '1111111')
            $('.fd-dropdown-menu').on('mousewheel', function (event) {
                event.stopPropagation();
            })
            $(document).click(function (event) {
                $('.fd-searchList-wrap').addClass('fd-hide')
            })
            $('.js-drop-menu').click(function (event) {
                $('.fd-searchList-wrap').addClass('fd-hide')
            })
        }
    });
});
