/*
 * @Author: wjing
 * @Date: 2020-02-11 15:02:04
 * @LastEditors: wjing
 * @LastEditTime: 2020-02-20 16:32:33
 * @Description: 查询记录模块
 */
define(['extend/template1.js', 'extend/scspb.js', 'jquery', 'dragFun', 'config', 'fdGlobal'], function (template1, scspb, jquery, dragFun, config, fdGlobal) {
    var _config = JSON.parse(JSON.stringify(config));
    //  单独设置，便于调试
    _config.showLog = true;
    var vm = new Vue({
        el: '#jsGzbjsq',
        mixins: [template1, scspb],
        data: function () {
            return {
                gzServiceType:'',//盖章服务商类型
                // 默认值为不通过
                tgType: "2",
                // 单选按钮组数据
                dataList: [{
                    code: '1',
                    codeType: 'type',
                    name: '盖章'
                }, {
                    code: '2',
                    codeType: 'type',
                    name: '不予盖章'
                }],
                // 不通过原因
                btgyy: '',
                // 盖章记录
                shjlList: [/*{
                    xh: '1',
                    zt: '已盖章',
                    shr: '王某某',
                    shjl: '不通过',
                    btgyy: '工作证与本人不符',
                    shsj: '2020-01-02 14:22:31',
                }*/],
                // 审批表扫描件列表
                spbsmjList: [],
                // 右侧放大的扫描件
                bigUrl: '',
                // 默认选中第一个扫描件的缩略图
                ins: 0,
                // 点击旋转的初始角度
                current: 0,
                // 点击缩放的初始大小
                currentScale: 1,
                // 查询申请人的工作证信息
                cxsqr: {
                    name: '张某（工作证）',
                    gzzh: 'JSJW20191021',
                    gzzyxq: '2020.04.01-2020.04.01',
                    shzt: '已通过'
                },
                // 协助查询人的工作证信息
                xzcxr: {
                    name: '李某（工作证）',
                    gzzh: 'JSJW20191021',
                    gzzyxq: '2020.04.01-2020.04.01',
                    shzt: '已通过'
                },
                // 展示到页面中的工作证信息
                gzzxx: {},
                //申请基本信息的编号
                bh: '',
                //申请基本信息的申请标识
                sqbs: '',
                //信息查询审批表信息接口
                xxxcspbUrl: config.url.frame.xxxcspbUrl,
                //信息协查审批图片接口
                gztpUrl: config.url.frame.gztpUrl,
                //多图片用印申请
                // dwjYysqSrc: config.url.frame.dwjYysqSrc,
                //多次用印申请(此处在使用多图片用印申请后，需要再次使用多次用印申请来获取用印信息，因为多图片用印申请返回的license只能用一次)
                dcYysqSrc: config.url.frame.dcYysqSrc,
                yysqSrc: config.url.frame.yysqSrc,
                //获取用印接口
                dwjQzSrc: config.url.frame.dwjQzSrc,
                //左侧链接书生盖章的路径
                qzIframeSrc: "",
                //用印申请获取的数据
                info: {},
                //获取工作证信息
                gzzUrl: config.url.frame.gzzUrl,
                //当前页码
                page: '1',
                // 计算最大页码
                maxPage: '',
                // 计算最小页码
                minPage: '1',
                //a4大小
                PAGE_A4_SIZE: 732,
                //盖章结论接口
                gzshUrl: config.url.frame.gzshUrl,
                //获取盖章记录接口
                gzjllbUrl: config.url.frame.gzjllbUrl,
                // 图片的高度
                img_h: '',
                // 第一张一张图片
                img: {
                    imgfirst: false,
                    imglast: false,
                    isShow: false
                },
                // 滚动条位置
                scrollTop: 0,
                // 图片移动是所需变量
                // 移动left
                currntMoveX: 0,
                currntMoveY: 0,
                scaleX: 0,
                scaleY: 0,
                // 鼠标是否按下
                isMove: false,
                gzConfirmButtonLoading: false,
                gzSubmitConfirmButtonDisabled: false,
                // 展示盖章不通过原因字数限制
                showGzbtg:false,
                webSocket: {},
                socketKey: ""
            }
        },
        computed: {
            gzConfirmButtonLoadingText: function () {
                return this.gzConfirmButtonLoading ? '处理中' : '盖章';
            },
            gzSubmitConfirmButtonDisabledText: function () {
                return this.gzSubmitConfirmButtonDisabled ? '处理中...' : '确定';
            }
        },
        methods: {
            // 盖章不通过
            focusGzbtg:function(){
                this.showGzbtg = true;
            },
            blurGzbtg:function(){
                this.showGzbtg = false;
            },
            /**
             * @Author: wlq
             * @name: setScrollTop
             * @description: 初始化图片
             * @return: {undefined}
             */
            initImg: function () {
                var _this = this;
                _this.bigUrl = _this.spbsmjList[0].url;
                // 图片的宽度高度
                var _w = _this.$refs['jsPreviewContent'].offsetWidth * 0.9 - 55;
                var _h = _this.$refs['jsPreviewContent'].offsetHeight * 0.9 - 55;
                _this.srcContent = _this.spbsmjList[0];
                _this.img_h = _this.$refs['jsPreviewContent'].height * 0.9 + 'px';
                var img = new Image();
                img.src = _this.srcContent.url;
                img.onload = function (ev) {
                    // 图片加载时 调用自动缩放；
                    _this.autoSize(img, _w, _h);
                };
                // 打开预览页，第一张 上一张按钮置灰
                if (_this.ins === 0) {
                    _this.img.imgfirst = true;
                    // 打开预览页，最后一张 下一张按钮置灰
                } else if (_this.ins === _this.spbsmjList.length - 1) {
                    _this.img.imglast = true;
                }
            },
            /**
             * 图片等比例缩放
             * @param Img  传入的图片, maxWidth  最大宽度, maxHeight   最大高度；
             */
            autoSize: function (Img, maxWidth, maxHeight) {
                //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
                // 当图片比图片框小时不做任何改变
                var imgEle = $('.fd-picture-obj');
                if (Img.width < maxWidth && Img.height < maxHeight) {
                    imgEle.css('margin-top', -imgEle.height() / 2 + 'px');
                } else {//原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
                    if (maxWidth / maxHeight <= Img.width / Img.height) //原图片宽高比例 大于 图片框宽高比例
                    {
                        imgEle.width(maxWidth).height(maxWidth * (Img.height / Img.width)).css('margin-top', -(imgEle.height() / 2) + 'px').css('margin-left', -(imgEle.width() / 2) + 'px');
                    } else {   //原图片宽高比例 小于 图片框宽高比例
                        imgEle.width(maxHeight * (Img.width / Img.height)).height(maxHeight).css('margin-top', -(imgEle.height() / 2) + 'px').css('margin-left', -(imgEle.width() / 2) + 'px');
                    }
                }
            },
            /**
             * @Author: wlq
             * @name: setScrollTop
             * @description: 滚动条滚动
             * @return: {undefined}
             */
            handleScroll: function () {
                // 获取滚动高度
                this.scrollTop = this.$refs.jsAppControllerXxcxspd.scrollTop;
                // 复制给一个变量，用于判断是向前还是向后切换图片
                var _numNext = (this.ins + 1) * this.PAGE_A4_SIZE;
                if (this.scrollTop > _numNext) { // 如果滚动条距离顶部的距离大于了一个A4的高度，则向后切换一张
                    this.clicknext();
                } else { // 如果滚动条距离顶部的距离小于了一个A4的高度，则向前切换一张
                    this.clickprev();
                }
            },
            /**
             * tab切换按钮 划过显示
             */
            tabisShow: function () {
                var _this = this;
                // 当只有一张图片的时候 切换按钮隐藏
                if (_this.files.length === 1) {
                    _this.img.isShow = false;
                } else {
                    _this.img.isShow = true;
                }
            },
            /**
             * tab切换按钮 离开隐藏
             */
            tabisHide: function () {
                var _this = this;
                // 当只有一张图片的时候 切换按钮隐藏
                if (_this.img.isShow) {
                    _this.img.isShow = false;
                }
            },
            /**
             * tab切换按钮 划过显示
             */
            tabisShow: function () {
                var _this = this;
                // 当只有一张图片的时候 切换按钮隐藏
                if (_this.spbsmjList.length === 1) {
                    _this.img.isShow = false;
                } else {
                    _this.img.isShow = true;
                }
            },
            /**
             * tab切换按钮 离开隐藏
             */
            tabisHide: function () {
                var _this = this;
                // 当只有一张图片的时候 切换按钮隐藏
                if (_this.img.isShow) {
                    _this.img.isShow = false;
                }
            },
            /**
             * @Author: wlq
             * @name: imgbigsmalldown
             * @description: 可以移动
             * @return: {undefined}
             */
            imgbigsmalldown: function (event) {
                var _this = this;
                event.preventDefault();
                // 鼠标按下
                _this.isMove = true;
                _this.scaleX = event.clientX;
                _this.scaleY = event.clientY;
            },
            /**
             * @Author: wlq
             * @name: imgbigsmallmove
             * @description: 可以移动
             * @return: {undefined}
             */
            imgbigsmallmove: function (event) {
                var _this = this;
                var moveDom = $(".fd-img-wrapper").get(0);
                event.preventDefault();
                if (_this.isMove && _this.currentScale > 1) {
                    moveDom.style.left = _this.currntMoveX + (event.clientX - _this.scaleX) + 'px';
                    moveDom.style.top = _this.currntMoveY + (event.clientY - _this.scaleY) + 'px';
                }
            },
            /**
             * @Author: wlq
             * @name: imgbigsmallup
             * @description: 可以移动
             * @return: {undefined}
             */
            imgbigsmallup: function () {
                var _this = this;
                var moveDom = $(".fd-img-wrapper");
                // 鼠标松开
                _this.isMove = false;
                //保存当前位置
                _this.currntMoveX = parseInt(moveDom.css("left").replace("px", ""));
                _this.currntMoveY = parseInt(moveDom.css("top").replace("px", ""));
            },
            /**
             * @Author: wlq
             * @name: clickRe
             * @description: 恢复图片原样
             * @return: {undefined}
             */
            clickRe: function () {
                this.initImg();
                this.currentScale = 1;
                this.$refs.bigImg.style.transform = "scale(" + this.currentScale + ")";
                this.$refs.bigImg.style.top = "50%";
                this.$refs.bigImg.style.left = "50%";
                // 图片容器复位
                this.$refs.bigImgW.style.top = "0";
                this.$refs.bigImgW.style.left = "0";
            },
            /**
             * @Author: wjing
             * @name: clickSh
             * @description:点击盖章
             * @param {type}
             * @return: {undefined}
             */
            clickSh: function () {
                this.$refs.editSh.open();

            },
            /**
             * @Author: wjing
             * @name: clickCancel
             * @description: 取消盖章弹窗
             * @param {type}
             * @return: {undefined}
             */
            clickCancel: function (manualClose) {
                this.btgyy = '';
                if(manualClose) {
                    this.$refs.editSh.close();
                }
            },

            /**
             * @Author: wjing
             * @name: clickSubmit
             * @description: 二次确认盖章
             * @param {type}
             * @return: {undefined}
             */
            clickSubmit: function () {
                if (!this.vaildateShjl()) {
                    Artery.notice.error({
                        title: '请填写必填项'
                    });
                } else if (!this.vaildateShjlLength()) {
                    Artery.notice.error({
                        title: '审核结论长度超过200'
                    });
                } else {
                    this.$refs.submitShModel.open();
                }
            },
            /**
             * 验证字数
             */
            vaildateShjlLength: function () {
                if (this.tgType == '2') {
                    this.$refs.btyyyTextArea.validate();
                    return this.btgyy.length <= 200;
                }
                return true;
            },

            /**
             * @Author: wjing
             * @name: clickCancelSh
             * @description: 关闭二次确认盖章
             * @param {type}
             * @return: {undefined}
             */
            clickCancelSh: function () {
                this.$refs.submitShModel.close();
            },
            /**
             * @Author: wjing
             * @name: clickSubmitSh
             * @description: 确定二次盖章
             * @param {type}
             * @return:
             */
            clickSubmitSh: function () {
                // submitSh方法会关闭页面，所以后续不再设置gzSubmitConfirmButtonDisabled为false
                this.gzSubmitConfirmButtonDisabled = true;
                this.submitSh();
            },
            /**
             * @Author: wjing
             * @name: clickShjl
             * @description: 点击盖章记录
             * @param {type}
             * @return: {undefined}
             */
            clickShjl: function () {
                var _this = this;
                _this.getShjlList();
                _this.$refs.editShjl.open();
            },
            /**
             * @Author: wjing
             * @name: clickItemImg
             * @description: 点击左侧扫描件缩略图
             * @param {number}
             * @param {object}
             * @return: {undefined}
             */
            clickItemImg: function (item, index) {
                var _this = this;
                _this.ins = index;
                _this.bigUrl = item.url;
                // TODO 点击此处时要重新渲染右侧的信息查询审批表
            },
            /**
             * @Author: wjing
             * @name: clickzx
             * @description: 点击左旋转
             * @param {type}
             * @return: {undefined}
             */
            clickzx: function () {
                var _this = this;
                _this.current -= 90;
                _this.$refs.bigImg.style.transform = "rotate(" + _this.current + "deg)";
            },
            /**
             * @Author: wjing
             * @name: clickyx
             * @description: 点击右旋转
             * @param {type}
             * @return: {undefined}
             */
            clickyx: function () {
                var _this = this;
                _this.current += 90;
                _this.$refs.bigImg.style.transform = "rotate(" + _this.current + "deg)";
            },
            /**
             * @Author: wjing
             * @name: clickprev
             * @description: 点击显示上一个
             * @param {type}
             * @return: {undefined}
             */
            clickprev: function () {
                var _this = this;
                _this.ins--;
                if (_this.ins === -1) {
                    _this.ins = 0;
                } else {
                    _this.clickItemImg(_this.spbsmjList[_this.ins], _this.ins);
                }
                // TODO 点击此处时要重新渲染右侧的信息查询审批表
            },
            /**
             * @Author: wjing
             * @name: clicknext
             * @description: 点击显示下一个
             * @param {type}
             * @return: {undefined}
             */
            clicknext: function () {
                var _this = this;
                _this.ins++;
                if (_this.ins === _this.spbsmjList.length) {
                    _this.ins = _this.spbsmjList.length - 1;
                } else {
                    _this.clickItemImg(_this.spbsmjList[_this.ins], _this.ins);
                }
                // TODO 点击此处时要重新渲染右侧的信息查询审批表
            },
            /**
             * @Author: wjing
             * @name: clickfd
             * @description: 点击放大10%
             * @param {type}
             * @return: {undefined}
             */
            clickfd: function () {
                var _this = this;
                _this.currentScale += 0.1;
                _this.$refs.bigImg.style.transform = "scale(" + _this.currentScale + ")";
                // _this.$refs.fdbs.style.display = "block";
                /* setTimeout(function () {
                     _this.$refs.fdbs.style.display = "none";
                 }, 1000)*/
            },

            /**
             * @Author: wjing
             * @name: clicksx
             * @description: 点击缩小10%
             * @param {type}
             * @return: {undefined}
             */
            clicksx: function () {
                var _this = this;
                _this.currentScale -= 0.1;
                console.log(_this.currentScale)
                if (_this.currentScale < 0) {
                    _this.currentScale = 0
                } else {
                    _this.$refs.bigImg.style.transform = "scale(" + _this.currentScale + ")";
                    _this.$refs.fdbs.style.display = "block";
                    setTimeout(function () {
                        _this.$refs.fdbs.style.display = "none";
                    }, 1000)
                }
            },
            /**
             * @Author: wjing
             * @name: clickGzz
             * @description: 点击查看工作证
             * @param {string}
             * @return: {undefined}
             */
            clickGzz: function (cUserId) {
                var _this = this;
                this.$refs.editgzz.open();
                // if (type === 'cx') {
                //     this.gzzxx = this.cxsqr;
                // } else if (type === 'xz') {
                //     this.gzzxx = this.xzcxr;
                // }
                Artery.ajax.get(this.gzzUrl + cUserId).then(function (result) {
                    _this.gzzxx = {
                        name: (result.cUserMc || '') + "（工作证）",
                        gzzh: result.cGzzHm,
                        bh: result.cBh,
                        gzzyxq: Artery.dateFormat(result.dYxqQs, 'YYYY-MM-DD') + ' - ' + Artery.dateFormat(result.dYxqJz, 'YYYY-MM-DD'),
                        shzt: result.cShzt,
                        src: result.cGzzPhoto
                    };
                })
            },

            /**
             * 提交盖章提交
             */
            submitSh: function () {
                var _this = this;
                Artery.ajax.post(this.gzshUrl, {
                    bh: this.bh,
                    gzjl: this.tgType,
                    btgyy: this.btgyy,
                    cxh: this.jbxxDataObj.cCxh
                }).then(function (result) {
                    if (result.success) {
                        Artery.notice.success({
                            title: '提交盖章结论成功'
                        });
                        /*this.$refs["editSh"].close();
                        this.$refs["submitShModel"].close();*/
                    } else {
                        Artery.notice.error({
                            title: '操作不正确',
                            desc: result.message || ""
                        });
                    }
                    fdGlobal.readMessage(_this.bh).then(function (res) {
                        _this.closeEditShAndReload();
                    }).catch(function (err) {
                        _this.closeEditShAndReload();
                    });
                }).catch(function (error) {
                    Artery.notice.error({
                        title: '请求超时'
                    });
                    console.log(error);
                    _this.closeEditShAndReload();
                });
            },
            /**
             * 验证盖章结论
             */
            vaildateShjl: function () {
                if (this.tgType == '2') {
                    this.$refs.btyyyTextArea.validate();
                    return this.btgyy.trim() !== "";
                }
                return true;
            },

            /**
             * 关闭盖章并刷新待盖章列表页面
             */
            closeEditShAndReload: function () {
                this.$refs.editSh.close()
                window.opener && window.opener.location.reload();
                setTimeout(function () {
                    window && window.close();
                }, 1000);
            },

            /**
             * 单选框改变事件
             * @param value
             * @param dataItem
             */
            shjlChange: function (value, dataItem) {
                //通过
                if (value === this.dataList[0].code) {
                    this.btgyy = '';
                }
            },
            /**
             * 获取信息查询审批表信息接口
             */
            loadXxxcspb: function () {
                var _this = this;
                Artery.ajax.get(this.xxxcspbUrl + this.bh).then(function (result) {
                    if (result) {
                        // _this.jbxxDataObj = result.jbxx;
                        _this.queriedObj.cxZrrList = result.cxZrrList;
                        _this.queriedObj.cxDwList = result.cxDwList;
                        _this.queriedObj.cxYhzhList = result.cxOtherList;
                        /* Artery.notice.success({
                             title: '获取信息查询审批表信息成功',
                         });*/
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                })
            },
            getDebugger: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/cxgz/debugger?time=" + Date.now()).then(function (result) {
                    _this.isDebugger = result;
                })
            },
            /**
             * 获取信息协查审批图片接口
             */
            loadSpdPngs: function () {
                var _this = this;
                Artery.ajax.get(this.gztpUrl, {
                    params: {
                        cxh: this.bh
                    }
                }).then(function (result) {
                    if (!!result.success) {
                        var arr = []
                        for (var imgName in result.data) {
                            arr.push({
                                url: result.data[imgName],
                                name: imgName
                            });
                        }
                        _this.spbsmjList = arr;
                        _this.initImg();
                    } else {
                        Artery.notice.error({
                            title: '请求出错',
                            desc: result.message || ""
                        });
                    }
                })
            },
            /**
             * 获取盖章记录
             */
            getShjlList: function () {
                var _this = this;
                Artery.ajax.get(_this.gzjllbUrl, {
                    params: {
                        cxh: _this.jbxxDataObj.cCxh
                    }
                }).then(function (result) {
                    _this.shjlList = result;
                    _this.$refs.scrollShjl.update(0, 0);
                })
            },
            /**
             * 初始化签章
             */
            // initQz: function (callback) {
            //     var _this = this;
            //     Artery.ajax.get(this.dwjYysqSrc, {
            //         timeout: 50000,
            //         params: {
            //             isCover: "1",
            //             operateuser: "rs_sd",
            //             esealnames: "印章甲",
            //             bh: this.bh,
            //             sqbs: this.sqbs
            //         }
            //
            //     }).then(function (result) {
            //         /*if (result) {
            //             _this.info = result;
            //         }
            //         if (callback && typeof callback === "function") {
            //             callback();
            //         }*/
            //         if (result) {
            //             _this.initQz2(callback);
            //         }
            //     })
            // },
            initQz2: function (/*callback*/) {
                var _this = this;
                Artery.ajax.get(this.dcYysqSrc, {
                    timeout: 50000,
                    params: {
                        bh: _this.bh,
                        sqbs: _this.sqbs,
                        generatePng:true,
                        timestamp:new Date().getTime()
                    }
                })
               /* Artery.ajax.get(
                    this.yysqSrc
                    , {
                        timeout: 50000,
                        params: {
                            isCover: "1",
                            operateuser: "rs_sd",
                            esealnames: "印章甲",
                            bh: this.bh,
                            sqbs: this.sqbs
                        }

                    })*/
                    .then(function (result) {
                    if (result) {
                        // _this.info = result;
                        //将result的属性覆盖到info中去
                        Object.assign(_this.info, result);
                        if (!!_this.qzIframeSrc && result.status=='true') {
                            _this.initSocketIO();
                            _this.info.extend = {"socketKey":_this.socketKey};
                            _this.gzWindow = window.open(_this.qzIframeSrc+ "?info=" + encodeURI(JSON.stringify(_this.info)));
                            //将当前用户信息和jbxx 的编号缓存到服务器，以便回调中使用
                            Artery.ajax.get("/api/v1/cxgz/user?cxh=" + _this.bh);
                        }else{
                            Artery.notice.warning({
                                title: '警告',
                                desc: '请求失败！'
                            });
                        }
                    }
                    /*if (callback && typeof callback === "function") {
                        callback();
                    }*/
                })
            },
            //数科签章
            initQz3:function(){
                var _this = this;
                _this.gzWindow = window.open(config.dirProjectRootPath+"/gz/shuke/index.html"+ "?bh=" +_this.bh);
                //将当前用户信息和jbxx 的编号缓存到服务器，以便回调中使用
                Artery.ajax.get("/api/v1/cxgz/user?cxh=" + _this.bh);
            },
            /**
             * 获取用印接口
             * page是当业务系统进行滚动时，通知书生客户端翻到第page页
             * 触发条件：1.初始化页面  2.当页码改变时，触发请求事件
             *
             */
            loadQzSrc: function () {
                var _this = this;
                Artery.ajax.get(this.dwjQzSrc)
                    .then(function (result) {
                    _this.info.page = _this.page + '';
                    _this.info.maxpage = '1';
                    console.log("盖章methods:loadQzSrc===>:  ");
                    console.log(_this.info);
                    /*if (!!_this.info.status) {*/
                        _this.qzIframeSrc = result ;//+ "?info=" + encodeURI(JSON.stringify(_this.info));
                        // _this.openGzPage();
                   /* } else {
                        console.log(_this.info)
                    }*/
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //查询盖章服务类型
            queryGzServiceType:function(){
                var gzType="";
                $.ajax({
                    method: config.methodPost,
                    url: config.url.frame.queryGzServiceType,
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        console.log("盖章服务类型为："+data);
                        gzType = data;
                    },
                    error: function (data, textStatus, errorThrown) {
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
                return gzType;
            },
            /**
             * 盖章
             */
            clickGz: function () {
                var _this = this;
                if (!!_this.isDebugger) {
                    // submitSh方法会关闭页面，所以后续不再设置gzConfirmButtonLoading为false
                    this.gzConfirmButtonLoading = true;
                    this.tgType = '1';
                    _this.submitSh();
                } else {
                    // 判断签章供应商类型
                    _this.gzServiceType = _this.queryGzServiceType();
                    if(1 == _this.gzServiceType ){
                        _this.initQz3();//数科
                    }else if(2 == _this.gzServiceType){//书生
                        _this.initQz2();//书生
                    }else{
                        Artery.notice.error({
                            title: '警告',
                            desc: '盖章服务商配置错误！'
                        });
                    }
                }
            },
            /**
             * 不予盖章
             */
            clickBtg: function () {
                this.$refs.editSh.open();
            },
            openGzPage: function(){
                var _this = this;

                _this.initQz2();
            },
            generateScoketKey: function () {
                // 当前毫秒值加6位随机数
                var randomNum = "";
                for (var i = 0; i < 6; i++) {
                    randomNum += Math.floor(Math.random() * 10);
                }
                this.socketKey = new Date().getTime() + randomNum;
            },
            initSocketIO: function () {
                var baseWebSocketUrl = _config.dirProjectPath.replace('http', 'ws');
                if(!this.webSocket || !this.webSocket.readyState || this.webSocket.readyState > 1) {
                    this.generateScoketKey();
                    try {
                        var webSocket = new WebSocket(baseWebSocketUrl + 'socket/' + this.socketKey);
                        webSocket.onopen = this.socketOnOpen;
                        webSocket.onclose = this.socketOnClose;
                        webSocket.onerror = this.socketOnError;
                        webSocket.onmessage = this.socketOnMessage;
                        this.webSocket = webSocket;
                    } catch (e) {
                        console.error(e);
                    }
                }
            },
            socketOnOpen: function (event) {
                console.log('Socket opened.');
            },
            socketOnClose: function (event) {
                console.log('Socket closed. Try reconnect.');
            },
            socketOnError: function (event) {
                console.error(event);
            },
            socketOnMessage: function (event) {
                var message = event.data;
                // console.log('Socket receive data:' + message);
                // var data = JSON.parse(message);
                //刷新列表数据
                window.opener && window.opener.location.reload();
                window.close();
            }
        },
        created: function () {
            var params = Artery.parseUrl();
            this.bh = params.bh || '';
            this.sqbs = params.sqbs || '';
            // this.loadXxxcspb();
            this.loadSpdPngs();
            // this.initQz2(this.loadQzSrc);
            this.loadQzSrc();
            this.getDebugger();
        },
        mounted: function () {
            var _this = this;
            window.addEventListener('scroll', this.handleScroll, true)
        },
        destroyed: function () {
            // 离开该页面需要移除这个监听的事件，不然会报错
            window.removeEventListener('scroll', this.handleScroll)
        }

    });
    window.vm = vm;
    return vm;
})
