import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.resolve('dashboard/app/page.tsx');
let code = fs.readFileSync(pagePath, 'utf8');
const isCrlf = code.includes('\r\n');
if (isCrlf) code = code.replace(/\r\n/g, '\n');

// 1. Add imports
const oldImport = `import {NarratorPreview} from "./NarratorPreview";`;
const newImport = `import {NarratorPreview} from "./NarratorPreview";
import {driver} from "driver.js";
import {TOURS} from "@/lib/tours";`;

if (!code.includes('import {TOURS}')) {
  code = code.replace(oldImport, newImport);
}

// 2. Add tour states & startTour function
const oldStates = `  const [scheduleData, setScheduleData] = useState<any>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);`;

const newStates = `  const [scheduleData, setScheduleData] = useState<any>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Interactive Tutorial & Guide State
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [isTourActive, setIsTourActive] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(true);

  // Load completed tours from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("completed_tours") || "[]");
        setCompletedTours(saved);
        const dismissed = localStorage.getItem("tour_welcome_dismissed") === "true";
        setWelcomeDismissed(dismissed);
      } catch {}
    }
  }, []);

  const startTour = useCallback((tourId: string) => {
    const tour = TOURS[tourId];
    if (!tour || !tour.steps.length) return;

    setShowGuideModal(false);
    setIsTourActive(true);

    // If tour begins on a specific tab/channel, switch immediately
    const firstStep = tour.steps[0];
    if (firstStep.tab) setActiveTab(firstStep.tab);
    if (firstStep.channel) setSelectedChannel(firstStep.channel);

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: "rgba(2, 6, 23, 0.8)",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      steps: tour.steps.map((s) => ({
        element: s.element,
        popover: {
          title: s.popover.title,
          description: s.popover.description,
          side: s.popover.side || "bottom",
          align: s.popover.align || "center",
        },
      })),
      onHighlightStarted: (element, step, options) => {
        const currentStepConfig = tour.steps[options.stepIndex];
        if (currentStepConfig?.tab && activeTab !== currentStepConfig.tab) {
          setActiveTab(currentStepConfig.tab);
        }
        if (currentStepConfig?.channel && selectedChannel !== currentStepConfig.channel) {
          setSelectedChannel(currentStepConfig.channel);
        }
      },
      onDestroyStarted: () => {
        setIsTourActive(false);
        driverObj.destroy();
        // Record completion
        setCompletedTours((prev) => {
          if (!prev.includes(tourId)) {
            const updated = [...prev, tourId];
            if (typeof window !== "undefined") {
              localStorage.setItem("completed_tours", JSON.stringify(updated));
            }
            return updated;
          }
          return prev;
        });
      },
    });

    // Small delay to ensure tab DOM elements are mounted
    setTimeout(() => {
      driverObj.drive();
    }, 150);
  }, [activeTab, selectedChannel]);`;

if (!code.includes('const startTour = useCallback')) {
  code = code.replace(oldStates, newStates);
}

// 3. Add data-tour attributes to Channel Selector
const oldChannelHeader = `        {/* Channel Selector Dropdown & Brand */}
        <div className="flex items-center gap-3">`;

const newChannelHeader = `        {/* Channel Selector Dropdown & Brand */}
        <div className="flex items-center gap-3" data-tour="channel-selector">`;

if (!code.includes('data-tour="channel-selector"')) {
  code = code.replace(oldChannelHeader, newChannelHeader);
}

// 4. Add data-tour to Nav Pills
const oldNavMap = `          {[
            {id: "schedule", label: \`Schedule (\${scheduleData?.items?.length || 0} Armed)\`},
            {id: "analytics", label: "Analytics"},
            {id: "create", label: "Create Story"},
            {id: "vault", label: \`Vault (\${vaultVideos.length})\`},
            {id: "jobs", label: \`Queue \${runningJobsCount > 0 ? \`(\${runningJobsCount})\` : ""}\`},
            {id: "settings", label: "Settings & Keys"},
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${`;

const newNavMap = `          {[
            {id: "schedule", label: \`Schedule (\${scheduleData?.items?.length || 0} Armed)\`, tourId: "schedule-tab"},
            {id: "analytics", label: "Analytics", tourId: "analytics-tab"},
            {id: "create", label: "Create Story", tourId: "create-tab"},
            {id: "vault", label: \`Vault (\${vaultVideos.length})\`, tourId: "vault-tab"},
            {id: "jobs", label: \`Queue \${runningJobsCount > 0 ? \`(\${runningJobsCount})\` : ""}\`, tourId: "queue-tab"},
            {id: "settings", label: "Settings & Keys", tourId: "settings-tab"},
          ].map((t) => (
            <button
              key={t.id}
              data-tour={t.tourId}
              onClick={() => setActiveTab(t.id as any)}
              className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${`;

if (!code.includes('data-tour={t.tourId}')) {
  code = code.replace(oldNavMap, newNavMap);
}

// 5. Add Guide Button in Top Right Header
const oldUserPill = `        {/* User Account Pill */}
        <div className="flex items-center gap-2">`;

const newUserPill = `        {/* User Account Pill & Guide Launcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuideModal(true)}
            data-tour="guide-button"
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shadow-amber-500/10 cursor-pointer"
            title="Interactive Tours and Workflow Guide"
          >
            <span>Guide</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </button>`;

if (!code.includes('data-tour="guide-button"')) {
  code = code.replace(oldUserPill, newUserPill);
}

// 6. Add data-tour attributes to Schedule Summary Cards
const oldScheduleCards = `          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Channel</div>`;

const newScheduleCards = `          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg" data-tour="target-channel-card">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Channel</div>`;

if (!code.includes('data-tour="target-channel-card"')) {
  code = code.replace(oldScheduleCards, newScheduleCards);
}

const oldArmedCard = `            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Armed Posts</div>`;

const newArmedCard = `            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg" data-tour="armed-posts-card">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Armed Posts</div>`;

if (!code.includes('data-tour="armed-posts-card"')) {
  code = code.replace(oldArmedCard, newArmedCard);
}

const oldBufferCard = `            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Buffer Health</div>`;

const newBufferCard = `            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg" data-tour="buffer-health-card">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Buffer Health</div>`;

if (!code.includes('data-tour="buffer-health-card"')) {
  code = code.replace(oldBufferCard, newBufferCard);
}

const oldLanesCard = `            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Posting Lanes (31 Oct)</div>`;

const newLanesCard = `            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg" data-tour="posting-lanes-card">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Posting Lanes (31 Oct)</div>`;

if (!code.includes('data-tour="posting-lanes-card"')) {
  code = code.replace(oldLanesCard, newLanesCard);
}

const oldTableDiv = `          {/* Armed Posts Grid */}
          {scheduleData?.items?.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">`;

const newTableDiv = `          {/* Armed Posts Grid */}
          {scheduleData?.items?.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" data-tour="schedule-table">`;

if (!code.includes('data-tour="schedule-table"')) {
  code = code.replace(oldTableDiv, newTableDiv);
}

// 7. Add data-tour attributes to Analytics Day 0 baseline
const oldBaselineDiv = `          {analyticsData?.day0Baseline && (
            <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-lg">`;

const newBaselineDiv = `          {analyticsData?.day0Baseline && (
            <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-lg" data-tour="day0-baseline">`;

if (!code.includes('data-tour="day0-baseline"')) {
  code = code.replace(oldBaselineDiv, newBaselineDiv);
}

// 8. Add Guide Modal Component before closing tag
const oldModalLocation = `      {/* Login / Register Modal */}
      {showAuthModal && (`;

const guideModalCode = `      {/* Interactive Guide & Tutorials Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Interactive Studio Tutorials</h3>
                <p className="text-xs text-slate-400 mt-0.5">Step-by-step walkthroughs with live UI spotlight.</p>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {Object.values(TOURS).map((t) => {
                const isCompleted = completedTours.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{t.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          ~{t.estimatedMinutes} min
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>
                    </div>
                    <button
                      onClick={() => startTour(t.id)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-md shadow-amber-500/15"
                    >
                      {isCompleted ? "Replay" : "Start"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{completedTours.length} of {Object.keys(TOURS).length} modules completed</span>
              <button
                onClick={() => {
                  setCompletedTours([]);
                  localStorage.removeItem("completed_tours");
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login / Register Modal */}
      {showAuthModal && (`;

if (!code.includes('Interactive Studio Tutorials')) {
  code = code.replace(oldModalLocation, guideModalCode);
}

// 9. First-Time Welcome Banner (if 0 tours completed and not dismissed)
const oldMainWrapper = `<main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">`;
const newMainWrapper = `<main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          {!welcomeDismissed && completedTours.length === 0 && (
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <div className="text-sm font-black text-amber-300">Welcome to Content Automation Engine</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Take the interactive 2-minute orientation to explore the multi-channel workflow and live cloud queues.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startTour("orientation")}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition-colors cursor-pointer"
                >
                  Start 2-Min Tour
                </button>
                <button
                  onClick={() => {
                    setWelcomeDismissed(true);
                    localStorage.setItem("tour_welcome_dismissed", "true");
                  }}
                  className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}`;

if (!code.includes('Welcome to Content Automation Engine')) {
  code = code.replace(oldMainWrapper, newMainWrapper);
}

if (isCrlf) code = code.replace(/\n/g, '\r\n');
fs.writeFileSync(pagePath, code);
console.log('✓ Successfully patched dashboard/app/page.tsx with Interactive Tutorial System!');
