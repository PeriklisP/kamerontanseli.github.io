(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "./posts/9-ways-to-level-up-your-javascript-code.md":
/*!**********************************************************!*\
  !*** ./posts/9-ways-to-level-up-your-javascript-code.md ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("---\nauthor: Kameron Tanseli\ndate: '2019-12-24T13:56:26.370Z'\nhero_image: ../static/js-cover.png\ntitle: '9 ways to level up your JavaScript code'\nbyline: \"I wrote this article back in 2016 and a lot has changed since. Because of this shift I have decided to remove certain sections that are no longer considered best practises or are based on ES5 APIs. Enjoy :)\"\n---\n\nI wrote this article back in 2016 and a lot has changed since. Because of this shift I have decided to remove certain sections that are no longer considered best practises or are based on ES5 APIs. Enjoy :)\n\n## 1. Don’t use commas when declaring variables\n\nThe variables can now be easily moved around from line to line without having to worry about the commas.\n\n```javascript\nlet a = 2,\n  b = a + 2,\n  c = b - 3;\n\nlet a = 2;\nlet b = a + 2;\nlet c = b - 3;\n```\n\n## 2. Move code into separate modules\n\nBefore:\n\n```javascript\nclass Stock {\n  checkItemIsInStock(item) {\n    // logic\n  }\n}\n\nclass Basket {\n  constructor() {\n    this.stock = new Stock();\n    this.items = [];\n  }\n  addToBasket(item) {\n    if (this.stock.checkItemIsInStock(item)) {\n      this.items.push(item);\n    }\n  }\n}\n```\n\nAfter:\n\n```javascript\nimport Stock from \"./stock\";\nimport Basket from \"./basket\";\n\nconst shoppingCart = new Basket(new Stock());\n```\n\n## 3. Utilize the Module pattern\n\nThe closure created by the [Immediately Invoked Function Expression (IIFE)](https://ultimatecourses.com/blog/mastering-the-module-pattern) allows privacy. E.g: The `privateMethod()` is only accessible by the inner `Basket` class:\n\n```javascript\nconst Basket = (() => {\n  // encapsulate a private function\n  const privateMethod = () => true;\n\n  class Basket {\n    publicMethod() {\n      privateMethod(); // use private methods\n    }\n  }\n\n  return Basket;\n})();\n```\n\n## 4. Comment your code\n\n```javascript\n/**\n * Creates a Point to be used in D3\n * @class Point\n * @example\n * new Point(2, 3);\n */\nclass Point {\n  /**\n   * @constructor\n   * @param {number} x - The x value.\n   * @param {number} y - The y value.\n   * @returns {Point} new instance of Point\n   */\n  constructor(x, y) {\n    // ...\n  }\n}\n```\n\nThis allows developers to get a deeper understanding of what is happening in your code without having to figure it out from the code. If you use [JSDOC](http://usejsdoc.org/about-getting-started.html) the comments can be used to generate online documentation guides.\n\n## 5. Learn design patterns\n\n- [The Observer pattern](http://www.dofactory.com/javascript/observer-design-pattern) helps your modules communicate to each other through events thus providing loose coupling in your app.\n\n- [The Mediator pattern](http://www.dofactory.com/javascript/mediator-design-pattern) takes control over a group of objects by encapsulating how these objects interact. E.g: a basket that handles items.\n\n- [The Iterator pattern](http://www.dofactory.com/javascript/iterator-design-pattern) is the underlying pattern for ES2015 generators.\n\n- [The Facade pattern](http://www.dofactory.com/javascript/facade-design-pattern) provides an simple interface which encapsulates the end user from complex functionality. E.g: Email module with simple methods such as start, stop and pause;\n\nNot only are these solutions to commonly solved problems, they are a way of describing application structure to other developers fairly simply. E.g: _“The basket module is a mediator for all the store items, it communicates to the payment module via an observer”_.\n\n## 6. Pass objects into functions with a large number of arguments\n\n```javascript\n// not so good\nfunction colorWidget(\n  element,\n  colorValue,\n  colorRange,\n  colorFormat,\n  opacity,\n  onChange\n) {}\n\ncolorWidget($(\"<div/>\"), \"#fff\" /*...*/);\n\n// way better\nfunction colorWidget({\n  element = $(\"<div/>\"),\n  colorValue = \"#000\",\n  colorRange = [0, 255],\n  colorFormat = \"rgb\",\n  opacity = 0.8,\n  onChange = () => {}\n}) {\n  // ...\n}\ncolorWidget({\n  element: $(\"<div/>\")\n});\n```\n1. Simple to add new options\n2. The developer doesn’t have to worry about the order of the arguments\n3. Simple to add default values\n\n## 7. Don’t use type constructors unless specifically necessary\n\n```javascript\n// Before\nconst x1 = new Object();\nconst x2 = new String();\nconst x3 = new Number();\nconst x4 = new Boolean();\nconst x5 = new Array();\nconst x6 = new RegExp(\"()\");\nconst x7 = new Function();\n\n// After\nconst x1 = {};           \nconst x2 = \"\";           \nconst x3 = 0;            \nconst x4 = false;        \nconst x5 = [];           \nconst x6 = /()/;         \nconst x7 = function(){};\n```\n\nThe creation through type constructors is significantly slower than primitives. Also because the end result of the constructor is an `Object` rather than a primitive value you get [nasty side effects](http://stackoverflow.com/questions/5750656/whats-the-point-of-new-stringx-in-javascript) like so:\n\n```javascript\nconst a = new String(\"x\");\na === \"x\"  //false\na == \"x\" //true\n\nconst b = \"dog\";\nb.woof = true;\nb.woof; // undefined\n\nconst c = new String(\"dog\");\nc.woof = true;\nc.woof; // true\n```\n\n## 8. Make sure your context is right\n\n```javascript\nclass Button {\n  constructor () {\n    this.count = 0;\n  }\n  click () {\n    this.count += 1;\n  }\n  init () {\n    $(\"button\").click(this.click);\n  }\n}\n```\n\nFrom a glance this should work however when a user clicks the button we will get an error that count doesn’t exist. This is because the click function is executed in the context of the `$(\"button\")` element instead of the `Button` object. We can fix this by binding the context to the function:\n\n```javascript\nclass Button {\n  constructor () {\n    this.count = 0;\n  }\n  click () {\n    this.count += 1;\n  }\n  init () {\n    $(\"button\").click(() => this.click());\n    // or using bind\n    $(\"button\").click(this.click.bind(this));\n  }\n}\n```\n\n## 9. Apply\n\n> The `apply()` method calls a function with a given this `value` and `arguments` provided as an array (or [an array-like object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)). — MDN\n\nSome useful instances of using apply:\n\n```javascript\n// emulating \"super\" in an constructor \nSomeConstructor.prototype.somemethod.apply(this, arguments);\n\n// passing an array of promises to jQuery.when\n$.when.apply($, [$.get(), $.get()]);\n\n// finding the max number in an array\nMath.max.apply(Math.max, [1,2,3,4,5]);\n```\n\n## Bonus Points\n\nContributed by: [Russley Shaw](https://medium.com/@russleyshaw)\n\n## 10. Use let and const over var\n\n`let` allows you to declare variables that are limited in scope to the block, statement, or expression on which it is used.\n\nLets look at a few use cases where this is useful over `var` statements:\n\n```javascript\nvar elements = document.querySelectorAll('p');\nfor (var i = 0; i < elements.length; i++) {                                 \n    // have to wrap in IIFE other i would be elements.length\n    (function(count){  \n       elements[count].addEventListener('click', function(){\n           elements[count + 1].remove();\n       });\n     })(i);\n}\n\n// using let\nlet elements = document.querySelectorAll('p');\nfor (let i = 0; i < elements.length; i++) {\n   elements[i].addEventListener('click', function(){\n        elements[i + 1].remove();\n   });\n}\n```\n\nThe reason why the top example would be `elements.length` is because `i` is referenced directly so on the next iteration `i` is incremented. When we wrap the code in an IIFE we reference `i` under the parameter `count` thus removing the direct reference.\n\n`const` allows the declaration of variables that cannot be re referenced. This is useful for declaring constants (the keyword originates from it).\n\n```javascript\nconst API_KEY = '2rh8ruberigub38rt4tu4t4';\nconst PI = 3.14;\n```\n\nHowever objects and arrays can still be accessed and changed. To stop this use `Object.freeze()`:\n\n```javascript\nconst API_CONFIG = Object.freeze({\n  'key': '8ry4iuggi4g38430t5485jmub',\n  'endpoint': '/some/boring/api/path/'\n});\nAPI_CONFIG.key = null; // attempt to change\nAPI_CONFIG.key; //= '8ry4iuggi4g38430t5485jmub'\n\nconst EVENS = Object.freeze([ 2, 4, 6, 8]);\nEVENS[2] = 9;\nEVENS[2]; //= 6\n```\n\n## 11. Avoid using “or” when referencing variables\n\nThe only reason to avoid doing this is when the variable is allowed to be `false` . Take a look at the example below:\n\n```javascript\nlet msg = ''; //= should hide the button\nlet btnMsg = msg || 'Click Me';\n\nbtnMsg; //= 'Click Me'\n```\n\nThe reason this happens is due to the conversion of the `\"”` into a Boolean which returns false . As the `\"”` is counted as `false` the `or` comparison returns the other side `'Click Me'`.\n\nIf you want to have shorthand if statements you can use the ternary operator:\n\n```javascript\nvar msg = ''; //= should hide the button\nvar btnMsg = msg.length < 5 ? msg : 'Click Me';\n\nbtnMsg; //= ''\n```");

/***/ })

}]);
//# sourceMappingURL=3.js.map