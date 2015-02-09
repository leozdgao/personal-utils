var draggable = {

	// 可拖动窗体，触发拖动元素，范围限制
	/**
	 * 使元素获得可拖动的能力（该元素需绝对定位）
	 * @param  {HTMLElement} oDrag  [可拖动的元素]
	 * @param  {HTMLElement} oTitle [触发拖动的元素]
	 * @param  {[type]} scope  [拖动的范围限制] // TODO
	 */
	enableDraggable: function(oDrag, oTitle, scope) {

		// 判断传入的是DOM元素
		if(!(typeof oDrag === 'object' && oDrag.nodeName)) throw new Error('oDrag should be a DOM element.');

		if(oTitle) {
			// 判断触发拖动元素是DOM元素
			if(!(typeof oTitle === 'object' && oTitle.nodeName)) throw new Error('oDrag should be a DOM element.');
		}
		else {

			oTitle = oDrag;	
		}

		// 按下鼠标
		oTitle.onmousedown = function(e) {
			
			e = e || window.event;
			var offsetX = oDrag.offsetLeft;
			var offsetY = oDrag.offsetTop;
			var disX = e.clientX;
			var disY = e.clientY;

			document.onmousemove = function(e) {
				// console.log('mousemove');
				e = e || window.event;

				var clientX = e.clientX,
					clientY = e.clientY,
					posX = clientX - (disX - offsetX),
					posY = clientY - (disY - offsetY);

				// 限制可拖动区域
				var maxX = (document.body.clientWidth || document.documentElement.clientWidth) - oDrag.offsetWidth;
				var maxY = (document.body.clientHeight || document.documentElement.clientHeight) - oDrag.offsetHeight;

				if(posX < 0) posX = 0;
				else if(posX > maxX) posX = maxX;

				if(posY < 0) posY = 0;
				else if(posY > maxY) posY = maxY;

				// 定位
				oDrag.style.left = posX + 'px';
				oDrag.style.top = posY + 'px';
			};

			// 释放鼠标
			oTitle.onmouseup = function() {
				
				document.onmousemove = null;
				oTitle.onmouseup = null;
			};
		};
	},
	/**
	 * 取消元素可拖动的能力
	 * @param  {HTMLElement} oTitle [触发拖动的元素]
	 */
	disableDraggable: function(oTitle) {

		// 判断传入的是DOM元素
		if(!(typeof oTitle === 'object' && oTitle.nodeName)) throw new Error('oTitle should be a DOM element.');

		oTitle.onmousedown = null;
	}
};