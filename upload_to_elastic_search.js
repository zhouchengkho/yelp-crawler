const elasticsearch = require('elasticsearch');
const fs = require("fs");

const client = new elasticsearch.Client({
    host: "https://search-restaurant-skcsrfusurlykmrlyjy4tuaf5e.us-east-1.es.amazonaws.com/"
});


fs.readFile("elastic_data.json", "utf8", (err, data) => {
    data = JSON.parse(data);
    const bulkBody = [];
    data.forEach(item => {
        bulkBody.push({ index:  { _index: 'predictions', _type: 'prediction' } });
        bulkBody.push(item);
    });
    client.bulk({
        body: bulkBody
    }, (err, result) => {
        console.log(result);
    })
});