import React from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

const DataFormater = (number) => {
    if (number > 1000000000) {
        return (number / 1000000000).toString() + 'Bn';
    } else if (number > 1000000) {
        return (number / 1000000).toString() + 'M';
    } else if (number > 1000) {
        return (number / 1000).toString() + 'K';
    } else {
        return number.toString();
    }
}


const getNum = (payload) => {
    const num = payload[0].value;
    if (num > 1000000000) {
        return Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
        return Math.round(num / 100000) / 10 + "M";
    } else {
        return Math.round(num / 100) / 10 + "K";
    }
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${getNum(payload)}`}</p>
            </div>
        );
    }

    return null;
};

const LineCChart = ({queryResults, kpi, title}) => {

    const findData = (queryResults) => {

        let data = [];
        for (let i = 0; i < 15; i++) {
            const year = i + 2000;
            let value = 0;
            if (kpi === "total_funding") {
                let yearData = queryResults.filter(d => d.year === year);
                value = yearData.reduce((acc, d) => acc + d.total_funding, 0);
            } else if (kpi === "funded_count") {
                let yearData = queryResults.filter(d => d.year === year);
                value = yearData.reduce((acc, d) => acc + d.funded_count, 0);
            } else if (kpi === "founded_count") {
                let yearData = queryResults.filter(d => d.year === year);
                value = yearData.reduce((acc, d) => acc + d.founded_count, 0);
            }

                data.push({
                    year: year,
                    value: value,
                });

            }
            return data;
    };



    return (

        <LineChart
            width={450}
            height={275}
            data={findData(queryResults)}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <text x={500 / 2 + 15} y={20} fill="black" textAnchor="middle" dominantBaseline="central">
                <tspan fontSize="14">{title}</tspan>
            </text>
            <CartesianGrid strokeDasharray="0.5 4" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={DataFormater} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
        </LineChart>
    );
};

export default LineCChart;