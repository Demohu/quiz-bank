import React from 'react';
import { createPortal } from 'react-dom';
import { IconSettings, IconCloud, IconXCircle, IconUploadCloud, IconPlus, IconMinus } from './Icons';

export default function SettingsModal({ 
  show, 
  onClose, 
  state,
  dispatch,
  fileInputRef,
  handleFileUpload,
  onOpenSyncModal,
  autoSync,
  syncGistId
}) {
  if (!show) return null;

  const handleUpdateScoring = (key, value) => {
    dispatch({ 
      type: 'UPDATE_SCORING_RULES', 
      payload: { [key]: parseFloat(value) || 0 }
    });
  };

  const handleAdjustQuestions = (delta) => {
    const newVal = Math.min(80, Math.max(5, state.questionsPerQuiz + delta));
    dispatch({ type: 'SET_QUESTIONS_PER_QUIZ', payload: newVal });
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 pb-0 bg-black/40 backdrop-blur-sm modal-backdrop" onClick={onClose}>
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] modal-panel-mobile sm:modal-panel-desktop"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <IconSettings className="text-zinc-900 dark:text-white" size={24} />
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">設定</h2>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-transparent rounded-full active:scale-95">
            <IconXCircle size={24} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-6 overflow-y-auto ios-scrollbar">
          
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400">計分規則</h3>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">答對</span>
                <input type="number" className="w-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white" value={state.scoringRules?.correct ?? 1} onChange={e => handleUpdateScoring('correct', e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">答錯</span>
                <input type="number" className="w-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white" value={state.scoringRules?.wrong ?? 0} onChange={e => handleUpdateScoring('wrong', e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">略過</span>
                <input type="number" className="w-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white" value={state.scoringRules?.skipped ?? 0} onChange={e => handleUpdateScoring('skipped', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400">測驗設定</h3>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">每次測驗題數</span>
              <div className="flex items-center gap-3">
                <button onClick={() => handleAdjustQuestions(-5)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 shadow-sm border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-white active:scale-95 transition-transform"><IconMinus size={16} /></button>
                <span className="text-base font-bold text-zinc-900 dark:text-white w-6 text-center">{state.questionsPerQuiz}</span>
                <button onClick={() => handleAdjustQuestions(5)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 shadow-sm border border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-white active:scale-95 transition-transform"><IconPlus size={16} /></button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400">其他設定</h3>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex flex-col divide-y divide-zinc-200/50 dark:divide-zinc-700">
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">題目選項隨機</span>
                <button 
                  onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE_OPTIONS' })}
                  className={`w-12 h-6 rounded-full relative transition-colors ${state.shuffleOptions ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                >
                  <span className={`absolute top-1 bottom-1 w-4 rounded-full bg-white dark:bg-zinc-900 transition-all shadow-sm ${state.shuffleOptions ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <button onClick={() => { onClose(); onOpenSyncModal(); }} className="p-4 flex items-center justify-between text-left group">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">雲端同步</span>
                <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  <span className="text-xs font-bold">{syncGistId ? '已連結' : '未設定'}</span>
                  <IconCloud size={18} />
                </div>
              </button>
              <div className="p-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">上傳題庫 (JSON/TXT)</span>
                  <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    <IconUploadCloud size={18} />
                  </div>
                  <input type="file" ref={fileInputRef} multiple onChange={(e) => { handleFileUpload(e); onClose(); }} accept=".json,.txt" className="hidden" />
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  , document.body);
}
