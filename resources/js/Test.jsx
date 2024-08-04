import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '2019',
    expenses: 4000,
    income: 2400,
    amt: 2400,
  },
  {
    name: '2020',
    expenses: 3000,
    income: 1398,
    amt: 2210,
  },
  {
    name: '2021',
    expenses: 2000,
    income: 4000,
    amt: 2290,
  },
  {
    name: '2022',
    expenses: 2780,
    income: 3908,
    amt: 2000,
  },
  {
    name: '2023',
    expenses: 1890,
    income: 4800,
    amt: 2181,
  } 
];

export default function Test(){
    return (
        <>
         <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#8884d8" />
          <Bar dataKey="expenses" fill="#82ca9d" />
        </BarChart>
        </ResponsiveContainer>
        </>
     
    );

}
