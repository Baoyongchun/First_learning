/**
 * @version:                2020.02.07
 * @createTime:            2020.02.07
 * @updateTime:            2020.02.07
 * @author:                 whf
 * @description             main.js ,所有js入口文件
 */
(function () {

    //判断 ie是否小于 ie9
    function checkIeVersion() {
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
    }

    //如果是ie8
    if (checkIeVersion()) {
        //  如果不是chrome那么就需要下载插件
        if (navigator.userAgent.indexOf("chromeframe") < 0) {
            window.location.href = '../../plugin/downloadPlugin.pages';
        }
    }
    // 是否是a6 项目
    var isA6 = document.querySelector('body').getAttribute('data-a6');
    //  js 的路径=>所有模块的查找根路径
    //  var  baseUrl='../js/';
    var baseUrl = isA6 === 'true' ? document.querySelector('body').getAttribute('data-base') : '../js/';
    // 防止浏览器缓存main.js，所用用时间戳加载 version.js
    require([baseUrl + '/version.js' + '?' + new Date().getTime()], function (version) {
        var _commonUrl = version.commonUrl;
        //  require 配置文件
        require.config({
            urlArgs: 'version=' + version.version,
            // baseUrl:baseUrl,
            paths: {
                /**
                 * config
                 */
                config: 'config',
                test: 'app/common/global',
                /**
                 * lib
                 */
                //  dom 操作库=>jquery
                jquery: _commonUrl + 'lib/jquery/jQuery.v1.11.1.min', //  jquery采用的amd 模块命名， jquery这个名字不可更改
                swiper: _commonUrl + 'lib/swiper/swiper.min',
                uploadify: _commonUrl + 'lib/uploadify/jquery.uploadify',
                //jqueryui
                jqueryUi: _commonUrl + 'lib/jquery/jquery-ui.min',
                //  mvvm 库  => vue
                vue: _commonUrl + 'lib/vue/vue.min',
                Promise: _commonUrl + 'lib/Promise/promise-polyfil',
                // scrollbar 滚动条
                scrollbar: _commonUrl + 'lib/plugin/scrollbar',
                scrollarea: baseUrl + '/lib/plugin/scrollarea.min',
                //提示控件
                addTipsMethod: _commonUrl + '/lib/plugin/addTipsMethod.min',
                //分页
                Pagination: _commonUrl + 'lib/plugin/pagination',
                //  leftTab
                leftTab: _commonUrl + 'lib/plugin/tab.min',
                //记录用户行为日志
                userBehavior: version.baseCommon + "/app/userBehavior/userBehavior",

                // 树
                tree: _commonUrl + 'lib/plugin/tree',
                // alert,插件
                alert: _commonUrl + 'lib/plugin/alert',
                // addTipsMethod,插件
                // addTipsMethod:_commonUrl+'lib/plugin/addTipsMethod',
                views:_commonUrl + 'lib/plugin/viewer.min',
                // ui module
                uiModel: 'lib/uiModel/uiModel',
                //  datetimepicker
                datetimepicker: _commonUrl + 'lib/plugin/datetimepicker.min',
                //  日期控件
                layDate: _commonUrl + 'lib/laydate/laydate',
                // 拖拽js
                dragFun: _commonUrl + 'lib/jquery/jquery-ui-1.10.3.custom',
                // stomp
                stomp: _commonUrl + 'lib/stomp/1.7.1.stomp.min',
                // md5
                md5: _commonUrl + 'lib/md5/2.12.0.md5.min',
                /**
                 * app
                 */
                // 公用的数据表
                fdDataTable: 'app/dataTable/fdDataTable',
                //获取查询项类型
                fdCxxCode: 'app/dataTable/fdCxxCode',
                // 登录人权限配置
                fdRight: 'app/right/fdRight',
                // 公用组件
                fdComponent: 'app/component/fdComponent',
                // 公用组件2(没引用vue依赖)
                fdComponent2: 'app/component/fdComponent2',
                // 公用global
                fdGlobal: 'app/common/global',
                // fdEventBus
                fdEventBus: 'app/common/fdEventBus',
                // fdMessage
                fdMessage: 'app/common/fdMessage'
            },
            //为那些没有使用define()来声明依赖关系
            shim: {
                'addTipsMethod': {
                    deps: ['jquery'],
                    exports: 'addTipsMethod'
                },
                'scrollbar': {
                    deps: ['jquery'],
                    exports: 'scrollbar'
                },
                'alert': {
                    deps: ['jquery'],
                    exports: 'alert'
                },
                //  日期控件
                'datetimepicker': {
                    deps: ['jquery']
                },
                //  leftTab
                'leftTab': {
                    deps: ['jquery']
                },
                //  uploadify
                'uploadify': {
                    deps: ['jquery']
                },
                //jqueryUi
                'jqueryUi': {
                    deps: ['jquery']
                }

            },
            waitSeconds: 0  //加载超时问题的一个解决方法0表示不设置超时，默认是7s
        });
        // 模块的入口
        require(['jquery', 'config', 'fdGlobal'], function (jquery, config, fdGlobal) {
            // 设置一个全局对象 global+ fd
            window.globalFd = {
                // ajax超时加载
                ajaxTimer: null,
                // 超时时间
                ajaxTimeout: 5000
            };
            // 正在加载数据
            fdGlobal.loading();
            // 获取js路径
            var url = isA6 === 'true'  ?  '' : config.dirJsPath,jsurl = $('body').data('js');
            //如果存在js路径，那么就加载该js
            if (jsurl) {
                require([url+jsurl], function () {
                    fdGlobal.removeLoading();
                });
            }
        });
    });
})();

