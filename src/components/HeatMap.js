import React from 'react';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';

import * as d3 from "d3";

import _2018 from '../data/AirQualityCleaned/2018.csv';
import _0100_0500_2018 from '../data/AirQualityCleaned/0100_0500_2018.csv';
import _0600_1000_2018 from '../data/AirQualityCleaned/0600_1000_2018.csv';
import _1100_1300_2018 from '../data/AirQualityCleaned/1100_1300_2018.csv';
import _1400_1800_2018 from '../data/AirQualityCleaned/1400_1800_2018.csv';
import _1900_2400_2018 from '../data/AirQualityCleaned/1900_2400_2018.csv';


const allYearsSpec = {
    data: { url: 'https://gist.githubusercontent.com/ptrknow/911546be7201dbdc17e57342bf1d2dbe/raw/1e1e4caeb0051a19abdc45aa6797be69c2cd9eb9/average_across_years.csv' },
    width: 1000,
    height: 400,
    title: 'Monthly Average of Air Quality',
    mark: 'rect',
    selection: { highlight: {type: "single"}} ,
    encoding: {
      x: { field: 'Month of Year', type: 'o' },
      y: { field: 'District', type: 'n' },
      color: {
        field: 'AQHI',
        type: 'q',
        scale: { scheme: 'blueorange', domain: [1.5, 5.5] }
      },
      opacity: {
        condition: { selection: "highlight", value: 1},
        value: 0.5
      }
    }
  };

export default class HeatMap extends React.Component {
    state = {
        title: '',
        data: { values: [] }
    }

    fetchData(data) {
        //fetch data from local file
        let filePath;

        switch (data) {
            case '0100_0500_2018': filePath = _0100_0500_2018; break;
            case '0600_1000_2018': filePath = _0600_1000_2018; break;
            case '1100_1300_2018': filePath = _1100_1300_2018; break;
            case '1400_1800_2018': filePath = _1400_1800_2018; break;
            case '1900_2400_2018': filePath = _1900_2400_2018; break;
            default: filePath = _2018; break;
        }

        d3.csv(filePath, d => ({
            month: +d.Month,
            location: d.Location,
            avg_monthly_aqhi: d.AQHI
        })).then(values => {
            this.setState({
                data: { values }
            })
        })

        //set title of graph
        const [startTime, endTime, year] = data.split('_');
        this.setState({
            title: `Hong Kong Air Quality in ${year} (${startTime} - ${endTime})`
        })
    }

    componentDidMount() {
        this.fetchData('0000_2400_2018');
    }

    render() {
        const spec = {
            width: 500,
            height: 400,
            mark: 'rect',
            selection: { highlight: { type: "single" } },
            encoding: {
                x: { field: 'month', type: 'o' },
                y: { field: 'location', type: 'n' },
                color: {
                    field: 'avg_monthly_aqhi',
                    type: 'q',
                    scale: { scheme: 'blueorange', domain: [1.5, 6] }
                },
                opacity: {
                    condition: { selection: "highlight", value: 1 },
                    value: 0.5
                }
            }
        };

        return (
            <div style={{margin: 50}}>
                <select name="districts" onChange={(event) => {
                    this.fetchData(event.target.value);
                }}>
                    <option value="0000_2400_2018">All day</option>
                    <option value="0100_0500_2018">0100 - 0500</option>
                    <option value="0600_1000_2018">0600 - 1000</option>
                    <option value="1100_1300_2018">1100 - 1300</option>
                    <option value="1400_1800_2018">1400 - 1800</option>
                    <option value="1900_2400_2018">1900 - 2400</option>
                </select>
                <VegaLite
                    spec={{ title: this.state.title, ...spec }}
                    data={this.state.data}
                    tooltip={new Handler().call}
                />
                <VegaLite
                    spec={allYearsSpec}
                    tooltip={new Handler().call}
                />
            </div>
        )
    }
}