import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.resolve('dashboard/app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Normalize line endings to LF for clean regex/replacement
const isCrlf = content.includes('\r\n');
if (isCrlf) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. State definition
const oldState = `  // Navigation & Auth State
  const [activeTab, setActiveTab] = useState<"create" | "vault" | "jobs" | "settings" | "analytics">("create");`;

const newState = `  // Navigation & Auth State
  const [activeTab, setActiveTab] = useState<"create" | "schedule" | "vault" | "jobs" | "settings" | "analytics">("schedule");
  const [selectedChannel, setSelectedChannel] = useState<"kwentong-pinoy" | "adaybackthen" | "genesis-to-glory">("kwentong-pinoy");
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);`;

if (!content.includes('const [scheduleData, setScheduleData]')) {
  content = content.replace(oldState, newState);
}

// 2. loadSchedule & loadAnalytics
const oldAnalytics = `  const loadAnalytics = useCallback(async (refresh = false) => {
    setAnalyticsLoading(true);
    try {
      const [aRes, sRes, iRes] = await Promise.all([
        fetch(\`/api/analytics\${refresh ? "?refresh=1" : ""}\`),
        fetch("/api/status"),
        fetch("/api/intents"),
      ]);
      if (aRes.ok) setAnalyticsData(await aRes.json());
      if (sRes.ok) {
        const sData = await sRes.json();
        setHeartbeatData(sData.heartbeat ?? null);
      }
      if (iRes.ok) {
        const iData = await iRes.json();
        setIntentsData(iData.intents || []);
      }
    } catch {}
    setAnalyticsLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "analytics") loadAnalytics();
  }, [activeTab, loadAnalytics]);`;

const newAnalytics = `  const loadSchedule = useCallback(async (channel = selectedChannel) => {
    setScheduleLoading(true);
    try {
      const res = await fetch(\`/api/schedule?channel=\${channel}\`);
      if (res.ok) {
        setScheduleData(await res.json());
      }
    } catch {}
    setScheduleLoading(false);
  }, [selectedChannel]);

  const loadAnalytics = useCallback(async (refresh = false, channel = selectedChannel) => {
    setAnalyticsLoading(true);
    try {
      const [aRes, sRes, iRes] = await Promise.all([
        fetch(\`/api/analytics?channel=\${channel}\${refresh ? "&refresh=1" : ""}\`),
        fetch("/api/status"),
        fetch("/api/intents"),
      ]);
      if (aRes.ok) setAnalyticsData(await aRes.json());
      if (sRes.ok) {
        const sData = await sRes.json();
        setHeartbeatData(sData.heartbeat ?? null);
      }
      if (iRes.ok) {
        const iData = await iRes.json();
        setIntentsData(iData.intents || []);
      }
    } catch {}
    setAnalyticsLoading(false);
  }, [selectedChannel]);

  useEffect(() => {
    loadSchedule(selectedChannel);
    if (activeTab === "analytics") loadAnalytics(false, selectedChannel);
  }, [activeTab, selectedChannel, loadSchedule, loadAnalytics]);`;

if (!content.includes('const loadSchedule = useCallback')) {
  content = content.replace(oldAnalytics, newAnalytics);
}

// 3. Channel Selector in Brand Title Header
const oldBrand = `        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shadow-inner">
            ⏳
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              A Day Back Then
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI Studio 2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Folklore, Mythology & History Video Creator • $0 Cloud & Mobile Ready
            </p>
          </div>
        </div>`;

const newBrand = `        {/* Channel Selector & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-sm font-black text-amber-400 shadow-inner">
            {selectedChannel === "kwentong-pinoy" ? "KP" : selectedChannel === "genesis-to-glory" ? "GG" : "AD"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedChannel}
                onChange={(e) => {
                  const ch = e.target.value as any;
                  setSelectedChannel(ch);
                  if (typeof window !== "undefined") localStorage.setItem("active_channel", ch);
                }}
                className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-black rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="kwentong-pinoy">Kwentong Pinoy: Lore & History</option>
                <option value="adaybackthen">A Day Back Then (Global)</option>
                <option value="genesis-to-glory">Genesis to Glory (Standby)</option>
              </select>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {selectedChannel === "kwentong-pinoy" ? "Priority Channel" : selectedChannel === "genesis-to-glory" ? "Standby" : "Active Week 1"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
              {selectedChannel === "kwentong-pinoy"
                ? "Philippine Dark Lore • Taglish • 20:00 YT / 21:00 FB"
                : selectedChannel === "genesis-to-glory"
                ? "Bible Chronicles • Standby for Content Plan"
                : "Global Folklore & History • 12:00 / 18:30 / 21:00 PHT"}
            </p>
          </div>
        </div>`;

if (!content.includes('Channel Selector & Brand')) {
  content = content.replace(oldBrand, newBrand);
}

// 4. Nav Pills in Desktop Header
const oldNav = `        {/* Desktop Nav Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {[
            {id: "create", label: "✨ Create Story"},
            {id: "vault", label: \`🎬 My Videos (\${vaultVideos.length})\`},
            {id: "jobs", label: \`🚀 Render Queue \${runningJobsCount > 0 ? \`(\${runningJobsCount})\` : ""}\`},
            {id: "analytics", label: "📊 Analytics"},
            {id: "settings", label: "⚙️ Settings & Keys"},
          ].map((t) => (`;

const newNav = `        {/* Desktop Nav Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {[
            {id: "schedule", label: \`Schedule (\${scheduleData?.items?.length || 0} Armed)\`},
            {id: "analytics", label: "Analytics"},
            {id: "create", label: "Create Story"},
            {id: "vault", label: \`Vault (\${vaultVideos.length})\`},
            {id: "jobs", label: \`Queue \${runningJobsCount > 0 ? \`(\${runningJobsCount})\` : ""}\`},
            {id: "settings", label: "Settings & Keys"},
          ].map((t) => (`;

if (!content.includes('Schedule (${scheduleData?.items?.length || 0} Armed)')) {
  content = content.replace(oldNav, newNav);
}

// 5. Insert Schedule Tab View right above create tab
const oldCreate = `      {/* ===================================================================== */}
      {/* TAB 1: BEGINNER-FRIENDLY STORY & VIDEO CREATOR STUDIO                 */}
      {/* ===================================================================== */}
      {activeTab === "create" && (`;

const newScheduleAndCreate = `      {/* ===================================================================== */}
      {/* TAB: SCHEDULE & CONTENT BUFFER MONITOR                                */}
      {/* ===================================================================== */}
      {activeTab === "schedule" && (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Channel</div>
              <div className="text-lg font-black text-white mt-1 truncate">{scheduleData?.channelName || "Loading..."}</div>
              <div className="text-xs text-amber-400 mt-0.5">{scheduleData?.channelHandle}</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Armed Posts</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">{scheduleData?.summary?.totalArmedItems || 0}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {scheduleData?.summary?.youtubeArmed || 0} YouTube • {scheduleData?.summary?.facebookArmed || 0} Facebook
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Buffer Health</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={\`inline-block w-3 h-3 rounded-full \${
                  scheduleData?.summary?.daysOfBufferRemaining && scheduleData?.summary?.daysOfBufferRemaining > 3
                    ? "bg-emerald-400 shadow-md shadow-emerald-400/50"
                    : "bg-amber-400 shadow-md shadow-amber-400/50"
                }\`} />
                <span className="text-lg font-black text-white">
                  {scheduleData?.summary?.daysOfBufferRemaining || 0} Days Runway
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Armed through: <span className="text-slate-200 font-bold">{scheduleData?.summary?.runOutDate || "Standby"}</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Posting Lanes (31 Oct)</div>
              <div className="text-xs text-slate-300 mt-2 space-y-1">
                <div><strong className="text-white">YouTube / Facebook:</strong> Antigravity</div>
                <div><strong className="text-white">Instagram / TikTok:</strong> Muse Lane</div>
              </div>
            </div>
          </div>

          {/* Low Buffer Alert */}
          {scheduleData?.summary?.daysOfBufferRemaining && scheduleData?.summary?.daysOfBufferRemaining <= 3 && scheduleData?.items?.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-amber-300">Runway Notice: Content Buffer Ending Soon</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  This channel finishes its current scheduled wave after {scheduleData?.summary?.runOutDate}. Ready Wave B scripts and assets to maintain daily algorithmic consistency.
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full">
                Reorder Window
              </span>
            </div>
          )}

          {/* Standby Notice for Genesis to Glory */}
          {(!scheduleData?.items || scheduleData?.items?.length === 0) && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
              <div className="text-base font-bold text-white">Channel On Standby</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Genesis to Glory is officially parked awaiting Christian's content plan and production directive. No posts scheduled.
              </p>
            </div>
          )}

          {/* Armed Posts Grid */}
          {scheduleData?.items?.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white">Scheduled Publishing Grid (Native Cloud Queue)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Staged natively inside YouTube and Meta servers. Posts release autonomously with zero local PC dependency.
                  </p>
                </div>
                <button
                  onClick={() => loadSchedule(selectedChannel)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Day</th>
                      <th className="py-3 px-4">Release Date</th>
                      <th className="py-3 px-4">Topic / Title</th>
                      <th className="py-3 px-4">YouTube Short (Antigravity)</th>
                      <th className="py-3 px-4">Facebook Reel (Antigravity)</th>
                      <th className="py-3 px-4">Instagram (Muse Lane)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {scheduleData?.items?.map((item: any) => (
                      <tr key={item.slug} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">Day {item.day}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{item.date}</div>
                          <div className="text-[11px] text-slate-500">{item.time ? \`\${item.time} PHT\` : "20:00 / 21:00 PHT"}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-100 max-w-xs truncate" title={item.title}>
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.youtube?.url ? (
                            <a
                              href={item.youtube.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold hover:bg-rose-500/20 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                              Scheduled Short
                            </a>
                          ) : (
                            <span className="text-slate-500 italic">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.facebook?.url ? (
                            <a
                              href={item.facebook.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold hover:bg-blue-500/20 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              Scheduled Reel
                            </a>
                          ) : (
                            <span className="text-slate-500 italic">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-semibold">
                            Expected {item.instagramExpected?.timePht || "12:00 PHT"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      )}

${oldCreate}`;

if (!content.includes('TAB: SCHEDULE & CONTENT BUFFER MONITOR')) {
  content = content.replace(oldCreate, newScheduleAndCreate);
}

// 6. Day 0 Baseline card in Analytics
const oldAnalyticsHeader = `      {activeTab === "analytics" && (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">📊 Channel Analytics</h2>`;

const newAnalyticsHeader = `      {activeTab === "analytics" && (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          {analyticsData?.day0Baseline && (
            <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Day 0 Official Baseline
                  </span>
                  <h3 className="text-base font-black text-white mt-1.5">
                    Kwentong Pinoy: Lore & History ({analyticsData.day0Baseline.recordedAt})
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {analyticsData.day0Baseline.notes}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-bold uppercase">Baseline Subs</div>
                    <div className="text-2xl font-black text-amber-400">{analyticsData.day0Baseline.subscribers}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-bold uppercase">Baseline Views</div>
                    <div className="text-2xl font-black text-blue-400">{analyticsData.day0Baseline.totalViews.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-bold uppercase">Launch Trio</div>
                    <div className="text-2xl font-black text-purple-400">{analyticsData.day0Baseline.videoCount} Videos</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Channel Analytics ({selectedChannel})</h2>`;

if (!content.includes('Day 0 Official Baseline')) {
  content = content.replace(oldAnalyticsHeader, newAnalyticsHeader);
}

// 7. Replace Instagram post button in Vault
const oldVaultIG = `                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handlePublishVideo(v.slug, "instagram")}
                        className="py-2 px-3 rounded-xl bg-pink-600/80 hover:bg-pink-600 text-xs font-bold text-white"
                      >
                        📸 Instagram
                      </button>
                      <button
                        onClick={() => handlePublishVideo(v.slug, "facebook")}
                        className="py-2 px-3 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-xs font-bold text-white"
                      >
                        📘 Facebook
                      </button>
                    </div>`;

const newVaultIG = `                    <div className="grid grid-cols-2 gap-2">
                      <div className="py-2 px-3 rounded-xl bg-purple-950/50 border border-purple-800/40 text-[11px] font-semibold text-purple-300 text-center flex items-center justify-center">
                        Muse IG Lane
                      </div>
                      <button
                        onClick={() => handlePublishVideo(v.slug, "facebook")}
                        className="py-2 px-3 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-xs font-bold text-white"
                      >
                        📘 Facebook
                      </button>
                    </div>`;

if (content.includes('handlePublishVideo(v.slug, "instagram")')) {
  content = content.replace(oldVaultIG, newVaultIG);
}

// 8. Mobile Navigation Bar
const oldMobileNav = `      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0e17]/95 backdrop-blur-xl border-t border-slate-800 grid grid-cols-5 py-2 px-2">
        {[
          {id: "create", icon: "✨", label: "Create"},
          {id: "vault", icon: "🎬", label: \`Videos (\${vaultVideos.length})\`},
          {id: "jobs", icon: "🚀", label: "Queue"},
          {id: "settings", icon: "⚙️", label: "Settings"},
          {id: "analytics", icon: "📊", label: "Analytics"},
        ].map((item) => (`;

const newMobileNav = `      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0e17]/95 backdrop-blur-xl border-t border-slate-800 grid grid-cols-6 py-2 px-2">
        {[
          {id: "schedule", icon: "📅", label: "Schedule"},
          {id: "analytics", icon: "📊", label: "Analytics"},
          {id: "create", icon: "✨", label: "Create"},
          {id: "vault", icon: "🎬", label: "Vault"},
          {id: "jobs", icon: "🚀", label: "Queue"},
          {id: "settings", icon: "⚙️", label: "Settings"},
        ].map((item) => (`;

if (content.includes('grid-cols-5 py-2 px-2')) {
  content = content.replace(oldMobileNav, newMobileNav);
}

// Restore CRLF if needed
if (isCrlf) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(pagePath, content);
console.log('✓ Successfully patched dashboard/app/page.tsx with normalized line endings!');
