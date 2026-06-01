import React from 'react';
import { IconCheckCircle2, IconXCircle } from './Icons';

const QuestionOption = ({ opt, idx, isSelected, isCorrect, hasAnswered, onClick, isMobile }) => {
  if (isMobile) {
    // --- Mobile rendering ---
    let btnClass = "w-full text-left rounded-[20px] flex items-start gap-3 transition-all duration-100 shadow-sm p-4 ";
    let labelClass = "flex-shrink-0 w-[28px] h-[28px] rounded-full flex items-center justify-center text-[13px] font-black transition-all ";
    let textClass = "mt-0.5 text-[14px] leading-relaxed whitespace-pre-wrap tracking-tight font-semibold ";
    let feedbackIcon = null;

    if (!hasAnswered) {
      if (isSelected) {
        btnClass += "bg-zinc-900 border-2 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 scale-[1.01]";
        labelClass += "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white";
        textClass += "text-white dark:text-zinc-900";
      } else {
        btnClass += "bg-white/90 border-2 border-transparent hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800/80";
        labelClass += "bg-zinc-100 text-zinc-500 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400";
        textClass += "text-zinc-700 dark:text-zinc-300";
      }
    } else {
      if (isCorrect) {
        btnClass += "bg-emerald-50 border-2 border-emerald-500 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-800/50 dark:text-emerald-400";
        labelClass += "bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500";
        textClass += "text-emerald-900 dark:text-emerald-400";
        feedbackIcon = <IconCheckCircle2 className="ml-auto flex-shrink-0 mt-0.5" size={20} style={{color: 'currentColor'}} />;
      } else if (isSelected) {
        btnClass += "bg-rose-50 border-2 border-rose-500 text-rose-900 dark:bg-rose-950/20 dark:border-rose-800/50 dark:text-rose-400";
        labelClass += "bg-rose-600 text-white dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500";
        textClass += "text-rose-900 dark:text-rose-400";
        feedbackIcon = <IconXCircle className="ml-auto flex-shrink-0 mt-0.5" size={20} style={{color: 'currentColor'}} />;
      } else {
        btnClass += "bg-white/60 border-2 border-transparent dark:bg-zinc-900/60 opacity-60";
        labelClass += "bg-zinc-100 text-zinc-400 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-600";
        textClass += "text-zinc-400 dark:text-zinc-600";
      }
    }

    return (
      <button key={idx} onClick={onClick} disabled={hasAnswered} className={btnClass}>
        <span className={labelClass}>{opt.label}</span>
        <span className={textClass}>{opt.text}</span>
        {feedbackIcon}
      </button>
    );
  }

  // --- Desktop rendering ---
  let btnClass = "w-full text-left p-5 rounded-[24px] border-2 transition-all flex items-start gap-4 relative shadow-sm hover:scale-[1.01] active:scale-[0.99] ";

  if (!hasAnswered) {
    if (isSelected) {
      btnClass += "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900";
    } else {
      btnClass += "bg-white/90 border-transparent hover:border-zinc-300 dark:bg-zinc-900/90 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100";
    }
  } else {
    if (isCorrect) {
      btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-800/50 dark:text-emerald-400";
    } else if (isSelected) {
      btnClass += "bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950/20 dark:border-rose-800/50 dark:text-rose-400";
    } else {
      btnClass += "bg-white/60 border-transparent dark:bg-zinc-900/60 opacity-60 text-zinc-500 dark:text-zinc-400";
    }
  }

  return (
    <button
      key={idx}
      onClick={onClick}
      disabled={hasAnswered}
      className={btnClass}
    >
      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border ${
        hasAnswered && isCorrect
          ? 'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500'
          : hasAnswered && isSelected
            ? 'bg-rose-600 text-white dark:bg-rose-500/20 dark:text-rose-400 border-rose-500'
            : !hasAnswered && isSelected
              ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white border-transparent'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'
      }`}>{opt.label}</span>
      <span className="mt-1.5 leading-relaxed whitespace-pre-wrap font-bold text-[17px]">{opt.text}</span>
      {hasAnswered && isCorrect && <IconCheckCircle2 className="ml-auto flex-shrink-0 mt-0.5" size={24} style={{color: 'currentColor'}} />}
      {hasAnswered && isSelected && !isCorrect && <IconXCircle className="ml-auto flex-shrink-0 mt-0.5" size={24} style={{color: 'currentColor'}} />}
    </button>
  );
};

export default QuestionOption;
