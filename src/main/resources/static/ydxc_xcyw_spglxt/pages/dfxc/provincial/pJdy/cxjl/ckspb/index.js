// 查询记录模块
define(['extend/template1.js'], function(template1) {

    new Vue({
        el: '#jsAppControllerCkspb',
        mixins: [template1],
        data: {
            //编号
            bh:'',
            //职级
            zj:[],
            //事由
            sy:[],
            // 信息查询审批表数据
            xxxcb: {},
            // 查询对象数据列表
            cxdx: {
                // 自然人对象列表数据
                zrr: [],
                // 企业机构对象列表数据
                qyjg: [],
                // 银行账号对象列表数据
                yhzh: [],
                // 手机号对象列表数据
                sjh: []
            }
        },
        // 创建
        created: function() {
            var _this = this;
            // _this.getZjDzdm();
            // _this.getSyDzdm();
        },
        methods: {
            getSpdxx: function(){
                var _this = this;
                Artery.ajax.get('/api/v1/spd/ckspb/'+_this.bh, {
                    params:{
                    }
                }).then(function(result) {
                    console.log(result);
                        _this.xxxcb = result.jbxx;
                        var newDate = new Date(result.jbxx.dSqrq);
                        // newDate.setTime(result.sqcxJbxx.dSqrq);
                        _this.xxxcb.dSqrq = newDate.getFullYear() + "年"+ (newDate.getMonth() + 1) +"月"
                            + newDate.getDate() +"日";
                        _this.xxxcb.nCxsy = result.jbxx.cBtgyy;
                         _this.cxdx.zrr = result.cxZrrList;
                        _this.cxdx.zrr.forEach(e=>{
                            e.nZj = e.cCxxJson;
                        });
                        _this.cxdx.qyjg = result.cxDwList;
                        _this.cxdx.other = result.cxOtherList;
                    for (let i = 0; i < result.cxOtherList.length ; i++) {
                        if(result.cxOtherList[i].cxlx == 4){
                            _this.cxdx.yhzh.push(result.cxOtherList[i]);
                        } else if(result.cxOtherList[i].cxlx == 5){
                            _this.cxdx.yhzh.push(result.cxOtherList[i]);
                        }
                    }
                })
            },
            getZjDzdm: function(){
                var _this = this;
                Artery.ajax.get("/api/v1/code/", {
                    params: {
                        codeType: '1002'
                    }
                }).then(function (result) {
                    _this.zj = result;
                    console.log(result);
                })
            },
            getSyDzdm: function(){
                var _this = this;
                Artery.ajax.get("/api/v1/code/", {
                    params: {
                        codeType: '1001'
                    }
                }).then(function (result) {
                    _this.sy = result;
                })
            },
            changeSelect: function(name) {
                console.log('name')
            }
        },
        mounted: function() {
            var _this = this;
            var param = Artery.parseUrl();
            _this.bh = param.bh;
            _this.getSpdxx();
        },

    })


})