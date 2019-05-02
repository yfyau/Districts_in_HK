import React, { Component } from 'react';
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
    json.map(({ query, value }, i) => (
      <CloudItem
        key={i}
        text={query}
        value={value}
        style={{ 
          fontSize: fontSizeScale(value),
          fontFamily: "DFKai-sb"
        }}
      />
    ))
  );
}

class TextVis extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.district === this.props.district)
      return false

    return true
  }

  render() {
    return (
      <div className='app-outer'>
        <div className='app-inner'>
          <TagCloud
            className='tag-cloud'
            style={{
              fontFamily: 'sans-serif',
              fontSize: 30,
              color: () => randomColor({
                luminosity: 'dark',
                format: 'rgb'
              }),
              padding: 5,
            }}>
            {renderWordCloud(this.props.district)}
          </TagCloud>
        </div>
      </div>
    )
  }
};

export default TextVis;
