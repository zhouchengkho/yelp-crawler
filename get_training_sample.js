const fs = require("fs");

let result = [];

fs.readFile("output.json", "utf8", (err, data) => {
    data = JSON.parse(data);
    data.sort(compare);
    let counter = 0;
    let top = data.length - 1;
    let bottom = 0;
    while (counter < 100) {
        counter++;
        result.push(formattedCsvLine(data[top--], 1));
        result.push(formattedCsvLine(data[bottom++], 0));
    }
    writeToFile(result);
});

function compare(a, b) {
    let valueA = (a.rating ? a.rating * 10 : 0) + (a.review_count ? a.review_count : 0);
    let valueB = (b.rating ? b.rating * 10 : 0) + (b.review_count ? b.review_count : 0);
    return valueA - valueB;
}


function formattedCsvLine(json, recommended) {
    // id, category, rating, review_count, recommended
    let builder = [];
    builder.push(json.id);
    builder.push(json.category ? json.category : "undefined");
    builder.push(json.rating ? json.rating : 0);
    builder.push(json.review_count ? json.review_count : 0);
    builder.push(recommended);
    return builder.join(",");
}

function writeToFile(csvArray) {
    fs.writeFile("training_sample.csv", formatCsv(csvArray), "utf8", (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("generate ok");
    })
}

function formatCsv(array) {
    return array.join("\n");
}
