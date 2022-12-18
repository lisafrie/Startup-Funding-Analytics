import React from "react";
import { geoCentroid } from "d3-geo";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Annotation
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

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

const colorScale = scaleLinear()
    .domain([0, 10])
    .range(["#ffedea", "#BA2812"]);

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

    let minNum = 0;
    let maxNum = 0;

    // set tooltip
    const handleMouse = (cur) => {
        let text;
        if (
            dashboardResults.find(d => d.state === cur) &&
            dashboardResults.find(d => d.state === cur).name
        ) {
            if (kpi === "Count_of_Funded_Companies") {
                text = `Companies Funded: ${Math.round(dashboardResults.find(d => d.state === cur).count_companies)}`;
            } else if (kpi === "Total_Funding") {
                text = `Total Funding: ${Math.round(dashboardResults.find(d => d.state === cur).total_funding)}%`;
            } else {
                text = `Net Funding: $${rounded(dashboardResults.find(d => d.state === cur).net_funding)}`;
            }
        } else {
            text = "No data available";
        }
        tooltipContent =  text;
    };

    if (kpi === "Total_Funding") {
        for (let i = 0; i < dashboardResults.length; i++) {
            let num = dashboardResults[i].total_funding;
            if (num != null) {
                minNum = num < minNum ? num : minNum;
                maxNum = num > maxNum ? num : maxNum;
            }
        }
    } else if (kpi === "Net_Funding") {
        for (let i = 0; i < dashboardResults.length; i++) {
            let num = dashboardResults[i].net_funding;
            if (num != null) {
                minNum = num < minNum ? num : minNum;
                maxNum = num > maxNum ? num : maxNum;
            }
        }
    } else {
        for (let i = 0; i < dashboardResults.length; i++) {
            let num = dashboardResults[i].count_companies;
            if (num != null) {
                minNum = num < minNum ? num : minNum;
                maxNum = num > maxNum ? num : maxNum;
            }
        }
    }

    //returns value between 1-10 for heatmap coloring
    const findStateDecile = (cur) => {

        if (kpi === "Total_Funding") {

            let vals = dashboardResults.find(d => d.state === cur)
                ? dashboardResults.find(d => d.state === cur).total_funding
                : 0;

            //determine decile based on state's value vs min and max values
            if (vals) {
                return ((vals - minNum) / (maxNum - minNum)) * 10 + 1;
            } else {
                return 0;
            }
        } else if (kpi === "Net_Funding") {

            let vals = dashboardResults.find(d => d.state === cur)
                ? dashboardResults.find(d => d.state === cur).net_funding
                : 0;

            //determine decile based on state's value vs min and max values
            if (vals) {
                return ((vals - minNum) / (maxNum - minNum)) * 10 + 1;
            } else {
                return 0;
            }
        } else {

            let vals = dashboardResults.find(d => d.state === cur)
                ? dashboardResults.find(d => d.state === cur).count_companies
                : 0;

            //determine decile based on state's value vs min and max values
            if (vals) {
                return ((vals - minNum) / (maxNum - minNum)) * 10 + 1;
            } else {
                return 0;
            }
        }
    };



    return (
        
        <ComposableMap height={350} projection="geoAlbersUsa"
            projectionConfig={{
                scale: 800
        }}>
            <Geographies data-tip="React-tooltip" geography={geoUrl}>
                {({ geographies }) => (
                    <>
                        {geographies.map((geo) => {
                            const cur = allStates.find((s) => s.val === geo.id);
                            let decile = findStateDecile(cur.id);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    stroke="#FFF"
                                    geography={geo}
                                    fill={colorScale(decile)}
                                    onMouseEnter={() => {
                                        handleMouse(cur.id)
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
