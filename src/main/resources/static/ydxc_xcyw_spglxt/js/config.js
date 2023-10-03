/**
 * Created by lenovo on 2016/5/31.
 */

function getLocalPath(isAbsUrl) {
    var curWwwPath = window.location.href;
    var pathName = window.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPath = curWwwPath.substring(0, pos);
    // return isAbsUrl ? (localhostPath + '/') : 'http://172.16.193.177:80/';
    return isAbsUrl ? (localhostPath + '/') : '';
    // return isAbsUrl ? (localhostPath + '/') : 'http://172.16.192.157:80/';
}

define([], function () {
    var localPath = getLocalPath(false);
    var absolutePath = getLocalPath(true);
    //  获取项目绝对地址，传入false，那么就是相对地址
    /*var  params = fdGlobal.getLocalParams();*/
    //  根目录文件夹
    var rootFolder = '..';
    var config = {
        isDebug: false, //  是否是调试模式，true 为json数据，false为服务器数据
        methodGet: 'get', // ajax查询方式   get
        methodPost: 'post', // ajax查询方式  post
        methodDelete: 'delete', // ajax查询方式  post
        url: {}, //  url链接,也就是数据的地址
        showLog: false, // 是否显示日志
        dirJsPath: localPath + rootFolder + '/js/app/', //js直接路径
        dirCssPath: localPath + rootFolder + '/css/', //css直接路径
        dirJsonPath: localPath + rootFolder + '/json/', //json直接路径
        dirTemplatePath: localPath + rootFolder + '/pages/template/', //模板的根路径
        dirHtmlPath: localPath + rootFolder + '/pages/', //html直接路径
        dirProjectPath: absolutePath, //项目路径
        dirProjectRootPath: localPath + rootFolder ,
    };
    // json对应的路径
    var localUrl = {
        // 民间借贷首页模块
        index: {},
        frame: {
            // 登录人身份
            loginPerson: config.dirJsonPath + 'loginPerson/current.json',
            //ip管理数据
            getIpinfo: config.dirJsonPath + 'ipgl/ipinfo.json',
            //编辑时请求文件name和id地址
            ipGlBianji: config.dirJsonPath + 'ipgl/ipGlBianji.json',

            // 查询申请记录
            queryXxcx: config.dirJsonPath + 'cxsqjl/queryXxcx.json',

            // 查询行为记录
            queryCzxw: config.dirJsonPath + 'czxwjl/queryCzxw.json',

            // 工作证管理
            getGzzspList: config.dirJsonPath + 'gzzsp/gzzsp.json',

            // 组织机构用户管理
            getZzjgList: config.dirJsonPath + 'zzjgyhgl/zzjgyhgl.json',

            // 查询申请
            cxytztgData: config.dirJsonPath + 'cxsq/cxsq.json',

            // 审批单信息queryXxcxspd
            querySpdxx: config.dirJsonPath + 'spdxx/spdxx.json',

            // 审批表
            queryXxcxspd: config.dirJsonPath + 'xxcxspd/xxcxspd.json',

            //信息定向查询审批表(打印)
            queryXxcxspdPrint: config.dirJsonPath + 'xxcxspd/xxdxcxspb.json',

            //二维码
            queryQrCode1: config.dirJsonPath + 'xxcxspd/ewm.json',

            // 查询下拉项
            CxxSlectTree: config.dirJsonPath + 'dxcx/select.json',
            // 城市
            CxxSlectTreeCity: config.dirJsonPath + 'dxcx/city.json',
            // 银行
            CxxSlectTreeBack: config.dirJsonPath + 'dxcx/back.json'
        }
    };
    // 服務器对应的路径
    var serverlUrl = {
        // 民间借贷首页模块
        index: {},
        frame: {
            //框架页面json
            msFrame: config.dirJsonPath + 'frame/msFrame.json',
            //获取登录人信息（id）
            getUserId: config.dirProjectPath + 'api/v1/admin/currently/user',
            //获取登陆人权限
            getQx: config.dirProjectPath + 'artery/organ/right/actions/getCurrentUserRights',
            //监督员-信息查询
            queryXxcx: config.dirProjectPath + 'api/jdsj/sqjl',
            /*//监督员-czxw
            queryCzxw: config.dirProjectPath + 'api/jdsj/czxw',*/
            //监督员-czxw
            queryCzxw: config.dirProjectPath + 'api/sjrz/czxw',
            //信息定向查询审批表
            queryXxcxspd: config.dirProjectPath + 'api/approvalDoc/1',
            //信息定向查询审批表(打印)
            queryXxcxspdPrint: config.dirProjectPath + 'api/approvalDoc/printable/1',
            //主体身份核实审批表
            queryZtsfhsspd: config.dirProjectPath + 'api/approvalDoc/2',
            //主体身份核实审批表(打印)
            queryZtsfhsspdPrint: config.dirProjectPath + 'api/approvalDoc/printable/2',
            //二维码
            queryQrCode1: config.dirProjectPath + 'api/approvalDoc/qrcode/1',
            //二维码
            queryQrCode2: config.dirProjectPath + 'api/approvalDoc/qrcode/2',
            //条形码
            querybarCode: config.dirProjectPath + 'api/approvalDoc/barcode',
            //申请主体身份核实（新建）
            querySqztsfhs: config.dirProjectPath + 'api/spd/creation/content',
            recordPrintOperate: config.dirProjectPath + 'api/spd/print/log',
            //申请主体身份核实(编辑)
            querySqztsfhsEdit: config.dirProjectPath + 'api/zths/jz',
            //信息查询(编辑)
            queryXxcxEdit: config.dirProjectPath + 'api/xxcx/jz',
            //主体身份核实表单内容
            getZthsinfos: config.dirProjectPath + 'api/zths/infos',
            //审批表信息查询页面
            querySpdxx: config.dirProjectPath + 'api/spd/info',
            //删除审批表信息
            deleteSpdxx: config.dirProjectPath + 'api/spd/sc',
            // 新建审批表时校验用户工作证
            createSpbPermissionUrl: config.dirProjectPath + 'api/spd/permission/create',
            /*//定向查询表单内容
            getXxcxinfos:config.dirProjectPath+'api/spd/info',*/
            //查询审批表保存
            getXxcxinfos: config.dirProjectPath + 'api/spd/forms',
            //查询审批表编辑
            getXxcxform: config.dirProjectPath + '/api/spd/forms',
            // 上传被调查对象
            uploadBdcdx: config.dirProjectPath + 'api/spd/bdcdx/excel',
            confirmUploadBdcdx: config.dirProjectPath + 'api/spd/bdcdx/excel/confirm',
            //编辑数据时获取数据详细信息接口
            getBjsj: config.dirProjectPath + '/api/sjy',
            //新建ip
            xjip: config.dirProjectPath + 'api/fwip/ips',
            // 批准依据
            pzyjUrl: config.dirProjectPath + 'api/fwip/ipFile',
            //ip列表
            getIpinfo: config.dirProjectPath + 'api/fwip/info',
            //删除ip
            scIp: config.dirProjectPath + 'api/fwip/sc',
            //获取依据图
            getYjPic: config.dirProjectPath + 'api/fwip/xs',
            //工作证审批列表
            getGzzspList: config.dirProjectPath + 'api/gzz/lb',
            //获取工作证图片

            getGzzPic: config.dirProjectPath + 'api/gzz/showimg',
            //工作证是否通过接口

            getGzzSftg: config.dirProjectPath + 'api/gzz/infos',
            //个人信息维护接口

            getGrxxwh: config.dirProjectPath + 'api/gzz/gr',
            //个人信息维护提交接口

            getGrxxwhTj: config.dirProjectPath + 'api/gzz/ins',

            //工作证有效性
            gzzValidity: config.dirProjectPath + 'api/gzz/validity',
            // 从临时文件夹中获取工作证
            empcardFromTemp: config.dirProjectPath + 'api/gzz/temp',
            //组织机构用户管理列表接口
            getZzjgList: config.dirProjectPath + 'api/v1/admin/allSubOrgan',

            //查询项选择树
            CxxSlectTree: config.dirProjectPath + 'api/cxx/select',
            CxxSlectTreeBack: config.dirProjectPath + 'api/cxx/extend',
            cxxSearchChild: config.dirProjectPath + 'api/cxx/input/child',
            //查询项二级选择树
            CxxEjSlectTree: config.dirProjectPath + '/api/codeTree/2002/1',
            //户籍选择树
            getHjSlectTree: config.dirProjectPath + '/api/codeTree/2001/2',
            getHjSlectTreeJson: config.dirJsonPath + 'frame/hj.json',
            //组织机构用户管理列表头像
            getZzjgTx: config.dirProjectPath + 'api/v1/admin/showtx',
            // 组织机构用户管理树，得到用户当前选中的部门的单位名称
            getZzjgCorpName: config.dirProjectPath + 'api/v1/admin/getDeptPartenName',
            //组织机构用户管理配置接口
            getZzjgPzxx: config.dirProjectPath + 'api/v1/admin/pzxx',

            //组织机构用户管理配置  配置信息角色接口
            getZzjgPzjs: config.dirProjectPath + 'api/v1/admin/getAllRoles',
            //组织机构用户管理配置  配置信息权限接口
            getZzjgPzqx: config.dirProjectPath + 'api/v1/admin/getQxList',

            //组织机构用户管理配置  配置信息保存
            getZzjgPzbc: config.dirProjectPath + 'api/v1/admin/addRole',

            //非组织机构用户管理配置  工作证
            getZzjgGzz: config.dirProjectPath + 'api/gzz/showimg',

            //组织机构用户管理配置  工作证
            getZzjgGzzZy: config.dirProjectPath + 'api/v1/admin/showGzz',

            //导出组织机构信息
            exportZzjg: config.dirProjectPath + 'api/syncorgan/action/exportOrgan',

            //工作证管理信息
            exportGzzgl: config.dirProjectPath + 'api/cxygl/lb',

            //查询项管理列表接口
            getCxxglList: config.dirProjectPath + 'api/sjy/info',

            //启用或不启用接口
            getCxxglqy: config.dirProjectPath + 'api/sjy/plcz',

            //启用或不启用全选接口
            getCxxglqx: config.dirProjectPath + 'api/sjy/qx',

            //查询项管理编辑新建保存接口
            getCxxglSvae: config.dirProjectPath + 'api/sjy',
            //查询项管理编辑保存接口
            getCxxglBj: config.dirProjectPath + 'api/sjy',

            //查询项管理获取协助查询单位
            getCxxglCxdw: config.dirProjectPath + 'api/sjy/sjyfl',

            //预览工作证接口
            getCxxglZjgzz: config.dirProjectPath + 'api/gzz/showzjgzz',

            //修改密码
            getChangePassword: config.dirProjectPath + '/api/admin/password',

            //修改密码
            getUnlock: config.dirProjectPath + '/api/admin/ryxx/actions/unlock',

            //获取未审批数
            serverUrlWsps: config.dirProjectPath + '/api/gzz/dshnumber',
            //新建协查单位
            getXjxdw: config.dirProjectPath + '/api/sjy/fls',
            //新建和编辑专案组
            getXjzaz: config.dirProjectPath + 'api/v1/admin/zazs',
            //判断是否是专案组
            getPdzaz: config.dirProjectPath + 'api/v1/admin',
            //删除专案组
            getSczaz: config.dirProjectPath + 'api/v1/admin/deleteZaz',
            //新建用户
            getNewUser: config.dirProjectPath + 'api/v1/admin/user',
            //修改密码
            serverUrlXgmm: config.dirProjectPath + '/api/v1/admin/password',
            //修改头像
            editUser: config.dirProjectPath + '/api/v1/admin/edit/user',
            // 上传工作证文件
            uploadEmpCard: config.dirProjectPath + 'api/admin/user/empcard',
            //获取新建专案组的编码
            getXjZazCode: config.dirProjectPath + 'api/v1/admin/sctnumber',
            //获取邮件设置的页面数据showgzz
            getMailData: config.dirProjectPath + 'api/mail/info',
            //保存邮件设置的页面数据
            postMailData: config.dirProjectPath + 'api/mail/infos',
            //查询员通知通告列表数据
            cxytztgData: config.dirProjectPath + '/api/notice/list',
            //查询员通知通告查看
            cxytztCk: config.dirProjectPath + '/api/notice/status',
            //查询员通知通告未查看消息
            cxytztWckxx: config.dirProjectPath + '/api/notice/noReadNoticesList',
            //通知通告信息列表
            tztgDataUrl: config.dirProjectPath + '/api/notice/sendList',
            //通知通告发送新建消息
            fsxjxxUrl: config.dirProjectPath + '/api/notice/createNotice',
            //通知通告消息个数
            fsxjxxUrltotal: config.dirProjectPath + '/api/notice/total',
            //删除通知通告暂存数据
            tztgRemove: config.dirProjectPath + '/api/notice/deleteNotice',
            //消息提醒弹窗的列表接口
            xxtxUrl: config.dirProjectPath + '/api/notice/noticing',
            //ip管理上传多个文件时暂存文件接口
            ipGlMoreFile: config.dirProjectPath + '/api/fwip/ipFile',
            //ip管理上传下载接口
            ipGlDownLoad: config.dirProjectPath + '/api/fwip/down',
            //ip管理上传删除接口
            ipGlDelete: config.dirProjectPath + '/api/fwip/delete',
            //ip管理上传编辑接口
            ipGlBianji: config.dirProjectPath + '/api/fwip/bianji',
            ipGlLook: config.dirProjectPath + '/api/fwip/look',
            //统一社会性代码
            serverUrlTyshxydm: config.dirProjectPath + '/api/spd/actions/getTyshxydm',
            //获取组织机构代码
            serverUrlZzjgdm: config.dirProjectPath + '/api/spd/actions/getZzjgdm/',

            //查询申请列表
            serverUrlCxsqlb: config.dirProjectPath + '/api/v1/cxsq/list',
            //查询结果列表
            serverlUrlCxJg: config.dirProjectPath + '/api/v1/cxjg/list',
            // 结果列表-已读
            serverUrlCxJgYd: config.dirProjectPath + '/api/v1/cxjg/sjzt',
            // 结果列表-数量
            serverUrlCxJgCount: config.dirProjectPath + '/api/v1/cxjg/sjzt/count',
            // 退回申请列表
            serverUrlThsqlb: config.dirProjectPath + '/api/v1/thsq/list',
            //查询流程
            serverUrlCxlc: config.dirProjectPath + '/api/v1/cxsq/flow/', //{sqid}
            //反馈进度
            serverUrlFkjd: config.dirProjectPath + '/api/v1/cxsq/fkjd/', //{sqid}
            //删除申请
            serverUrlScsq: config.dirProjectPath + '/api/v1/cxsq/', //{sqid}
            //提交审核
            serverUrlTjsh: config.dirProjectPath + '/api/v1/cxsq/tjsh/', //{sqid}
            //保存文号配置 获取文号配置 删除文号配置
            cxwhpzUrl: config.dirProjectPath + '/api/v1/cxwhpz',
            //编辑保存文号配置
            bjcxwhpzUrl: config.dirProjectPath + '/api/v1/cxwhpz/bj',
            //启用文号配置
            qywhpzUrl: config.dirProjectPath + '/api/v1/cxwhpz/qypz',
            //停用文号配置
            tywhpzUrl: config.dirProjectPath + '/api/v1/cxwhpz/typz',
            //获取文号配置列表数据
            hqwhpzlbUrl: config.dirProjectPath + '/api/v1/cxwhpz/whlb',
            //获取查询审核列表数据
            hqcxshlbUrl: config.dirProjectPath + '/api/v1/cxshlb',
            //线下审批表的审核接口
            xxspbshUrl: config.dirProjectPath + 'api/v1/spbsh',
            //获取单位下的所有部门接口
            hqdwbmUrl: config.dirProjectPath + '/api/v1/cxsh/sqdw',
            //信息查询审批表信息接口
            xxxcspbUrl: config.dirProjectPath + 'api/v1/spd/ckspb/', //{cBh}
            //信息查询审批表信息接口--盖章
            gztpUrl: config.dirProjectPath + 'api/v1/cxgz/gztp/',
            //信息查询审批表信息接口--审核
            shtpUrl: config.dirProjectPath + 'api/v1/cxsh/shtp/',
            // 登录人身份
            loginPerson: config.dirProjectPath + 'api/v1/admin/user/current',
            //单值代码
            serverUrlDzdm: config.dirProjectPath + 'api/v1/code/', //{codeType}
            //展现最近的用户的工作证
            gzzUrl: config.dirProjectPath + 'api/gzz/grById/',  //{cUserId}
            //用印申请接口（单文件）
            yysqSrc: config.dirProjectPath + "api/v1/bgt/yysq/wj",
            //获取用印接口（单文件）
            qzSrc: config.dirProjectPath + "api/v1/bgt/yy/wj",
            //多文件用印申请接口（多文件）
            dwjYysqSrc: config.dirProjectPath + "api/v1/bgt/yysq/wjs",
            //获取多文件用印接口（多文件）
            dwjQzSrc: config.dirProjectPath + "api/v1/bgt/yy/wjs",
            //多次用印申请接口（多文件）
            dcYysqSrc: config.dirProjectPath + "api/v1/bgt/yysq/dc",
            //获取多次用印接口（多文件）
            dcQzSrc: config.dirProjectPath + "api/v1/bgt/yy/dc",
            //查看审批表
            ckspbSrc: config.dirProjectPath + "api/v1/spb/view",
            //查看结果
            serverUrlCkjg: config.dirProjectPath + "api/v1/cxsq/cxjg/",  //{sqid}
            // 工作证管理证件照上传
            uploadAddress:config.dirProjectPath + "api/gzz/empcard",
            // 个人信息的工作证
            getGrxxGzz:config.dirProjectPath + "api/gzz/showimg",
            // 上传照片
            uploadEmpPhoto: config.dirProjectPath + '/api/v1/admin/empPhoto',
            //获取印模图片
            getYmPic: config.dirProjectPath + 'api/v1/uploadBaseData/show/ymImage',
            // 获取已上传审批单
            serverUrlYscspd: config.dirProjectPath + "api/v1/cxsq/spd/",  //{sqid}
            //上传审批单
            serverUrlScspd: config.dirProjectPath + "api/v1/cxsq/uploadSpd/",   //{sqid}
            //删除审批单
            serverUrlDelspd: config.dirProjectPath + "api/v1/cxsq/deleteSpd/",   //{sqid}
            serverUrlGetPng: config.dirProjectPath + "api/spd/files/png/",
            //socket连接URL
            SOCKET_SEND_PREFIX: "/queue",
            //socket连接URL
            SOCKET_CONNECT_URL: config.dirProjectPath + "/queueServer",
            //stomp订阅和监听前缀
            STOMP_SUBSCRIBE_PREFIX: "/user/",
            //stomp订阅和监听前缀
            STOMP_SUBSCRIBE_MESSAGE: "/message",
            //获取查询盖章数据
            cxgzlbUrl: config.dirProjectPath + '/api/v1/cxgzlb',
            //盖章结论接口
            gzshUrl: config.dirProjectPath + '/api/v1/gzsh',
            //获取盖章记录接口
            gzjllbUrl: config.dirProjectPath + '/api/v1/gzjllb',
            // 地方同步组织机构
            tbzzjgUrl: config.dirProjectPath + 'api/syncorgan/uploadJson',
            // 组织用户管理-重置密码
            czmmUrl: config.dirProjectPath + '/api/v1/admin/initpwd',
            // 组织用户管理-解锁
            jsUrl: config.dirProjectPath + '/api/v1/admin/account/unLockAccount',
            //上传基础数据管理列表
            jcsjListUrl: config.dirProjectPath + 'api/v1/uploadBaseData/list',
            //上传基础数据管理列表
            tbJcsjListUrl: config.dirProjectPath + 'api/v1/uploadBaseData/tbList',
            //基础数据上传文件地址
            jcsjUploadUrl: config.dirProjectPath + 'api/v1/uploadBaseData/upload/', //{type}
            //基础数据下载文件地址
            jcsjDownloadUrl: config.dirProjectPath + 'api/v1/uploadBaseData/download',
            // 地方同步基础数据
            syncJcsjUrl: config.dirProjectPath + 'api/v1/uploadBaseData/sync',
            // 中央基础数据列表
            zyJcsjListUrl: config.dirProjectPath + 'api/v1/uploadBaseData/center',
            // 中央基础数据模块组织机构列表
            zyJcsjOrganListUrl: config.dirProjectPath + 'api/v1/uploadBaseData/center/organs',
            // 导出组织机构
            exportJcsjUrl: config.dirProjectPath + 'api/v1/uploadBaseData/center/export',
            //已审核列表==>重发按钮
            cfUrl:config.dirProjectPath +"api/v1/cxsh/cf",
            updateNoticeStatusUrl: config.dirProjectPath + "api/notice/updateReadStatus",
            //待审批
            dspUrl: config.dirProjectPath + "api/v1/cxsq/dsp",
            //已审批
            yspUrl: config.dirProjectPath + "api/v1/cxsq/ysp",
            //线上审批记录
            xsspjl: config.dirProjectPath + '/api/v1/cxsq/spjl',
            spdOfdFileUrl: config.dirProjectPath + 'api/spd/files/ofd',
            cxySpShtgUrl: config.dirProjectPath + 'api/v1/cxsq/cxysptg',
            sprSptgUrl: config.dirProjectPath + 'api/v1/cxsq/sprsptg',
			spShtgUrl: config.dirProjectPath + 'api/v1/cxsq/sptg',
            scanUploadUrl: config.dirProjectPath + 'api/spd/files/scan',
            getAuthCodeUrl: config.dirProjectPath + 'api/spd/files/authcode',
            getFileUrl: config.dirProjectPath + 'api/spd/files',
            sendBackUrl: config.dirProjectPath + 'api/v1/cxsq/sendback',
            exportAllCxsqUrl: config.dirProjectPath + 'api/v1/cxsq/export/all',
            sendBackListUrl: config.dirProjectPath + 'api/v1/cxsq/sendback/list',
            exportFlagUrl: config.dirProjectPath + 'api/v1/cxsq/export/flag',
            addSpjlUrl:  config.dirProjectPath +"api/v1/cxsq/addSpjl",
            //数科签章相关
            queryGzServiceType: config.dirProjectPath + "api/v1/shuke/queryGzServiceType",
            getMinioFileBySpid: config.dirProjectPath + "api/v1/shuke/getOfdOutStreamBySpid",
            saveQzOfd: config.dirProjectPath + "api/v1/shuke/saveQzOfd",
            viewQzOfd:config.dirProjectRootPath + "../../../../../../shuke/index.html",
            viewQzOfdCxy:config.dirProjectRootPath + "../../../../../shuke/index.html",
            exportOrganByFilter: config.dirProjectPath + "/api/syncorgan/action/exportOrganByFilter",
            ipOrMacUrl: config.dirProjectPath + '/api/v1/admin/edit/userIpOrMac',
            // 获取单位信息
            getCorpByTreeId: config.dirProjectPath + 'api/v1/admin/getCorp',
            //编辑单位配置信息
            editCorpConfig: config.dirProjectPath + 'api/v1/admin/editCorpConfig',
            // 日志监测行业分类
            getRzjcHyfl: config.dirProjectPath + 'api/v1/rzjc/rzjcHyfl',
            // 日志监测节点
            getRzjcNode: config.dirProjectPath + 'api/v1/rzjc/rzjcNode',
            //同时更新单位和用户角色
            updateRoleBatch: config.dirProjectPath + 'api/v1/admin/updateRoleBatch',
            bhjl: config.dirProjectPath + 'api/bhjl/',
            ckshbtgtp:config.dirProjectRootPath + "../../../bhck/index.html",
        }
    };
    config.url = config.isDebug ? localUrl : serverlUrl;
    /* config.localParams = params;*/
    return config;
});
