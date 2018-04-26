const fs = require("fs");
const AWS = require("aws-sdk");
const config = require("./config");
const dynamo = new AWS.DynamoDB({
    region: config.AWS_REGION
});
const until = require("async/until");
const moment = require("moment");

fs.readFile("output.json", "utf8", (err, data) => {
    data = JSON.parse(data);
    let len = data.length;
    let count = 0;
    until(
        () => {
            return count >= len
        },
        (next) => {
            let init = count;
            let requestItems = [];
            for (let i = init; i < init + 25 && i < len; i++, count++) {
                let putRequest = {
                    PutRequest: {
                        Item: transformToAmazonItem(data[i])
                    }
                };
                requestItems.push(putRequest);
            }
            let params = {
                RequestItems: {
                    [config.DYNAMO_TABLE_NAME]: requestItems
                }
            };
            console.log("running batch: " + count + "/" + len);
            dynamo.batchWriteItem(params, (err, result) => {
                if (err) {
                    console.log(err);
                    console.log(params);
                }
                next(null, result);
            });
        },
        (err) => {
            if (err) {
                console.log(err);
            }
            console.log("upload completed");
        }
    )
});

function transformToAmazonItem(item) {
    let result = {};
    let checkList = ["id", "category", "review_count", "rating", "name", "image_url", "location", "coordinates", "phone"];
    checkList.forEach(attribute => {
        if (item[attribute]) {
            const type = typeof item[attribute];
            let value = item[attribute];
            let key = "S";
            if (type === 'object') {
                value = JSON.stringify(value);
            } else if (type === 'number') {
                value = value.toString();
                key = "N";
            }
            result[attribute] = {[key]: value};
        }
    });
    /**
     * Additional attributes
     */
    if (item.location && item.location.zip_code) {
        result.zip_code = {S: item.location.zip_code};
    }
    if (item.coordinates && item.coordinates.latitude) {
        result.lat = {N: item.coordinates.latitude.toString()};
    }
    if (item.coordinates && item.coordinates.longitude) {
        result.lng = {N: item.coordinates.longitude.toString()};
    }
    if (item.location && item.location.display_address) {
        result.address = {S: item.location.display_address[0] + "," + item.location.display_address[1]};
    }
    result.created_at = {S: moment().format("YYYY-MM-DD HH:mm:ss")};
    return result;
}

