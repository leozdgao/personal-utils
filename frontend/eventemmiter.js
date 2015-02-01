
// Like EventEmitter in node.js

function EventEmitter () {

	this.eventHandles = {};
}

// add listener
EventEmitter.prototype.on = function(event, callback) {

	var handlers = this.eventHandles[event] || [];
	handlers.push(callback);

	return handlers.length - 1;
};

// fire event
EventEmitter.prototype.emit = function(event) {

	for(var i = 0; i < this.eventHandles.length; i++) {

		var args = Array.prototype.slice(1);
		var handler = this.eventHandles[i];
		
		handler.apply(null, args);
	}
};

// remove listener
EventEmitter.prototype.remove = function(event, index) {

	var handlers = this.eventHandles[event] || [];

	handlers.splice(index);
};

