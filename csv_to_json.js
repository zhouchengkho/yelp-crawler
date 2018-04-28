const fs = require("fs");

const result = [];
fs.readFile("elastic_data.csv", "utf8", (err, data) => {
    data = data.split("\n");
    data.forEach(line => {
        result.push(formatJSON(line));
    })
    fs.writeFile("elastic_data.json", JSON.stringify(result), "utf8", (err, data) => {
        console.log("ok");
    })
})

function formatJSON(line) {
    line = line.split(",");
    // xq0cX_DgxiJMXwhmEl9kUA,chinese,4,1039,1,9.237785E-1
    let json = {
        id: line[0],
        category: line[1],
        score: parseFloat(line[5]),
        label: line[4]
    }
    return json;
}


