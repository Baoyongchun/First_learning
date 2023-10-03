/**
 * 记录用户行为
 * @param what 用户的具体操作
 * @param desc 对操作的具体描述
 */
function recordUserBehavior(what, desc) {
	try{
		var pathName = window.location.pathname;
		var endIdx=pathName.substr(1).indexOf('/')+2;
		var projectName=pathName.substring(0, endIdx);
		$.ajax({
			type : "get",
			url : projectName+"pri/log/recordUserBehavior",
			data : {
				"desc" : desc,
				"what" : what
			}
		});
	}catch(e){
	}
}