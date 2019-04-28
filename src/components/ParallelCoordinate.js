import React from 'react';
import housing_csv from "../data/housing_estates_hk.csv";

import '../styles/ParallelCoordinate.css';
import * as d3 from "d3";

class ParallelCoordinate extends React.Component {

    componentDidMount() {

        var margin = { top: 30, right: 10, bottom: 10, left: 10 },
            width = 1920 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        var x = d3.scalePoint().range([0, width], 1),
            y = {},
            dragging = {};

        var line = d3.line(),
            axis = d3.axisLeft(),
            background,
            foreground;

        var svg = d3.select("#parallel__container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let dimensions;

        d3.csv(housing_csv).then(function (cars) {

            console.log(cars)

            dimensions = d3.keys(cars[0]).filter(function (d) {
                return d != "name" && (y[d] = d3.scaleLinear()
                    .domain(d3.extent(cars, function (p) { return +p[d]; }))
                    .range([height, 0]));
            })

            // Extract the list of dimensions and create a scale for each.
            x.domain(dimensions);

            // Add grey background lines for context.
            background = svg.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(cars)
                .enter()
                .append("path")
                .attr("d", path);

            // Add blue foreground lines for focus.
            foreground = svg.append("g")
                .attr("class", "foreground")
                .selectAll("path")
                .data(cars)
                .enter().append("path")
                .attr("d", path);

            // Add a group element for each dimension.
            var g = svg.selectAll(".dimension")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "dimension")
                .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
                .call(d3.drag()
                    .subject(function (d) { return { x: x(d) }; })
                    .on("start", function (d) {
                        dragging[d] = x(d);
                        background.attr("visibility", "hidden");
                    })
                    .on("drag", function (d) {
                        dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                        foreground.attr("d", path);
                        dimensions.sort(function (a, b) { return position(a) - position(b); });
                        x.domain(dimensions);
                        g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
                    })
                    .on("end", function (d) {
                        delete dragging[d];
                        transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                        transition(foreground).attr("d", path);
                        background
                            .attr("d", path)
                            .transition()
                            .delay(500)
                            .duration(0)
                            .attr("visibility", null);
                    }));

            // Add an axis and title.
            g.append("g")
                .attr("class", "axis")
                .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function (d) { return d; });

            // Add and store a brush for each axis.
            g.append("g")
                .attr("class", "brush")
                .each(function (d) {
                    d3.select(this).call(y[d].brush = d3.brushY(y[d]).on("start", brushstart).on("brush", brush));
                })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);
        });

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function (p) { return [position(p), y[p](d[p])]; }));
        }

        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            // Need fix !y[p].brush.empty() to other function
            var actives = dimensions.filter(function (p) { return !y[p].brush.empty(); }),
                extents = actives.map(function (p) { return y[p].brush.extent(); });
            foreground.style("display", function (d) {
                return actives.every(function (p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
            });
        }
    }

    render() {
        return (
            <div id="parallel__container"></div>
        );
    }
}

export default ParallelCoordinate;