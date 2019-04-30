import React from 'react';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';

export default class Income extends React.Component {
    render() {
        const spec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
            "data": {
                "url": "https://gist.githubusercontent.com/Miaomeow/a8bc78ee42115e7be26bc4885ff96130/raw/5be65f542c85b5655dd513be7ef568ec952295f2/income_2016.csv"
            },
            "width": 720,
            "height": 480,
            "transform": [
                { "filter": "datum.sex !== 'Sub-Total'" }
            ],
            "mark": {
                "type": "circle",
                "opacity": 0.8,
                "stroke": "black",
                "strokeWidth": 1
            },
            "encoding": {
                "x": {
                    "field": "income",
                    "type": "quantitative",
                    "axis": { "labelAngle": 0 }
                },
                "y": { "field": "district", "type": "nominal", "axis": { "title": "" } },
                "size": {
                    "field": "population",
                    "type": "quantitative",
                    "legend": { "title": "Population", "clipHeight": 30 },
                    "scale": { "range": [0, 500] }
                },
                "color": { "field": "sex", "type": "nominal", "legend": null },
                "tooltip": [{ "field": "area", "type": "nominal" },
                { "field": "district", "type": "nominal" },
                { "field": "income", "type": "quantitative" },
                { "field": "population", "type": "quantitative" }
                ]
            }
        };

        return (
            <div>
                <VegaLite
                    spec={spec}
                    tooltip={new Handler().call}
                />
            </div>
        )
    }
}