// **********************************************//
// organ 客户端脚本
// 
//
// @author liuzhenzhen
// @date 2018-07-06
// **********************************************//
function getSessionId(){  
    var c_name = 'JSESSIONID';  
    if(document.cookie.length>0){  
       c_start=document.cookie.indexOf(c_name + "=")  
       if(c_start!=-1){   
         c_start=c_start + c_name.length+1   
         c_end=document.cookie.indexOf(";",c_start)  
         if(c_end==-1) c_end=document.cookie.length  
         return unescape(document.cookie.substring(c_start,c_end));  
       }  
    }  
}
var title;
var iframes=window.parent.document.getElementsByTagName("iframe");
for(var i=0;i<iframes.length;i++){
    if(iframes[i].getAttribute("src")=="..//organ"){
        title = (iframes[i].getAttribute("title"));
    }
}
if(title == "工作证管理" || title == "组织用户管理" || title == "IP配置管理") {
	var _version = getSessionId();
    $("#organTreeEle").attr("request-data-url", "organTree/organJgTree?currentDept=true&version=" + _version);
}
var vm = new Vue({
	el: '#app',
	mixins: [],
	data: function() {
		return {
			titleCode:'',// 页面title
			parentId:'',// 最外层机构id，需要传给页面，判断是否显示新建专案组按钮
			tree: null,
			organTreeData: [],
			currentNode: '',
			dczzjgShow:false,
			buttonGroup: {
				defaultParam: {
					id: "",
					type: "default",
					name: "",
					addCorpButtonState: true,
					addDeptButtonState: true,
					addUserButtonState: true,
					moveUserButtonState: true,
					delNodeButtonState: true
				},
				corp: {
					id: "",
					type: "corp",
					name: "",
					addCorpButtonState: false,
					addDeptButtonState: false,
					addUserButtonState: false,
					moveUserButtonState: true,
					delNodeButtonState: true
				},
				dept: {
					id: "",
					type: "dept",
					name: "",
					addCorpButtonState: true,
					addDeptButtonState: false,
					addUserButtonState: false,
					moveUserButtonState: true,
					delNodeButtonState: false
				},
				user: {
					id: "",
					type: "user",
					name: "",
					addCorpButtonState: true,
					addDeptButtonState: true,
					addUserButtonState: true,
					moveUserButtonState: false,
					delNodeButtonState: false
				}
			}
		}
	},
	mounted: function() {
		var _this = this;
		_this.getTitle();
		this.hideOperators();
		Artery.ajax.post('organTree/organJgTree?'+Math.random(), {}).then(function(result) {
			_this.parentId = result.id;
			_this.organTreeData.push(result);
			_this.currentNode = _this.buttonGroup["defaultParam"];
			_this.changeButtonState();
			if(title == "工作证管理") {
				return false
			}
			_this.$nextTick(function(){
				_this.reload();
			})
			
		});
		 // 禁用浏览器的backspace默认回退事件
        document.onkeypress = function (e) {
            var ev = e || window.event;// 获取event对象
            var obj = ev.target || ev.srcElement;// 获取事件源
            var t = obj.type || obj.getAttribute('type');// 获取事件源类型
            if (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"&& t != "number") {
                return false;
            }
        }
        document.onkeydown = function (e) {
            var ev = e || window.event;// 获取event对象
            var obj = ev.target || ev.srcElement;// 获取事件源
            var t = obj.type || obj.getAttribute('type');// 获取事件源类型
            if (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea"&& t != "number") {
                return false;
            }
        }
        var counter = 0;
        if (window.history && window.history.pushState) {
                         $(window).on('popstate', function () {
                                        window.history.pushState('forward', null, '#');
                                        window.history.forward(1);
                            });
          }

          window.history.pushState('forward', null, '#'); // 在IE中必须得有这两行
          window.history.forward(1);
	},
	created: function () {
		this.refreshList();
	},
	methods: {
		// 通过或者不通过后完刷新页面
    	refreshList:function(){
    		
    		var _this=this;
    		
    		window.addEventListener('message', function(evt){
               var flag = evt.data
               window.document.getElementById("operArea_iframe").contentWindow.postMessage(flag, '*');

            }, false);
    		
    		$(window).on('message',function(evt){
    			 var mesStr = typeof(evt.originalEvent.data) == 'string' ? evt.originalEvent.data : JSON.parse(evt.originalEvent.data);
    			 if(mesStr=='xjzazRefresh'){
    				 _this.reload();
    			 }else if(mesStr=='xjzazRemoveRefresh'){
    				 _this.reload();
    				 _this.$refs.operArea_iframe.src='';
    			 }
    		})
    	},
		
		/**
		 * 获取title，判断是那个页面
		 * 
		 */
		getTitle:function(){
			var _this = this;
			var p=window.parent;
			var iframes=p.document.getElementsByTagName("iframe");
			for(var i=0;i<iframes.length;i++){
				if(iframes[i].getAttribute("src")=="..//organ"){
					_this.titleCode = (iframes[i].getAttribute("title"));
					if(_this.titleCode == "IP配置管理"){
						_this.dczzjgShow = false;
						$(".fd-dcjg").css('display', 'none')
/*						 document.getElementsByClassName("fd-header")[0].style.display = 'none';
						 document.getElementsByClassName("fd-organ-west")[0].style.marginTop = '-65px';
						 document.getElementsByClassName("fd-organ-center")[0].style.marginTop = '-67px';*/
						 
					}else if (_this.titleCode == "组织用户管理") {
						_this.dczzjgShow = true;
						$(".fd-dcjg").css('display', 'block')
					}else if (_this.titleCode == "工作证管理") {
						_this.dczzjgShow = false;
						$(".fd-dcjg").css('display', 'none')
					/*	document.getElementsByClassName("fd-header")[0].style.display = 'none';
						 document.getElementsByClassName("fd-organ-west")[0].style.marginTop = '-65px';
						 document.getElementsByClassName("fd-organ-center")[0].style.marginTop = '-67px';*/
					};
				}
			}
		},
		/**
		 * 更改buttonGroup中button的状态
		 */
		changeButtonState: function() {
			var _this = this;
// _this.$refs.addCorp.disabled = _this.currentNode.addCorpButtonState;
// _this.$refs.addDept.disabled = _this.currentNode.addDeptButtonState;
// _this.$refs.addUser.disabled = _this.currentNode.addUserButtonState;
// _this.$refs.moveUser.disabled = _this.currentNode.moveUserButtonState;
// _this.$refs.delNode.disabled = _this.currentNode.delNodeButtonState;
		},

		/**
		 * 首字母大写
		 */
		nodeTypeToURL: function(treeNodeTyle) {
			return treeNodeTyle.substring(0, 1).toUpperCase() + treeNodeTyle.substring(1);
		},
		/**
		 * 
		 * @param treeNodeData
		 *            当前的树节点数据
		 * @param treeNode
		 *            当前的树节点
		 * @param event
		 *            event对象
		 */
		treeNodeSelect: function(treeNodeData, treeNode, event) {
			var _this = this;
			var treeNodeType = treeNodeData.customData.type;
			var chiledSrc = '';
			if(_this.titleCode == "IP配置管理"){
				chiledSrc = "./pages/ipgl.pages?cDwBh=" + treeNodeData.id + "&type=" + treeNodeType + "";
			}else if (_this.titleCode == "组织用户管理") {
				chiledSrc = "./pages/zzjgyhgl.pages?cDwId=" + treeNodeData.id + "&type=" + treeNodeType + "&parentId=" + _this.parentId + "&jgname=" + escape(treeNodeData.name) +"" ;
			}else if (_this.titleCode == "工作证管理") {
				chiledSrc = "./pages/gzzgl.pages?cDwId=" + treeNodeData.id + "&type=" + treeNodeType + "";
			};		
			_this.currentNode = _this.buttonGroup[treeNodeType];
			_this.currentNode.id = treeNodeData.id;
			_this.currentNode.name = treeNodeData.name;
			_this.changeButtonState();
			if (treeNodeType==="user") { // 用户
				_this.$refs.operArea_iframe.src = "users/" + treeNodeData.id;
			} else{ // 单位
				_this.$refs.operArea_iframe.src = chiledSrc;
			}
		},

		/**
		 * 添加单位
		 */
		addCorp: function() {
			var _this = this;
			_this.$refs.operArea_iframe.src = "corps_and_depts?" +
				"id=" + _this.currentNode.id +
				"&name=" + _this.currentNode.name +
				"&type=" + _this.currentNode.type +
				"&addType=corp";
		},
		
		/**
		 * 添加部门
		 */
		addDept: function() {
			var _this = this;
			_this.$refs.operArea_iframe.src = "corps_and_depts?" +
				"id=" + _this.currentNode.id +
				"&name=" + _this.currentNode.name +
				"&type=" + _this.currentNode.type +
				"&addType=dept";
		},
		/**
		 * 添加用户
		 */
		addUser: function() {
			var _this = this;
			_this.$refs.operArea_iframe.src = "users?" +
				"parentId=" + _this.currentNode.id +
				"&name=" + _this.currentNode.name +
				"&parentType=" + _this.currentNode.type;
		},
		/**
		 * 移动用户按钮
		 */
		moveUser: function() {
			var _this = this;
			_this.$refs.moveUserWindows.open();
		},
		/**
		 * 移动用户
		 */
		doMoveUser: function() {
			var _this = this;
			var activeTreeNode = _this.$refs.moveUserSelectTree.getActiveTreeNode();
			var parentId = activeTreeNode.treeNodeData.id;
			var parentType = activeTreeNode.treeNodeData.customData.type;
			$http.put('users/'+ _this.currentNode.id + '/parent', {
				parentId: parentId,
				parentType: parentType
			}).then(function(result) {
				_this.$refs.moveUserWindows.close();
				_this.$refs.organTreeAll.reload();
				Artery.message.success("移动成功")
			}).catch(function(error) {
				Artery.message.error("移动失败")
			});

		},
		/**
		 * 删除节点
		 */
		delNode: function() {
			var _this = this;
			this.$Modal.confirm({
				title: '提示',
				content: '确定删除',
				onOk: function() {
					$http.delete('organ/nodes/' + _this.currentNode.type + "?organId=" + _this.currentNode.id)
					.then(function(result) {
						Artery.message.info('删除成功');
						$.alert({
                            type:'success',
                            info :{
                            	success:'删除成功'
                            },
                            interval:1800
                        });
						_this.$refs.organTreeAll.reload();
					}).catch(function(error) {
						Artery.message.error("删除失败");
					});
				}
			});
		},
		/**
		 * 刷新组织机构树
		 */
		reload: function() {
			var _this = this;
		/*
		 * $http.get('api/organ/reloadCache?'+Math.random()).then(function(result) {
		 * if(result.success == true) { Artery.message.info('刷新缓存成功'); };
		 * _this.$refs.organTreeAll.requestDataUrl="organTree/organJgTree?"+Math.random();
		 * _this.$refs.organTreeAll.reload();
		 * 
		 * });
		 */
			_this.$refs.organTreeAll.requestDataUrl="organTree/organJgTree?"+Math.random();
			_this.$refs.organTreeAll.reload();
		},
		hideOperators: function() {
		   if(this.titleCode != "组织用户管理") { 
		      $(".aty-card-head").hide();
		      var links = $("a.aty-link");
		      for(var i=0;i<links.length;i++) {
		      	var link = links.eq(i); 
		      	if(link.html() != "组织机构") {
		          link.hide();
		      	}
		      }
		   } else {
			      var links = $("a.aty-link");
			      for(var i=0;i<links.length;i++) {
			      	var link = links.eq(2); 
			          link.hide();
			      }
		   }
		},
		// 导出组织机构
        exportAgency:function(exportAll){
        	var _this = this;
        	
        	// 创建这次导出的唯一标识，当前毫秒数、6位随机数再加上下载的序号，以下划线分隔
        	var exportKey = new Date().getTime() + '_' + Math.floor((Math.random()*1000000)+1);
        	
        	// 同时下载两个文件，组织机构数据json文件和组织机构统计txt文件
        	var fs = new Array(2);
        	for(var i=0;i<2;i++) {
        		var f = $('<iframe style="display:none;hight:0px" src="api/syncorgan/action/exportOrgan?exportAll=' + exportAll + 
        				'&exportKey=' + exportKey +'_' + i+'" ></iframe>');
        		$(document.body).append(f);
        		fs[i] = f;
        	}
        	setTimeout(function(){
        		for (var i = 0; i < fs.length; i++) {
					fs[i].remove();
				}
        	}, 60*1000);
        }
	}
});