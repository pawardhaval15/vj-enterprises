"use client"; // Ensure it's a client component

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const WeeklyActivityChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid SSR rendering

  const data = [
    { day: "Sat", Deposit: 80, Withdraw: 40 },
    { day: "Sun", Deposit: 60, Withdraw: 20 },
    { day: "Mon", Deposit: 55, Withdraw: 45 },
    { day: "Tue", Deposit: 60, Withdraw: 65 },
    { day: "Wed", Deposit: 90, Withdraw: 70 },
    { day: "Thu", Deposit: 30, Withdraw: 45 },
    { day: "Fri", Deposit: 60, Withdraw: 65 }
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fill: "#4B5563" }} axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF" }} unit="%" width={30} />
          <Tooltip cursor={{ opacity: 0.2 }} />
          <Bar dataKey="Deposit" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={16} />
          <Bar dataKey="Withdraw" fill="#22D3EE" radius={[4, 4, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyActivityChart;
