import React from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';


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

const CustomTooltip = ({ active, payload, index }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${payload[0].name} : ${getNum(payload)}`}</p>
            </div>
        );
    }

    return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${index} : ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const markets = [" Mobile ", " Biotechnology ", " Software ", " Finance ", " Health Care ", " Clean Technology ", " E-Commerce ", " Enterprise Software "]

const PieCChart = ({queryResults, kpi, title}) => {

    const findData = (queryResults) => {

        let data = [];
        let valueOther = 0;
        for (let i = 0; i < markets.length; i++) {
            if (queryResults.filter(d => d.market === markets[i])) {
                let marketData = queryResults.filter(d => d.market === markets[i]);
                let value = marketData.reduce((acc, d) => acc + d.total_funding, 0);
                data.push({
                    market: markets[i],
                    value: value,
                });
            } else {
                valueOther += queryResults.reduce((acc, d) => acc + d.total_funding, 0);
            }
            data.push({
                market: "Other",
                value: valueOther,
            })



            }
            return data;
    };



    return (

        <PieChart width={400} height={400}>
            <text x={500 / 2 + 15} y={20} fill="black" textAnchor="middle" dominantBaseline="central">
                <tspan fontSize="14">{title}</tspan>
            </text>
            <Pie data={findData(queryResults)} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={90} fill="#8884d8" label={renderCustomizedLabel} />
            <Tooltip content={<CustomTooltip />} />
        </PieChart>
        

    );
};

export default PieCChart;