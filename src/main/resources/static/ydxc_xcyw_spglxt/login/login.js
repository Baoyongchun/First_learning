/****************************************
 *version			18.00.01
 *Author    		wuwg
 *CreateTime 		2018-06-28
 *upDateTime 		2018-06-29
 *****************************************/
new  Vue({
    el:'#jsLogin',
    data:{
        // 激活的页签
        tabActive:1,
        // 用户名，密码
        user:'',
        password:'',
        // 用户名，密码
        consoleUser:'',
        consolePassword:'',
        // 是否记住密码
        remember:false,
        // 显示日志
        showLog:false,
        // 是否是调试模式
        isDebug:false,
        //本地url
        localUrl:'./json/login.json',
        //localUrl:'./json/loginError.json',
        // 服务器url
        serverUrl: contextPath + '/login',
        // 是否正在登录
        loading:false,
        loadText:'登录',
        // loadText:'登录中...',
        // 错误信息
        errorText:'',
        //是否显示错误
        errorShow:false,
        scaleRatio:"1",
        wjmmShow:false//显示忘记密码提示
    },
    computed:{
        // 显示清除用户名的图标
        isShowUserClear:function () {
            return   this.tabActive==1&& this.user || this.tabActive==2 &&  this.consoleUser
        },
        // 显示清除密码的图标
        isShowPasswordClear:function () {
            return   this.tabActive==1&& this.password || this.tabActive==2 &&  this.consolePassword
        },
        //  比率
        styleRatio:function(){
            return {
                transform:'scale('+this.scaleRatio+')'
            }
        }
    },
    methods:{
        // 正在登录
        isLoading:function(){
            this.loading=true;
            this.loadText='登录中...';
        },
        // 隐藏正在
        hideLoading:function(){
            this.loading=false;
            this.loadText='登录';
        },
        // 获得焦点
        focus:function(){
            this.hideError();
        },
        // 显示错误
        showError:function(info){
            this.errorText=  info;
            this.errorShow=  true;
        },
        // 隐藏错误
        hideError:function(){
            this.errorText=  '';
            this.errorShow=  false;
        },
        // 页签切换
        clickTab:function (activeCode) {
            if(this.tabActive!==activeCode)   {
                this.tabActive=activeCode;
            }
        },
        // 清除按钮
        clickClear:function (name) {
            switch  (true){
                case  this.tabActive==1 :
                    name=='user'?(this.user=''):( this.password='');
                    break;
                case  this.tabActive==2:
                    name=='user'?(this.consoleUser=''):( this.consolePassword='');
                    break;
                default:
                    break;
            }
        },
      //下载浏览器
        loadL:function() {
        	var domain = window.location.host;
        	window.open("http://" + domain + "/download/chrome_installer.zip")
        },
        // 判断是否可以登录
        adjustCanLogin:function () {
            switch  (true){
                case  this.tabActive==1 :
                    if(this.user==''){
                        this.$refs.user.focus();
                    }
                    else if(this.password==''){
                        this.$refs.password.focus();
                    }
                    return  this.user!='';
                    break;
                case  this.tabActive==2:
                    if(this.consoleUser==''){
                        this.$refs.consoleUser.focus();
                    }
                    else if(this.consolePassword==''){
                        this.$refs.consolePassword.focus();
                    }
                    return this.consoleUser!='';
                    break;
                default:
                    break;
            }
        },
        // 记住密码
        rememberPassword:function(){

        },
        getRequestData:function () {
            return  this.tabActive==1? {
                username:this.user,
                password:this.password,
                remember:this.remember
            }:{
            	username:this.consoleUser,
                password:this.consolePassword,
                remember:this.remember
            };
        },
        // 登录
        login:function (callback) {
            var _this=this;
            var request = new XMLHttpRequest();
            var _method=this.isDebug?'GET':'POST';
            var _url=this.isDebug?this.localUrl:this.serverUrl;
            request.open(_method, _url, true);
            request.setRequestHeader("Content-Type","application/json");
            // Set the request timeout in MS
            request.timeout = 7000;
            // 请求数据
            request.onreadystatechange=function () {
                if (!request || (request.readyState !== 4 )) {
                    return;
                }
                // 转json
                var responseData = JSON.parse(request.responseText);
                // 返回的数据
                var response = {
                    data: responseData,
                    // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
                    status: request.status === 1223 ? 204 : request.status,
                    statusText: request.status === 1223 ? 'No Content' : request.statusText,
                    request: request
                };
                // 输出日志
                if(_this.showLog){
                    console.dir(response);
                }
                // 如果是调试模式，增加动效延迟，目的仅仅为了好看
                if(_this.isDebug){
                    setTimeout(function () {
                        // 正在登录
                        _this.hideLoading();
                        // 执行回调函数；
                        callback(response);
                    },400);
                }else {
                	_this.hideLoading();
                    // 执行回调函数；
                    callback(responseData);
                }

                // Clean up request
                request = null;
            };
            // Handle low level network errors
            request.onerror = function handleError() {
                // Clean up request
                console.error('Network Error');
                request = null;
                _this.hideLoading();
            };

            // Handle timeout
            request.ontimeout = function handleTimeout() {
                console.error('timeout of  7000 ms exceeded');
                // Clean up request
                request = null;
                _this.hideLoading();
            };
            // 请求数据
            var   requestData = _this.getRequestData();
            // 判断是否记住密码
            _this.rememberPassword();
            // 输出日志
            if(_this.showLog){
                console.dir(requestData);
            }
            var data = {
            		userName: requestData.username,
            		password: requestData.password
            };
            // Send the request
            request.send(JSON.stringify(data));
        },

        //点击登录
        clickLogin:function (event) {
            var _this=this;
            // 如果正在登录
            if(_this.loading){
                return false;
            }
            // 阻止默认事件
            event.preventDefault();
            // 判断是否可以登录
            if(this.adjustCanLogin()){
                // 正在登录
                this.isLoading();
                // 登录
                this.login(function (result) {
                    // 如果出现错误信息
                    if(result.success){
//                    	window.sessionStorage.setItem('token',data.data.token);
                    	addCookie('lsn', _this.user, 1000);
                    	if (_this.remember) {
                    		addCookie('rmb', _this.password, 1000);
                    	} else {
                    		addCookie('rmb', '', 0);
                    	}
    					var strUrl = getQueryString('returnUrl') || result.data;
    					location.assign(strUrl);
    					/*if (strUrl.indexOf("/") == 0)
    						location.assign(strUrl);
    					else
    						location.assign(strUrl);*/
                    	// 储存凭据
                    }else {
                    	_this.showError(result.message);
                    }
                });
            }
        },
        // 动态设置缩放
        dynamicSetScale:function(){
            var  _win=window;
            // window width  and  height
            var  _winW=_win.innerWidth;
            var  _winH=_win.innerHeight;
            //   instance  width and  height
            /* var _actW=1680;  // 1920
             var _actH=760;   // 1080*/
            var _ratio=1;
            var _ratioW=_winW/1920;
            var _ratioH=_winH/760;
            // 最小的比率
            _ratio=Math.min(_ratioW,_ratioH);
            // 最大值取小值
            _ratio=Math.min(_ratio,1);
            // 最小值去取大值
            _ratio=Math.max(_ratio,0.5);
            // 设置比率
            this.scaleRatio=_ratio;
        },
        bindEvent:function () {
            var _this=this;
            window.addEventListener('resize',function () {
                _this.dynamicSetScale();
            },false);
        },
        //忘记密码
        clickWjmm:function () {
        	this.wjmmShow = true;
        },
        //关闭忘记密码
        cancel:function () {
        	this.wjmmShow = false;
        }
    },
    updated:function () { },
    mounted:function () {
        //绑定事件
    	var _this=this;
        this.bindEvent();
        //回车事件
        document.onkeyup=function(event){
        	if(event.keyCode==13){
        		$('.fd-item .fd-btn').trigger('click')
        	}
        }
    },
    created:function () {
    	if (window.top !== this && top.location.href != window.location.href) {
    		window.top.location.href = window.location.href;
    		return;
    	}
    	var cookieUserName = getCookie("lsn");
    	if (cookieUserName) {
    		this.user = cookieUserName;
    	}
    	var cookiePassword = getCookie("rmb");
    	if (cookiePassword) {
    		this.password = cookiePassword;
    		this.remember = true;
    	}
        // 默认计算一次
        this.dynamicSetScale();
    },
    beforeDestroy:function () {

    }
});
function addCookie(key, value, expireDays) {
	var expireSuffix = '';
	if (expireDays) {
		var date = new Date(); 
		date.setTime(date.getTime()+expireDays*24*3600*1000); 
		expireSuffix = '; expire='+date.toGMTString();
	}
	//将userId和userName两个cookie设置为10天后过期 
	document.cookie = key + '=' + value + expireSuffix;
}
function getCookie(key) {
	var arrCookie = document.cookie.split("; ");
	for (var i = 0; i < arrCookie.length; i++) {
		var arr = arrCookie[i].split("=");
		if (key == arr[0]) {
			return arr[1];
		}
	} 
	return null;
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r) {
   	 return decodeURIComponent(r[2]);
    } 
    return null;
}
