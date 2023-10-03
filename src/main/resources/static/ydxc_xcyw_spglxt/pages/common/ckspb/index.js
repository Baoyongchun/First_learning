// 查询记录模块
define(['extend/template1.js'], function(template1) {

    new Vue({
        el: '#jsAppControllerCkspb',
        mixins: [template1],
        data: {
            // 信息查询审批表数据
            xxxcb: {
                sqdw: '山西省忻州市纪委监委',
                sqbs: '第一纪检监察室',
                cxsqr: '王某',
                xzcxr: '例某',
                sy: '审查调查',
                jdjcdx: '赵某某',
                gzdw: '某某单位',
                zjdx: '某某职务',
                zj: '副处',
                gbglqx: '市管干部',
                spqx: '此件由县纪检监察机关主持日常工作的副书记审批',
                cbr: '李某某000',
                lxdh: '139xxxxxxxx/xxxx-xxxxxxxx'

            },

            // 查询对象数据列表
            cxdx: {
                // 自然人对象列表数据
                zrr: [{
                    xm: '张某',
                    zzhm: { value: '142xxxxxxxxxxxxxxx', type: '居民身份证' },
                    zj: '副处',
                    cxx: '银行账户，金融理财，交易流水'
                }, {
                    xm: '张某2',
                    zzhm: { value: '142xxxxxxxxxxxxxxx', type: '居民身份证' },
                    zj: '副处',
                    cxx: '银行账户，金融理财，交易流水'
                }, {
                    xm: '张某',
                    zzhm: { value: '142xxxxxxxxxxxxxxx', type: '居民身份证' },
                    zj: '副处',
                    cxx: '银行账户，金融理财，交易流水'
                }, {
                    xm: '张某2',
                    zzhm: { value: '142xxxxxxxxxxxxxxx', type: '居民身份证' },
                    zj: '副处',
                    cxx: '银行账户，金融理财，交易流水'
                }, {
                    xm: '张某',
                    zzhm: { value: '142xxxxxxxxxxxxxxx', type: '居民身份证' },
                    zj: '副处',
                    cxx: '银行账户，金融理财，交易流水'
                }],
                // 企业机构对象列表数据
                qyjg: [{
                        qyjgm: '某某股份有限公司',
                        zzhm: { value: '142xxxxxxxxxxxxxxx', type: '居民身份证' },
                        cxx: '银行账户，交易流水'
                    },
                    {
                        qyjgm: '某某股份有限公司',
                        zzhm: { value: '142xxxxxxxxxxxxxxx', type: '居民身份证' },
                        cxx: '银行账户，交易流水'
                    }
                ],
                // 银行账号对象列表数据
                yhzh: [{
                    value: 'xxx xxxx xxxx xxxx1',
                    cxx: '交易流水'
                }, {
                    value: 'xxx xxxx xxxx xxxx1',
                    cxx: '交易流水'
                }]
            }
        },
        // 创建
        created: function() {

        },
        methods: {
            changeSelect: function(name) {
                console.log('name')
            }
        }

    })


})