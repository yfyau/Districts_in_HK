import React, { Component } from 'react';
import * as d3 from "d3";
import _ from 'lodash';

import { hk_map } from "../data/hk_map"
import '../styles/ForceDirectedMap.css';

const width = 960;
const height = 500;

export default class ForceDirectedMap extends Component {

    componentDidMount() {
        this.path = d3.geo.path(),
        this.force = d3.layout.force().size([width, height]);
        this.svg = d3.select("body").append("svg")
                                    .attr("width", width)
                                    .attr("height", height);
        
        
        this.renderMap();
    }

    componentDidUpdate() {
        this.renderMap();
    }

    renderMap = () => {

    }

    render() {

        return (
            <div>

            </div>
        )
    }
}
