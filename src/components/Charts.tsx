import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
  Legend,
  Tooltip
} from 'recharts';

export function RadarPlot({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Student" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function BarPlot({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Bar dataKey="score" radius={[4, 4, 4, 4]} barSize={25}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PiePlot({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
        <Pie
          data={data}
          cx={75}
          cy="50%"
          innerRadius={25}
          outerRadius={55}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: '10px', right: -10 }}
          iconSize={8}
        />
        <Tooltip wrapperStyle={{ fontSize: '10px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
