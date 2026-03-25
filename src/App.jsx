import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Activity, RefreshCw } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Default standard inputs
  const initialData = {
    V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0, V7: 0, V8: 0,
    V9: 0, V10: 0, V11: 0, V12: 0, V13: 0, V14: 0, V15: 0, V16: 0,
    V17: 0, V18: 0, V19: 0, V20: 0, V21: 0, V22: 0, V23: 0, V24: 0,
    V25: 0, V26: 0, V27: 0, V28: 0, Amount: 100
  };

  const [formData, setFormData] = useState(initialData);

  const simulateRandomTransaction = () => {
    // Generate a random scenario to test the model dynamically
    const randomRow = {};
    for (let i = 1; i <= 28; i++) {
      // Typically scaled variables are around mean 0, variance 1. Let's make it random
      randomRow[`V${i}`] = (Math.random() * 4 - 2).toFixed(4); // random between -2 and 2
    }
    // Amount could be between 0 and 1000
    randomRow['Amount'] = (Math.random() * 1000).toFixed(2);
    setFormData(randomRow);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Convert strings back to numbers for API
    const payload = {};
    Object.keys(formData).forEach(key => {
      payload[key] = parseFloat(formData[key]);
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/predict`, payload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the prediction API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
      
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Activity className="text-primary w-8 h-8" />
          Fraud Detection System
        </h1>
        <p className="text-slate-400 mt-2">Real-time ML-powered anomaly detection</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Simulator Card */}
        <div className="bg-surface rounded-xl p-6 shadow-xl border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Transaction Simulator</h2>
            <button 
              onClick={simulateRandomTransaction}
              className="text-sm flex items-center gap-2 text-primary hover:text-blue-400 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Randomize
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.keys(formData).map(key => (
              <div key={key} className="flex flex-col">
                <label className="text-[10px] text-slate-400 uppercase">{key}</label>
                <input 
                  type="number"
                  step="0.0001"
                  value={formData[key]}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                  className="bg-slate-900 border border-slate-700 rounded p-1 text-sm text-slate-200 focus:border-primary focus:outline-none w-full"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              loading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/20'
            }`}
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
            {loading ? "Analyzing..." : "Analyze Transaction"}
          </button>
        </div>

        {/* Results Card */}
        <div className="bg-surface rounded-xl p-6 shadow-xl border border-slate-700/50 flex flex-col">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Analysis Results</h2>

          {error && (
            <div className="bg-danger/20 text-danger border border-danger/30 rounded p-4 text-sm mb-4">
              {error}
            </div>
          )}

          {!result && !error && !loading && (
            <div className="flex-1 flex items-center justify-center flex-col text-slate-500">
              <ShieldCheck className="w-16 h-16 opacity-20 mb-4" />
              <p>Run analysis to see results</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className={`p-6 rounded-full border-4 mb-6 ${result.is_fraud ? 'border-danger bg-danger/10 text-danger' : 'border-success bg-success/10 text-success'}`}>
                {result.is_fraud ? <ShieldAlert className="w-16 h-16" /> : <ShieldCheck className="w-16 h-16" />}
              </div>
              
              <h3 className={`text-2xl font-bold ${result.is_fraud ? 'text-danger' : 'text-success'}`}>
                {result.is_fraud ? 'FRAUD DETECTED' : 'TRANSACTION APPROVED'}
              </h3>
              
              <p className="text-slate-400 mt-2 text-center max-w-xs">
                {result.is_fraud 
                  ? "Anomalous patterns found in this transaction data."
                  : "Normal patterns detected. Clear to process."}
              </p>

              <div className="w-full mt-8 bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Reconstruction Error</span>
                  <span className="text-slate-200 font-mono text-sm">{result.reconstruction_error.toFixed(4)}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden relative">
                   <div 
                     className={`h-2 rounded-full ${result.is_fraud ? 'bg-danger' : 'bg-success'}`} 
                     style={{ width: `${Math.min((result.reconstruction_error / (result.threshold * 2)) * 100, 100)}%` }}
                   ></div>
                   {/* Threshold marker */}
                   <div 
                     className="absolute top-0 bottom-0 w-1 bg-white" 
                     style={{ left: `${Math.min((result.threshold / (result.threshold * 2)) * 100, 100)}%` }}
                     title="Threshold"
                   ></div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">0</span>
                  <span className="text-slate-400">Threshold: {result.threshold}</span>
                  <span className="text-slate-500">{result.threshold * 2}+</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
