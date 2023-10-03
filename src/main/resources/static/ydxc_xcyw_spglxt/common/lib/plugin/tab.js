/**tab�л�*/
/************************************
 *	Version 		14.0.1
 *	Author			wuwg
 *  CreateTime      14.07.14
 *	UpdateTime		14.07.14
 **************************************/
(function ($, window) {

	//��jQuery��ӷ���
	$.fn.addTab = function (options) {

		//�ϲ�������Ĭ�ϵĲ���
		var opts = $.extend({}, $.fn.addTab.defaultOpts, options || {});

		//ʵ�ַ���
		return this.each(function () {

			//��ǰ����   �����ڵ��б�  ���ݽ���б�  �����ڵ��ܳ���   ��ʱ��
			var $that = $(this);
			var thatBuyd = $(this);
			var navList = $that.find("ul:first").children('li');
			var conList = $that.find("div:first").children();
			var size = navList.length;
			var timer = null;
			//��ǰ����  �ɵ�����
			var curIndex = oldIndex = opts.index;

			//��ʼ�� �����ڵ�
			setClass(curIndex);
			//��ʼ�����ݽڵ�

			showContent(curIndex)

			//�����ڵ�
			navList.each(function (i) {
				//����
				var index = i;
				//���¼�
				$(this).bind(opts.mouseType, function (e) {
					//�Ƿ񴥷����ǵ�ǰ�ڵ� �����ֱ�ӷ���
					if (index == curIndex) {

						return;
					}
					//  ���һ������
					if (opts.lastLiLoseEffect) {
						if (index == navList.length - 1) {
							return;
						} else {

							//��ֵ�ɵĽڵ�ֵ  ��ǰ�ڵ�ֵ
							oldIndex = curIndex;
							curIndex = index;
							//��ǰ����
							setClass(curIndex);
							//��ǰ�����µ�����
							showContent(index);
							// �ص�����
							callback(curIndex);
						}

					} else {
						//��ֵ�ɵĽڵ�ֵ  ��ǰ�ڵ�ֵ
						oldIndex = curIndex;
						curIndex = index;
						//��ǰ����
						setClass(curIndex);
						//��ǰ�����µ�����
						showContent(index);
						// �ص�����
						callback(curIndex);
					}
				});

			});

			//  ���õ��� class����
			function setClass(index) {

				var $that = navList.eq(index);
				//�����ʽ �Ƴ���ʽ

				if (opts.classType == 'only') {

					$that.addClass(opts.selectedClass).siblings().removeClass(opts.selectedClass);
				} else {
					$that.addClass(opts.selectedClass + String(curIndex + 1)).siblings().removeClass((opts.selectedClass + String(oldIndex + 1)));
				}
			}

			function showContent(index) {
				if (opts.isFade) {
					conList.css({
						"position" : "absolute",
						"left" : 0,
						"top" : 0,
						"width" : "100%"
					}).parent().css({
						"position" : "relative"
					})
					conList.eq(index).fadeIn(opts.tweenTime).siblings().fadeOut(opts.tweenTime);
				} else {
					conList.hide().eq(index).show();
				}
			}
			//  �ص�����
			function callback(index) {
				opts.callback !== null ? opts.callback(index) : "";

			}
			//��ʱ��
			function autoTimer() {
				if (!opts.autoPlay) {
					return;
				}
				if (timer) {
					clearInterval(timer);
				}
				timer = setInterval(autoPlay, opts.delay);
			}
			//��ͣ����
			function stopTimer() {
				clearInterval(timer);
			}

			//�Զ�����
			function autoPlay() {
				var newIndex = ((curIndex + 1) >= size) ? 0 : curIndex + 1;
				navList.eq(newIndex).trigger(opts.mouseType)
			}
			// �������¼�
			$that.hover(function () {
				stopTimer();
			}, function () {
				autoTimer();
			}).trigger("mouseout");

			// ��ٲ��õĶ�����
			$that = null;
		});

	}

	/*
	 *	Ĭ�ϲ���
	 *	index					Ĭ������(Ĭ�ϵ�һ��0)
	 *	selectedClass			ѡ����ʽ
	 *	classType				��ʽΪ����(only)���Ƕ��(muilt) (Ĭ��Ϊ����)
	 *	mouseType				�������(Ĭ�ϵ��click)
	 *	isFade					�Ƿ�ʹ�ý���Ч��
	 *	tweenTime				��������ʱ��
	 *	autoPlay				�Ƿ�ʹ���Զ��л�
	 *	delay					�Զ��л��ȴ�ʱ��(Ĭ��6000----6��)
	 */
	$.fn.addTab.defaultOpts = {
		index : 0,
		selectedClass : "on",
		classType : "only",
		mouseType : "click",
		isFade : false,
		lastLiLoseEffect : false,
		tweenTime : 500,
		autoPlay : false,
		delay : 6000,
		callback : null
	};

})(jQuery, window);
