import React from 'react';
import {ParallelCoordinates} from 'react-parcoords';
import 'react-parcoords/d3.parcoords.css';
import * as d3 from "d3";

const json = require('../data/housing_estates_hk.json');

const dimensions = {
    'Population': {
        title: 'Population',
        type: 'number'
    },
    'Median Age': {
        title: 'Median Age',
        type: 'number'
    },
    'Median Monthly Domestic Household Income': {
        title: 'Median Monthly Domestic Household Income',
        type: 'number'
    },
    'Median Rent to Income Ratio': {
        title: 'Median Rent to Income Ratio',
        type: 'number'
    },
    'Average Domestic Household Size': {
        title: 'Average Domestic Household Size',
        type: 'number'
    },
    'District': {
        title: 'District',
        type: 'string'
    }
};

const data = Object.keys(json).map(key => json[key]);

//Population [1549, 39964]
//Median Age [30, 66]
//Median Rent to Income Ratio [0, 60]
var divergingColorScale = d3.scaleLinear()
  .domain([0, 60])
  .range(["red", "blue"])
  .interpolate(d3.interpolateHslLong);

const props = {
    // color: (d) => districtColor[d.District],
    color: d => divergingColorScale(d['Median Rent to Income Ratio']),
    width: 1500,
    height: 500,
    dimensions,
    data: data,
    highlights: [],
    // onBrush: console.log,
    // onBrushEnd: console.log,
    // onLineHover: console.log,
    // onLinesHover: console.log
};

const districtColor = {
    'Southern': "#e2d43b",
    'Tuen Mun': "#ef712d",
    'Eastern': "#c17032",
    'Sham Shui Po': "#ffd3cc",
    'Kwai Tsing': "#c8e884",
    'Tsuen Wan': "#02c97c",
    'North': "#c10329",
    'Wong Tai Sin': "#306ab2",
    'Kwun Tong': "#d1f961",
    'Sha Tin': "#c0f963",
    'Tai Po': "#98f9f5",
    'Islands': "#4341e0",
    'Yuen Long': "#d33990",
    'Sai Kung': "#e5fc8a",
    'Kowloon City': "#db628c",
    'Yau Tsim Mong': "#dd1850",
    'Central & Western': "#f47aec",
    'Wan Chai': "#99fcfc"
};

class ParallelCoordinate extends React.Component {
    render() {
        return (
            <ParallelCoordinates {...props}/>
        );
    }
}

export default ParallelCoordinate;