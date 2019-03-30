import React, { Component } from 'react';
import * as d3 from "d3";
import _ from 'lodash';

import { faSearchPlus, faSearchMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { hk_map } from "../data/hk_map"
import '../styles/Map.css';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ZOOM_THRESHOLD = [0.3, 7];
const OVERLAY_MULTIPLIER = 10;
const OVERLAY_OFFSET = OVERLAY_MULTIPLIER / 2 - 0.5;
const ZOOM_DURATION = 500;
const ZOOM_IN_STEP = 2;
const ZOOM_OUT_STEP = 1 / ZOOM_IN_STEP;
const HOVER_COLOR = "#d36f80"

const color = d3.scaleOrdinal(d3.schemePastel1.slice(1, 4));

export default class Map extends Component {

    componentDidMount() {
        this.zoom = d3
            .zoom()
            .scaleExtent(ZOOM_THRESHOLD)
            .on("zoom", this.zoomHandler);

        // Prepare SVG container for placing the map,
        // and overlay a transparent rectangle for pan and zoom.
        this.svg = d3
            .select("#map__container")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

        this.g = this.svg.call(this.zoom).append("g");

        this.renderMap();
    }

    componentDidUpdate() {
        this.renderMap();
    }

    zoomHandler = () => {
        this.g.attr("transform", d3.event.transform);
    }

    mouseOverHandler(d, i) {
        d3.select(this).attr("fill", HOVER_COLOR)
    }

    mouseOutHandler(d, i) {
        // const color = d3.scaleOrdinal(d3.schemeCategory20c.slice(1, 4));
        d3.select(this).attr("fill", color(i))
    }

    clickHandler = (d, i) => {
        d3.select("#map__text").text(`You've selected ${d.properties.name} District`)
    }

    clickToZoom = (zoomStep) => {
        this.svg
            .transition()
            .duration(ZOOM_DURATION)
            .call(this.zoom.scaleBy, zoomStep);
    }


    renderMap = () => {
        this.g
            .append("rect")
            .attr("width", WIDTH * OVERLAY_MULTIPLIER)
            .attr("height", HEIGHT * OVERLAY_MULTIPLIER)
            .attr(
                "transform",
                `translate(-${WIDTH * OVERLAY_OFFSET},-${HEIGHT * OVERLAY_OFFSET})`
            )
            .style("fill", "none")
            .style("pointer-events", "all");

        // Project GeoJSON from 3D to 2D plane, and set
        // projection config.
        const projection = d3
            .geoMercator()
            .center([114.1095, 22.3964])
            .scale(80000)
            .translate([WIDTH / 2, HEIGHT / 2]);

        // Prepare SVG path and color, import the
        // effect from above projection.
        const path = d3.geoPath().projection(projection);
        // const color = d3.scaleOrdinal(d3.schemeCategory20c.slice(1, 4));

        const root = hk_map;

        // Draw districts and register event listeners
        this.g
            .append("g")
            .selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", (d, i) => color(i))
            .attr("stroke", "#FFF")
            .attr("stroke-width", 0.5)
            .on("mouseover", this.mouseOverHandler)
            .on("mouseout", this.mouseOutHandler)
            .on("click", this.clickHandler);

        // Place name labels in the middle of a district
        // Introduce some offset (dy, dx) to adjust the position
        this.g
            .append("g")
            .selectAll("text")
            .data(root.features)
            .enter()
            .append("text")
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .attr("dx", d => _.get(d, "offset[0]", null))
            .attr("dy", d => _.get(d, "offset[1]", null))
            .text(d => d.properties.name);
    }


    render() {

        return (
            <div className="map__class">
                <h3 id="map__text">Select a district on the map ...</h3>
                <div id="btn-zoom">
                    <FontAwesomeIcon id="btn-zoom--in" icon={faSearchPlus} size="2x" onClick={() => this.clickToZoom(ZOOM_IN_STEP)} />
                    <FontAwesomeIcon id="btn-zoom--out" icon={faSearchMinus} size="2x" onClick={() => this.clickToZoom(ZOOM_OUT_STEP)} />
                        {/* <i id="btn-zoom--in" className="fa fa-search-plus fa-2x" aria-hidden="true"></i> */ }
                    {/* <i id="btn-zoom--out" className="fa fa-search-minus fa-2x" aria-hidden="true"></i> */}
                </div>
                <div id="map__container"></div>
                </div>
                )
            }
        
        }
