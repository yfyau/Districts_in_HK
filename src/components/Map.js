import React, { Component } from 'react';
import _ from 'lodash';

import mapboxgl from 'mapbox-gl'

import TextVis from './TextVis'

import { test } from '../data/test'

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
                data: test
            });


            const fake_data = [
                { "District": "Central & Western", "rank": 1 },
                { "District": "Wan Chai", "rank": 10 },
            ]

            let color_expression = ["case",
                ["==", ["get", "District"], "Central & Western"], "red",
                ["==", ["get", "District"], "Wan Chai"], "blue",
                ["==", ["get", "District"], "Eastern"], "pink",
                ["==", ["get", "District"], "Southern"], "orange",
                ["==", ["get", "District"], "Wan Chai"], "blue",
                "#888888"
            ];

            // fake_data.forEach(function (row) {
            //     var green = row["rank"] / 10 * 255;
            //     var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
            //     color_expression.push(row["District"], color);
            // });

            console.log(color_expression)

            map.addLayer({
                "id": "district-poly",
                "type": "fill",
                "source": "districts",
                "paint": {
                    "fill-color": color_expression,
                    "fill-opacity": ["case",
                        ["boolean", ["feature-state", "hover"], false],
                        1,
                        0.5
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



    render() {

        const { districtHover } = this.state

        const district_chinese = districtHover ? districtHover["District_Chinese"] : null

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <button onClick={this.toggleRoads} style={{ position: "fixed", zIndex: 10 }}> Toggle Roads </button>
                <div id='map' style={{ width: '100%', height: '100%' }}></div>
                <div style={{ position: "fixed", background: "rgba(0, 0, 0, 0.5)", height: "60vh", width: "30vw", top: 0, right: 0 }}>
                    <TextVis
                        // District in Chinese
                        district={district_chinese}
                    />
                </div>
            </div>
        )
    }

}
