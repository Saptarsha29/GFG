// // // // // import React, { useState, useEffect } from "react";
// // // // // import axios from "axios";
// // // // // import { Download, Menu, TrendingUp, AlertCircle } from "lucide-react";

// // // // // import ChatInput from "../COMPONENTS/ChatInput";
// // // // // import ChartRenderer from "../COMPONENTS/ChartRenderer";
// // // // // import QueryHistory from "../COMPONENTS/QueryHistory";
// // // // // import ExamplePrompts from "../COMPONENTS/ExamplePrompts";

// // // // // const BACKEND_URL =
// // // // //   process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

// // // // // const API = `${BACKEND_URL}/api`;

// // // // // const Dashboard = () => {
// // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // //   const [currentResponse, setCurrentResponse] = useState(null);
// // // // //   const [history, setHistory] = useState([]);
// // // // //   const [showHistory, setShowHistory] = useState(false);
// // // // //   const [error, setError] = useState(null);

// // // // //   useEffect(() => {
// // // // //     fetchHistory();
// // // // //   }, []);

// // // // //   const fetchHistory = async () => {
// // // // //     try {
// // // // //       const response = await axios.get(`${API}/history?limit=50`);
// // // // //       setHistory(response.data.history || []);
// // // // //     } catch (err) {
// // // // //       console.error("Error fetching history:", err);
// // // // //     }
// // // // //   };

// // // // //   const handleSubmitQuery = async (userQuery) => {
// // // // //     setIsLoading(true);
// // // // //     setError(null);

// // // // //     try {
// // // // //       const response = await axios.post(`${API}/ask`, {
// // // // //         query: userQuery,
// // // // //       });

// // // // //       if (response.data.error) {
// // // // //         setError(response.data.error);
// // // // //       } else {
// // // // //         setCurrentResponse(response.data);
// // // // //       }

// // // // //       await fetchHistory();
// // // // //     } catch (err) {
// // // // //       console.error("Query error:", err);
// // // // //       setError("Failed to process query.");
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleSelectFromHistory = (item) => {
// // // // //     setCurrentResponse(item.response);
// // // // //     setShowHistory(false);
// // // // //   };

// // // // //   const handleDeleteQuery = async (queryId) => {
// // // // //     try {
// // // // //       await axios.delete(`${API}/history/${queryId}`);
// // // // //       fetchHistory();
// // // // //     } catch (err) {
// // // // //       console.error("Delete error:", err);
// // // // //     }
// // // // //   };

// // // // //   const handleClearHistory = async () => {
// // // // //     if (!window.confirm("Clear all history?")) return;

// // // // //     try {
// // // // //       await axios.delete(`${API}/history`);
// // // // //       setHistory([]);
// // // // //       setCurrentResponse(null);
// // // // //     } catch (err) {
// // // // //       console.error("Clear error:", err);
// // // // //     }
// // // // //   };

// // // // //   const handleExportChart = () => {
// // // // //     if (!currentResponse) return;

// // // // //     const dataStr = JSON.stringify(currentResponse, null, 2);
// // // // //     const blob = new Blob([dataStr], { type: "application/json" });

// // // // //     const url = URL.createObjectURL(blob);
// // // // //     const link = document.createElement("a");

// // // // //     link.href = url;
// // // // //     link.download = `chart-${Date.now()}.json`;
// // // // //     link.click();

// // // // //     URL.revokeObjectURL(url);
// // // // //   };

// // // // //   return (
// // // // //     <div className="flex h-screen">

// // // // //       {/* Sidebar */}
// // // // //       <div className={`${showHistory ? "block" : "hidden"} lg:block`}>
// // // // //         <QueryHistory
// // // // //           history={history}
// // // // //           onSelectQuery={handleSelectFromHistory}
// // // // //           onDeleteQuery={handleDeleteQuery}
// // // // //           onClearHistory={handleClearHistory}
// // // // //           onClose={() => setShowHistory(false)}
// // // // //         />
// // // // //       </div>

// // // // //       {/* Main */}
// // // // //       <div className="flex-1 flex flex-col">

// // // // //         {/* Header */}
// // // // //         <header className="border-b p-4 flex justify-between items-center">

// // // // //           <div className="flex items-center gap-3">
// // // // //             <button onClick={() => setShowHistory(!showHistory)}>
// // // // //               <Menu className="w-5 h-5" />
// // // // //             </button>

// // // // //             <TrendingUp className="w-6 h-6 text-blue-500" />

// // // // //             <h1 className="text-xl font-bold">
// // // // //               AI Business Intelligence Dashboard
// // // // //             </h1>
// // // // //           </div>

// // // // //           {currentResponse && (
// // // // //             <button
// // // // //               onClick={handleExportChart}
// // // // //               className="flex items-center gap-2 border px-3 py-1 rounded"
// // // // //             >
// // // // //               <Download className="w-4 h-4" />
// // // // //               Export
// // // // //             </button>
// // // // //           )}
// // // // //         </header>

// // // // //         {/* Content */}
// // // // //         <main className="flex-1 overflow-y-auto p-6">

// // // // //           {error && (
// // // // //             <div className="p-4 border border-red-500 text-red-500 flex gap-2">
// // // // //               <AlertCircle className="w-5 h-5" />
// // // // //               {error}
// // // // //             </div>
// // // // //           )}

// // // // //           {!currentResponse ? (
// // // // //             <div className="text-center mt-20">
// // // // //               <TrendingUp className="w-16 h-16 mx-auto mb-4 text-blue-500" />
// // // // //               <h2 className="text-2xl font-bold mb-2">
// // // // //                 Ask your data anything
// // // // //               </h2>

// // // // //               <ExamplePrompts onSelectPrompt={handleSubmitQuery} />
// // // // //             </div>
// // // // //           ) : (
// // // // //             <div className="space-y-6">

// // // // //               <div className="border p-4 rounded">
// // // // //                 <p className="text-sm text-gray-400">Query</p>
// // // // //                 <p className="text-lg">{currentResponse.query}</p>
// // // // //               </div>

// // // // //               {currentResponse.insights && (
// // // // //                 <div className="border p-4 rounded bg-blue-50">
// // // // //                   <p className="font-semibold mb-1">Insights</p>
// // // // //                   <p>{currentResponse.insights}</p>
// // // // //                 </div>
// // // // //               )}

// // // // //               {currentResponse.charts &&
// // // // //                 currentResponse.charts.map((chart, i) => (
// // // // //                   <ChartRenderer key={i} chart={chart} />
// // // // //                 ))}
// // // // //             </div>
// // // // //           )}
// // // // //         </main>

// // // // //         {/* Chat */}
// // // // //         <div className="p-4 border-t">
// // // // //           <ChatInput
// // // // //             onSubmit={handleSubmitQuery}
// // // // //             isLoading={isLoading}
// // // // //             placeholder="Ask something about the dataset..."
// // // // //           />
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Dashboard;

// // // import React, { useState, useEffect } from "react";
// // // import axios from "axios";
// // // import { Download, Menu, TrendingUp, AlertCircle, ArrowLeft, Zap } from "lucide-react";

// // // import ChatInput from "../COMPONENTS/ChatInput";
// // // import ChartRenderer from "../COMPONENTS/ChartRenderer"; // Tumhari file ka naam ChartRender.js ho sakta hai, check karlena
// // // import QueryHistory from "../COMPONENTS/QueryHistory";
// // // import ExamplePrompts from "../COMPONENTS/ExamplePrompts";

// // // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
// // // const API = `${BACKEND_URL}/api`;

// // // const Dashboard = () => {
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [currentResponse, setCurrentResponse] = useState(null);
// // //   const [history, setHistory] = useState([]);
// // //   const [showHistory, setShowHistory] = useState(true); // Default open
// // //   const [error, setError] = useState(null);

// // //   useEffect(() => {
// // //     fetchHistory();
// // //   }, []);

// // //   const fetchHistory = async () => {
// // //     try {
// // //       const response = await axios.get(`${API}/history?limit=50`);
// // //       setHistory(response.data.history || []);
// // //     } catch (err) {
// // //       console.error("Error fetching history:", err);
// // //     }
// // //   };

// // //   const triggerError = (msg) => {
// // //     setError(msg);
// // //     setTimeout(() => setError(null), 5000); // 5 sec baad error gayab
// // //   };

// // //   const handleSubmitQuery = async (userQuery) => {
// // //     setIsLoading(true);
// // //     setError(null);

// // //     try {
// // //       const response = await axios.post(`${API}/ask`, { query: userQuery });

// // //       if (response.data.error) {
// // //         triggerError(response.data.error);
// // //       } else if (!response.data.charts || response.data.charts[0].data.length === 0) {
// // //         triggerError("Oops! ❌ No relevant data found for this query");
// // //         setCurrentResponse(null);
// // //       } else {
// // //         setCurrentResponse(response.data);
// // //       }
// // //       await fetchHistory();
// // //     } catch (err) {
// // //       console.error("Query error:", err);
// // //       triggerError("⚠️ Server error!");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const handleSelectFromHistory = (item) => {
// // //     setCurrentResponse(item.response);
// // //     if (window.innerWidth < 1024) setShowHistory(false); // Mobile pe click karne par hide
// // //   };

// // //   const handleDeleteQuery = async (queryId) => {
// // //     try {
// // //       await axios.delete(`${API}/history/${queryId}`);
// // //       fetchHistory();
// // //     } catch (err) {
// // //       console.error("Delete error:", err);
// // //     }
// // //   };

// // //   const handleClearHistory = async () => {
// // //     if (!window.confirm("Clear all history?")) return;
// // //     try {
// // //       await axios.delete(`${API}/history`);
// // //       setHistory([]);
// // //       setCurrentResponse(null);
// // //     } catch (err) {
// // //       console.error("Clear error:", err);
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex h-screen bg-gray-950 text-white overflow-hidden relative">
      
// // //       {/* 🔴 RED GLOWING ERROR POPUP */}
// // //       {error && (
// // //         <div className="absolute top-6 right-6 z-50 bg-red-900/90 border border-red-500 text-red-100 px-6 py-4 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.8)] flex items-center gap-3 animate-bounce">
// // //           <AlertCircle className="w-6 h-6 text-red-400" />
// // //           <p className="font-semibold tracking-wide">{error}</p>
// // //         </div>
// // //       )}

// // //       {/* 🟢 SIDEBAR (History) WITH SMOOTH TOGGLE */}
// // //       <div className={`${showHistory ? "w-80 opacity-100" : "w-0 opacity-0"} transition-all duration-500 ease-in-out border-r border-gray-800 bg-gray-900 flex-shrink-0 z-20`}>
// // //         <div className="w-80 h-full">
// // //           <QueryHistory
// // //             history={history}
// // //             onSelectQuery={handleSelectFromHistory}
// // //             onDeleteQuery={handleDeleteQuery}
// // //             onClearHistory={handleClearHistory}
// // //             onClose={() => setShowHistory(false)}
// // //           />
// // //         </div>
// // //       </div>

// // //       {/* 🔵 MAIN CONTENT AREA */}
// // //       <div className="flex-1 flex flex-col h-full overflow-hidden">
        
// // //         {/* HEADER */}
// // //         <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md p-4 flex justify-between items-center shadow-md">
// // //           <div className="flex items-center gap-4">
            
// // //             {/* GLOWING HAMBURGER BUTTON */}
// // //             <button 
// // //               onClick={() => setShowHistory(!showHistory)}
// // //               className="p-2 rounded-lg text-gray-400 hover:text-[#00f0ff] hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300"
// // //             >
// // //               <Menu className="w-6 h-6" />
// // //             </button>

// // //             <TrendingUp className="w-8 h-8 text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
// // //             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#bd00ff]">
// // //               InsighTra
// // //             </h1>
// // //           </div>
// // //         </header>

// // //         {/* CONTENT */}
// // //         <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
// // //           {!currentResponse ? (
// // //             <div className="text-center mt-24 animate-fade-in">
// // //               <div className="inline-block p-6 rounded-full bg-blue-900/20 mb-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
// // //                 <TrendingUp className="w-20 h-20 text-[#00f0ff]" />
// // //               </div>
// // //               <h2 className="text-3xl font-extrabold mb-8 tracking-wide text-gray-100">
// // //                 Ask your data anything
// // //               </h2>
// // //               <ExamplePrompts onSelectPrompt={handleSubmitQuery} />
// // //             </div>
// // //           ) : (
// // //             <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
              
// // //               {/* BACK BUTTON & EXPORT ROW */}
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <button 
// // //                   onClick={() => setCurrentResponse(null)}
// // //                   className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300"
// // //                 >
// // //                   <ArrowLeft className="w-5 h-5" /> Back to Dashboard
// // //                 </button>

// // //                 <button
// // //                   onClick={() => { /* Tumhara Export logic yahan daal do */ }}
// // //                   className="flex items-center gap-2 bg-blue-600/20 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-300"
// // //                 >
// // //                   <Download className="w-4 h-4" /> Export JSON
// // //                 </button>
// // //               </div>

// // //               {/* USER QUERY BOX */}
// // //               <div className="border border-gray-800 bg-gray-900/50 p-5 rounded-xl shadow-inner">
// // //                 <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Generated Query</p>
// // //                 <p className="text-xl font-semibold text-gray-200">{currentResponse.query}</p>
// // //               </div>

// // //               {/* ⚡ MODERN ANIMATED INSIGHTS CARDS */}
// // //               {currentResponse.insights && (
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // //                   {currentResponse.insights.split('|').map((insight, i) => (
// // //                     <div key={i} className="group border border-gray-800 bg-gray-900 p-5 rounded-2xl hover:border-[#bd00ff]/50 hover:shadow-[0_0_20px_rgba(189,0,255,0.2)] transition-all duration-500 transform hover:-translate-y-1">
// // //                       <div className="flex items-start gap-4">
// // //                         <div className="p-3 bg-[#bd00ff]/10 text-[#bd00ff] rounded-xl group-hover:scale-110 transition-transform duration-300">
// // //                           <Zap className="w-6 h-6" />
// // //                         </div>
// // //                         <p className="text-gray-300 font-medium leading-relaxed">{insight.trim()}</p>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}

// // //               {/* CHARTS */}
// // //               {currentResponse.charts && currentResponse.charts.map((chart, i) => (
// // //                 <div key={i} className="h-[450px]">
// // //                   <ChartRenderer chart={chart} />
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </main>

// // //         {/* CHAT INPUT */}
// // //         <div className="p-6 bg-gray-950/80 backdrop-blur-xl border-t border-gray-800">
// // //           <ChatInput onSubmit={handleSubmitQuery} isLoading={isLoading} placeholder="Ask something about the dataset..." />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { Download, Menu, TrendingUp, AlertCircle, ArrowLeft, Zap } from "lucide-react";

// // import ChatInput from "../COMPONENTS/ChatInput";
// // import ChartRenderer from "../COMPONENTS/ChartRenderer"; 
// // import QueryHistory from "../COMPONENTS/QueryHistory";
// // import ExamplePrompts from "../COMPONENTS/ExamplePrompts";

// // const BACKEND_URL = "https://gfg-7f11.onrender.com";
// // const API = `${BACKEND_URL}/api`;

// // const Dashboard = () => {
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [currentResponse, setCurrentResponse] = useState(null);
// //   const [history, setHistory] = useState([]);
// //   const [showHistory, setShowHistory] = useState(true); 
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     fetchHistory();
// //   }, []);

// //   const fetchHistory = async () => {
// //     try {
// //       const response = await axios.get(`${API}/history?limit=50`);
// //       setHistory(response.data.history || []);
// //     } catch (err) {
// //       console.error("Error fetching history:", err);
// //     }
// //   };

// //   const triggerError = (msg) => {
// //     setError(msg);
// //     setTimeout(() => setError(null), 5000);
// //   };

// //   const handleSubmitQuery = async (userQuery) => {
// //     setIsLoading(true);
// //     setError(null);

// //     try {
// //       const response = await axios.post(`${API}/ask`, { query: userQuery });

// //       if (response.data.error) {
// //         triggerError(response.data.error);
// //       } else if (!response.data.charts || response.data.charts[0].data.length === 0) {
// //         triggerError("❌ Oops! Dataset mein is sawal ka koi data nahi mila.");
// //         setCurrentResponse(null);
// //       } else {
// //         setCurrentResponse(response.data);
// //       }
// //       await fetchHistory();
// //     } catch (err) {
// //       triggerError("⚠️ Server error! Backend theek se chal raha hai?");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleChartClick = (chartDataPoint) => {
// //     if(chartDataPoint && chartDataPoint.name) {
// //       const drillDownQuery = `Show breakdown for ${chartDataPoint.name}`;
// //       handleSubmitQuery(drillDownQuery);
// //     }
// //   };

// //   const handleDeleteQuery = async (queryId) => {
// //     try {
// //       await axios.delete(`${API}/history/${queryId}`);
// //       fetchHistory();
// //     } catch (err) {
// //       console.error("Delete error:", err);
// //     }
// //   };

// //   const handleClearHistory = async () => {
// //     if (!window.confirm("Clear all history?")) return;
// //     try {
// //       await axios.delete(`${API}/history`);
// //       setHistory([]);
// //       setCurrentResponse(null);
// //     } catch (err) {
// //       console.error("Clear error:", err);
// //     }
// //   };

// //   return (
// //     <div className="flex h-screen bg-gray-950 text-white overflow-hidden relative">
      
// //       {error && (
// //         <div className="absolute top-6 right-6 z-50 bg-red-900 border border-red-500 text-red-100 px-6 py-4 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.8)] flex items-center gap-3">
// //           <AlertCircle className="w-6 h-6 text-red-400" />
// //           <p className="font-semibold">{error}</p>
// //         </div>
// //       )}

// //       {/* 🔥 FIX 1: Sidebar ko w-0 aur border-none diya taaki invisible block na bane */}
// //       <div 
// //         className={`${showHistory ? "w-80 border-r border-gray-800 opacity-100" : "w-0 border-none opacity-0"} transition-all duration-300 ease-in-out bg-gray-900 z-30 overflow-hidden flex-shrink-0`}
// //       >
// //         <div className="w-80 h-full">
// //           <QueryHistory
// //             history={history}
// //             onSelectQuery={(item) => {
// //               setCurrentResponse(item.response);
// //               if(window.innerWidth < 1024) setShowHistory(false);
// //             }}
// //             onDeleteQuery={handleDeleteQuery}
// //             onClearHistory={handleClearHistory}
// //             onClose={() => setShowHistory(false)}
// //           />
// //         </div>
// //       </div>

// //       <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
// //         <header className="border-b border-gray-800 bg-gray-950 p-4 flex justify-between items-center shadow-md relative z-40">
// //           <div className="flex items-center gap-4">
            
// //             {/* 🔥 FIX 2: relative aur z-50 add kiya taaki button hamesha upar rahe */}
// //             <button 
// //               onClick={() => setShowHistory(!showHistory)}
// //               className="relative z-50 p-2 rounded-lg text-gray-400 hover:text-[#00f0ff] hover:bg-gray-800 transition-all duration-300 cursor-pointer"
// //             >
// //               <Menu className="w-6 h-6" />
// //             </button>

// //             <TrendingUp className="w-8 h-8 text-[#00f0ff]" />
// //             <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] hidden sm:block">
// //               InsighTra
// //             </h1>
// //           </div>
// //         </header>

// //         <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
// //           {!currentResponse ? (
// //             <div className="text-center mt-24">
// //               <TrendingUp className="w-20 h-20 mx-auto text-[#00f0ff] mb-6" />
// //               <h2 className="text-3xl font-extrabold mb-8 text-gray-100">Ask your data anything</h2>
// //               <ExamplePrompts onSelectPrompt={handleSubmitQuery} />
// //             </div>
// //           ) : (
// //             <div className="space-y-6 max-w-7xl mx-auto">
              
// //               <div className="flex justify-between items-center mb-2">
// //                 {/* 🔥 FIX 3: Back Button ko z-50 dekar shield ke upar laya */}
// //                 <button 
// //                   onClick={() => setCurrentResponse(null)}
// //                   className="relative z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
// //                 >
// //                   <ArrowLeft className="w-5 h-5" /> Back to Dashboard
// //                 </button>
// //               </div>

// //               <div className="border border-gray-800 bg-gray-900 p-5 rounded-xl relative z-10">
// //                 <p className="text-sm text-gray-500 uppercase">Query</p>
// //                 <p className="text-xl font-semibold text-gray-200">{currentResponse.query}</p>
// //               </div>

// //               {currentResponse.insights && (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
// //                   {currentResponse.insights.split('|').map((insight, i) => (
// //                     <div key={i} className="border border-gray-800 bg-gray-900 p-5 rounded-2xl hover:border-[#bd00ff]/50 transition-all">
// //                       <div className="flex items-start gap-4">
// //                         <Zap className="w-6 h-6 text-[#bd00ff]" />
// //                         <p className="text-gray-300 font-medium">{insight.trim()}</p>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}

// //               {currentResponse.charts && currentResponse.charts.map((chart, i) => (
// //                 <div key={i} className="h-[450px] relative z-10">
// //                   <ChartRenderer chart={chart} onBarClick={handleChartClick} />
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </main>

// //         <div className="p-6 border-t border-gray-800 bg-gray-950 relative z-40">
// //           <ChatInput onSubmit={handleSubmitQuery} isLoading={isLoading} placeholder="Ask something about the dataset..." />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, Menu, TrendingUp, AlertCircle, ArrowLeft, Zap } from "lucide-react";

import ChatInput from "../COMPONENTS/ChatInput";
import ChartRenderer from "../COMPONENTS/ChartRenderer"; 
import QueryHistory from "../COMPONENTS/QueryHistory";
import ExamplePrompts from "../COMPONENTS/ExamplePrompts";
// Automatically use Render URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://gfg-7ff1.onrender.com";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://gfg-7ff1.onrender.com";
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`API_BASE_URL/history?limit=50`);
      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const triggerError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const handleSubmitQuery = async (userQuery) => {
    setIsLoading(true);
    setError(null);

    try {
     const response = await axios.post(`${API_BASE_URL}/ask`, { query: userQuery });

      if (response.data.error) {
        triggerError(response.data.error);
      } else if (!response.data.charts || response.data.charts[0].data.length === 0) {
        triggerError("❌ Oops! Dataset not found.");
        setCurrentResponse(null);
      } else {
        setCurrentResponse(response.data);
      }
      await fetchHistory();
    } catch (err) {
      triggerError("⚠️ Server error!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChartClick = (chartDataPoint) => {
    if(chartDataPoint && chartDataPoint.name) {
      const drillDownQuery = `Show breakdown for ${chartDataPoint.name}`;
      handleSubmitQuery(drillDownQuery);
    }
  };

  const handleDeleteQuery = async (queryId) => {
    try {
      await axios.delete(`${API}/history/${queryId}`);
      fetchHistory();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Clear all history?")) return;
    try {
      await axios.delete(`${API}/history`);
      setHistory([]);
      setCurrentResponse(null);
    } catch (err) {
      console.error("Clear error:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden relative">
      
      {error && (
        <div className="absolute top-6 right-6 z-50 bg-red-900 border border-red-500 text-red-100 px-6 py-4 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.8)] flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* 🔥 FIX 1: Sidebar ko w-0 aur border-none diya taaki invisible block na bane */}
      <div 
        className={`${showHistory ? "w-80 border-r border-gray-800 opacity-100" : "w-0 border-none opacity-0"} transition-all duration-300 ease-in-out bg-gray-900 z-30 overflow-hidden flex-shrink-0`}
      >
        <div className="w-80 h-full">
          <QueryHistory
            history={history}
            onSelectQuery={(item) => {
              setCurrentResponse(item.response);
              if(window.innerWidth < 1024) setShowHistory(false);
            }}
            onDeleteQuery={handleDeleteQuery}
            onClearHistory={handleClearHistory}
            onClose={() => setShowHistory(false)}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        <header className="border-b border-gray-800 bg-gray-950 p-4 flex justify-between items-center shadow-md relative z-40">
          <div className="flex items-center gap-4">
            
            {/* 🔥 FIX 2: relative aur z-50 add kiya taaki button hamesha upar rahe */}
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="relative z-50 p-2 rounded-lg text-gray-400 hover:text-[#00f0ff] hover:bg-gray-800 transition-all duration-300 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <TrendingUp className="w-8 h-8 text-[#00f0ff]" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bd00ff] hidden sm:block">
              AI BI Dashboard
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {!currentResponse ? (
            <div className="text-center mt-24">
              <TrendingUp className="w-20 h-20 mx-auto text-[#00f0ff] mb-6" />
              <h2 className="text-3xl font-extrabold mb-8 text-gray-100">Ask your data anything</h2>
              <ExamplePrompts onSelectPrompt={handleSubmitQuery} />
            </div>
          ) : (
            <div className="space-y-6 max-w-7xl mx-auto">
              
              <div className="flex justify-between items-center mb-2">
                {/* 🔥 FIX 3: Back Button ko z-50 dekar shield ke upar laya */}
                <button 
                  onClick={() => setCurrentResponse(null)}
                  className="relative z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>
              </div>

              <div className="border border-gray-800 bg-gray-900 p-5 rounded-xl relative z-10">
                <p className="text-sm text-gray-500 uppercase">Query</p>
                <p className="text-xl font-semibold text-gray-200">{currentResponse.query}</p>
              </div>

              {currentResponse.insights && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                  {currentResponse.insights.split('|').map((insight, i) => (
                    <div key={i} className="border border-gray-800 bg-gray-900 p-5 rounded-2xl hover:border-[#bd00ff]/50 transition-all">
                      <div className="flex items-start gap-4">
                        <Zap className="w-6 h-6 text-[#bd00ff]" />
                        <p className="text-gray-300 font-medium">{insight.trim()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentResponse.charts && currentResponse.charts.map((chart, i) => (
                <div key={i} className="h-[450px] relative z-10">
                  <ChartRenderer chart={chart} onBarClick={handleChartClick} />
                </div>
              ))}
            </div>
          )}
        </main>

        <div className="p-6 border-t border-gray-800 bg-gray-950 relative z-40">
          <ChatInput onSubmit={handleSubmitQuery} isLoading={isLoading} placeholder="Ask something about the dataset..." />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

