import React from 'react';
import { IconRotateCcw, IconHome } from '../components/Icons';

export default function ResultView({ state, isMobile, onRestartQuiz, dispatch }) {
  const skippedCount = state.skippedCount || 0;
  const wrongCount = state.currentBatch.length - state.correctCount - skippedCount;
  const penalty = wrongCount * 0.5;
  const maxScore = state.currentBatch.length * 2;
  const fmtNum = (n) => n % 1 === 0 ? n : n.toFixed(1);

  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden flex flex-col justify-center items-center px-6 touch-none bg-[#E6E8E8] dark:bg-[#E6E8E8]">
        <div className="w-full max-w-sm rounded-[30px] border border-white/50 dark:border-zinc-800/50 p-6 text-center bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl shadow-2xl">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">測驗結束</h2>
          <div className={`text-5xl font-black tracking-tight mb-4 ${state.score >= 60 ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-900 dark:text-zinc-50'}`}>
            {fmtNum(state.score)} 
            <span className="text-lg text-zinc-500 dark:text-zinc-400 font-semibold tracking-tight"> / {maxScore} 分</span>
          </div>
          <div className="rounded-3xl p-5 mb-6 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-sm space-y-3 text-left">
            <div className="flex justify-between text-sm font-semibold"><span className="text-zinc-500 dark:text-zinc-400">答對</span><span className="text-zinc-900 dark:text-zinc-50">{state.correctCount} 題（+{state.correctCount * 2} 分）</span></div>
            <div className="flex justify-between text-sm font-semibold"><span className="text-zinc-500 dark:text-zinc-400">答錯</span><span className="text-zinc-900 dark:text-zinc-50">{wrongCount} 題（-{fmtNum(penalty)} 分）</span></div>
            {skippedCount > 0 && (
              <div className="flex justify-between text-sm font-semibold"><span className="text-zinc-500 dark:text-zinc-400">略過</span><span className="text-zinc-500 dark:text-zinc-400">{skippedCount} 題（+0 分）</span></div>
            )}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium"><span>配分規則</span><span>每題 2 分，答錯倒扣 0.5 分</span></div>
          </div>
          <div className="space-y-3 w-full">
            <button onClick={onRestartQuiz} className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md text-sm">
              <IconRotateCcw size={18} /> 重新測試同項目
            </button>
            <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm text-sm">
              <IconHome size={18} /> 回到主選單
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl rounded-[30px] shadow-2xl p-8 border border-white/50 dark:border-zinc-800/50">
        <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">測驗結束</h2>
        <div className={`text-6xl font-black mb-6 ${state.score >= 60 ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-900 dark:text-zinc-50'}`}>{fmtNum(state.score)} <span className="text-2xl text-zinc-500 dark:text-zinc-400">/ {maxScore} 分</span></div>
        <div className="bg-white/80 dark:bg-zinc-900/80 rounded-3xl p-6 mb-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 text-left">
          <div className="flex justify-between text-base"><span className="text-zinc-500 dark:text-zinc-400 font-semibold">答對</span><span className="text-zinc-900 dark:text-zinc-50 font-bold">{state.correctCount} 題（+{state.correctCount * 2} 分）</span></div>
          <div className="flex justify-between text-base"><span className="text-zinc-500 dark:text-zinc-400 font-semibold">答錯</span><span className="text-zinc-900 dark:text-zinc-50 font-bold">{wrongCount} 題（-{fmtNum(penalty)} 分）</span></div>
          {skippedCount > 0 && (
            <div className="flex justify-between text-base"><span className="text-zinc-500 dark:text-zinc-400 font-semibold">略過</span><span className="text-zinc-500 dark:text-zinc-400 font-bold">{skippedCount} 題（+0 分）</span></div>
          )}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between text-sm text-zinc-500 dark:text-zinc-400 font-medium"><span>配分規則</span><span>每題 2 分，答錯倒扣 0.5 分</span></div>
        </div>
        <div className="flex gap-4 mt-4">
          <button onClick={onRestartQuiz} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"><IconRotateCcw size={20} /> 重新測試</button>
          <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="flex-1 flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-semibold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm"><IconHome size={20} /> 回到主選單</button>
        </div>
      </div>
    </div>
  );
}
