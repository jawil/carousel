Function.prototype.bind = Function.prototype.bind || function(context) {
    var self = this
    var arr = Array.prototype.slice.call(arguments)
    return function() {
        self.apply(context, arr.slice(1))
    }
}



a = 1;

Object.getOwnPropertyDescriptor(window, 'a')


var foo = (function() {
    var o = {
        a: 1,
        b: 2,
        /**更多属性**/
    };
    return function(key) {
        return o[key];
    }
})();


Object.defineProperty(Object.prototype, 'self', {
    get(){
        console.log(this);
        alert(1)
        return this;
    }
});

foo('self');
