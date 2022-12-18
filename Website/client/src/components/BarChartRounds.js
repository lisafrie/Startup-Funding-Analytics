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

const rounds = ["seed", "venture", "equity_crowdfunding", "undisclosed", "convertible_note", "debt_financing", "angel", "grant", "private_equity",
    "post_ipo_equity", "post_ipo_debt", "secondary_market", "product_crowdfunding"]

const BarChartRounds = ({queryResults, title}) => {

    const findData = (queryResults) => {

        let data = [];
        for (let i = 0; i < rounds.length; i++) {
            let value = 0;
            if (queryResults.filter(d => d.round_type === rounds[i]).length > 0) {
                let roundData = queryResults.filter(d => d.round_type === rounds[i]);
                value = roundData.reduce((acc, d) => acc + d.amount_USD, 0);
                    data.push({
                        round: rounds[i],
                        funding: value,
                    });
                }
            }
        return data;
    };



    return (

        <BarChart
            width={400}
            height={300}
            data={findData(queryResults)}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <text x={400 / 2 + 15} y={20} fill="black" textAnchor="middle" dominantBaseline="central">
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
                dataKey="funding"
                stroke="#8884d8"
                fill="#00008B"
            />
        </BarChart>
    );
};

export default BarChartRounds;