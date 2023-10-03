/**
 * @version:	 		    2017.05.01
 * @createTime: 	 		2017.06.13
 * @updateTime: 			2017.06.13
 * @author:				    wuwg
 * @moduleName              fd+component   前缀 +名字
 * @description             fdComponent.js ,全局的组件
 ***/

/**
 *    Vue.component(id,[definition])
 *     id=String
 *    definition =function||Object
 */
 
 define('fdComponent',['vue','uiModel'], function (Vue,uiModel) {
	 

	  //  全局组件
    Vue.component('component-pagination', {
         props: {
        //  总页数
		options: {
            required: true,
            type: Object
				}
		},
		template:'<div class="fd-pagination"   v-if="pagination.totalPage>0">' +
				'<div class="fd-info"  v-if="pagination.showPageInfo"  >' +
				'<span>共多少<em  v-text="pagination.totalSize"></em>条数据</span>' +
				'<span>当前显示<em  v-text="pagination.currentSize"></em>条数据</span>' +
				'</div>' +
				'<ul class="fd-operate"  >' +
				'<li class="fd-first"   v-if="!pagination.showPoint"   :class="{ disabled:pagination.currentPage==1}"   v-text="pagination.first"  @click=pagination.gotoPage(1) ></li>' +
				'<li class="fd-prev"    :class="{ disabled:pagination.currentPage==1}"  v-text="pagination.prev"  @click=pagination.gotoPrevPage()></li>' +
				'<li class="fd-page-count"   v-if="pagination.showPoint" :class="{active:pagination.isCurrentPage(1)}"  v-text="1"  @click=pagination.gotoPage(1) ></li>' +
				'<li class="fd-point"   v-if="pagination.showLeftPoint()" >...</li>' +
				'<li class="fd-page-count "   v-if="pagination.showThisPage(item)"    :class="{active:pagination.isCurrentPage(item)}" @click=pagination.gotoPage(item)  v-for="item in  pagination.getInitPages()"      v-text="item"></li>' +
				'<li class="fd-point"  v-if="pagination.showRightPoint()">...</li>' +
				'<li class="fd-page-count"   v-if="pagination.showPoint&&pagination.totalPage!=1" :class="{active:pagination.isCurrentPage(pagination.totalPage)}"  v-text="pagination.totalPage"  @click=pagination.gotoPage(pagination.totalPage) ></li>' +
				'<li class="fd-next"    :class="{ disabled:pagination.currentPage==pagination.totalPage}"   v-text="pagination.next" @click=pagination.gotoNextPage()></li>' +
				'<li class="fd-last"  v-if="!pagination.showPoint"  :class="{ disabled:pagination.currentPage==pagination.totalPage}"   v-text="pagination.last"  @click=pagination.gotoPage(pagination.totalPage)></li>' +
				'</ul>' +
		'</div>',
		watch:{
			options:{
				deep:true,
				  handler:function(newValue,oldValue){	 
					
					for(name  in newValue){
						this.pagination[name]=newValue[name];
						 console.log(this.pagination.getInitPages())
					}	
				}
				
			}
			
		},
		//  私有作用域数据
		data: function () {
			return {
				pagination : new Pagination(this.options)
			};
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
        props:{
            name:{
                type:String,
                required:true
            },
            // 值
            val:{
                type:null,//  null 代表任意类型
                validator:function (value) {
                    return  value+"200";
                    //  return [{key:'',value:''}]
                }
            },
            // 是多选框
            isCheckbox:{
                type:Boolean,//  null 代表任意类型
                default:false
            },
            // 选择全部
            selectAll:{
                type:Boolean,//  null 代表任意类型
                default:false
            },
            //  是否显示清除按钮(默认隐藏)
            showClear:{
                type:Boolean,
                default:false
            },
            //  是否显示错误信息(默认隐藏)
            showError:{
                type:Boolean,
                default:false
            },
            // 是否扩大点击区域
            extendTriggerArea:{
                type:Boolean,
                default:true
            },
            //  是否显示下拉菜单按钮(默认隐藏)
            showDropMenu:{
                type:Boolean,
                default:false
            },
            dataList:{
                // 必传且是数组
                required: true,
                type:Array,  // 多种类型 [String,Number]
                default:[{key:'',value:''}] //，有默认值
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
        } ,
        //  模板
        template: '<div class="fd-component-dropdown" :class="{ extend: scope.showDropMenu }">'+
					' <div class="fd-dropdown-value-box"  :class="{ error: scope.showError }">'+
						'<span class="fd-dropdown-icon"     @click="clickToggleDropMenu()" :class="{ up: scope.showDropMenu }" >下拉图标</span>'+
						'<span class="fd-clear-icon"        @click="clickClear()"    :class="{ hide: !scope.showClear }" >清除</span>'+
						'<input  class="fd-dropdown-value"    v-model="scope.val" />'+
						'<div class="fd-dropdown-value-mask" @click="clickToggleDropMenu()"  :class="{show:extendTriggerArea}"></div>'+
						'</div>'+
						'<div  class="fd-dropdown-menu"  :class="{ hide: !scope.showDropMenu, checkbox:scope.isCheckbox }">' +
						'<dl class="fd-dropdown-checkbox"  v-if="scope.isCheckbox" >'+
							'<dt   @click="clickSelectAll()"   :class="{active:scope.selectAll}" >全部</dt>'+
							'<dd   @click="clickCheckboxItem(item,index)"  v-for="(item,index) in dataList"  :class="{active:item.active}"   v-text="item.value"   ></dd>'+
							'<dd class="fd-dropdown-operate">' +
							'<span class="fd-dropdown-confirm" @click="clickConfirm()">确定</span>' +
							'<span class="fd-dropdown-cancel" @click="clickToggleDropMenu()">取消</span>' +
							'</dd>'+
							'</dl>'+
							'<dl class="fd-dropdown-radio"   v-else :class="{ hide: !scope.showDropMenu }">'+
							'<dt  @click="clickClear()"  >清空</dt>'+
							' <dd  @click="clickItem(item)"  v-for="(item,index) in dataList"   :class="{active:item.value==scope.val}"     v-text="item.value"   ></dd>'+
						'</dl>'+
					'</div>'+
				'</div>',
        //  私有作用域数据
        data: function () {
            return {
                scope:{
                    //  input 中的name属性
                    name:this.name,
                    //  input 中的值
                    val:this.val,
                    // 是否是复选框
                    isCheckbox:this.isCheckbox,
                    // 选择全部
                    selectAll:this.selectAll,
                    // 显示清除按钮
                    showClear:this.showClear,
                    // 显示错误信息
                    showError:this.showError,
                    // 是否扩大点击区域
                    extendTriggerArea:this.extendTriggerArea,
                    // 显示下拉菜单
                    showDropMenu:this.showDropMenu,
                    // 下拉菜单的数据列表
                    dataList:this.dataList
                }
            }
        },
        // 方法
        methods:{
            // 点击下拉框
            clickItem:function(item){
            	
                // 赋值
                this.scope.val=item.value;
                //显示清空按钮
                this.scope.showClear=true;
                // 发送消息到父级
                this.$emit('change',item,this.scope.name);
                //隐藏下拉菜单
                this.scope.showDropMenu=false;
            },
            // 清空值
            clickClear: function () {
                // 清空值
                this.scope.val='';
                //隐藏清空按钮
                this.scope.showClear=false;
                // 发送消息到父级
                this.$emit('change',{},this.scope.name);
                //隐藏下拉菜单
                this.scope.showDropMenu=false;
                if(this.scope.isCheckbox){
                    this.scope.dataList.forEach(function (value,index) {
                        value.active=false;
                    });
                }
            },
            // 点击显示隐藏下拉菜单
            clickToggleDropMenu: function () {
                // 显示隐藏
                this.scope.showDropMenu=!this.scope.showDropMenu;

            },
            // 点击多选框的item
            clickCheckboxItem: function (item,index) {
                // 转变active状态
                item.active=!item.active;
                var _flag=item.active;
                // 更新对象
                this.scope.dataList.splice(index,1,item);
                // 判断是否选择了全部
                if(_flag){
                    for(var i= 0,_len=this.scope.dataList.length;i<_len;i++){
                        if(!this.scope.dataList[i].active){
                            //跳出循环
                            this.scope.selectAll=false;
                            _flag=false;
                            break;
                        }
                    }
                }
                // 设置selectAll的状态
                this.scope.selectAll=_flag;
            },
            // 点击选择全部或者取消全部选择
            clickSelectAll: function () {
                this.scope.selectAll=!this.scope.selectAll;
                var _flag=this.scope.selectAll;
                this.scope.dataList.forEach(function (value,index) {
                    value.active=_flag;
                });
            },
            // 点击确定按钮
            clickConfirm: function () {
                var  _val=[];
                var  _valObj=[];
                this.scope.dataList.forEach(function (value,index) {
                    if(value.active){
                        _val.push(value.value);
                        _valObj.push(value);
                    }
                });
                // 清空值
                this.scope.val=_val.join(',');
                //隐藏或者隐藏清空按钮
                this.scope.showClear=this.scope.val;
                // 发送消息到父级
                this.$emit('change',_valObj,this.scope.name,this.scope.selectAll);
                //隐藏下拉菜单
                this.scope.showDropMenu=false;
            }
        },
        // 计算属性
        computed:{

        }
	});
	 
	 
	 
 });
   
