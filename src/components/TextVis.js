import React, { useState } from 'react';
import randomColor from 'randomcolor';
import TagCloud from 'react-tag-cloud';
import CloudItem from './CloudItem';
import '../styles/TextVis.css';
import * as d3 from "d3";

const renderWordCloud = (district) => {

  if (!district)
    return

  const json = require(`../data/google-trends/${district}/${district}.json`);

  const valueArr = json.map(el => el.value);

  const fontSizeScale = d3.scaleLinear()
    .domain([Math.min(...valueArr), Math.max(...valueArr)])
    .range([15, 40]);

  return (
    json.map(({query, value}, i) => (
        <CloudItem
            key={i}
            text={query}
            value={value}
            style={{fontSize: fontSizeScale(value)}}
        />
    ))
  );
}

const TextVis = (props) => {
  
  // const [district, setDistrict] = useState('中西區');

  return (
    <div className='app-outer'>
        <div className='app-inner'>
        {/* <select name="districts" onChange={event => setDistrict(event.target.value)}>
          <option value="中西區">中西區</option>
          <option value="九龍城區">九龍城區</option>
          <option value="元朗區">元朗區</option>
          <option value="北區">北區</option>
          <option value="南區">南區</option>
          <option value="大埔區">大埔區</option>
          <option value="屯門區">屯門區</option>
          <option value="東區">東區</option>
          <option value="沙田區">沙田區</option>
          <option value="油尖旺區">油尖旺區</option>
          <option value="深水埗區">深水埗區</option>
          <option value="灣仔區">灣仔區</option>
          <option value="荃灣區">荃灣區</option>
          <option value="葵青區">葵青區</option>
          <option value="西貢區">西貢區</option>
          <option value="觀塘區">觀塘區</option>
          <option value="離島區">離島區</option>
          <option value="黃大仙區">黃大仙區</option>
        </select> */}
          <TagCloud 
            className='tag-cloud'
            style={{
              fontFamily: 'sans-serif',
              fontSize: 30,
              color: () => randomColor({ hue: 'blue' }),
              padding: 5,
            }}>
            {renderWordCloud(props.district)}
          </TagCloud>
        </div>
    </div>
)};

export default TextVis;
