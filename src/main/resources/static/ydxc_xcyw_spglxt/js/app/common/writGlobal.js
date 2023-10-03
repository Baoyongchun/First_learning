/**
 * 文书编写相关的公用方法
 */
define(['fdGlobal','jquery'],function(fdGlobal,$){
	//sessionStorage里存的key
	var storageKey='cpwsWsid';
	
	//由wsid组装成所需数据结构（字符串形式
	function buildStorageStructure(wsid){
		var _data={
				data:wsid,
        		category:'wsid',
        		message:'要打开的裁判文书id'
		};
		var _dataStr=JSON.stringify(_data);
		return _dataStr;
	};
	
  //依据location.search中的key值获得value
   function dealUrlParam(paramStr,key){
    	paramStr = paramStr.substring(1);
    	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
	    var r = paramStr.match(reg);
	    if(r == null){
	        return "";
	    }
	    return r[2];
    }
	//要返回的对象
	var _writGlobal={
			//检查浏览器版本是否需要特殊处理
	     	checkIeVersion:function(){
	            var browser=navigator.appName;
	            var b_version=navigator.appVersion;
	            if(browser=="Microsoft Internet Explorer"){
	            	return false;
	    		} else if(b_version.indexOf("WOW64")>0 && browser=="Netscape"&& b_version.indexOf("rv:11.0")<=0){
	    			return true;
	    		}else if(b_version.indexOf("WOW64")<0 && browser=="Netscape"){
	    			return true;
	    		}else if(b_version.indexOf("WOW64")>0 && browser=="Netscape"&& b_version.indexOf("rv:11.0")>0){
	    			return false;
	    		}else{
	    			return false;
	    		}
	        },
	      
	        //点击编辑（裁判文书）
	        clickCpwsEdit:function(){
            	//recordUserBehavior("编辑裁判文书","编辑文书的案号为："+aj.ah);
	        	var topWin=window.top;
            	var wsid=this.getWsid();
                console.log(wsid);
                if(this.checkIeVersion()){
                	fdGlobal.ajaxStartLoading();
                    $.get("../../../pub/activex/dealEditForChrome",{wsid:wsid},function(result){
                        var code = result.code;
                        var data = result.data;
                        if(data != ""){
                        	fdGlobal.scTip(false,data);
                            return;
                        }else{
                            var url = topWin.location.href;
                            var urlParam = topWin.location.search;
                            var editUrl = url.replace(urlParam,"");
                            var ajbh = dealUrlParam(urlParam,"ajbh");
							var ajlb = dealUrlParam(urlParam,"ajlb");
							var ah = dealUrlParam(urlParam,"ah");
							var fydm = dealUrlParam(urlParam,"fydm");
							var ywlx = dealUrlParam(urlParam,"ywlx");
							var aycode = dealUrlParam(urlParam,"aycode");
                            var timestemp = new Date().getTime();
                            var drumpUrl = "../../../publicTemplate/pages/chromeFrameActiveX.pages?wsid="+
                                wsid+"&timestemp="+timestemp+"&url="+editUrl+"&ajbh="+ajbh+"&ajlb="+ajlb+"&ah="+ah
                                +"&fydm="+fydm+"&ywlx="+ywlx+"&aycode="+aycode;
                                console.log(drumpUrl);
                            topWin.location.href=drumpUrl;
                        }
                    });
                    fdGlobal.ajaxStopLoading();
                }else{
                    var helper = topWin.document.getElementById('DocumentEditHelper');
                    var name = wsid + ".docx";
                    fdGlobal.ajaxStartLoading();
                    $.get("../../../pub/activex/appendDownLoadUrl",{wsid:wsid},function(result){
                        if(result.code == 200){
                            var downLoadUrl = result.data.downLoadUrl;
                            var writeBackDataUrl = result.data.writeBackDataUrl;
                            var docID = helper.LoadDocument(downLoadUrl,writeBackDataUrl);
                            //$.get("../../../pub/activex/recordActicXWsID",{wsid:wsid,activeXID:docID});
                        }
                    });
                    fdGlobal.ajaxStopLoading();
                }
            },
			//获取存在sessionStorage里的wsid
            getWsid:function()
            {
            	var _cpwsWsid = fdGlobal.findSessionStorage(storageKey);
            	var wsid=JSON.parse(_cpwsWsid).data;
            	return wsid;
            },
            //存wsid进sessionStorage
            saveWsid:function(wsid)
            {
            	var storageValue=buildStorageStructure(wsid);
            	fdGlobal.saveSessionStorage(storageKey,storageValue);
            }
			
	};
	return _writGlobal;
})