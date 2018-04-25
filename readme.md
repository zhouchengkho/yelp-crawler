## Yelp Scraper

### What is it
* Yelp restaurants crawler
* Automatically crawls restaurants data and generate JSON file
* Upload JSON file to your database storage (in this case, dynamo db)

### Usage
* create your own ```config.js``` referencing ```config_sample.js```, define ```YELP_AUTH```, a free key can be registered from [Yelp](https://www.yelp.com/developers/v3/manage_app)
* ```npm install```
* ```node index.js number_per_category``` to crawl data and store in ```output.js```
* run ```node upload_to_dynamo.js``` to upload crawled data to dynamo db by setting ```AWS_REGION``` and ```DYNAMO_TABLE_NAME``` in ```config.js```, assuming aws key/secret pair is in ~/.aws/credentials

### Explanation
* parameters are defined inside config.js
* YELP API has a limit of 50 returned items per request, a single threaded script like this can be slow, a lot of time wasted on network I/O, multi-threading can help, don't have time to do it though
* Dynamo API has limit of 25 items for batch request, which will make uploading slow too
* So far data is "stolen" from yelp to your own storage, what would you do with it? :)