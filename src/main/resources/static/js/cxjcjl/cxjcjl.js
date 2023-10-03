// **********************************************//
// cxjcjl 客户端脚本
// 
//
// @author zhangxiaoliang
// @date 2020-02-06
// **********************************************//
var vm = new Vue({
	el: '#app',
	mixins: [atyTplMixin],
	data: function() {
		return {
			//类型 1：查询监测；2：查询记录
			type:'1',
			//查询信息数据
			cxxxData:[],
			queryInfo:[],
			//查询条件
			cxtj:{
				sqdw:'',
				sqbm:'',
				sqkssj:'',
				sqjssj:'',
				zt:'',
				//信息检索
				xxjs:'',
				//时间戳
				time:'',
			},
			clzt:[
				{
					code:'1',
					name:'待反馈'
				},
				{
					code:'2',
					name:'部分反馈'
				},
				{
					code:'1',
					name:'全部反馈'
				},
			],
		}
	},
	methods: {
		loadPageData:function (queryInfo) {
			var _this = this;
			_this.queryInfo = queryInfo;
			_this.cxtj.time = Date.now();
//			if(_this.sfGet) {
				Artery.loadPageData("api/v1/cxjcjl/getCxxxData", _this.queryInfo, _this.cxtj)
					.then(function(result) {
						if(result.success){
							_this.cxxxData = result.data;
						} else {
							Artery.message.error(result.message);
						}
					})
//			}
		}
	}
});