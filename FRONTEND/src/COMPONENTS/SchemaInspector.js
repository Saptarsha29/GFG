import React, { useState } from "react";

const SchemaInspector = ({ stats, onSelectColumn }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const columnsMeta = stats?.columns_meta || [];

  const filteredColumns = columnsMeta.filter((col) =>
    col.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Dataset Schema ({columnsMeta.length} Fields)
          </h4>
          <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            {stats?.dataset_name || "Amazon Sales"}
          </span>
        </div>

        <input
          type="text"
          placeholder="Filter columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
        />
      </div>

      {/* Column List */}
      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredColumns.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-4">
            No columns match "{searchTerm}"
          </div>
        ) : (
          filteredColumns.map((col) => (
            <div
              key={col.name}
              onClick={() => onSelectColumn && onSelectColumn(col.name)}
              title={`Click to query using '${col.name}'`}
              className="group p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    col.type === "numeric"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : col.name.includes("date") || col.name.includes("time")
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  }`}
                >
                  {col.type === "numeric"
                    ? "#"
                    : col.name.includes("date") || col.name.includes("time")
                    ? "📅"
                    : "Aa"}
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition truncate">
                    {col.name}
                  </p>
                  {col.sample && (
                    <p className="text-[10px] text-slate-500 truncate">
                      e.g., {col.sample}
                    </p>
                  )}
                </div>
              </div>

              <span className="opacity-0 group-hover:opacity-100 text-[10px] text-cyan-400 font-semibold transition">
                + Insert
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SchemaInspector;
