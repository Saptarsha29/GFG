import React, { useState } from "react";
import Plot from "react-plotly.js";

const PALETTE = [
  "#FF9900", "#00A8E1", "#38bdf8", "#818cf8", "#c084fc",
  "#f472b6", "#34d399", "#fbbf24", "#f87171", "#a7f3d0"
];

const ChartRenderer = ({ chart }) => {
  const [activeType, setActiveType] = useState(chart?.chart_type || "bar");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  if (!chart || !chart.data || chart.data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 glass-card rounded-2xl border border-slate-800">
        No chart data available to render.
      </div>
    );
  }

  const names = chart.data.map((d) => d.name);
  const values = chart.data.map((d) => d.value);

  // Format trace based on active chart type
  const getTraces = () => {
    switch (activeType) {
      case "line":
        return [
          {
            x: names,
            y: values,
            type: "scatter",
            mode: "lines+markers",
            line: { shape: "spline", color: "#FF9900", width: 3 },
            marker: { size: 9, color: "#FF9900" },
            hovertemplate: "%{x}: <b>%{y:,.2f}</b><extra></extra>",
          },
        ];
      case "area":
        return [
          {
            x: names,
            y: values,
            type: "scatter",
            mode: "lines",
            fill: "tozeroy",
            line: { shape: "spline", color: "#00A8E1", width: 2.5 },
            fillcolor: "rgba(0, 168, 225, 0.25)",
            hovertemplate: "%{x}: <b>%{y:,.2f}</b><extra></extra>",
          },
        ];
      case "scatter":
        return [
          {
            x: names,
            y: values,
            type: "scatter",
            mode: "markers",
            marker: {
              size: 14,
              color: values.map((_, i) => PALETTE[i % PALETTE.length]),
              opacity: 0.9,
              line: { color: "rgba(255,255,255,0.4)", width: 1.5 },
            },
            hovertemplate: "%{x}: <b>%{y:,.2f}</b><extra></extra>",
          },
        ];
      case "pie":
      case "donut":
        return [
          {
            labels: names,
            values: values,
            type: "pie",
            hole: activeType === "donut" ? 0.55 : 0,
            marker: { colors: PALETTE.slice(0, names.length) },
            textinfo: "label+percent",
            hovertemplate: "%{label}: <b>%{value:,.2f}</b> (%{percent})<extra></extra>",
          },
        ];
      case "bar":
      default:
        return [
          {
            x: names,
            y: values,
            type: "bar",
            marker: {
              color: values.map((_, i) => PALETTE[i % PALETTE.length]),
              opacity: 0.95,
              line: { color: "rgba(255,255,255,0.15)", width: 1 },
            },
            hovertemplate: "%{x}: <b>%{y:,.2f}</b><extra></extra>",
          },
        ];
    }
  };

  const layout = {
    title: {
      text: chart.title || "Chart Analysis",
      font: { color: "#f3f4f6", size: 16, family: "Inter, system-ui, sans-serif" },
      x: 0.02,
    },
    autosize: true,
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: "#9ca3af", family: "Inter, system-ui, sans-serif" },
    margin: { l: 60, r: 30, t: 60, b: 80 },
    xaxis: {
      title: { text: chart.x_axis || "", font: { color: "#9ca3af", size: 12 } },
      gridcolor: "rgba(255, 255, 255, 0.05)",
      zerolinecolor: "rgba(255, 255, 255, 0.1)",
      tickfont: { color: "#cbd5e1" },
    },
    yaxis: {
      title: { text: chart.y_axis || "", font: { color: "#9ca3af", size: 12 } },
      gridcolor: "rgba(255, 255, 255, 0.05)",
      zerolinecolor: "rgba(255, 255, 255, 0.1)",
      tickfont: { color: "#cbd5e1" },
    },
    legend: { font: { color: "#cbd5e1" } },
  };

  const exportCSV = () => {
    let csv = `${chart.x_axis || "Category"},${chart.y_axis || "Value"}\n`;
    chart.data.forEach((row) => {
      csv += `"${row.name}",${row.value}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(chart.title || "chart_data").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.csv`;
    a.click();
  };

  const exportPNG = () => {
    const plotlyContainer = document.querySelector(".js-plotly-plot");
    if (window.Plotly && plotlyContainer) {
      window.Plotly.downloadImage(plotlyContainer, {
        format: "png",
        width: 1200,
        height: 700,
        filename: `${(chart.title || "amazon_bi_chart").replace(/[^a-z0-9]/gi, "_").toLowerCase()}`
      });
    } else {
      alert("PNG Export ready via chart modebar button!");
    }
  };

  return (
    <>
      <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl transition-all duration-300 relative">
        {/* Chart Header & Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900] animate-pulse"></span>
              {chart.title}
            </h3>
            {chart.description && (
              <p className="text-xs text-slate-400 mt-1 font-medium">{chart.description}</p>
            )}
          </div>

          {/* Dynamic Chart Actions for Designers */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Chart Type Toggle Pills */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {["bar", "line", "area", "donut", "scatter"].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    activeType === type
                      ? "bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Inspect Raw Data Button */}
            <button
              onClick={() => setShowRawData(!showRawData)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                showRawData
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {showRawData ? "📊 Chart" : "📑 Table"}
            </button>

            {/* Export Image PNG (for Designers) */}
            <button
              onClick={exportPNG}
              title="Download High-Res PNG Image for Pitch Decks & Presentations"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FF9900]/10 border border-[#FF9900]/30 hover:bg-[#FF9900]/20 text-[#FF9900] transition flex items-center gap-1 active:scale-95"
            >
              🖼️ PNG
            </button>

            {/* Export CSV */}
            <button
              onClick={exportCSV}
              title="Export CSV Data"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 transition active:scale-95"
            >
              📥 CSV
            </button>

            {/* Fullscreen Expand */}
            <button
              onClick={() => setIsFullscreen(true)}
              title="Expand Fullscreen"
              className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 transition active:scale-95"
            >
              ⛶
            </button>
          </div>
        </div>

        {/* View Mode: Plotly Chart vs Raw Data Table */}
        {showRawData ? (
          <div className="overflow-x-auto max-h-[380px] custom-scrollbar border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">{chart.x_axis || "Category"}</th>
                  <th className="px-4 py-3">{chart.y_axis || "Value"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {chart.data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2.5 font-bold text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-200">{row.name}</td>
                    <td className="px-4 py-2.5 font-bold text-[#FF9900]">
                      {typeof row.value === "number" ? row.value.toLocaleString() : row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-[380px]">
            <Plot
              data={getTraces()}
              layout={layout}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                toImageButtonOptions: {
                  format: 'png',
                  filename: 'amazon_bi_chart',
                  height: 700,
                  width: 1200,
                  scale: 2
                }
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
      </div>

      {/* Fullscreen Chart Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-6 flex flex-col justify-between animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                <span className="text-[#FF9900]">⚡</span> {chart.title}
              </h2>
              <p className="text-xs text-slate-400">{chart.description}</p>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition"
            >
              Close Fullscreen ✕
            </button>
          </div>

          <div className="flex-1 w-full my-4">
            <Plot
              data={getTraces()}
              layout={{
                ...layout,
                height: window.innerHeight - 180,
                autosize: true,
              }}
              config={{ responsive: true, displaylogo: false }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChartRenderer;

