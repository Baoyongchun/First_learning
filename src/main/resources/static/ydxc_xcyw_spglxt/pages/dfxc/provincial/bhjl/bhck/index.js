/*
 * @Author: wjing
 * @Date: 2020-02-11 15:02:04
 * @LastEditors: wjing
 * @LastEditTime: 2020-02-20 16:32:33
 * @Description: 查询记录模块
 */
define([ 'jquery', 'dragFun', 'config'], function ( $, dragFun, config) {
    var _config = JSON.parse(JSON.stringify(config));
    //  单独设置，便于调试
    _config.showLog = true;
    var vm = new Vue({
        el: '#jsShbjsq',
        data: function () {
            return {
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
                //申请基本信息的编号
                jbxxCbh: '',
                //申请基本信息的申请标识
                splcId: '',
                //信息协查审批图片接口
                bhjlUrl: config.url.frame.bhjl,
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
            /**
             * 图片等比例缩放
             * @param Img  传入的图片, maxWidth  最大宽度, maxHeight   最大高度；
             */
            autoSize: function (Img, maxWidth, maxHeight) {
                $('.fd-picture-obj');
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
             * 获取信息协查审批图片接口
             */
            loadSpdPngs: function () {
                var _this = this;
                Artery.ajax.get(this.bhjlUrl+"shbtgtp", {
                    params: {
                        splcId: this.splcId,
                        jbxxCbh: this.jbxxCbh,
                        cxh:this.cxh
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
            this.splcId = params.splcId || '';
            this.jbxxCbh = params.jbxxCbh || '';
            this.loadSpdPngs();
            this.initWindowRelSize();

        },
        mounted: function () {
            var _this = this;
        }

    });
    window.vm = vm;
    return vm;
})
