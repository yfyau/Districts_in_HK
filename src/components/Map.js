import React, { Component } from 'react';
import _ from 'lodash';

import mapboxgl from 'mapbox-gl'

import { test } from '../data/test'

export default class Map extends Component {

    componentDidMount() {

        mapboxgl.accessToken = 'pk.eyJ1IjoieWZ5YXUiLCJhIjoiY2p1NDFlaHR5MHQ4OTN5cGdoZXA3OGxzMyJ9.FJxztWx2bSr4Y-AASpOxrQ';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10'
        });

        map.on('load', function () {
            map.addSource("districts", {
                type: "geojson",
                data: test
            });

            map.addLayer({
                "id": "districts-boundary",
                "type": "fill",
                "source": "districts",
                "paint": {
                    "fill-color": "#888888",
                    "fill-opacity": 0.4
                },
                // "filter": ["==", "$type", "Polygon"]

            }, "water");
            
            console.log(map.getStyle())


            map.flyTo({
                center: [114.1095, 22.3964],
                zoom: 10
            })
        });

    }

    render() {

        return (
            <div id='map' style={{ width: '100%', height: '100%' }}></div>
        )
    }

}
