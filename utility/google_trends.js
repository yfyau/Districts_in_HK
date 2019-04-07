const googleTrends = require('google-trends-api');

const DISTRICTS = [
    //hong kong
    '中西區', '灣仔區', '東區', '南區',
    //kowloon
    '油尖旺區', '深水埗區', '九龍城區', '黃大仙區', '觀塘區',
    //new territories
    '荃灣區', '葵青區', '西貢區', '沙田區', '大埔區', '北區', '屯門區', '元朗區', '離島區'
];

googleTrends.relatedQueries({
    keyword: DISTRICTS[0],
    geo: 'HK',
    hl: 'zh-TW'
})
.then(function(results){
  console.log(results);
})
.catch(function(err){
  console.error('Oh no there was an error', err);
});