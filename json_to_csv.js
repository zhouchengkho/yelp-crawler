const fs = require("fs");

let result = [];
fs.readFile("output.json", (err, data) => {
    data = JSON.parse(data);
    data.forEach(json => {
        result.push(formatCsvLine(json));
    });
    writeToFile(result);
});

function formatCsvLine(json) {
    // id, category, rating, review_count, recommended
    let builder = [];
    builder.push(json.id);
    builder.push(json.category ? json.category : "undefined");
    builder.push(json.rating ? json.rating : 0);
    builder.push(json.review_count ? json.review_count : 0);
    return builder.join(",");
}

function formatCsv(array) {
    return array.join("\n");
}


function writeToFile(result) {
    fs.writeFile("output.csv", formatCsv(result), "utf8", (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("generate ok");
    })
}