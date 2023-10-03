/**
 * @version:                2017.13.16
 * @createTime:            2017.03.16
 * @updateTime:            2017.08.02
 * @author:                    wuwg
 * @description             global.js ,这里放的是全局的方法，禁止写其他代码
 ***/
define(['jquery', 'alert', 'fdDataTable', 'config', 'Promise'], function ($, alert, fdDataTable, config, Promise) {
    "user strict";
    var queryParam = {
        cBh: ""

    };
    var _global = {
        //uuid  随机生成32位id
        generateUUID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid.toUpperCase().split('-').join('');
        },
        //根据n值 获取 c值（用来前端渲染的）
        getString: function (srapNum, conNum) {
            var list = 'table' + srapNum,
                str = "";
            $.each(fdDataTable[list], function (key, value) {
                var _key = key.slice(5, key.length);
                if (_key == conNum) {
                    str = value;
                }
            });
            return str;
        },
        // 获取请求路径？后面的参数
        getLocalParams: function () {
            var topWindow = this.getWindow(window);
            var params = topWindow.location.search.substring(1);
            //var params = window.top.location.search.substring(1);
            return params;
        },
        getAjQueryParam: function (config) {
            if (queryParam.ajbh != "") {
                return queryParam;
            }
            var _scope = this;
            var _type = config.methodGet;
            var paramStr = this.getLocalParams();
            var paramSplit = paramStr.split("&");
            for (var i = 0; i < paramSplit.length; i++) {
                var param = paramSplit[i].split("=");
                if (param[0] == "cBh") {
                    queryParam.ajbh = param[1];
                }
            }
            //保存页面操作
            return queryParam;
        },
        //获取指定的window
        getWindow: function (_window) {
            var _window = _window;

            function adjustWindow(_window) {
                var ___window = _window;
                var isTop = false;
                try {
                    isTop = ($(_window.document).find('#jsTop').size() > 0
                        || _window.top.location.href == _window.self.location.href);
                } catch (e) {
                    //如果报错 那么说明已经跨域 是别的系统在调用  返回当前的window
                    // 	return  _window;
                }
                if (isTop) {
                    return ___window;
                } else {
                    // 重新赋值
                    ___window = ___window.parent;
                    //  递归调用
                    return adjustWindow(___window)
                }
            }

            _window = adjustWindow(_window);

            return _window;

        },
        //页面加载时获取topwindow决定loading图显示
        getWindowLoad: function (_window) {
            var _window = _window;

            function adjustWindow(_window) {
                var ___window = _window;
                var isTop = false;
                try {
                    isTop = ($(_window.document).find('#jsTop').size() > 0
                        || _window.top.location.href == _window.self.location.href);
                } catch (e) {
                    //如果报错 那么说明已经跨域 是别的系统在调用  返回当前的window
                    return _window;
                }
                if (isTop) {
                    return ___window;
                } else {

                    // 重新赋值
                    ___window = ___window.parent;

                    //  递归调用
                    return adjustWindow(___window)
                }
            }

            _window = adjustWindow(_window);

            return _window;

        },
        //复制对象
        cloneObj: function (obj) {
            var newObj = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            for (var key in obj) {
                var val = obj[key];
                //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
                newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val;
            }
            return newObj;
        },
        getLocalPath: function (isAbsUrl) {
            var curWwwPath = window.location.href;
            var pathName = window.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            var localhostPath = curWwwPath.substring(0, pos);
            return isAbsUrl ? (localhostPath + '/') : '';
        },
        /**
         * @time 2019-09-24  新增=> 为了统一管理日志
         * @param showLog   是否输出日志
         * @param name      名称
         * @param method  请求方式  post,get,
         * @param url   请求的url
         * @param requestData   请求的数据
         */
        consoleLogRequest: function (showLog, name, method, url, requestData) {
            if (showLog) {
                console.log(name ? name : '');
                console.log('[[前台]]==>请求方式是');
                console.log(method ? method : '');
                console.log('[[前台]]==>请求的url是');
                console.log(url ? url : '');
                console.log('[[前台]]==>请求的数据是');
                console.log(requestData ? requestData : '');
            }
        },
        /**
         * @time 2019-09-24  新增=> 为了统一管理日志
         * @param showLog    是否输出日志
         * @param name   名称
         * @param responseData 后台返回的数据
         */
        consoleLogResponse: function (showLog, name, responseData) {
            if (showLog) {
                console.log(name ? name : '');
                console.log('(后台)==>返回的数据是');
                console.log(responseData ? responseData : '');
            }
        },
        //  正在加载页面
        loading: function () {
            $('body').append('<div id="js-fd-loading-init"  class="fd-loading-init" ><span>数据加载中...</span></div>');
            //  文档加载完成后，那么添加一个ajax 方法
            _global.ajaxLoading();
        },
        // 移除正在加载页面
        removeLoading: function () {
            $('#js-page-init').css({
                opacity: 1,
                visibility: 'visible'
            });
            if ($('#js-fd-loading-init').length > 0) {
                $('#js-fd-loading-init').remove();
            }
        },
        //  ajax 加载
        ajaxLoading: function () {
            var topWindow = this.getWindowLoad(window);
            //  判断当前的window是否是父级的window
            if (topWindow.location.href == window.self.location.href) {
                // 加载
                $(['<div class="fd-loading-contain fd-hide" id="js-loading" >',
                    ' <div class="fd-loading-mask"></div>',
                    ' <img  class="fd-log" src="data:image/gif;base64,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" alt="正在加载的图片"/>',
                    '</div>'].join("")).appendTo('body');
            }
            $(document).ajaxStart(function () {
                _global.ajaxStartLoading();
                if (globalFd.ajaxTimer) {
                    clearTimeout(globalFd.ajaxTimer);
                }
                globalFd.ajaxTimer = setTimeout(function () {
                    _global.removeLoading();
                }, globalFd.ajaxTimeout);
            });
            $(document).ajaxError(function (event, xhr) {
                //  登录权限过期的时候跳到登录页
                if (xhr.status == 401) {
                    topWindow.location.href = '/templates/login.pages'
                }
            });
            $(document).ajaxStop(function () {
                //  防止有些图形没有完成绘制，所以数据加载完后1秒钟再移除
                setTimeout(function () {
                    _global.ajaxStopLoading();
                }, 0);
            });
        },
        // 显示转圈的小图片
        ajaxStartLoading: function () {
            var topWindow = this.getWindowLoad(window);
            if ($(topWindow.document).find('#js-loading').hasClass('fd-hide')) {
                $(topWindow.document).find('#js-loading').removeClass('fd-hide');
            }
        },
        // 隐藏转圈的小图片
        ajaxStopLoading: function () {
            var topWindow = this.getWindowLoad(window);
            if (!$(topWindow.document).find('#js-loading').hasClass('fd-hide')) {
                $(topWindow.document).find('#js-loading').addClass('fd-hide');
            }
        },

        // 请求数据报错
        requestError: function (data, textStatus, errorThrown) {
            // 2016-09-29 ，ie会直接弹窗报错，所用 try{}catch(e){}
            try {
                console.error('请求数据发生了错误');
                console.error(data);
            } catch (e) {
                //console.log(e);
            }
        },

        // localStorage
        // 储存storage
        saveLocalStorage: function (name, value) {
            localStorage.setItem(name, value);
        },

        // 查找storage
        findLocalStorage: function (str) {
            var requestStr = localStorage.getItem(str);
            return requestStr;
        },

        // 删除storage
        devareLocalStorage: function (str) {
            localStorage.removeItem(str);
        },

        //sessionStorage
        // 储存storage
        saveSessionStorage: function (name, value) {
            sessionStorage.setItem(name, value);
        },

        // 查找storage
        findSessionStorage: function (str) {
            var requestStr = sessionStorage.getItem(str);
            return requestStr;
        },

        // 删除storage
        devareSessionStorage: function (str) {
            sessionStorage.removeItem(str);
        },
        //  获取url中的参数
        getUrlParams: function () {
            var _url = window.location.href;
            // 问号的位置
            var _questionPlace = _url.indexOf('\?');
            var _data = {};
            if (_questionPlace != -1) {
                //  截取字符串
                var dataStr = _url.substr(_questionPlace + 1);
                if(dataStr) {
                    // 对字符串进行解密
                    dataStr = decodeURIComponent(dataStr);
                    var dataArr = dataStr.split('&');
                    for (var i = 0; i < dataArr.length; i++) {
                        var param = dataArr[i].split('=');
                        _data[param[0]] = param[1];
                    }
                }
            }
            return _data;
        },
        limit: 10,
        //  保存文书
        saveWs: function (data, config, _vm) {
            var _type = config.isDebug ? config.methodGet : config.methodPost;
            $.ajax({
                type: _type,
                url: config.url.frame.save,
                data: data,
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        //  保存成功
                        // 条件提示
                        $.alert({
                            type: 'success'
                        });

                        //  是否已经编辑设置为false
                        _vm.sfybj = false;
                        //  是打印
                        if (_vm.isExport) {
                            // 执行导出的方法
                            _vm.clickExport();
                            // 将值设置为false
                            _vm.isExport = false;
                        } else if (_vm.isPrint) {
                            // 执行打印的方法
                            _vm.clickPrint();
                            // 将值设置为false
                            _vm.isPrint = false;
                        }

                    } else {
                        // 条件提示
                        $.alert({
                            type: 'fail'
                        });
                    }
                    //输出日志
                    _global.consoleLogResponse(config.showLog, '保存文书静态数据', data)
                },
                error: function (data, textStatus, errorThrown) {
                    //  报错信息
                    _global.requestError(data, textStatus, errorThrown);
                }
            });

            //输出日志
            _global.consoleLogRequest(config.showLog, '保存文书静态数据', _type, config.url.frame.save, data);
        },
        // 判断文书是否存在
        adjustWs: function (_data, config) {
            var _promise = $.Deferred();
            $.ajax({
                type: 'get',
                url: config.url.frame.adjust,
                data: _data,
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        if (data.data) {
                            // 存在数据
                            _promise.resolve()
                        } else {
                            // 请求数据
                            _promise.reject()
                        }
                    }
                    //输出日志
                    _global.consoleLogResponse(config.showLog, '判断文书是否存在文书静态数据', data)
                },
                error: function (data, textStatus, errorThrown) {
                    //  报错信息
                    _global.requestError(data, textStatus, errorThrown);
                }
            });
            //输出日志
            _global.consoleLogRequest(config.showLog, '判断文书是否存在文书静态数据', 'get', config.url.frame.adjust, _data);

            return _promise;
        },
        //  操作文书
        operateWs: function (data, config) {
            var _type = config.methodGet;
            var _data = data;
            var _serverData = [];
            $.each(_data, function (key, value) {
                //  id已经进行过一次编码，所以不需要再次编码
                if (key == 'id') {
                    // 进行编码，防止中文乱码
                    _serverData.push(key + '=' + value);
                } else {
                    // 进行编码，防止中文乱码
                    _serverData.push(key + '=' + encodeURIComponent(value));
                }
            });
            //  用& 分隔
            _serverData = '?' + _serverData.join('&');

            // data.operate=1是导出，data.operate=2 是打印pdf
            if (data.operate == 1) {
                //  导出
                window.open(config.url.frame.operate + _serverData, '_blank');
            } else if (data.operate == 2) {
                //   打印（pdf）
                window.open('pdf.html' + _serverData, '_blank');
            }

            //输出日志
            _global.consoleLogRequest(config.showLog, '操作文书静态数据', _type, config.url.frame.operate, data);
        },

        /**
         * 绑定下拉框事件
         * click.dropMenuShow   显示下拉框
         * click.dropMenuHide   隐藏下拉框
         * 事件代理的处理方式
         *
         */
        bindDropMenuEvent: function () {
            /**
             * @description 下拉组件在页面上使用，需要下面需要以下几个class
             * js-drop-menu-contain  下拉组件的容器
             * js-drop-menu-trigger  下拉组件的触发器
             * js-drop-menu  下拉菜单
             * js-drop-item  下拉菜单条目
             *@author  wuwg
             *@time  2016-10-09
             */
            //  给body绑定点击事件
            $('body').off('click.dropMenuShow').on('click.dropMenuShow', '.js-drop-menu-trigger', function (event) {
                var _this = $(this);
                var _dropMenu = _this.siblings('.js-drop-menu');
                var _dropComtain = _this.closest('.js-drop-menu-contain');
                $('.js-drop-menu-contain').removeClass('extend');

                //  隐藏其他的下拉框，显示当前点击的下拉框
                $('.js-drop-menu').not(_dropMenu).addClass('fd-hide');
                //  隐藏其他多选框
                $('.js-dropdown-menu').addClass('hide');
                var _event = event || window.event;

                var _target = $(event.target);

                // 如果是点击的清除按钮，那么就不往下走了
                if (_target.is('.js-fd-clear-icon')) {
                    return;
                }

                // 如果当前的是显示的，那么就隐藏，反之一样
                if (_dropMenu.hasClass('fd-hide')) {
                    _dropMenu.removeClass('fd-hide');
                    _dropComtain.addClass('extend');
                    // 绑定下拉框的提示事件
                    //   _tipsObj.bindMouseTipsEvent(_tipsObj.dropMenuTips);
                    $('body').off('click.dropMenuHide').on('click.dropMenuHide', function (event) {
                        var target = $(event.target);
                        if (target.parents().hasClass('js-drop-menu-contain') || target.hasClass('js-drop-menu-contain')) {
                            // 如果点击的是条目的话，那么就应该隐藏，否则不隐藏
                            if (target.is('.js-drop-item') || target.is('.tree-hd[canselected="true"] .tree-name')) {
                                //  隐藏下拉框
                                _dropMenu.addClass('fd-hide');
                                // 去除展开类名
                                _dropComtain.removeClass('extend');
                                // 记得解除事件绑定
                                $('body').off('click.dropMenuHide');
                                // 记得解除下拉框的提示事件
                                //    _tipsObj.unbindMouseTipsEvent();
                            } else {
                                return false;
                            }
                        } else {
                            //  隐藏下拉框
                            _dropMenu.addClass('fd-hide');
                            // 去除展开类名
                            _dropComtain.removeClass('extend');
                            // 记得解除事件绑定
                            $('body').off('click.dropMenuHide');
                            // 记得解除下拉框的提示事件
                            //  _tipsObj.unbindMouseTipsEvent();
                        }
                    });
                } else {
                    //  隐藏下拉框
                    _dropMenu.addClass('fd-hide');
                    // 去除展开类名
                    _dropComtain.removeClass('extend');
                    // 记得解除事件绑定
                    $('body').off('click.dropMenuHide');
                    // 解除下拉框的提示事件
                    // _tipsObj.unbindMouseTipsEvent();
                }
            });

            /*     /!**
             * @time  2016-10-09
             * @author wuwg
             * @description  为了解决下拉框出现...后数据看不全的问题，增加了一个提示框
             *!/
             var   _tipsObj={
             createTips:function(){
             $('<div class="fd-tips-contain"  id="jsDropMenuTips">这是提示框</div>')
             .css({
             'position':'absolute',
             'top':'0',
             'left':'0',
             'z-index':92,
             'background-color':'rgba(0,0,0,0.5)',
             'white-space':'nowrap',
             'font':'12px/20px "Microsoft YaHei"',
             'color':'#fff',
             'padding':'5px 10px',
             'border-radius':'5px',
             'display':'none'
             })
             .appendTo('body');

             return $('#jsDropMenuTips');
             },
             /!**
             * 操作tips
             *!/
             operateDropMenuTips:function(event,_dropMenuTips){
             var  _event=event||window.event,
             _top=_event.pageY,
             _left=_event.pageX,
             _text=$(_event.target).text();
             _dropMenuTips.text(_text)
             .css({
             top:_top,
             left:_left+15
             });
             },
             //  进行提示框绑定
             bindMouseTipsEvent:function(_dropMenuTips){
             // 这里的绑定事件都是先解除再绑定的
             $('body').off('mousemove.dropMenuTips').on('mousemove.dropMenuTips','.js-drop-menu-contain .js-drop-item',function(event){

             if(_dropMenuTips.is(':visible')){
             // 操作tips
             _tipsObj.operateDropMenuTips(event,_dropMenuTips);
             }

             });
             $('body').off('mouseenter.dropMenuTips').on('mouseenter.dropMenuTips','.js-drop-menu-contain .js-drop-item',function(event){
             if(!_dropMenuTips.is(':visible')){
             _dropMenuTips.css('display','block');
             // 操作tips
             _tipsObj.operateDropMenuTips(event,_dropMenuTips);
             }

             });
             //  隐藏提示框
             $('body').off('mouseleave.dropMenuTips').on('mouseleave.dropMenuTips','.js-drop-menu-contain .js-drop-item',function(){
             if(_dropMenuTips.is(':visible')){
             _dropMenuTips.css('display','none');
             }
             });
             },
             //  解除绑定
             unbindMouseTipsEvent : function (){
             $('body').off('mousemove.dropMenuTips');
             $('body').off('mouseenter.dropMenuTips');
             $('body').off('mouseleave.dropMenuTips');
             // 如果还有显示的一定要隐藏
             if(_tipsObj.dropMenuTips.is(':visible')){
             _tipsObj.dropMenuTips.css('display','none');
             }
             },
             // 元素
             dropMenuTips:$('#jsDropMenuTips'),
             // 初始化
             init:function(){
             // 创建下拉的提示框
             if(!_tipsObj.dropMenuTips.size()>0){
             _tipsObj.dropMenuTips=_tipsObj.createTips();
             }
             }
             };
             //  执行init方法
             _tipsObj.init();*/
        },
        //设置最大日期
        endDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
        //设置最小日期
        startDate: '1900-01-01',
        //判断 ie是否小于 ie9
        checkIeVersion: function () {
            var userAgent = navigator.userAgent,
                rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
                rFirefox = /(firefox)\/([\w.]+)/,
                rOpera = /(opera).+version\/([\w.]+)/,
                rChrome = /(chrome)\/([\w.]+)/,
                rSafari = /version\/([\w.]+).*(safari)/;
            var browser;
            var version;
            var ua = userAgent.toLowerCase();
            //判断是否是ie浏览器
            var match = rMsie.exec(ua);
            if (match != null) {
                if (match[2] == '7.0' || match[2] == '8.0' || match[2] == '9.0') {
                    console.log("浏览器版本低于ie10")
                    return true;
                }
                return false;
            }
            //判断是否是火狐浏览器
            var match = rFirefox.exec(ua);
            if (match != null) {
                console.log(match[1] + "----" + match[2])
                return false;
            }
            //判断是否是Opera浏览器
            var match = rOpera.exec(ua);
            if (match != null) {
                console.log(match[1] + "----" + match[2])
                return false;
            }
            //判断是否是Chrome浏览器
            var match = rChrome.exec(ua);
            if (match != null) {
                console.log(match[1] + "----" + match[2])
                return false;
            }
            //判断是否是Safari浏览器
            var match = rSafari.exec(ua);
            if (match != null) {
                console.log(match[1] + "----" + match[2])
                return false;
            }
        },
        //选择浏览器
        checkBrowser: function () {
            /* var userAgent = navigator.userAgent,
                 rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
                 rFirefox = /(firefox)\/([\w.]+)/,
                 rOpera = /(opera).+version\/([\w.]+)/,
                 rChrome = /(chrome)\/([\w.]+)/,
                 rSafari = /version\/([\w.]+).*(safari)/,
                 rEdge=/(Edge)\/([\w.]+)/;
             var browser;
             var version;
             var ua = userAgent.toLowerCase();
             function uaMatch(ua) {
                 var match = rMsie.exec(ua);
                 if (match != null) {
                     return { browser : "IE", version : match[2] || "0" };
                 }
                 var match = rFirefox.exec(ua);
                 if (match != null) {
                     return { browser : match[1] || "", version : match[2] || "0" };
                 }
                 var match = rOpera.exec(ua);
                 if (match != null) {
                     return { browser : match[1] || "", version : match[2] || "0" };
                 }
                 var match = rEdge.exec(ua);
                 if (match != null) {
                     return { browser : match[1] || "", version : match[2] || "0" };
                 }
                 var match = rChrome.exec(ua);
                 if (match != null) {
                     return { browser : match[1] || "", version : match[2] || "0" };
                 }
                 var match = rSafari.exec(ua);
                 if (match != null) {
                     return { browser : match[2] || "", version : match[1] || "0" };
                 }
                 if (match != null) {
                     return { browser : "", version : "0" };
                 }
             }
             var browserMatch = uaMatch(userAgent.toLowerCase());
             if (browserMatch.browser) {
                 browser = browserMatch.browser;
                 version = browserMatch.version;
             }
             return {
                 browser:browser,
                 version:version
             }*/
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
            var isIE = !!window.ActiveXObject || "ActiveXObject" in window //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Edge") == -1; //判断Chrome浏览器
            if (isIE) {
                return {browser: "IE"}
            }//isIE end

            if (isFF) {
                return {browser: "Firefox"}
            }
            if (isOpera) {
                return {browser: "Opera"}
            }
            if (isSafari) {
                return {browser: "Safari"}
            }
            if (isChrome) {
            	var version;
            	var arr = navigator.userAgent.split(' ');
                var chromeVersion = '';
                for(var i=0;i < arr.length;i++){
                    if(/chrome/i.test(arr[i]))
                    chromeVersion = arr[i]
                }
                if(chromeVersion){
                   version =  Number(chromeVersion.split('/')[1].split('.')[0]);
                } else {
                   version = 0;
                }
                return {browser: "Chrome",version:version}
            }
            if (isEdge) {
                return {browser: "Edge"}
            }
        },
        //2017年8月25日15:26:40新增，提示窗提到公用
        scTip: function (success, message, waitTime) {
            if (!waitTime) {
                waitTime = 400;
            }
            if (success) {
                // 条件提示
                $.alert({
                    type: 'success',
                    info: {
                        success: message
                    },
                    interval: waitTime
                });
            } else {
                // 条件提示
                $.alert({
                    type: 'fail',
                    info: {
                        fail: message
                    },
                    interval: waitTime
                });
            }
        },
        checkString: function (val) {
            if ((val || '') == '') {
                return false;
            }
            return true;
        },
        dateCompare: function (startDate, endDate) {
        	var _this = this;
            var result = true;
            if (!_this.isEmptyString(startDate) && !_this.isEmptyString(endDate)) {
                result = new Date(startDate.replace('-', '/').replace('-', '/')) <= new Date(endDate.replace('-', '/').replace('-', '/'));
                /*if (startDate && endDate && !result) {
                    $.alert({
                        type: 'fail',
                        info: {
                            fail: "开始时间不能大于结束时间"
                        },
                        interval: 1000
                    });
                    return result;
                }*/
            }
            return result;

        },
        //手机号码 yuexingzhong注写 请前端以后提供公共方法 如有法律责任请认准刘晓龙 cocall账号liuxiaolong-1
        checkPhone: function (phone) {
            var pattern = /^1\d{10}$/;
            if (pattern.test(phone)) {
                return true;
            }
            return false;
        },
        isEmptyString: function(str){
        	return (str || '') == '';
        },
        // 消息已读操作，总数减一，数据库状态改变
        readMessage: function(cxId) {
            var _this = this;
            return new Promise(function(resolve, reject) {
                // 获取notice对象
                _this.initNoticeLogs().then(function (res){
                    var noticeList = res;
                    var notice = {};
                    var _index;
                    noticeList.noticeList.forEach(function(item, index) {
                        if(item.cxId === cxId) {
                            notice = JSON.parse(JSON.stringify(item));
                            _index = index;
                        }
                    })
                    if(!!notice.cxId) {
                        var params = {
                            id: notice.id,
                            readed: notice.readed
                        }
                        $.ajax({
                            type: 'get',
                            url: config.url.frame.updateNoticeStatusUrl,
                            data: params,
                            dataType: "json",
                            success: function (data) {
                                console.info('消息已读：',data);
                            },
                            error: function (data, textStatus, errorThrown) {
                                //  报错信息
                                _global.requestError(data, textStatus, errorThrown);
                            }
                        });
                    }
                    resolve(true);
                }).catch(function (err) {
                    reject(err);
                })
            })
        },
        // 对应角色获取相应的消息提醒方法
        getNoticeCounts4LoginPerson: function(noticeList, noticeCount, loginPerson) {
            var _this = this;
            var _key = '';
            var _ids = [];
            var _noticeList = [];
            var _set;
            var notice = {};
            switch (loginPerson) {
                // case 'cxy':
                //     _key = 'cxsq';
                //     noticeList.forEach(function (item) {
                //         if (item.type === 3 && item.cxId) {
                //             _ids.push(item.cxId);
                //         }
                //     });
                //     _set = [].concat(_this._toConsumableArray(new Set(_ids)));
                //     _set.forEach(function (id) {
                //         _noticeList.push(noticeList.filter(function (item) {
                //             return item.cxId === id;
                //         })[0]);
                //     });
                //     noticeCount = _set.length;
                //     break;
                case 'spy':
                    _key = 'dsp';
                    noticeCount = 0;
                    break;
                case 'shy':
                    _key = 'cxsqsp';
                    noticeCount = 0;
                    break;
                case 'zyxtgly':
                    _noticeList = noticeList.filter(function (item) {
                        return item.type === 8;
                    });
                    noticeCount = _noticeList.length;
                    break;
            }

            notice.noticeCount = noticeCount;
            notice.noticeList = _noticeList;
            notice.key = _key;
            return notice;
        },
        _toConsumableArray: function(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            } else {
                return Array.from(arr);
            }
        },
        initNoticeLogs: function (type) {
            var _this = this;
            return new Promise(function(resolve, reject){
                $.ajax({
                    method: config.methodGet,
                    url: '/api/notice/getnotices',
                    dataType: 'json',
                    success: function (data) {
                        if(data.success) {
                            if(type === '7') {
                                resolve(data);
                            }else {
                                var notice =  _this.getNoticeCounts4LoginPerson( data.data, data.data.length, window.sessionStorage.getItem("loginPerson"));
                                resolve(notice);
                            }
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                        console.log(data, textStatus, errorThrown)
                        reject(data);
                    }
                });
            })
        },
        // 翻译发送对象
        translateFsdx2Name: function (val) {
            var _map = {
                '01' : '查询员',
                '02' : '审批员',
                '03' : '公章管理员',
                '04' : '审核员',
                '05' : '监督员',
                '06' : '系统管理员',
                '08' : '审核监督员',
            }
            var arr = [];
            val.split(';').forEach(function (item) {
                arr.push(_map[item]);
            })
            return arr.join(';');
        }
    };
    return _global;
});
