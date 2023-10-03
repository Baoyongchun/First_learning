/**
 * @version:             2016.01.01
 * @creatTime:            2016.10.10
 * @updateTime:        2018.5.18
 * @author:                liuxiaolong
 * @name:                fdDataTable
 * @decription        数据代码转换表
 */
define('fdDataTable', ['config', 'jquery'], function (config, $) {
    return {
        codeList: function (type, callback) {
            $.get(config.dirProjectPath + "artery/code/list/" + type, function (res) {
                if(res) {
                    var list = [];
                    res.forEach(function (e) {
                        list.push({
                            codeType: type,
                            code: e.code,
                            name: e.name
                        });
                    });
                    callback(list);
                }
            });
        },
        /*查询事由*/
        table1001: {
            // table01: "谈话函询抽查核实",
            table04: "线索处置",
            table02: "初步核实",
            table03: "审查调查"
        },
        /*职级*/
        table1002: {
            table103: "正厅局级",
            table104: "副厅局级",
            table105: "正县处级",
            table106: "副县处级",
            table107: "正乡科级",
            table108: "副乡科级",
            table109: "一般干部",
            table201: "一级巡视员",
            table202: "二级巡视员",
            table203: "一级调研员",
            table204: "二级调研员",
            table205: "三级调研员",
            table206: "四级调研员",
            table207: "一级主任科员",
            table208: "二级主任科员",
            table209: "三级主任科员",
            table210: "四级主任科员",
            table211: "一级科员",
            table212: "二级科员",
            table902: "其他人员（金融机构）",
            table903: "其他人员（国有企业）",
            table904: "其他人员（事业单位）",
            table905: "其他人员（农村）",
            table906: "其他人员（社区）",
            table909: "其他人员（其他）",
            table999: "不详"
        },
        /*性别*/
        table1003: {
            table1: "男",
            table2:
                "女",
            table3:
                "其他"
        }
        ,
        /*是否*/
        table1004: {
            table1: "是",
            table2:
                "否"
        }
        ,
        /*申请分类*/
        table1005: {
            table0: "全部",
            table1:
                "定向核查",
            table2:
                "主体身份核实"
        }
        ,
        /*名族*/
        table1006: {
            table1: "汉族",
            table2:
                "蒙古族",
            table3:
                "回族",
            table4:
                "藏族",
            table5:
                "维吾尔族",
            table6:
                "苗族",
            table7:
                "彝族",
            table8:
                "壮族",
            table9:
                "布依族",
            table10:
                "朝鲜族",
            table11:
                "满族",
            table12:
                "侗族",
            table13:
                "瑶族",
            table14:
                "白族",
            table15:
                "土家族",
            table16:
                "哈尼族",
            table17:
                "哈萨克族",
            table18:
                "傣族",
            table19:
                "黎族",
            table20:
                "傈僳族",
            table21:
                "佤族",
            table22:
                "畲族",
            table23:
                "高山族",
            table24:
                "拉祜族",
            table25:
                "水族",
            table26:
                "东乡族",
            table27:
                "纳西族",
            table28:
                "景颇族",
            table29:
                "柯尔克孜族",
            table30:
                "土族",
            table31:
                "达斡尔族",
            table32:
                "仫佬族",
            table33:
                "羌族",
            table34:
                "布朗族",
            table35:
                "撒拉族",
            table36:
                "毛南族",
            table37:
                "仡佬族",
            table38:
                "锡伯族",
            table39:
                "阿昌族",
            table40:
                "普米族",
            table41:
                "塔吉克族",
            table42:
                "怒族",
            table43:
                "乌孜别克族",
            table44:
                "俄罗斯族",
            table45:
                "鄂温克族",
            table46:
                "德昂族",
            table47:
                "保安族",
            table48:
                "裕固族",
            table49:
                "京族",
            table50:
                "塔塔尔族",
            table51:
                "独龙族",
            table52:
                "鄂伦春族",
            table53:
                "赫哲族",
            table54:
                "门巴族",
            table55:
                "珞巴族",
            table56:
                "基诺族"
        }
        ,
        /*证件类型*/
        table1007: {
            table10: "居民身份证",
            table20: "往来台湾通行证",
            table30: "往来港澳通行证",
            table40: "中国公民护照"
        }
        ,
        /*状态列表状态*/
        table1008: {
            table0: "全部",
            table1: "未打印",
            table2:
                "已打印",
            table3:
                "已反馈"

        }
        ,
        /*核实主体*/
        table1009: {
            table1: "自然人",
            table2:
                "机构"

        },
        table1010: {
            table01: "自然人",
            table02:
                "机构",
            table03:
                "车牌号",
            table04:
                "银行账/卡号",
            table05:
                "手机号"
        }
        ,
        /*查询项*/
        table1011: {
            table1: "人口",
            table2:
                "出入境",
            table3:
                "机动车",
            table4:
                "驾驶证"
        }
        ,
        /*单位证件类型*/
        table1012: {
            table01: "统一社会信用代码证",
            table02: "组织机构代码证"
        }
        ,
        table1013: {
            table0: "全部",
            table1:
                "待审核",
            table2:
                "未通过",
            table3:
                "已通过",
            table4:
                "已过期"
        }
        ,
        table1014: {
            table1: "未生效",
            table2: "生效",
            table3: "失效"
        },
        table1015: {
            table1: "正国",
            table2: "副国",
            table3: "正部",
            table4: "副部",
            table5: "正局（厅）",
            table6: "副局（厅）",
            table7: "正处",
            table8: "副处",
            table9: "正科",
            table10: "副科",
            table11: "科员",
            table12: "见习",
            table13: "未定职",
            table14: "无",
            table15: "专业技术七级",
            table16: "专业技术八级",
            table17: "专业技术九级",
            table18: "专业技术十级",
            table19: "专业技术十一级",
            table20: "专业技术十二级",
            table21: "技术工一级",
            table22: "技术工二级",
            table23: "技术工三级",
            table24: "技术工四级",
            table25: "技术工五级",
            table26: "普通工",
            table33: "正战区",
            table34: "副战区",
            table35: "正军",
            table36: "副军",
            table27: "正师",
            table28: "副师",
            table29: "正团",
            table30: "副团",
            table31: "正营",
            table32: "副营",
            table37: "一级巡视员",
            table38: "二级巡视员",
            table39: "一级调研员",
            table40: "二级调研员",
            table41: "三级调研员",
            table42: "四级调研员",
            table43: "一级主任科员",
            table44: "二级主任科员",
            table45: "三级主任科员",
            table46: "四级主任科员",
            table47: "一级科员",
            table48: "二级科员"
        },
        table1016: {
            table1: "启用",
            table2: "停用"
        },
        table1017: {
            table1: "接口查询",
            table2: "落地数据查询"
        },
        table1018: {  //查询项管理的协助查询单位

        },
        table1019: {
            table01: "正常",
            table02: "停用",
            table03: "注销",
            table04: "锁定"
        },
        table1020: {
            table04: "银行账/卡号",
            // 暂时屏蔽通过手机号查询银行账号的功能
            //2020-07-10 新需求，又打开了
            table05: "手机号"
        },
        table1021: {
            table1: "总队总",
            table2: "点对点"
        },
        table1022: {
            table1: "委部领导",
            table2: "副部长级室主任",
            table3: "副部级巡视专员",
            table4: "副部级干部",
            table5: "秘书长",
            table6: "副秘书长",
            table7: "部长",
            table8: "常务副部长",
            table9: "副部长",
            table10: "书记",
            table11: "常务副书记",
            table12: "副书记",
            table13: "机关纪委书记",
            table14: "机关工会主席",
            table15: "正局级巡视专员",
            table16: "副局级巡视专员",
            table17: "主任",
            table18: "副主任",
            table19: "主任助理",
            table20: "副局长",
            table21: "局长",
            table22: "社长",
            table23: "副社长",
            table24: "社长助理",
            table25: "总编辑",
            table26: "副总编辑",
            table27: "党委书记",
            table28: "党委副书记",
            table29: "纪委书记",
            table30: "院长",
            table31: "副院长",
            table32: "正局员",
            table33: "副局员",
            table34: "副局级干部",
            table35: "处长",
            table36: "负责人",
            table37: "正处员",
            table38: "副处长",
            table39: "机关团委书记",
            table40: "机关团委副书记",
            table41: "副处员",
            table42: "主任科员",
            table43: "副主任科员",
            table44: "科员",
            table45: "直属单位专业技术人员",
            table46: "工人",
            table47: "未定职人员",
            table48: "组长",
            table49: "副组长",
            table50: "纪工委书记",
            table51: "纪工委副书记",
            table52: "纪工委委员",
            table53: "纪委书记",
            table54: "纪委副书记",
            table55: "监察部部长",
            table56: "监察部副部长",
            table57: "监察室主任",
            table58: "监察室副主任",
            table59: "纪委常委",
            table60: "监察厅副厅长",
            table61: "监察局副局长",
            table62: "无",
            table63: "正处级巡视专员",
            table64: "副处级巡视专员",
            table65: "国家预防腐败局副局长",
            table66: "正局级干部",
            table67: "总务部主任",
            table68: "工作人员",
            table69: "网络中心技术主任",
            table70: "秘书",
            table71: "干事"
        },
        table1023: {
            table1: "中央纪委书记",
            table2: "中央纪委主持日常工作的副书记(国家监委主任)",
            table3: "分管委领导",
            table4: "承办部门主要负责人"

        },
        table1024: {
            table100: "居民身份证",
            table300: "往来台湾通行证",
            table400: "往来港澳通行证",
            // table500: "机动车驾驶证",
            table600: "中国公民护照",
            table902: "组织机构代码",
            table903: "统一社会信用代码",
            table904: "纳税人识别号"
        },
        table1025: {
            table01: "统一社会信用代码证",
            table02: "组织机构代码证"
        },
        table1026: {
            table1: "中央纪委书记",
            table2: "主持日常工作副书记",
            table3: "分管委领导",
            table4: "承办部门主要负责人"

        },
        table1027: {
            table1: "工作证审核"
        },
        table1028: {
            table0: "未读",
            table1: "已读"
        },
        table1029: {
            table1: "已发布",
            table0: "未发布"
        }
    }


});
