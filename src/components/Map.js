import React, { Component } from 'react';
import _ from 'lodash';

import mapboxgl from 'mapbox-gl'

import { test } from '../data/test'

export default class Map extends Component {

    constructor(props) {
        super(props)
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

            map.addLayer({
                "id": "district-poly",
                "type": "fill",
                "source": "districts",
                "paint": {
                    "fill-color": "#888888",
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
                }
            });

            map.on("mouseleave", "district-poly", () => {
                if (this.mapHoveredStateId) {
                    map.setFeatureState({ source: 'districts', id: this.mapHoveredStateId }, { hover: false });
                }
                this.mapHoveredStateId = null;
            });
        });

        this.map = map;
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

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <button onClick={this.toggleRoads} style={{ position: "fixed", zIndex: 10 }}> Toggle Roads </button>
                <div id='map' style={{ width: '100%', height: '100%' }}></div>
            </div>
        )
    }

}
