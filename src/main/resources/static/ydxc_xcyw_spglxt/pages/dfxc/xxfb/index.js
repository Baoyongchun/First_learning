/*
 * @Author: DengShuai
 * @Date: 2021-04-01
 * @LastEditors: DengShuai
 * @LastEditTime: 2021-04-01
 * @Description: 消息通知
 */
define(['fdEventBus', 'config', 'fdGlobal', 'Promise'], function (fdEventBus, config, fdGlobal, Promise) {
    new Vue({
        el: '#jsAppControllerXxfb',
        data: function () {
            return {
                pageshow:true,
                // 状态列表
                ztList: [
                    {
                        code: '1',
                        codeType: '1004',
                        name: '已发布'
                    },{
                        code: '2',
                        codeType: '1004',
                        name: '待发布'
                    }
                ],
                //列表数据
                shList: [],
                pageNow: 10,
                total: 0,
                //artery封装查询对象
                queryInfo: {},
                query: {
                    offset: 0,
                    pageNow:1
                },
                //查询条件
                cxtj: {
                    // 关键字
                    bt: '',
                    // 状态
                    zt: '',
                    //开始日期
                    fbsjks: '',
                    //结束日期
                    fbsjjs: '',
                    sort: '-DT_FBSJ'
                },
                xxfbForm : {
                    JSF: [], // 选择单位
                    JSJS: ['01'],// 选择角色
                    XXBT: '', // 标题
                    XXNR: '',// 内容
                    JSR: [],
                    deptRootId: 'jsjs:01',
                    FBFW:[],
                    zt:''
                },
                // 默认申请部门不可选
                disabled: false,
                disabledFbfw:false,
                optionKssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() > new Date(_this.cxtj.fbsjjs).valueOf();
                        }
                    }
                })(this),
                optionJssqsj: (function (_this) {
                    return {
                        disabledDate: function (date) {
                            return date && date.valueOf() < new Date(_this.cxtj.fbsjks).valueOf() - 86400000;
                        }
                    }
                })(this),
                currentPageIndex: 1,
                //暂无数据是否显示
                zwsjShow: false,
                // table 意见内容或者答复内容的重写title是否显示
                tableToolTipIsShow: false,
                // title 的内容
                tableToolTipCon: '',
                xxfbDataList: [{
                    code: '2',
                    codeType: 'fbfw',
                    name: '省纪委监委'
                },{
                    code: '3',
                    codeType: 'fbfw',
                    name: '市纪委监委'
                },
                    {
                        code: '4',
                        codeType: 'fbfw',
                        name: '县纪委监委'
                    }],
                dataList: [{
                    code: '01',
                    codeType: 'jsjs',
                    name: '查询员'
                }/*, {
                    code: '02',
                    codeType: 'jsjs',
                    name: '审批员'
                }, {
                    code: '03',
                    codeType: 'jsjs',
                    name: '公章管理员'
                }*/, {
                    code: '04',
                    codeType: 'jsjs',
                    name: '审核员'
                }, {
                    code: '05',
                    codeType: 'jsjs',
                    name: '监督员'
                }, {
                    code: '06',
                    codeType: 'jsjs',
                    name: '系统管理员'
                }, {
                    code: '08',
                    codeType: 'jsjs',
                    name: '审核监督员'
                }],
                delRow: {},
                isClick: true,
                xxlbFlag:true,
                xxbdFlag:false,
                tTzxxID:"",
                urlPre:'',
                fjTableData:[],
                fileNameList:[],
                czType:1,//1新建进入 2.编辑
                xxZt:false,//用来判断是否已保存过，没有则不能预览
                uploadUrl:''
            }
        },
        destroyed: function () {
            // 取消事件绑定
            // this.unbindEvent();
        },
        methods: {
            upSuccess(response,file,fjTableData){
            },
            handleRemove(file, fjTableData) {

            },
            handlePreview(file) {
            },
            handleExceed(files, fjTableData) {
                Artery.notice.warning({
                    title: '文件数量超出限制',
                    desc: '当前限制选择 3 个文件，本次选择了'+ files.length +'个文件，共选择了'+ files.length + fjTableData.length+'个文件',
                });
            },
            beforeRemove(file, fjTableData) {
                let bl = file.size/1024/10000 <= 1;
                if (!bl) {
                    var i = fjTableData.indexOf(file)
                    fjTableData.splice(i, 1) // 自动删除不符合要求的文件，不让它出现在预览列表中
                    return false // 只有return false 才会真的限制
                } else {
                    return this.$confirm(`确定移除 ${file.name}？`)
                }
            },
            selectFw:function(){
              if(this.xxfbForm.FBFW !=""){
                this.disabled=true;
                this.xxfbForm.JSF=[];
                this.xxfbForm.JSR=[];
              }else{
                  this.disabled=false;
              }
            },
            selectRy:function(){
                if(this.xxfbForm.JSR !=""){
                    this.disabledFbfw=true;
                    this.xxfbForm.fbfw=[];
                }else{
                    this.disabledFbfw=false;
                }
            },
            goback:function(){
                var _this = this;
                _this.searchReset();
                _this.xxlbFlag=true;
                _this.xxbdFlag=false;
                _this.xxfbForm.JSF= [], // 选择单位
                _this.xxfbForm.JSJS= ['01'],// 选择角色
                _this.xxfbForm.XXBT= '', // 标题
                _this.xxfbForm.XXNR= '',// 内容
                _this.xxfbForm.JSR= [],
                _this.xxfbForm.deptRootId= 'jsjs:01',
                _this.xxfbForm.FBFW=[],
                _this.tTzxxID ='';
                editor.setHtml('');

            },
            preview:function(flag,row){
                var _this = this;
                if(!_this.xxZt&&flag!=1){
                    Artery.notice.error({
                        title: '预览失败',
                        desc: '请保存或发布后预览'
                    });
                    return;
                }
                if(flag==1){
                    _this.tTzxxID=row.XXID;
                }
                var url = "preview.html?tTzxxID="+_this.tTzxxID;
                window.open(url,'_blank');
            },
            delFj:function(cId){
                var _this = this;
                var _serverData =  {
                    cId: cId,
                };
                $.ajax({
                    method: "post",
                    url:  '/api/xxfb/delFj',
                    data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        if (data>0) {
                            // _this.getFjTableData();
                        }else{
                            _this.$message({
                                message:'删除失败,请稍后重试！',
                                type: 'error',
                                showClose: true
                            });
                        }
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            generateUUID: function () {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                });
                return uuid.toUpperCase().split('-').join('');
            },
            /**
             *  * @Author juxiang
             *    @description 组装请求数据
             */
            getRequestData (file) {
                var formData = new FormData();
                formData.append('file', file);
                return formData;
            },
            /**
             * @description 查询条件重置
             * @name searchReset
             * @return {*} 无
             */
            searchReset: function () {
                // 如果查询条件有值，怎清空后重新请求数据
                this.cxtj.bt = '';
                this.cxtj.zt = '';
                this.cxtj.fbsjks = '';
                this.cxtj.fbsjjs = '';
                this.query.pageNow = 1;
                this.queryInfo.offset = 0;
                this.currentPageIndex = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(function (){//重新渲染分页
                    this.pageshow = true;
                });
                this.init(this.queryInfo);
            },
            setIndex: function (index) {
                return (index + 1) + (this.currentPageIndex - 1) * 10
            },
            /**
             * 初始化列表信息
             * @param queryInfo
             */
            init: function (queryInfo) {
                var _this = this;
                return new Promise(function(resolve, reject){
                    _this.queryInfo = queryInfo;
                    var _params = {};
                    for(var _key in _this.queryInfo){
                        _params[_key] = _this.queryInfo[_key];
                    }
                    for(var _key in _this.cxtj){
                        _params[_key] = _this.cxtj[_key];
                    }
                    Artery.ajax.get("/api/v1/tzxx/page", {
                        params: _params
                    }).then(function (result) {
                        if(result.code) {
                            Artery.notice.error({
                                title: '查询失败！'
                            });
                            return;
                        }
                        _this.shList = result.data;
                        _this.shList.forEach(function (item) {
                            item.jsjsTranslateText = fdGlobal.translateFsdx2Name(item.JSJS);
                        })
                        // 当数据的长度等于0时，暂无数据显示
                        if (_this.shList.length <= 0) {
                            _this.zwsjShow = true;
                        } else {
                            _this.zwsjShow = false;
                        }
                        _this.total = result.total;
                        resolve(true);
                    }).catch(function (err) {
                        console.info(err);
                        reject(false);
                    });
                })
            },
            // 切换页码触发的事件 page=> {offset: 当前页的偏移量，以0开始, limit: 当前分页的pagesize}
            handleChangePageNow: function (page) {
                this.queryInfo.limit = page.limit;
                this.queryInfo.offset = page.offset;
                this.currentPageIndex = page.offset / page.limit + 1;
                this.init(this.queryInfo);
            },
            // 发布消息通知
            fbxxtz: function () {
                var _this = this;
                _this.tTzxxID=this.generateUUID();
                _this.uploadUrl ="/api/xxfb/uploadFj/"+_this.tTzxxID;
                _this.czType=1;
                _this.xxlbFlag=false;
                _this.xxbdFlag=true;
            },
            // 查询消息发布
            cxXxfb: function () {
                this.init(this.queryInfo);
            },
            xxfbFormValidate: function(_params) {
                var isSuccess = false;
                if(_params.BT == ''){
                    isSuccess = true;
                }
                return isSuccess;
            },
            xxfbJSJSValidate: function(_params) {
                var isSuccess = false;
                if(!_params.JSJS.length && !_params.JSF.length) {
                    isSuccess = true;
                }
                return isSuccess;
            },
            xxfbJSFFBFWValidate: function(_params) {
                var isSuccess = false;
                if(_params.FBFW.length>0&&_params.FBFW[0]==""){
                    isSuccess= true;
                }
                if(!_params.JSF.length && isSuccess){
                    isSuccess = true;
                }
                return isSuccess;
            },
            saveXxThrottle: function(saveOrUpateType) {
                var _this = this;
                if(_this.isClick) {
                    _this.isClick = false;
                    _this.saveXx(saveOrUpateType);
                    //定时器
                    setTimeout(function() {
                        _this.isClick = true;
                    }, 2000);//一秒内不能重复点击

                }
            },
            // 保存消息 2为暂存 1为发布
            saveXx: function (saveOrUpateType) {
                var _this = this;
                // 做深拷贝
                var _params = {};
                for(var _key in _this.xxfbForm){
                    _params[_key] = _this.xxfbForm[_key];
                }
                var _method = 'put';
                _params.JSF = _params.JSF.join(';');
                _params.JSJS = _params.JSJS.join(';');
                _params.JSR = _params.JSR.join(';');
                // 通过判断参数里面是否有ID，来决定是否是修改操作
                if(_this.czType==1){
                    _method = 'post';
                }else{
                    _method = 'put';
                }
                _params.zt =saveOrUpateType;
                if(_this.xxfbJSJSValidate(_params)) {
                    Artery.notice.warning({
                        title: '角色必选'
                    });
                    return;
                }
                // if(_this.xxfbJSFFBFWValidate(_params)) {
                //     Artery.notice.warning({
                //         title: '发布范围或接收单位二选一'
                //     });
                //     return;
                // }
                // 根据type判断是暂存还是发布
                _params.XXID = _this.tTzxxID;
                _params.FBFW = _params.FBFW.join(';');
                _params.XXNR =editor.getHtml();
                Artery.ajax[_method]('/api/v1/tzxx', _params).then(function () {
                    _this.init(_this.queryInfo).then(function (res) {
                        _this.xxZt=true;
                        Artery.notice.success({
                            title: '操作成功！'
                        });
                    });
                    _this.goback();
                }).catch(function (err) {
                    console.info(err);
                });
            },
            // 删除消息
            deleteXX: function () {
                var _this = this;
                var row = _this.delRow;
                Artery.ajax.delete('/api/v1/tzxx/' + row.XXID).then(function () {
                    Artery.notice.success({
                        title: '删除成功！'
                    });
                    _this.init(_this.queryInfo);
                    _this.$refs.scxxModel.close();
                }).catch(function (err) {
                    Artery.notice.error({
                        title: '删除失败！'
                    });
                })
                _this.delRow = {};
            },
            // 修改消息
            editXX: function (row) {
                var _this = this;
                _this.tTzxxID =row.XXID;
                _this.uploadUrl ="/api/xxfb/uploadFj/"+_this.tTzxxID;
                _this.xxZt=true;
                _this.czType=2;
                // _this.$nextTick(function () {
                //     _this.disabled = row.zt == 1;
                // })
                _this.xxfbForm = JSON.parse(JSON.stringify(row));
                _this.xxfbForm.JSF = _this.xxfbForm.JSF.split(';');
                _this.xxfbForm.JSJS = _this.xxfbForm.JSJS.split(';');
                _this.xxfbForm.JSR = _this.xxfbForm.JSR.split(';');
                _this.xxfbForm.FBFW = _this.xxfbForm.FBFW==null?'':_this.xxfbForm.FBFW.split(';');
                editor.setHtml( _this.xxfbForm.XXNR==null?'':  _this.xxfbForm.XXNR);
                var jsf = '';
                for (var i = 0; i < _this.xxfbForm.JSF.length; i++) {
                    jsf += _this.xxfbForm.JSF[i] + ',';
                }
                if(jsf !=''){
                    jsf = jsf.substring(0,jsf.length-1);
                }
                var jsjs = '';
                for (var i = 0; i < _this.xxfbForm.JSJS.length; i++) {
                    jsjs += _this.xxfbForm.JSJS[i] + ',';
                }
                if(jsjs !=''){
                    jsjs = jsjs.substring(0,jsjs.length-1)
                }
                _this.xxfbForm.deptRootId = "jsf:" + jsf + ";jsjs:" + jsjs;
                // _this.getFjTableData();
                _this.xxlbFlag=false;
                _this.xxbdFlag=true;
            },
            scxxModalOpen: function(row) {
                var _this = this;
                _this.delRow = row;
                _this.$refs.scxxModel.open();
            },
            selectDw: function(newValue) {
                var _this = this;
                var jsf = '';
                for (var i = 0; i < _this.xxfbForm.JSF.length; i++) {
                    jsf += _this.xxfbForm.JSF[i] + ',';
                }
                if(jsf !=''){
                    jsf = jsf.substring(0,jsf.length-1);
                }
                var jsjs = '';
                for (var i = 0; i < _this.xxfbForm.JSJS.length; i++) {
                    jsjs += _this.xxfbForm.JSJS[i] + ',';
                }
                if(jsjs !=''){
                    jsjs = jsjs.substring(0,jsjs.length-1)
                }
                _this.xxfbForm.JSR = [];
                _this.xxfbForm.deptRootId = "jsf:" + jsf + ";jsjs:" + jsjs;
                if(this.xxfbForm.JSF !=""){
                    this.disabledFbfw=true;
                    this.xxfbForm.FBFW=[];
                }else{
                    this.disabledFbfw=false;
                }
            }
        },
        created: function () {
            var _this = this;
            _this.xxlbFlag=true;
            this.pageNow = getLimit();
            // _this.getFjTableData();
        },
        mounted: function () {
            // 绑定事件
            // this.bindEvent();
            const E = window.wangEditor
            // 切换语言
            const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN'
            E.i18nChangeLanguage(LANG)

            window.editor = E.createEditor({
                selector: '#editor-text-area',
                html: '<p><br></p>',
                config: {
                    placeholder: '请输入消息通知内容...',
                    MENU_CONF: {
                        uploadImage: {
                            fieldName: 'your-fileName',
                            base64LimitSize: 10 * 1024 * 1024 // 10M 以下插入 base64
                        }
                    },
                }
            })

            window.toolbar = E.createToolbar({
                editor,
                selector: '#editor-toolbar',
                config: {}
            })
            const curToolbarConfig = window.toolbar.getConfig();
            curToolbarConfig.excludeKeys = [
                'emotion',
                'group-video',
            ]
        }
    })
});
