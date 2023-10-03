/**
   兼容IE10
 */
var isIE = function(){ 
                return (window.navigator.userAgent.indexOf("MSIE")>=1);  
            }
 
// 修复IE10及以下版本不支持dataset属性的问题，兼容transfer-dom.js中使用了dataset的问题
            if (isIE() && window.HTMLElement) {
                if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
                    Object.defineProperty(HTMLElement.prototype, 'dataset', {
                        get: function() {
                            var attributes = this.attributes;
                            var name = [],
                                value = [];
                            var obj = {};
                            for (var i = 0; i < attributes.length; i++) {
                                if (attributes[i].nodeName.slice(0, 5) == 'data-') {
                                    name.push(attributes[i].nodeName.slice(5));
                                    value.push(attributes[i].nodeValue);
                                }
                            }
                            for (var j = 0; j < name.length; j++) {
                                obj[name[j]] = value[j];
                            }
                            return obj;
                        }
                    });
                }
            }