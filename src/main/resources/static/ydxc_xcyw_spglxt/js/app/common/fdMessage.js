/**
 * #info
 *
 * @author   wlq
 * @version  2020-03-04
 * @createTime  2020-03-04
 * @updateTime  2020-03-04
 * @description  module  eventbus
 * 组件之间通信的枢纽
 */
define('fdMessage', ['vue', 'fdEventBus'],
    /**
     * @param Vue
     * @param fdEventBus
     */
    function (Vue, fdEventBus) {
        window.onmessage = function (event) {
            if (event.data) {
                var _data = {};
                try {
                    _data = Object.prototype.toString.call(event.data) === '[object String]' ? JSON.parse(event.data) : {};
                } catch (e) {
                    _data = {
                        flag: 'error'
                    };
                }
                switch (_data.flag) {
                    // ip管理配置 新建
                    case 'ipglxj':
                        fdEventBus.$emit('appIpglXj', _data);
                        break;
                        // ip管理配置 编辑
                    case 'ipglBj':
                        fdEventBus.$emit('appIpglBj', _data);
                        break;
                        // ip配置删除
                    case 'ipglSc':
                        fdEventBus.$emit('appIpglSc', _data);
                        break;
                        // 新建专案组 编辑 删除 查看部门信息
                    case 'xjzaz':
                        fdEventBus.$emit('appXjzaz', _data);
                        break;
                        // 查询申请 --- 反馈进度
                    case 'CxsqFkjd':
                        fdEventBus.$emit('appCxsqFkjd', _data);
                        break;
                        // 查询申请 --- 查询流程
                    case 'CxsqCxlc':
                        fdEventBus.$emit('appCxsqCxlc', _data);
                        break;
                        // 查询申请 ---  确认删除
                    case 'CxsqRemove':
                        fdEventBus.$emit('appCxsqRemove', _data);
                        break;
                        // 查询申请 --- 提交审核
                    case 'CxsqTjsh':
                        fdEventBus.$emit('appCxsqTjsh', _data);
                        break;
                        // 查询申请 --- 提交申请
                    case 'CxsqTjsq':
                        fdEventBus.$emit('appCxsqTjsq', _data);
                        break;
                        // 查询申请 --- 查询
                    case 'CxsqCx':
                        fdEventBus.$emit('appCxsqCx', _data);
                        break;
                        // 查询申请 --- 审核不通过
                    case 'CxsqShbtg':
                        fdEventBus.$emit('appCxsqShbtg', _data);
                        break;
                    case 'Gzzsh':
                        fdEventBus.$emit('appGzzsh', _data);
                        break;
                    case 'CxjcCf':
                        fdEventBus.$emit('appCxjcCf', _data);
                        break;
                    case 'CxjcCfParent':
                        fdEventBus.$emit('appCxjcCfParent', _data);
                        break;
                        // 查询文号配置  编辑
                    case 'CxwhpzBj':
                        fdEventBus.$emit('appCxwhpzBj', _data);
                        break;
                        // 查询文号配置  停用
                    case 'CxwhpzTy':
                        fdEventBus.$emit('appCxwhpzTy', _data);
                        break;
                        // 查询文号配置  启用
                    case 'CxwhpzQy':
                        fdEventBus.$emit('appCxwhpzQy', _data);
                        break;
                        // 查询文号配置  删除
                    case 'CxwhpzSc':
                        fdEventBus.$emit('appCxwhpzSc', _data);
                        break;
                    case 'CxwhpzXj':
                        fdEventBus.$emit('appCxwhpzXj', _data);
                        break;
                        // 查询文号配置  删除parent
                    case 'CxwhpzScParent':
                        fdEventBus.$emit('appCxwhpzScParent', _data);
                        break;
                        // 查询申请  删除parent
                    case 'CxsqQrscParent':
                        fdEventBus.$emit('appCxsqQrscParent', _data);
                        break;
                        // 已审核 打开不通过原因
                    case 'YshBtgyy':
                        fdEventBus.$emit('appYshBtgyy', _data);
                        break;
                        // 已盖章 打开不盖章原因
                    case 'YgzBgzyy':
                        fdEventBus.$emit('appYgzBgzyy', _data);
                        break;
                        // 生成审批表
                    case 'scspb':
                        fdEventBus.$emit('appscspb', _data);
                        break;
                    case 'Xstjsp':
                        fdEventBus.$emit('appXstjsp', _data);
                        break;
                    //审批通过刷新待审批表格数据
                    case 'SxDsp':
                        fdEventBus.$emit('appSxDsp', _data);
                        break;
                    //盖章通过刷新待盖章表格数据
                    case 'SxDgz':
                        fdEventBus.$emit('appSxDgz', _data);
                        break;
                    //审核通过刷新待审核表格数据
                    case 'SxDsh':
                        fdEventBus.$emit('appSxDsh', _data);
                        break;
                        // 已审核-重发
                    case 'YshCf':
                        fdEventBus.$emit('appYshCf', _data);
                        break;
                        // 上传基础数据
                    case 'scjcsj':
                        fdEventBus.$emit('appScjcsj', _data);
                        break;
                        // 上传基础数据
                    case 'tbjcsj':
                        fdEventBus.$emit('appTbjcsj', _data);
                        break;
                    case 'notbjcsj':
                        fdEventBus.$emit('appNoTbjcsj', _data);
                        break;
                    // 查看工作证
                    case 'ckgzz':
                        fdEventBus.$emit('appCkgzz', _data);
                        break;
                    // 查看印模
                    case 'ckYm':
                        fdEventBus.$emit('appCkYm', _data);
                        break;
                    // 反馈意见管理--查看详情
                    case 'fkyjglCkxq':
                        fdEventBus.$emit('appFkyjglCkxq', _data);
                        break;
                    // 反馈意见管理--查看详情
                    case 'openLoading':
                        fdEventBus.$emit('appOpenLoading', _data);
                        break;
                    // 查询申请----提交审批
                    case 'tjspCxsq':
                        fdEventBus.$emit('appOpenCxsqTjsp', _data);
                        break;
                    // 查询申请----提交审批
                    case 'tjspCxsq_2':
                        fdEventBus.$emit('appOpenCxsqTjsp_2', _data);
                        break;
                    // 查询申请----审批记录
                    case 'spjlCxsq':
                        fdEventBus.$emit('appOpenCxsqSpjl', _data);
                        break;
                    // 资源目录管理的弹框
                    case 'openZymlglModal':
                        fdEventBus.$emit('appOpenZymlglModal', _data);
                        break;
                        //导出查询申请-退回
                    case 'sendBack':
                        fdEventBus.$emit('appSendBack', _data);
                        break;
                    case 'confirmExportApply':
                        fdEventBus.$emit('appConfirmExportApply', _data);
                        break;
                    default:
                        break;
                }
            }
        };
        return;
    });
