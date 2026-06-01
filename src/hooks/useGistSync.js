import { useState, useEffect, useRef } from 'react';
import { normalizeStats, BUILTIN_QUESTIONS } from '../utils/questionParser.js';

export function useGistSync(stateRef, dispatch) {
  const [syncToken, setSyncToken] = useState(() => sessionStorage.getItem('anki_sync_token') || localStorage.getItem('anki_sync_token') || '');
  const [syncGistId, setSyncGistId] = useState(() => localStorage.getItem('anki_sync_gist_id') || '');
  const [autoSync, setAutoSync] = useState(() => localStorage.getItem('anki_auto_sync') === 'true');
  const [rememberToken, setRememberToken] = useState(() => localStorage.getItem('anki_remember_token') === 'true');
  const [showTokenText, setShowTokenText] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => localStorage.getItem('anki_last_sync_time') || '');
  const [syncStatus, setSyncStatus] = useState('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);

  const lwwMerge = (localStats, cloudStats) => {
    const normLocal = normalizeStats(localStats);
    const normCloud = normalizeStats(cloudStats);
    const allKeys = new Set([...Object.keys(normLocal || {}), ...Object.keys(normCloud || {})]);
    const merged = {};
    for (const key of allKeys) {
      const local = (normLocal || {})[key];
      const cloud = (normCloud || {})[key];
      
      if (local && !cloud) { merged[key] = { ...local }; continue; }
      if (cloud && !local) { merged[key] = { ...cloud }; continue; }
      
      // Last Write Wins (LWW) per question based on timestamps
      const lTime = Math.max(local.lastAnswered || 0, local.resetAt || 0, 0);
      const cTime = Math.max(cloud.lastAnswered || 0, cloud.resetAt || 0, 0);
      
      if (lTime >= cTime) {
        merged[key] = { ...local };
      } else {
        merged[key] = { ...cloud };
      }
    }
    return merged;
  };

  const handlePullSync = async (silent = false) => {
    const token = syncToken, gistId = syncGistId;
    if (!token || !gistId) {
      if (!silent) { setSyncStatus('error'); setSyncMessage('❌ 請先填入 Token 與 Gist ID'); }
      return;
    }
    if (!silent) { setSyncStatus('pulling'); setSyncMessage('正在從雲端下載...'); }
    try {
      const res = await fetch('https://api.github.com/gists/' + gistId + '?t=' + Date.now(), {
        headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (!res.ok) throw new Error('GitHub API 錯誤: ' + res.status);
      const gist = await res.json();
      const file = gist.files && gist.files['anki_quiz_sync.json'];
      if (!file) throw new Error('Gist 中找不到同步檔案 anki_quiz_sync.json');
      let contentStr = file.content;
      if (file.truncated && file.raw_url) {
        const rawRes = await fetch(file.raw_url);
        if (!rawRes.ok) throw new Error('讀取 Gist 原始檔失敗: ' + rawRes.status);
        contentStr = await rawRes.text();
      }
      const cloudData = JSON.parse(contentStr);
      const currentStats = stateRef.current.stats;
      const mergedStats = lwwMerge(currentStats, cloudData.stats || {});
      const cloudQ = cloudData.allQuestions || [];
      if (cloudQ.length > 0) {
        dispatch({ type: 'CLOUD_SYNC_PULL', payload: { questions: cloudQ, stats: mergedStats } });
      } else {
        dispatch({ type: 'IMPORT_STATS', payload: mergedStats });
      }
      const now = new Date().toISOString();
      localStorage.setItem('anki_last_sync_time', now);
      setLastSyncTime(now);
      if (!silent) { setSyncStatus('success'); setSyncMessage('✅ 下載並合併成功！'); }
    } catch (err) {
      if (!silent) { setSyncStatus('error'); setSyncMessage('❌ 下載失敗: ' + err.message); }
      else console.warn('[Auto-Sync Pull]', err.message);
    }
  };

  const handlePushSync = async (silent = false) => {
    const token = syncToken;
    if (!token) {
      if (!silent) { setSyncStatus('error'); setSyncMessage('❌ 請先填入 Token'); }
      return;
    }
    if (!silent) { setSyncStatus('pushing'); setSyncMessage('正在上傳至雲端...'); }
    try {
      const currentState = stateRef.current;
      const builtinTitles = new Set(BUILTIN_QUESTIONS.map(q => q.title));
      const txtOnly = currentState.allQuestions.filter(q => !builtinTitles.has(q.title));
      let gistId = syncGistId;

      if (!gistId) {
        // 首次同步：建立新的私有 Gist
        const payload = {
          description: 'Anki Quiz Sync Data',
          public: false,
          files: { 'anki_quiz_sync.json': { content: JSON.stringify({ version: 2, lastUpdated: new Date().toISOString(), allQuestions: txtOnly, stats: currentState.stats }, null, 2) } }
        };
        const res = await fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('建立 Gist 失敗: ' + res.status);
        const gist = await res.json();
        setSyncGistId(gist.id);
        localStorage.setItem('anki_sync_gist_id', gist.id);
        const now = new Date().toISOString();
        localStorage.setItem('anki_last_sync_time', now);
        setLastSyncTime(now);
        if (!silent) { setSyncStatus('success'); setSyncMessage('✅ 已建立雲端同步！Gist ID 已自動填入。'); }
        return;
      }

      // Pull-Merge-Push
      const getRes = await fetch('https://api.github.com/gists/' + gistId + '?t=' + Date.now(), {
        headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (!getRes.ok) throw new Error('讀取 Gist 失敗: ' + getRes.status);
      const gist = await getRes.json();
      const file = gist.files && gist.files['anki_quiz_sync.json'];
      let cloudData = { stats: {}, allQuestions: [] };
      if (file) {
        let contentStr = file.content;
        if (file.truncated && file.raw_url) {
          const rawRes = await fetch(file.raw_url);
          if (rawRes.ok) contentStr = await rawRes.text();
        }
        cloudData = JSON.parse(contentStr);
      }
      const freshState = stateRef.current;
      const freshTxtOnly = freshState.allQuestions.filter(q => !builtinTitles.has(q.title));
      const mergedStats = lwwMerge(freshState.stats, cloudData.stats || {});
      const mergedPayload = { version: 2, lastUpdated: new Date().toISOString(), allQuestions: freshTxtOnly, stats: mergedStats };
      
      const patchHeaders = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' };
      const patchRes = await fetch('https://api.github.com/gists/' + gistId, {
        method: 'PATCH', headers: patchHeaders,
        body: JSON.stringify({ files: { 'anki_quiz_sync.json': { content: JSON.stringify(mergedPayload, null, 2) } } })
      });
      if (!patchRes.ok) throw new Error('更新 Gist 失敗: ' + patchRes.status);
      
      dispatch({ type: 'IMPORT_STATS', payload: mergedStats });
      const now = new Date().toISOString();
      localStorage.setItem('anki_last_sync_time', now);
      setLastSyncTime(now);
      if (!silent) { setSyncStatus('success'); setSyncMessage('✅ 上傳並合併成功！'); }
    } catch (err) {
      if (!silent) { setSyncStatus('error'); setSyncMessage('❌ 上傳失敗: ' + err.message); }
      else console.warn('[Auto-Sync Push]', err.message);
    }
  };

  // Sync config persistence
  useEffect(() => {
    if (rememberToken && syncToken) { localStorage.setItem('anki_sync_token', syncToken); sessionStorage.removeItem('anki_sync_token'); }
    else if (syncToken) { sessionStorage.setItem('anki_sync_token', syncToken); localStorage.removeItem('anki_sync_token'); }
    else { sessionStorage.removeItem('anki_sync_token'); localStorage.removeItem('anki_sync_token'); }
    localStorage.setItem('anki_remember_token', rememberToken.toString());
  }, [syncToken, rememberToken]);
  useEffect(() => { localStorage.setItem('anki_sync_gist_id', syncGistId); }, [syncGistId]);
  useEffect(() => { localStorage.setItem('anki_auto_sync', autoSync.toString()); }, [autoSync]);

  // Auto-sync: pull on mount OR when modal is closed
  const autoSyncInitRef = useRef(false);
  const prevShowSyncModal = useRef(showSyncModal);
  useEffect(() => {
    if (autoSync && syncToken && syncGistId) {
      if (!autoSyncInitRef.current) {
        autoSyncInitRef.current = true;
        handlePullSync(true);
      } else if (prevShowSyncModal.current && !showSyncModal) {
        handlePullSync(true);
      }
    }
    prevShowSyncModal.current = showSyncModal;
  }, [showSyncModal, autoSync, syncToken, syncGistId]);

  // Auto-sync: Debounced push when stats change via user actions
  useEffect(() => {
    if (!autoSync || !syncToken || !syncGistId || !stateRef.current.lastActionTime) return;
    const timer = setTimeout(() => {
      handlePushSync(true);
    }, 3000); // 3 seconds debounce
    return () => clearTimeout(timer);
  }, [stateRef.current.lastActionTime, autoSync, syncToken, syncGistId]);

  // Auto-sync: Push on page hide, Pull on page visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && autoSync && syncToken && syncGistId) {
        handlePushSync(true);
      } else if (document.visibilityState === 'visible' && autoSync && syncToken && syncGistId) {
        handlePullSync(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoSync, syncToken, syncGistId]);

  const closeSyncModal = () => {
    setShowSyncModal(false);
    setSyncMessage('');
    setSyncStatus('idle');
    dispatch({ type: 'CLOSE_SYNC_MODAL' });
  };

  return {
    syncToken, setSyncToken,
    syncGistId, setSyncGistId,
    autoSync, setAutoSync,
    rememberToken, setRememberToken,
    showTokenText, setShowTokenText,
    lastSyncTime, setLastSyncTime,
    syncStatus, setSyncStatus,
    syncMessage, setSyncMessage,
    showSyncModal, setShowSyncModal,
    lwwMerge,
    handlePullSync,
    handlePushSync,
    closeSyncModal
  };
}
