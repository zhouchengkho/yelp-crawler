const fs = require("fs");

let seen = {};
let output = [];

fs.readFile("training_sample.csv", "utf8", (err, result) => {
    let lines = result.split("\n");
    lines.forEach(line => {
        seen[line.split(",")[0]] = true;
    });
    fs.readFile("output.csv", "utf8", (err, result) => {
        let lines = result.split("\n");
        lines.forEach(line => {
            if (!seen[line.split(",")[0]]) {
                output.push(line);
            }
        })
        writeToFile(output);
    });
});

function writeToFile(csvArray) {
    fs.writeFile("to_predict.csv", formatCsv(csvArray), "utf8", (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("generate ok");
    })
}

function formatCsv(array) {
    return array.join("\n");
}
