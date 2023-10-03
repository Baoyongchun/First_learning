/**
 * @version:	 		    2020.02.07
 * @createTime: 	 		2020.02.07
 * @updateTime: 			2020.02.07
 * @author:				    whf
 * @description            version controller
 */
define([], function () {
    return {
         //  项目版本号
        // version:'1.2.0',
        //  项目版本号
        version:new Date().getTime(),
        // 作者名
        author:'whf',
        // 更新时间
        updateTime:'20210826',
        commonUrl:'',
        baseCommon:'../common'
    };
});

// browser-sync  start --server  --files "src/**/*.pages, src/**/*.css , src/**/*.less, src/js/app/**/*.js"
