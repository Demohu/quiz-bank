import React from 'react';
import { IconUploadCloud, IconAlertTriangle, IconCloud } from '../components/Icons';

export default function UploadView({ state, dispatch, fileInputRef, isMobile, onShowSyncModal, renderSyncModal }) {
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    import('../utils/questionParser.js').then(({ parseImportedData }) => {
      const promises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const { parsedQuestions, errors } = parseImportedData(file, ev.target.result);
            resolve({ parsedQuestions, errors });
          };
          reader.readAsText(file);
        });
      });
      Promise.all(promises).then(results => {
        let allParsedQuestions = [];
        let allErrors = [];
        results.forEach(res => {
          allParsedQuestions = allParsedQuestions.concat(res.parsedQuestions);
          allErrors = allErrors.concat(res.errors);
        });
        if (allParsedQuestions.length > 0) {
          dispatch({ type: 'LOAD_DATA', payload: { parsedQuestions: allParsedQuestions, errors: allErrors } });
        } else {
          alert(allErrors.join('\n') || "解析失敗，找不到符合格式的題目。");
        }
      });
    });
  };

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 overflow-hidden flex flex-col justify-center items-center px-6 touch-none bg-[#E6E8E8] dark:bg-[#E6E8E8]">
          <div className="w-full max-w-sm rounded-[30px] border border-white/50 dark:border-zinc-800/50 p-6 text-center bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl shadow-2xl">
            <div className="w-14 h-14 bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-zinc-200 dark:border-zinc-700">
              <IconUploadCloud size={28} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">載入題庫</h1>
            <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-1 mb-3">v4.9.10</span>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-xs leading-relaxed font-medium">請上傳您的 Anki 匯出檔 (TXT 或 JSON)。系統會自動記錄進度與錯題。</p>
            <input type="file" accept=".json,.txt" multiple onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
            <button onClick={() => fileInputRef.current.click()} className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md text-sm mb-3">
              選擇 TXT 檔案
            </button>
            <button onClick={onShowSyncModal} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm text-sm mb-4">
              <IconCloud size={16}/> 從雲端同步載入
            </button>
            {Object.keys(state.stats).length > 0 && (
              <button onClick={() => { if (window.confirm("確定清除歷史對錯紀錄？")) { localStorage.clear(); window.location.reload(); } }} className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 hover:dark:text-zinc-50 font-semibold transition-all">
                清除歷史紀錄與快取
              </button>
            )}
            {state.errorLogs && state.errorLogs.length > 0 && (
              <div className="mt-5 text-left rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 shadow-inner">
                <div className="flex items-center gap-1.5 font-bold mb-2 text-zinc-900 dark:text-zinc-50 text-xs">
                  <IconAlertTriangle size={14}/> 
                  <span>解析警告 ({state.errorLogs.length} 行)</span>
                </div>
                <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1 max-h-24 overflow-y-auto ios-scrollbar">
                  {state.errorLogs.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
        {renderSyncModal()}
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-[30px] border border-white/50 dark:border-zinc-800/50 p-8 text-center bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl shadow-2xl relative">
          <div className="w-16 h-16 bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
            <IconUploadCloud size={32} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">載入題庫</h1>
          <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-1 mb-4">v4.9.10</span>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed font-medium">請上傳您的 Anki 匯出檔 (TXT 或 JSON)。系統會自動記錄進度與錯題。</p>
          <input type="file" accept=".json,.txt" multiple onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
          <button onClick={() => fileInputRef.current.click()} className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 shadow-md mb-4 transition-all">選擇 TXT 檔案</button>
          <button onClick={onShowSyncModal} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 shadow-sm mb-4 transition-all">
            <IconCloud size={18}/> 從雲端同步載入
          </button>
          {Object.keys(state.stats).length > 0 && <button onClick={() => { if (window.confirm("確定清除歷史對錯紀錄？")) { localStorage.clear(); window.location.reload(); } }} className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 hover:dark:text-zinc-50 font-medium transition-all">清除歷史紀錄與快取</button>}
          {state.errorLogs && state.errorLogs.length > 0 && (
            <div className="mt-6 text-left rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 shadow-inner">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-semibold mb-2"><IconAlertTriangle size={16}/> 解析警告 ({state.errorLogs.length} 行)</div>
              <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 max-h-32 overflow-y-auto">{state.errorLogs.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
      {renderSyncModal()}
    </>
  );
}
