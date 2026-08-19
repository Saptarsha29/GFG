import React, { useState, useEffect } from "react";
import axios from "axios";
import SchemaInspector from "./SchemaInspector";
import DatasetUploader from "./DatasetUploader";
import AmazonLogo from "./AmazonLogo";

const API_BASE = "http://127.0.0.1:8000/api";

const QueryHistory = ({
  onSelectQuery,
  refreshTrigger,
  stats,
  onDatasetUpdate,
  onSelectColumn,
  onNewSession,
  hasMessages,
}) => {
  const [history, setHistory] = useState(() => {
    try {
      const cached = localStorage.getItem("amazon_bi_history_v2");
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("history"); // 'history' | 'schema' | 'data'
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [sampleRows, setSampleRows] = useState([]);
  const [sampleLoading, setSampleLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/history`);
      if (res.data && Array.isArray(res.data.history)) {
        setHistory(res.data.history);
        localStorage.setItem("amazon_bi_history_v2", JSON.stringify(res.data.history));
      }
    } catch (err) {
      console.error("Failed to fetch query history:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSampleData = async () => {
    try {
      setSampleLoading(true);
      const res = await axios.get(`${API_BASE}/dataset/sample?limit=20`);
      if (res.data && res.data.rows) {
        setSampleRows(res.data.rows);
      }
    } catch (err) {
      console.error("Failed to fetch sample dataset:", err);
    } finally {
      setSampleLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  useEffect(() => {
    if (activeTab === "data" && sampleRows.length === 0) {
      fetchSampleData();
    }
  }, [activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem("amazon_bi_history_v2", JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage:", e);
    }
  }, [history]);

  const deleteItem = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE}/history/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Clear all query history?")) return;
    try {
      await axios.delete(`${API_BASE}/history`);
      setHistory([]);
      localStorage.removeItem("amazon_bi_history_v2");
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const handleResetDataset = async () => {
    if (!window.confirm("Reset active dataset to default Amazon Sales dataset?")) return;
    setIsResetting(true);
    try {
      const res = await axios.post(`${API_BASE}/dataset/reset`);
      if (onDatasetUpdate) {
        onDatasetUpdate(res.data.stats);
      }
      setSampleRows([]);
    } catch (err) {
      console.error("Failed to reset dataset:", err);
    } finally {
      setIsResetting(false);
    }
  };

  const filteredHistory = history.filter((h) =>
    (h.query || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* LEFT SIDEBAR - Executive Amazon BI Controls */}
      <aside className="w-80 bg-[#0d131d]/95 border-r border-slate-800 p-5 flex flex-col h-screen sticky top-0 z-20 backdrop-blur-2xl shadow-[10px_0_35px_rgba(0,0,0,0.4)] shrink-0">
        {/* Amazon Brand Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
          <AmazonLogo showSubtitle={true} />

          <button
            onClick={() => setIsUploaderOpen(true)}
            title="Upload custom dataset CSV"
            className="px-2.5 py-1.5 rounded-xl bg-[#FF9900]/10 hover:bg-[#FF9900]/20 border border-[#FF9900]/30 text-[#FF9900] text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 shrink-0"
          >
            <span>+ CSV</span>
          </button>
        </div>

        {/* Back to Home / New Session Button */}
        {hasMessages && (
          <button
            onClick={onNewSession}
            className="mb-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF9900]/20 to-amber-600/20 hover:from-[#FF9900]/30 hover:to-amber-600/30 border border-[#FF9900]/40 text-amber-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF9900]/10 active:scale-98"
          >
            <span>←</span>
            <span>New Analytics Session</span>
          </button>
        )}

        {/* Active Dataset Card */}
        <div className="mb-4 bg-gradient-to-br from-[#131921] to-[#1c2430] border border-slate-800 rounded-2xl p-3.5 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#FF9900] animate-pulse shrink-0"></span>
              <span className="text-xs font-extrabold text-slate-100 truncate">
                {stats?.dataset_name || "Amazon Sales.csv"}
              </span>
            </div>

            {stats?.dataset_name && stats.dataset_name !== "Amazon Sales.csv" && (
              <button
                onClick={handleResetDataset}
                disabled={isResetting}
                title="Reset to default Amazon Sales dataset"
                className="text-[10px] text-[#FF9900] hover:text-amber-300 underline font-semibold transition shrink-0"
              >
                {isResetting ? "Resetting..." : "Reset"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
            <span>📊 {stats?.total_rows ? stats.total_rows.toLocaleString() : "50,000"} Rows</span>
            <span>•</span>
            <span>📑 {stats?.columns ? stats.columns.length : "16"} Fields</span>
          </div>
        </div>

        {/* Navigation Tabs (History | Schema | Live Data) */}
        <div className="flex items-center bg-[#131921] p-1 rounded-xl border border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "history"
                ? "bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📜 History ({history.length})
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "schema"
                ? "bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📊 Schema
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "data"
                ? "bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📑 Live Data
          </button>
        </div>

        {/* Tab 1: History Vault */}
        {activeTab === "history" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search & Clear */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filter saved queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#131921] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#FF9900]/60 transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1.5 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {history.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all query history"
                  className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Scrollable Query Items */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {loading && history.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-8">
                  Loading persistent history...
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl bg-[#131921]/60 border border-slate-800 text-slate-400 text-xs space-y-2">
                  <div className="text-2xl">⚡</div>
                  <p className="font-semibold text-slate-200">
                    {searchTerm ? "No matching queries" : "No query history saved"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Ask your dataset any question and it will automatically save here!
                  </p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id || item.timestamp}
                    onClick={() => onSelectQuery && onSelectQuery(item.query, item.response)}
                    className="group relative p-3 rounded-2xl bg-[#131921]/80 hover:bg-[#1c2430] border border-slate-800/80 hover:border-[#FF9900]/40 cursor-pointer transition-all duration-200 shadow-sm"
                  >
                    <div className="pr-6">
                      <p className="text-xs text-slate-200 font-semibold leading-snug group-hover:text-[#FF9900] transition line-clamp-2">
                        {item.query}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.timestamp
                            ? new Date(item.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </span>
                        {item.response?.charts?.length > 0 && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/30">
                            Chart
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={(e) => deleteItem(e, item.id)}
                      title="Delete query"
                      className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-1 transition rounded-lg hover:bg-slate-800"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Schema Inspector */}
        {activeTab === "schema" && (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
            <SchemaInspector stats={stats} onSelectColumn={onSelectColumn} />
          </div>
        )}

        {/* Tab 3: Live Sample Data Inspector */}
        {activeTab === "data" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Rows ({sampleRows.length})
              </span>
              <button
                onClick={fetchSampleData}
                className="text-[10px] text-[#FF9900] font-bold hover:underline"
              >
                Refresh
              </button>
            </div>

            {sampleLoading ? (
              <div className="text-center text-xs text-slate-500 py-8">
                Fetching sample data...
              </div>
            ) : sampleRows.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-8">
                No dataset rows available.
              </div>
            ) : (
              <div className="flex-1 overflow-auto border border-slate-800 rounded-xl custom-scrollbar">
                <table className="w-full text-left text-[11px] text-slate-300">
                  <thead className="bg-[#131921] text-slate-400 font-bold sticky top-0 border-b border-slate-800">
                    <tr>
                      {Object.keys(sampleRows[0]).slice(0, 4).map((col) => (
                        <th key={col} className="px-2.5 py-1.5 truncate max-w-[80px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 bg-[#0d131d]">
                    {sampleRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        {Object.values(row).slice(0, 4).map((val, vIdx) => (
                          <td key={vIdx} className="px-2.5 py-1.5 truncate max-w-[80px]">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF9900]"></span>
            <span>Gemini BI Engine</span>
          </div>

          <button
            onClick={() => setIsUploaderOpen(true)}
            className="hover:text-[#FF9900] underline transition"
          >
            Upload Custom CSV
          </button>
        </div>
      </aside>

      {/* Dataset Upload Modal */}
      <DatasetUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadSuccess={(newStats) => {
          if (onDatasetUpdate) onDatasetUpdate(newStats);
        }}
      />
    </>
  );
};

export default QueryHistory;

