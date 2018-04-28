const fs = require("fs");

let result = [];
fs.readFile("./predictions.csv", "utf8", (err, predictions) => {
    fs.readFile("./to_predict.csv", "utf8", (err, to_predict) => {
        predictions = predictions.split("\n");
        to_predict = to_predict.split("\n");
        for (let i = 0; i < predictions.length; i++) {
            result.push(to_predict[i] + "," + predictions[i]);
        }
        fs.writeFile("elastic_data.csv", result.join("\n"), "utf8", (err, result) => {
            console.log("write ok");
        })
    })
})