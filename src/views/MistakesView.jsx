import React from 'react';
import { IconChevronLeft, IconShuffle, IconRotateCcw, IconCheckCircle2, IconAlertTriangle, IconTrash2, IconHome } from '../components/Icons';
import { getSafeWeight } from '../utils/ankiAlgorithm';

export default function MistakesView({ state, dispatch, isMobile, sortBy, setSortBy }) {
  const wrongQuestions = state.allQuestions.filter(q => {
    const s = state.stats[q.title];
    return s && getSafeWeight(s) > 100 && s.totalWrong > s.totalCorrect;
  });

  const sortedQuestions = [...wrongQuestions].sort((a, b) => {
    const statA = state.stats[a.title];
    const statB = state.stats[b.title];
    if (sortBy === 'weight') {
      return getSafeWeight(statB) - getSafeWeight(statA);
    } else {
      return (statB ? statB.totalWrong : 0) - (statA ? statA.totalWrong : 0);
    }
  });

  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden flex flex-col bg-[#E6E8E8] dark:bg-[#E6E8E8]">
        <div className="flex-shrink-0 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl border-b border-white/50 dark:border-zinc-800/50 touch-none" style={{paddingTop: 'max(0.5rem, env(safe-area-inset-top))'}}>
          <div className="flex justify-between items-center px-4 py-3">
            <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="flex items-center gap-1 active:opacity-60 transition-opacity duration-100">
              <IconChevronLeft size={24} className="text-zinc-900 dark:text-zinc-50" />
              <span className="text-[15px] text-zinc-900 dark:text-zinc-50 font-bold tracking-tight">主選單</span>
            </button>
            <div className="text-base font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              錯題本 ({wrongQuestions.length})
            </div>
            <div className="w-[60px]"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-8 ios-scrollbar px-4 pt-5 space-y-5 overscroll-contain">
          <div className="px-4 py-2.5 rounded-[18px] border border-white dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 font-bold ml-1">排序</span>
              <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                <button onClick={() => setSortBy('wrongCount')} className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${sortBy === 'wrongCount' ? 'bg-white text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  答錯次數
                </button>
                <button onClick={() => setSortBy('weight')} className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${sortBy === 'weight' ? 'bg-white text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  目前權重
                </button>
              </div>
            </div>
          </div>

          {sortedQuestions.length === 0 ? (
            <div className="rounded-[24px] p-8 border border-white dark:border-zinc-800/80 text-center font-bold text-zinc-900 dark:text-zinc-100 bg-white/90 dark:bg-zinc-900 shadow-sm text-sm" >
              🎉 太棒了！您目前沒有任何錯題紀錄。
            </div>
          ) : (
            sortedQuestions.map((q, qIdx) => {
              const s = state.stats[q.title] || { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0 };
              const w = getSafeWeight(s);
              return (
                <div key={qIdx} className="rounded-[24px] border border-white dark:border-zinc-800/80 p-5 flex flex-col gap-4 relative overflow-hidden bg-white/90 dark:bg-zinc-900 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">#{qIdx + 1}</span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                        錯 {s.totalWrong} / 對 {s.totalCorrect}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                        權重 {w.toFixed(0)}
                      </span>
                      {s.streak > 0 && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                          {s.streak} 連勝
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-relaxed text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap">{q.title}</h4>
                    {q.imageUrl && (
                      <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex justify-center bg-white max-w-sm p-1">
                        <img src={q.imageUrl} alt="題目圖片" className="max-w-full max-h-36 object-contain rounded-xl" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2.5 mt-1">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = q.answer.includes(opt.label);
                      return (
                        <div key={oIdx} className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs font-semibold ${isCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/50' : 'border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 opacity-60'}`}>
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isCorrect ? 'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'}`}>
                            {opt.label}
                          </span>
                          <span className="mt-1 whitespace-pre-wrap leading-relaxed">{opt.text}</span>
                          {isCorrect && <IconCheckCircle2 className="ml-auto flex-shrink-0 mt-0.5" size={16} />}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && q.explanation.trim() && (
                    <div className="mt-2 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left bg-[#E6E8E8] dark:bg-[#E6E8E8]">
                      <div className="text-[11px] font-black text-zinc-900 dark:text-zinc-50 mb-2 flex items-center gap-1">
                        <IconAlertTriangle size={14} />
                        <span>解答說明</span>
                      </div>
                      <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                        {q.explanation.trim()}
                      </p>
                    </div>
                  )}
                  <div className="mt-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                    <button onClick={() => { if (window.confirm(`確定要清除此題的答題紀錄嗎？\n清除後此題將移出錯題本並重置權重。`)) { dispatch({ type: 'RESET_QUESTION_STATS', payload: q.title }); } }} className="flex items-center gap-1.5 text-xs text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl font-bold transition-all active:scale-95">
                      <IconTrash2 size={14} /> 清除紀錄
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full flex justify-between items-center mb-6 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl rounded-[24px] p-4 px-5 border border-white/50 dark:border-zinc-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-white dark:border-zinc-700 shadow-sm hover:scale-105 active:scale-95 transition-all">
            <IconHome size={16} /> 主選單
          </button>
          <div className="text-lg font-black text-zinc-900 dark:text-zinc-50">
            錯題本 ({wrongQuestions.length})
          </div>
        </div>
        
        <div className="flex bg-white/60 dark:bg-zinc-800/60 rounded-xl p-1 gap-1 border border-white/50 dark:border-zinc-700/50 shadow-sm">
          <button onClick={() => setSortBy('wrongCount')} className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${sortBy === 'wrongCount' ? 'bg-white text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}>
            答錯次數
          </button>
          <button onClick={() => setSortBy('weight')} className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${sortBy === 'weight' ? 'bg-white text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}>
            目前權重
          </button>
        </div>
      </div>

      <div className="max-w-2xl w-full space-y-6">
        {sortedQuestions.length === 0 ? (
          <div className="bg-white/90 dark:bg-zinc-900/90 rounded-[30px] p-10 border border-white dark:border-zinc-800/80 text-center shadow-sm font-bold text-zinc-900 dark:text-zinc-100 text-lg">
            🎉 太棒了！您目前沒有任何錯題紀錄。
          </div>
        ) : (
          sortedQuestions.map((q, qIdx) => {
            const s = state.stats[q.title] || { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0 };
            const w = getSafeWeight(s);
            return (
              <div key={qIdx} className="bg-white/90 dark:bg-zinc-900/90 rounded-[30px] shadow-sm border border-white dark:border-zinc-800/80 p-8 flex flex-col gap-5 relative overflow-hidden">
                <div className="flex justify-between items-start gap-4">
                  <div className="text-sm font-black text-zinc-900 dark:text-zinc-100">#{qIdx + 1}</div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      答錯 {s.totalWrong} 次 / 答對 {s.totalCorrect} 次
                    </span>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      權重 {w.toFixed(0)}
                    </span>
                    {s.streak > 0 && (
                      <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                        {s.streak} 連勝
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-relaxed whitespace-pre-wrap">{q.title}</h4>
                  {q.imageUrl && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white p-2 flex justify-center max-w-lg">
                      <img src={q.imageUrl} alt="題目圖片" className="max-w-full max-h-48 object-contain rounded-xl" />
                    </div>
                  )}
                </div>
                <div className="space-y-3 mt-2">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = q.answer.includes(opt.label);
                    return (
                      <div key={oIdx} className={`p-4 rounded-2xl border flex items-start gap-3 text-sm font-bold ${isCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/50' : 'border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 opacity-60'}`}>
                        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${isCorrect ? 'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'}`}>
                          {opt.label}
                        </span>
                        <span className="mt-1 whitespace-pre-wrap leading-relaxed">{opt.text}</span>
                        {isCorrect && <IconCheckCircle2 className="ml-auto flex-shrink-0 mt-0.5" size={20} />}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && q.explanation.trim() && (
                  <div className="mt-4 p-5 bg-[#E6E8E8] dark:bg-[#E6E8E8] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left">
                    <div className="text-sm font-black text-zinc-900 dark:text-zinc-50 mb-2.5 flex items-center gap-1.5">
                      <IconAlertTriangle size={16} />
                      <span>解答說明</span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                      {q.explanation.trim()}
                    </p>
                  </div>
                )}
                <div className="mt-5 pt-5 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                  <button onClick={() => { if (window.confirm(`確定要清除此題的答題紀錄嗎？\n清除後此題將移出錯題本並重置權重。`)) { dispatch({ type: 'RESET_QUESTION_STATS', payload: q.title }); } }} className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 hover:scale-105">
                    <IconTrash2 size={16} /> 清除紀錄
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
