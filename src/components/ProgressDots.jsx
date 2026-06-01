import React from 'react';

const ProgressDots = ({ currentBatch, currentIndex, userAnswers, onGotoQuestion, isMobile }) => {
  const chunks = [];
  for (let i = 0; i < currentBatch.length; i += 5) {
    chunks.push(currentBatch.slice(i, i + 5));
  }

  const c = chunks.length;
  let gridCols = Math.ceil(c / 2);
  
  if (isMobile && gridCols > 5) {
    gridCols = 4;
  }

  return (
    <div
      className={
        gridCols
          ? (isMobile
              ? "px-5 grid justify-center gap-y-2 gap-x-3"
              : "grid justify-center gap-y-3 gap-x-5")
          : (isMobile
              ? "px-5 flex justify-center flex-wrap gap-x-3 gap-y-2"
              : "flex justify-center flex-wrap gap-x-5 gap-y-3")
      }
      style={gridCols ? {
        gridTemplateColumns: `repeat(${gridCols}, auto)`
      } : {}}
    >
      {chunks.map((chunk, chunkIdx) => (
        <div key={chunkIdx} className={isMobile ? "flex gap-1" : "flex gap-1.5"}>
          {chunk.map((_, subIdx) => {
            const idx = chunkIdx * 5 + subIdx;
            const isCurrent = idx === currentIndex;
            const ans = userAnswers ? userAnswers[idx] : null;
            const q = currentBatch[idx];
            let dotColor = 'bg-zinc-200 dark:bg-zinc-800';
            if (ans !== null && ans !== undefined) {
              if (ans === 'skipped') {
                dotColor = 'bg-amber-500/50';
              } else if (ans === q.answer) {
                dotColor = 'bg-emerald-500/50';
              } else {
                dotColor = 'bg-rose-500/50';
              }
            }
            const activeClass = isCurrent
              ? (isMobile
                  ? 'bg-zinc-500 dark:bg-zinc-400 ring-[3px] ring-zinc-500/20 dark:ring-zinc-400/20 scale-125 hover:scale-150 cursor-pointer'
                  : 'bg-zinc-500 dark:bg-zinc-400 ring-4 ring-zinc-500/20 dark:ring-zinc-400/20 scale-125 hover:scale-150 cursor-pointer')
              : 'hover:scale-150 cursor-pointer';
            return (
              <button
                key={idx}
                onClick={() => onGotoQuestion(idx)}
                className={`w-2 h-2 rounded-full transform ${dotColor} ${activeClass}`}
                style={{
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, box-shadow 0.2s ease'
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ProgressDots;
