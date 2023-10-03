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
define('fdEventBus',['vue'],
    /**
     * @param Vue
     */
    function (vue) {
        var globalEventBus = new Vue();
        return globalEventBus;
    });