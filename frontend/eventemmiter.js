
/**
 * Like EventEmitter in node.js
 *
 * @constructor
 */
function EventEmitter () {

    /**
     * @var {Object}
     */
    this.eventHandles = {};
}


/**
 * Add listener for specific event.
 * 
 * @param  {String} event - name of the event.
 * @param  {Function} callback - handler which will be invoked when the event fired.
 * @return {Number} index of listener, it will be used when you remove this handler.
 */
EventEmitter.prototype.on = function(event, callback) {

    var handlers = this.eventHandles[event] || [];
    handlers.push(callback);

    return handlers.length - 1;
};

/**
 * Trigger event.
 * 
 * @param  {String} event - name of the event.
 */
EventEmitter.prototype.emit = function(event) {

    if(this.eventHandles[event]) {
        
        for(var i = 0, l = this.eventHandles.length; i < l; i++) {

            var args = Array.prototype.slice(1);
            var handler = this.eventHandles[i];
            
            handler.apply(null, args);
        }   
    }
};

/**
 * Remove the handler of the event according the index which is returned when it attached.
 * 
 * @param  {String} event - name of the event.
 * @param  {Number} index - index of the handler.
 */
EventEmitter.prototype.remove = function(event, index) {

    var handlers = this.eventHandles[event] || [];

    handlers.splice(index);
};

