"import React, { useState } from 'react';
import { IconChevronLeft, IconUploadCloud, IconInfo, IconAlertTriangle, IconArrowRight, IconHome } from '../components/Icons';
import FormatTitle from '../components/FormatTitle';
import ProgressDots from '../components/ProgressDots';
import QuestionOption from '../components/QuestionOption';
import { getSafeWeight } from '../utils/ankiAlgorithm';

export default function QuizView({ state, dispatch, isMobile, quizFileInputRef, handleQuizFileUpload, handleReturnMenu, handleQuizUpdateClick }) {
  const [showStats, setShowStats] = useState(false);

  const currentQ = state.currentBatch[state.currentIndex];
  const qStats = state.stats[currentQ?.title] || { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0 };
  const currentWeight = getSafeWeight(qStats);
  const currentStreak = qStats.streak || 0;

  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden flex flex-col bg-[#E6E8E8] dark:bg-[#E6E8E8]">
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
         
<truncated 19011 bytes>