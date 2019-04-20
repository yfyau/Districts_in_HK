import React, { Component } from 'react';
import randomColor from 'randomcolor';
import TagCloud from 'react-tag-cloud';
import CloudItem from './CloudItem';
import '../styles/TextVis.css';
import * as d3 from "d3";

const json = require('../data/google-trends/中西區/中西區.json');

const valueArr = json.map(el => el.value);

var fontSizeScale = d3.scaleLinear()
  .domain([Math.min(...valueArr), Math.max(...valueArr)])
  .range([20, 50]);

const TextVis = () => (
    <div className='app-outer'>
        <div className='app-inner'>
          <h1>中西區</h1>
          <TagCloud 
            className='tag-cloud'
            style={{
              fontFamily: 'sans-serif',
              fontSize: 30,
              color: () => randomColor({ hue: 'blue' }),
              padding: 5,
            }}>
            {json.map(({query, value}) => (
                <CloudItem
                    text={query}
                    value={value}
                    style={{fontSize: fontSizeScale(value)}}
                />
            ))}
          </TagCloud>
        </div>
    </div>
);

export default TextVis;
