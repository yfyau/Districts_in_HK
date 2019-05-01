import React from 'react';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';

const incomeSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": {
        "url": "https://gist.githubusercontent.com/Miaomeow/a8bc78ee42115e7be26bc4885ff96130/raw/5be65f542c85b5655dd513be7ef568ec952295f2/income_2016.csv"
    },
    "title": "Median Income of Hong Kong Population in 2016",
    "width": 720,
    "height": 480,
    "transform": [
        { "filter": "datum.sex == 'Sub-Total'" }
    ],
    "mark": {
        "type": "point",
        "opacity": 0.8,
        "stroke": "black",
        "strokeWidth": 1,
        "filled": true
    },
    "encoding": {
        "x": {
            "field": "income",
            "type": "quantitative",
            "axis": { "labelAngle": 0 },
            "scale": { "domain": [0, 90000] }
        },
        "y": { "field": "district", "type": "nominal", "axis": { "title": "" }, "sort": { "field": "territory" } },
        "size": {
            "field": "population",
            "type": "quantitative",
            "legend": { "title": "Population", "clipHeight": 30 },
            "scale": { "range": [0, 500] }
        },
        "color": {
            "field": "district", "type": "nominal", "legend": null,
            "scale": { "scheme": "tableau20" }
        },
        "shape": { "field": "territory", "type": "nominal" },
        "tooltip": [{ "field": "area", "type": "nominal" },
        { "field": "district", "type": "nominal" },
        { "field": "income", "type": "quantitative" },
        { "field": "population", "type": "quantitative" }
        ]
    }
};

const incomeBySexSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": {
        "url": "https://gist.githubusercontent.com/Miaomeow/a8bc78ee42115e7be26bc4885ff96130/raw/5be65f542c85b5655dd513be7ef568ec952295f2/income_2016.csv"
    },
    "title": "Median Income of Hong Kong Population by sex in 2016",
    "width": 720,
    "height": 480,
    "transform": [
        { "filter": "datum.sex !== 'Sub-Total'" }
    ],
    "mark": {
        "type": "point",
        "opacity": 0.8,
        "stroke": "black",
        "strokeWidth": 1,
        "filled": true
    },
    "encoding": {
        "x": {
            "field": "income",
            "type": "quantitative",
            "axis": { "labelAngle": 0 }
        },
        "y": { "field": "district", "type": "nominal", "axis": { "title": "" }, "sort": { "field": "territory" } },
        "size": {
            "field": "population",
            "type": "quantitative",
            "legend": { "title": "Population", "clipHeight": 30 },
            "scale": { "range": [0, 500] }
        },
        "color": {
            "field": "sex", "type": "nominal",
            "legend": { "title": "Sex" },
            "scale": {
                "domain": ["Female", "Male"],
                "range": ["pink", "LightSkyBlue"]
            }
        },
        "shape": { "field": "territory", "type": "nominal" },
        "tooltip": [{ "field": "area", "type": "nominal" },
        { "field": "district", "type": "nominal" },
        { "field": "income", "type": "quantitative" },
        { "field": "population", "type": "quantitative" }
        ]
    }
};

export default class Income extends React.Component {
    render() {
        return (
            <div>
                <VegaLite
                    spec={incomeSpec}
                    tooltip={new Handler().call}
                />
                <VegaLite
                    spec={incomeBySexSpec}
                    tooltip={new Handler().call}
                />
            </div>
        )
    }
}