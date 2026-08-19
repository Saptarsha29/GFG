import React, { useState } from "react";

const ChatInput = ({ onSend, loading }) => {
  const [query, setQuery] = useState("");

  const handleSend = () => {
    if (!query.trim() || loading) return;
    onSend(query.trim());
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 left-80 right-0 flex justify-center px-6 z-30 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-3xl glass-panel border border-[#FF9900]/30 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex items-center gap-3 bg-[#131921]/90">
        <div className="pl-3 text-[#FF9900]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Ask Amazon AI Copilot anything (e.g. 'Top categories by revenue', 'Monthly sales trend')..."
          className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-400 text-sm px-2 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          onClick={handleSend}
          disabled={!query.trim() || loading}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-200 ${
            !query.trim() || loading
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40"
              : "bg-gradient-to-r from-[#FF9900] to-amber-600 hover:from-amber-500 hover:to-[#FF9900] text-black font-extrabold shadow-lg shadow-[#FF9900]/20 active:scale-95"
          }`}
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin"></span>
              Analyzing...
            </>
          ) : (
            <>
              <span>Ask AI</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;


