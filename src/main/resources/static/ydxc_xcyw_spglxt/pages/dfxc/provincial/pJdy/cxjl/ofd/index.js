define(['fdGlobal', 'config', 'jquery'], function (fdGlobal, config, jquery) {
    new Vue({
        el: '#app',
        data: function () {
            return {
                jbxxbh: '',
                getOfdUrl: config.url.frame.spdOfdFileUrl
            }
        },
        created: function() {
            this.jbxxbh = fdGlobal.getUrlParams().cBh;
            if(this.isIE()) {
                $('body').append('<object id="TrivialObject" classid="CLSID:A18E7987-900A-4c32-B0B9-B4C1BEDB5DDD" width="100%" height="100%"></object>');
            } else {
                $('body').append('<object id="TrivialObject" type="trivial/very" width="100%" height="100%"></object>')
            }
        },
        methods: {
            isIE: function () {
                var browser = fdGlobal.checkBrowser();
                return browser.browser === 'IE';
            }
        },
        mounted: function () {
            var TrivialObject = document.getElementById("TrivialObject");
            try{
                TrivialObject.setWMFlag("7DCDFF9A-5BB6-4eac-932A-F1BD2CBA5B39");
            }catch(e){
                console.error(e);
            }
            //wjlx参考枚举类com.thunisoft.ydxc.xcyw.common.enums.FileType，此处主要获取包括盖章前和盖章后的所有ofd最新的那条记录
            var url = this.getOfdUrl + '?jbxxbh=' + this.jbxxbh + '&wjlxs[]=1&wjlxs[]=2&time=' + new Date().getTime();
            var success = TrivialObject.openFile(url, true);
            console.log(success);
            if(!success) {
                console.error("打开文件失败");
            } else {
                TrivialObject.setCompositeVisible('w_navigator', false);
            }
        }
    })
});