import React, { useState } from 'react';
import { IconChevronLeft, IconUploadCloud, IconInfo, IconAlertTriangle, IconArrowRight, IconHome } from '../components/Icons';
import FormatTitle from '../components/FormatTitle';
import ProgressDots from '../components/ProgressDots';
import QuestionOption from '../components/QuestionOption';
import { getSafeWeight } from '../utils/ankiAlgorithm';

export default function QuizView({ state, dispatch, isMobile, quizFileInputRef, handleQuizFileUpload, handleReturnMenu, handleQuizUpdateClick }) {
  const [showStats, setShowStats] = useState(false);
  const [editingExp, setEditingExp] = useState(false);
  const [expText, setExpText] = useState("");

  const currentQ = state.currentBatch[state.currentIndex];
  const qStats = state.stats[currentQ?.title] || { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0 };
  const currentWeight = getSafeWeight(qStats);
  const currentStreak = qStats.streak || 0;

  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden flex flex-col bg-[#E6E8E8] dark:bg-[#E6E8E8]">
        <input type="file" ref={quizFileInputRef} multiple onChange={handleQuizFileUpload} accept=".json,.txt" className="hidden" />
        
        <div className="flex-shrink-0 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl border-b border-white/50 dark:border-zinc-800/50 touch-none shadow-sm flex flex-col gap-3" style={{paddingTop: 'max(0.5rem, env(safe-area-inset-top))', paddingBottom: '1rem'}}>
          <div className="flex justify-between items-center px-4 pt-2">
            <button onClick={handleReturnMenu} className="flex items-center gap-0.5 active:opacity-60 transition-opacity duration-100 -ml-2">
              <IconChevronLeft size={24} className="text-zinc-900 dark:text-zinc-50" />
              <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">返回</span>
            </button>
          </div>

          <ProgressDots 
            currentBatch={state.currentBatch} 
            currentIndex={state.currentIndex} 
            userAnswers={state.userAnswers} 
            onGotoQuestion={(idx) => dispatch({ type: 'GOTO_QUESTION', payload: idx })} 
            isMobile={true} 
          />
        </div>

        <div className="flex-shrink-0 mx-4 mt-5 mb-2 p-5 rounded-[24px] border border-white dark:border-zinc-800/80 overflow-y-auto bg-white/90 dark:bg-zinc-900 shadow-sm" style={{maxHeight: '38vh'}}>
          <div className="mb-3 flex justify-between items-center">
            {currentQ.answer.length > 1 ? (
              <span className="text-[10px] font-black tracking-wider rounded-lg px-2 py-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm">多選題</span>
            ) : (
              <span className="text-[10px] font-bold tracking-wider rounded-lg px-2 py-1 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">單選題</span>
            )}
            <div className="flex items-center gap-1.5">
              <div 
                className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 overflow-hidden transition-all duration-200 ease-in-out"
                style={{
                  maxWidth: showStats ? '320px' : '0px',
                  opacity: showStats ? 1 : 0,
                  transform: showStats ? 'translateX(0)' : 'translateX(8px)',
                  whiteSpace: 'nowrap',
                  marginRight: showStats ? '4px' : '0px'
                }}
              >
                <span className={currentWeight >= 400 ? 'text-zinc-900 dark:text-zinc-50 font-black' : ''}>權重: {currentWeight.toFixed(0)}</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>紀錄: <span className="text-zinc-900 dark:text-zinc-50">{qStats.totalCorrect}對</span> / <span className="text-zinc-900 dark:text-zinc-50">{qStats.totalWrong}錯</span></span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>連勝: <span className={currentStreak >= 3 ? 'text-zinc-900 dark:text-zinc-50 font-black' : ''}>{currentStreak}</span></span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
              </div>
              <button 
                onClick={() => setShowStats(!showStats)} 
                className={`text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 active:scale-95 transition-all p-1 rounded-lg flex items-center justify-center ${showStats ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300' : ''}`}
                title={showStats ? "隱藏資訊" : "顯示資訊"}
              >
                <IconInfo size={14} />
              </button>
            </div>
          </div>
          <h2 className="text-[16px] font-bold leading-relaxed whitespace-pre-wrap tracking-tight text-zinc-900 dark:text-zinc-50"><FormatTitle title={currentQ.title} /></h2>
          {currentQ.imageUrl && (
            <div className="mt-4 rounded-[16px] overflow-hidden border border-zinc-200 dark:border-zinc-800 flex justify-center bg-white p-1 max-w-sm mx-auto shadow-sm">
              <img src={currentQ.imageUrl} alt="題目圖片" className="max-w-full max-h-40 object-contain rounded-xl"
                onError={(e) => { e.target.style.display='none'; }} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3 overscroll-contain mt-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = state.selectedOption && state.selectedOption !== 'skipped' && state.selectedOption.includes(opt.label);
            const isCorrect = currentQ.answer.includes(opt.label);
            return (
              <QuestionOption
                key={idx}
                opt={opt}
                idx={idx}
                isSelected={isSelected}
                isCorrect={isCorrect}
                hasAnswered={state.hasAnswered}
                isMobile={true}
                onClick={() => {
                  const isMultiple = currentQ.answer.length > 1;
                  if (isMultiple) dispatch({ type: 'TOGGLE_OPTION', payload: opt.label });
                  else dispatch({ type: 'SELECT_AND_CONFIRM', payload: opt.label });
                }}
              />
            );
          })}

          {state.hasAnswered && state.selectedOption !== currentQ.answer && (
            <div className="rounded-[20px] p-5 mt-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-left shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconAlertTriangle size={16} className="text-zinc-700 dark:text-zinc-300" />
                  <span className="text-[14px] font-black text-zinc-900 dark:text-zinc-50">
                    {state.selectedOption === 'skipped' ? '題目解析' : '題目討論'}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    if (editingExp) {
                      dispatch({ type: 'UPDATE_QUESTION_EXPLANATION', payload: { title: currentQ.title, explanation: expText } });
                      setEditingExp(false);
                    } else {
                      setExpText(currentQ.explanation || "");
                      setEditingExp(true);
                    }
                  }}
                  className="text-xs font-bold px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 active:scale-95 transition-all"
                >
                  {editingExp ? '💾 儲存' : '📝 編輯'}
                </button>
              </div>
              <div className="text-[13px] font-bold tracking-tight mb-3 text-zinc-600 dark:text-zinc-400">
                您的答案：<span className="text-zinc-900 dark:text-zinc-100">{state.selectedOption === 'skipped' ? '已略過' : state.selectedOption.split('').join(', ')}</span>
                <span className="mx-2 opacity-30">|</span>
                正確答案：<span className="text-emerald-600 dark:text-emerald-400">{currentQ.answer.split('').join(', ')}</span>
              </div>
              <div className="border-t border-zinc-300 dark:border-zinc-600 my-3"></div>
              {editingExp ? (
                <textarea
                  value={expText}
                  onChange={(e) => setExpText(e.target.value)}
                  className="w-full min-h-[100px] p-3 text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  placeholder="在此輸入新的解析..."
                />
              ) : (
                (currentQ.explanation && currentQ.explanation.trim()) ? (
                  <p className="text-[13px] font-semibold leading-relaxed whitespace-pre-wrap tracking-tight text-zinc-700 dark:text-zinc-300">
                    {currentQ.explanation.trim()}
                  </p>
                ) : (
                  <p className="text-[13px] font-semibold text-zinc-400 dark:text-zinc-500 italic">尚無解析</p>
                )
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 z-50 relative flex items-center justify-between w-full bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl border-t border-white/50 dark:border-zinc-800/50 touch-none px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
             style={{
               paddingTop: '16px',
               paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
             }}>
          {state.hasAnswered ? (
            <>
              <div className={`flex items-center gap-2 font-black text-[15px] ${state.selectedOption === currentQ.answer ? 'text-emerald-600 dark:text-emerald-400' : state.selectedOption === 'skipped' ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                <span>{state.selectedOption === currentQ.answer ? '答對了 +2 分' : state.selectedOption === 'skipped' ? '已略過 (+0 分)' : `正解：${currentQ.answer.split('').join(', ')}`}</span>
              </div>
              <button onClick={() => { setEditingExp(false); dispatch({ type: 'NEXT_QUESTION' }); }}
                className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 active:scale-95 hover:scale-105 transition-all shadow-md font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2">
                <span>{state.currentIndex < state.currentBatch.length - 1 ? '下一題' : '查看結果'}</span>
                <IconArrowRight size={18} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => dispatch({ type: 'SKIP_QUESTION' })}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 active:scale-95 transition-all font-bold text-sm px-5 py-3 rounded-xl border border-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50">
                略過此題
              </button>
              <button onClick={() => dispatch({ type: 'CONFIRM_ANSWER' })} disabled={!state.selectedOption}
                className={`active:scale-95 hover:scale-105 transition-all font-bold text-sm px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-md ${
                  state.selectedOption 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' 
                    : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed shadow-none'
                }`}>
                <span>確認答案</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 flex flex-col items-center">
      <input type="file" ref={quizFileInputRef} multiple onChange={handleQuizFileUpload} accept=".json,.txt" className="hidden" />

      <div className="max-w-3xl w-full flex items-center justify-between mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button onClick={handleReturnMenu} className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-2 rounded-lg transition-all"><IconHome size={18} /> 主選單</button>
        </div>
        
        <div className="flex items-center pr-4">
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            得分: <span className="font-black text-[22px]">{state.score % 1 === 0 ? state.score : state.score.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl w-full bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl rounded-[30px] shadow-2xl border border-white/50 dark:border-zinc-800/50 overflow-hidden flex flex-col min-h-[500px]">
        <div className="pt-8 pb-4">
          <ProgressDots 
            currentBatch={state.currentBatch} 
            currentIndex={state.currentIndex} 
            userAnswers={state.userAnswers} 
            onGotoQuestion={(idx) => dispatch({ type: 'GOTO_QUESTION', payload: idx })} 
            isMobile={false} 
          />
        </div>

        <div className="px-8 pb-8 flex-1 flex flex-col relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              {currentQ.answer.length > 1 ? (
                <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-3 py-1.5 rounded-lg font-black text-xs shadow-sm">多選題</span>
              ) : (
                <span className="bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1.5 rounded-lg font-bold text-xs border border-zinc-200 dark:border-zinc-700 shadow-sm">單選題</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-3 overflow-hidden transition-all duration-200 ease-in-out"
                style={{
                  maxWidth: showStats ? '400px' : '0px',
                  opacity: showStats ? 1 : 0,
                  transform: showStats ? 'translateX(0)' : 'translateX(8px)',
                  whiteSpace: 'nowrap',
                  marginRight: showStats ? '8px' : '0px'
                }}
              >
                <span>權重: <span className={currentWeight >= 400 ? 'text-zinc-900 dark:text-zinc-50 font-black' : ''}>{currentWeight.toFixed(0)}</span></span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>紀錄: <span className="text-zinc-900 dark:text-zinc-50">{qStats.totalCorrect}對</span> / <span className="text-zinc-900 dark:text-zinc-50">{qStats.totalWrong}錯</span></span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>連勝: <span className={currentStreak >= 3 ? 'text-zinc-900 dark:text-zinc-50 font-black' : ''}>{currentStreak}</span></span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
              </div>
              <button 
                onClick={() => setShowStats(!showStats)} 
                className={`text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 active:scale-95 transition-all p-1 rounded-lg flex items-center justify-center ${showStats ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300' : ''}`}
                title={showStats ? "隱藏資訊" : "顯示資訊"}
              >
                <IconInfo size={18} />
              </button>
            </div>
          </div>

          <div className="min-h-[100px] mb-8">
            <h2 className="text-2xl sm:text-[26px] font-bold leading-relaxed whitespace-pre-wrap text-zinc-900 dark:text-zinc-50 tracking-tight"><FormatTitle title={currentQ.title} /></h2>
            {currentQ.imageUrl && (
              <div className="mt-6 rounded-[24px] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white p-2 flex justify-center shadow-sm">
                <img
                  src={currentQ.imageUrl}
                  alt="題目圖片"
                  className="max-w-full max-h-80 object-contain rounded-xl"
                  onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                />
                <p style={{display:'none'}} className="text-zinc-900 dark:text-zinc-50 font-bold text-sm p-6">⚠️ 圖片無法顯示，請確認圖片連結是否正確</p>
              </div>
            )}
          </div>

          <div className="space-y-4 flex-1">
            {currentQ.options.map((opt, idx) => {
              const isSelected = state.selectedOption && state.selectedOption !== 'skipped' && state.selectedOption.includes(opt.label);
              const isCorrect = currentQ.answer.includes(opt.label);
              return (
                <QuestionOption
                  key={idx}
                  opt={opt}
                  idx={idx}
                  isSelected={isSelected}
                  isCorrect={isCorrect}
                  hasAnswered={state.hasAnswered}
                  isMobile={false}
                  onClick={() => {
                    const isMultiple = currentQ.answer.length > 1;
                    if (isMultiple) dispatch({ type: 'TOGGLE_OPTION', payload: opt.label });
                    else dispatch({ type: 'SELECT_AND_CONFIRM', payload: opt.label });
                  }}
                />
              );
            })}
          </div>

          {state.hasAnswered && state.selectedOption !== currentQ.answer && (
            <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[24px] text-left shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-black text-zinc-900 dark:text-zinc-50">
                  <IconAlertTriangle size={20} />
                  <span>{state.selectedOption === 'skipped' ? '題目解析' : '錯題檢討'}</span>
                </div>
                <button 
                  onClick={() => {
                    if (editingExp) {
                      dispatch({ type: 'UPDATE_QUESTION_EXPLANATION', payload: { title: currentQ.title, explanation: expText } });
                      setEditingExp(false);
                    } else {
                      setExpText(currentQ.explanation || "");
                      setEditingExp(true);
                    }
                  }}
                  className="text-sm font-bold px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 active:scale-95 transition-all"
                >
                  {editingExp ? '💾 儲存解析' : '📝 編輯解析'}
                </button>
              </div>
              <div className="text-base text-zinc-600 dark:text-zinc-400 mb-3 font-bold">
                您的答案：<span className="text-zinc-900 dark:text-zinc-100 font-black">{state.selectedOption === 'skipped' ? '已略過' : state.selectedOption.split('').join(', ')}</span>
                <span className="mx-3 opacity-30">|</span>
                正確答案：<span className="text-emerald-600 dark:text-emerald-400 font-black">{currentQ.answer.split('').join(', ')}</span>
              </div>
              <div className="border-t border-zinc-300 dark:border-zinc-600 my-4"></div>
              {editingExp ? (
                <textarea
                  value={expText}
                  onChange={(e) => setExpText(e.target.value)}
                  className="w-full min-h-[120px] p-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  placeholder="在此輸入新的解析..."
                />
              ) : (
                (currentQ.explanation && currentQ.explanation.trim()) ? (
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {currentQ.explanation.trim()}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 italic">尚無解析</p>
                )
              )}
            </div>
          )}
        </div>

        <div className={`px-8 py-5 flex items-center justify-between transition-colors duration-200 border-t border-white/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl`}>
          {state.hasAnswered ? (
            <div className="w-full flex items-center justify-between">
              <div className={`font-black text-lg ${state.selectedOption === currentQ.answer ? 'text-emerald-600 dark:text-emerald-400' : state.selectedOption === 'skipped' ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {state.selectedOption === currentQ.answer ? '答對了！+2 分' : state.selectedOption === 'skipped' ? '已略過此題 (+0 分)' : `正確答案是 (${currentQ.answer.split('').join(', ')})  -0.5 分`}
              </div>
              <button onClick={() => { setEditingExp(false); dispatch({ type: 'NEXT_QUESTION' }); }} className="flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-8 py-3.5 rounded-xl font-bold shadow-md active:scale-95 hover:scale-105 transition-all text-base">
                {state.currentIndex < state.currentBatch.length - 1 ? '下一題' : '查看結果'}
                <span className="text-xs font-mono opacity-60 hidden sm:inline">[Space]</span>
                <IconArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => dispatch({ type: 'SKIP_QUESTION' })}
                className="flex items-center gap-2 px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/50 rounded-xl font-bold transition-all active:scale-95"
              >
                略過此題
                <span className="text-xs font-mono opacity-60 hidden sm:inline">[Q]</span>
              </button>
              <button
                onClick={() => dispatch({ type: 'CONFIRM_ANSWER' })}
                disabled={!state.selectedOption}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold shadow-md active:scale-95 transition-all text-base ${
                  state.selectedOption
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:scale-105 cursor-pointer'
                    : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed shadow-none'
                }`}
              >
                確認答案
                <span className="text-xs font-mono opacity-60 hidden sm:inline">[Enter]</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
