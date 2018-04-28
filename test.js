const Promise = require("bluebird");



function test() {
    return new Promise((resolve, reject) => {
        resolve("test");
    })
}

test().then(message => {
    console.log(message);
})