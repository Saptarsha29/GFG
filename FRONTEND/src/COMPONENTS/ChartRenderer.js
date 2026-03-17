// // // import React from "react";
// // // import {
// // //   LineChart,
// // //   Line,
// // //   BarChart,
// // //   Bar,
// // //   PieChart,
// // //   Pie,
// // //   AreaChart,
// // //   Area,
// // //   XAxis,
// // //   YAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // //   ResponsiveContainer,
// // //   Cell,
// // // } from "recharts";

// // // const COLORS = [
// // //   "#00f0ff",
// // //   "#bd00ff",
// // //   "#00d4aa",
// // //   "#ffbd00",
// // //   "#ff3b30",
// // //   "#3b82f6",
// // // ];

// // // const CustomTooltip = ({ active, payload, label }) => {
// // //   if (active && payload && payload.length) {
// // //     return (
// // //       <div className="glass-effect border border-border backdrop-blur-md rounded-lg p-3 shadow-xl">
// // //         <p className="text-sm font-medium text-foreground">{label}</p>
// // //         <p className="text-sm text-primary font-semibold">
// // //           {payload[0].name}:{" "}
// // //           {typeof payload[0].value === "number"
// // //             ? payload[0].value.toLocaleString()
// // //             : payload[0].value}
// // //         </p>
// // //       </div>
// // //     );
// // //   }

// // //   return null;
// // // };

// // // const ChartRenderer = ({ chart }) => {
// // //   const { chart_type, title, data } = chart;

// // //   const renderChart = () => {
// // //     switch (chart_type) {
// // //       case "line":
// // //         return (
// // //           <ResponsiveContainer width="100%" height="100%">
// // //             <LineChart data={data}>
// // //               <CartesianGrid
// // //                 strokeDasharray="3 3"
// // //                 stroke="rgba(255,255,255,0.1)"
// // //               />
// // //               <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: 12 }} />
// // //               <YAxis stroke="#a1a1aa" style={{ fontSize: 12 }} />
// // //               <Tooltip content={<CustomTooltip />} />
// // //               <Line
// // //                 type="monotone"
// // //                 dataKey="value"
// // //                 stroke="#00f0ff"
// // //                 strokeWidth={2}
// // //                 dot={{ fill: "#00f0ff", r: 4 }}
// // //               />
// // //             </LineChart>
// // //           </ResponsiveContainer>
// // //         );

// // //       case "bar":
// // //         return (
// // //           <ResponsiveContainer width="100%" height="100%">
// // //             <BarChart data={data}>
// // //               <CartesianGrid
// // //                 strokeDasharray="3 3"
// // //                 stroke="rgba(255,255,255,0.1)"
// // //               />
// // //               <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: 12 }} />
// // //               <YAxis stroke="#a1a1aa" style={{ fontSize: 12 }} />
// // //               <Tooltip content={<CustomTooltip />} />
// // //               <Bar dataKey="value" fill="#00f0ff" radius={[8, 8, 0, 0]} />
// // //             </BarChart>
// // //           </ResponsiveContainer>
// // //         );

// // //       case "pie":
// // //         return (
// // //           <ResponsiveContainer width="100%" height="100%">
// // //             <PieChart>
// // //               <Pie
// // //                 data={data}
// // //                 dataKey="value"
// // //                 nameKey="name"
// // //                 cx="50%"
// // //                 cy="50%"
// // //                 outerRadius={120}
// // //                 label={({ name, percent }) =>
// // //                   `${name} (${(percent * 100).toFixed(0)}%)`
// // //                 }
// // //                 labelLine={{ stroke: "#a1a1aa" }}
// // //               >
// // //                 {data.map((entry, index) => (
// // //                   <Cell
// // //                     key={index}
// // //                     fill={COLORS[index % COLORS.length]}
// // //                   />
// // //                 ))}
// // //               </Pie>
// // //               <Tooltip content={<CustomTooltip />} />
// // //             </PieChart>
// // //           </ResponsiveContainer>
// // //         );

// // //       case "area":
// // //         return (
// // //           <ResponsiveContainer width="100%" height="100%">
// // //             <AreaChart data={data}>
// // //               <CartesianGrid
// // //                 strokeDasharray="3 3"
// // //                 stroke="rgba(255,255,255,0.1)"
// // //               />
// // //               <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: 12 }} />
// // //               <YAxis stroke="#a1a1aa" style={{ fontSize: 12 }} />
// // //               <Tooltip content={<CustomTooltip />} />
// // //               <Area
// // //                 type="monotone"
// // //                 dataKey="value"
// // //                 stroke="#00f0ff"
// // //                 fill="rgba(0,240,255,0.2)"
// // //               />
// // //             </AreaChart>
// // //           </ResponsiveContainer>
// // //         );

// // //       default:
// // //         return (
// // //           <div className="text-muted-foreground">
// // //             Unsupported chart type
// // //           </div>
// // //         );
// // //     }
// // //   };

// // //   return (
// // //     <div
// // //       data-testid="chart-container"
// // //       className="w-full h-full rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
// // //     >
// // //       <h3 className="text-xl font-semibold mb-4 text-foreground">
// // //         {title}
// // //       </h3>

// // //       <div className="w-full h-[350px]">{renderChart()}</div>

// // //       {chart.description && (
// // //         <p className="text-sm text-muted-foreground mt-4">
// // //           {chart.description}
// // //         </p>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ChartRenderer;
// import React, { useState } from "react";
// import {
//   LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
//   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
// } from "recharts";

// // 🌈 MODERN CYBERPUNK COLORS
// const COLORS = ["#00f0ff", "#bd00ff", "#ff007f", "#00ff66", "#ffbd00", "#3b82f6"];

// // ✨ MODERN DARK TOOLTIP (White Box Removed)
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
//         <p className="text-sm font-bold text-gray-300 mb-1">{label}</p>
//         <p className="text-lg font-black text-[#00f0ff] drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">
//           {payload[0].name}: {typeof payload[0].value === "number" ? payload[0].value.toLocaleString() : payload[0].value}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// const ChartRenderer = ({ chart }) => {
//   const { chart_type, title, data } = chart;
//   const [activeIndex, setActiveIndex] = useState(-1); // Hover effect state

//   const renderChart = () => {
//     switch (chart_type) {
//       case "bar":
//         return (
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
//               <XAxis dataKey="name" stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
//               <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
              
//               {/* Tooltip Cursor styling to remove ugly grey background */}
//               <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              
//               {/* HOVER FOCUS EFFECT & MULTI-COLOR */}
//               <Bar 
//                 dataKey="value" 
//                 radius={[8, 8, 0, 0]}
//                 onMouseEnter={(_, index) => setActiveIndex(index)}
//                 onMouseLeave={() => setActiveIndex(-1)}
//               >
//                 {data.map((entry, index) => (
//                   <Cell 
//                     key={`cell-${index}`} 
//                     fill={COLORS[index % COLORS.length]} 
//                     // Hover par zoom jaisa focus feel
//                     style={{ 
//                         opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.3,
//                         transition: 'opacity 0.3s ease',
//                         cursor: 'pointer'
//                     }} 
//                   />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         );

//       case "pie":
//         return (
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={130} innerRadius={70} paddingAngle={5}
//                 onMouseEnter={(_, index) => setActiveIndex(index)}
//                 onMouseLeave={() => setActiveIndex(-1)}
//               >
//                 {data.map((entry, index) => (
//                   <Cell 
//                     key={index} 
//                     fill={COLORS[index % COLORS.length]} 
//                     style={{ 
//                         opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.4,
//                         transition: 'opacity 0.3s ease',
//                         cursor: 'pointer',
//                         filter: activeIndex === index ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none'
//                     }}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip content={<CustomTooltip />} />
//             </PieChart>
//           </ResponsiveContainer>
//         );

//       case "line":
//         return (
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//               <XAxis dataKey="name" stroke="#a1a1aa" />
//               <YAxis stroke="#a1a1aa" />
//               <Tooltip content={<CustomTooltip />} />
//               <Line type="monotone" dataKey="value" stroke="#bd00ff" strokeWidth={4} dot={{ fill: "#00f0ff", r: 6, strokeWidth: 2 }} activeDot={{ r: 10, fill: "#fff" }} />
//             </LineChart>
//           </ResponsiveContainer>
//         );

//       case "area":
//         return (
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//               <XAxis dataKey="name" stroke="#a1a1aa" />
//               <YAxis stroke="#a1a1aa" />
//               <Tooltip content={<CustomTooltip />} />
//               <Area type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={3} fill="url(#colorUv)" />
//               <defs>
//                 <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.5}/>
//                   <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
//                 </linearGradient>
//               </defs>
//             </AreaChart>
//           </ResponsiveContainer>
//         );

//       default:
//         return <div className="text-gray-500">Unsupported chart type</div>;
//     }
//   };

//   return (
//     <div className="w-full h-full rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.1)] transition-all duration-500 flex flex-col">
//       <h3 className="text-2xl font-bold mb-6 text-white tracking-wide border-l-4 border-[#00f0ff] pl-3">
//         {title}
//       </h3>
//       <div className="flex-1 w-full min-h-[350px]">
//         {renderChart()}
//       </div>
//       {chart.description && (
//         <p className="text-sm text-gray-400 mt-6 italic bg-gray-950 p-3 rounded-lg border border-gray-800">
//           💡 {chart.description}
//         </p>
//       )}
//     </div>
//   );
// };

// export default ChartRenderer;

import React, { useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#00f0ff", "#bd00ff", "#ff007f", "#00ff66", "#ffbd00", "#3b82f6"];

// 🔥 FIX 1: 000000 hatane ke liye Number Formatter (M and K format)
const formatYAxis = (tickItem) => {
  if (tickItem >= 1000000) return (tickItem / 1000000).toFixed(2) + 'M';
  if (tickItem >= 1000) return (tickItem / 1000).toFixed(1) + 'K';
  return tickItem;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
        <p className="text-sm font-bold text-gray-300 mb-1">{label}</p>
        <p className="text-lg font-black text-[#00f0ff]">
          {payload[0].name}: {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const ChartRenderer = ({ chart, onBarClick }) => {
  const { chart_type, title, data } = chart;
  const [activeIndex, setActiveIndex] = useState(-1);

  // Force numeric values
  const formattedData = data.map(item => ({
    ...item,
    value: Number(item.value) || 0
  }));

  // 🔥 FIX 2: Height fix karne ke liye Auto-Scaling Logic (Zoom effect)
  const dataMin = Math.min(...formattedData.map(d => d.value));
  const dataMax = Math.max(...formattedData.map(d => d.value));
  const padding = (dataMax - dataMin) * 0.1; 
  // Agar data bada hai toh zoom in hoga, warna 0 se start hoga
  const yDomain = dataMin > 0 ? [Math.max(0, dataMin - padding), dataMax + padding] : ['auto', 'auto'];

  const renderChart = () => {
    switch (chart_type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" axisLine={false} tickLine={false} />
              <YAxis 
                stroke="#a1a1aa" 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={formatYAxis} // Added M/K format
                domain={yDomain} // Added zoom effect
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {formattedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    onClick={() => onBarClick && onBarClick(entry)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    style={{ 
                        opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.3,
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        cursor: 'pointer',
                        transform: activeIndex === index ? 'scaleY(1.02)' : 'scaleY(1)'
                    }} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={130} innerRadius={70} paddingAngle={5}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
                onClick={(entry) => onBarClick && onBarClick(entry)}
              >
                {formattedData.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={COLORS[index % COLORS.length]} 
                    style={{ 
                        opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.4,
                        transition: 'opacity 0.3s ease',
                        cursor: 'pointer',
                        filter: activeIndex === index ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" tickFormatter={formatYAxis} domain={yDomain} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#bd00ff" strokeWidth={4} dot={{ fill: "#00f0ff", r: 6 }} activeDot={{ r: 10, fill: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" tickFormatter={formatYAxis} domain={yDomain} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={3} fill="url(#colorUv)" />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-gray-500">Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full h-full rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.1)] transition-all duration-500 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white border-l-4 border-[#00f0ff] pl-3">
          {title}
        </h3>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Click graph to drill-down</span>
      </div>
      <div className="flex-1 w-full min-h-[350px]">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartRenderer;
