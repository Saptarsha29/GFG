import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatInput from "../COMPONENTS/ChatInput";
import ExamplePrompts from "../COMPONENTS/ExamplePrompts";
import QueryHistory from "../COMPONENTS/QueryHistory";
import ChartRenderer from "../COMPONENTS/ChartRenderer";
import AmazonLogo from "../COMPONENTS/AmazonLogo";

const API_BASE = "http://127.0.0.1:8000/api";

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [historyTrigger, setHistoryTrigger] = useState(0);
  const chatBottomRef = useRef(null);

  // Fetch summary stats on mount
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dataset/stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dataset stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleQuery = async (queryText, cachedResponse = null) => {
    if (!queryText || loading) return;

    if (cachedResponse) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          query: queryText,
          response: cachedResponse,
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: tempId, query: queryText, loading: true, timestamp: new Date().toISOString() },
    ]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/ask`, { query: queryText });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, loading: false, response: res.data }
            : msg
        )
      );
      setHistoryTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Error executing query:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? {
                ...msg,
                loading: false,
                response: {
                  charts: [],
                  insights: "",
                  query: queryText,
                  error: "Failed to connect to AI Analytics backend server.",
                },
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetUpdate = (newStats) => {
    setStats(newStats);
    setMessages([]); // Clear active chat stream for new dataset
    setHistoryTrigger((prev) => prev + 1);
  };

  const handleSelectColumn = (colName) => {
    handleQuery(`Show summary metrics and breakdown for ${colName}`);
  };

  const handleBackToOverview = () => {
    setMessages([]);
  };

  return (
    <div className="flex bg-[#070b12] min-h-screen text-slate-100 font-sans selection:bg-[#FF9900]/30 selection:text-amber-200">
      {/* Query History & AI Control Sidebar (Amazon Executive Theme) */}
      <QueryHistory
        onSelectQuery={(q, resp) => handleQuery(q, resp)}
        refreshTrigger={historyTrigger}
        stats={stats}
        onDatasetUpdate={handleDatasetUpdate}
        onSelectColumn={handleSelectColumn}
        onNewSession={handleBackToOverview}
        hasMessages={messages.length > 0}
      />

      {/* Main Dashboard Area (Midnight Obsidian Executive Theme) */}
      <main className="flex-1 flex flex-col min-w-0 pb-28">
        {/* Top Header Bar with Amazon Logo */}
        <header className="sticky top-0 z-10 glass-panel bg-[#0d131d]/90 border-b border-slate-800 px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-4">
            {messages.length > 0 && (
              <button
                onClick={handleBackToOverview}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[#FF9900] hover:text-amber-300 text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>←</span>
                <span>Overview</span>
              </button>
            )}

            <AmazonLogo showSubtitle={false} />
          </div>

          {/* Dataset Executive KPI Badges & Controls */}
          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button
                onClick={handleBackToOverview}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF9900]/10 hover:bg-[#FF9900]/20 border border-[#FF9900]/30 text-[#FF9900] text-xs font-extrabold transition flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span>✨ New Query</span>
              </button>
            )}

            <div className="bg-[#131921] border border-slate-800 rounded-xl px-3.5 py-1.5 text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Active Dataset
              </span>
              <span className="text-xs font-extrabold text-[#FF9900] truncate max-w-[140px] block">
                {stats?.dataset_name || "Amazon Sales.csv"}
              </span>
            </div>

            <div className="bg-[#131921] border border-slate-800 rounded-xl px-3.5 py-1.5 text-right hidden sm:block">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Total Revenue</span>
              <span className="text-xs font-extrabold text-emerald-400">
                {stats?.total_revenue
                  ? `$${(stats.total_revenue / (stats.total_revenue > 1000000 ? 1000000 : 1)).toFixed(2)}${stats.total_revenue > 1000000 ? "M" : ""}`
                  : "$32.87M"}
              </span>
            </div>

            <div className="bg-[#131921] border border-slate-800 rounded-xl px-3.5 py-1.5 text-right hidden md:block">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Total Rows</span>
              <span className="text-xs font-extrabold text-[#00A8E1]">
                {stats?.total_rows ? stats.total_rows.toLocaleString() : "50,000"}
              </span>
            </div>
          </div>
        </header>

        {/* Conversation Stream Container */}
        <div className="flex-1 max-w-5xl w-full mx-auto px-6 pt-8 space-y-8">
          {messages.length === 0 ? (
            /* Welcome / Hero Banner */
            <div className="text-center py-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF9900]/10 border border-[#FF9900]/30 text-[#FF9900] text-xs font-bold mb-6 animate-pulse">
                ⚡ 0ms Fast Engine Active • Dataset: {stats?.dataset_name || "Amazon Sales"}
              </div>

              <h2 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight mb-4">
                Ask your data <span className="bg-gradient-to-r from-[#FF9900] via-amber-400 to-[#00A8E1] bg-clip-text text-transparent">anything</span>
              </h2>

              <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8 font-medium">
                Instant natural language analytics & visualization tailored for executive decision makers & business designers. Out-of-dataset queries are guarded automatically!
              </p>

              {/* Column Schema Quick Chips */}
              {stats?.columns && stats.columns.length > 0 && (
                <div className="max-w-3xl mx-auto mb-8 bg-[#131921]/60 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Available Dataset Fields to Query:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {stats.columns.slice(0, 10).map((col) => (
                      <button
                        key={col}
                        onClick={() => handleSelectColumn(col)}
                        className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-[#FF9900] transition active:scale-95"
                      >
                        {col}
                      </button>
                    ))}
                    {stats.columns.length > 10 && (
                      <span className="px-2.5 py-1 text-xs text-slate-500 font-semibold">
                        +{stats.columns.length - 10} more in sidebar
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Sample Prompts Grid */}
              <ExamplePrompts onSelectPrompt={(q) => handleQuery(q)} />
            </div>
          ) : (
            /* Chat Message Items */
            messages.map((msg) => (
              <div key={msg.id} className="space-y-4 animate-fadeIn">
                {/* User Query Bubble */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] border border-[#FF9900]/40 text-slate-100 font-semibold text-sm px-5 py-3 rounded-2xl rounded-tr-xs shadow-lg max-w-2xl">
                    {msg.query}
                  </div>
                </div>

                {/* AI Response Block */}
                {msg.loading ? (
                  <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center gap-4 bg-[#131921]/80">
                    <div className="w-9 h-9 rounded-xl bg-[#FF9900]/20 border border-[#FF9900]/40 flex items-center justify-center text-[#FF9900] font-bold text-lg animate-spin">
                      ⚡
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">
                        Analyzing {stats?.dataset_name || "Dataset"}...
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        Executing query parser, aggregating business metrics, and rendering interactive Plotly charts
                      </p>
                    </div>
                  </div>
                ) : msg.response?.error ? (
                  /* OUT OF DATASET / INVALID QUESTION ERROR CARD */
                  <div className="glass-card bg-rose-950/20 border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl"></div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-xl font-bold shrink-0">
                        ⚠️
                      </div>

                      <div className="space-y-3 flex-1">
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 mb-2">
                            Invalid Question / Out-of-Dataset
                          </div>
                          <h4 className="text-base font-bold text-slate-100">
                            {msg.response.error}
                          </h4>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                          <p className="font-semibold text-[#FF9900]">💡 Suggested Questions for Active Dataset:</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-400">
                            {stats?.columns?.slice(0, 3).map((col) => (
                              <li
                                key={col}
                                onClick={() => handleQuery(`Show breakdown by ${col}`)}
                                className="hover:text-[#FF9900] cursor-pointer underline decoration-[#FF9900]/30"
                              >
                                "Show breakdown by {col}"
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* VALID QUERY RESULT & INSIGHTS CARD */
                  <div className="space-y-6">
                    {/* Insights Callout Banner */}
                    {msg.response?.insights && (
                      <div className="glass-card bg-gradient-to-r from-[#131921] via-[#1c2430] to-[#131921] border-[#FF9900]/30 rounded-2xl p-5 shadow-lg flex items-start gap-3">
                        <span className="text-2xl shrink-0">💡</span>
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FF9900] mb-1">
                            Executive Business Insight
                          </h4>
                          <p className="text-sm text-slate-200 font-medium leading-relaxed">
                            {msg.response.insights}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Plotly Chart Card */}
                    {msg.response?.charts && msg.response.charts.length > 0 && (
                      <div className="space-y-6">
                        {msg.response.charts.map((chart, idx) => (
                          <ChartRenderer key={idx} chart={chart} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Fixed Glass Floating Input */}
        <ChatInput onSend={(q) => handleQuery(q)} loading={loading} />
      </main>
    </div>
  );
};

export default Dashboard;

