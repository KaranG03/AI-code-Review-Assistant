import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ComplexityGraph.css';

// Custom Tooltip Component (no changes needed)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`Input Size (N): ${label}`}</p>
        <p className="tooltip-intro">{`${payload[0].name}: ${Math.round(payload[0].value * 100) / 100}`}</p>
      </div>
    );
  }
  return null;
};

export default function ComplexityGraph({ data, dataKey, yAxisLabel, strokeColor, gradientId, gradientColor, name }) {
  return (
    <div className="graph-wrapper">
      <h4>{yAxisLabel}: {name}</h4>
      <ResponsiveContainer width="100%" height={300}>
        {/* ✅ FIX 1: Increased the left margin from 20 to 40 to create space */}
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 40, bottom: 20 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={gradientColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="Input Size (N)" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-body)' }} 
            label={{ value: "Input Size (N)", position: "insideBottom", dy: 20, fill: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-heading)' }}
            stroke="var(--border-color)"
          />
          <YAxis 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-body)' }}
            /* ✅ FIX 2: Adjusted dx from -15 to -20 to better center the label in the new margin */
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', dx: -20, fill: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-heading)' }}
            stroke="var(--border-color)"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary-color)', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Legend wrapperStyle={{ paddingTop: '30px' }}/>
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            name={name}
            stroke={strokeColor} 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: strokeColor }}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}