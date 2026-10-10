'use client';

import React, {useState, useEffect, useRef, useCallback} from 'react';

// --- Icons (inline SVG, zero dependencies) ---
const IconSparkles = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);
const IconPlay = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
const IconRefresh = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const IconTerminal = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconVolume = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);
const IconUpload = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

// --- Types ---
type VaultVideo = {slug: string; title: string; duration: string; durationSec: number; sizeMB: number; dateAdded: string; type: string};
type Topic = {slug: string; title: string; format?: string; angle?: string};
type RenderJob = {id: string; kind: string; slug: string; status: string; progress: number; frame: number; totalFrames: number; log: string[]; startedAt: number; finishedAt?: number; error?: string};
type PipelineStatus = {pipelineRoot: string; node: boolean; ffmpeg: boolean; remotionInstalled: boolean; scriptsOut: boolean; geminiKey: boolean; youtubeAuth: boolean; facebookAuth: boolean; tiktokSession: boolean};
type CalEntry = {id: string; date: string; slug: string; title: string; platform: string};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `request failed (${res.status})`);
  return data as T;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [vault, setVault] = useState<VaultVideo[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [calendar, setCalendar] = useState<CalEntry[]>([]);
  const [logs, setLogs] = useState<{id: number; time: string; script: string; msg: string; type: string}[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Generator state
  const [selectedTopic, setSelectedTopic] = useState('');
  const [scriptOutput, setScriptOutput] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceDone, setVoiceDone] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [busyMsg, setBusyMsg] = useState('');

  // Publisher state
  const [publishSlug, setPublishSlug] = useState('');
  const [platforms, setPlatforms] = useState<Record<string, boolean>>({youtube: true, facebook: true, tiktok: true, instagram: true});
  const [publishJobs, setPublishJobs] = useState<{id: string; platform: string}[]>([]);
  const [publishStatus, setPublishStatus] = useState<Record<string, RenderJob>>({});

  // Vault preview
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  // API keys (stored server-side via settings)
  const [keyInput, setKeyInput] = useState('');
  const [keyStatus, setKeyStatus] = useState<{geminiKeySet: boolean; geminiKeySource: string | null} | null>(null);
  const [keyMsg, setKeyMsg] = useState('');
  const [keyBusy, setKeyBusy] = useState(false);

  const refreshKeyStatus = useCallback(async () => {
    try {
      const d = await api<{geminiKeySet: boolean; geminiKeySource: string | null}>('/api/settings/keys');
      setKeyStatus(d);
    } catch {}
  }, []);

  const addLog = useCallback((script: string, msg: string, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-199), {id: Date.now() + Math.random(), time, script, msg, type}]);
  }, []);

  const refreshVault = useCallback(async () => {
    try {
      const d = await api<{videos: VaultVideo[]}>('/api/vault');
      setVault(d.videos);
    } catch (e) { addLog('vault', String(e), 'warning'); }
  }, [addLog]);

  const refreshTopics = useCallback(async () => {
    try {
      const d = await api<{topics: Topic[]}>('/api/topics');
      setTopics(d.topics);
      if (!selectedTopic && d.topics.length) setSelectedTopic(d.topics[0].slug);
    } catch (e) { addLog('topics', String(e), 'warning'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLog]);

  const refreshRenders = useCallback(async () => {
    try {
      const d = await api<{jobs: RenderJob[]}>('/api/render');
      setRenderJobs(d.jobs);
      return d.jobs;
    } catch { return []; }
  }, []);

  useEffect(() => {
    refreshVault(); refreshTopics(); refreshRenders(); refreshKeyStatus();
    api<PipelineStatus>('/api/status').then(setStatus).catch(() => {});
    addLog('dashboard', 'Connected to pipeline. Vault, topics and render queue loaded from disk.', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { logEndRef.current?.scrollIntoView({behavior: 'smooth'}); }, [logs]);

  // Poll active render jobs
  useEffect(() => {
    const active = renderJobs.some(j => j.status === 'running' || j.status === 'queued');
    if (!active) return;
    const t = setInterval(refreshRenders, 2000);
    return () => clearInterval(t);
  }, [renderJobs, refreshRenders]);

  // Poll active publish jobs
  useEffect(() => {
    const activeIds = publishJobs.map(p => p.id).filter(id => {
      const s = publishStatus[id]?.status;
      return s === 'running' || s === 'queued' || s === undefined;
    });
    if (!activeIds.length) return;
    const t = setInterval(async () => {
      for (const id of activeIds) {
        try {
          const d = await api<{job: RenderJob}>(`/api/publish?id=${id}`);
          setPublishStatus(prev => ({...prev, [id]: d.job}));
        } catch {}
      }
    }, 2500);
    return () => clearInterval(t);
  }, [publishJobs, publishStatus]);

  const selectedTopicObj = topics.find(t => t.slug === selectedTopic);

  const handleGenerateScript = async () => {
    if (!selectedTopic) return;
    setIsGeneratingScript(true); setBusyMsg('');
    addLog('make-script.mjs', `Generating script for "${selectedTopic}" (Gemini)...`, 'info');
    try {
      const d = await api<{scriptText: string; log: string}>('/api/script', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slug: selectedTopic}),
      });
      setScriptOutput(d.scriptText || '(script saved — no preview text returned)');
      addLog('make-script.mjs', `Script saved to scripts-out/${selectedTopic}.json`, 'success');
    } catch (e) {
      setBusyMsg(String(e instanceof Error ? e.message : e));
      addLog('make-script.mjs', `Failed: ${e}`, 'warning');
    }
    setIsGeneratingScript(false);
  };

  const handleGenerateVoice = async () => {
    if (!selectedTopic) return;
    setIsGeneratingVoice(true); setVoiceDone(false);
    addLog('make-voice.mjs', `Synthesizing voiceover for "${selectedTopic}"...`, 'info');
    try {
      await api('/api/voice', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slug: selectedTopic}),
      });
      setVoiceDone(true);
      addLog('make-voice.mjs', `Voiceover ready in public/audio/${selectedTopic}/`, 'success');
    } catch (e) {
      addLog('make-voice.mjs', `Failed: ${e}`, 'warning');
    }
    setIsGeneratingVoice(false);
  };

  const handleTriggerRender = async () => {
    if (!selectedTopic) return;
    addLog('render.mjs', `Starting render for "${selectedTopic}"...`, 'info');
    try {
      const d = await api<{job: RenderJob}>('/api/render', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slug: selectedTopic}),
      });
      setRenderJobs(prev => [d.job, ...prev]);
      setActiveTab('renders');
    } catch (e) { addLog('render.mjs', `Failed: ${e}`, 'warning'); }
  };

  const handlePublish = async () => {
    if (!publishSlug) { addLog('publisher', 'Select a video first.', 'warning'); return; }
    const chosen = Object.keys(platforms).filter(k => platforms[k]);
    if (!chosen.length) { addLog('publisher', 'Select at least one platform.', 'warning'); return; }
    try {
      const d = await api<{jobs: {id: string; platform: string}[]}>('/api/publish', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slug: publishSlug, platforms: chosen}),
      });
      setPublishJobs(prev => [...d.jobs, ...prev]);
      addLog('publisher', `Publish started for ${publishSlug} → ${chosen.join(', ')}`, 'info');
    } catch (e) { addLog('publisher', `Failed: ${e}`, 'warning'); }
  };

  const handleAddTopic = async () => {
    if (!newTopicInput.trim()) return;
    try {
      const d = await api<{slug: string}>('/api/topics', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: newTopicInput.trim()}),
      });
      setNewTopicInput('');
      await refreshTopics();
      setSelectedTopic(d.slug);
      addLog('topics', `Topic added: ${d.slug}`, 'success');
    } catch (e) { addLog('topics', `Failed: ${e}`, 'warning'); }
  };

  const handleSaveKey = async () => {
    if (!keyInput.trim()) return;
    setKeyBusy(true); setKeyMsg('');
    try {
      await api('/api/settings/keys', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({geminiKey: keyInput.trim()}),
      });
      setKeyInput('');
      setKeyMsg('Key saved on the server. Script generation is now enabled.');
      addLog('settings', 'Gemini API key saved server-side.', 'success');
      await refreshKeyStatus();
      const s = await api<PipelineStatus>('/api/status').catch(() => null);
      if (s) setStatus(s);
    } catch (e) { setKeyMsg(`Failed: ${e}`); }
    setKeyBusy(false);
  };

  const handleClearKey = async () => {
    setKeyBusy(true); setKeyMsg('');
    try {
      await api('/api/settings/keys', {method: 'DELETE'});
      setKeyMsg('Stored key cleared.');
      addLog('settings', 'Stored Gemini API key cleared.', 'info');
      await refreshKeyStatus();
      const s = await api<PipelineStatus>('/api/status').catch(() => null);
      if (s) setStatus(s);
    } catch (e) { setKeyMsg(`Failed: ${e}`); }
    setKeyBusy(false);
  };

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const nav = [
    {id: 'overview', label: '📊 Overview & Terminal', badge: null as number | string | null},
    {id: 'vault', label: '📦 Vault Manager', badge: vault.length || null},
    {id: 'generator', label: '🎬 Script & Voice AI', badge: null},
    {id: 'renders', label: '🎥 Remotion Queue', badge: renderJobs.filter(r => r.status === 'running' || r.status === 'queued').length || null},
    {id: 'publisher', label: '🚀 Multi-Publisher', badge: null},
    {id: 'calendar', label: '📅 Content Calendar', badge: calendar.length || null},
    {id: 'analytics', label: '📈 Analytics & Views', badge: null},
    {id: 'settings', label: '⚙️ Settings & Keys', badge: null},
  ];

  return (
    <div className="flex flex-col md:flex-row md:h-screen min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      {/* Mobile top bar + tab nav */}
      <div className="md:hidden sticky top-0 z-40">
        <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-amber-500 tracking-wide flex items-center gap-2"><span>🏛️</span> A Day Back Then</h1>
            <p className="text-[10px] text-slate-400">Content Operations Hub</p>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${status?.node ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} title="Pipeline link" />
        </header>
        <nav className="bg-slate-950/95 backdrop-blur border-b border-slate-800/80 px-2 py-2 flex gap-1.5 overflow-x-auto">
          {nav.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`shrink-0 px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all ${activeTab === item.id ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'text-slate-400 border-slate-800'}`}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <aside className="hidden md:flex w-64 border-r border-slate-800 bg-slate-900/60 p-4 flex-col justify-between shrink-0">
        <div>
          <div className="mb-6 px-2 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-amber-500 tracking-wide flex items-center gap-2"><span>🏛️</span> A Day Back Then</h1>
              <p className="text-[11px] text-slate-400">Content Operations Hub v2.4</p>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${status?.node ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} title="Pipeline link" />
          </div>
          <nav className="space-y-1">
            {nav.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === item.id ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'}`}>
                <span>{item.label}</span>
                {item.badge ? <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">{item.badge}</span> : null}
              </button>
            ))}
          </nav>
        </div>
        <div className="border-t border-slate-800/80 pt-3 px-2 text-[11px] text-slate-400 space-y-2">
          <div className="flex justify-between items-center"><span className="text-slate-500">Pipeline:</span><span className={`font-mono ${status?.remotionInstalled ? 'text-emerald-400' : 'text-amber-400'}`}>{status ? (status.remotionInstalled ? 'Ready' : 'Degraded') : '…'}</span></div>
          <div className="flex justify-between items-center"><span className="text-slate-500">ffmpeg:</span><span className="font-mono text-slate-300">{status ? (status.ffmpeg ? 'OK' : 'Missing') : '…'}</span></div>
          <div className="flex justify-between items-center"><span className="text-slate-500">Gemini key:</span><span className="font-mono text-slate-300">{status ? (status.geminiKey ? 'Set' : 'Not set') : '…'}</span></div>
        </div>
      </aside>

      <main className="flex-1 md:overflow-y-auto p-4 md:p-6 bg-slate-950 flex flex-col justify-between">
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Operations Control Center</h2>
                  <p className="text-xs text-slate-400">Live link to the pipeline at <code className="text-amber-400">{status?.pipelineRoot ?? '…'}</code></p>
                </div>
                <button onClick={() => setActiveTab('generator')} className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors"><IconSparkles /> Create New Short</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-medium">Rendered Videos</div>
                  <div className="text-2xl font-bold mt-1 text-slate-100">{vault.length} Videos</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"><IconCheck /> Read live from out/</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-medium">Active Render Jobs</div>
                  <div className="text-2xl font-bold mt-1 text-amber-400">{renderJobs.filter(r => r.status === 'running' || r.status === 'queued').length} Running</div>
                  <div className="text-[10px] text-slate-400 mt-1">1080x1920 @ 30 FPS</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-medium">Topics in Queue</div>
                  <div className="text-2xl font-bold mt-1 text-emerald-400">{topics.length} Topics</div>
                  <div className="text-[10px] text-slate-400 mt-1">From newtopics.json</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-medium">Upload Auth</div>
                  <div className="text-2xl font-bold mt-1 text-indigo-400">{[status?.youtubeAuth, status?.facebookAuth, status?.tiktokSession].filter(Boolean).length} / 3</div>
                  <div className="text-[10px] text-slate-400 mt-1">YT · FB · TikTok</div>
                </div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>Render Jobs</h3>
                  <button onClick={() => setActiveTab('renders')} className="text-xs text-amber-400 hover:underline">View Queue →</button>
                </div>
                {renderJobs.length === 0 && <p className="text-xs text-slate-500">No render jobs yet. Queue one from the generator tab.</p>}
                {renderJobs.slice(0, 3).map(job => (
                  <div key={job.id} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs"><span className="font-medium text-slate-200">{job.slug}.mp4</span><span className="text-amber-400 font-mono text-[11px]">{job.status}</span></div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-500" style={{width: `${job.progress}%`}} /></div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono"><span>Frame {job.frame} / {job.totalFrames || '…'}</span><span>{job.progress}%</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">Vault Manager</h2><p className="text-xs text-slate-400">Live contents of <code className="text-amber-400">out/</code></p></div>
                <button onClick={refreshVault} className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"><IconRefresh /> Rescan</button>
              </div>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/80 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 min-w-[640px]">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr><th className="p-3.5">Video</th><th className="p-3.5">Format</th><th className="p-3.5">Duration</th><th className="p-3.5">Size</th><th className="p-3.5">Rendered</th><th className="p-3.5 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {vault.map(v => (
                      <tr key={v.slug} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-semibold text-slate-100">{v.slug}.mp4</td>
                        <td className="p-3.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.type === 'Short' ? 'bg-purple-950 text-purple-300 border border-purple-800/50' : 'bg-blue-950 text-blue-300 border border-blue-800/50'}`}>{v.type}</span></td>
                        <td className="p-3.5">{v.duration}</td>
                        <td className="p-3.5">{v.sizeMB} MB</td>
                        <td className="p-3.5">{v.dateAdded}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button onClick={() => setPreviewSlug(v.slug)} className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md">Preview</button>
                          <button onClick={() => {setPublishSlug(v.slug); setActiveTab('publisher');}} className="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-md">Publish</button>
                        </td>
                      </tr>
                    ))}
                    {vault.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No rendered videos found in out/.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'generator' && (
            <div className="space-y-6 max-w-4xl">
              <div><h2 className="text-xl font-bold">AI Script & Voiceover Generator</h2><p className="text-xs text-slate-400">Runs the real <code className="text-amber-400">make-script.mjs</code> and <code className="text-amber-400">make-voice.mjs</code></p></div>
              {!status?.geminiKey && <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">No Gemini API key yet — add one in <button onClick={() => setActiveTab('settings')} className="underline font-semibold">Settings → API Keys</button> to enable script generation. Voiceover (edge-tts) works without it.</div>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. Topics ({topics.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {topics.map(t => (
                      <button key={t.slug} onClick={() => {setSelectedTopic(t.slug); setScriptOutput(''); setVoiceDone(false);}}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${selectedTopic === t.slug ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.slug}</div>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex gap-2">
                      <input type="text" placeholder="New topic title…" value={newTopicInput} onChange={e => setNewTopicInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                      <button onClick={handleAddTopic} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg">Add</button>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-200">Pipeline for: <span className="text-amber-400 font-mono">{selectedTopic || '—'}</span></h3>
                  {busyMsg && <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300 font-mono">{busyMsg}</div>}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleGenerateScript} disabled={isGeneratingScript || !selectedTopic} className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50"><IconSparkles />{isGeneratingScript ? 'Running make-script.mjs…' : '1. Generate Script'}</button>
                    <button onClick={handleGenerateVoice} disabled={isGeneratingVoice || !selectedTopic} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50"><IconVolume />{isGeneratingVoice ? 'Synthesizing…' : '2. Generate Voiceover'}</button>
                  </div>
                  {scriptOutput && (
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-400">Generated script (scripts-out/{selectedTopic}.json)</label>
                        {voiceDone && <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1"><IconCheck /> Voiceover ready</span>}
                      </div>
                      <textarea rows={10} readOnly value={scriptOutput} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 leading-relaxed" />
                      <button onClick={handleTriggerRender} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"><IconPlay /> 3. Queue Render (render.mjs)</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'renders' && (
            <div className="space-y-4">
              <div><h2 className="text-xl font-bold">Render Queue</h2><p className="text-xs text-slate-400">Real Remotion jobs spawned by the dashboard server</p></div>
              {renderJobs.length === 0 && <p className="text-xs text-slate-500">No jobs yet. Queue a render from the generator tab.</p>}
              {renderJobs.map(job => (
                <div key={job.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div><div className="font-bold text-sm text-slate-100">🎬 {job.slug}.mp4</div><div className="text-[11px] text-slate-400 font-mono">{job.id}</div></div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${job.status === 'running' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : job.status === 'done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : job.status === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-400'}`}>{job.status}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800"><div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300" style={{width: `${job.progress}%`}} /></div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono"><span>Frame {job.frame} / {job.totalFrames || '…'}</span><span>{job.progress}%</span></div>
                  {job.error && <div className="text-[11px] text-red-400 font-mono">{job.error}</div>}
                  {job.log.length > 0 && <details className="text-[11px] font-mono text-slate-400"><summary className="cursor-pointer text-slate-500">Build log ({job.log.length} lines)</summary><div className="mt-2 p-2 bg-slate-950 rounded border border-slate-800 max-h-40 overflow-y-auto whitespace-pre-wrap">{job.log.slice(-30).join('\n')}</div></details>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'publisher' && (
            <div className="space-y-6 max-w-3xl">
              <div><h2 className="text-xl font-bold">Multi-Platform Publisher</h2><p className="text-xs text-slate-400">Runs the real upload scripts. Each platform needs its auth set up on this machine.</p></div>
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Video</label>
                  <select value={publishSlug} onChange={e => setPublishSlug(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 font-mono">
                    <option value="">— select a rendered video —</option>
                    {vault.map(v => <option key={v.slug} value={v.slug}>{v.slug}.mp4 ({v.duration})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Platforms</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      {id: 'youtube', name: 'YouTube Shorts', ok: status?.youtubeAuth, hint: 'youtube-tokens.json'},
                      {id: 'facebook', name: 'Facebook Reels', ok: status?.facebookAuth, hint: 'facebook-tokens.json'},
                      {id: 'tiktok', name: 'TikTok', ok: status?.tiktokSession, hint: '.tiktok-session/'},
                      {id: 'instagram', name: 'Instagram Reels', ok: status?.facebookAuth, hint: 'via FB page'},
                    ] as const).map(p => (
                      <label key={p.id} className="flex items-start space-x-3 bg-slate-950 p-3 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                        <input type="checkbox" checked={!!platforms[p.id]} onChange={e => setPlatforms(prev => ({...prev, [p.id]: e.target.checked}))} className="mt-0.5 accent-amber-500 rounded" />
                        <div><div className="text-xs font-semibold text-slate-200">{p.name}</div><div className={`text-[10px] font-medium mt-0.5 ${p.ok ? 'text-emerald-400' : 'text-amber-400'}`}>{p.ok ? 'Auth present' : `Missing: ${p.hint}`}</div></div>
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={handlePublish} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2"><IconUpload /> Publish to Selected Platforms</button>
                {publishJobs.length > 0 && (
                  <div className="space-y-2">
                    {publishJobs.map(pj => {
                      const st = publishStatus[pj.id];
                      return (
                        <div key={pj.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                          <div className="flex justify-between"><span className="font-mono text-slate-200">{pj.platform} → {publishJobs.find(x => x.id === pj.id) && ''}{pj.id.slice(0, 24)}…</span><span className={`font-mono ${st?.status === 'done' ? 'text-emerald-400' : st?.status === 'failed' ? 'text-red-400' : 'text-amber-400'}`}>{st?.status ?? 'starting…'}</span></div>
                          {st?.error && <div className="text-red-400 font-mono text-[11px] mt-1">{st.error}</div>}
                          {st && st.log.length > 0 && <div className="mt-2 text-[11px] font-mono text-slate-400 max-h-24 overflow-y-auto whitespace-pre-wrap">{st.log.slice(-8).join('\n')}</div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div><h2 className="text-xl font-bold">Content Calendar</h2><p className="text-xs text-slate-400">Plan posts; publishing runs through the publisher tab.</p></div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                <div className="hidden md:grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 border-b border-slate-800 pb-2"><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div></div>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mt-2">
                  {Array.from({length: 14}).map((_, i) => {
                    const d = new Date(); d.setDate(d.getDate() + (i - d.getDay() + 1));
                    const dateStr = d.toISOString().slice(0, 10);
                    const dayEvents = calendar.filter(c => c.date === dateStr);
                    return (
                      <div key={i} className="min-h-[100px] bg-slate-950 border border-slate-800/80 rounded-lg p-2">
                        <div className="text-[10px] font-bold text-slate-500">{d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
                        <div className="space-y-1 mt-1">
                          {dayEvents.map(e => (
                            <div key={e.id} className="p-1 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] text-amber-300">
                              <div className="truncate font-bold">{e.platform}</div>
                              <div className="truncate text-[9px] text-slate-300">{e.title}</div>
                            </div>
                          ))}
                        </div>
                        <select value="" onChange={e => {
                          if (!e.target.value) return;
                          const v = vault.find(x => x.slug === e.target.value)!;
                          setCalendar(prev => [...prev, {id: `${Date.now()}`, date: dateStr, slug: v.slug, title: v.title, platform: 'YouTube Shorts'}]);
                        }} className="mt-1 w-full text-[9px] bg-slate-900 border border-slate-800 rounded text-slate-400">
                          <option value="">+ schedule</option>
                          {vault.map(v => <option key={v.slug} value={v.slug}>{v.slug}</option>)}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-2xl">
              <div><h2 className="text-xl font-bold">Analytics</h2><p className="text-xs text-slate-400">Per-platform stats live here once connected.</p></div>
              <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-xl text-center space-y-3">
                <div className="text-3xl">📈</div>
                <p className="text-sm text-slate-300 font-semibold">Not connected yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">Analytics reads from the YouTube Data API with the same OAuth tokens the publisher uses. Add <code className="text-amber-400">youtube-tokens.json</code> via <code className="text-amber-400">npm run upload:auth</code>, then this tab will show real views and retention.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div><h2 className="text-xl font-bold">Settings</h2><p className="text-xs text-slate-400">Live pipeline status on this machine.</p></div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">🔑 API Keys</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Keys are stored on the dashboard server (file mode 600, never committed) and used for script generation. The browser never sees the saved value.</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-200">Gemini API key</span>
                    <span className={`text-[11px] font-mono ${keyStatus?.geminiKeySet ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {keyStatus ? (keyStatus.geminiKeySet ? `Set (${keyStatus.geminiKeySource === 'env' ? 'server env' : 'saved here'})` : 'Not set') : '…'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
                      placeholder="Paste Gemini API key…" autoComplete="off"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500" />
                    <button onClick={handleSaveKey} disabled={keyBusy || !keyInput.trim()} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg">Save</button>
                    {keyStatus?.geminiKeySet && keyStatus.geminiKeySource === 'stored' && (
                      <button onClick={handleClearKey} disabled={keyBusy} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg">Clear</button>
                    )}
                  </div>
                  {keyMsg && <p className="text-[11px] text-slate-400">{keyMsg}</p>}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 text-xs">
                <h3 className="text-sm font-bold text-slate-200">🖥️ Pipeline Status</h3>
                {[
                  ['Pipeline root', status?.pipelineRoot ?? '…', true],
                  ['Node.js', status?.node ? 'Available' : 'Missing', status?.node],
                  ['ffmpeg', status?.ffmpeg ? 'Available' : 'Missing', status?.ffmpeg],
                  ['Remotion installed', status?.remotionInstalled ? 'Yes' : 'No — run npm install in repo root', status?.remotionInstalled],
                  ['YouTube auth', status?.youtubeAuth ? 'youtube-tokens.json present' : 'Missing — run npm run upload:auth', status?.youtubeAuth],
                  ['Facebook auth', status?.facebookAuth ? 'facebook-tokens.json present' : 'Missing', status?.facebookAuth],
                  ['TikTok session', status?.tiktokSession ? '.tiktok-session/ present' : 'Missing', status?.tiktokSession],
                ].map(([label, value, ok]) => (
                  <div key={label as string} className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-200">{label}</span>
                    <span className={`font-mono ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>{value}</span>
                  </div>
                ))}
                <p className="text-[11px] text-slate-500 pt-2">OAuth tokens and Playwright sessions live as files on the server (see README) — they can't be pasted here. The Gemini key above is the one secret you can set from the app.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-4 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono"><IconTerminal /> Pipeline Log</span>
            <button onClick={() => setLogs([])} className="text-[10px] text-slate-500 hover:text-slate-300">Clear</button>
          </div>
          <div className="h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-[11px] space-y-1">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-slate-600 shrink-0">[{log.time}]</span>
                <span className="text-amber-500 font-semibold shrink-0">[{log.script}]</span>
                <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-300' : 'text-slate-300'}>{log.msg}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </main>

      {previewSlug && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setPreviewSlug(null)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-100 font-mono">{previewSlug}.mp4</h3>
              <button onClick={() => setPreviewSlug(null)} className="text-slate-400 hover:text-slate-200 text-sm font-bold">✕</button>
            </div>
            <video src={`/api/video/${previewSlug}`} controls className="w-full aspect-[9/16] max-h-[60vh] rounded-xl bg-black" />
            <button onClick={() => {setPublishSlug(previewSlug); setPreviewSlug(null); setActiveTab('publisher');}} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg">Publish This Video</button>
          </div>
        </div>
      )}
    </div>
  );
}
