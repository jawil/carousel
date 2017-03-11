Function.prototype.bind = Function.prototype.bind || function(context) {
    var self = this
    var arr = Array.prototype.slice.call(arguments)
    return function() {
        self.apply(context,arr.slice(1))
    }
}



a=1;

Object.getOwnPropertyDescriptor(window,'a')
