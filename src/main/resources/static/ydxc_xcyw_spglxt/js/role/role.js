// **********************************************//
// role 客户端脚本
// 
//
// @author liuzhenzhen
// @date 2018-07-06
// **********************************************//
var vm = new Vue({
	el: '#app',
	mixins: [],
	data: {
		rsRole: [],
		currentRow: null,
		currentId: '',
		role: {
			name: '',
			descript: ''
		}
	},
	mounted: function() {
		var _this = this;
		_this.getTitle();
		this.hideOperators();
	},
	methods: {

		loadRoleData: function(queryInfo) {
			var _this = this;
			$http.get('roles/roles').then(function(data) {
				_this.rsRole = data;
				_this.$refs.table_role.setCurrentRow(0);
			}).catch (function(error) {
				Artery.message.error(error.message);
			});
			return _this.rsRole;
		},
		addRole: function() {
			this.$refs.addRoleWindows.open();
		},
		/**
		 * 新建角色
		 */
		doAddRole: function() {
			var _this = this;
			$http.post('roles',this.$refs.addRoleForm.data).then(function(result) {
				Artery.message.info("保存成功");
				_this.$refs.addRoleWindows.close();
				_this.$refs.table_role.reloadData();
			});
		},
		/**
		 * 删除角色
		 */
		deleteRole: function(id) {
			var _this = this;
			this.$Modal.confirm({
				title: '提示',
				content: '确定删除该角色',
				onOk: function() {
					$http.delete('roles/' + _this.currentId)
					.then(function(data) {
						Artery.message.info('删除成功');
						_this.$refs.table_role.reloadData();
					}).catch(function(error) {
						Artery.message.error(error.message);
					})
				}
			});
		},
		/**
		 * 
		 * @param row
		 * @param event
		 * @param column
		 */
		rowSelect: function(row, event, column) {
			this.currentId = row.id;
			this.$refs.customOperArea_iframe.src  ='roles/customOperArea?id=' + row.id;
		
		},
		getTitle:function(){
			var _this = this;
			var p=window.parent;
			var iframes=p.document.getElementsByTagName("iframe");
			for(var i=0;i<iframes.length;i++){
				if(iframes[i].getAttribute("src")=="..//organ"){
					_this.titleCode = (iframes[i].getAttribute("title"));
					if(_this.titleCode == "IP管理"){
						 document.getElementsByClassName("fd-header")[0].style.display = 'none';
						 document.getElementsByClassName("fd-organ-west")[0].style.marginTop = '-134px';
						 document.getElementsByClassName("fd-organ-center")[0].style.marginTop = '-67px';
					}else if (_this.titleCode == "组织用户管理") {
						
					}else if (_this.titleCode == "工作证管理") {
						document.getElementsByClassName("fd-header")[0].style.display = 'none';
						 document.getElementsByClassName("fd-organ-west")[0].style.marginTop = '-134px';
						 document.getElementsByClassName("fd-organ-center")[0].style.marginTop = '-67px';
					};
				}
			}
		},
		hideOperators: function() {
			   if(this.titleCode != "组织用户管理") {
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
			}
	}
});