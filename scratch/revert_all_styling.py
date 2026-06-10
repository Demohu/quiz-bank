import os

# Paths
app_jsx_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\src\App.jsx"
index_css_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\src\index.css"
index_html_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\index.html"

# 1. Revert index.html
html_content = """<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <title>題庫測驗與錯題本</title>
  <link rel="manifest" href="/manifest.json" />
  <link rel="apple-touch-icon" href="/logo.jpg" />
  <link rel="icon" type="image/jpeg" href="/logo.jpg" />
</head>
<body class="bg-[#E6E8E8] text-zinc-900 antialiased">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
"""
with open(index_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print("Reverted index.html successfully.")

# 2. Revert index.css (keep only first 75 lines)
with open(index_css_path, "r", encoding="utf-8") as f:
    css_lines = f.readlines()
# Truncate at line 75 (0-indexed 75 is line 76)
css_reverted = "".join(css_lines[:75])
with open(index_css_path, "w", encoding="utf-8") as f:
    f.write(css_reverted)
print("Reverted index.css successfully.")

# 3. Revert App.jsx
with open(app_jsx_path, "r", encoding="utf-8") as f:
    app_content = f.read()

# We will replace all changed parts back to original values step-by-step.
# Since we know the replacements exactly, let's list them:

replacements = [
    # Revert handleMouseMove function (keep it or remove it? Let's remove it or keep it unused. Better to remove it to clean up completely)
    (
        """      const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
      };""",
        ""
    ),
    # Revert mobile upload page wrapper
    (
        """              <div className="fixed inset-0 overflow-hidden flex flex-col justify-center items-center px-6 touch-none bg-transparent">
                <div onMouseMove={handleMouseMove} className="w-full max-w-sm rounded-[30px] p-6 text-center shadow-2xl liquid-glass-card liquid-shine-container">
                  <div className="w-14 h-14 bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-zinc-200 dark:border-zinc-700 relative z-10">
                    <IconUploadCloud size={28} />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 relative z-10">載入題庫</h1>
                  <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-1 mb-3 relative z-10">v4.9.10</span>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-xs leading-relaxed font-medium relative z-10">請上傳您的 Anki 匯出檔 (TXT 或 JSON)。系統會自動記錄進度與錯題。</p>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
                  <button onClick={() => fileInputRef.current.click()} className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md text-sm mb-3 relative z-10">
                    選擇 TXT 檔案
                  </button>
                  <button onClick={() => setShowSyncModal(true)} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm text-sm mb-4 relative z-10">
                    <IconCloud size={16}/> 從雲端同步載入
                  </button>
                  <div className="liquid-shine-overlay" />""",
        """              <div className="fixed inset-0 overflow-hidden flex flex-col justify-center items-center px-6 touch-none bg-[#E6E8E8] dark:bg-[#E6E8E8]">
                <div className="w-full max-w-sm rounded-[30px] border border-white/50 dark:border-zinc-800/50 p-6 text-center bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl shadow-2xl">
                  <div className="w-14 h-14 bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <IconUploadCloud size={28} />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">載入題庫</h1>
                  <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-1 mb-3">v4.9.10</span>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-xs leading-relaxed font-medium">請上傳您的 Anki 匯出檔 (TXT 或 JSON)。系統會自動記錄進度與錯題。</p>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
                  <button onClick={() => fileInputRef.current.click()} className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md text-sm mb-3">
                    選擇 TXT 檔案
                  </button>
                  <button onClick={() => setShowSyncModal(true)} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm text-sm mb-4">
                    <IconCloud size={16}/> 從雲端同步載入
                  </button>"""
    ),
    # Revert desktop upload page wrapper
    (
        """            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
              <div onMouseMove={handleMouseMove} className="max-w-md w-full rounded-[30px] p-8 text-center shadow-2xl relative liquid-glass-card liquid-shine-container">
                <div className="w-16 h-16 bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-200 dark:border-zinc-700 relative z-10">
                  <IconUploadCloud size={32} />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 relative z-10">載入題庫</h1>
                <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-1 mb-4 relative z-10">v4.9.10</span>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed font-medium relative z-10">請上傳您的 Anki 匯出檔 (TXT 或 JSON)。系統會自動記錄進度與錯題。</p>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
                <button onClick={() => fileInputRef.current.click()} className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 shadow-md mb-4 transition-all relative z-10">選擇 TXT 檔案</button>
                <button onClick={() => setShowSyncModal(true)} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 shadow-sm mb-4 transition-all relative z-10">
                  <IconCloud size={18}/> 從雲端同步載入
                </button>
                {Object.keys(state.stats).length > 0 && <button onClick={() => { if (window.confirm("確定清除歷史對錯紀錄？")) { localStorage.clear(); window.location.reload(); } }} className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 hover:dark:text-zinc-50 font-medium transition-all relative z-10">清除歷史紀錄與快取</button>}
                {state.errorLogs && state.errorLogs.length > 0 && (
                  <div className="mt-6 text-left rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 shadow-inner relative z-10">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-semibold mb-2"><IconAlertTriangle size={16}/> 解析警告 ({state.errorLogs.length} 行)</div>
                    <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 max-h-32 overflow-y-auto">{state.errorLogs.map((e, i) => <li key={i}>{e}</li>)}</ul>
                  </div>
                )}
                <div className="liquid-shine-overlay" />
              </div>
            </div>""",
        """            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-md w-full rounded-[30px] border border-white/50 dark:border-zinc-800/50 p-8 text-center bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl shadow-2xl relative">
                <div className="w-16 h-16 bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <IconUploadCloud size={32} />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">載入題庫</h1>
                <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-1 mb-4">v4.9.10</span>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed font-medium">請上傳您的 Anki 匯出檔 (TXT 或 JSON)。系統會自動記錄進度與錯題。</p>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
                <button onClick={() => fileInputRef.current.click()} className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 shadow-md mb-4 transition-all">選擇 TXT 檔案</button>
                <button onClick={() => setShowSyncModal(true)} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 shadow-sm mb-4 transition-all">
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
            </div>"""
    ),
    # Revert mobile menu wrapper & progress card
    (
        """            <div className="fixed inset-0 flex flex-col overflow-y-auto pb-8 overscroll-contain bg-transparent" style={{paddingTop: 'max(1.5rem, env(safe-area-inset-top))'}}>
              <div className="px-5 mb-5 flex justify-between items-center sticky top-0 z-10 bg-white/30 dark:bg-zinc-900/20 backdrop-blur-3xl border-b border-white/40 dark:border-zinc-800/40 py-4 shadow-sm">
                <div className="flex flex-col">
                  <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">Pretest</h2>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-bold mt-1">v4.9.11</span>
                </div>
                <div className="bg-white/80 dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  共 <span className="text-zinc-900 dark:text-zinc-50">{total}</span> 題
                </div>
              </div>

              <div className="px-4 space-y-6">
                {/* 進度條區塊 (Liquid Glass style progress card) */}
                <div onMouseMove={handleMouseMove} className="p-5 rounded-[24px] shadow-xl text-zinc-900 dark:text-zinc-100 relative liquid-glass-card liquid-shine-container">
                  <div className="flex justify-between items-baseline mb-4 relative z-10">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">題庫進度</span>
                    <span className="text-xl font-black">{donePercent}<span className="text-xs font-semibold opacity-70">%</span></span>
                  </div>
                  <div className="w-full h-3 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full overflow-hidden flex shadow-inner relative z-10">
                    <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500" style={{ width: `${masteredPercent}%` }} />
                    <div className="h-full bg-zinc-400 dark:bg-zinc-500 transition-all duration-500" style={{ width: `${Math.max(0, donePercent - masteredPercent)}%` }} />
                  </div>
                  <div className="flex justify-between mt-4 text-[11px] font-semibold tracking-tight opacity-80 text-zinc-600 dark:text-zinc-400 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>已精通 {masteredCount}</span>
                      <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-full bg-zinc-400/50"></span>做過 {doneCount}</span>
                    </div>
                    <span>未做 {undoneCount}</span>
                  </div>
                  <div className="liquid-shine-overlay" />
                </div>""",
        """            <div className="fixed inset-0 flex flex-col overflow-y-auto pb-8 overscroll-contain bg-[#E6E8E8] dark:bg-[#E6E8E8]" style={{paddingTop: 'max(1.5rem, env(safe-area-inset-top))'}}>
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
                {/* 進度條區塊 (Hero Black Card) */}
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
                </div>"""
    ),
    # Revert mobile category button item
    (
        """                        <button
                          key={cat}
                          onClick={() => {
                            if (isDeleteMode) {
                              const newSelected = new Set(selectedCats);
                              if (newSelected.has(cat)) newSelected.delete(cat);
                              else newSelected.add(cat);
                              setSelectedCats(newSelected);
                            } else {
                              dispatch({ type: 'START_QUIZ', payload: { mode: 'category', qs } });
                            }
                          }}
                          onMouseMove={handleMouseMove}
                          className={`flex flex-col items-stretch justify-between p-3.5 rounded-[16px] liquid-shine-container active:scale-95 transition-all duration-100 shadow-sm ${isLastAndOdd ? 'col-span-2' : ''} ${
                            isDeleteMode
                              ? isCatSelected
                                ? 'liquid-selected'
                                : 'liquid-glass-card'
                              : 'liquid-glass-card'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1.5 relative z-10">
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{cat}</span>
                            {isDeleteMode ? (
                              isCatSelected ? (
                                <IconCheckCircle2 size={16} className="text-red-500" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
                              )
                            ) : (
                              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-800/80">{Math.round(catDonePercent)}%</span>
                            )}
                          </div>
                          
                          <div className="w-full h-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full overflow-hidden flex my-1.5 relative z-10">
                            <div className="h-full bg-zinc-900 dark:bg-zinc-100" style={{ width: `${catMasteredPercent}%` }} />
                            <div className="h-full bg-zinc-300 dark:bg-zinc-500" style={{ width: `${Math.max(0, catDonePercent - catMasteredPercent)}%` }} />
                          </div>
                          
                          <div className="flex text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-tight mt-1 relative z-10">
                            <span className="whitespace-nowrap">已做 {catDone} / {catTotal} 題</span>
                          </div>
                          <div className="liquid-shine-overlay" />
                        </button>""",
        """                        <button
                          key={cat}
                          onClick={() => {
                            if (isDeleteMode) {
                              const newSelected = new Set(selectedCats);
                              if (newSelected.has(cat)) newSelected.delete(cat);
                              else newSelected.add(cat);
                              setSelectedCats(newSelected);
                            } else {
                              dispatch({ type: 'START_QUIZ', payload: { mode: 'category', qs } });
                            }
                          }}
                          className={`flex flex-col items-stretch justify-between p-3.5 rounded-[16px] border bg-white dark:bg-zinc-900 active:scale-95 transition-all duration-100 shadow-sm ${isLastAndOdd ? 'col-span-2' : ''} ${
                            isDeleteMode
                              ? isCatSelected
                                ? 'border-red-400 dark:border-red-600 bg-red-50/20 dark:bg-red-950/10'
                                : 'border-zinc-200/50 dark:border-zinc-800'
                              : 'border-zinc-200/50 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{cat}</span>
                            {isDeleteMode ? (
                              isCatSelected ? (
                                <IconCheckCircle2 size={16} className="text-red-500" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
                              )
                            ) : (
                              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950 px-1.5 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-800/80">{Math.round(catDonePercent)}%</span>
                            )}
                          </div>
                          
                          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex my-1.5">
                            <div className="h-full bg-zinc-900 dark:bg-zinc-50" style={{ width: `${catMasteredPercent}%` }} />
                            <div className="h-full bg-zinc-300 dark:bg-zinc-600" style={{ width: `${Math.max(0, catDonePercent - catMasteredPercent)}%` }} />
                          </div>
                          
                          <div className="flex text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-tight mt-1">
                            <span className="whitespace-nowrap">已做 {catDone} / {catTotal} 題</span>
                          </div>
                        </button>"""
    ),
    # Revert desktop settings card (step 7033)
    (
        """                  <div onMouseMove={handleMouseMove} className="liquid-glass-card liquid-shine-container text-zinc-900 dark:text-zinc-100 rounded-[24px] p-5 text-left">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold">每次測驗題數</span>
                      <div className="flex gap-2 relative z-10">
                        {[15, 30, 50].map(n => (
                          <button key={n} onClick={() => dispatch({ type: 'SET_QUESTIONS_PER_QUIZ', payload: n })}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${state.questionsPerQuiz === n ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md' : 'bg-transparent text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'}`}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 relative z-10">
                       <button onClick={() => fileInputRef.current.click()} className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"><IconUploadCloud size={16}/> 上傳題庫</button>
                       <button onClick={() => setShowSyncModal(true)} className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                         <IconCloud size={16}/> 雲端同步
                         {autoSync && syncGistId && <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-50 animate-pulse"></span>}
                       </button>
                    </div>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
                    <div className="liquid-shine-overlay" />
                  </div>""",
        """                  <div className="rounded-[24px] border border-white dark:border-zinc-800/80 p-5 text-left bg-white/90 dark:bg-zinc-900 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold">每次測驗題數</span>
                      <div className="flex gap-2">
                        {[15, 30, 50].map(n => (
                          <button key={n} onClick={() => dispatch({ type: 'SET_QUESTIONS_PER_QUIZ', payload: n })}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${state.questionsPerQuiz === n ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md' : 'bg-transparent text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'}`}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => fileInputRef.current.click()} className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"><IconUploadCloud size={16}/> 上傳題庫</button>
                       <button onClick={() => setShowSyncModal(true)} className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                         <IconCloud size={16}/> 雲端同步
                         {autoSync && syncGistId && <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-50 animate-pulse"></span>}
                       </button>
                    </div>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
                  </div>"""
    ),
    # Revert desktop category button return mapping (step 7037)
    (
        """                        return (
                          <button
                            key={cat}
                            onMouseMove={handleMouseMove}
                            onClick={() => {
                              if (isDeleteMode) {
                                const newSelected = new Set(selectedCats);
                                if (newSelected.has(cat)) newSelected.delete(cat);
                                else newSelected.add(cat);
                                setSelectedCats(newSelected);
                              } else {
                                dispatch({ type: 'START_QUIZ', payload: { mode: 'category', qs } });
                              }
                            }}
                            className={`flex flex-col items-stretch justify-between p-3.5 rounded-[16px] liquid-glass-card liquid-shine-container active:scale-95 group text-left shadow-sm transition-all ${
                              isDeleteMode && isCatSelected ? 'liquid-selected' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1.5 relative z-10">
                              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 transition-colors">{cat}</span>
                              {isDeleteMode ? (
                                isCatSelected ? (
                                  <IconCheckCircle2 size={16} className="text-red-500" />
                                ) : (
                                  <span className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
                                )
                              ) : (
                                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-800/80">{Math.round(catDonePercent)}%</span>
                              )}
                            </div>
                            
                            <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex my-1.5 relative z-10">
                              <div className="h-full bg-zinc-900 dark:bg-zinc-50" style={{ width: `${catMasteredPercent}%` }} />
                              <div className="h-full bg-zinc-300 dark:bg-zinc-600" style={{ width: `${Math.max(0, catDonePercent - catMasteredPercent)}%` }} />
                            </div>
                            
                            <div className="flex text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-tight mt-1 relative z-10">
                              <span className="whitespace-nowrap">已做 {catDone} / {catTotal} 題</span>
                            </div>
                            <div className="liquid-shine-overlay" />
                          </button>
                        );""",
        """                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              if (isDeleteMode) {
                                const newSelected = new Set(selectedCats);
                                if (newSelected.has(cat)) newSelected.delete(cat);
                                else newSelected.add(cat);
                                setSelectedCats(newSelected);
                              } else {
                                dispatch({ type: 'START_QUIZ', payload: { mode: 'category', qs } });
                              }
                            }}
                            className={`flex flex-col items-stretch justify-between p-3.5 rounded-[16px] border bg-white dark:bg-zinc-950 active:scale-95 group text-left shadow-sm transition-all ${
                              isDeleteMode
                                ? isCatSelected
                                  ? 'border-red-400 dark:border-red-600 bg-red-50/20 dark:bg-red-950/10'
                                  : 'border-zinc-200/50 dark:border-zinc-800'
                                : 'border-zinc-200/50 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 transition-colors">{cat}</span>
                              {isDeleteMode ? (
                                isCatSelected ? (
                                  <IconCheckCircle2 size={16} className="text-red-500" />
                                ) : (
                                  <span className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
                                )
                              ) : (
                                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950 px-1.5 py-0.5 rounded-md border border-zinc-100 dark:border-zinc-800/80">{Math.round(catDonePercent)}%</span>
                              )}
                            </div>
                            
                            <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex my-1.5">
                              <div className="h-full bg-zinc-900 dark:bg-zinc-50" style={{ width: `${catMasteredPercent}%` }} />
                              <div className="h-full bg-zinc-300 dark:bg-zinc-600" style={{ width: `${Math.max(0, catDonePercent - catMasteredPercent)}%` }} />
                            </div>
                            
                            <div className="flex text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-tight mt-1">
                              <span className="whitespace-nowrap">已做 {catDone} / {catTotal} 題</span>
                            </div>
                          </button>
                        );"""
    ),
    # Revert desktop menu main card
    (
        """          <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
            <div onMouseMove={handleMouseMove} className="max-w-4xl w-full liquid-glass-card liquid-shine-container rounded-[30px] shadow-2xl p-8 relative">""",
        """          <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-4xl w-full bg-white/40 border border-white/50 backdrop-blur-3xl rounded-[30px] shadow-2xl p-8 dark:bg-zinc-900/30 dark:border-zinc-800/50">"""
    ),
    # Revert desktop menu main card end
    (
        """              </div>
              <div className="liquid-shine-overlay" />
            </div>
            {renderSyncModal()}
          </div>
        );""",
        """              </div>
            </div>
            {renderSyncModal()}
          </div>
        );"""
    ),
    # Revert mobile result card
    (
        """            <div className="fixed inset-0 overflow-hidden flex flex-col justify-center items-center px-6 touch-none bg-transparent">
              <div onMouseMove={handleMouseMove} className="w-full max-w-sm rounded-[30px] p-6 text-center shadow-2xl liquid-glass-card liquid-shine-container">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 relative z-10">測驗結束</h2>
                <div className={`text-5xl font-black tracking-tight mb-4 relative z-10 ${state.score >= 60 ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-900 dark:text-zinc-50'}`}>
                  {fmtNum(state.score)} 
                  <span className="text-lg text-zinc-500 dark:text-zinc-400 font-semibold tracking-tight"> / {maxScore} 分</span>
                </div>
                <div className="rounded-3xl p-5 mb-6 border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm space-y-3 text-left relative z-10">
                  <div className="flex justify-between text-sm font-semibold"><span className="text-zinc-500 dark:text-zinc-400">答對</span><span className="text-zinc-900 dark:text-zinc-50">{state.correctCount} 題（+{state.correctCount * 2} 分）</span></div>
                  <div className="flex justify-between text-sm font-semibold"><span className="text-zinc-500 dark:text-zinc-400">答錯</span><span className="text-zinc-900 dark:text-zinc-50">{wrongCount} 題（-{fmtNum(penalty)} 分）</span></div>
                  {skippedCount > 0 && (
                    <div className="flex justify-between text-sm font-semibold"><span className="text-zinc-500 dark:text-zinc-400">略過</span><span className="text-zinc-500 dark:text-zinc-400">{skippedCount} 題（+0 分）</span></div>
                  )}
                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium"><span>配分規則</span><span>每題 2 分，答錯倒扣 0.5 分</span></div>
                </div>
                <div className="space-y-3 w-full relative z-10">
                  <button onClick={handleRestartQuiz} className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md text-sm">
                    <IconRotateCcw size={18} /> 重新測試同項目
                  </button>
                  <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm text-sm">
                    <IconHome size={18} /> 回到主選單
                  </button>
                </div>
                <div className="liquid-shine-overlay" />
              </div>
            </div>""",
        """            <div className="fixed inset-0 overflow-hidden flex flex-col justify-center items-center px-6 touch-none bg-[#E6E8E8] dark:bg-[#E6E8E8]">
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
                  <button onClick={handleRestartQuiz} className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md text-sm">
                    <IconRotateCcw size={18} /> 重新測試同項目
                  </button>
                  <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="w-full flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-semibold py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm text-sm">
                    <IconHome size={18} /> 回到主選單
                  </button>
                </div>
              </div>
            </div>"""
    ),
    # Revert desktop result card
    (
        """          <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-center">
            <div onMouseMove={handleMouseMove} className="max-w-md w-full rounded-[30px] shadow-2xl p-8 liquid-glass-card liquid-shine-container">
              <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50 relative z-10">測驗結束</h2>
              <div className={`text-6xl font-black mb-6 relative z-10 ${state.score >= 60 ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-900 dark:text-zinc-50'}`}>{fmtNum(state.score)} <span className="text-2xl text-zinc-500 dark:text-zinc-400">/ {maxScore} 分</span></div>
              <div className="bg-white/40 dark:bg-zinc-900/30 backdrop-blur-md rounded-3xl p-6 mb-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 text-left relative z-10">
                <div className="flex justify-between text-base"><span className="text-zinc-500 dark:text-zinc-400 font-semibold">答對</span><span className="text-zinc-900 dark:text-zinc-50 font-bold">{state.correctCount} 題（+{state.correctCount * 2} 分）</span></div>
                <div className="flex justify-between text-base"><span className="text-zinc-500 dark:text-zinc-400 font-semibold">答錯</span><span className="text-zinc-900 dark:text-zinc-50 font-bold">{wrongCount} 題（-{fmtNum(penalty)} 分）</span></div>
                {skippedCount > 0 && (
                  <div className="flex justify-between text-base"><span className="text-zinc-500 dark:text-zinc-400 font-semibold">略過</span><span className="text-zinc-500 dark:text-zinc-400 font-bold">{skippedCount} 題（+0 分）</span></div>
                )}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between text-sm text-zinc-500 dark:text-zinc-400 font-medium"><span>配分規則</span><span>每題 2 分，答錯倒扣 0.5 分</span></div>
              </div>
              <div className="flex gap-4 mt-4 relative z-10">
                <button onClick={handleRestartQuiz} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"><IconRotateCcw size={20} /> 重新測試</button>
                <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="flex-1 flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-semibold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm"><IconHome size={20} /> 回到主選單</button>
              </div>
              <div className="liquid-shine-overlay" />
            </div>
          </div>""",
        """          <div className="min-h-screen bg-transparent flex items-center justify-center p-6 text-center">
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
                <button onClick={handleRestartQuiz} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"><IconRotateCcw size={20} /> 重新測試</button>
                <button onClick={() => dispatch({ type: 'RETURN_TO_MENU' })} className="flex-1 flex items-center justify-center gap-2 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-semibold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm"><IconHome size={20} /> 回到主選單</button>
              </div>
            </div>
          </div>"""
    ),
    # Revert mobile mistakes view top card
    (
        """            <div className="fixed inset-0 overflow-hidden flex flex-col bg-transparent">
              {/* ── 頂部玻璃導覽列 ── */}
              <div className="flex-shrink-0 bg-white/30 dark:bg-zinc-900/20 backdrop-blur-3xl border-b border-white/40 dark:border-zinc-800/40 touch-none" style={{paddingTop: 'max(0.5rem, env(safe-area-inset-top))'}}>
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

              {/* ── 主內容捲動區 ── */}
              <div className="flex-1 overflow-y-auto pb-8 ios-scrollbar px-4 pt-5 space-y-5 overscroll-contain">
                {/* 錯題複習模式快速卡片 */}
                <div onMouseMove={handleMouseMove} className="p-5 rounded-[24px] shadow-sm liquid-glass-card liquid-shine-container relative">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4 relative z-10">錯題複習模式</h3>
                  <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                    <button
                      onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'random', qs: wrongQuestions } })}
                      className="flex flex-col items-center justify-center gap-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold py-3.5 rounded-[16px] shadow-md active:scale-95 transition-all text-xs"
                    >
                      <IconShuffle size={18} /> 隨機 {state.questionsPerQuiz} 題
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'sequential', qs: wrongQuestions } })}
                      className="flex flex-col items-center justify-center gap-1.5 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-bold py-3.5 rounded-[16px] shadow-sm active:scale-95 transition-all text-xs"
                    >
                      <IconRotateCcw size={18} /> 依序複習
                    </button>
                  </div>""",
        """            <div className="fixed inset-0 overflow-hidden flex flex-col bg-[#E6E8E8] dark:bg-[#E6E8E8]">
              {/* ── 頂部玻璃導覽列 ── */}
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

              {/* ── 主內容捲動區 ── */}
              <div className="flex-1 overflow-y-auto pb-8 ios-scrollbar px-4 pt-5 space-y-5 overscroll-contain">
                {/* 錯題複習模式快速卡片 */}
                <div className="p-5 rounded-[24px] border border-white dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900 shadow-sm">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">錯題複習模式</h3>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'random', qs: wrongQuestions } })}
                      className="flex flex-col items-center justify-center gap-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold py-3.5 rounded-[16px] shadow-md active:scale-95 transition-all text-xs"
                    >
                      <IconShuffle size={18} /> 隨機 {state.questionsPerQuiz} 題
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'START_QUIZ', payload: { mode: 'sequential', qs: wrongQuestions } })}
                      className="flex flex-col items-center justify-center gap-1.5 bg-white/80 border border-zinc-200 text-zinc-900 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-200 font-bold py-3.5 rounded-[16px] shadow-sm active:scale-95 transition-all text-xs"
                    >
                      <IconRotateCcw size={18} /> 依序複習
                    </button>
                  </div>"""
    ),
    # Revert mobile quiz view wrapper
    (
        """          <div className="fixed inset-0 overflow-hidden flex flex-col bg-transparent">
            <input type="file" ref={quizFileInputRef} onChange={handleQuizFileUpload} accept=".json" className="hidden" />
            
            {/* ── 頂部玻璃導覽列 ── */}
            <div className="flex-shrink-0 bg-white/30 dark:bg-zinc-900/20 backdrop-blur-3xl border-b border-white/40 dark:border-zinc-800/40 touch-none shadow-sm flex flex-col gap-3" style={{paddingTop: 'max(0.5rem, env(safe-area-inset-top))', paddingBottom: '1rem'}}>""",
        """          <div className="fixed inset-0 overflow-hidden flex flex-col bg-[#E6E8E8] dark:bg-[#E6E8E8]">
            <input type="file" ref={quizFileInputRef} onChange={handleQuizFileUpload} accept=".json" className="hidden" />
            
            {/* ── 頂部玻璃導覽列 ── */}
            <div className="flex-shrink-0 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl border-b border-white/50 dark:border-zinc-800/50 touch-none shadow-sm flex flex-col gap-3" style={{paddingTop: 'max(0.5rem, env(safe-area-inset-top))', paddingBottom: '1rem'}}>"""
    ),
    # Revert mobile quiz question card
    (
        """            {/* ── 題目區（上半部）── */}
            <div onMouseMove={handleMouseMove} className="flex-shrink-0 mx-4 mt-5 mb-2 p-5 rounded-[24px] overflow-y-auto shadow-sm liquid-glass-card liquid-shine-container relative" style={{maxHeight: '38vh'}}>""",
        """            {/* ── 題目區（上半部）── */}
            <div className="flex-shrink-0 mx-4 mt-5 mb-2 p-5 rounded-[24px] border border-white dark:border-zinc-800/80 overflow-y-auto bg-white/90 dark:bg-zinc-900 shadow-sm" style={{maxHeight: '38vh'}}>"""
    ),
    # Revert mobile quiz question card end
    (
        """                    onError={(e) => { e.target.style.display='none'; }} />
                </div>
              )}
              <div className="liquid-shine-overlay" />
            </div>""",
        """                    onError={(e) => { e.target.style.display='none'; }} />
                </div>
              )}
            </div>"""
    ),
    # Revert desktop quiz card wrapper
    (
        """          <div onMouseMove={handleMouseMove} className="max-w-3xl w-full rounded-[30px] shadow-2xl overflow-hidden flex flex-col min-h-[500px] liquid-glass-card liquid-shine-container relative">""",
        """          <div className="max-w-3xl w-full bg-white/40 dark:bg-zinc-900/30 backdrop-blur-3xl rounded-[30px] shadow-2xl border border-white/50 dark:border-zinc-800/50 overflow-hidden flex flex-col min-h-[500px]">"""
    ),
    # Revert desktop quiz card inner relative
    (
        """              </div>
            </div>
 
            <div className="px-8 pb-8 flex-1 flex flex-col relative z-10">""",
        """              </div>
            </div>
 
            <div className="px-8 pb-8 flex-1 flex flex-col">"""
    ),
    # Revert single/multiple choice button text color fix
    (
        """                  ) : (
                    <span className="bg-transparent dark:bg-transparent text-zinc-600 dark:text-zinc-300 px-3 py-1.5 rounded-lg font-bold text-xs border border-zinc-200 dark:border-zinc-700 shadow-sm">單選題</span>
                  )}""",
        """                  ) : (
                    <span className="bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1.5 rounded-lg font-bold text-xs border border-zinc-200 dark:border-zinc-700 shadow-sm">單選題</span>
                  )}"""
    ),
    # Revert desktop quiz card footer z-10
    (
        """            <div className={`px-8 py-5 flex items-center justify-between transition-colors duration-200 border-t border-white/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl relative z-10`}>""",
        """            <div className={`px-8 py-5 flex items-center justify-between transition-colors duration-200 border-t border-white/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl`}>"""
    ),
    # Revert desktop quiz card end overlay
    (
        """                  </button>
                </div>
              )}
            </div>
            <div className="liquid-shine-overlay" />
          </div>
        </div>
      );""",
        """                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );"""
    )
]

# Apply all replacements
success = 0
for rep, orig in replacements:
    # Clean CRLF difference
    rep_norm = rep.replace("\\r\\n", "\\n").replace("\\r", "")
    orig_norm = orig.replace("\\r\\n", "\\n").replace("\\r", "")
    
    app_norm = app_content.replace("\\r\\n", "\\n").replace("\\r", "")
    
    if rep_norm in app_norm:
        app_norm = app_norm.replace(rep_norm, orig_norm)
        app_content = app_norm
        print(f"Successfully reverted a chunk!")
        success += 1
    else:
        # Fallback to direct replace
        if rep in app_content:
            app_content = app_content.replace(rep, orig)
            print(f"Successfully reverted a chunk (direct)!")
            success += 1
        else:
            print("Failed to revert a chunk! Snippet:")
            print(repr(rep[:100]))

# Save App.jsx
with open(app_jsx_path, "w", encoding="utf-8") as f:
    f.write(app_content)

print(f"Total App.jsx chunks reverted: {success}/{len(replacements)}")
