import React from "react";

const AmazonLogo = ({ size = "md", showSubtitle = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Amazon Smile Icon Emblem */}
      <div className="relative group cursor-pointer">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#131921] via-[#232F3E] to-[#000000] border border-[#FF9900]/40 flex items-center justify-center shadow-lg shadow-[#FF9900]/15 group-hover:scale-105 transition-transform duration-300">
          <svg className="w-6 h-6 text-[#FF9900]" viewBox="0 0 100 100" fill="currentColor">
            {/* Amazon 'a' with Smile Arrow */}
            <path d="M50 15 C 30 15, 18 28, 18 45 C 18 62, 32 75, 52 75 C 65 75, 75 68, 80 58 L 80 72 L 92 72 L 92 18 L 80 18 L 80 28 C 74 19, 63 15, 50 15 Z M 54 27 C 67 27, 80 36, 80 50 C 80 64, 67 63, 54 63 C 41 63, 30 54, 30 45 C 30 36, 41 27, 54 27 Z" fill="#FFFFFF"/>
            {/* Iconic Amazon Smile Arrow */}
            <path d="M 12 75 Q 50 95 88 72 Q 82 78 72 82 Q 48 90 12 75 Z" fill="#FF9900"/>
            <path d="M 88 72 L 76 65 L 79 79 Z" fill="#FF9900"/>
          </svg>
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-[#FF9900]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>

      {/* Brand Text */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-white font-sans">
            amazon<span className="text-[#FF9900]">.</span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FF9900]/15 border border-[#FF9900]/40 text-[#FF9900] shadow-sm">
            BI COPILOT
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[11px] font-semibold text-slate-400 tracking-wide">
            Executive Analytics & AI Engine
          </p>
        )}
      </div>
    </div>
  );
};

export default AmazonLogo;
