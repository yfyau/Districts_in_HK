'use strict';
const fs = require('fs');
const googleTrends = require('google-trends-api');

const rawdata = fs.readFileSync('./data/hk_districts.json');  
const json = JSON.parse(rawdata);

json.districts.forEach(district => {
  //create a folder for each district
  const dir = `./data/${district.name}`;
  fs.mkdirSync(dir);

  //find related queries of the district
  googleTrends.relatedQueries({
      keyword: district.name,
      geo: 'HK',
      hl: 'zh-TW'
  })
  .then(function(results){
    const related_queries_obj = JSON.parse(results)
      .default
      .rankedList[1]
      .rankedKeyword;
    
    for(var i=0; i<related_queries_obj.length; i++){
      const original_query = related_queries_obj[i].query;
      related_queries_obj[i].query = original_query.split(' ').join('');
    }

      fs.writeFile(`${dir}/${district.name}.json`, JSON.stringify(related_queries_obj), 'utf8');
  });

  //find related queries for each location in the district
  district.locations.forEach(location => {
    googleTrends.relatedQueries({
        keyword: location,
        geo: 'HK',
        hl: 'zh-TW'
    })
    .then(function(results){
      const related_queries_obj = JSON.parse(results)
        .default
        .rankedList[1]
        .rankedKeyword;
      
      for(var i=0; i<related_queries_obj.length; i++){
        const original_query = related_queries_obj[i].query;
        related_queries_obj[i].query = original_query.split(' ').join('');
      }

        fs.writeFile(`${dir}/${location}.json`, JSON.stringify(related_queries_obj), 'utf8');
    });
  });
});
