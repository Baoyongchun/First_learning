define([ 'jquery', 'config' ], function ( jquery,  config) {
    var _config = JSON.parse(JSON.stringify(config));
    //  单独设置，便于调试
    _config.showLog = true;
    var vm = new Vue({
        el: '#qzDiv',
       /* mixins: [template1, scspb],*/
        data: function (){
            return {
                //定义全局变量
                ocx: null,


            }
        },
        created: function () {
            this.ocx = ofdreader.init("OFDDIV","1580px","800px");
            if ( this.ocx) {
                //加载预览ofd文件
                var url = location.search;
                if(url.indexOf("=")!=-1){
                    var bh = decodeURI(url).substr(url.indexOf("=")+1);
                    var path = config.url.frame.getMinioFileBySpid+"?bh="+bh+"&flag=2";
                    console.log("获取ofd流的请求："+path);
                    this.ocx.openFile(path,false);

                }
            }
        },

    });
    window.vm = vm;
    return vm;
})
