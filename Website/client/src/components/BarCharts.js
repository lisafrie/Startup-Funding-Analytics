import React from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Tooltip
} from "recharts";

const DataFormater = (number) => {
        return (number) + '%';
}

const rounds = ["seed", "venture", "equity_crowdfunding", "undisclosed", "convertible_note", "debt_financing", "angel", "grant", "private_equity",
    "post_ipo_equity", "post_ipo_debt", "secondary_market", "product_crowdfunding"]

const BarCChart = ({queryResults, title}) => {

    const findData = (queryResults) => {

        let data = [];
        for (let i = 0; i < rounds.length; i++) {
            let value = 0;
            if (queryResults.filter(d => d.round_type === rounds[i]).length > 0) {
                let roundData = queryResults.filter(d => d.round_type === rounds[i]);
                value = roundData.reduce((acc, d) => acc + d.percentage_international, 0);
                    data.push({
                        round: rounds[i],
                        percentage: value,
                    });
                }
            }
        return data;
    };



    return (

        <BarChart
            width={600}
            height={275}
            data={findData(queryResults)}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <text x={600 / 2 + 15} y={20} fill="black" textAnchor="middle" dominantBaseline="central">
                <tspan fontSize="14">{title}</tspan>
            </text>
            <CartesianGrid strokeDasharray="0.5 4" />
            <XAxis dataKey="round"
            style={{
                fontSize: '12'
            }}            />
            <YAxis tickFormatter={DataFormater} />
            <Legend />
            <Tooltip />
            <Bar
                style={{
                    fontSize: '12'
                }} 
                type="monotone"
                dataKey="percentage"
                stroke="#8884d8"
                fill="#00008B"
            />
        </BarChart>
    );
};

export default BarCChart;