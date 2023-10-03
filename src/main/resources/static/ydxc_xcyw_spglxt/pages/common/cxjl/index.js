// 查询记录模块
define(['extend/template1.js', 'fdGlobal', 'config'], function(template1, fdGlobal, config) {

    new Vue({
        el: '#jsAppControllerCxjl',
        mixins: [template1],
        data: {
            // sqdw为申请单位下拉框绑定的数据
            sqdw: [],
            // 申请单位选择后绑定的数据
            sqdwValue: null,
            // sqbm为申请单位下拉框绑定的数据
            sqbm: [],
            // 申请部门选择后绑定的数据
            sqbmValue: [],
            // 信息检索关键字
            keyword: '',
            optionCxjl: { //信息查询目录分页
                totalPage: 10,
                totalSize: 100,
                currentSize: 10,
                currentPage: 1,
                showPoint: false,
                showPage: 4,
                prev: ' ',
                next: " ",
                first: " ",
                last: " ",
                callback: function(num) {
                    /* console.log(num)*/
                }
            },
            // 总记录数
            zjls: 2,
            // 数据总数
            zh: 2,
            // 查询记录list
            // 查询记录list，表格数据
            cxjlDataList: [{}],
            //是否查询过
            queryFlag: false
        },
        // 创建
        created: function() {},
        methods: {
            // 查询按钮绑定事件
            requestCxjl: function() {

            },
            //    查看审批表打开弹框页面
            openSqb: function(row) {
                if(row.mgxx == 1  && row.canView != 1){
                    Artery.notice.warning({
                        title: "申请单包含敏感信息，无法查看！"
                    });
                    return
                }
                Artery.open({
                    targetType: '_blank',
                    url: '../../../approval/cgdyyl/index.html?cBh='+bh
                });
            }
        }

    })


})
