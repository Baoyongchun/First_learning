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
                tTzxxID: '',
                tzxxObj: {},
            }
        },
        methods: {
            //阿拉伯数字转换为简写汉字
            ArabiSimplified:function (Num) {
                for (var i = Num.length - 1; i >= 0; i--) {
                    Num = Num.replace(",", "")//替换Num中的“,”
                    Num = Num.replace(" ", "")//替换Num中的空格
                }
                if (isNaN(Num)) { //验证输入的字符是否为数字
                    //alert("请检查小写金额是否正确");
                    return;
                }
                //字符处理完毕后开始转换，采用前后两部分分别转换
                var part = String(Num).split(".");
                var newchar = "";
                //小数点前进行转化
                for (var i = part[0].length - 1; i >= 0; i--) {
                    if (part[0].length > 10) {
                        //alert("位数过大，无法计算");
                        return "";
                    }//若数量超过拾亿单位，提示
                    tmpnewchar = ""
                    perchar = part[0].charAt(i);
                    switch (perchar) {
                        case "0":
                            tmpnewchar = "零" + tmpnewchar;
                            break;
                        case "1":
                            tmpnewchar = "一" + tmpnewchar;
                            break;
                        case "2":
                            tmpnewchar = "二" + tmpnewchar;
                            break;
                        case "3":
                            tmpnewchar = "三" + tmpnewchar;
                            break;
                        case "4":
                            tmpnewchar = "四" + tmpnewchar;
                            break;
                        case "5":
                            tmpnewchar = "五" + tmpnewchar;
                            break;
                        case "6":
                            tmpnewchar = "六" + tmpnewchar;
                            break;
                        case "7":
                            tmpnewchar = "七" + tmpnewchar;
                            break;
                        case "8":
                            tmpnewchar = "八" + tmpnewchar;
                            break;
                        case "9":
                            tmpnewchar = "九" + tmpnewchar;
                            break;
                    }
                    switch (part[0].length - i - 1) {
                        case 0:
                            tmpnewchar = tmpnewchar;
                            break;
                        case 1:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "十";
                            break;
                        case 2:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "百";
                            break;
                        case 3:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "千";
                            break;
                        case 4:
                            tmpnewchar = tmpnewchar + "万";
                            break;
                        case 5:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "十";
                            break;
                        case 6:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "百";
                            break;
                        case 7:
                            if (perchar != 0) tmpnewchar = tmpnewchar + "千";
                            break;
                        case 8:
                            tmpnewchar = tmpnewchar + "亿";
                            break;
                        case 9:
                            tmpnewchar = tmpnewchar + "十";
                            break;
                    }
                    newchar = tmpnewchar + newchar;
                }
                //替换所有无用汉字，直到没有此类无用的数字为止
                while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
                    newchar = newchar.replace("零亿", "亿");
                    newchar = newchar.replace("亿万", "亿");
                    newchar = newchar.replace("零万", "万");
                    newchar = newchar.replace("零零", "零");
                }
                //替换以“一十”开头的，为“十”
                if (newchar.indexOf("一十") == 0) {
                    newchar = newchar.substr(1);
                }
                //替换以“零”结尾的，为“”
                if (newchar.lastIndexOf("零") == newchar.length - 1) {
                    newchar = newchar.substr(0, newchar.length - 1);
                }
                return newchar;
            },
            getFjTableData: function () {
                var _this = this;
                var _serverData = {
                    tTzxxID: _this.tTzxxID,
                };
                $.ajax({
                    method: "post",
                    url: '/api/xxfb/getFjList/',
                    data: _serverData,
                    dataType: 'json',
                    success: function (data) {
                        var fjhtml = '<ul>';
                        if (data.length > 0) {
                            console.log();
                            for (var i = 0; i < data.length; i++) {
                                fjhtml += "<li class='fjli' onClick=\"dwFile('"+data[0].cId+"')\">附件" + _this.ArabiSimplified(i+1) + ":" + data[0].wjmc + "</li>"
                            }
                        }
                        fjhtml += "</ul>";
                        document.getElementById("fjlb").innerHTML = fjhtml;
                    },
                    error: function (data, textStatus, errorThrown) {
                        //  报错信息
                        fdGlobal.requestError(data, textStatus, errorThrown);
                    }
                });
            },
            getTzxxData: function () {
                var _this = this;
                Artery.ajax.get('/api/v1/tzxx/' + _this.tTzxxID)
                    .then(function (result) {
                        _this.tzxxObj = result;
                        _this.tzxxObj.FBRDWMC=_this.tzxxObj.FBRDWMC;
                        _this.tzxxObj.FBSJ=_this.tzxxObj.fbsjStr;
                        document.getElementById("zhengwen").innerHTML = _this.tzxxObj.XXNR;
                    })
                    .catch(function (error) {
                        console.log(error);
                        return false;
                    });
            },
            getParamsFun: function () {
                var params = {};
                var winParamStr = window.location.search.substring(1);
                //给全局变量案件赋值
                params.tTzxxID = getParam("tTzxxID");

                //单个获取参数函数
                function getParam(key) {
                    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
                    var r = winParamStr.match(reg);
                    if (r == null) {
                        return "";
                    }
                    return r[2];
                }

                return params;
            },

        },
        created: function () {
            var _this = this;
            _this.tTzxxID = _this.getParamsFun().tTzxxID;
            _this.getTzxxData();
            _this.getFjTableData();
        },
        mounted: function () {

        }
    })
});
