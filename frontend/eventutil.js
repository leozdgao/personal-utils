var eventUtil = {

	addEventHandler: function(ele, event, handler) {

	    // DOM 2级
	    if(ele.addEventListener) {

	        ele.addEventListener(event, handler, false);
	    }
	    // IE
	    else if(ele.attachEvent) {

	        ele.attachEvent('on' + event, handler);
	    }
	    // DOM 0级
	    else {

	        ele['on' + event] = handler;
	    }
	},
	removeEventHandler: function(ele, event, handler) {

	    // DOM 2级
	    if(ele.removeEventListener) {

	        ele.removeEventListener(event, handler);
	    }
	    // IE
	    else if(ele.detachEvent) {

	        ele.detachEvent('on' + event, handler);
	    }
	    // DOM 0级
	    else {

	        ele['on' + event] = null;
	    }
	},
	getEvent: function(e) {

	    return e || window.event;
	},
	getTarget: function(e) {

	    return e.target || e.srcElement;
	},
	stopPropagation: function(e) {

	    if(e.stopPropagation) {

	        e.stopPropagation();
	    }
	    else {
	        e.cancelBubble = true;
	    }
	},
	preventDefault: function(e) {

	    if(e.preventDefault) {

	        e.preventDefault();
	    }
	    else {

	        e.returnValue = false;
	    }
	}
};