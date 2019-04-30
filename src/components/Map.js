import React, { Component } from 'react';
import _ from 'lodash';

import mapboxgl from 'mapbox-gl'

import TextVis from './TextVis'

import { hk_map, population_by_district } from '../data'

import * as d3 from "d3";

export default class Map extends Component {

    constructor(props) {
        super(props)

        this.state = {
            districtHover: null
        }
    }


    componentDidMount() {

        mapboxgl.accessToken = 'pk.eyJ1IjoieWZ5YXUiLCJhIjoiY2p1NDFlaHR5MHQ4OTN5cGdoZXA3OGxzMyJ9.FJxztWx2bSr4Y-AASpOxrQ';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10'
        });

        map.on('load', () => {
            /* ----------------- Init Start -----------------*/
            map.addSource("districts", {
                type: "geojson",
                data: hk_map
            });

            map.addLayer({
                "id": "district-poly",
                "type": "fill",
                "source": "districts",
                "paint": {
                    "fill-color": "#888888",
                    "fill-opacity": ["case",
                        ["boolean", ["feature-state", "hover"], false],
                        1,
                        0.6
                    ]
                },
                // "filter": ["==", "$type", "Polygon"]

            }, "water");

            // Set Roads and Aeroway to unvisible
            var layers = map.getStyle().layers
            console.log(layers)
            for (var l in layers) {
                if (layers[l]["source-layer"] == "road" || layers[l]["source-layer"] == "aeroway") {
                    map.setLayoutProperty(layers[l]["id"], "visibility", "none")
                    // map.moveLayer(layers[l]["id"], "land")
                }
            }

            // Animation to HK
            map.flyTo({
                center: [114.1095, 22.3964],
                zoom: 10
            })
            /* -----------------  Init End  -----------------*/

            this.mapHoveredStateId = null
            map.on("mousemove", "district-poly", (e) => {
                if (e.features.length > 0) {
                    if (this.mapHoveredStateId) {
                        map.setFeatureState({ source: 'districts', id: this.mapHoveredStateId }, { hover: false });
                    }
                    this.mapHoveredStateId = e.features[0].id;
                    map.setFeatureState({ source: 'districts', id: this.mapHoveredStateId }, { hover: true });

                    // Object Compare
                    if (JSON.stringify(this.state.districtHover) !== JSON.stringify(e.features[0].properties))
                        this.setState({ districtHover: e.features[0].properties })
                }
            });

            map.on("mouseleave", "district-poly", () => {
                if (this.mapHoveredStateId) {
                    map.setFeatureState({ source: 'districts', id: this.mapHoveredStateId }, { hover: false });
                }
                this.mapHoveredStateId = null;

                if (this.state.districtHover)
                    this.setState({ districtHover: null })
            });
        });

        this.map = map;
    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    toggleRoads = () => {
        // Set Roads and Aeroway to unvisible
        var layers = this.map.getStyle().layers
        for (var l in layers) {
            if (layers[l]["source-layer"] == "road" || layers[l]["source-layer"] == "aeroway") {
                var value = this.map.getLayoutProperty(layers[l]["id"], "visibility")
                if (value == "visible")
                    this.map.setLayoutProperty(layers[l]["id"], "visibility", "none")
                else
                    this.map.setLayoutProperty(layers[l]["id"], "visibility", "visible")
                // map.moveLayer(layers[l]["id"], "land")
            }
        }
    }

    toggleLinearColor = () => {

        var max = 0, min = Infinity;
        var color_expression;


        if (population_by_district.length === 0)
            color_expression = "#888888"
        else
            color_expression = ["case", "#888888"];

        for (const districtObj of population_by_district) {
            districtObj["2016"] > max && (max = districtObj["2016"])
            districtObj["2016"] < min && (min = districtObj["2016"])
        }

        const color = this.linearColorScale(max, min, "red", "white")

        for (const districtObj of population_by_district) {
            color_expression.splice(1, 0, color(districtObj["2016"]))
            color_expression.splice(1, 0, ["==", ["get", "District"], districtObj["District"]])
        }

        var layers = this.map.getStyle().layers
        for (var l in layers) {
            if (layers[l]["source"] == "districts") {
                this.map.setPaintProperty(layers[l]["id"], "fill-color", color_expression)
            }
        }
    }

    linearColorScale = (max, min, startColor, endColor) => {
        var color = d3.scaleLinear([max, min], [startColor, endColor]);
        return color
    }

    toggleBivariateColor = () => {

        var max = 0, min = Infinity;
        var color_expression;


        if (population_by_district.length === 0)
            color_expression = "#888888"
        else
            color_expression = ["case", "#888888"];

        for (const districtObj of population_by_district) {
            districtObj["2016"] > max && (max = districtObj["2016"])
            districtObj["2016"] < min && (min = districtObj["2016"])
        }

        var data1 = Array.from(population_by_district.values(), d => d["2016"])
        var data2 = Array.from(population_by_district.values(), d => d["2016"])

        const color = this.bivariateColorScale(data1, data2, "population_2016", "population_2016")

        for (const districtObj of population_by_district) {
            color_expression.splice(1, 0, color(districtObj["2016"], districtObj["2016"]))
            color_expression.splice(1, 0, ["==", ["get", "District"], districtObj["District"]])
        }

        var layers = this.map.getStyle().layers
        for (var l in layers) {
            if (layers[l]["source"] == "districts") {
                this.map.setPaintProperty(layers[l]["id"], "fill-color", color_expression)
            }
        }
    }

    /* 
        TODO: 
        Test for two datasets
        SVG append multi-times 
        SVG size
        Toggle
    */
    bivariateColorScale = (data1, data2, title1 = "unknown", title2 = "unknown") => {

        // const colors = [
        //     "#e8e8e8", "#e4acac", "#c85a5a",
        //     "#b0d5df", "#ad9ea5", "#985356",
        //     "#64acbe", "#627f8c", "#574249"
        // ];

        const colors = [
            "#e8e8e8", "#ace4e4", "#5ac8c8",
            "#dfb0d6", "#a5add3", "#5698b9",
            "#be64ac", "#8c62aa", "#3b4994"
        ]

        const labels = ["low", "", "high"]

        const n = Math.floor(Math.sqrt(colors.length))

        const svg = d3.create("svg")
            .attr("viewBox", "0 0 1100 900")
            .style("width", "100%")
            .style("height", "auto")
            .style("position", "absolute")
            .style("top", "0")
            .style("pointer-events", "none");


        const legend = () => {
            const k = 24;
            const arrow = "arrow";

            return this.stringToSVG(`<g font-family=sans-serif font-size=10 >
                    <g transform="translate(-${k * n / 2},-${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})">
                        <marker id="${arrow.id}" markerHeight=10 markerWidth=10 refX=6 refY=3 orient=auto>
                    <path d="M0,0L9,3L0,6Z" />
                  </marker>
            ${
                d3.cross(d3.range(n), d3.range(n)).map(([i, j]) =>
                    this.stringToSVG(`<rect width=${k} height=${k} x=${i * k} y=${(n - 1 - j) * k} fill=${colors[j * n + i]}>
                    <title>${title1}${labels[j] && ` (${labels[j]})`}
              ${title2}${labels[i] && ` (${labels[i]})`}</title>
                  </rect>`
                    ).outerHTML)}

            <line marker-end="${arrow}" x1=0 x2 = ${n * k} y1 = ${n * k} y2 = ${n * k} stroke = black stroke - width=1.5 />
                <line marker-end="${arrow}" y2=0 y1 = ${n * k} stroke = black stroke - width=1.5 />
                    <text font-weight="bold" dy="0.71em" transform="rotate(90) translate(${n / 2 * k},6)" text-anchor="middle">${title1}</text>
                    <text font-weight="bold" dy="0.71em" transform="translate(${n / 2 * k},${n * k + 6})" text-anchor="middle">${title2}</text>
                </g>
              </g>`)

        }

        svg.append(legend)
            .attr("transform", "translate(870,450)");

        d3.select("#map").append(function () { return svg.node(); });

        var x = d3.scaleQuantile(data1, d3.range(n))
        var y = d3.scaleQuantile(data2, d3.range(n))

        return (a, b) => {
            if (!a || !b) return "#ccc";

            return colors[y(b) + x(a) * n]
        };
    }

    stringToSVG = (string) => {
        console.log(string)
        var root = document.createElementNS("http://www.w3.org/2000/svg", "g");
        root.innerHTML = string.trim();
        return root;
    }


    // data = [{ "latitude": 22.373578, "longitude": 114.131009, "Estate": "Kwai Chung Estate", "Population": 38674, "Median Age": 40.7, "Median Monthly Domestic Household Income": 16000, "Median Rent to Income Ratio": 10.6, "Average Domestic Household Size": 2.8, "District": "Tsuen Wan" }]
    toggleLocationPoint = () => {

        const test_data = [{ "latitude": 22.373578, "longitude": 114.131009, "Estate": "Kwai Chung Estate", "Population": 38674, "Median Age": 40.7, "Median Monthly Domestic Household Income": 16000, "Median Rent to Income Ratio": 10.6, "Average Domestic Household Size": 2.8, "District": "Tsuen Wan" }, { "latitude": 22.3183094, "longitude": 114.2329969, "Estate": "Sau Mau Ping Estate", "Population": 36944, "Median Age": 44.1, "Median Monthly Domestic Household Income": 20300, "Median Rent to Income Ratio": 11.7, "Average Domestic Household Size": 3.1, "District": "Kwun Tong" }, { "latitude": 22.4579826, "longitude": 113.9991517, "Estate": "Kingswood Villas", "Population": 39964, "Median Age": 44.4, "Median Monthly Domestic Household Income": 28750, "Median Rent to Income Ratio": 33.7, "Average Domestic Household Size": 2.8, "District": "Yuen Long" }, { "latitude": 22.3366356, "longitude": 114.1402195, "Estate": "Mei Foo Sun Chuen", "Population": 37303, "Median Age": 42.7, "Median Monthly Domestic Household Income": 46740, "Median Rent to Income Ratio": 30.9, "Average Domestic Household Size": 3.1, "District": "Sham Shui Po" }, { "latitude": 22.2865471, "longitude": 114.2189883, "Estate": "Taikoo Shing", "Population": 35509, "Median Age": 43.5, "Median Monthly Domestic Household Income": 59500, "Median Rent to Income Ratio": 28, "Average Domestic Household Size": 3, "District": "Eastern" }]

        const coordinates = test_data.map(d => [d["longitude"], d["latitude"]])

        console.log(coordinates)


        const populations = {
            "type": "FeatureCollection",
            "features": []
        }

        coordinates.forEach(c => {
            populations.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": c
                }
            })
        })

        this.map.addSource("populations", {
            type: "geojson",
            data: populations
        });

        this.map.addLayer({
            'id': 'population-circles',
            'type': "circle",
            'source': "populations",
            // 'source-layer': 'districts',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                // make circles larger as the user zooms from z12 to z22
                'circle-radius': {
                    'base': 1.75,
                    'stops': [[12, 2], [22, 180]]
                },
                // color circles by ethnicity, using a match expression
                // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
                'circle-color': [
                    'match',
                    ['get', 'ethnicity'],
                    'White', '#fbb03b',
                    'Black', '#223b53',
                    'Hispanic', '#e55e5e',
                    'Asian', '#3bb2d0',
                /* other */ '#000'
                ]
            }
        });

        var layers = this.map.getStyle().layers
        console.log(layers)
    }

    render() {

        const { districtHover } = this.state

        const district_chinese = districtHover ? districtHover["District_Chinese"] : null

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ position: "fixed", zIndex: 10 }}>
                    <button onClick={this.toggleRoads} > Toggle Roads </button>
                    <button onClick={this.toggleLinearColor} > Toggle Linear Color </button>
                    <button onClick={this.toggleBivariateColor} > Toggle Bivariate Color </button>
                    <button onClick={this.toggleLocationPoint} > Toggle Location Point </button>
                </div>
                <div id='map' style={{ width: '100%', height: '100%' }}></div>
                {
                    district_chinese
                        ?
                        <div style={{ position: "fixed", background: "rgba(0, 0, 0, 0.5)", height: "60vh", width: "30vw", top: 0, right: 0 }}>
                            <TextVis
                                // District in Chinese
                                district={district_chinese}
                            />
                        </div>
                        :
                        null
                }
            </div>
        )
    }

}
