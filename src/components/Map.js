import React, { Component } from 'react';
import _ from 'lodash';

import mapboxgl from 'mapbox-gl'

import ParallelCoordinate from './ParallelCoordinate'
import TextVis from './TextVis'

import { hk_map, population_by_district, housing_estates_hk } from '../data'

import * as d3 from "d3";

export default class Map extends Component {

    constructor(props) {
        super(props)

        this.state = {
            districtHover: null,
            districtClick: null
        }

        // this.districtClick = null
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
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        1,
                        ["boolean", ["feature-state", "active"], false],
                        1,
                        // Default
                        0.6
                    ]
                },
                // "filter": ["==", "$type", "Polygon"]

            }, "water");

            // Set Roads and Aeroway to unvisible
            var layers = map.getStyle().layers
            for (var l in layers) {
                if (layers[l]["source-layer"] == "road" || layers[l]["source-layer"] == "aeroway") {
                    map.setLayoutProperty(layers[l]["id"], "visibility", "none")
                    // map.moveLayer(layers[l]["id"], "land")
                }
            }

            // Animation to HK
            map.flyTo({
                center: [114.1095, 22.3564],
                zoom: 10
            })
            /* -----------------  Init End  -----------------*/

            this.mapHoveredStateId = null
            this.mapClickedStateId = null

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

            map.on("click", "district-poly", (e) => {
                if (e.features.length > 0) {
                    // Object Compare
                    if (JSON.stringify(this.state.districtClick) !== JSON.stringify(e.features[0].properties)) {
                        this.setState({ districtClick: e.features[0].properties })

                        if (this.mapClickedStateId) {
                            map.setFeatureState({ source: 'districts', id: this.mapClickedStateId }, { active: false });
                        }
                        this.mapClickedStateId = e.features[0].id;
                        map.setFeatureState({ source: 'districts', id: this.mapClickedStateId }, { active: true });
                    } else {
                        this.setState({ districtClick: null })
                        if (this.mapClickedStateId) {
                            map.setFeatureState({ source: 'districts', id: this.mapClickedStateId }, { active: false });
                        }
                        this.mapHoveredStateId = e.features[0].id;
                    }
                }
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

    toggleColor = () => {
        const { scale1, scale2 } = this.state
        const json = housing_estates_hk

        var summary = {};
        for (const obj of json) {
            if (summary[obj["District"]] === undefined) {
                summary[obj["District"]] = { ...obj }
                summary[obj["District"]]["count"] = 1
            }
            else {
                for (const key in obj) {
                    summary[obj["District"]][key] += obj[key]
                }
                summary[obj["District"]]["count"] += 1
            }
        }

        var summary_average = [];
        for (const key in summary) {
            const new_obj = {
                "Average Domestic Household Size": summary[key]["Average Domestic Household Size"] / summary[key]["count"],
                "Median Age": summary[key]["Median Age"] / summary[key]["count"],
                "Median Monthly Domestic Household Income": summary[key]["Median Monthly Domestic Household Income"] / summary[key]["count"],
                "Median Rent to Income Ratio": summary[key]["Median Rent to Income Ratio"] / summary[key]["count"],
                "Population": summary[key]["Population"] / summary[key]["count"],
                "District": key
            }
            summary_average.push(new_obj)
        }

        // Set back to default
        this.toggleDefaultColor()

        // 2 option - Bivariate
        if (scale1 && scale2) {
            this.toggleBivariateColor(summary_average, scale1, scale2)
        }

        // 1 option - Linear
        else if (scale1 || scale2) {
            if (scale1)
                this.toggleLinearColor(summary_average, scale1)
            else
                this.toggleLinearColor(summary_average, scale2)
        }

    }

    toggleDefaultColor = () => {
        d3.select("#svg_legend").remove()
        d3.select("#canvas_legend").remove()

        const color_expression = "#888888"
        var layers = this.map.getStyle().layers
        for (var l in layers) {
            if (layers[l]["source"] == "districts") {
                this.map.setPaintProperty(layers[l]["id"], "fill-color", color_expression)
            }
        }
    }

    toggleLinearColor = (json, scale) => {

        if (!scale)
            return

        var max = 0, min = Infinity;
        var color_expression;

        if (json.length === 0)
            color_expression = "#888888"
        else
            color_expression = ["case", "#888888"];

        for (const obj of json) {
            obj[scale] > max && (max = obj[scale])
            obj[scale] < min && (min = obj[scale])
        }

        // Round up to 0.5 scale
        if (max - min < 5) {
            max = Math.ceil(max * 2) / 2
            min = Math.floor(min * 2) / 2
        }
        else {
            max = Math.ceil(max)
            min = Math.floor(min)
        }


        const color = this.linearColorScale(max, min, "red", "white")

        for (const obj of json) {
            color_expression.splice(1, 0, color(obj[scale]))
            color_expression.splice(1, 0, ["==", ["get", "District"], obj["District"]])
        }

        var layers = this.map.getStyle().layers
        for (var l in layers) {
            if (layers[l]["source"] == "districts") {
                this.map.setPaintProperty(layers[l]["id"], "fill-color", color_expression)
            }
        }
    }

    linearColorScale = (max, min, startColor, endColor) => {

        var legendheight = 200,
            legendwidth = 80,
            margin = { top: 10, right: 60, bottom: 10, left: 2 };

        var color = d3.scaleLinear([max, min], [startColor, endColor]);

        var legendscale = d3.scaleLinear()
            .domain(color.domain())
            .range([1, legendheight - margin.top - margin.bottom])
            .nice()

        console.log(color.domain(), legendscale(max), legendscale(min))

        var legendaxis = d3.axisRight()
            .scale(legendscale)
        // .tickSize(6)
        // .ticks(5);

        console.log(legendaxis)

        var canvas = d3.select("#map")
            .append("canvas")
            .attr("id", "canvas_legend")
            .attr("height", legendheight - margin.top - margin.bottom)
            .attr("width", 1)
            .style("height", (legendheight - margin.top - margin.bottom) + "px")
            .style("width", (legendwidth - margin.left - margin.right) + "px")
            .style("border", "1px solid #000")
            .style("position", "absolute")
            .style("bottom", (margin.bottom + 18) + "px")
            .style("right", (margin.right + 8) + "px")
            .node();

        var ctx = canvas.getContext("2d");

        var image = ctx.createImageData(1, legendheight);
        d3.range(legendheight).forEach(function (i) {
            var c = d3.rgb(color(legendscale.invert(i)));
            image.data[4 * i] = c.r;
            image.data[4 * i + 1] = c.g;
            image.data[4 * i + 2] = c.b;
            image.data[4 * i + 3] = 255;
        });
        ctx.putImageData(image, 0, 0);

        var svg = d3.select("#map")
            .append("svg")
            .attr("height", legendheight + "px")
            .attr("width", legendwidth + "px")
            .attr("id", "svg_legend")
            .style("position", "absolute")
            .style("bottom", "20px")
            .style("right", "10px")
            .style("cursor", "default")

        svg
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
            .call(legendaxis);

        return color
    }

    toggleBivariateColor = (json, scale1, scale2) => {

        if (!scale1 || !scale2)
            return

        var color_expression;
        if (population_by_district.length === 0)
            color_expression = "#888888"
        else
            color_expression = ["case", "#888888"];

        var data1 = Array.from(json.values(), d => d[scale1])
        var data2 = Array.from(json.values(), d => d[scale2])

        const color = this.bivariateColorScale(data1, data2, scale1, scale2)

        for (const obj of json) {
            color_expression.splice(1, 0, color(obj[scale1], obj[scale2]))
            color_expression.splice(1, 0, ["==", ["get", "District"], obj["District"]])
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
        SVG size
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
            .attr("id", "svg_legend")
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
        var root = document.createElementNS("http://www.w3.org/2000/svg", "g");
        root.innerHTML = string.trim();
        return root;
    }


    // data = [{ "latitude": 22.373578, "longitude": 114.131009, "Estate": "Kwai Chung Estate", "Population": 38674, "Median Age": 40.7, "Median Monthly Domestic Household Income": 16000, "Median Rent to Income Ratio": 10.6, "Average Domestic Household Size": 2.8, "District": "Tsuen Wan" }]
    toggleLocationPoint = (data) => {

        var divergingColorScale = d3.scaleLinear()
            .domain([0, 60])
            .range(["red", "blue"])
            .interpolate(d3.interpolateHslLong);

        const formatted_data = data.map(d => {
            return {
                coordinates: [d["longitude"], d["latitude"]],
                color: divergingColorScale(d['Median Rent to Income Ratio'])
            }
        })

        const populations = {
            "type": "FeatureCollection",
            "features": []
        }

        formatted_data.forEach(o => {
            populations.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": o.coordinates
                },
                "properties": {
                    "color": o.color
                }
            })
        })

        if (!this.map.getSource("populations")) {
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
                    'circle-radius': 4,
                    // color circles by ethnicity, using a match expression
                    // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
                    'circle-color': ['get', 'color']
                }
            });
        }
        else {
            this.map.getSource("populations").setData(populations)
        }


        var layers = this.map.getStyle().layers
    }

    render() {

        const { districtClick } = this.state

        const district_english = districtClick ? districtClick["District"] : null
        const district_chinese = districtClick ? districtClick["District_Chinese"] : null

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ position: "absolute", zIndex: 10 }}>
                    <button onClick={this.toggleRoads} > Toggle Roads </button>
                    {/* <button onClick={this.toggleLinearColor} > Toggle Linear Color </button> */}
                    {/* <button onClick={this.toggleLocationPoint} > Toggle Location Point </button> */}
                    <select name="scale1" onChange={event => this.setState({ scale1: event.target.value })}>
                        <option value="">Choose one for Linear</option>
                        <option value="Average Domestic Household Size">Average Domestic Household Size</option>
                        <option value="Median Age">Median Age</option>
                        <option value="Median Monthly Domestic Household Income">Median Monthly Domestic Household Income</option>
                        <option value="Median Rent to Income Ratio">Median Rent to Income Ratio</option>
                        <option value="Population">Population</option>
                    </select>
                    <select name="scale2" onChange={event => this.setState({ scale2: event.target.value })}>
                        <option value="">Choose two for Bivariate</option>
                        <option value="Average Domestic Household Size">Average Domestic Household Size</option>
                        <option value="Median Age">Median Age</option>
                        <option value="Median Monthly Domestic Household Income">Median Monthly Domestic Household Income</option>
                        <option value="Median Rent to Income Ratio">Median Rent to Income Ratio</option>
                        <option value="Population">Population</option>
                    </select>
                    <button onClick={this.toggleColor} > Toggle Color </button>
                    {/* <button onClick={this.toggleBivariateColor} > Toggle Bivariate Color </button> */}
                </div>

                <div style={{ position: "relative", width: '75%', height: "100%" }}>
                    <div id='map' style={{ width: '100%', height: '70%' }}></div>
                    <div style={{ width: '100%', height: '30%', position: "absolute", bottom: 0, background: "white" }}>
                        <ParallelCoordinate onBrush={this.toggleLocationPoint} district={district_english} />
                    </div>
                </div>

                <div style={{ position: "absolute", background: "#fff", width: "25%", height: "100%", top: '115px', right: 0 }}>
                    {
                        district_chinese
                            ?
                            <TextVis
                                // District in Chinese
                                district={district_chinese}
                            />
                            :
                            null
                    }
                </div>
            </div>
        )
    }

}
