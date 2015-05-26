/**
 * Inherit in mixin mode, the reciever will inherit own properties from the supplier, but the prototype
 * chain will be not involved, so the reciever will not be the instance of supplier's constructor.
 * 
 * Example:
 *     function Animal (name) {
 *         this.name = name;   
 *     }
 *     Animal.prototype.sayName = function () {
 *         console.log(this.name);
 *     }
 *     function Dog () {
 *         // use super constructor to initailize properties if it is necessary.
 *         Animal.call(this, 'dog');
 *     }
 *     mixin(Dog.prototype, Animal.prototype, true);
 *     Dog.prototype.constructor = Dog; // it is necessary when entire flag is true.
 * 
 *     var dog = new Dog();
 *     dog.sayName(); // 'dog'
 *     console.log(dog instanceof Animal) // false;
 * 
 * @param {object} reciever - The object which recieve the properties from supplier.
 * @param {object} supplier - The object which supply own properties to the reciever.
 * @param {boolean} entire - Only enumarable properties will be supplied if this flag is set to falsy.
 */
exports.mixin = function (reciever, supplier, entire) {
    // return enumarable properties or not
	var iterator = entire ? Object.getOwnPropertyNames : Object.keys;
    // check es5
    if (Object.getOwnPropertyDescriptor) {
        iterator.call(null, supplier).forEach(function (key) {
            var descriptor = Object.getOwnPropertyDescriptor(supplier, key);
            Object.defineProperty(reciever, key, descriptor);
        });
    }
    // compatibility for es3, use shadow copy
    else {
        for (var key in supplier) if (supplier.hasOwnProperty(key)) {
            reciever[key] = supplier[key];
        }
    }
};

/**
 * Inherit in pseudo-class mode, the prototype chain will be involved and the instance of child will be an 
 * instance of parent just like class inheritance.
 * 
 * Example:
 *     function Animal (name) {
 *         this.name = name;   
 *     }
 *     Animal.prototype.sayName = function () {
 *         console.log(this.name);
 *     }
 *     function Dog () {
 *         // use super constructor to initailize properties if it is necessary.
 *         Animal.call(this, 'dog');
 *     }
 *     inherit(Dog, Animal);
 * 
 *     var dog = new Dog();
 *     dog.sayName(); // 'dog'
 *     console.log(dog instanceof Animal) // true;
 * 
 * @param {Function} child - The child function whose prototype will inherit from the parent's prototype.
 * @param {Function} parent - The parent function whose prototype will be inherited.
 */
exports.inherit = function (Ctor, Parent) {
    // check es5
    if(Object.create) {
        Ctor.prototype = Object.create(Parent.prototype, {
            constructor: {
                enumerable: false,
                writable: true,
                configurable: true,
                value: Ctor
            }
        });
    }
    // compatibility for es3
    else {
        Ctor.prototype = new Parent();
        Ctor.prototype.constructor = Ctor;    
    }
    
    return Ctor;
};