import React from "react";

const prompts = [
  {
    icon: "💰",
    title: "Regional Sales",
    desc: "Show total revenue by region",
    badge: "0ms Fast BI",
    color: "from-[#FF9900]/15 to-amber-600/10 border-[#FF9900]/30 text-[#FF9900]"
  },
  {
    icon: "🏷️",
    title: "Top Product Categories",
    desc: "Top 5 product categories by sales",
    badge: "0ms Fast BI",
    color: "from-sky-500/10 to-blue-600/10 border-sky-500/30 text-sky-400"
  },
  {
    icon: "📈",
    title: "Monthly Sales Trajectory",
    desc: "Show monthly revenue trend",
    badge: "0ms Fast BI",
    color: "from-emerald-500/10 to-teal-600/10 border-emerald-500/30 text-emerald-400"
  },
  {
    icon: "💳",
    title: "Payment Share",
    desc: "Payment method distribution",
    badge: "0ms Fast BI",
    color: "from-purple-500/10 to-indigo-600/10 border-purple-500/30 text-purple-400"
  },
  {
    icon: "⭐",
    title: "Customer Ratings",
    desc: "Average rating by product category",
    badge: "0ms Fast BI",
    color: "from-amber-500/10 to-yellow-600/10 border-amber-500/30 text-amber-300"
  },
  {
    icon: "⚠️",
    title: "Out-of-Dataset Validation",
    desc: "What is the weather in London today?",
    badge: "Domain Guard",
    color: "from-rose-500/10 to-red-600/10 border-rose-500/30 text-rose-400"
  }
];

const ExamplePrompts = ({ onSelectPrompt }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto my-6">
      {prompts.map((p, i) => (
        <div
          key={i}
          onClick={() => onSelectPrompt && onSelectPrompt(p.desc)}
          className={`bg-gradient-to-br ${p.color} glass-card border p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between group bg-[#131921]/60`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{p.icon}</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#131921] border border-slate-700/80 text-slate-300">
                {p.badge}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-[#FF9900] transition">
              {p.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.desc}</p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end text-[11px] font-bold text-slate-400 group-hover:text-[#FF9900] transition">
            Run Analysis →
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExamplePrompts;


