/*
 * @Author: wjing
 * @Date: 2020-02-11 15:02:04
 * @LastEditors: wjing
 * @LastEditTime: 2020-02-20 16:32:33
 * @Description: 查询记录模块
 */
define(['extend/template1.js', 'extend/scspb.js', 'jquery', 'dragFun', 'config'], function (template1, scspb, $, dragFun, config) {
    var _config = JSON.parse(JSON.stringify(config));
    //  单独设置，便于调试
    _config.showLog = true;
    var vm = new Vue({
        el: '#jsShbjsq',
        mixins: [template1, scspb],
        data: function () {
            return {
                gzServiceType:'',//盖章服务商类型
                // 默认值为不通过
                tgType: "2",
                // 单选按钮组数据二维码
                dataList: [{
                    code: '1',
                    codeType: 'type',
                    name: '通过'
                }, {
                    code: '2',
                    codeType: 'type',
                    name: '不通过'
                }],
                // 不通过原因
                btgyy: '',
                // 审核记录
                shjlList: [/*{
                    xh: '1',
                    zt: '已审核',
                    shr: '王某某',
                    shjl: '不通过',
                    btgyy: '工作证与本人不符',
                    shsj: '2020-01-02 14:22:31',
                }*/],
                // 审批表扫描件列表
                spbsmjList: [{
                    url: './images/icon-sp2.png'
                }, {
                    url: './images/icon-sp2.png'
                }, {
                    url: './images/icon-sp2.png'
                },],
                /**
                 * ofd转换成的png图片
                 */
                spbgzpngList: [{
                    url: ''
                }, {
                    url: ''
                }, {
                    url: ''
                },],
                // 右侧放大的扫描件
                bigUrl: '',
                // 默认选中第一个扫描件的缩略图
                ins: 0,
                // 点击旋转的初始角度
                current: 0,
                // 点击缩放的初始大小
                currentScale: 1,
                // 图片旋转的度数
                deg: 0,
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
                //线下审批表的审核接口
                xxspbshUrl: config.url.frame.xxspbshUrl,
                //申请基本信息的编号
                bh: '',
                //申请基本信息的申请标识
                sqbs: '',
                //信息查询审批表信息接口
                xxxcspbUrl: config.url.frame.xxxcspbUrl,
                //多次用印申请
                dcYysqSrc: config.url.frame.dcYysqSrc,
                //获取多次用印接口
                dcQzSrc: config.url.frame.dcQzSrc,
                //左侧链接书生盖章的路径
                qzIframeSrc: "",
                //用印申请获取的数据
                info: {},
                //获取工作证信息
                gzzUrl: config.url.frame.gzzUrl,
                //信息协查审批图片接口
                shtpUrl: config.url.frame.shtpUrl,
                // 当前页码
                page: '1',
                // 计算最大页码
                maxPage: '',
                // 计算最小页码
                minPage: '1',
                // a4大小
                PAGE_A4_SIZE: 732,
                // 图片的高度
                imgH: '',
                // 第一张一张图片
                img: {
                    imgfirst: false,
                    imglast: false,
                    isShow: false
                },
                // 滚动条位置
                scrollTop: 0,
                // 左侧system  右侧external
                scrollPos: '',
                // 图片移动是所需变量
                // 移动left
                currntMoveX: 0,
                currntMoveY: 0,
                scaleX: 0,
                scaleY: 0,
                // 鼠标是否按下
                isMove: false,
            //    审核不通过字数限制
                showShbtg:false,
                webSocket: {},
                socketKey: '',
                abcClass: 'fd-picture-obj'
            }
        },
        methods: {
            // 审核不通过
            focusShbtg:function(){
                this.showShbtg = true;
            },
            blurShbtg:function(){
                this.showShbtg = false;
            },
            // 审核表旋转--向左
            previewRotateZuo: function (event) {
                var _this = this;
                // 图片旋转90deg
                _this.deg -= 90;
                if (_this.deg <= -360) {
                    _this.deg = 0;
                }
                // 获取图片
                var imgRotate = event.target.parentNode.nextElementSibling;
                imgRotate.style.transform = 'translate(-50%, -50%) rotate(' + this.deg + 'deg) scale(' + this.currentScale + ')';
            },
            // 审核表旋转--向右
            previewRotateYou: function (event) {
                var _this = this;
                // 图片旋转90deg
                _this.deg += 90;
                // 当图片旋转到270deg时 旋转度数置0
                if (_this.deg >= 360) {
                    _this.deg = 0;
                }
                // 获取图片
                var imgRotate = event.target.parentNode.nextElementSibling;
                imgRotate.style.transform = 'translate(-50%, -50%) rotate(' + this.deg + 'deg) scale(' + this.currentScale + ')';
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
                _this.srcContent = _this.spbsmjList[0].url;
                _this.imgH = _this.$refs['jsPreviewContent'].height * 0.9 + 'px';
                var img = new Image();
                img.src = _this.srcContent;
                img.onload = function () {
                    // 图片加载时 调用自动缩放；
                    _this.$nextTick(function () {
                        _this.autoSize(img, _w, _h);
                    });
                };
                // 打开预览页，第一张 上一张按钮置灰
                if (_this.ins === 0) {
                    _this.img.imgfirst = true;
                    // _this.$refs.bigImg[0].style.transform = 'translate(-50%, -50%) rotate(-90deg) scale(' + _this.currentScale + ')';
                    // 打开预览页，最后一张 下一张按钮置灰
                } else if (_this.ins === _this.spbsmjList.length - 1) {
                    _this.img.imglast = true;
                }
            },

            // 为了解决火狐下滚动慢的问题
            systemMouseenter: function () {
                this.scrollPos = 'system';
            },

            systemMouseleave: function () {
                this.scrollPos = '';
            },

            externalMouseenter: function () {
                this.scrollPos = 'external';
            },

            externalMouseleave: function () {
                this.scrollPos = '';
            },
            sysHandleScroll: function () {
                var _this = this;
                if (_this.scrollPos === 'system') {
                    _this.scrollTop = _this.$refs.systemForm.scrollTop;
                    var serialL = _this.scrollTop / (_this.$refs.systemForm.scrollHeight - _this.$refs.systemForm.clientHeight);
                    _this.$refs.externalForm.scrollTop = (_this.$refs.externalForm.scrollHeight - _this.$refs.externalForm.clientHeight) * serialL;
                }
            },
            exterHandleScroll: function () {
                var _this = this;
                if (_this.scrollPos === 'external') {
                    _this.scrollTop = _this.$refs.externalForm.scrollTop;
                    var serialR = _this.scrollTop / (_this.$refs.externalForm.scrollHeight - _this.$refs.externalForm.clientHeight);
                    _this.$refs.systemForm.scrollTop = (_this.$refs.systemForm.scrollHeight - _this.$refs.systemForm.clientHeight) * serialR;
                }
            },
            /**
             * 图片等比例缩放
             * @param Img  传入的图片, maxWidth  最大宽度, maxHeight   最大高度；
             */
            autoSize: function (Img, maxWidth, maxHeight) {
                $('.fd-picture-obj');
                //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
                // 当图片比图片框小时不做任何改变
                // var imgEle = $('.fd-picture-obj');

                // if (Img.width < maxWidth && Img.height < maxHeight) {
                //     imgEle.css('margin-top', -imgEle.height() / 2 + 'px');
                // } else {//原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
                //     if (maxWidth / maxHeight <= Img.width / Img.height) //原图片宽高比例 大于 图片框宽高比例
                //     {
                //         imgEle.width(maxWidth).height(maxWidth * (Img.height / Img.width)).css('margin-top', -(imgEle.height() / 2) + 'px').css('margin-left', -(imgEle.width() / 2) + 'px');
                //     } else {   //原图片宽高比例 小于 图片框宽高比例
                //         imgEle.width(maxHeight * (Img.width / Img.height)).height(maxHeight).css('margin-top', -(imgEle.height() / 2) + 'px').css('margin-left', -(imgEle.width() / 2) + 'px');
                //     }
                // }
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
                // 如果滚动条距离顶部的距离大于了一个A4的高度，则向后切换一张
                if (this.scrollTop > _numNext) {
                    this.clicknext();
                } else {
                    // 如果滚动条距离顶部的距离小于了一个A4的高度，则向前切换一张
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
                var moveDom = event.target.parentNode.parentNode;
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
                var moveDom = $('.fd-img-wrapper');
                // 鼠标松开
                _this.isMove = false;
                // 保存当前位置
                _this.currntMoveX = parseInt(moveDom.css('left').replace('px', ''));
                _this.currntMoveY = parseInt(moveDom.css('top').replace('px', ''));
            },
            /**
             * @Author: wlq
             * @name: clickRe
             * @description: 恢复图片原样
             * @return: {undefined}
             */
            clickRe: function () {
                var _this = this;
                _this.initImg();
                _this.currentScale = 1;
                if (_this.$refs.bigImg !== undefined && _this.$refs.bigImg.length !== undefined) {
                    for (var i = 0; i < _this.$refs.bigImg.length; i++) {
                        if(i==0){
                            _this.$refs.bigImg[i].style.transform = 'translate(-50%, -50%) rotate(' + -90 + 'deg) scale(' + _this.currentScale + ')';
                            _this.$refs.bigImg[i].style.top = '50%';
                            _this.$refs.bigImg[i].style.left = '50%';
                        }else{
                            _this.$refs.bigImg[i].style.transform = 'translate(-50%, -50%) scale(' + _this.currentScale + ')';
                            _this.$refs.bigImg[i].style.top = '50%';
                            _this.$refs.bigImg[i].style.left = '50%';
                        }



                    }
                }

                // 图片容器复位
                if (_this.$refs.bigImgW !== undefined && _this.$refs.bigImgW.length !== undefined) {
                    for (var j = 0; j < _this.$refs.bigImgW.length; j++) {
                        _this.$refs.bigImgW[j].style.top = '0';
                        _this.$refs.bigImgW[j].style.left = '0';
                    }
                }
            },
            /**
             * @Author: wlq
             * @name: setScrollTop
             * @description: 滚动条滚动
             * @param page  页码
             * @return: {undefined}
             */
            setScrollTop: function (page) {
                var _pages = page;
                if (_pages && _pages > 0) {
                    _pages--;
                }
                $('#jsAppControllerXxcxspd').scrollTop(_pages * this.PAGE_A4_SIZE);
            },
            /**
             * @Author: wlq
             * @name: setSsReaderScroll
             * @description: 书生客户端滚动
             * @param page  页码
             * @return: {undefined}
             */
            setSsReaderScroll: function (page) {
                if (page > this.page * 1) {
                    this.postpage();
                } else if (page < this.page * 1) {
                    this.prepage();
                }
            },
            /**
             * @Author: wjing
             * @name: clickSh
             * @description:点击审核
             * @param {type}
             * @return: {undefined}
             */
            clickSh: function () {
                this.$refs.editSh.open();
            },
            /**
             * @Author: wjing
             * @name: clickCancel
             * @description: 取消审核弹窗
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
             * @description: 二次确认审核
             * @param {type}
             * @return: {undefined}
             */
            clickSubmit: function () {
                var flag = this.vaildateShjl();
                if (flag) {
                    this.$refs.submitShModel.open();
                } else {
                    Artery.notice.error({
                        title: '请填写必填项',
                    });
                }
            },
            /**
             * @Author: wjing
             * @name: clickCancelSh
             * @description: 关闭二次确认审核
             * @param {type}
             * @return: {undefined}
             */
            clickCancelSh: function () {
                this.$refs.submitShModel.close();
            },
            /**
             * @Author: wjing
             * @name: clickSubmitSh
             * @description: 确定二次审核
             * @param {type}
             * @return:
             */
            clickSubmitSh: function () {
                this.submitSh();
            },
            /**
             * @Author: wjing
             * @name: clickShjl
             * @description: 点击审核记录
             * @param {type}
             * @return: {undefined}
             */
            clickShjl: function () {
                this.getShjlList();
                this.$refs.editShjl.open();
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
                _this.$refs.bigImg.style.transform = 'rotate(" + _this.current + "deg)';
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
                _this.$refs.bigImg.style.transform = 'rotate(" + _this.current + "deg)';
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
                    if (_this.ins === 0) {
                        _this.img.imgfirst = true;
                    }
                    _this.img.imglast = false;
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
                    if (_this.ins === _this.spbsmjList.length - 1) {
                        _this.img.imglast = true;
                    }
                    _this.img.imgfirst = false;
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
                if (_this.$refs.bigImg !== undefined && _this.$refs.bigImg.length !== undefined) {
                    for (var i = 0; i < _this.$refs.bigImg.length; i++) {
                        if (i == 0) {
                            _this.$refs.bigImg[i].style.transform = 'translate(-50%, -50%) rotate(' + (this.deg-90) + 'deg) scale(' + this.currentScale + ')';
                        } else {
                            _this.$refs.bigImg[i].style.transform = 'translate(-50%, -50%) rotate(' + this.deg + 'deg) scale(' + this.currentScale + ')';
                        }
                    }
                }
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
                if (_this.currentScale < 0) {
                    _this.currentScale = 0;
                } else if (_this.$refs.bigImg !== undefined && _this.$refs.bigImg.length !== undefined) {
                    for (var i = 0; i < _this.$refs.bigImg.length; i++) {
                        if (i == 0) {
                            _this.$refs.bigImg[i].style.transform = 'translate(-50%, -50%) rotate(' + (this.deg - 90) + 'deg) scale(' + this.currentScale + ')';
                        } else {
                            _this.$refs.bigImg[i].style.transform = 'translate(-50%, -50%) rotate(' + (this.deg) + 'deg) scale(' + this.currentScale + ')';
                        }
                    }
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
             * 提交审核
             */
            submitSh: function () {
                var _this = this;
                Artery.ajax.post(this.xxspbshUrl, {
                    bh: this.bh,
                    spjl: this.tgType,
                    btgyy: this.btgyy
                }).then(function (result) {
                    if (result.success) {
                        Artery.notice.success({
                            title: '提交审核成功'
                        });
                    } else {
                        Artery.notice.error({
                            title: '操作不正确',
                            desc: result.message || ""
                        });
                    }
                    _this.closeEditShAndReload();
                }).catch(function (error) {
                    Artery.notice.error({
                        title: '请求超时'
                    });
                    console.log(error)
                    _this.closeEditShAndReload();
                })
                this.$refs.editSh.close();
                this.$refs.submitShModel.close();
            },
            /**
             * 验证审核结论
             */
            vaildateShjl: function () {
                if (this.tgType == '2') {
                    this.$refs.btyyyTextArea.validate();
                    return this.btgyy.trim() !== "";
                }
                return true;
            },

            /**
             * 关闭审核并刷新待审核页面
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
                        _this.jbxxDataObj = result.jbxx;
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
                    _this.$nextTick(function () {
                        _this.maxPage = Math.ceil($("#jsAppControllerXxcxspd .js-page-zs").height() / _this.PAGE_A4_SIZE);
                        // _this.initScrollEvent();
                    })
                })
            },
            /**
             * 获取审核记录
             */
            getShjlList: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/getShjl", {
                    params: {
                        cxh: _this.jbxxDataObj.cCxh
                    }
                }).then(function (result) {
                    _this.shjlList = result;
                    _this.$refs.scrollShjl.update(0, 0);
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
             * 初始化签章
             */
            goWhereViewSpd :function(){
                var _this = this;
                if (!!this.isDebugger) {
                    this.tgType = '1';
                    this.submitSh();
                } else {
                    _this.gzServiceType = _this.queryGzServiceType();
                    if (1== _this.gzServiceType) {//数科
                        _this.gzWindow = window.open(config.dirProjectRootPath + "/sh/shuke/index.html" + "?bh=" + _this.bh);
                        //将当前用户信息和jbxx 的编号缓存到服务器，以便回调中使用
                        Artery.ajax.get("/api/v1/cxgz/user?cxh=" + _this.bh);
                    } else if (2 == _this.gzServiceType) {//书生
                        _this.initQz();
                    }else{
                        Artery.notice.error({
                            title: '警告',
                            desc: '盖章服务商配置错误！'
                        });
                    }
                }
            },
            // 书生跳转
            initQz: function (/*callback*/) {
                var _this = this;
                if (!!this.isDebugger) {
                    this.tgType = '1';
                    this.submitSh();
                } else {
                    Artery.ajax.get(this.dcYysqSrc, {
                        timeout: 50000,
                        params: {
                            bh: this.bh,
                            sqbs: this.sqbs,
                            generatePng:true,
                            timestamp:new Date().getTime()
                        }
                    }).then(function (result) {
                        if (result) {
                            _this.info = result;
                            _this.clickGz();
                        }
                        /*if (callback && typeof callback === "function") {
                            callback();
                        }*/
                    });
                }
            },
            /**
             * 获取用印接口
             * page是当业务系统进行滚动时，通知书生客户端翻到第page页
             * 触发条件：1.初始化页面  2.当页码改变时，触发请求事件
             *
             */
            loadQzSrc: function () {
                var _this = this;
                Artery.ajax.get(this.dcQzSrc).then(function (result) {
                    // _this.info.page = _this.page + '';
                    // console.log("审核methods:loadQzSrc===>:  ");
                    // console.log(JSON.stringify(_this.info))
                    // if (!!_this.info.status) {
                    console.log(result);
                        _this.qzIframeSrc = result;
                    // } else {
                    //     console.log(_this.info)
                    // }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            /**
             * 注册监听滚动条高度。
             */
            initScrollEvent: function () {
                var _this = this;
                $('#jsAppControllerXxcxspd').scroll(function () {
                    _this.setSsReaderScroll(parseInt($(this).scrollTop() / _this.PAGE_A4_SIZE) + 1);
                });
            },
            /**
             * 上一页
             */
            prepage: function () {
                if (this.page > this.minPage) {
                    this.page--;
                } else {
                    this.page = this.minPage;
                }
                this.loadQzSrc();
            },
            /**
             * 下一页
             */
            postpage: function () {
                if (this.page < this.maxPage) {
                    this.page++;
                } else {
                    this.page = this.maxPage;
                }
                this.loadQzSrc();
            },
            /**
             * 添加窗口变化页面大小的事件
             */
            initWindowRelSize: function () {
                // $(window).onresize(function () {
                //     $('.fd-spbsmj-gz').height($('.fd-content-left').height()- 30)
                // })
            },
            /**
             * 审核
             */
            clickGz: function () {
                var _this = this;

                if (!!this.qzIframeSrc && this.spbsmjList.length > 0) {
                    _this.initSocketIO();
                    /*this.info.maxpage = this.spbsmjList.length + '';*/
                    _this.info.extend = {"socketKey":_this.socketKey};//socketKey在方法initSocketIO初始化，所以需要先执行方法initSocketIO
                    if(this.jbxxDataObj.cXsxx != undefined && this.jbxxDataObj.cXsxx == 2)
                    {
                        //线上审批  盖章加上指定位置参数（加上位置参数后页面上只显示确认盖章和关闭2个按钮）
                        this.info.isfinish = "1";
                        this.info.estampPositions = [];
                        for (var i = 0; i < this.spbsmjList.length; i++) {
                            this.info.estampPositions.push({"eName":"印章甲","pageNum":(i+1)+"","positionX":"130","positionY":"190"});
                        }
                    }

                    console.log("审核methods:clickGz===>:  ");
                    console.log(JSON.stringify(this.info))
                    console.log(this.qzIframeSrc);
                    var gzWindow = window.open(_this.qzIframeSrc + "?info=" + encodeURI(JSON.stringify(_this.info)));
                    this.gzWindow = gzWindow;
                    //将当前用户信息和jbxx 的编号缓存到服务器，以便回调中使用
                    Artery.ajax.get("/api/v1/cxgz/user?cxh=" + _this.bh);
                }
            },
            /**
             * 不予盖章
             */
            clickBtg: function () {
                this.$refs.editSh.open();
            },
            /**
             * 获取信息协查审批图片接口
             */
            loadSpdPngs: function () {
                var _this = this;
                Artery.ajax.get(this.shtpUrl, {
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
                            if(_this.jbxxDataObj.nMgxx==1){
                                break;
                            }
                        }
                        _this.spbgzpngList = arr;
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
             * 在盖章员盖章后生成的ofd转为png给审核员看，方便对比
             */
            loadGzSpdPngs: function () {
                var _this = this;
                Artery.ajax.get("/api/v1/cxsh/ofdtp", {
                    params: {
                        bh: this.bh
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
                        _this.spbgzpngList = arr;
                        _this.initImg();
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
            okSpjlModal: function(){
                window.opener && window.opener.location.reload();
                window.close();
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
                if(message=='ysh'){
                	 this.$refs.editWidiow.open();
                }else{
                	window.opener && window.opener.location.reload();
               		window.close();
                }
                // console.log('Socket receive data:' + message);
                // var data = JSON.parse(message);
                //刷新列表数据

            }
        },
        created: function () {
            var params = Artery.parseUrl();
            this.bh = params.bh || '';
            this.sqbs = params.sqbs || '';
            // this.loadXxxcspb();
            // 20210105 去掉左侧图片加载
            this.loadSpdPngs();
            // this.loadGzSpdPngs();
            // this.initQz(this.loadQzSrc);
            this.loadQzSrc();
            this.initWindowRelSize();
            this.getDebugger();

        },
        mounted: function () {
            var _this = this;
        }

    });
    window.vm = vm;
    return vm;
})
