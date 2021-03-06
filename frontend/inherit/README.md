## Inheritance in JavaScript

There is a concept called 'prototype' in JavaScript. When resolving a property of an object, if the 
property is one of its own properties, the value of this property or the result of getter will return,
or JavaScript will try to resolve the property from its implicit reference to its constructor's 
prototype property and so on. Here is the definition of prototype chain in ECMAScript Spec 5.1.

> Every object created by a constructor has an implicit reference (called the object's prototype) 
to the value of its constructor's prototype property. Furthermore, a prototype may have a non-null 
implicit reference to its prototype, and so on; this is called the prototype chain.

Notice that the prototype is only involved when resolving or getting a property of an object, which means 
set a property or try to delete a property has no effect on prototype of the instance. 

Let's summarize the relationship between instance, prototype and constructor. The instance is created by 
constructor with new operator. The constructor has a property named prototype, which represent the prototype of instances, 
and all instances have an implicit reference to the prototype obejct. And the prototype object has a property 
named constructor, which reference to the constructor function.

So the prototype is very useful to share properties (methods commonly) between instances, and it's not necessary to put 
the same actions or methods in every instances.

In ES5, there is a built-in method `Object.getPrototypeOf` to get the prototype object of an instance. Or some browsers 
has the property `__proto__` which reference to the prototype of the instance.

Before we start to talk about inheritance in JavaScript, let's check this example:

```javascript
function Animal (name) {
    this.name = name;
}
Animal.prototype = {
    sayName: function () {
        console.log(this.name);
    },
    // other methods
}
```

It seems convenience in this way, because we needn't type `Animal.prototype` every time, but there will be a side effect, the constructor 
property of your prototype has changed to `Object` but not `Animal`, which is from `Object.prototype`. So you can write code in this way, 
but don't forget to make the constructor property right:

```javascript
Animal.prototype = {
    // let it reference to the right constructor
    constructor: Animal, 
    
    sayName: function () {
        console.log(this.name);
    },
    // other methods
}
```

OK, let's start to discuss about the inheritance in JavaScript.

**Pseudo-Class Mode**

There is no explicit implement of class in JavaScript, even in ES6, the `class` is only the grammar sugar for prototype-based inheritance. So 
without the ES6 sugar, we try to implement the inheritance like a class which based on prototype.

The prototype chain is the key, which means, if we want to FuncA inherit FuncB, we need the object `FuncA.prototype` has the implict reference to 
the object `FuncB.prototype`, which makes prototype chain works. How can we do this?

ES5 provides a built-in methoed `Object.create`, which will return a new object with the specified prototype object and properties. And that's it.

```javascript
function inherit (ctor, parent) {
    ctor.prototype = Object.create(parent.prototype, {
        constructor: {
            enumerable: false,
            writable: true,
            configurable: true,
            value: ctro
        }
    });
    
    return ctor;
}
```

But if the environment doesn't support ES5? We can utilize the new operator, which implicitly assign the prototype to the new object. The only concern 
is that the contructor invoked with no arguments should not throw any exception.

```javascript
function inherit (Ctor, Parent) {
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
}
```

Let's check this implement:

```javascript
function Animal (name) {
    this.name = name;
}
Animal.prototype.sayName = function () { 
    console.log(this.name);
}
function Dog () {
    // use parent's constructor to initailize properties if it is necessary.
    Animal.call(this, 'dog');
}
        
inherit(Dog, Animal);

var dog = new Dog();
dog.sayName(); // 'dog'
console.log(dog instanceof Animal); // true
```


**Mixin Mode**

Another way to inherit is called 'mixin'. The difference between the 'pseudo-class' and 'mixin' is that the mixin mode does not base on 
prototype, it has a reciever object and a supplier object ,the reciever will recieve the own properties from the supplier.

Notice the property is a container of the value or a pair of accessors. So if your environment support ES5, it's better to use `Object.getOwnPropertyDescriptor` and 
`Object.defineProperty`, or you can just use the shadow copy.

```javascript
function mixin (reciever, supplier, entire) {
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
}
```

There is a flag called 'entire', it is used to decide recieving the properties which are not enumerable or not (It works only if your environment support ES5). Commonly 
we let the prototype of child as a reciever and let the prototype of parent as a supplier.

Notice that the child's prototype object doesn't have a implicit reference to parent's prototype, so child instance will only have the properties on its parent but will 
not have the properties from its grandfather. And the child instance will not be an instance of it's parent. If you don't care about that, just use it.

Let's check this implement:

```javascript
function Animal (name) {
    this.name = name;
}
Animal.prototype.sayName = function () {
    console.log(this.name);
}
function Dog () {
    // use parent's constructor to initailize properties if it is necessary.
    Animal.call(this, 'dog');
}
mixin(Dog.prototype, Animal.prototype, true);
Dog.prototype.constructor = Dog; // it is necessary when entire flag is true.

var dog = new Dog();
dog.sayName(); // 'dog'
console.log(dog instanceof Animal) // false;
```

In ES6, a built-in method `Object.assign` do the similar thing.

> The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.

Notice it only copy all enumerable own properties, and it only copy value, so if you want to copy the descriptor of the property you still need 
`Object.getOwnPropertyDescriptor` and `Object.defineProperty`.