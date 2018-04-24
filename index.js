const fs = require("fs");
const request = require("request");
const until = require("async/until");
const eachSeries = require("async/eachSeries");
const config = require("./config");
const args = process.argv;
const usage = "Hey what's up! To start crawling, run `node index.js number_of_results_per_type`";
if (args.length < 3) {
  console.log(usage);
  return;
}
const count = parseInt(args[2]);
if(!count) {
  console.log(usage);
  return;
}

let categoryTotalChecked = false;
let categoryTotal = 0;
const categories = config.YELP_CATEGORIES;
const location = config.YELP_LOCATION;
let json = [];

eachSeries(
  categories,
  (category, callback) => {
    let offset = 0;
    categoryTotalChecked = false;
    categoryTotal = 0;
    until(
      () => {
        return (offset + 50 > 1000) || (categoryTotalChecked && offset > categoryTotal)
      },
      (next) => {
        callYelp(location, category, offset, (err, businesses) => {
          offset+=50;
          batchPush(businesses, category);
          next(err, businesses);
        });
      },
      (err) => {
        callback(err);
      }
    )
  },
  (err, result) => {
    writeToFile();
  }
);


function callYelp(location, category, offset, callback) {
  request.get({
    url: config.YELP_URL,
    method: 'GET',
    headers: {
      Authorization: config.YELP_AUTH
    },
    qs: {
      location: location,
      sort_by: 'best_match',
      term: 'restaurants',
      categories: category,
      limit: 50,
      offset: offset
    }

  }, (err, response, body) => {
    if (err) {
      callback(err, null);
    } else {
      console.log("processing category: " + category + ", offset: "+offset);
      let result = JSON.parse(body);
      if (!categoryTotalChecked) {
        categoryTotalChecked = true;
        categoryTotal = result.total;
      }
      let businesses = result.businesses ? result.businesses : [];
      callback(null, businesses);
    }
  });
}


function batchPush(businesses, category) {
  businesses.forEach(business => {
    /**
     * avoid duplication
     * this operation is costly, remove it if doesn't care about duplicates
     */
    if (!json[business.id]) {
      business.category = category;
      json.push(business);
    }
  })
}

function writeToFile() {
  fs.writeFile("output.json", JSON.stringify(json), "utf8", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("crawl job completed, check output.json generated");
  })
}
