//app.js
import '../css/common.css';
import '../css/style.scss';
var a = require('./a.js');
function getData(){
    let promise = new Promise((resolve, reject) => {
        let key = ~~(Math.random() * 10)
        let temp = ['es6', 'babel']
        if (key >= 5) {
            let obj = {
                msg: 'ok',
                data: [key, ...temp]
            };
            resolve.call(this, obj)
        } else {
            
            let obj = {
                msg: 'error',
                data: [key, ...temp]
            };
            resolve.call(this, obj)
        }
    })
    return promise
}

let container = document.getElementById('app');
getData().then((data) => {
    a()
    container.innerHTML = JSON.stringify(data);
}, (err) => {
    container.innerHTML = JSON.stringify(err);
})