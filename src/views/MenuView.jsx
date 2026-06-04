import React, { useState, useEffect } from 'react';
import { IconList, IconCheckCircle2, IconShuffle, IconAlertTriangle, IconUploadCloud, IconCloud, IconTrash2, IconMoreVertical, IconSettings } from '../components/Icons';
import SettingsModal from '../components/SettingsModal';
import { getSafeWeight } from '../utils/ankiAlgorithm';

export default function MenuView({ state, dispatch, isMobile, fileInputRef, handleFileUpload, setShowSyncModal, autoSync, syncGistId, renderSyncModal }) {
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [openMenuCat, setOpenMenuCat] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuCat(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const total = state.allQuestions.length;
  const doneTitles = new Set(Object.keys(state.stats).filter(k => {
    const s = state.stats[k];
    return s && (s.totalCorrect + s.totalWrong) > 0;
  }));
  const doneCount = state.allQuestions.filter(q => doneTitles.has(q.title)).length;
  const masteredCount = state.allQuestions.filter(q => {
    const s = state.stats[q.title];
    return s && getSafeWeight(s) <= 10;
  }).length;
  const undoneCount = total - doneCount;
  const donePercent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const masteredPercent = total > 0 ? Math.round((masteredCount / total) * 100) : 0;
  const wrongQuestions = state.allQuestions.filter(q => {
    const s = state.stats[q.title];
    return s && getSafeWeight(s) > 100 && s.totalWrong > s.totalCorrect;
  });

  const activeQuestions = state.allQuestions.filter(q => {
    if (selectedCats.size === 0) return true;
    const match = q.title.match(/^\[([A-Za-z]+\d{2})/);
    const cat = match ? match[1] : '其他';
    return selectedCats.has(cat);
  });

  const activeWrongQuestions = activeQuestions.filter(q => {
    const s = state.stats[q.title];
    return s && getSafeWeight(s) > 100 && s.totalWrong > s.totalCorrect;
  });

  const handleResetStats = () => {
    if (window.confirm("確定要將「所有題目的答題紀錄」歸零嗎？\n權重與連勝紀錄將被重置，但題庫不會被刪除。")) {
      dispatch({ type: 'RESET_STATS' });
    }
  };

  const handleRename = (e, rawCat, currentName) => {
    e.stopPropagation();
    const newName = window.prompt(`請輸入新的題庫名稱 (目前為: ${currentName})：\n(留空代表恢復預設)`, currentName);
    if (newName !== null) {
      dispatch({ type: 'RENAME_CATEGORY', payload: { originalName: rawCat, newName } });
    }
  };

  const categoryGroups = {};
  state.allQuestions.forEach(q => {
    const match = q.title.match(/^\[([A-Za-z]+\d{2})/);
    const cat = match ? match[1] : '其他';
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(q);
  });

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex flex-col overflow-y-auto pb-8 overscroll-contain bg-[#E6E8E8] dark:bg-[#E6E8E8]" style={{paddingTop: 'max(1.5rem, env(safe-area-inset-top))'}}>
        <div className="px-5 mb-5 flex justify-between items-center sticky top-0 z-10 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl border-b border-white/50 dark:border-zinc-800/50 py-4 shadow-sm">
          <div className="flex flex-col">
            <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">Pretest</h2>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-1">v4.9.11</span>
          </div>
          <div className="bg-white/80 dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            共 <span className="text-zinc-900 dark:text-zinc-50">{total}</span> 題
          </div>
        </div>

        <div className="px-4 space-y-6">
          <div className="p-5 rounded-[24px] shadow-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 dark:border-white">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">題庫進度</span>
              <span className="text-xl font-black">{donePercent}<span className="text-xs font-semibold opacity-70">%</span></span>
            </div>
            <div className="w-full h-3 bg-white/20 dark:bg-zinc-200 rounded-full overflow-hidden flex shadow-inner">
              <div className="h-full bg-white dark:bg-zinc-900 transition-all duration-500" style={{ width: `${masteredPercent}%` }} />
              <div className="h-full bg-zinc-400 dark:bg-zinc-400 transition-all duration-500" style={{ width: `${Math.max(0, donePercent - masteredPercent)}%` }} />
            </div>
            <div className="flex justify-between mt-4 text-[11px] font-semibold tracking-tight opacity-80">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-white dark:bg-zinc-900"></span>已精通 {masteredCount}</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-zinc-400"></span>做過 {doneCount}</span>
              </div>
              <span>未做 {undoneCount}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1"><IconList size={16}/> 題庫目錄</h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 bg-white shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg tracking-wider">每次隨機 {state.questionsPerQuiz} 題</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(categoryGroups).sort().map((cat, index, array) => {
                const qs = categoryGroups[cat];
                const catTotal = qs.length;
                const catDone = qs.filter(q => doneTitles.has(q.title)).length;
                const catMastered = qs.filter(q => {
                  const s = state.stats[q.title];
                  return s && getSafeWeight(s) <= 10;
                }).length;
                const catDonePercent = catTotal > 0 ? (catDone / catTotal) * 100 : 0;
                const catMasteredPercent = catTotal > 0 ? (catMastered / catTotal) * 100 : 0;
                const isLastAndOdd = index === array.length - 1 && array.length % 2 !== 0;
                const isCatSelected = selectedCats.has(cat);

                const catDisplayName = (state.categoryNames && state.categoryNames[cat]) || cat;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const newSelected = new Set(selectedCats);
                      if (newSelected.has(cat)) newSelected.delete(cat);
                      else newSelected.add(cat);
                      setSelectedCats(newSelected);
                    }}
                    className={`flex flex-col items-stretch justify-between p-3.5 rounded-[16px] border bg-white dark:bg-zinc-900 active:scale-95 transition-all duration-100 shadow-sm ${isLastAndOdd ? 'col-span-2' : ''} ${
                      isCatSelected
                        ? 'border-zinc-800 dark:border-zinc-300 bg-zinc-50 dark:bg-zinc-800 ring-2 ring-zinc-900 dark:ring-zinc-100'
                        : 'border-zinc-200/50 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0 pr-2">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate transition-colors" title={catDisplayName}>{catDisplayName}</span>
                      </div>
                      <div className="relative flex items-center justify-end">
                        {isCatSelected && <IconCheckCircle2 size={16} className="text-zinc-900 dark:text-zinc-100 mr-1" />}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenMenuCat(openMenuCat === cat ? null : cat); }}
                          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <IconMoreVertical size={16}/>
                        </button>
                        {openMenuCat === cat && (
                          <div className="absolute top-full right-0 mt-1 w-28 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50 overflow-hidden">
                            <button onClick={(e) => { handleRename(e, cat, catDisplayName); setOpenMenuCat(null); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">重新命名</button>
                            <button onClick={(e) => { e.stopPropagation(); if (window.confirm('確定要移除此題庫嗎？這將刪除該題庫的所有題目與紀錄。')) { dispatch({ type: 'DELETE_CATEGORIES', payload: [cat] }); } setOpenMenuCat(null); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">移除題庫</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex my-1.5">
                      <div className="h-full bg-zinc-900 dark:bg-zinc-50" style={{ width: `${catMasteredPercent}%` }} />
                      <div className="h-full bg-zinc-300 dark:bg-zinc-600" style={{ width: `${Math.max(0, catDonePercent - catMasteredPercent)}%` }} />
                    </div>
                    <div className="flex text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-tight mt-1">
                      <span className="whitespace-nowrap">{catDone} / {catTotal}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'weighted50', qs: activeQuestions } })} className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold py-4 rounded-[20px] shadow-md hover:scale-[1.02] active:scale-95 transition-all text-sm">
              <IconShuffle size={18} /> 加權隨機測驗
            </button>
            <button onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'random', qs: activeQuestions } })} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-bold py-4 rounded-[20px] hover:scale-[1.02] active:scale-95 transition-all shadow-sm text-sm">
              <IconShuffle size={18} /> 全庫隨機
            </button>
            <button
              onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'mistakes', qs: activeQuestions } })}
              disabled={activeWrongQuestions.length === 0}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-[20px] transition-all shadow-sm text-sm hover:scale-[1.02] active:scale-95 ${
                activeWrongQuestions.length > 0
                  ? "bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200"
                  : "bg-white/40 text-zinc-400 border border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-600 cursor-not-allowed"
              }`}
            >
              <IconAlertTriangle size={18} /> 錯題抽測
            </button>
            <button
              onClick={() => dispatch({ type: 'VIEW_MISTAKES' })}
              disabled={wrongQuestions.length === 0}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-[20px] transition-all shadow-sm text-sm hover:scale-[1.02] active:scale-95 ${
                wrongQuestions.length > 0
                  ? "bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200"
                  : "bg-white/40 text-zinc-400 border border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-600 cursor-not-allowed"
              }`}
            >
              <IconAlertTriangle size={18} /> 進入錯題本 ({wrongQuestions.length} 題)
            </button>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button onClick={() => setShowSettingsModal(true)} className="w-full bg-white/90 border border-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 font-bold py-4 rounded-[24px] hover:scale-[1.02] active:scale-95 transition-all shadow-sm text-sm flex items-center justify-center gap-2">
              <IconSettings size={18}/> 設定
              {autoSync && syncGistId && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
            </button>
            <button onClick={handleResetStats} className="w-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 hover:dark:text-zinc-50 font-bold py-3 flex items-center justify-center gap-1.5 text-xs transition-colors"><IconTrash2 size={14}/> 歸零所有紀錄</button>
          </div>
        </div>
        <SettingsModal 
          show={showSettingsModal} 
          onClose={() => setShowSettingsModal(false)}
          state={state}
          dispatch={dispatch}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          onOpenSyncModal={() => setShowSyncModal(true)}
          autoSync={autoSync}
          syncGistId={syncGistId}
        />
        {renderSyncModal()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-4xl w-full bg-white/40 border border-white/50 backdrop-blur-3xl rounded-[30px] shadow-2xl p-8 dark:bg-zinc-900/30 dark:border-zinc-800/50">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col text-left">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">Pretest</h2>
            <span className="text-[12px] text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-2">v4.9.11</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Total Questions</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{total}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="text-left bg-zinc-900 text-white rounded-[30px] p-8 shadow-xl dark:bg-white dark:text-zinc-950 dark:border-white">
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-sm font-semibold opacity-70 uppercase tracking-widest">題庫進度</span>
                <span className="text-4xl font-black">{donePercent}<span className="text-xl font-semibold opacity-70">%</span></span>
              </div>
              <div className="w-full h-4 bg-white/20 dark:bg-zinc-200 rounded-full overflow-hidden flex mb-6 shadow-inner">
                <div className="h-full bg-white dark:bg-zinc-900 transition-all duration-500" style={{ width: `${masteredPercent}%` }} />
                <div className="h-full bg-zinc-400 dark:bg-zinc-400 transition-all duration-500" style={{ width: `${Math.max(0, donePercent - masteredPercent)}%` }} />
              </div>
              <div className="flex justify-between text-sm font-bold opacity-80">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-white dark:bg-zinc-900"></span>已精通: {masteredCount}</span>
                  <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-zinc-400"></span>已做: {doneCount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'weighted50', qs: activeQuestions } })} className="col-span-2 flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold py-4 rounded-[20px] shadow-md hover:scale-[1.02] active:scale-95 transition-all text-base">
                <IconShuffle size={20} /> 加權隨機測驗
              </button>
              <button onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'random', qs: activeQuestions } })} className="flex items-center justify-center gap-2 bg-white/90 border border-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 font-bold py-4 rounded-[20px] hover:scale-[1.02] active:scale-95 transition-all shadow-sm text-sm">
                <IconShuffle size={18} /> 全庫隨機
              </button>
              <button
                onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'mistakes', qs: activeQuestions } })}
                disabled={activeWrongQuestions.length === 0}
                className={`flex items-center justify-center gap-2 font-bold py-4 rounded-[20px] transition-all shadow-sm text-sm hover:scale-[1.02] active:scale-95 ${
                  activeWrongQuestions.length > 0
                    ? "bg-white/90 border border-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100"
                    : "bg-white/40 text-zinc-400 border border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                }`}
              >
                <IconAlertTriangle size={18} /> 錯題抽測
              </button>
              <button
                onClick={() => dispatch({ type: 'VIEW_MISTAKES' })}
                disabled={wrongQuestions.length === 0}
                className={`col-span-2 flex items-center justify-center gap-2 font-bold py-4 rounded-[20px] transition-all shadow-sm text-sm hover:scale-[1.02] active:scale-95 ${
                  wrongQuestions.length > 0
                    ? "bg-white/90 border border-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100"
                    : "bg-white/40 text-zinc-400 border border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                }`}
              >
                <IconAlertTriangle size={18} /> 進入錯題本 ({wrongQuestions.length} 題)
              </button>
              <button onClick={() => setShowSettingsModal(true)} className="col-span-2 flex items-center justify-center gap-2 bg-white/90 border border-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 font-bold py-4 rounded-[20px] hover:scale-[1.02] active:scale-95 transition-all shadow-sm text-sm">
                <IconSettings size={18}/> 設定
                {autoSync && syncGistId && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
              </button>
            </div>
          </div>

          <div className="md:col-span-7 bg-white/90 border border-white shadow-sm rounded-[30px] p-8 text-left dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><IconList size={24}/> 題庫目錄</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(categoryGroups).sort().map(cat => {
                const qs = categoryGroups[cat];
                const catTotal = qs.length;
                const catDone = qs.filter(q => doneTitles.has(q.title)).length;
                const catMastered = qs.filter(q => {
                  const s = state.stats[q.title];
                  return s && getSafeWeight(s) <= 10;
                }).length;
                const catDonePercent = catTotal > 0 ? (catDone / catTotal) * 100 : 0;
                const catMasteredPercent = catTotal > 0 ? (catMastered / catTotal) * 100 : 0;
                const isCatSelected = selectedCats.has(cat);

                const catDisplayName = (state.categoryNames && state.categoryNames[cat]) || cat;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const newSelected = new Set(selectedCats);
                      if (newSelected.has(cat)) newSelected.delete(cat);
                      else newSelected.add(cat);
                      setSelectedCats(newSelected);
                    }}
                    className={`flex flex-col items-stretch justify-between p-4 rounded-[20px] border bg-white dark:bg-zinc-900 active:scale-95 transition-all duration-100 shadow-sm ${
                      isCatSelected
                        ? 'border-zinc-800 dark:border-zinc-300 bg-zinc-50 dark:bg-zinc-800 ring-2 ring-zinc-900 dark:ring-zinc-100'
                        : 'border-zinc-200/50 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate transition-colors" title={catDisplayName}>{catDisplayName}</span>
                      </div>
                      <div className="relative flex items-center justify-end">
                        {isCatSelected && <IconCheckCircle2 size={18} className="text-zinc-900 dark:text-zinc-100 mr-2" />}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenMenuCat(openMenuCat === cat ? null : cat); }}
                          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <IconMoreVertical size={18}/>
                        </button>
                        {openMenuCat === cat && (
                          <div className="absolute top-full right-0 mt-1 w-28 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50 overflow-hidden">
                            <button onClick={(e) => { handleRename(e, cat, catDisplayName); setOpenMenuCat(null); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">重新命名</button>
                            <button onClick={(e) => { e.stopPropagation(); if (window.confirm('確定要移除此題庫嗎？這將刪除該題庫的所有題目與紀錄。')) { dispatch({ type: 'DELETE_CATEGORIES', payload: [cat] }); } setOpenMenuCat(null); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">移除題庫</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex my-2">
                      <div className="h-full bg-zinc-900 dark:bg-zinc-50" style={{ width: `${catMasteredPercent}%` }} />
                      <div className="h-full bg-zinc-300 dark:bg-zinc-600" style={{ width: `${Math.max(0, catDonePercent - catMasteredPercent)}%` }} />
                    </div>
                    <div className="flex text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                      <span>{catDone} / {catTotal}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <SettingsModal 
        show={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
        state={state}
        dispatch={dispatch}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        onOpenSyncModal={() => setShowSyncModal(true)}
        autoSync={autoSync}
        syncGistId={syncGistId}
      />
      {renderSyncModal()}
    </div>
  );
}
