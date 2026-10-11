'use client';

import React, {useState, useEffect, useRef, useCallback} from 'react';

// --- Icons (inline SVG, zero external dependencies) ---
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
const IconGlobe = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);
const IconPhone = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);
const IconCopy = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
  </svg>
);
const IconImage = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// --- Types ---
type VaultVideo = {
  slug: string;
  title: string;
  duration: string;
  durationSec: number;
  sizeMB: number;
  dateAdded: string;
  type: string;
  aspectRatio: string;
  relPath: string;
};

type TopicItem = {
  slug: string;
  title: string;
  format?: string;
  angle?: string;
  category: "original-short" | "expansion-short" | "longform";
  targetMinutes?: number;
  imagesReady: number;
  imagesTarget: number;
  imageStatus: "complete" | "partial" | "waiting";
  hasPrompt: boolean;
  hasScript: boolean;
  hasVoice: boolean;
  hasVideo: boolean;
};

type RenderJob = {
  id: string;
  kind: string;
  slug: string;
  status: string;
  progress: number;
  frame: number;
  totalFrames: number;
  log: string[];
  startedAt: number;
  finishedAt?: number;
  error?: string;
};

type TunnelInfo = {
  status: "stopped" | "starting" | "running" | "error";
  url: string | null;
  error: string | null;
  localUrl: string;
  localhostUrl: string;
  localIp: string;
};

type TopicDetails = {
  slug: string;
  isLong: boolean;
  imagesCount: number;
  images: {name: string; url: string; sizeKB: number}[];
  promptText: string;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export default function DashboardApp() {
  const [activeTab, setActiveTab] = useState<'overview' | 'muse' | 'npc' | 'vault' | 'generator' | 'renders' | 'publisher' | 'remote' | 'settings'>('overview');
  const [vault, setVault] = useState<VaultVideo[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [topicStats, setTopicStats] = useState<any>(null);
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const [tunnel, setTunnel] = useState<TunnelInfo | null>(null);
  const [tunnelBusy, setTunnelBusy] = useState(false);
  const [logs, setLogs] = useState<{id: number; time: string; script: string; msg: string; type: string}[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Filters & selection
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'original-short' | 'expansion-short' | 'longform'>('all');
  const [artFilter, setArtFilter] = useState<'all' | 'complete' | 'partial' | 'waiting'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [topicDetails, setTopicDetails] = useState<TopicDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Script & voice state
  const [scriptOutput, setScriptOutput] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceDone, setVoiceDone] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [busyMsg, setBusyMsg] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  // Video preview modal
  const [previewVideo, setPreviewVideo] = useState<VaultVideo | null>(null);

  // Publisher state
  const [publishSlug, setPublishSlug] = useState('');
  const [platforms, setPlatforms] = useState<Record<string, boolean>>({youtube: true, facebook: true, tiktok: true, instagram: true});
  const [publishJobs, setPublishJobs] = useState<{id: string; platform: string}[]>([]);
  const [publishStatus, setPublishStatus] = useState<Record<string, RenderJob>>({});

  // Settings
  const [keyInput, setKeyInput] = useState('');
  const [keyStatus, setKeyStatus] = useState<{geminiKeySet: boolean; geminiKeySource: string | null} | null>(null);
  const [keyMsg, setKeyMsg] = useState('');
  const [keyBusy, setKeyBusy] = useState(false);

  // NPC status
  const [npcInfo, setNpcInfo] = useState<any>(null);

  const addLog = useCallback((script: string, msg: string, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-199), {id: Date.now() + Math.random(), time, script, msg, type}]);
  }, []);

  const refreshVault = useCallback(async () => {
    try {
      const d = await api<{videos: VaultVideo[]}>('/api/vault');
      setVault(d.videos);
    } catch (e) {
      addLog('vault', String(e), 'warning');
    }
  }, [addLog]);

  const refreshTopics = useCallback(async () => {
    try {
      const d = await api<{topics: TopicItem[]; stats: any}>('/api/topics');
      setTopics(d.topics);
      setTopicStats(d.stats);
      if (!selectedTopic && d.topics.length) {
        setSelectedTopic(d.topics[0].slug);
      }
    } catch (e) {
      addLog('topics', String(e), 'warning');
    }
  }, [addLog, selectedTopic]);

  const refreshRenders = useCallback(async () => {
    try {
      const d = await api<{jobs: RenderJob[]}>('/api/render');
      setRenderJobs(d.jobs);
      return d.jobs;
    } catch {
      return [];
    }
  }, []);

  const refreshTunnel = useCallback(async () => {
    try {
      const d = await api<TunnelInfo>('/api/remote');
      setTunnel(d);
    } catch {}
  }, []);

  const refreshNpc = useCallback(async () => {
    try {
      const d = await api<any>('/api/npc');
      setNpcInfo(d);
    } catch {}
  }, []);

  const loadTopicDetails = useCallback(async (slug: string) => {
    if (!slug) return;
    setLoadingDetails(true);
    try {
      const d = await api<TopicDetails>(`/api/images?slug=${encodeURIComponent(slug)}`);
      setTopicDetails(d);
    } catch (e) {
      addLog('images', `Failed loading assets for ${slug}: ${e}`, 'warning');
    }
    setLoadingDetails(false);
  }, [addLog]);

  useEffect(() => {
    refreshVault();
    refreshTopics();
    refreshRenders();
    refreshTunnel();
    refreshNpc();
    api<{geminiKeySet: boolean; geminiKeySource: string | null}>('/api/settings/keys')
      .then(setKeyStatus)
      .catch(() => {});
    addLog('dashboard', '🚀 Local & Remote Hub Online. Auto-scanned topics, vault & tunnel state.', 'success');
  }, [refreshVault, refreshTopics, refreshRenders, refreshTunnel, refreshNpc, addLog]);

  useEffect(() => {
    if (selectedTopic) {
      loadTopicDetails(selectedTopic);
    }
  }, [selectedTopic, loadTopicDetails]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [logs]);

  // Poll render jobs
  useEffect(() => {
    const active = renderJobs.some(j => j.status === 'running' || j.status === 'queued');
    if (!active) return;
    const t = setInterval(refreshRenders, 2000);
    return () => clearInterval(t);
  }, [renderJobs, refreshRenders]);

  // Toggle Cloudflare Tunnel
  const handleToggleTunnel = async () => {
    setTunnelBusy(true);
    try {
      const action = tunnel?.status === 'running' ? 'stop' : 'start';
      addLog('tunnel', action === 'start' ? 'Connecting secure Cloudflare Tunnel for phone access…' : 'Stopping tunnel…', 'info');
      const res = await api<TunnelInfo>('/api/remote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action}),
      });
      setTunnel(res);
      if (res.status === 'running' && res.url) {
        addLog('tunnel', `✅ Public Phone Access Live: ${res.url}`, 'success');
      } else if (res.status === 'stopped') {
        addLog('tunnel', 'Tunnel offline.', 'info');
      }
    } catch (e) {
      addLog('tunnel', `Tunnel error: ${e}`, 'warning');
    }
    setTunnelBusy(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(''), 2500);
  };

  // Trigger Render for short / long
  const handleTriggerRender = async (slug: string, kind: 'short' | 'long' = 'short') => {
    addLog('render', `Queuing ${kind} render for "${slug}"…`, 'info');
    try {
      const d = await api<{job: RenderJob}>('/api/render', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slug, kind}),
      });
      setRenderJobs(prev => [d.job, ...prev]);
      setActiveTab('renders');
      addLog('render', `Job started: ${d.job.id}`, 'success');
    } catch (e) {
      addLog('render', `Render failed: ${e}`, 'warning');
    }
  };

  // Trigger process images & re-render
  const handleProcessImages = async (slug?: string) => {
    addLog('processor', `Linking Muse AI images & batch rendering ${slug ? slug : 'all ready topics'}…`, 'info');
    try {
      const d = await api<{job: RenderJob}>('/api/images', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({slug}),
      });
      setRenderJobs(prev => [d.job, ...prev]);
      setActiveTab('renders');
      addLog('processor', `Process job started: ${d.job.id}`, 'success');
    } catch (e) {
      addLog('processor', `Failed: ${e}`, 'warning');
    }
  };

  // Filter topics
  const filteredTopics = topics.filter(t => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (artFilter !== 'all' && t.imageStatus !== artFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedTopicObj = topics.find(t => t.slug === selectedTopic);

  const nav = [
    {id: 'overview', label: '📊 Dashboard', icon: '📊', badge: null},
    {id: 'muse', label: '🎨 Muse AI Tracker', icon: '🎨', badge: topicStats ? `${topicStats.imagesComplete}/${topicStats.total}` : null},
    {id: 'npc', label: '🎭 NPCs & Dialogue', icon: '🎭', badge: 'NEW'},
    {id: 'vault', label: '📦 Vault Library', icon: '📦', badge: vault.length || null},
    {id: 'generator', label: '⚡ Pipeline Studio', icon: '⚡', badge: null},
    {id: 'renders', label: '🎥 Render Queue', icon: '🎥', badge: renderJobs.filter(r => r.status === 'running' || r.status === 'queued').length || null},
    {id: 'publisher', label: '🚀 Publisher', icon: '🚀', badge: null},
    {id: 'remote', label: '📱 Phone Remote', icon: '📱', badge: tunnel?.status === 'running' ? 'LIVE' : null},
    {id: 'settings', label: '⚙️ Settings', icon: '⚙️', badge: null},
  ];

  return (
    <div className="flex flex-col md:flex-row md:h-screen min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <header className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <div>
              <h1 className="text-sm font-bold text-amber-500 tracking-wide">A Day Back Then</h1>
              <p className="text-[10px] text-slate-400">Mobile Remote Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tunnel?.status === 'running' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Phone LIVE
              </span>
            )}
            <button
              onClick={() => setActiveTab('remote')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
              title="Remote Access"
            >
              <IconPhone />
            </button>
          </div>
        </header>

        {/* Mobile Horizontal Navigation */}
        <nav className="px-2 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/60 bg-slate-950/80">
          {nav.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`shrink-0 px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all flex items-center gap-1.5 ${
                activeTab === item.id
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label.replace(/^.*? /, '')}</span>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  item.badge === 'LIVE' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-800 bg-slate-900/60 p-4 flex-col justify-between shrink-0">
        <div>
          <div className="mb-6 px-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <div>
                <h1 className="text-base font-bold text-amber-500 tracking-wide">A Day Back Then</h1>
                <p className="text-[11px] text-slate-400">Content Operations Hub v3.0</p>
              </div>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${tunnel?.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
              title={tunnel?.status === 'running' ? 'Remote tunnel active' : 'Local PC mode'}
            />
          </div>

          {/* Quick Remote Banner */}
          <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-indigo-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><IconPhone /> Remote Phone Link</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${tunnel?.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {tunnel?.status === 'running' ? 'Active' : 'Offline'}
              </span>
            </div>
            {tunnel?.status === 'running' && tunnel.url ? (
              <div className="mt-2 space-y-1.5">
                <input
                  readOnly
                  value={tunnel.url}
                  className="w-full text-[10px] bg-slate-950/80 border border-emerald-500/30 rounded px-2 py-1 font-mono text-emerald-300 select-all"
                />
                <button
                  onClick={() => copyToClipboard(tunnel.url!, 'Remote URL copied!')}
                  className="w-full text-[10px] py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <IconCopy /> {copyFeedback || 'Copy Phone URL'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleToggleTunnel}
                disabled={tunnelBusy}
                className="mt-2 w-full text-[11px] py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <IconGlobe /> {tunnelBusy ? 'Starting…' : 'Enable Mobile Access'}
              </button>
            )}
          </div>

          <nav className="space-y-1">
            {nav.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.badge === 'LIVE' || item.badge === 'NEW'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-3 px-2 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Local Wi-Fi:</span>
            <span className="font-mono text-slate-300 text-[10px]">{tunnel?.localIp ? `${tunnel.localIp}:3100` : '...'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Muse AI Art:</span>
            <span className="font-mono text-emerald-400">{topicStats ? `${topicStats.imagesComplete} ready` : '…'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Pipeline Jobs:</span>
            <span className="font-mono text-amber-400">{renderJobs.filter(r => r.status === 'running').length} active</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 md:overflow-y-auto p-4 md:p-6 bg-slate-950 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span>🏛️</span> Pipeline Operations Control Center
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live automation hub for YouTube Shorts & Longform videos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('muse')}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <IconImage /> Muse AI Tracker
                  </button>
                  <button
                    onClick={() => setActiveTab('generator')}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <IconSparkles /> Studio
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-medium">Total Topics</div>
                  <div className="text-2xl font-bold mt-1 text-slate-100">{topics.length}</div>
                  <div className="text-[10px] text-amber-400 mt-1">160 Shorts · 33 Longform</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-medium">Muse AI Images</div>
                  <div className="text-2xl font-bold mt-1 text-emerald-400">
                    {topicStats ? topicStats.imagesComplete : 0} <span className="text-sm font-normal text-slate-400">Done</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {topicStats ? topicStats.imagesWaiting : 0} waiting for generation
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-medium">Rendered Vault</div>
                  <div className="text-2xl font-bold mt-1 text-slate-100">{vault.length} Videos</div>
                  <div className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1">
                    <IconCheck /> Published & Unpublished
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400 font-medium">Phone Remote</div>
                  <div className="text-2xl font-bold mt-1 text-amber-400">
                    {tunnel?.status === 'running' ? 'Connected' : 'Local Only'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {tunnel?.status === 'running' ? 'Worldwide mobile access' : 'Tap Phone Remote to enable'}
                  </div>
                </div>
              </div>

              {/* What's New Feature Highlight */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-500/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    ✨ Newly Added Pipeline Features
                  </span>
                  <button onClick={() => setActiveTab('npc')} className="text-xs text-amber-400 hover:underline">
                    Test Dialogue & NPCs →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <IconUsers /> Interactive Secondary NPCs
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Procedural secondary characters with comic speech bubbles, sweat animations, and position presets to banish empty scenes.
                    </p>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <IconVolume /> Gladiator Barracks Soundscapes
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Multi-layered ambient audio and verified lipsync locking (narrator mouth locks to 0 while NPCs talk).
                    </p>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <IconPhone /> Worldwide Mobile Remote Access
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cloudflare Tunnel integration allows managing your pipeline, monitoring Muse AI, and triggering renders directly on your phone away from home.
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Jobs Preview */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Active Pipeline Render Jobs
                  </h3>
                  <button onClick={() => setActiveTab('renders')} className="text-xs text-amber-400 hover:underline">
                    View Queue ({renderJobs.length}) →
                  </button>
                </div>
                {renderJobs.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No jobs currently rendering.</p>
                ) : (
                  renderJobs.slice(0, 3).map(job => (
                    <div key={job.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-200">🎬 {job.slug} ({job.kind})</span>
                        <span className="text-amber-400 font-mono text-[11px] font-bold">{job.status}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300" style={{width: `${job.progress}%`}} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>Frame {job.frame} / {job.totalFrames || '…'}</span>
                        <span>{job.progress}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MUSE AI TRACKER & ASSET INSPECTOR */}
          {activeTab === 'muse' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>🎨</span> Muse AI Image Asset Tracker
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track generated background images in <code className="text-amber-400">public/images/&lt;slug&gt;/</code> and copy prompts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleProcessImages()}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <IconSparkles /> Attach All Ready Art & Render
                  </button>
                  <button
                    onClick={refreshTopics}
                    className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
                  >
                    <IconRefresh />
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <input
                  type="text"
                  placeholder="Search topics by name or slug…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 min-w-[200px]"
                />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                >
                  <option value="all">All Formats ({topics.length})</option>
                  <option value="original-short">Original Shorts (68)</option>
                  <option value="expansion-short">Expansion Shorts (92)</option>
                  <option value="longform">Longform Episodes (33)</option>
                </select>
                <select
                  value={artFilter}
                  onChange={e => setArtFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                >
                  <option value="all">All Art Statuses</option>
                  <option value="complete">🟢 Ready (Complete)</option>
                  <option value="partial">🟡 In Progress (Partial)</option>
                  <option value="waiting">⚪ Waiting for Muse AI</option>
                </select>
                <span className="text-[11px] text-slate-500 font-mono ml-auto">
                  Showing {filteredTopics.length} of {topics.length} topics
                </span>
              </div>

              {/* Two Column Layout: Topics List & Asset Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Topic list column */}
                <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-3 max-h-[650px] overflow-y-auto space-y-1.5">
                  {filteredTopics.map(t => {
                    const isSelected = selectedTopic === t.slug;
                    return (
                      <button
                        key={t.slug}
                        onClick={() => setSelectedTopic(t.slug)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                            : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-slate-100">{t.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono shrink-0 ${
                            t.imageStatus === 'complete'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : t.imageStatus === 'partial'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {t.imagesReady}/{t.imagesTarget} Art
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span className="text-slate-500">{t.slug}</span>
                          <span>•</span>
                          <span className="capitalize">{t.category.replace('-', ' ')}</span>
                          {t.hasVideo && <span className="text-emerald-400">✓ Rendered</span>}
                        </div>
                      </button>
                    );
                  })}
                  {filteredTopics.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-xs">No topics matched your search filter.</div>
                  )}
                </div>

                {/* Topic Asset & Prompt Inspector */}
                <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                  {selectedTopicObj ? (
                    <>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="font-bold text-base text-slate-100">{selectedTopicObj.title}</h3>
                          <p className="text-[11px] text-amber-400 font-mono mt-0.5">{selectedTopicObj.slug}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTriggerRender(selectedTopicObj.slug, selectedTopicObj.category === 'longform' ? 'long' : 'short')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <IconPlay /> Render Video
                          </button>
                          <button
                            onClick={() => handleProcessImages(selectedTopicObj.slug)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <IconCheck /> Attach Art
                          </button>
                        </div>
                      </div>

                      {/* Images Ready Status */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-300">Generated Images Progress</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {topicDetails ? topicDetails.imagesCount : 0} of {selectedTopicObj.imagesTarget} Ready
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, Math.round(((topicDetails?.imagesCount || 0) / selectedTopicObj.imagesTarget) * 100))}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Image Thumbnails Gallery */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Image Files in public/images/{selectedTopicObj.slug}/
                        </h4>
                        {topicDetails && topicDetails.images.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {topicDetails.images.map(img => (
                              <div key={img.name} className="group relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-1">
                                <img
                                  src={img.url}
                                  alt={img.name}
                                  className="w-full aspect-[9/16] object-cover rounded bg-black"
                                  loading="lazy"
                                />
                                <div className="text-[10px] text-center font-mono text-slate-400 mt-1 truncate">
                                  {img.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs space-y-1">
                            <div>No images generated yet for this topic.</div>
                            <div className="text-[11px] text-slate-600">
                              Generate with Muse AI using the prompt below and drop into <code>public/images/{selectedTopicObj.slug}/1.png..6.png</code>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Muse AI Prompt Box */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span>📋</span> Muse AI Prompts
                          </label>
                          {topicDetails?.promptText && (
                            <button
                              onClick={() => copyToClipboard(topicDetails.promptText, 'Prompt copied to clipboard!')}
                              className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded flex items-center gap-1 transition-colors"
                            >
                              <IconCopy /> {copyFeedback || 'Copy All Prompts'}
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={6}
                          readOnly
                          value={topicDetails?.promptText || (loadingDetails ? 'Loading prompt text…' : 'No prompt text found for this topic.')}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 leading-relaxed select-all"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="p-12 text-center text-slate-500 text-xs">
                      Select a topic on the left to inspect its images and prompts.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NPC & MINI-DIALOGUE STUDIO */}
          {activeTab === 'npc' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>🎭</span> Interactive Characters & Mini-Dialogue Studio
                </h2>
                <p className="text-xs text-slate-400">
                  Preview procedural secondary characters, mini-dialogues, and gladiator barracks soundscapes
                </p>
              </div>

              {/* Dialogue Video Preview Card */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <span>🎬</span> Verified Scene: Marcus & Cassius Mini-Dialogue
                    </h3>
                    <p className="text-[11px] text-slate-400">18 seconds · 1080x1920 Full HD · Dialogue Test Clip</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Lipsync & Grounding Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="relative aspect-[9/16] max-h-[420px] mx-auto bg-black rounded-xl overflow-hidden border border-slate-800 shadow-xl">
                    <video
                      src="/api/video/sample-dialogue-npc"
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-amber-400 text-xs">Character Roster & Behavior</div>
                      <div className="space-y-1.5 text-[11px] text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300">Narrator (Marcus):</span>
                          <span className="text-slate-400">Gold Badge · Center-Left · Host</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300">Volunteer NPC (Cassius):</span>
                          <span className="text-slate-400">Cyan Badge · Right Bench · Nervous Sweat</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-emerald-400 text-xs">Bug Fixes & Engine Upgrades</div>
                      <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                        <li><strong>Mouth Lock:</strong> Narrator mouth remains strictly closed when NPC speaks.</li>
                        <li><strong>Grounding:</strong> Removed sequence scale pops for permanent room presence.</li>
                        <li><strong>Ambience:</strong> Gladiator barracks reverb & crowd chatter mixed in background.</li>
                        <li><strong>Subtitles:</strong> Dynamic color switching (gold for Marcus, cyan for Cassius).</li>
                      </ul>
                    </div>

                    <button
                      onClick={async () => {
                        addLog('remotion', 'Re-rendering DialogueScene to sample-dialogue-npc.mp4…', 'info');
                        try {
                          const res = await api<any>('/api/npc', {method: 'POST'});
                          if (res.ok) {
                            addLog('remotion', '✅ Dialogue scene re-rendered successfully!', 'success');
                            refreshVault();
                          } else {
                            addLog('remotion', `Render issue: ${res.stderr || res.stdout}`, 'warning');
                          }
                        } catch (e) {
                          addLog('remotion', `Error: ${e}`, 'warning');
                        }
                      }}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <IconPlay /> Re-Render Dialogue Test Scene
                    </button>
                  </div>
                </div>
              </div>

              {/* Longform Episodes Outline */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <span>📜</span> Longform Documentary Episodes Ready for NPC Integration (33 Episodes)
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">10-15 Min Formats</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                  {topics.filter(t => t.category === 'longform').map(t => (
                    <div key={t.slug} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-slate-200">{t.title}</span>
                        <span className="text-[10px] text-amber-400 font-mono shrink-0">{t.targetMinutes}m</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{t.angle}</p>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-850 text-[10px]">
                        <span className="text-slate-500 font-mono">{t.slug}</span>
                        <button
                          onClick={() => handleTriggerRender(t.slug, 'long')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded text-[10px]"
                        >
                          Render Longform →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VAULT MANAGER */}
          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>📦</span> Vault Video Library
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live scan of all rendered MP4s across <code className="text-amber-400">out/</code> and longform directories
                  </p>
                </div>
                <button
                  onClick={refreshVault}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <IconRefresh /> Rescan Files
                </button>
              </div>

              {/* Video table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/80 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 min-w-[680px]">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Video File</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Ratio</th>
                      <th className="p-3.5">Duration</th>
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Created</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {vault.map(v => (
                      <tr key={v.relPath} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-semibold text-slate-100 font-sans">
                          {v.slug}.mp4
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.type.includes('Published')
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                              : v.type.includes('Dialogue')
                              ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                              : v.type.includes('Longform')
                              ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                              : 'bg-purple-950 text-purple-300 border border-purple-800/50'
                          }`}>
                            {v.type}
                          </span>
                        </td>
                        <td className="p-3.5">{v.aspectRatio}</td>
                        <td className="p-3.5">{v.duration}</td>
                        <td className="p-3.5">{v.sizeMB} MB</td>
                        <td className="p-3.5">{v.dateAdded}</td>
                        <td className="p-3.5 text-right space-x-2 font-sans">
                          <button
                            onClick={() => setPreviewVideo(v)}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md"
                          >
                            Play
                          </button>
                          <button
                            onClick={() => {
                              setPublishSlug(v.slug);
                              setActiveTab('publisher');
                            }}
                            className="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-md"
                          >
                            Publish
                          </button>
                        </td>
                      </tr>
                    ))}
                    {vault.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No rendered video files found on disk yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PIPELINE STUDIO (SCRIPT & VOICE) */}
          {activeTab === 'generator' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>⚡</span> Script & Voice AI Studio
                </h2>
                <p className="text-xs text-slate-400">
                  Generate Gemini script JSON and Edge TTS voiceover with timestamps
                </p>
              </div>

              {!keyStatus?.geminiKeySet && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                  <span>No Gemini API key set — script generation uses Gemini 2.5 Flash. Voiceover synthesis works offline without it.</span>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="underline font-bold px-2 py-1 bg-amber-500/20 rounded"
                  >
                    Set Key →
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select Topic ({topics.length})
                  </h3>
                  <div className="space-y-1.5 max-h-96 overflow-y-auto">
                    {topics.map(t => (
                      <button
                        key={t.slug}
                        onClick={() => {
                          setSelectedTopic(t.slug);
                          setScriptOutput('');
                          setVoiceDone(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                          selectedTopic === t.slug
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-medium truncate">{t.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.slug}</div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="New topic title…"
                        value={newTopicInput}
                        onChange={e => setNewTopicInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={async () => {
                          if (!newTopicInput.trim()) return;
                          try {
                            const res = await api<{slug: string}>('/api/topics', {
                              method: 'POST',
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify({title: newTopicInput.trim()}),
                            });
                            setNewTopicInput('');
                            await refreshTopics();
                            setSelectedTopic(res.slug);
                            addLog('topics', `Topic added: ${res.slug}`, 'success');
                          } catch (e) {
                            addLog('topics', `Failed: ${e}`, 'warning');
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-slate-200">
                    Target Topic: <span className="text-amber-400 font-mono">{selectedTopic || '—'}</span>
                  </h3>
                  {busyMsg && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300 font-mono">
                      {busyMsg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={async () => {
                        if (!selectedTopic) return;
                        setIsGeneratingScript(true);
                        setBusyMsg('');
                        addLog('make-script.mjs', `Generating script for "${selectedTopic}"…`, 'info');
                        try {
                          const d = await api<{scriptText: string; log: string}>('/api/script', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({slug: selectedTopic}),
                          });
                          setScriptOutput(d.scriptText || '(Script saved to scripts-out/)');
                          addLog('make-script.mjs', `Script saved to scripts-out/${selectedTopic}.json`, 'success');
                        } catch (e) {
                          setBusyMsg(String(e));
                          addLog('make-script.mjs', `Failed: ${e}`, 'warning');
                        }
                        setIsGeneratingScript(false);
                      }}
                      disabled={isGeneratingScript || !selectedTopic}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <IconSparkles /> {isGeneratingScript ? 'Writing script…' : '1. Generate AI Script'}
                    </button>

                    <button
                      onClick={async () => {
                        if (!selectedTopic) return;
                        setIsGeneratingVoice(true);
                        setVoiceDone(false);
                        addLog('make-voice.mjs', `Synthesizing Edge TTS audio for "${selectedTopic}"…`, 'info');
                        try {
                          await api('/api/voice', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({slug: selectedTopic}),
                          });
                          setVoiceDone(true);
                          addLog('make-voice.mjs', `Audio saved in public/audio/${selectedTopic}/`, 'success');
                        } catch (e) {
                          addLog('make-voice.mjs', `Failed: ${e}`, 'warning');
                        }
                        setIsGeneratingVoice(false);
                      }}
                      disabled={isGeneratingVoice || !selectedTopic}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <IconVolume /> {isGeneratingVoice ? 'Synthesizing voice…' : '2. Synthesize Voiceover'}
                    </button>
                  </div>

                  {scriptOutput && (
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-slate-400">Generated script preview</label>
                        {voiceDone && <span className="text-emerald-400 font-mono flex items-center gap-1"><IconCheck /> Voiceover ready</span>}
                      </div>
                      <textarea
                        rows={8}
                        readOnly
                        value={scriptOutput}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 leading-relaxed"
                      />
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={() => handleTriggerRender(selectedTopic, 'short')}
                      disabled={!selectedTopic}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <IconPlay /> 3. Render Short (1080x1920)
                    </button>
                    {selectedTopicObj?.category === 'longform' && (
                      <button
                        onClick={() => handleTriggerRender(selectedTopic, 'long')}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <IconPlay /> Render Longform (1920x1080)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REMOTION RENDER QUEUE */}
          {activeTab === 'renders' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>🎥</span> Remotion Render Queue
                  </h2>
                  <p className="text-xs text-slate-400">Live multi-threaded render jobs spawned on your PC</p>
                </div>
                <button
                  onClick={refreshRenders}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1"
                >
                  <IconRefresh /> Refresh
                </button>
              </div>

              {renderJobs.length === 0 && (
                <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs">
                  No render jobs yet. Trigger a render from Muse AI Tracker or Pipeline Studio.
                </div>
              )}

              {renderJobs.map(job => (
                <div key={job.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        <span>🎬</span> {job.slug}
                        <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-800 font-normal">
                          {job.kind}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{job.id}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      job.status === 'running'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : job.status === 'done'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : job.status === 'failed'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
                      style={{width: `${job.progress}%`}}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Frame {job.frame} / {job.totalFrames || '…'}</span>
                    <span>{job.progress}%</span>
                  </div>

                  {job.error && (
                    <div className="text-[11px] text-red-400 font-mono bg-red-950/30 p-2 rounded border border-red-900/40">
                      {job.error}
                    </div>
                  )}

                  {job.log.length > 0 && (
                    <details className="text-[11px] font-mono text-slate-400">
                      <summary className="cursor-pointer text-slate-500 hover:text-slate-300">
                        Render console log ({job.log.length} lines)
                      </summary>
                      <div className="mt-2 p-2.5 bg-slate-950 rounded border border-slate-800 max-h-36 overflow-y-auto whitespace-pre-wrap text-[10px]">
                        {job.log.slice(-25).join('\n')}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: MULTI-PUBLISHER */}
          {activeTab === 'publisher' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>🚀</span> Multi-Platform Publisher
                </h2>
                <p className="text-xs text-slate-400">
                  Publish rendered videos straight to YouTube Shorts, Facebook Reels, TikTok & Instagram
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Video</label>
                  <select
                    value={publishSlug}
                    onChange={e => setPublishSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 font-mono"
                  >
                    <option value="">— Choose a rendered video from vault —</option>
                    {vault.map(v => (
                      <option key={v.slug} value={v.slug}>
                        {v.slug}.mp4 ({v.duration} · {v.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Publish Destinations</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {id: 'youtube', name: 'YouTube Shorts', hint: 'youtube-tokens.json'},
                      {id: 'facebook', name: 'Facebook Reels', hint: 'facebook-tokens.json'},
                      {id: 'tiktok', name: 'TikTok', hint: '.tiktok-session/'},
                      {id: 'instagram', name: 'Instagram Reels', hint: 'via FB Page API'},
                    ].map(p => (
                      <label
                        key={p.id}
                        className="flex items-start space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={!!platforms[p.id]}
                          onChange={e => setPlatforms(prev => ({...prev, [p.id]: e.target.checked}))}
                          className="mt-0.5 accent-amber-500 rounded"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{p.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{p.hint}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={async () => {
                    if (!publishSlug) {
                      addLog('publisher', 'Select a video first.', 'warning');
                      return;
                    }
                    const chosen = Object.keys(platforms).filter(k => platforms[k]);
                    if (!chosen.length) {
                      addLog('publisher', 'Select at least one platform.', 'warning');
                      return;
                    }
                    try {
                      const d = await api<{jobs: {id: string; platform: string}[]}>('/api/publish', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({slug: publishSlug, platforms: chosen}),
                      });
                      setPublishJobs(prev => [...d.jobs, ...prev]);
                      addLog('publisher', `Publish queued for ${publishSlug} → ${chosen.join(', ')}`, 'info');
                    } catch (e) {
                      addLog('publisher', `Failed: ${e}`, 'warning');
                    }
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/10"
                >
                  <IconUpload /> Upload to Selected Platforms
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: PHONE REMOTE ACCESS */}
          {activeTab === 'remote' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📱</span> Phone & Remote Access Hub
                </h2>
                <p className="text-xs text-slate-400">
                  Control the entire pipeline, monitor Muse AI, and trigger renders from your phone anywhere in the world
                </p>
              </div>

              {/* Status & Toggle Card */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <IconGlobe /> Cloudflare Secure Tunnel (Global Access)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Works over 4G/5G mobile cellular data with zero router port forwarding
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                    tunnel?.status === 'running'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tunnel?.status === 'running' ? '● Connected' : 'Offline'}
                  </span>
                </div>

                {tunnel?.status === 'running' && tunnel.url ? (
                  <div className="space-y-3 p-4 bg-slate-950 rounded-xl border border-emerald-500/30">
                    <label className="text-xs font-semibold text-emerald-400 block">
                      Your Phone Web & PWA URL (Tap to Copy):
                    </label>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={tunnel.url}
                        className="flex-1 bg-slate-900 border border-emerald-500/40 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 select-all"
                      />
                      <button
                        onClick={() => copyToClipboard(tunnel.url!, 'Copied to clipboard!')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <IconCopy /> {copyFeedback || 'Copy'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Open this link on Safari (iOS) or Chrome (Android) while your PC is on.
                    </p>
                  </div>
                ) : null}

                <div className="flex gap-3">
                  <button
                    onClick={handleToggleTunnel}
                    disabled={tunnelBusy}
                    className={`flex-1 py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                      tunnel?.status === 'running'
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/10'
                    }`}
                  >
                    <IconGlobe />
                    {tunnelBusy
                      ? 'Updating Tunnel…'
                      : tunnel?.status === 'running'
                      ? 'Disconnect Tunnel'
                      : 'Launch Public Mobile Link'}
                  </button>
                </div>
              </div>

              {/* Local Network Info */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>📶</span> Home Wi-Fi Network Access
                </h3>
                <p className="text-[11px] text-slate-400">
                  When your phone is connected to the same home Wi-Fi as this PC:
                </p>
                <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
                  <span className="text-slate-300">http://{tunnel?.localIp || '192.168.1.17'}:3100</span>
                  <button
                    onClick={() => copyToClipboard(`http://${tunnel?.localIp || '192.168.1.17'}:3100`, 'Copied!')}
                    className="text-amber-400 hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* How to Install as App on Phone */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 text-xs">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>📲</span> How to Install as Fullscreen App on Phone
                </h3>
                <div className="space-y-2 text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1">🍎 iPhone / iPad (Safari):</span>
                    1. Open the URL in Safari.<br />
                    2. Tap the <strong>Share</strong> button (box with upward arrow).<br />
                    3. Tap <strong>&quot;Add to Home Screen&quot;</strong>.<br />
                    4. Launch it anytime like a native App with full offline icon!
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">🤖 Android (Chrome):</span>
                    1. Open the URL in Chrome.<br />
                    2. Tap the three dots (⋮) in the top-right corner.<br />
                    3. Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold">Settings & API Configuration</h2>
                <p className="text-xs text-slate-400">Pipeline settings stored securely on your PC</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">🔑 Gemini API Key</h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Used for AI script writing. Stored server-side in <code>data/keys.json</code> (never committed to git).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-200">Gemini Key Status</span>
                    <span className={`text-[11px] font-mono ${keyStatus?.geminiKeySet ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {keyStatus ? (keyStatus.geminiKeySet ? `Configured (${keyStatus.geminiKeySource})` : 'Missing') : '…'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={keyInput}
                      onChange={e => setKeyInput(e.target.value)}
                      placeholder="Paste Gemini API key…"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={async () => {
                        if (!keyInput.trim()) return;
                        setKeyBusy(true);
                        try {
                          await api('/api/settings/keys', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({geminiKey: keyInput.trim()}),
                          });
                          setKeyInput('');
                          setKeyMsg('API Key saved.');
                          const ks = await api<any>('/api/settings/keys');
                          setKeyStatus(ks);
                          addLog('settings', 'Gemini API key updated.', 'success');
                        } catch (e) {
                          setKeyMsg(String(e));
                        }
                        setKeyBusy(false);
                      }}
                      disabled={keyBusy || !keyInput.trim()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                  {keyMsg && <p className="text-[11px] text-slate-400">{keyMsg}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Terminal Log Stream at Bottom */}
        <div className="mt-8 border-t border-slate-800/80 pt-4 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <IconTerminal /> Live Pipeline Console
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear Log
            </button>
          </div>
          <div className="h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-[11px] space-y-1">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-slate-600 shrink-0">[{log.time}]</span>
                <span className="text-amber-500 font-semibold shrink-0">[{log.script}]</span>
                <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-300' : 'text-slate-300'}>
                  {log.msg}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </main>

      {/* Video Player Modal */}
      {previewVideo && (
        <div
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-100 font-sans">{previewVideo.title}</h3>
                <p className="text-[11px] text-slate-400 font-mono">{previewVideo.slug}.mp4 · {previewVideo.type}</p>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="w-full flex justify-center bg-black rounded-xl overflow-hidden">
              <video
                src={`/api/video/${encodeURIComponent(previewVideo.slug)}`}
                controls
                autoPlay
                playsInline
                className={`w-full ${previewVideo.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[65vh]'} object-contain`}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPublishSlug(previewVideo.slug);
                  setPreviewVideo(null);
                  setActiveTab('publisher');
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl"
              >
                Publish This Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
