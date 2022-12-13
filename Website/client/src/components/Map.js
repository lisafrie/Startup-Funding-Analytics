import React from "react";
import { geoCentroid } from "d3-geo";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Annotation
} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { Tooltip as ReactTooltip } from 'react-tooltip';

import allStates from "../data/allstates.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const offsets = {
    VT: [50, -8],
    NH: [34, 2],
    MA: [30, -1],
    RI: [28, 2],
    CT: [35, 10],
    NJ: [34, 1],
    DE: [33, 0],
    MD: [47, 10],
    DC: [49, 21]
};

const colorScale = scaleQuantize()
    .domain([1, 10])
    .range([
        "#ffedea",
        "#ffcec5",
        "#ffad9f",
        "#ff8a75",
        "#ff5533",
        "#e2492d",
        "#be3d26",
        "#9a311f",
        "#782618",
    ]);

const rounded = (num) => {
    if (num > 1000000000) {
        return Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
        return Math.round(num / 100000) / 10 + "M";
    } else {
        return Math.round(num / 100) / 10 + "K";
    }
};


const Map = ({ dashboardResults, tooltipContent, kpi }) => {

    console.log("dashboardResults:");
    console.log(dashboardResults);

    let minNum = 0;
    let maxNum = 0;

    // set tooltip
    const handleMouseEnter = (cur) => {
        let text;
        if (
            dashboardResults[cur] &&
            dashboardResults[cur]
        ) {
            if (kpi === "Count_of_Funded_Companies") {
                text = `Companies Funded: ${Math.round(dashboardResults.find(d => d.cur === cur))}`;
            } else if (kpi === "Total_Funding") {
                text = `Total Funding: ${Math.round(dashboardResults.find(d => d.cur === cur))}%`;
            } else {
                text = `Net Funding: $${rounded(dashboardResults.find(d => d.cur === cur))}`;
            }
        } else {
            text = "No data available";
        }
        tooltipContent =  text;
    };

    for (let i = 0; i < dashboardResults.length; i++) {
        let num = dashboardResults[i].count_companies;
        if (num != null) {
            minNum = num < minNum ? num : minNum;
            maxNum = num > maxNum ? num : maxNum;
        }
    }

    //returns value between 1-10 for heatmap coloring
    const findStateDecile = (cur) => {

        let vals = dashboardResults.find(d => d.cur === cur)
            ? dashboardResults.find(d => d.cur === cur).count_companies
            : 0;

        //determine decile based on state's value vs min and max values
        if (vals) {
            return ((vals - minNum) / (maxNum - minNum)) * 10 + 1;
        } else {
            return 0;
        }
    };


    return (
        <ComposableMap projection="geoAlbersUsa"
            projectionConfig={{
                scale: 900
        }}>
            <Geographies data-tip="React-tooltip" geography={geoUrl}>
                {({ geographies }) => (
                    <>
                        {geographies.map((geo) => {
                            const cur = allStates.find((s) => s.val === geo.id);
                            let decile = findStateDecile(cur);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    stroke="#FFF"
                                    geography={geo}
                                    fill={colorScale(decile)}
                                    onMouseEnter={() => {
                                        handleMouseEnter(cur)
                                    }}
                                    onMouseLeave={() => {
                                        tooltipContent = null;
                                    }}
                                />
                            );
                        })}
                        {geographies.map(geo => {
                            const centroid = geoCentroid(geo);
                            const cur = allStates.find(s => s.val === geo.id);
                            return (
                                <g key={geo.rsmKey + "-name"}>
                                    {cur &&
                                        centroid[0] > -160 &&
                                        centroid[0] < -67 &&
                                        (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                            <Marker coordinates={centroid}>
                                                <text y="2" fontSize={8} textAnchor="middle">
                                                    {cur.id}
                                                </text>
                                            </Marker>
                                        ) : (
                                            <Annotation
                                                subject={centroid}
                                                dx={offsets[cur.id][0]}
                                                dy={offsets[cur.id][1]}
                                            >
                                                <text x={4} fontSize={7} alignmentBaseline="middle">
                                                    {cur.id}
                                                </text>
                                            </Annotation>
                                        ))}
                                </g>
                            );
                        })}
                    </>
                )}
            </Geographies>
        </ComposableMap>
    );
};

export default Map;
