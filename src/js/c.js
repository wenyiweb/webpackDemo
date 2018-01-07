var a = require('./a.js');
var b = require('./b.js');
console.log(a)
a();
b();
function c(){
    console.log('c')
}
module.exports  =  c;