/**
 * @version:             2016.01.01
 * @creatTime:            2016.10.10
 * @updateTime:        2018.5.18
 * @author:                liuxiaolong
 * @name:                fdCxxCode
 * @decription        通过被核查对象获取code类型来获取查询项数据
 */
define('fdCxxCode', [], function () {
    return {
    	codeList: [
        	{
        		name:'自然人',
        		code: '01'
        	},
        	{
        		name:'企业/机构',
        		code: '02'
        	},
        	{
        		name:'车牌号',
        		code: '03'
        	},
        	{
        		name:'银行账号',
        		code: '04'
        	},
        	{
        		name:'主体核实自然人',
        		code: '05'
        	},
        	{
        		name:'纳税人识别号',
        		code: '06'
        	},{
                name:'手机号',
                code: '05'
            }
        ]
        
          
    }


});