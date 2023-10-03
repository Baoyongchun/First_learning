/*!
 * downLoadFile.js v1.0.1
 * (c) 2019.10.24 XiaoDong Ge
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.downLoadFile = factory());
}(this, (function () {
    var downLoadFile = function (href) {
        this.init(href);
    }
    downLoadFile.prototype = {
        constructor: downLoadFile,
        a: '',
        downLoad: function () {
            document.body.appendChild(this.a);
            this.a.click();
            document.body.removeChild(this.a);
            return this;
        },
        init: function (href) {
            if (!!href) {
                if (typeof href === "string") {
                    if( !this.a || this.a === null){
                        this.a =  document.createElement('a');
                    }
                    this.a.href = href;
                } else {
                    throw new Error("请求路经为字符串");
                }
            } else {
                throw new Error("请求路经为必填项。");
            }
            return this;
        }
    }
    return downLoadFile;
})));

