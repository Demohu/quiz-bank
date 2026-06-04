import React from 'react';
import { createPortal } from 'react-dom';
import { IconCloud, IconEye, IconEyeOff, IconUploadFile, IconDownload } from './Icons';

const SyncModal = ({
  isMobile,
  showSyncModal,
  syncToken,
  setSyncToken,
  syncGistId,
  setSyncGistId,
  autoSync,
  setAutoSync,
  rememberToken,
  setRememberToken,
  showTokenText,
  setShowTokenText,
  lastSyncTime,
  syncStatus,
  syncMessage,
  handlePullSync,
  handlePushSync,
  closeSyncModal,
}) => {
  if (!showSyncModal) return null;

  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 ios-font touch-none" onClick={closeSyncModal}>
        <div className="rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-5 border border-black/[0.06] overscroll-contain" style={{backgroundColor: '#ffffff'}} onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-indigo-500 text-white rounded-xl flex items-center justify-center"><IconCloud size={20} /></div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">雲端同步設定</h3>
              <p className="text-[10px] text-slate-500 tracking-tight">透過 GitHub Gist 在不同裝置間同步進度</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">GitHub Token</label>
              <div className="relative">
                <input type={showTokenText ? "text" : "password"} value={syncToken} onChange={e => setSyncToken(e.target.value.trim())} placeholder="ghp_xxxxxxxxxxxx" className="w-full px-3 py-2.5 bg-black/5 border border-black/[0.06] rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-400 pr-10" />
                <button type="button" onClick={() => setShowTokenText(!showTokenText)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600">
                  {showTokenText ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer select-none">
                  <input type="checkbox" checked={rememberToken} onChange={e => setRememberToken(e.target.checked)} className="rounded bg-black/5 border-black/[0.06] accent-sky-500" />
                  記住 Token
                </label>
                <a href="https://github.com/settings/tokens/new?description=Anki%20Quiz%20Sync&scopes=gist" target="_blank" rel="noopener noreferrer" className="text-[10px] text-sky-400 hover:underline font-bold">取得 Token →</a>
              </div>
              {rememberToken && (
                <div className="mt-2 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 leading-normal">
                  ⚠️ 啟用後 Token 將明文保存於瀏覽器，建議僅在個人裝置上使用
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Gist ID</label>
              <input type="text" value={syncGistId} onChange={e => {
                let val = e.target.value.trim();
                if (val.includes('/')) {
                  const parts = val.split('/');
                  val = parts[parts.length - 1] || val;
                }
                setSyncGistId(val);
              }} placeholder="首次上傳後自動產生" className="w-full px-3 py-2.5 bg-black/5 border border-black/[0.06] rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-black/[0.04]">
              <div>
                <div className="text-xs font-bold text-slate-700">自動同步</div>
                <div className="text-[10px] text-slate-500 mt-0.5">啟動時自動下載・測驗結束自動上傳</div>
              </div>
              <button type="button" onClick={() => setAutoSync(!autoSync)} className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${autoSync ? 'bg-sky-500' : 'bg-black/5'}`}>
                <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 absolute top-0.5 ${autoSync ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {lastSyncTime && (
              <div className="text-[10px] text-slate-500 text-center py-0.5">
                上次同步：{new Date(lastSyncTime).toLocaleString('zh-TW')}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handlePushSync(false)} disabled={syncStatus === 'pushing' || syncStatus === 'pulling' || !syncToken} className="flex items-center justify-center gap-1 bg-sky-500 hover:bg-sky-600 disabled:bg-black/5 disabled:text-slate-400 disabled:border-transparent text-white font-bold py-2.5 rounded-xl transition-all text-xs active:scale-95">
                {syncStatus === 'pushing' ? '⏳' : <IconUploadFile size={14} />} 上傳雲端
              </button>
              <button onClick={() => handlePullSync(false)} disabled={syncStatus === 'pushing' || syncStatus === 'pulling' || !syncToken || !syncGistId} className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-black/5 disabled:text-slate-400 disabled:border-transparent text-white font-bold py-2.5 rounded-xl transition-all text-xs active:scale-95">
                {syncStatus === 'pulling' ? '⏳' : <IconDownload size={14} />} 從雲端下載
              </button>
            </div>
            {syncMessage && (
              <div className={`text-xs text-center p-2.5 rounded-xl transition-all ${syncStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : syncStatus === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'}`}>
                {syncMessage}
              </div>
            )}
            <button onClick={closeSyncModal} className="w-full text-slate-500 font-bold py-2 text-xs hover:text-slate-700 transition-colors">
              關閉
            </button>
          </div>
        </div>
      </div>
    , document.body);
  }

  // Desktop version
  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeSyncModal}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center"><IconCloud size={22} /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">雲端同步設定</h3>
            <p className="text-xs text-slate-400">透過 GitHub Gist 在不同裝置間同步進度</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">GitHub Token</label>
            <div className="relative">
              <input type={showTokenText ? "text" : "password"} value={syncToken} onChange={e => setSyncToken(e.target.value.trim())} placeholder="ghp_xxxxxxxxxxxx" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10" />
              <button type="button" onClick={() => setShowTokenText(!showTokenText)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showTokenText ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
                <input type="checkbox" checked={rememberToken} onChange={e => setRememberToken(e.target.checked)} className="rounded accent-blue-500" />
                記住 Token
              </label>
              <a href="https://github.com/settings/tokens/new?description=Anki%20Quiz%20Sync&scopes=gist" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium">取得 Token →</a>
            </div>
            {rememberToken && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ⚠️ 啟用後 Token 將明文保存於瀏覽器，建議僅在個人裝置上使用
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Gist ID</label>
            <input type="text" value={syncGistId} onChange={e => {
              let val = e.target.value.trim();
              if (val.includes('/')) {
                const parts = val.split('/');
                val = parts[parts.length - 1] || val;
              }
              setSyncGistId(val);
            }} placeholder="首次上傳後自動產生" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono" />
          </div>
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="text-sm font-semibold text-slate-700">自動同步</div>
              <div className="text-xs text-slate-400 mt-0.5">啟動時自動下載・測驗結束自動上傳</div>
            </div>
            <button type="button" onClick={() => setAutoSync(!autoSync)} className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${autoSync ? 'bg-blue-500' : 'bg-slate-300'}`}>
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 absolute top-0.5 ${autoSync ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {lastSyncTime && (
            <div className="text-xs text-slate-400 text-center py-1">
              上次同步：{new Date(lastSyncTime).toLocaleString('zh-TW')}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handlePushSync(false)} disabled={syncStatus === 'pushing' || syncStatus === 'pulling' || !syncToken} className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm active:scale-95">
              {syncStatus === 'pushing' ? '⏳' : <IconUploadFile size={16} />} 上傳至雲端
            </button>
            <button onClick={() => handlePullSync(false)} disabled={syncStatus === 'pushing' || syncStatus === 'pulling' || !syncToken || !syncGistId} className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm active:scale-95">
              {syncStatus === 'pulling' ? '⏳' : <IconDownload size={16} />} 從雲端下載
            </button>
          </div>
          {syncMessage && (
            <div className={`text-sm text-center p-3 rounded-xl transition-all ${syncStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : syncStatus === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              {syncMessage}
            </div>
          )}
          <button onClick={closeSyncModal} className="w-full text-slate-500 font-medium py-2 text-sm hover:text-slate-700 transition-colors">
            關閉
          </button>
        </div>
      </div>
    </div>
  , document.body);
};

export default SyncModal;
