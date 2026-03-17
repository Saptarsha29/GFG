// // import React from "react";
// // import { Clock, Trash2, X } from "lucide-react";

// // const QueryHistory = ({
// //   history,
// //   onSelectQuery,
// //   onDeleteQuery,
// //   onClearHistory,
// //   onClose,
// // }) => {
// //   const formatTime = (timestamp) => {
// //     const date = new Date(timestamp);
// //     const now = new Date();

// //     const diff = now - date;
// //     const minutes = Math.floor(diff / 60000);
// //     const hours = Math.floor(diff / 3600000);
// //     const days = Math.floor(diff / 86400000);

// //     if (minutes < 1) return "Just now";
// //     if (minutes < 60) return `${minutes}m ago`;
// //     if (hours < 24) return `${hours}h ago`;
// //     if (days < 7) return `${days}d ago`;

// //     return date.toLocaleDateString();
// //   };

// //   return (
// //     <div className="w-80 border-r flex flex-col h-full bg-gray-900 text-white">
      
// //       <div className="p-6 border-b flex items-center justify-between">
// //         <div className="flex items-center gap-2">
// //           <Clock className="w-5 h-5" />
// //           <h2 className="text-lg font-semibold">History</h2>
// //         </div>

// //         <button onClick={onClose} className="lg:hidden">
// //           <X className="w-5 h-5" />
// //         </button>
// //       </div>

// //       <div className="flex-1 overflow-y-auto p-4 space-y-2">

// //         {history.length === 0 ? (
// //           <div className="text-center py-8 opacity-70">
// //             <Clock className="w-12 h-12 mx-auto mb-2" />
// //             <p>No queries yet</p>
// //           </div>
// //         ) : (
// //           history.map((item) => (
// //             <div
// //               key={item.id}
// //               className="p-3 rounded border hover:bg-gray-800 cursor-pointer"
// //               onClick={() => onSelectQuery(item)}
// //             >
// //               <div className="flex justify-between">
// //                 <p className="text-sm flex-1">{item.query}</p>

// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     onDeleteQuery(item.id);
// //                   }}
// //                 >
// //                   <Trash2 className="w-3 h-3 text-red-500" />
// //                 </button>
// //               </div>

// //               <p className="text-xs opacity-60 mt-1">
// //                 {formatTime(item.timestamp)}
// //               </p>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       {history.length > 0 && (
// //         <div className="p-4 border-t">
// //           <button
// //             onClick={onClearHistory}
// //             className="w-full py-2 text-red-500 border border-red-500 rounded"
// //           >
// //             Clear History
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default QueryHistory;

import React from "react";
import { Clock, Trash2, X } from "lucide-react";

const QueryHistory = ({ history, onSelectQuery, onDeleteQuery, onClearHistory, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white shadow-2xl">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <Clock className="w-5 h-5" />
          <h2 className="text-lg font-bold tracking-wide">History</h2>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400">No queries yet</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-gray-800 bg-gray-950 hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] cursor-pointer transition-all duration-300 group"
              onClick={() => onSelectQuery(item)}
            >
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm flex-1 font-medium text-gray-300 group-hover:text-white line-clamp-2">{item.query}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteQuery(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-red-400 hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="p-5 border-t border-gray-800 bg-gray-950">
          {/* 🔥 RED GLOWING EFFECT BUTTON */}
          <button
            onClick={onClearHistory}
            className="w-full py-3 text-red-500 font-bold border border-red-500/50 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] transition-all duration-300 transform hover:-translate-y-1"
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};

export default QueryHistory;

