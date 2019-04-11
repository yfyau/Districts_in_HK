const fs = require('fs');
const util = require('util')

const filename = './data/districts.txt'

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + filename);
    const data_arr = data.split('\n');
    
    const result = {
        districts: []
    };

    var district_obj = { name: '?', locations: [] };

    data_arr.forEach(element => {
        if(element.includes('[編輯]')){
            //push old district_obj
            result.districts.push(district_obj);
            //create new district_obj
            district_obj = {
                name: element.replace('[編輯]', ''),
                locations: []
            }
        } else {
            if(element !== ''){
                district_obj.locations.push(element);
            }
        }
    });

    result.districts.push(district_obj);

    var json = JSON.stringify(result);
    fs.writeFile('myjsonfile.json', json, 'utf8');
})