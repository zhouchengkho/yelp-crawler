## Yelp Scraper

### What is it
* Yelp restaurants crawler
* Automatically crawls restaurants and generate JSON file as output
* output.json is generated file, check it out

### Usage
* create your own ```config.js``` referencing ```config_sample.js```, define ```YELP_AUTH```, a free key can be registered from [Yelp](https://www.yelp.com/developers/v3/manage_app)
* ```npm install```
* ```node index.js number_per_category```

### Explanation
* categories are defined inside config.js
* YELP API has a limit of 50 returned items per request, a single threaded script like this can be slow, a lot of time wasted on network I/O
* let me know if you have some cool ideas to make it faster, thanks