/**
 * js
 * Time  			 	 2015-10-10
 * plugin Name  		 scrollPage
 * author                wuwg
 **/

(function($) {
	
	$.fn.extend({
		addScrollPage : function(options) {
			
		//  合并参数
		var opts = $.fn.extend({}, options || {});
		
		function getScrollTop() {
			return $(opts.connectContain).css('top');
		}
		var _flag = false,
			_timer = null,
			_clickItem = $(opts.naviGationId).find(opts.clickItem),
			_top = 0;

		_clickItem.click(function() {});
		
		if (!opts.isDrag) {
			
			_clickItem.on('mouseup', function() {
			if(opts.isDrag) {
					console.log("这是拖拽");
				} else {
					if(_flag) {
				return;
			}
			_flag = true;
			var index = $(this).index();
			//移除选中状态
			$(this).addClass(opts.clickItemActiveClass).siblings().removeClass(opts.clickItemActiveClass);

			function test() {	
				
				//_top = $(opts.connectContain).children().eq(index).find(opts.positionElement).position().top;
				_top = $(opts.connectContain).find(opts.connectContainItem).eq(index).position().top;
				if(getScrollTop() == ($(opts.connectContain).height()-$(opts.connectContain).parent().height())&&_top==undefined) {
					//如果已经到达底部 这不需要做操作
					_flag = false;
					return;
				} else {
					//如果没有到达底部 则执行动画

					$(opts.connectContain).stop(true, true).animate({
						top: -_top
					}, opts.tweenTime, function() {
						_timer = setTimeout(function() {
							_flag = false;
						}, 10);
					});
					
					opts.callBack(_top)
				}
			}
			test(); //执行判断函数
				}
		});
		}

	}
	});

	//  执行方法
	

})(jQuery);