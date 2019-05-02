import React from 'react';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import * as d3 from "d3";

import _2018 from '../data/AirQualityCleaned/2018.csv';
import _0100_0500_2018 from '../data/AirQualityCleaned/0100_0500_2018.csv';
import _0600_1000_2018 from '../data/AirQualityCleaned/0600_1000_2018.csv';
import _1100_1300_2018 from '../data/AirQualityCleaned/1100_1300_2018.csv';
import _1400_1800_2018 from '../data/AirQualityCleaned/1400_1800_2018.csv';
import _1900_2400_2018 from '../data/AirQualityCleaned/1900_2400_2018.csv';

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

    onSliderChange(value){
        switch(value){
            case 0: this.fetchData('0000_2400_2018'); break;
            case 1: this.fetchData('0100_0500_2018'); break;
            case 2: this.fetchData('0600_1000_2018'); break;
            case 3: this.fetchData('1100_1300_2018'); break;
            case 4: this.fetchData('1400_1800_2018'); break;
            case 5: this.fetchData('1900_2400_2018'); break;
        }
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
                    scale: { "scheme": "redyellowgreen", "reverse": true }
                },
                opacity: {
                    condition: { selection: "highlight", value: 1 },
                    value: 0.5
                }
            }
        };

        const sliderMarks = {
            0: 'All day',
            1: '0100 - 0500',
            2: '0600 - 1000',
            3: '1100 - 1300',
            4: '1400 - 1800',
            5: '1900 -2400'
        }

        return (
            <div>
                <Slider min={0} max={5} defaultValue={0} marks={sliderMarks} onChange={this.onSliderChange.bind(this)}/>
                <div style={{marginTop: '30px'}}>
                <VegaLite
                    spec={{ title: this.state.title, ...spec }}
                    data={this.state.data}
                    tooltip={new Handler().call}
                />
                </div>
            </div>
        )
    }
}