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

In ES5, there is a build-in method `Object.getPrototypeOf` to get the prototype object of an instance. Or some browsers 
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

It seems convenience in this way, because we needn't type `Animal.prototype` every time, but there will be a side effect, the constructor property 
of your prototype has changed to `Object` but not `Animal`, which is from `Object.prototype`. So you can write code in this way, but don't 
forget to make the constructor property right:

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

**Mixin**

Inherit in mixin mode, the reciever will inherit own properties from the supplier, but the prototype
chain will be not involved, so the reciever will not be the instance of supplier's constructor.
 
Example:

```javascript
    function Animal (name) {
        this.name = name;   
    }
    Animal.prototype.sayName = function () {
        console.log(this.name);
    }
    function Dog () {
        // use super constructor to initailize properties if it is necessary.
        Animal.call(this, 'dog');
    }
    mixin(Dog.prototype, Animal.prototype, true);
    Dog.prototype.constructor = Dog; // it is necessary when entire flag is true.
    
    var dog = new Dog();
    dog.sayName(); // 'dog'
    console.log(dog instanceof Animal) // false;
```


