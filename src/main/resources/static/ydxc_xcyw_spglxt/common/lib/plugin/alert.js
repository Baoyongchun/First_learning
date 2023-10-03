/**
 * @author wuwg
 * @version 2017.0.1
 * @description file
 * @createTime 2017/7/14
 * @updateTime 2017/7/14
 * @descrition  兼容ie6
 * @update
 * @description
 *     提示框的插件
 *
 *     用法
 *     $.alert({
 *       // 将提示添加到哪个window窗口，一般都添加到最顶层
            targetWindow:window.top,
            // 提示的类型，只有成功和失败
            type:'success', // success , fail
            info:{
                //  成功的消息
                success:'保存成功',
                // 失败的信息
                fail:'保存失败'
            },
            // 外层容器名
            containClassName:'fd-alert',
            // 间隔多长时间消失
            interval:400,
            //  是否有蒙灰
            hasMask:true,
            // 是否有图标
            hasIcon:true,
            // 回调函数
            callback: function () {

            }
 *     });
 *
 */
(function ($,window) {
    $.alert= function (options) {
        var _defaultOptions={
            // 将提示添加到哪个window窗口，一般都添加到最顶层
            targetWindow:window.top,
            // 提示的类型，只有成功和失败
            type:'success', // success , fail
            info:{
                //  成功的消息
                success:'保存成功',
                // 失败的信息
                fail:'保存失败'
            },
            // 外层容器名
            containClassName:'fd-alert',
            // 间隔多长时间消失
            interval:400,
            //  是否有蒙灰
            hasMask:true,
            // 是否有图标
            hasIcon:true,
            // 回调函数
            callback: function () {

            }
        };
        //  合并参数
        var  _opts= $.fn.extend(true,{},_defaultOptions,options||{});
        // className
        var _class='fd-info'+' '+(_opts.hasIcon?'icon':'')+' '+_opts.type;
        //组合html
        var  _html=['<div  class="fd-alter-contain '+_opts.containClassName+'">'];
              _opts.hasMask? _html.push('<div class="fd-mask"></div>'):'';
             _html.push('<div class="fd-alert-tips"><span class="'+_class+'">'+_opts.info[_opts.type]+'</span></div>')
             _html.push('</div>');
        // 添加到页面上去
        var  _tips= $(_html.join(''));
        var _body= $(_opts.targetWindow.document.body);
        // 添加提示
        _body.append(_tips);
        // 定时器
        setTimeout(function () {
            // 移除提示
            _tips.remove();
            // 执行回调函数
            _opts.callback();

        },_opts.interval);
    };
})(jQuery,window);