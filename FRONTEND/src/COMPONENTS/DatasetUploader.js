import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const DatasetUploader = ({ isOpen, onClose, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    setSuccessMsg("");
    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please select a valid .csv file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null);
    setSuccessMsg("");

    try {
      const res = await axios.post(`${API_BASE}/dataset/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg(res.data.message || "Dataset loaded successfully!");
      if (onUploadSuccess) {
        onUploadSuccess(res.data.stats);
      }
      setTimeout(() => {
        onClose();
        setFile(null);
        setSuccessMsg("");
      }, 1200);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.detail || "Failed to parse CSV file. Ensure valid columns."
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const sample = `Order_ID,Order_Date,Product_Category,Price,Quantity_Sold,Discount_Percent,Total_Revenue,Region,Customer_Rating
1001,2024-01-15,Electronics,299.99,2,10,539.98,North America,4.8
1002,2024-01-16,Clothing,49.50,5,15,210.37,Europe,4.2
1003,2024-01-17,Home & Kitchen,120.00,1,0,120.00,Asia,4.5
1004,2024-01-18,Electronics,899.00,1,5,854.05,North America,4.9
1005,2024-01-19,Books,15.00,4,20,48.00,South America,4.1`;

    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_bi_dataset.csv";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient background blur */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg font-bold">
              📂
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">
                Upload Custom Dataset
              </h3>
              <p className="text-xs text-slate-400">
                Import your own CSV data for AI analytics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
              : file
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-slate-800 hover:border-cyan-500/40 bg-slate-900/40"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-2xl">
              {file ? "📄" : "📤"}
            </div>

            {file ? (
              <div>
                <p className="text-sm font-bold text-emerald-400 break-all">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {(file.size / 1024).toFixed(1)} KB • CSV File
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Drag and drop your <span className="text-cyan-400">.csv</span> file here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  or click to browse from your computer
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <span>✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={downloadSampleCSV}
            type="button"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30"
          >
            Download Sample CSV
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                !file || uploading
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95"
              }`}
            >
              {uploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                "Load Dataset"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetUploader;
