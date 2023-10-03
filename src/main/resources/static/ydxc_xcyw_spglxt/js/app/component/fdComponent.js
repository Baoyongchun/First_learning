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
 
 define('fdComponent',['vue','uiModel','datetimepicker','layDate','Pagination'], function (Vue,uiModel,datetimepicker,layDate,Pagination) {
	//全局组件 多选框
	Vue.component('component-checkbox',{
        props: ['data','dataList','list'],
        data: function(){
         	return {
         		MrList:''
         	}
        },
        template:"<div class='fd-component-checkbox'>"+
        "<span class='fd-checkbox-clickAll' @click='clickSelectAll'>全选</span>"+
        "<ul class='fd-checkbox-item'>"+
        "<li @click='clickCheckbox' v-for='item in dataList'>{{item.name}}</li>"+
        "</ul>"+
        "</div>",
        methods: {
            clickCheckbox: function (event) {            	
             	if($(event.target).attr('data-bol')==undefined||$(event.target).attr('data-bol')=='true'){
             		$(event.target).addClass('fd-checkbox-select');
             		$(event.target).attr('data-bol','false');
             	}else{
             		$(event.target).removeClass('fd-checkbox-select');
             		$(event.target).attr('data-bol','true');
             	}
             	$(event.target).parent().find('.fd-checkbox-select').each(function(ele,index){
             		
             	});
             },
             //全选
            clickSelectAll:function(event) {
             	$(event.target).parent().find('li').addClass('fd-checkbox-select');
             	$(event.target).parent().find('li').attr('data-bol','false');
            }
        },
        mounted: function(){
         	var _this=this;
         	if(_this.list){
         		_this.MrList=_this.list;
         	}    
     		$(_this.$el).find('li').each(function(index,ele){
     			for(var i=0;i<_this.MrList.length;i++){
	         		if($(ele).text()==_this.MrList[i]){
	         			$(ele).addClass('fd-checkbox-select');
             			$(ele).attr('data-bol','false');
	         		}
         		}
         	});
        }
     });
      //全局组件 单选框 带可输入的金额
     Vue.component('component-radio-input',{
         props: {
         	
         },
         template:"<div class='fd-ajxx-radio'>"+
         "<a href='javascript:void(0);' class='current' @click='clickRadio'>否</a>"+
         "<a href='javascript:void(0);' @click='clickRadio'>是</a>"+
         "<span class='fd-radio-input fd-radio-input-select'><input type='text' readonly='true'>元</span>"+
         "</div>",
         methods: {
             clickRadio: function (event) {
                 $(event.target).addClass('current').siblings().removeClass('current');
                 var $input=$(event.target).parent().find('.fd-radio-input');
                 if($(event.target).parent().find('a:nth-child(2)').hasClass('current')){
                     $input.removeClass('fd-radio-input-select');
                     $input.find('input').attr('readonly',false);
                     $input.find('input').attr('placeholder','抵押登记金额');
                 }else{
                     $input.addClass('fd-radio-input-select');
                     $input.find('input').val('');
                     $input.find('input').attr('readonly',true);
                     $input.find('input').attr('placeholder','');
                 }
             }
         }
     });
     //全局组件 单选框
     Vue.component('component-radio',{
         props: {
         	data:{
         		type:Array,
         		require:true
         	},
         	val:{
         		type:String,
         		default:''
         	}
         },
         template:"<div class='fd-ajxx-radio'>"+
         "<a href='javascript:void(0);' v-for='(item,index) in data' :class='{current:val==item.name}' @click='clickRadio'>{{item.name}}</a>"+
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
             request:{
                 required: true,
                 type: Function
             }
         },
         template:'<div class="fd-pagination"   v-if="pagination.totalPage>0">' +
         '<div class="fd-info"  v-if="pagination.showPageInfo"  >' +
         '<span>本页显示：<em  v-text="(pagination.currentPage-1)*pagination.currentSize+1"></em>-<em  v-text="pagination.currentPage*pagination.currentSize>pagination.totalSize?pagination.totalSize:pagination.currentPage*pagination.currentSize"></em></span>' +

         '<span>总记录数：<em  v-text="pagination.totalSize"></em></span>' +
         '</div>' +
         '<ul class="fd-operate"  >' +
         '<li class="fd-first"   v-if="!pagination.showPoint"   :class="{ disabled:pagination.currentPage==1}"   v-text="pagination.first"  @click=pagination.gotoPage(1) ></li>' +
         '<li class="fd-prev"    :class="{ disabled:pagination.currentPage==1}"    @click=pagination.gotoPrevPage()>上一页</li>' +
         '<li class="fd-page-count"   v-if="pagination.showPoint" :class="{active:pagination.isCurrentPage(1)}"  v-text="1"  @click=pagination.gotoPage(1) ></li>' +
         '<li class="fd-point"   v-if="pagination.showLeftPoint()" >...</li>' +
         '<li class="fd-page-count "   v-if="pagination.showThisPage(item)"    :class="{active:pagination.isCurrentPage(item)}" @click=pagination.gotoPage(item)  v-for="item in  pagination.getInitPages()"      v-text="item"></li>' +
         '<li class="fd-point"  v-if="pagination.showRightPoint()">...</li>' +
         '<li class="fd-page-count"   v-if="pagination.showPoint" :class="{active:pagination.isCurrentPage(pagination.totalPage)}"  v-text="pagination.totalPage"  @click=pagination.gotoPage(pagination.totalPage) ></li>' +
         '<li class="fd-next"    :class="{ disabled:pagination.currentPage==pagination.totalPage}" @click=pagination.gotoNextPage()>下一页</li>' +
         '<li class="fd-last"  v-if="!pagination.showPoint"  :class="{ disabled:pagination.currentPage==pagination.totalPage}"   v-text="pagination.last"  @click=pagination.gotoPage(pagination.totalPage)></li>' +
         '</ul>' +
        //  '<div class="fd-jump">第&nbsp&nbsp<input type="text" v-model="pagination.jumpPage" onkeyup="this.value=this.value.match(/^[1-9]{1}[0-9]*$/)" @keyup.enter=pagination.gotoPage(pagination.jumpPage)>' +
        //  '</div>'+
         '</div>',
         //  私有作用域数据
         data: function () {
             return {
                 pagination : new Pagination(this.options,this.request)
             };
         },
         watch:{
             //当重新查询数据时，要更新分页
             "options.totalSize":function(){
                 this.pagination= new Pagination(this.options,this.request)
             }
         },
         update:function(){

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
            allName:{
            	type:String,
            	default:'全部'
            },
            index:{
            	type:null,
            	default:''
            },
            ygDlr:{
            	type:String,
            	default:''
            },
	        id:{
	        	type:String,
	        	default:''
	        },
	        lx:{
	        	type:String,
	        	default:''
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
        template: '<div class="fd-component-dropdown" :class="{ extend: scope.showDropMenu,disabled:isDisabledDrop(scope.dataList)  }">'+
					' <div class="fd-dropdown-value-box js-dropdown-checkbox"  :class="{ error: scope.showError }">'+
						'<span class="fd-dropdown-icon"     :class="{ up: scope.showDropMenu,disabled:dropDownSelect(scope.dataList)}" >下拉图标</span>'+
						'<span class="fd-clear-icon"        @click="clickClear()"    :class="{ hide: !scope.showClear }" >清除</span>'+
						'<input  class="fd-dropdown-value"    v-model="scope.val" :class="{disabled:dropDownSelect(scope.dataList)}"/>'+
						'<div class="fd-dropdown-value-mask"  :class="{show:extendTriggerArea,disabled:dropDownSelect(scope.dataList)}"></div>'+
						'</div>'+
						'<div  class="fd-dropdown-menu js-dropdown-menu hide"  :class="{ checkbox:scope.isCheckbox }">' +
						'<dl class="fd-dropdown-checkbox"  v-if="scope.isCheckbox" >'+
							'<dt   @click="clickSelectAll()"  v-show="false"  :class="{active:scope.selectAll}" >{{scope.allName}}</dt>'+
							'<dd   @click="clickCheckboxItem(item,index,$event)" v-if="item.name"'+ 
							'v-for="(item,index) in scope.dataList"  :class="{active: item.active,disabled:isDisabled(item,index)}"  class="fd-dropdown-text">'+
							 '<span  v-text="item.name"></span>'+
							 '<span class="fd-sf"  v-text="getLx(item.lx)"></span>'+
							'</dd>'+
							'<dd class="fd-dropdown-operate right-btn">' +
							'<p class="fd-tips">最多添加两个委托代理人</p>'+
							'<span class="fd-dropdown-confirm" @click="clickConfirm($event)">确定</span>' +
							'<span class="fd-dropdown-cancel" @click="clickToggleDropMenu($event)">取消</span>' +
							'</dd>'+
						'</dl>'+
					'</div>'+
				'</div>',
        //  私有作用域数据
        data: function () {   
            return {
                scope:{
                    //  input 中的name属性
                    name:this.name,
                    //改变之前的值
                    oldVal:'',
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
                    dataList:this.dataList,
                    allName:this.allName,
                    index:this.index,
                    ygDlr:this.ygDlr,
                    id:this.id,
                    lx:this.lx
                }
            }
        },
        watch:{
        	// 下拉的数据咧白哦
        	dataList:{
                deep:true,
                handler:function(newValue,oldValue){  
                	var  _this=this;
                	_this.scope.dataList=JSON.parse(JSON.stringify(_this.dataList));   
                	// 设置下拉菜单选项
                	this.setDropMenu();
                	 // 设置状态
                	this.setStatus();
                 } 
            },
            // 类型
            lx:{         	
            	deep:true,
                handler:function(newValue,oldValue){  
                	// 设置下拉菜单选项
                	this.setDropMenu();
                	 // 设置状态
                	this.setStatus();  
                }
            }
        },
        // 方法
        methods:{
        	// 设置下拉菜单选项
        	setDropMenu:function(){
        		var  _this=this;
//            	$.each(_this.scope.dataList,function(index,value){
//        			if(_this.lx!=='' &&_this.lx=='委托代理' ){
//        				if(value.wtDlrCount==2  &&  $.inArray(_this.id,value.wtDlrId)==-1  ){
//        				     _this.scope.dataList.splice(index,1);
//        				}
//        			}	
//        		});	
            	_this.scope.dataList=_this.scope.dataList.filter(function(ele,index){
            		if(_this.lx!=='' &&(_this.lx=='委托代理'||_this.lx=='委托代理人') ){
        				if(ele.wtDlrCount==2  &&  $.inArray(_this.id,ele.wtDlrId)==-1  ){
        				     return false;
        				}else{
        					return true;
        				}
        			}else{
        				return true;
        			}
            	});
        	},
        	//  设置状态
        	setStatus:function(){
        		  var _this=this;
        		  var _valArray=this.val.split(';');
            	  var  _flag=true;        
            	  $.each(this.scope.dataList,function(index,value){  
            		  if(value.name!==''){
            			  var  _searchIndex=$.inArray(value.name,_valArray);
                		  if(_searchIndex!=-1  ){
                			  value.active=true;
                		  }else {
                			  value.active=false;
                			  _flag=false;
                		  }  
            		  }else {
            			  value.active=false;
            			  _flag=false;
            		  }
            		
            	  });
                  // 设置selectAll的状态
                  this.scope.selectAll=_flag;  
                  this.scope.val=this.val;
                  this.scope.id=this.id;   
                  this.scope.index=this.index; 
        	},
        	isDisabled:function(item,index){
        		var  _this=this;
        		var _flag=false;
        		var _wtDlr=[];
        		// 如果该数据类型是 "委托代理人"，并且没有被激活，
        		// 那么需要判断已经选中的 委托代理人个数，
        		// 如果已经等于2，那么就不能再选了
        		if(item.lx!='法定代理'||item.lx!='法定代理人'){
        			if(!item.active){
        				var  _count=0;
            			// 循环当前的数据列表
            			 $.each(_this.scope.dataList,function(index,value){  
            				 	//   如果是 委托代理人 而且是激活的
    	               		 	if(value.lx!='法定代理'||value.lx!='法定代理人'){
    	               		 		if(value.active){
    	               		 			_count++;
    	               		 			if(_count>2){
    	               		 				_count=2;
    	               		 			}
    	               		 		}
	    	               		 	if(_count==2){
	               		 				// 改变值为false
		               		 			_flag=true;               		 		
	               		 			}
    	               		 	}
    	               	  });	
        			}			
        		}
        		return  _flag;
        	},
        	////当事人或者代理人的姓名全为空或者长度为0  让其选不中
        	isDisabledDrop:function(list){
        		var count=0;
        		$.each(list,function(index,value){
        			if(value.name==''){
        				count++;
        			}
        		});
        		if(count==list.length){
        			return true;
        		}
        		return false;
        	},
        	//获取代理人类型
        	getLx:function(lx){
        
        		return  (lx=='法定代理'||lx=='法定代理人')?'法定代理人':'委托代理人';
        	},
            // 点击下拉框
            clickItem:function(item){
                // 赋值
                this.val=item.value;
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
                this.val='';
                //隐藏清空按钮
                this.scope.showClear=false;
                // 发送消息到父级
                this.$emit('change',{},this.name);
                //隐藏下拉菜单
                this.scope.showDropMenu=false;
                if(this.scope.isCheckbox){
                    this.dataList.forEach(function (value,index) {
                        value.active=false;
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
            clickCheckboxItem: function (item,index,event) {
            	if(!$(event.currentTarget).hasClass('disabled')){
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
            	}    
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
            clickConfirm: function (event) {
                var  _val=[];
                var  _valObj=[];
                this.scope.dataList.forEach(function (value,index) {
                    if(value.active){
                        _val.push(value.name);
                        _valObj.push(value);
                    }
                });
                // 清空值
                this.scope.val=_val.join('；');
                //隐藏或者隐藏清空按钮
                this.scope.showClear=this.val;

                // 发送消息到父级
                this.$emit('change',_valObj, this.scope.name,this.scope.index,this.scope.id);
                //隐藏下拉菜单
                this.scope.showDropMenu=false;
                
              //点击取消时隐藏下拉框
            	$(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
            },
            //下拉框是否可以点击下拉
            dropDownSelect:function(list){
            	if(list.length==0){
            		return true;
            	}else{
            		return false;
            	}
            	
            }
        },
        // 计算属性
        computed:{

        },
        mounted:function(){	
        	// 设置状态
      	   this.setStatus();
      	//点击下拉框中的内容的时候组织冒泡事件
			$('.js-dropdown-menu').on('click',function(e){
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
            allName:{
            	type:String,
            	default:'全部'
            },
            index:{
            	type:null,
            	default:''
            },
            ygDlr:{
            	type:String,
            	default:''
            },
	        id:{
	        	type:String,
	        	default:''
	        },
	        lx:{
	        	type:String,
	        	default:''
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
        template: '<div class="fd-component-dropdown" :class="{ extend: scope.showDropMenu,disabled:isDisabledDrop(scope.dataList) }">'+
					' <div class="fd-dropdown-value-box js-dropdown-checkbox"  :class="{ error: scope.showError }">'+
						'<span class="fd-dropdown-icon"    :class="{ up: scope.showDropMenu,disabled:dropDownSelect(scope.dataList)}" >下拉图标</span>'+
						'<span class="fd-clear-icon"        @click="clickClear()"    :class="{ hide: !scope.showClear }" >清除</span>'+
						'<input  class="fd-dropdown-value"    v-model="scope.val" :class="{disabled:dropDownSelect(scope.dataList)}"/>'+
						'<div class="fd-dropdown-value-mask"   :class="{show:extendTriggerArea,disabled:dropDownSelect(scope.dataList)}"></div>'+
						'</div>'+
						'<div  class="fd-dropdown-menu js-dropdown-menu hide"  :class="{ checkbox:scope.isCheckbox }">' +
						'<dl class="fd-dropdown-checkbox"  v-if="scope.isCheckbox" >'+
							'<dt   @click="clickSelectAll()"   :class="{active:scope.selectAll}" v-if="checkAllBol(scope.dataList)">{{scope.allName}}</dt>'+
							'<dd   @click="clickCheckboxItem(item,index)"  v-for="(item,index) in scope.dataList"  v-if="item.name" :class="{active: item.active}"  class="fd-dropdown-text">{{item.name}}</dd>'+
							'<dd class="fd-dropdown-operate right-btn">' +
							'<span class="fd-dropdown-confirm" @click="clickConfirm($event)">确定</span>' +
							'<span class="fd-dropdown-cancel" @click="clickToggleDropMenu($event)">取消</span>' +
							'</dd>'+
							'</dl>'+
							'<dl class="fd-dropdown-radio"   v-else :class="{ hide: !scope.showDropMenu }">'+
							'<dt  @click="clickClear()"  >清空</dt>'+
							' <dd  @click="clickItem(item)"  v-for="(item,index) in dataList"   :class="{active:item.name==scope.val}"     v-text="item.name"   ></dd>'+
						'</dl>'+
					'</div>'+
				'</div>',
        //  私有作用域数据
        data: function () {   
            return {
                scope:{
                    //  input 中的name属性
                    name:this.name,
                    //改变之前的值
                    oldVal:'',
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
                    dataList:this.dataList,
                    allName:this.allName,
                    index:this.index,
                    ygDlr:this.ygDlr,
                    id:this.id,
                    lx:this.lx
                }
            }
        },
        watch:{
        	// 监听值发生变化
         	val:{
         		deep:true,
                 handler: function(newValue,oldValue){
                     this.scope.val=JSON.parse(JSON.stringify(this.val));
                 }	
         	},
        	// 下拉的数据咧白哦
        	dataList:{
        		deep:true,
                handler:function(newValue,oldValue){  
                	var  _this=this;
                	_this.scope.dataList=JSON.parse(JSON.stringify(_this.dataList));   
                	// 设置下拉菜单选项
                	this.setDropMenu();
                	 // 设置状态
                	this.setStatus();
                 } 
            },
            // 类型
            lx:{         	
            	deep:true,
                handler:function(newValue,oldValue){  
                	var  _this=this;
                	_this.scope.dataList=JSON.parse(JSON.stringify(_this.dataList));   
                	// 设置下拉菜单选项
                	this.setDropMenu();
                	 // 设置状态
                	this.setStatus(); 
                }
            }
        },
        // 方法
        methods:{
        	// 设置下拉菜单选项
        	setDropMenu:function(){
        		var  _this=this;
//            	$.each(_this.scope.dataList,function(index,value){
//        			if(_this.lx!=='' &&_this.lx=='委托代理' ){
//        				if(value.wtDlrCount==2  &&  $.inArray(_this.id,value.wtDlrId)==-1  ){
//        				     _this.scope.dataList.splice(index,1);
//        				}
//        			}	
//        		});
        		_this.scope.dataList=_this.scope.dataList.filter(function(ele,index){
            		if(_this.lx!=='' &&(_this.lx=='委托代理'||_this.lx=='委托代理人') ){
        				if(ele.wtDlrCount==2  &&  $.inArray(_this.id,ele.wtDlrId)==-1  ){
        				     return false;
        				}else{
        					return true;
        				}
        			}else{
        				return true;
        			}
            	});
        	},
        	//  设置状态
        	setStatus:function(){
        		  var _this=this;
        		  var _valArray=_this.scope.val.split(';');
        		  var  _flag=true;
            	  $.each(_this.scope.dataList,function(index,value){
            		  if(value.name!==''){
            			  var  _searchIndex=$.inArray(value.name,_valArray);
                		  if(_searchIndex!=-1  ){
                			  value.active=true;
                		  }else {
                			  value.active=false;
                			  _flag=false;
                		  }  
            		  }
            		
            	  });
            	  // 设置selectAll的状态
                  this.scope.selectAll=_flag;                  
                  this.scope.val=this.val;
                  this.scope.id=this.id;   
                  this.scope.index=this.index; 
        	},
            // 点击下拉框
            clickItem:function(item){
                // 赋值
                this.val=item.value;
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
                this.val='';
                //隐藏清空按钮
                this.scope.showClear=false;
                // 发送消息到父级
                this.$emit('change',{},this.name);
                //隐藏下拉菜单
                this.scope.showDropMenu=false;
                if(this.scope.isCheckbox){
                    this.dataList.forEach(function (value,index) {
                        value.active=false;
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
                        _val.push(value.name);
                        _valObj.push(value);
                    }
                });
                // 清空值
                this.scope.val=_val.join('；');
                //隐藏或者隐藏清空按钮
                this.scope.showClear=this.val;

                // 发送消息到父级
                this.$emit('change',_valObj, this.scope.name,this.scope.index,this.scope.id);
                //隐藏下拉菜单
                this.scope.showDropMenu=false;
                
              //点击取消时隐藏下拉框
            	$(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
            },
            checkAllBol:function(list){
            	if(list.length==0||(list.length==1&&list[0].name=='')){
            		return false;
            	}else{
            		return true;
            	}
            },
          //下拉框是否可以点击下拉
            dropDownSelect:function(list){
            	if(list.length==0){
            		return true;
            	}else{
            		return false;
            	}
            	
            },
            ////当事人或者代理人的姓名全为空或者长度为0  让其选不中
        	isDisabledDrop:function(list){
        		var count=0;
        		$.each(list,function(index,value){
        			if(value.name==''){
        				count++;
        			}
        		});
        		if(count==list.length){
        			return true;
        		}
        		return false;
        	},
        },
        // 计算属性
        computed:{

        },
        mounted:function(){	
        	// 设置状态
      	   this.setStatus();
      	//点击下拉框中的内容的时候组织冒泡事件
			$('.js-dropdown-menu').on('click',function(event){
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
         props:{
             name:{
                 type:String,
                 required:true
             },
             // 循环中用到
             index:{
                 type: null,//  null 代表任意类型,
                 default: ''
             },
             kbslindex:{
                 type: null,//  null 代表任意类型,
             	 default: ''
             },
             // 值
             val:{
                 type:null,//  null 代表任意类型
                 validator:function (value) {
                     return  value+"200";
                     //  return [{key:'',value:''}]
                 }
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
             date:{
            	 type:String,
            	 default:''
             },
             id:{
            	 type:String,
            	 default:''
             },
             bol:{
            	 type:null
             },
             bgsf:{
            	 type:String,
             	 default:''
             },
             bgxm:{
            	 type:String,
            	 default:''
             }
         } ,
         //  模板
         template: '<div class="fd-component-simple-dropdown js-drop-menu-contain">'+
                     '<div class="fd-dropdown-value-box js-drop-menu-trigger" >'+
                        '<div class="fd-dropdown-value"  v-text="scope.val" :title="scope.val"></div>'+
                        '<div class="fd-clear-icon   js-fd-clear-icon"  :class="{show:getVal}"  @click="clickClear()" ></div>'+
                     '</div>'+
                     '<div class="fd-dropdown-menu fd-hide js-drop-menu">'+
                        '<dl class="fd-dropdown-radio">'+
                            '<dd  class="js-drop-item" v-for="item in scope.dataList"  :class="{active:item.name==scope.val}"   v-text="item.name" @click="clickItem(item)" :title="item.name">1</dd>'+
                     '</dl>'+
                     '</div>'+
                 '</div>',
         //  私有作用域数据
         data: function () {
             return {
                 scope:{
                 	  index:this.index,
                     //  input 中的name属性
                     name:this.name,
                     //  input 中的值
                     val:this.val,
                     // 显示错误信息
                     showError:this.showError,
                     // 下拉菜单的数据列表
                     dataList:this.dataList,
                     // 数据长度
                     len:this.len
                 }
             }
         },
         // 监听值的变化
         watch:{
         	// 监听值发生变化
         	val:{
         		deep:true,
                 handler: function(newValue,oldValue){
                     if(newValue!==oldValue && newValue!==this.scope.val ){
                         this.scope.val=newValue;
                     }
                 }	
         	},
         	// 监听数据长度
         	len:{
         		deep:true,
                 handler: function(newValue,oldValue){
                     if(newValue!==oldValue && newValue!==this.scope.dataList.length ){
                         this.scope.dataList=this.dataList;
                     }
                 }
         		
         	},
         // 下拉的数据咧白哦
        	dataList:{
                deep:true,
                handler:function(newValue,oldValue){  
                	var  _this=this;
                	_this.scope.dataList=JSON.parse(JSON.stringify(_this.dataList));  
                 } 
            },
           /*  val: function (newValue,oldValue) {
             	
                 if(newValue!=this.scope.val){
                     this.scope.val=typeof (newValue)=='undefined'?'':newValue;
                 }
             }*/
         },
         // 方法
         methods:{
             // 点击下拉框
             clickItem:function(item){
                 // 赋值
                 this.scope.val=item.name;
                 // 发送消息到父级
                 this.$emit('change',item,this.scope.name,this.index,this.kbslindex,this.date,this.id,this.bol,this.bgsf,this.bgxm);
             },
             // 清空值
             clickClear: function () {
                 // 清空值
                 this.scope.val='';
                 // 发送消息到父级
                 this.$emit('change',{},this.scope.name,this.index,this.kbslindex,this.date,this.id,this.bol,this.bgsf,this.bgxm);
             }
         },
         // 计算属性
         computed:{
             //  根据值判断是否显示×
             getVal:function(){
                 return  this.scope.val!==''?true:false;
             }
         },
         mounted: function() {
         	$('.fd-dropdown-menu').on('mousewheel',function(event) {
         		event.stopPropagation();
         	})
         }
     });
    //转换为中文
     ;(function($){
         $.fn.datetimepicker.dates['zh-CN'] = {
             days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
             daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
             daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
             months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
             monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
             today: "今天",
             suffix: [],
             meridiem: ["上午", "下午"]
         };
     }(jQuery));
     
     var Hub=new Vue();
    //  日期控件
     /*Vue.component('datetime-picker', {
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
         template: '<div class="fd-controls" :class="{date: hasComponent}">'
         + '<input class="fd-date-input" readonly :value="scope.date"> <span class="fd-clear-icon " :class={show:scope.date} @click="clickClear($event)"></span>'
         + '<span class="fd-add-on" v-if="hasComponent"><i class="fd-icon-remove"></i></span>'
         +'<span class="fd-add-on" v-if="hasComponent"><i class="fd-icon-th"></i></span>'
         +'</div>',
         
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
             name:{
                 type: String,
                 default: ''
             },
             // 循环中用到
             index:{
                 type: null,//  null 代表任意类型,
                 default: ''
             },
             _index:{
                 type: null,//  null 代表任意类型,
                 default: ''
             },
             idx:{
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
             mc:{
                 type:String,
                 default:''
             },
             isShow:{
            	 type: Boolean,
             	 default: true
             }
         },
         data: function () {
        	 
           return  {
               scope:{
                   date:this.date
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
             }
         },
         methods: {
             clickClear: function (event) {
                 if(!$(event.target).parents('.fd-edit').hasClass('disabled')){
                	 var _this = this;
                     var dateValue = _this.scope.date='';
                     //如果是input元素直接绑定日历控件，则直接获取input的值，如果是父级，则获取子集input的值
                     _this.input.val('');
                     // 激活事件
                     _this.$emit('change', dateValue,_this.name,_this.index,_this.id,_this.mc);

                     if (_this.onChange) {
                         _this.onChange(e);  //触发回调函数
                     }
                 }
             },
             changeDate: function () {
                 var _this = this;
                 var dateValue =  _this.input.val();
                 _this.$emit('change', dateValue,_this.name,_this.index,_this.id,_this.mc);
                 if (_this.onChange) {
                     _this.onChange(e);  //触发回调函数
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
             if(_this.isShow){
            	//获取日历控件元素，如果有组件就是对应的div上添加日历控件，如果没有组件就在对应的input元素上添加
            	 _this.$datetimepickerEle = _this.hasComponent ? $(_this.$el) : $(_this.$el).find('input');
                 // 如果是input元素直接绑定日历控件，则直接获取input的值，如果是父级，则获取子集input的值
                 _this.input=_this.$datetimepickerEle.is('input')?_this.$datetimepickerEle:_this.$datetimepickerEle.find('input');
                 //创建日期控件
                 _this.$datetimepickerEle.datetimepicker(this.datepickerOptions).on('changeDate', function (e) {
                	 _this.changeDate();
                 }).on('show', function(event){
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
             allName:{
             	type:String,
             	default:'全部'
             },
             index:{
             	type:null,
             	default:''
             },
 	        id:{
 	        	type:String,
 	        	default:''
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
         template: '<div class="fd-component-dropdown" :class="{ extend: scope.showDropMenu,disabled:isDisabledDrop(scope.dataList) }">'+
 					' <div class="fd-dropdown-value-box js-dropdown-checkbox"  :class="{ error: scope.showError }">'+
 						'<span class="fd-dropdown-icon"    :class="{ up: scope.showDropMenu,disabled:dropDownSelect(scope.dataList)}" >下拉图标</span>'+
 						'<span class="fd-clear-icon"        @click="clickClear()"    :class="{ hide: !scope.showClear }" >清除</span>'+
 						'<input  class="fd-dropdown-value"    v-model="scope.val" :class="{disabled:dropDownSelect(scope.dataList)}"/>'+
 						'<div class="fd-dropdown-value-mask"   :class="{show:extendTriggerArea,disabled:dropDownSelect(scope.dataList)}"></div>'+
 						'</div>'+
 						'<div  class="fd-dropdown-menu js-dropdown-menu hide"  :class="{ checkbox:scope.isCheckbox }">' +
 						'<dl class="fd-dropdown-checkbox"  v-if="scope.isCheckbox" >'+
 							'<dt   @click="clickSelectAll()"   :class="{active:scope.selectAll}" v-if="checkAllBol(scope.dataList)">{{scope.allName}}</dt>'+
 							'<dd   @click="clickCheckboxItem(item,index)"  v-for="(item,index) in scope.dataList"  v-if="item.name" :class="{active: item.active}"  class="fd-dropdown-text">{{item.name}}</dd>'+
 							'<dd class="fd-dropdown-operate right-btn">' +
 							'<span class="fd-dropdown-confirm" @click="clickConfirm($event)">确定</span>' +
 							'<span class="fd-dropdown-cancel" @click="clickToggleDropMenu($event)">取消</span>' +
 							'</dd>'+
 							'</dl>'+
 							'<dl class="fd-dropdown-radio"   v-else :class="{ hide: !scope.showDropMenu }">'+
 							'<dt  @click="clickClear()"  >清空</dt>'+
 							' <dd  @click="clickItem(item)"  v-for="(item,index) in dataList"   :class="{active:item.name==scope.val}"     v-text="item.name"   ></dd>'+
 						'</dl>'+
 					'</div>'+
 				'</div>',
         //  私有作用域数据
         data: function () {   
             return {
                 scope:{
                     //  input 中的name属性
                     name:this.name,
                     //改变之前的值
                     oldVal:'',
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
                     dataList:this.dataList,
                     allName:this.allName,
                     index:this.index,
                     id:this.id
                 }
             }
         },
         watch:{
         	// 下拉的数据咧白哦
         	dataList:{
         		deep:true,
                 handler:function(newValue,oldValue){  
                 	var  _this=this;
                 	_this.scope.dataList=JSON.parse(JSON.stringify(_this.dataList));   
                 	 // 设置状态
                 	this.setStatus();
                  } 
             },
             //监测value值的变化并更新到组件中
             val:{
             	deep:true,
             	handler:function(newValue,oldValue){
             		var  _this=this;
             		_this.scope.val = _this.val;
             		// 设置状态
                 	this.setStatus();
             	}
             }
         },
         // 方法
         methods:{
         	//  设置状态
         	setStatus:function(){
         		  var _this=this;
         		 //TODO
         		  if(_this.scope.val!=undefined){
         			 var _valArray=_this.scope.val.split(';');
         		  }else{
         			 var _valArray=_this.scope.val;
         		  }
         		  var  _flag=true;
             	  $.each(_this.scope.dataList,function(index,value){
             		  if(value.name!==''){
             			  var  _searchIndex=$.inArray(value.name,_valArray);
                 		  if(_searchIndex!=-1  ){
                 			  //value.active=true;
                 		  	  _this.$set(_this.scope.dataList[index],"active",true);
                 		  }else {
                 			  //value.active=false;
                 		  	_this.$set(_this.scope.dataList[index],"active",false);
                 			  _flag=false;
                 		  }  
             		  }
             		
             	  });
             	  // 设置selectAll的状态
                   this.scope.selectAll=_flag;                  
                   this.scope.val=this.val;
                   this.scope.id=this.id;   
                   this.scope.index=this.index; 
         	},
             // 点击下拉框
             clickItem:function(item){
                 // 赋值
                 this.val=item.value;
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
                 this.val='';
                 //隐藏清空按钮
                 this.scope.showClear=false;
                 // 发送消息到父级
                 this.$emit('change',{},this.name);
                 //隐藏下拉菜单
                 this.scope.showDropMenu=false;
                 if(this.scope.isCheckbox){
                     this.dataList.forEach(function (value,index) {
                         value.active=false;
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
             clickConfirm: function (event) {
                 var  _val=[];
                 var  _valObj=[];
                 this.scope.dataList.forEach(function (value,index) {
                     if(value.active){
                         _val.push(value.name);
                         _valObj.push(value);
                     }
                 });
                 // 清空值
                 this.scope.val=_val.join(';');
                 //隐藏或者隐藏清空按钮
                 this.scope.showClear=this.val;

                 // 发送消息到父级
                 this.$emit('change',_valObj, this.scope.name,this.scope.index,this.scope.id);
                 //隐藏下拉菜单
                 this.scope.showDropMenu=false;
                 
               //点击取消时隐藏下拉框
             	$(event.currentTarget).parents('.js-dropdown-menu').addClass('hide');
             },
             checkAllBol:function(list){
             	/*if(list.length==0||(list.length==1&&list[0].name=='')){
             		return false;
             	}else{
             		return true;
             	}*/
             	return false;
             },
           //下拉框是否可以点击下拉
             dropDownSelect:function(list){
             	if(list.length==0){
             		return true;
             	}else{
             		return false;
             	}
             	
             },
             ////当事人或者代理人的姓名全为空或者长度为0  让其选不中
         	isDisabledDrop:function(list){
         		var count=0;
         		$.each(list,function(index,value){
         			if(value.name==''){
         				count++;
         			}
         		});
         		if(count==list.length){
         			return true;
         		}
         		return false;
         	},
         },
         // 计算属性
         computed:{

         },
         mounted:function(){	
         	// 设置状态
       	   this.setStatus();
       	//点击下拉框中的内容的时候组织冒泡事件
 			$('.js-dropdown-menu').on('click',function(event){
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
              props:{
                  value:{
                      type:null,
                      required:''
                  },
                  valueType:{
                      type:String,
                      required:'c'
  				  },
  				  placeholder: {
  					type: String,
  					default:''
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
                  }
              } ,
              //  模板
              template: '<div class="fd-component-simple-dropdown js-drop-menu-contain">'+
              '<div class="fd-dropdown-value-box js-drop-menu-trigger" >'+
              '<input class="fd-dropdown-value"  :value="scope.currentVal" :title="scope.currentVal" unselectable="on" readonly :placeholder="scope.placeholder">'+
              '<div class="fd-clear-icon   js-fd-clear-icon"  :class="{show:getVal}"  @click="clickClear($event)" ></div>'+
              '</div>'+
              '<div class="fd-dropdown-menu fd-hide js-drop-menu">'+
              '<dl class="fd-dropdown-radio">'+
              '<dd  class="js-drop-item" v-for="item in scope.dataList"  :class="{active:item.name==scope.currentVal}"   v-text="item.name" @click="clickItem(item,$event)" :title="item.name">1</dd>'+
              '</dl>'+
              '</div>'+
              '</div>',
              //  私有作用域数据
              data: function () {
                  return {
                      scope:{
                          value:this.value,
                          placeholder:this.placeholder,
                          currentVal:this.getCurrentVal(),
                          dataList:this.dataList
                      }
                  }
              },
  			watch:{
                  dataList:{
  					deep:true,
  					handler:function(newValue,oldValue){
  						var  _this=this;
  						_this.scope.dataList=JSON.parse(JSON.stringify(_this.dataList));
  						//如果是n值 则 给currentVal赋值
  					}
  				},
  				value:{
  					deep: true,
  					handler: function(newVal,oldVal){
  						var _this = this;
  						//如果数据变化了 及时更新到组件中
  						_this.scope.value = newVal;
  						_this.scope.currentVal = _this.getCurrentVal();
  					}
  				}
  			},
              // 方法
              methods:{
                  // 点击下拉框
                  clickItem:function(item,event){
                      // 赋值
  					var resultVal = null;
                      this.scope.currentVal=item.name;
                      resultVal = this.valueType == 'c'?item.name:item.code;
                      // 发送消息到父级
                      this.$emit('input',resultVal);
                      this.$emit('change',resultVal);
                  },
                  // 清空值
                  clickClear: function (event) {
                      // 赋值
                      this.scope.currentVal='';
  					// 发送消息到父级
  					this.$emit('input',this.valueType == 'c'?'':null);
  					this.$emit('change',this.valueType == 'c'?'':null);
                  },
                  getCurrentVal: function(){
                      var _this = this,
                          resultVal = null;
                      //此处取得都是props中的值 因为 执行此方法的时候 scope中的值 还没加载
  					//此处只是给个初始值
  					//如果为n值得时候 此处得从datalist中拿到相应的name值显示出来
                      if(_this.valueType == 'n'){
                          $.each(_this.dataList,function(index,value){
                              if(value.code == _this.value){
                                  resultVal = value.name;
                              }
                          });
                      }else{
                          resultVal = _this.value;
                      }
                      return resultVal;
                  }
              },
              // 计算属性
              computed:{
                  //  根据值判断是否显示×
                  getVal:function(){
                      return  this.scope.currentVal?true:false;
                  }
              },
              mounted: function() {
                  $('.fd-dropdown-menu').on('mousewheel',function(event) {
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
        template: '<div class="fd-controls">'
        + '<input type="text" readonly unselectable="on" :value="scope.value | filterDateFormate" :title="scope.value | filterDateFormate">'
        +'</div>',
        
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
          return  {
              scope:{
                  value:this.value
              }
          }
        },
        watch: {
        	value: {
        		deep: true,
        		handler: function(newVal,oldVal){
        			var _this = this;
        			_this.scope.value = newVal;
        		}
        	}
        },
        filters: {
        	filterDateFormate: function(value){
        		if(value == null){
        			return "";
        		}else if(value != ""){
        			return value.slice(0,10);
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
        	var	datepickerOptions = $.extend({
				  elem: ($(_this.$el).find('input'))[0], //指定元素
				  trigger: 'click', //采用click弹出
				  ready: function(date){
				    //$(window).trigger('resize');
				  },
				  done: function(value, date, endDate){
				  	_this.changeDate(value);
				  }
			},_this.datepickerOptions);
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
        props:{
            name:{
                type:String,
                required:true
            },
            // 循环中用到
            index:{
                type: null,//  null 代表任意类型,
                default: ''
            },
            kbslindex:{
                type: null,//  null 代表任意类型,
            	 default: ''
            },
            // 值
            val:{
                type:null,//  null 代表任意类型
                validator:function (value) {
                    return  value+"200";
                    //  return [{key:'',value:''}]
                }
            },
            dataList:{
                // 必传且是数组
                required: true,
                type:Array,  // 多种类型 [String,Number]
                default:[{key:'',value:''}] //，有默认值
            },
            id:{
           	 type:String,
           	 default:''
            },
            //是否需要校验
            isCheckout:{
          	 type:Boolean,
          	 default:true
           },
           //最大可输入的长度
            maxlength: {
        	   type: Number,
        	   default: 524288
           }
        } ,
        //  模板
        template: '<div class="fd-component-simple-dropdown js-drop-menu-contain">'+
                    '<div class="fd-dropdown-value-box js-drop-menu-trigger" >'+
                       '<input class="fd-dropdow-input" :maxlength="maxlength" v-model="scope.val" :title="scope.val"  @blur="isQkValFun(scope.isQkVal)" @input="inputVal()"/>'+
                       '<div class="fd-clear-icon   js-fd-clear-icon"  :class="{show:getVal}"  @click="clickClear($event)" >{{getVal}}</div>'+
                    '</div>'+
                    '<div class="fd-dropdown-menu fd-hide js-drop-menu">'+
                       '<dl class="fd-dropdown-radio">'+
                           '<dd  class="js-drop-item" v-for="(item,index) in scope.dataList"  :class="getClass(index)"   v-text="item.name" @click="clickItem(item)" :title="item.name">1</dd>'+
                    '</dl>'+
                    '</div>'+
                '</div>',
        //  私有作用域数据
        data: function () {
            return {
                scope:{
                	index:this.index,
                    //  input 中的name属性
                    name:this.name,
                    //  input 中的值
                    val:this.val,
                    code:"",
                    // 显示错误信息
                    showError:this.showError,
                    // 下拉菜单的数据列表
                    dataList:this.dataList,
                    // 是否清空标识
                    isQkVal:false,
                    // 数据长度
                    isCheckout:this.isCheckout
                }
            }
        },
        watch:{
        	//这个监听是用于用户输入数据匹配
        	'scope.val':function(newVal,oldVal){
                  this.scope.val=newVal;
        		
        	},
        	//这个监听是处理组件接受数据之后改用新的值来渲染
        	val:{
        		deep:true,
        		handler:function(newVal,oldVal){
        			if(newVal!==oldVal && newVal!==this.scope.val){
        				this.scope.val=newVal
        			}
        		}
        	},
        	dataList:{
        		deep:true,
        		handler:function(newVal,oldVal){
        			var  _this=this;
                	_this.scope.dataList=JSON.parse(JSON.stringify(_this.dataList));   
        		}
        	}
        },
        // 方法
        methods:{
        	//监听是否清空输入框的数据 input失去焦点的时候执行
        	isQkValFun:function(newVal){
        		var _this=this;
        		//如果需要清空值
        		setTimeout(function(){
        			//增加判断条件 
        			if(_this.scope.isQkVal==newVal && newVal){
        				_this.scope.val='';
        				_this.scope.isQkVal=false;
            		}
        		},100)
        		
        	},
        	inputVal: function(){
        		 //如果为true 则需要校验数据
	              if(this.scope.isCheckout){
	              	for(var i=0;i<this.scope.dataList.length;i++){
	              		if(this.scope.val==this.scope.dataList[i].name){
	              			//如果输入的名称和数据列表中有完整匹配 则需要触发保存事件
	              			// 发送消息到父级
	                          this.$emit('change',this.scope.dataList[i],this.scope.name,this.index,this.id);
	                          this.scope.isQkVal=false;
	                          //跳出循环
	                          return;
	              		}
	              	}
	              	//如果值没有匹配需要清空之前填写的值
	      			this.scope.isQkVal=true;
	              	//调用方法判断是否要清空
	              }else{
	              	//采用对象赋值
	              	var newobj={};
	              	newobj.name=this.scope.val;
	              	newobj.code=this.scope.code;
	              	//如果不要校验数据 则直接保存 (保险公司名称)
	              	this.$emit('change',newobj,this.scope.name,this.index,this.id);
	              }
        	},
            // 点击下拉框
            clickItem:function(item){
                // 赋值
                this.scope.val=item.name;
                this.scope.code=item.code;
            	//把清空置为false
                this.scope.isQkVal=false;
                // 发送消息到父级
                this.$emit('change',item,this.scope.name,this.index,this.id);
                
            },
            // 清空值
            clickClear: function (event) {
                // 清空值
                this.scope.val='';
                // 发送消息到父级
                //此处{name:'',code:''}必须加上
                this.$emit('change',{name:'',code:''},this.scope.name,this.index,this.id);
            },
            //搜索通过添加class fd-hide来实现
            getClass:function(index){
            	var fdClass = "";
            	if(this.scope.isCheckout){
            		var dataName =this.scope.dataList[index].name;
            		
            		if(this.scope.val != '' && dataName.indexOf(this.scope.val) == -1) {//搜索
            			fdClass = "fd-hide";
            		}
            		for(var i=0; i<this.scope.dataList.length; i++) {
            			var dataItem = this.scope.dataList[i].name;
            			if(dataItem.indexOf(this.scope.val) == -1) {
            				return fdClass 
            			}
            		}
            	}
        		return fdClass ;
            }
        },
        // 计算属性
        computed:{
            //  根据值判断是否显示×
            getVal:function(){
                return  this.scope.val!==''?true:false;
            }
        },
        mounted: function() {
        	var _this=this;
        	$('.fd-dropdown-menu').on('mousewheel',function(event) {
        		event.stopPropagation();
        	});
        }
    });
 });
   
