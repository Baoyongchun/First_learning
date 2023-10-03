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
                yesOrNo:true,
            }
        },
        computed: {

        },
        methods: {
            //保存ofd到minio云存储
            saveFile: function () {
                var _this = this;
                _this.yesOrNo=false;
                document.getElementById("upload").style.backgroundColor="#8F7F7F";
                var url = location.search;
                if(url.indexOf("=")!=-1) {
                    var bh = decodeURI(url).substr(url.indexOf("=") + 1);
                    console.log("保存ofd："+config.url.frame.saveSzQzOfd+"?bh="+bh);
                    var res = this.ocx.saveFile(config.url.frame.saveQzOfd+"?bh="+bh+"&gzOrSz=sz");
                    if(res==true){
                        Artery.notice.success({
                            title: '上传成功'
                        });
                        window.opener && window.opener.opener.location.reload();
                        setTimeout(function () {
                            window && window.close();
                        }, 2000);
                    }
                }else {
                    Artery.notice.error({
                        title: '请求出错',
                        desc: "上传失败，请稍后重试！"
                    });
                }
            },
        },
        created: function () {
            this.ocx = ofdreader.init("OFDDIV","1580px","800px");
            if ( this.ocx) {
                //加载预览ofd文件
                var url = location.search;
                if(url.indexOf("=")!=-1){
                    var bh = decodeURI(url).substr(url.indexOf("=")+1);
                    var path = config.url.frame.getMinioFileBySpid+"?bh="+bh;
                    console.log("获取ofd流的请求："+path);
                    this.ocx.openFile(path,false);
                }
            }
        },

        mounted: function () {

        },
        destroyed: function () {

        }

    });
    window.vm = vm;
    return vm;
})
