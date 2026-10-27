"use client";

import React, {useState, useEffect, useCallback, useRef} from "react";
import {NarratorPreview} from "./NarratorPreview";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
};

type SceneItem = {
  text: string;
  mood?: string;
  imagePrompt?: string;
  image?: string;
  audio?: string;
  seconds?: number;
  speaker?: "narrator" | "npc";
  speakerName?: string;
};

type StoryScript = {
  slug: string;
  title: string;
  hook: string;
  channelName: string;
  artStyle?: string;
  narratorTheme?: string;
  narratorTunic?: string;
  narratorAccent?: string;
  voice?: string;
  language?: string;
  emotionPreset?: string;
  scenes: SceneItem[];
  claimsToVerify?: string[];
  generatedBy?: string;
};

type VaultVideo = {
  slug: string;
  filename: string;
  sizeMB: number;
  durationSec: number;
  updatedAt: number;
  isLong?: boolean;
};

type JobItem = {
  id: string;
  kind: string;
  slug: string;
  status: "queued" | "running" | "done" | "failed" | "interrupted";
  progress: number;
  log: string[];
  error?: string;
};

const DRESS_SWATCHES = [
  {name: "Default", hex: ""},
  {name: "Albularyo Earth", hex: "#5c3d28"},
  {name: "Crimson Blood", hex: "#8f1212"},
  {name: "Midnight Obsidian", hex: "#18181b"},
  {name: "Royal Purple", hex: "#5b2d86"},
  {name: "Imperial Gold", hex: "#d4af37"},
  {name: "Forest Druid", hex: "#2d5a27"},
  {name: "Ocean Indigo", hex: "#1e3a8a"},
  {name: "Barong Cream", hex: "#f7f1e1"},
  {name: "Ember Orange", hex: "#c2410c"},
];

const STYLE_GRADIENTS: Record<string, string> = {
  "classic-cartoon": "linear-gradient(160deg, #f3b46b 0%, #c8693a 55%, #432012 100%)",
  "dark-folklore": "linear-gradient(160deg, #0f172a 0%, #31102f 55%, #7f1d1d 100%)",
  "anime-cinematic": "linear-gradient(160deg, #38bdf8 0%, #6366f1 55%, #1e1b4b 100%)",
  "vintage-woodcut": "linear-gradient(160deg, #d6c7b2 0%, #8c7355 55%, #3a2e21 100%)",
  "comic-pulp": "linear-gradient(160deg, #facc15 0%, #ef4444 55%, #111827 100%)",
  "cinematic-realism": "linear-gradient(160deg, #1f2937 0%, #111827 55%, #030712 100%)",
};

const STYLE_PREVIEW_IMAGES: Record<string, string> = {
  "classic-cartoon": "/styles/classic-cartoon.jpg",
  "dark-folklore": "/styles/dark-folklore.png",
  "anime-cinematic": "/styles/anime-cinematic.png",
  "vintage-woodcut": "/styles/vintage-woodcut.png",
  "comic-pulp": "/styles/comic-pulp.png",
  "cinematic-realism": "/styles/cinematic-realism.png",
};

export default function StudioDashboard() {
  // Navigation & Auth State
  const [activeTab, setActiveTab] = useState<"create" | "vault" | "jobs" | "settings" | "analytics">("create");
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Studio Catalogs (loaded from /api/studio)
  const [artStyles, setArtStyles] = useState<any[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [costumes, setCostumes] = useState<any[]>([]);
  const [topicPresets, setTopicPresets] = useState<any[]>([]);
  const [savedStories, setSavedStories] = useState<any[]>([]);

  // Active Story Creation State
  const [topicInput, setTopicInput] = useState("Mangkukulam: The Terrifying Truth About Filipino Witchcraft");
  const [selectedTopicCategory, setSelectedTopicCategory] = useState<string>("all");
  const [selectedArtStyle, setSelectedArtStyle] = useState("dark-folklore");
  const [selectedCostumeGroup, setSelectedCostumeGroup] = useState("All");
  const [selectedTheme, setSelectedTheme] = useState("albularyo");
  const [selectedTunic, setSelectedTunic] = useState("");
  const [selectedAccent, setSelectedAccent] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("fil-PH-AngeloNeural");
  const [selectedVoiceCategory, setSelectedVoiceCategory] = useState<string>("all");
  const [selectedEmotionPreset, setSelectedEmotionPreset] = useState<string>("spooky-suspense");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "taglish" | "tl">("en");
  const [selectedTone, setSelectedTone] = useState("spooky-curious");

  // Loaded / Generated Story Script
  const [currentScript, setCurrentScript] = useState<StoryScript | null>(null);
  const [previewSceneIndex, setPreviewSceneIndex] = useState<number>(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [sceneBusyIndex, setSceneBusyIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<{type: "ok" | "err" | "info"; text: string} | null>(null);
  const [imageCacheBuster, setImageCacheBuster] = useState<number>(Date.now());

  // Vault & Jobs State
  const [vaultVideos, setVaultVideos] = useState<VaultVideo[]>([]);
  const [selectedVaultCategory, setSelectedVaultCategory] = useState<string>("all");
  const [previewVideoSlug, setPreviewVideoSlug] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);

  // Settings Tab State
  const [settingsData, setSettingsData] = useState<any>(null);
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({
    FREELLMAPI_URL: "http://localhost:3001/v1",
    FREELLMAPI_KEY: "",
    GROQ_API_KEY: "",
    CEREBRAS_API_KEY: "",
    GEMINI_API_KEY: "",
    OPENROUTER_API_KEY: "",
    MISTRAL_API_KEY: "",
    HF_API_KEY: "",
    IMAGE_PROVIDER: "auto",
    VOICE_PROVIDER: "edge",
    GITHUB_REPO: "",
    GITHUB_TOKEN: "",
    youtubeClientSecretJson: "",
    fbPageId: "",
    igUserId: "",
    fbPageAccessToken: "",
  });
  const [llmTestResult, setLlmTestResult] = useState<any>(null);
  const [tunnelInfo, setTunnelInfo] = useState<any>(null);

  const notify = useCallback((text: string, type: "ok" | "err" | "info" = "ok") => {
    setToast({text, type});
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 6000);
  }, []);

  const handlePlayVoiceSample = useCallback((voiceId: string) => {
    if (playingVoiceId === voiceId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingVoiceId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const alt1 = voiceId.replace("Multilingual", "");
    const alt2 = voiceId.startsWith("en-PH-")
      ? voiceId.replace("en-PH-", "fil-PH-")
      : voiceId.startsWith("fil-PH-")
      ? voiceId.replace("fil-PH-", "en-PH-")
      : voiceId;

    const candidateUrls = Array.from(new Set([
      `/api/asset?path=audio/samples/${voiceId}.mp3`,
      `/voices/${voiceId}.mp3`,
      `/api/asset?path=audio/samples/${alt1}.mp3`,
      `/voices/${alt1}.mp3`,
      `/api/asset?path=audio/samples/${alt2}.mp3`,
      `/voices/${alt2}.mp3`,
    ]));

    let candidateIdx = 0;
    const tryNext = () => {
      if (candidateIdx >= candidateUrls.length) {
        notify("Audio sample preview unavailable", "info");
        setPlayingVoiceId(null);
        return;
      }
      const url = candidateUrls[candidateIdx++];
      const audio = new Audio(url);
      audioRef.current = audio;
      setPlayingVoiceId(voiceId);

      audio.onended = () => {
        setPlayingVoiceId((curr) => (curr === voiceId ? null : curr));
      };
      audio.onerror = () => {
        tryNext();
      };
      audio.play().catch(() => {
        tryNext();
      });
    };

    tryNext();
  }, [playingVoiceId, notify]);

  // Initial Data Load
  const loadStudioCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/studio");
      if (res.ok) {
        const data = await res.json();
        setArtStyles(data.artStyles || []);
        setVoices(data.voices || []);
        setCostumes(data.costumes || []);
        setTopicPresets(data.topicPresets || []);
        setSavedStories(data.stories || []);
      }
    } catch {}
  }, []);

  const loadVaultAndJobs = useCallback(async () => {
    try {
      const [vRes, rRes] = await Promise.all([fetch("/api/vault"), fetch("/api/render")]);
      if (vRes.ok) {
        const vData = await vRes.json();
        setVaultVideos(vData.videos || []);
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        setJobs(rData.jobs || []);
      }
    } catch {}
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const [kRes, tRes] = await Promise.all([fetch("/api/settings/keys"), fetch("/api/remote")]);
      if (kRes.ok) {
        const kData = await kRes.json();
        setSettingsData(kData);
        setKeyInputs((prev) => ({
          ...prev,
          FREELLMAPI_URL: kData.freellmapiUrl || prev.FREELLMAPI_URL,
          IMAGE_PROVIDER: kData.preferences?.IMAGE_PROVIDER || "auto",
          VOICE_PROVIDER: kData.preferences?.VOICE_PROVIDER || "edge",
          GITHUB_REPO: kData.preferences?.GITHUB_REPO || "",
          fbPageId: kData.social?.facebookPageId || "",
          igUserId: kData.social?.instagramUserId || "",
        }));
      }
      if (tRes.ok) {
        setTunnelInfo(await tRes.json());
      }
    } catch {}
  }, []);

  // Analytics Tab (real YouTube/Meta data + heartbeat + intents outbox)
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [heartbeatData, setHeartbeatData] = useState<any>(null);
  const [intentsData, setIntentsData] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const loadAnalytics = useCallback(async (refresh = false) => {
    setAnalyticsLoading(true);
    try {
      const [aRes, sRes, iRes] = await Promise.all([
        fetch(`/api/analytics${refresh ? "?refresh=1" : ""}`),
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
  }, [activeTab, loadAnalytics]);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) setUser(d.user);
      })
      .catch(() => {});
    loadStudioCatalog();
    loadVaultAndJobs();
    loadSettings();
  }, [loadStudioCatalog, loadVaultAndJobs, loadSettings]);

  // Poll active jobs every 2.5s
  useEffect(() => {
    const hasRunning = jobs.some((j) => j.status === "running" || j.status === "queued");
    if (!hasRunning && activeTab !== "jobs") return;
    const timer = setInterval(() => {
      loadVaultAndJobs();
    }, 2500);
    return () => clearInterval(timer);
  }, [jobs, activeTab, loadVaultAndJobs]);

  // Auth Handlers
  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: authMode,
          name: authName,
          email: authEmail,
          password: authPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failed");
      } else {
        setUser(data.user);
        setShowAuthModal(false);
        notify(`Welcome, ${data.user.name}!`, "ok");
      }
    } catch (err: any) {
      setAuthError(err.message || "Network error");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({action: "logout"}),
    });
    setUser(null);
    notify("Signed out.", "info");
  }

  // Story Generation & Editing Handlers
  async function handleGenerateStory() {
    if (!topicInput.trim()) {
      notify("Please enter a topic or story idea first!", "err");
      return;
    }
    setBusyAction("Generating full story & scene prompts via AI...");
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "generate-story",
          topic: topicInput,
          artStyle: selectedArtStyle,
          narratorTheme: selectedTheme,
          narratorTunic: selectedTunic,
          narratorAccent: selectedAccent,
          voice: selectedVoice,
          language: selectedLanguage,
          tone: selectedTone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Story generation failed");
      setCurrentScript(data.script);
      loadStudioCatalog();
      notify(`Story "${data.script.title}" created (${data.script.scenes.length} scenes)!`, "ok");
    } catch (err: any) {
      notify(err.message || "Story generation failed", "err");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleLoadStory(slug: string) {
    setBusyAction(`Loading story ${slug}...`);
    try {
      const res = await fetch(`/api/studio?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (res.ok && data.script) {
        setCurrentScript(data.script);
        if (data.script.artStyle) setSelectedArtStyle(data.script.artStyle);
        if (data.script.narratorTheme) setSelectedTheme(data.script.narratorTheme);
        setSelectedTunic(data.script.narratorTunic || "");
        setSelectedAccent(data.script.narratorAccent || "");
        if (data.script.voice) {
          setSelectedVoice(data.script.voice);
          if (data.script.voice.includes("-PH-") || data.script.voice.startsWith("fil-")) {
            setSelectedVoiceCategory("filipino");
          }
        }
        if (data.script.language) setSelectedLanguage(data.script.language);
        if (data.script.emotionPreset) setSelectedEmotionPreset(data.script.emotionPreset);
        notify(`Loaded "${data.script.title}"`, "info");
      }
    } catch {
      notify("Failed to load story", "err");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleSaveCurrentScript(updated?: StoryScript) {
    const target = updated || currentScript;
    if (!target) return;
    const synced: StoryScript = {
      ...target,
      artStyle: selectedArtStyle,
      narratorTheme: selectedTheme,
      narratorTunic: selectedTunic || undefined,
      narratorAccent: selectedAccent || undefined,
      voice: selectedVoice,
      language: selectedLanguage,
      emotionPreset: selectedEmotionPreset,
    };
    setCurrentScript(synced);
    await fetch("/api/studio", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({action: "save-story", script: synced}),
    });
    notify("Story & Narrator settings saved!", "ok");
  }

  async function handleGenerateSceneImage(sceneIndex?: number) {
    if (!currentScript) return;
    await handleSaveCurrentScript();
    if (typeof sceneIndex === "number") {
      setSceneBusyIndex(sceneIndex);
    } else {
      setBusyAction("Painting all scene background illustrations ($0 Flux/Gemini)...");
    }
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "generate-image",
          slug: currentScript.slug,
          sceneIndex,
          artStyle: selectedArtStyle,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image generation failed");
      setCurrentScript(data.script);
      setImageCacheBuster(Date.now());
      loadStudioCatalog();
      notify(
        typeof sceneIndex === "number"
          ? `Scene ${sceneIndex + 1} artwork generated!`
          : `All ${data.generated?.length || 0} scene backgrounds generated!`,
        "ok",
      );
    } catch (err: any) {
      notify(err.message || "Failed to generate artwork", "err");
    } finally {
      setSceneBusyIndex(null);
      setBusyAction(null);
    }
  }

  async function handleGenerateVoiceover() {
    if (!currentScript) return;
    await handleSaveCurrentScript();
    setBusyAction("Synthesizing narrator voiceover for all scenes...");
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "generate-voice",
          slug: currentScript.slug,
          voice: selectedVoice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Voiceover synthesis failed");
      setCurrentScript(data.script);
      setImageCacheBuster(Date.now());
      loadStudioCatalog();
      notify("Voiceover audio generated for all scenes!", "ok");
    } catch (err: any) {
      notify(err.message || "Voiceover failed", "err");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleRenderVideo(mode: "local" | "cloud" = "local") {
    if (!currentScript) return;
    await handleSaveCurrentScript();
    setBusyAction(
      mode === "cloud"
        ? "Dispatching to Laptop-Off Cloud Render Worker..."
        : "Starting Remotion 1080x1920 MP4 render...",
    );
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "render-video",
          slug: currentScript.slug,
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Render failed to start");
      if (data.cloudDispatched) {
        notify(data.message, "ok");
      } else {
        notify(`Render started for "${currentScript.title}"! Track progress in Queue.`, "ok");
        loadVaultAndJobs();
      }
    } catch (err: any) {
      notify(err.message || "Render error", "err");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleFullAutoProduce() {
    try {
      let script = currentScript;
      if (!script) {
        setBusyAction("Step 1/4: Writing high-retention folklore story with FreeLLM...");
        const res = await fetch("/api/studio", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            action: "generate-story",
            topic: topicInput,
            artStyle: selectedArtStyle,
            narratorTheme: selectedTheme,
            narratorTunic: selectedTunic,
            narratorAccent: selectedAccent,
            voice: selectedVoice,
            language: selectedLanguage,
            tone: selectedTone,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Story generation failed");
        script = data.script;
        setCurrentScript(script);
        loadStudioCatalog();
      }

      if (!script || !script.slug) return;
      const targetSlug = script.slug;

      setBusyAction("Step 2/4: Painting 4K background artwork ($0 Flux/Pollinations)...");
      const imgRes = await fetch("/api/studio", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "generate-image",
          slug: targetSlug,
          artStyle: selectedArtStyle,
        }),
      });
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        if (imgData.script) {
          script = imgData.script;
          setCurrentScript(script);
        }
        setImageCacheBuster(Date.now());
      }

      setBusyAction("Step 3/4: Synthesizing neural narrator voiceover & lip-sync...");
      const vRes = await fetch("/api/studio", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "generate-voice",
          slug: targetSlug,
          voice: selectedVoice,
        }),
      });
      if (vRes.ok) {
        const vData = await vRes.json();
        if (vData.script) {
          script = vData.script;
          setCurrentScript(script);
        }
      }

      setBusyAction("Step 4/4: Launching 1080x1920 MP4 Video Render...");
      const rRes = await fetch("/api/studio", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "render-video",
          slug: targetSlug,
          mode: "local",
        }),
      });
      const rData = await rRes.json();
      if (!rRes.ok) throw new Error(rData.error || "Render start failed");
      notify(`🎉 1-Click Video render started for "${script?.title || targetSlug}"! Track progress in Queue.`, "ok");
      loadVaultAndJobs();
    } catch (err: any) {
      notify(err.message || "Auto-production encountered an error", "err");
    } finally {
      setBusyAction(null);
    }
  }

  async function handlePublishVideo(slug: string, platform: "youtube" | "instagram" | "facebook" | "tiktok") {
    notify(`Starting ${platform.toUpperCase()} upload/schedule for ${slug}...`, "info");
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({slug, platform}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      notify(`${platform.toUpperCase()} publish job started!`, "ok");
      loadVaultAndJobs();
    } catch (err: any) {
      notify(err.message || "Publish error", "err");
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setBusyAction("Saving configuration & keys...");
    try {
      const res = await fetch("/api/settings/keys", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(keyInputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      setSettingsData(data);
      notify("All settings & API keys saved securely!", "ok");
    } catch (err: any) {
      notify(err.message || "Failed to save settings", "err");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleTestLLM() {
    setBusyAction("Testing FreeLLMAPI & Smart AI Pool connection...");
    setLlmTestResult(null);
    try {
      const res = await fetch("/api/settings/keys", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({action: "test-llm"}),
      });
      const data = await res.json();
      setLlmTestResult(data);
      if (data.ok) {
        notify(`Connected via ${data.provider} (${data.model}) in ${data.latencyMs}ms!`, "ok");
      } else {
        notify(data.error || "AI test failed", "err");
      }
    } catch (err: any) {
      notify(err.message || "AI connection test error", "err");
    } finally {
      setBusyAction(null);
    }
  }

  const costumeGroups = ["All", "Philippine Folklore", "Dark & Spooky", "Ancient & Classical", "Medieval & Warriors", "Early Modern", "Modern & Urban"];
  const filteredCostumes = costumes.filter(
    (c) => selectedCostumeGroup === "All" || c.group === selectedCostumeGroup,
  );
  const runningJobsCount = jobs.filter((j) => j.status === "running" || j.status === "queued").length;

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 pb-24 lg:pb-10 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0b0e17]/90 border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
            ⏳
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
              A Day Back Then
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Studio 2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Folklore, Mythology & History Video Creator • $0 Cloud & Mobile Ready
            </p>
          </div>
        </div>

        {/* Desktop Nav Pills */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {[
            {id: "create", label: "✨ Create Story"},
            {id: "vault", label: `🎬 My Videos (${vaultVideos.length})`},
            {id: "jobs", label: `🚀 Render Queue ${runningJobsCount > 0 ? `(${runningJobsCount})` : ""}`},
            {id: "analytics", label: "📊 Analytics"},
            {id: "settings", label: "⚙️ Settings & Keys"},
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === t.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* User Account Pill */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full pl-2 pr-3 py-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
                style={{backgroundColor: user.avatarColor || "#f59e0b"}}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white leading-none">{user.name}</div>
                <div className="text-[10px] text-emerald-400 font-medium">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-1 text-[11px] text-slate-400 hover:text-rose-400 font-semibold"
                title="Sign Out"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              👤 Login / Register
            </button>
          )}
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-50">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center justify-between ${
              toast.type === "err"
                ? "bg-rose-950/95 border-rose-500/50 text-rose-200"
                : toast.type === "info"
                ? "bg-slate-900/95 border-sky-500/50 text-sky-200"
                : "bg-emerald-950/95 border-emerald-500/50 text-emerald-200"
            }`}
          >
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ml-3 opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Global Busy Overlay Bar */}
      {busyAction && (
        <div className="bg-amber-500/15 border-b border-amber-500/40 px-4 py-2.5 flex items-center justify-center gap-3 text-xs font-semibold text-amber-300">
          <span className="inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>{busyAction}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 1: BEGINNER-FRIENDLY STORY & VIDEO CREATOR STUDIO                 */}
      {/* ===================================================================== */}
      {activeTab === "create" && (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center Studio Column (8 cols on Desktop) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1-CLICK PRODUCTION ACTION HERO BANNER */}
            <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-purple-500/20 border-2 border-amber-400/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider">
                    Full AI Studio
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">1080 × 1920 Short</span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-white">
                  Ready to produce your video?
                </h1>
                <p className="text-xs text-slate-300">
                  Click below to write your story, generate 5 scene backgrounds, record voiceover, and render the MP4.
                </p>
              </div>
              <button
                type="button"
                disabled={Boolean(busyAction)}
                onClick={handleFullAutoProduce}
                className="w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50"
              >
                <span className="text-base">🎬</span>
                <span>{currentScript ? "⚡ Render Full Video Now" : "🚀 1-Click Auto-Produce Video"}</span>
              </button>
            </div>

            {/* STEP 1: TOPIC & FOLKLORE STORY ENGINE */}
            <section className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      What story do you want to create?
                    </h2>
                    <p className="text-xs text-slate-400">
                      Type any folklore creature (e.g. Mangkukulam, Manananggal, Aswang) or historical topic
                    </p>
                  </div>
                </div>
                {savedStories.length > 0 && (
                  <select
                    onChange={(e) => e.target.value && handleLoadStory(e.target.value)}
                    value={currentScript?.slug || ""}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 max-w-[190px]"
                  >
                    <option value="">📂 Load Saved Story ({savedStories.length})</option>
                    {savedStories.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.videoReady ? "✅ " : "📝 "}
                        {s.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Step 1 Topic Category Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-2.5 border-b border-slate-800 pb-2.5">
                {[
                  {id: "all", label: "🌟 All Topics"},
                  {id: "filipino", label: "🇵🇭 Filipino / Tagalog Lore"},
                  {id: "folklore", label: "🕯️ Dark Folklore"},
                  {id: "ancient", label: "🏛️ Ancient Empires"},
                  {id: "medieval", label: "⚔️ Medieval & Warriors"},
                  {id: "modern", label: "🎩 Early Modern"},
                ].map((tc) => (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => setSelectedTopicCategory(tc.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      selectedTopicCategory === tc.id
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <span>{tc.label}</span>
                  </button>
                ))}
              </div>

              {/* Filtered Folklore & History Preset Chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {topicPresets
                  .filter((p) => selectedTopicCategory === "all" || p.category === selectedTopicCategory)
                  .map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setTopicInput(p.topic);
                        if (p.theme) setSelectedTheme(p.theme);
                        if (p.style) setSelectedArtStyle(p.style);
                        if (p.category === "filipino") {
                          setSelectedVoice("fil-PH-AngeloNeural");
                          setSelectedVoiceCategory("filipino");
                          setSelectedLanguage("taglish");
                          setSelectedEmotionPreset("spooky-suspense");
                        }
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800/90 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/40 transition"
                    >
                      {p.label}
                    </button>
                  ))}
              </div>

              <div className="space-y-3">
                <textarea
                  rows={2}
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g., Mangkukulam: How Filipino folk healers countered dark curses, or Manananggal in Capiz..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:outline-none p-3.5 text-sm text-white placeholder-slate-500"
                />

                {/* Language & Tone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                    >
                      <option value="en">🇺🇸 English (Global)</option>
                      <option value="taglish">🇵🇭 Taglish (Pinoy Storyteller)</option>
                      <option value="tl">🇵🇭 Tagalog / Filipino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Story Tone
                    </label>
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                    >
                      <option value="spooky-curious">🕯️ Spooky, Eerie & Curious</option>
                      <option value="dramatic-survival">🔥 Dramatic Second-Person Survival</option>
                      <option value="witty-historical">😄 Witty & Educational History</option>
                    </select>
                  </div>
                </div>

                {/* Dual Action Buttons: 1-Click Video vs Write Script */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={Boolean(busyAction)}
                    onClick={handleFullAutoProduce}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    <span>🎬</span>
                    <span>1-Click Auto-Produce Video (Story + Art + Voice + MP4)</span>
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(busyAction)}
                    onClick={handleGenerateStory}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <span>📝</span>
                    <span>Write Script Only</span>
                  </button>
                </div>
              </div>
            </section>

            {/* STEP 2: VISUAL ART STYLE PICKER */}
            <section className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-white">Pick Background Art Style</h2>
                  <p className="text-xs text-slate-400">
                    Real visual preview of the scenery art the AI paints for every scene
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artStyles.map((st) => {
                  const active = selectedArtStyle === st.id;
                  const previewImg = STYLE_PREVIEW_IMAGES[st.id] || "/styles/classic-cartoon.jpg";
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedArtStyle(st.id)}
                      className={`group text-left rounded-xl p-3 border transition-all flex flex-col justify-between ${
                        active
                          ? "border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/15"
                          : "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="w-full">
                        {/* Real Visual Image Thumbnail */}
                        <div className="relative h-28 w-full rounded-lg mb-2.5 overflow-hidden border border-white/10 bg-slate-950 group-hover:border-amber-400/50 transition">
                          <img
                            src={previewImg}
                            alt={st.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.src.includes("/api/asset")) {
                                target.src = `/api/asset?path=images/styles/${st.id}.${st.id === "classic-cartoon" ? "jpg" : "png"}`;
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black/75 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                              {st.badge}
                            </span>
                          </div>
                        </div>
                        <div className="font-extrabold text-xs text-white flex items-center justify-between">
                          <span>{st.name}</span>
                          {active && <span className="text-amber-400 text-xs font-bold">✓ Active</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {st.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* STEP 3: NARRATOR DRESS & WARDROBE CUSTOMIZER */}
            <section className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      Customize Narrator Dress & Costume
                    </h2>
                    <p className="text-xs text-slate-400">
                      Choose from 30 historical & folklore outfits and customize the dress colors
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {costumeGroups.map((grp) => (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setSelectedCostumeGroup(grp)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedCostumeGroup === grp
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>

              {/* Costume Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 mb-4">
                {filteredCostumes.map((c) => {
                  const active = selectedTheme === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedTheme(c.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                        active
                          ? "border-amber-400 bg-amber-500/15 text-white"
                          : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-white/30 shrink-0"
                        style={{backgroundColor: c.defaultTunic}}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{c.group}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Dress Color Pickers & Swatches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Primary Dress / Tunic Color
                    </label>
                    <input
                      type="color"
                      value={selectedTunic || "#5c3d28"}
                      onChange={(e) => setSelectedTunic(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DRESS_SWATCHES.map((sw) => (
                      <button
                        key={sw.name}
                        type="button"
                        onClick={() => setSelectedTunic(sw.hex)}
                        title={sw.name}
                        className={`w-6 h-6 rounded-full border transition ${
                          selectedTunic === sw.hex
                            ? "ring-2 ring-amber-400 scale-110 border-white"
                            : "border-slate-600 opacity-85 hover:opacity-100"
                        }`}
                        style={{
                          background: sw.hex || "conic-gradient(#f59e0b, #ef4444, #3b82f6, #10b981)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Secondary Sash / Cloak / Trim Color
                    </label>
                    <input
                      type="color"
                      value={selectedAccent || "#9e2424"}
                      onChange={(e) => setSelectedAccent(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DRESS_SWATCHES.map((sw) => (
                      <button
                        key={sw.name}
                        type="button"
                        onClick={() => setSelectedAccent(sw.hex)}
                        title={sw.name}
                        className={`w-6 h-6 rounded-full border transition ${
                          selectedAccent === sw.hex
                            ? "ring-2 ring-amber-400 scale-110 border-white"
                            : "border-slate-600 opacity-85 hover:opacity-100"
                        }`}
                        style={{
                          background: sw.hex || "conic-gradient(#f59e0b, #ef4444, #3b82f6, #10b981)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* STEP 4: VOICE SELECTOR WITH AUDIBLE AUDIO PREVIEW */}
            <section className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-white">Select Narrator Voice & Emotional Delivery</h2>
                  <p className="text-xs text-slate-400">
                    Accent-complimenting voices with real emotional prosody, breath pauses, and pitch contour
                  </p>
                </div>
              </div>

              {/* Step 4 Voice Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-3 border-b border-slate-800 pb-2.5">
                {[
                  {id: "all", label: "🌟 All Voices"},
                  {id: "filipino", label: "🇵🇭 Filipino & Taglish"},
                  {id: "folklore", label: "🕯️ Dark Folklore & Spooky"},
                  {id: "history", label: "🏛️ History & Documentary"},
                  {id: "viral", label: "⚡ Viral & Curious Host"},
                ].map((vc) => (
                  <button
                    key={vc.id}
                    type="button"
                    onClick={() => setSelectedVoiceCategory(vc.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      selectedVoiceCategory === vc.id
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <span>{vc.label}</span>
                  </button>
                ))}
              </div>

              {/* Filtered Voice Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {voices
                  .filter((v) => selectedVoiceCategory === "all" || v.category === selectedVoiceCategory)
                  .map((v) => {
                    const active = selectedVoice === v.id;
                    const isPlaying = playingVoiceId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          setSelectedVoice(v.id);
                          if (v.category === "filipino") setSelectedVoiceCategory("filipino");
                        }}
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          active
                            ? "border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/30"
                            : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black text-white flex items-center gap-1.5">
                              <span>🎙️</span>
                              <span>{v.name}</span>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/20">
                              {v.accent}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">{v.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {active ? "✓ Selected Voice" : "Click to select"}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayVoiceSample(v.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition ${
                              isPlaying
                                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/40 animate-pulse"
                                : "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
                            }`}
                          >
                            <span>{isPlaying ? "⏸" : "▶"}</span>
                            <span>{isPlaying ? "Stop" : "Listen Sample"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Emotional Delivery & Prosody Pacing Sub-Panel */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>🎭</span>
                    <span>Emotional Delivery & Prosody Style</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    ✓ Auto-Accent Complimenting Active
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {id: "spooky-suspense", label: "🕯️ Eerie Dread", desc: "Campfire pauses, baritone drop (-4Hz)"},
                    {id: "intense-survival", label: "🔥 Intense Drama", desc: "Urgent cadence, high-stakes reveal"},
                    {id: "documentary-reverent", label: "📜 Documentary", desc: "Measured, historical authority"},
                    {id: "curious-viral", label: "⚡ Curious Viral", desc: "Lively host, fast punchy hold-rate"},
                  ].map((ep) => (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => setSelectedEmotionPreset(ep.id)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedEmotionPreset === ep.id
                          ? "border-amber-400 bg-amber-500/15 text-white ring-1 ring-amber-400/40"
                          : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{ep.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ep.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* STEP 5: STORYBOARD EDITOR, SCENE IMAGES & VIDEO RENDER ACTION */}
            {!currentScript ? (
              <section className="bg-slate-900/60 border border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-400/30 flex items-center justify-center text-2xl mx-auto shadow-inner">
                  🎬
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-extrabold text-white">
                    Step 5 • Video Generation
                  </h3>
                  <p className="text-xs text-slate-400">
                    When you are happy with your topic, style, dress, and voice above, click below to automatically produce and render your complete 1080×1920 Short video!
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={Boolean(busyAction)}
                    onClick={handleFullAutoProduce}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50"
                  >
                    <span>⚡</span>
                    <span>1-Click Auto-Produce Full Video Now</span>
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(busyAction)}
                    onClick={handleGenerateStory}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
                  >
                    <span>📝 Write Script First</span>
                  </button>
                </div>
              </section>
            ) : (
              <section className="bg-slate-900/80 border border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-amber-400">
                      Step 5 • Storyboard & Production ({currentScript.slug})
                    </span>
                    <h2 className="text-lg font-black text-white mt-0.5">{currentScript.title}</h2>
                    {currentScript.generatedBy && (
                      <p className="text-[11px] text-emerald-400">
                        Generated via {currentScript.generatedBy}
                      </p>
                    )}
                  </div>

                  {/* Production Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={() => handleGenerateSceneImage()}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition disabled:opacity-50"
                    >
                      🎨 Paint All Scenes ($0)
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={handleGenerateVoiceover}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition disabled:opacity-50"
                    >
                      🎙️ Record Voiceover
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={() => handleRenderVideo("local")}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <span>🎬</span>
                      <span>Render 1080×1920 MP4</span>
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={() => handleRenderVideo("cloud")}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                      title="Render on GitHub Actions 16GB RAM server even when your laptop is off"
                    >
                      <span>☁️</span>
                      <span>Cloud Render (Laptop-Off)</span>
                    </button>
                  </div>
                </div>

                {/* Editable Hook Banner */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    On-Screen 3-Second Hook Banner Text
                  </label>
                  <input
                    type="text"
                    value={currentScript.hook}
                    onChange={(e) =>
                      setCurrentScript({...currentScript, hook: e.target.value})
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-amber-300"
                  />
                </div>

                {/* Scene-by-Scene Cards */}
                <div className="space-y-3">
                  {currentScript.scenes.map((scene, idx) => {
                    const imgUrl = scene.image
                      ? `/api/asset?path=${encodeURIComponent(scene.image)}&t=${imageCacheBuster}`
                      : null;
                    const audUrl = scene.audio
                      ? `/api/asset?path=${encodeURIComponent(scene.audio)}&t=${imageCacheBuster}`
                      : null;

                    return (
                      <div
                        key={idx}
                        className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start"
                      >
                        {/* Scene Artwork Preview */}
                        <div className="sm:col-span-3 flex flex-col items-center">
                          <div className="w-full aspect-[9/16] max-h-48 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center relative">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={`Scene ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full relative">
                                <img
                                  src={STYLE_PREVIEW_IMAGES[selectedArtStyle] || "/styles/classic-cartoon.jpg"}
                                  alt="Style placeholder"
                                  className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center p-2 text-[11px] text-white/90 font-bold">
                                  Scene {idx + 1} Art
                                </div>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            disabled={sceneBusyIndex === idx || Boolean(busyAction)}
                            onClick={() => handleGenerateSceneImage(idx)}
                            className="mt-2 w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-[11px] font-bold text-white transition disabled:opacity-50"
                          >
                            {sceneBusyIndex === idx
                              ? "Painting..."
                              : imgUrl
                              ? "🔄 Regenerate Art"
                              : "🎨 Paint Scene Art"}
                          </button>
                        </div>

                        {/* Scene Text & Image Prompt */}
                        <div className="sm:col-span-9 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-amber-400">
                              Scene {idx + 1} of {currentScript.scenes.length}
                            </span>
                            {scene.seconds && (
                              <span className="text-[11px] text-emerald-400 font-semibold">
                                ⏱️ {scene.seconds}s
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                              Spoken Narration & Subtitle Text
                            </label>
                            <textarea
                              rows={2}
                              value={scene.text}
                              onChange={(e) => {
                                const nextScenes = [...currentScript.scenes];
                                nextScenes[idx] = {...nextScenes[idx], text: e.target.value};
                                setCurrentScript({...currentScript, scenes: nextScenes});
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                              AI Background Image Prompt ({selectedArtStyle})
                            </label>
                            <input
                              type="text"
                              value={scene.imagePrompt || ""}
                              onChange={(e) => {
                                const nextScenes = [...currentScript.scenes];
                                nextScenes[idx] = {
                                  ...nextScenes[idx],
                                  imagePrompt: e.target.value,
                                };
                                setCurrentScript({...currentScript, scenes: nextScenes});
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300"
                            />
                          </div>

                          {audUrl && (
                            <div className="pt-1">
                              <audio controls src={audUrl} className="h-8 w-full max-w-xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Save & 1-Click Auto-Produce Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSaveCurrentScript()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                  >
                    💾 Save Story Edits
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(busyAction)}
                    onClick={handleFullAutoProduce}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2"
                  >
                    <span>⚡</span>
                    <span>1-Click Auto-Produce (Paint + Voice + Render MP4)</span>
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Right Sticky Live 9:16 Phone Preview Column (4 cols on Desktop) */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col items-center shadow-2xl">
              <div className="w-full flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  📱 Live 9:16 Short Preview
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">1080 × 1920</span>
              </div>

              {/* 9:16 Vertical Phone Stage */}
              <div className="w-64 aspect-[9/16] rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden relative flex flex-col justify-between p-4 bg-slate-950">
                {/* Real Background Artwork (from scene image or chosen art style) */}
                <img
                  src={
                    currentScript?.scenes?.[previewSceneIndex]?.image
                      ? `/api/asset?path=${encodeURIComponent(currentScript.scenes[previewSceneIndex].image)}&t=${imageCacheBuster}`
                      : STYLE_PREVIEW_IMAGES[selectedArtStyle] || "/styles/classic-cartoon.jpg"
                  }
                  alt="Scenery preview"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("classic-cartoon")) {
                      target.src = "/styles/classic-cartoon.jpg";
                    }
                  }}
                />

                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                {/* Top Channel Pill & Hook Banner */}
                <div className="relative z-10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 border border-amber-400/40 text-[8px] font-black uppercase text-amber-300">
                      {selectedArtStyle}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/60 border border-white/60 text-[8px] font-extrabold uppercase tracking-wider text-white">
                      A Day Back Then
                    </span>
                  </div>
                  <div className="bg-black/85 border-2 border-amber-400 rounded-xl p-2 text-center shadow-lg">
                    <p className="text-xs font-black uppercase text-white leading-tight">
                      {currentScript?.hook || topicInput.slice(0, 42) || "Did You Know?"}
                    </p>
                  </div>
                </div>

                {/* Middle Dialogue / Caption Preview */}
                <div className="relative z-10 my-auto text-center px-1">
                  <span className="inline-block bg-black/80 border border-white/10 px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold text-amber-300 shadow-lg leading-snug">
                    {currentScript?.scenes?.[previewSceneIndex]?.text
                      ? currentScript.scenes[previewSceneIndex].text.slice(0, 80) + "..."
                      : "Your narrator performs with automatic lip-sync & gestures..."}
                  </span>
                </div>

                {/* Grounded Authentic Vector Cartoon Narrator */}
                <div className="relative z-10 flex justify-center items-end pt-2">
                  <NarratorPreview
                    theme={selectedTheme}
                    tunicColor={selectedTunic || undefined}
                    accentColor={selectedAccent || undefined}
                    size={205}
                    gesture="explain"
                  />
                </div>
              </div>

              {/* Scene Switcher Chips (when script scenes exist) */}
              {currentScript && currentScript.scenes.length > 0 && (
                <div className="w-full mt-3 flex items-center justify-center gap-1.5 flex-wrap">
                  {currentScript.scenes.map((_, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setPreviewSceneIndex(sIdx)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold transition ${
                        previewSceneIndex === sIdx
                          ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      Scene {sIdx + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Summary Badges Below Phone Preview */}
              <div className="w-full mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Art Style:</span>
                  <span className="font-bold text-white">{selectedArtStyle}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Narrator Dress:</span>
                  <span className="font-bold text-amber-300 uppercase">{selectedTheme}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Voice:</span>
                  <span className="font-bold text-emerald-300">
                    {voices.find((v) => v.id === selectedVoice)?.name || selectedVoice}
                  </span>
                </div>
              </div>

              {/* Quick Render Action Button in Preview Column */}
              <button
                type="button"
                disabled={Boolean(busyAction)}
                onClick={handleFullAutoProduce}
                className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <span>🎬</span>
                <span>{currentScript ? "Render Video Now" : "1-Click Produce Video"}</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: MY VIDEOS VAULT & 1-TAP SOCIAL PUBLISHER                       */}
      {/* ===================================================================== */}
      {activeTab === "vault" && (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-white">🎬 My Rendered Videos Vault</h2>
              <p className="text-xs text-slate-400">
                Preview, download MP4s to your phone, or 1-tap schedule to YouTube & Instagram
              </p>
            </div>
            <button
              onClick={loadVaultAndJobs}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
            >
              🔄 Refresh Vault
            </button>
          </div>

          {/* Vault Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2.5">
            {[
              {id: "all", label: `🌟 All Videos (${vaultVideos.length})`},
              {
                id: "filipino",
                label: `🇵🇭 Filipino / Tagalog (${
                  vaultVideos.filter((v) => {
                    const s = (v.slug || "").toLowerCase();
                    return s.includes("kapre") || s.includes("mangkukulam") || s.includes("aswang") || s.includes("manananggal") || s.includes("tikbalang") || s.includes("bakunawa") || s.includes("balete") || s.includes("biringan") || s.includes("philippine") || s.includes("filipino");
                  }).length
                })`,
              },
              {id: "folklore", label: "🕯️ Dark Folklore & Horror"},
              {id: "history", label: "🏛️ World History & Battles"},
              {
                id: "long",
                label: `📺 Longform 16:9 (${vaultVideos.filter((v) => v.isLong).length})`,
              },
            ].map((vc) => (
              <button
                key={vc.id}
                type="button"
                onClick={() => setSelectedVaultCategory(vc.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedVaultCategory === vc.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <span>{vc.label}</span>
              </button>
            ))}
          </div>

          {vaultVideos.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center">
              <p className="text-sm text-slate-300 font-bold">No rendered videos in out/ yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Go to the Create Story tab to generate your first video!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vaultVideos
                .filter((v) => {
                  if (selectedVaultCategory === "all") return true;
                  const s = (v.slug || "").toLowerCase();
                  const isPh =
                    s.includes("kapre") ||
                    s.includes("mangkukulam") ||
                    s.includes("aswang") ||
                    s.includes("manananggal") ||
                    s.includes("tikbalang") ||
                    s.includes("bakunawa") ||
                    s.includes("balete") ||
                    s.includes("biringan") ||
                    s.includes("philippine") ||
                    s.includes("filipino");
                  if (selectedVaultCategory === "filipino") return isPh;
                  if (selectedVaultCategory === "long") return v.isLong;
                  if (selectedVaultCategory === "folklore")
                    return !isPh && (s.includes("witch") || s.includes("spooky") || s.includes("curse") || s.includes("ghost") || s.includes("plague") || s.includes("demon") || s.includes("creature"));
                  if (selectedVaultCategory === "history")
                    return s.includes("roman") || s.includes("gladiator") || s.includes("viking") || s.includes("wwii") || s.includes("pirate") || s.includes("victorian") || s.includes("ottoman") || s.includes("aztec") || s.includes("maya");
                  return true;
                })
                .map((v) => (
                <div
                  key={v.slug}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-sm text-white truncate">{v.slug}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {v.sizeMB} MB • {Math.round(v.durationSec)}s
                      </span>
                    </div>

                    {previewVideoSlug === v.slug ? (
                      <video
                        controls
                        autoPlay
                        src={`/api/video/${encodeURIComponent(v.slug)}`}
                        className="w-full aspect-[9/16] max-h-72 rounded-xl bg-black border border-slate-700"
                      />
                    ) : (
                      <button
                        onClick={() => setPreviewVideoSlug(v.slug)}
                        className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 flex flex-col items-center justify-center gap-2 transition"
                      >
                        <span className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                          ▶
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          Tap to Preview Video
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Download & Social Publish Actions */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`/api/video/${encodeURIComponent(v.slug)}`}
                        download={`${v.slug}.mp4`}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-center text-xs font-bold text-white"
                      >
                        ⬇️ Save MP4
                      </a>
                      <button
                        onClick={() => handlePublishVideo(v.slug, "youtube")}
                        className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
                      >
                        📺 YouTube
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: RENDER & PUBLISH QUEUE                                         */}
      {/* ===================================================================== */}
      {activeTab === "jobs" && (
        <main className="max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">🚀 Active & Recent Jobs</h2>
              <p className="text-xs text-slate-400">
                Real-time Remotion rendering and social publishing logs
              </p>
            </div>
            <button
              onClick={loadVaultAndJobs}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
            >
              🔄 Refresh
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
              No render or publish jobs recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((j) => (
                <div
                  key={j.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-white">
                        {j.kind.toUpperCase()} — {j.slug}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">{j.id}</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        j.status === "done"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : j.status === "running"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {j.status.toUpperCase()} ({j.progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{width: `${j.progress}%`}}
                    />
                  </div>
                  {j.log && j.log.length > 0 && (
                    <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 max-h-36 overflow-y-auto font-mono">
                      {j.log.slice(-12).join("\n")}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* TAB: ANALYTICS (real YouTube/Meta data + heartbeat + intents)         */}
      {/* ===================================================================== */}
      {activeTab === "analytics" && (
        <main className="max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">📊 Channel Analytics</h2>
              <p className="text-xs text-slate-400">
                Real numbers from the YouTube Analytics/Data APIs and Meta Graph
                {analyticsData?.fetchedAt
                  ? ` • updated ${new Date(analyticsData.fetchedAt).toLocaleString()}`
                  : ""}
              </p>
            </div>
            <button
              onClick={() => loadAnalytics(true)}
              disabled={analyticsLoading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white disabled:opacity-50"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Live status from the heartbeat feed (bolealabs.site/status.json) */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <span className="font-bold text-slate-300">🫀 Live status</span>
            {heartbeatData ? (
              <>
                <span>
                  Dashboard:{" "}
                  <b className={heartbeatData.dashboard === "up" ? "text-emerald-400" : "text-red-400"}>
                    {String(heartbeatData.dashboard ?? "unknown")}
                  </b>
                </span>
                <span>
                  24/7 Stream:{" "}
                  <b className={heartbeatData.stream === "live" ? "text-emerald-400" : "text-red-400"}>
                    {String(heartbeatData.stream ?? "unknown")}
                  </b>
                </span>
                <span className="text-slate-500">
                  updated {heartbeatData.updated_at ? new Date(heartbeatData.updated_at).toLocaleString() : "—"}
                </span>
              </>
            ) : (
              <span className="text-slate-500">Heartbeat feed unavailable — showing API data only.</span>
            )}
          </div>

          {!analyticsData && analyticsLoading && <p className="text-sm text-slate-400">Loading analytics…</p>}

          {analyticsData && !analyticsData.configured?.youtube && !analyticsData.configured?.meta && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
              <h3 className="font-black text-white">Analytics not configured</h3>
              <p className="text-sm text-slate-400">
                Set <code className="text-amber-300">YT_TOKENS_JSON</code> (YouTube OAuth token JSON) and/or{" "}
                <code className="text-amber-300">META_PAGE_TOKEN</code> in the server environment to light this tab
                up. See <code className="text-amber-300">dashboard/WEB_DEPLOY.md</code>.
              </p>
            </div>
          )}

          {analyticsData?.youtube && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {label: "Views (28 days)", value: analyticsData.youtube.last28Days.views.toLocaleString()},
                  {label: "Watch hours (28 days)", value: analyticsData.youtube.last28Days.watchHours.toLocaleString()},
                  {
                    label: "Avg view duration",
                    value: `${analyticsData.youtube.last28Days.avgViewDurationSec}s`,
                  },
                  {
                    label: "Subscribers",
                    value: `${analyticsData.youtube.subscribers.toLocaleString()} (${
                      analyticsData.youtube.last28Days.subsDelta >= 0 ? "+" : ""
                    }${analyticsData.youtube.last28Days.subsDelta} / 28d)`,
                  },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 font-bold">{card.label}</p>
                    <p className="text-2xl font-black text-white mt-1">{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                <h3 className="font-black text-white mb-3">
                  🏆 Top videos by watch time — {analyticsData.youtube.channelTitle}
                </h3>
                <div className="space-y-2">
                  {analyticsData.youtube.topVideos.map((v: any) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between gap-3 text-sm border-b border-slate-800/60 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-slate-200 font-medium truncate">{v.title}</span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {v.views.toLocaleString()} views • {v.watchHours}h watched • {v.avgViewDurationSec}s avg
                      </span>
                    </div>
                  ))}
                  {analyticsData.youtube.topVideos.length === 0 && (
                    <p className="text-sm text-slate-500">No watch-time data in the last 28 days.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {analyticsData?.meta && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-bold">Facebook followers</p>
                <p className="text-2xl font-black text-white mt-1">{analyticsData.meta.fbFollowers ?? "—"}</p>
                <p className="text-xs text-slate-500">{analyticsData.meta.pageName ?? ""}</p>
              </div>
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-bold">Instagram followers</p>
                <p className="text-2xl font-black text-white mt-1">{analyticsData.meta.igFollowers ?? "—"}</p>
                <p className="text-xs text-slate-500">
                  {analyticsData.meta.igUsername ? `@${analyticsData.meta.igUsername}` : ""}
                </p>
              </div>
            </div>
          )}

          {analyticsData?.errors?.length > 0 && (
            <div className="rounded-2xl bg-red-950/40 border border-red-900 p-4 text-sm text-red-200 space-y-1">
              {analyticsData.errors.map((e: any, i: number) => (
                <p key={i}>
                  ⚠️ {e.source}: {e.message}
                </p>
              ))}
            </div>
          )}

          {/* Intents outbox — in web mode these are executed via the bridge */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <h3 className="font-black text-white mb-2">
              📥 Queued intents{" "}
              {analyticsData?.mode === "web" ? (
                <span className="text-xs text-slate-400 font-medium">(web mode — executed by the machine side via the bridge)</span>
              ) : null}
            </h3>
            {intentsData.length === 0 ? (
              <p className="text-sm text-slate-500">No intents queued.</p>
            ) : (
              <div className="space-y-1.5">
                {intentsData.slice(0, 10).map((it: any) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-3 text-xs border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0"
                  >
                    <span className="font-mono text-amber-300">{it.type}</span>
                    <span className="text-slate-500">
                      {new Date(it.createdAt).toLocaleString()} • via {it.queued_via}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: COMPREHENSIVE SETTINGS, FREELLMAPI & INTEGRATIONS              */}
      {/* ===================================================================== */}
      {activeTab === "settings" && (
        <main className="max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">
              ⚙️ Studio Settings, FreeLLMAPI & Social Credentials
            </h2>
            <p className="text-xs text-slate-400">
              Enter your free API keys, social tokens, and Laptop-Off Cloud Render settings in one place. All keys are stored encrypted/mode-600 on the server.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* 1. FreeLLMAPI Gateway & Multi-Provider Pool */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-amber-400">
                    ⚡ 1. FreeLLMAPI & Multi-Provider AI Pool ($0 Token Aggregation)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Connect your self-hosted FreeLLMAPI gateway OR add free provider keys directly for automatic 429 failover. Works out-of-the-box with Pollinations Zero-Key AI!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestLLM}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  ⚡ Test AI Connection
                </button>
              </div>

              {llmTestResult && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    llmTestResult.ok
                      ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/60 border-rose-500/40 text-rose-200"
                  }`}
                >
                  {llmTestResult.ok ? (
                    <>
                      ✅ <strong>Active Provider:</strong> {llmTestResult.provider} (
                      {llmTestResult.model}) • <strong>Latency:</strong> {llmTestResult.latencyMs}ms
                    </>
                  ) : (
                    <>❌ {llmTestResult.error}</>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    FreeLLMAPI Gateway URL
                  </label>
                  <input
                    type="text"
                    value={keyInputs.FREELLMAPI_URL}
                    onChange={(e) =>
                      setKeyInputs({...keyInputs, FREELLMAPI_URL: e.target.value})
                    }
                    placeholder="http://localhost:3001/v1"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      FreeLLMAPI Unified Master Key
                    </label>
                    <span className="text-[11px] text-emerald-400">
                      {settingsData?.keys?.FREELLMAPI_KEY?.masked || "Optional"}
                    </span>
                  </div>
                  <input
                    type="password"
                    value={keyInputs.FREELLMAPI_KEY}
                    onChange={(e) =>
                      setKeyInputs({...keyInputs, FREELLMAPI_KEY: e.target.value})
                    }
                    placeholder="freellmapi-..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    key: "GROQ_API_KEY",
                    label: "Groq API Key (Free 800 tok/s Llama 3.3)",
                    url: "https://console.groq.com/keys",
                    placeholder: "gsk_...",
                  },
                  {
                    key: "CEREBRAS_API_KEY",
                    label: "Cerebras API Key (Free 1800 tok/s)",
                    url: "https://cloud.cerebras.ai/",
                    placeholder: "csk-...",
                  },
                  {
                    key: "GEMINI_API_KEY",
                    label: "Google Gemini AI Studio Key (Script + Image + TTS)",
                    url: "https://aistudio.google.com/apikey",
                    placeholder: "AIzaSy...",
                  },
                  {
                    key: "OPENROUTER_API_KEY",
                    label: "OpenRouter API Key (Free Models Pool)",
                    url: "https://openrouter.ai/keys",
                    placeholder: "sk-or-v1-...",
                  },
                  {
                    key: "MISTRAL_API_KEY",
                    label: "Mistral Free Tier API Key",
                    url: "https://console.mistral.ai/api-keys/",
                    placeholder: "Mistral key...",
                  },
                  {
                    key: "HF_API_KEY",
                    label: "Hugging Face Token (Free FLUX.1 Image Gen)",
                    url: "https://huggingface.co/settings/tokens",
                    placeholder: "hf_...",
                  },
                ].map((item) => {
                  const status = settingsData?.keys?.[item.key];
                  return (
                    <div key={item.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-300">{item.label}</label>
                        <div className="flex items-center gap-2">
                          {status?.isSet && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              ✓ {status.masked}
                            </span>
                          )}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-amber-400 hover:underline font-semibold"
                          >
                            Get Free Key ↗
                          </a>
                        </div>
                      </div>
                      <input
                        type="password"
                        value={keyInputs[item.key] || ""}
                        onChange={(e) =>
                          setKeyInputs({...keyInputs, [item.key]: e.target.value})
                        }
                        placeholder={status?.isSet ? "Saved (enter new key to replace)" : item.placeholder}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Default Image & Voice Engine Selectors */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-extrabold text-amber-400">
                🎨 2. Default Artwork & Voice Synthesis Engines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Background Image Engine
                  </label>
                  <select
                    value={keyInputs.IMAGE_PROVIDER}
                    onChange={(e) =>
                      setKeyInputs({...keyInputs, IMAGE_PROVIDER: e.target.value})
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="auto">
                      ⚡ Auto Failover (Gemini → HuggingFace Flux → Pollinations Flux $0)
                    </option>
                    <option value="pollinations">
                      🌸 Pollinations.ai Flux (100% Free, Zero API Key Required)
                    </option>
                    <option value="gemini">🎨 Google Gemini Image Generation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Voiceover Synthesis Engine
                  </label>
                  <select
                    value={keyInputs.VOICE_PROVIDER}
                    onChange={(e) =>
                      setKeyInputs({...keyInputs, VOICE_PROVIDER: e.target.value})
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="edge">
                      🎙️ Free Neural TTS (100% Free, Zero Key Needed)
                    </option>
                    <option value="gemini">✨ Google Gemini Studio TTS</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Social Publishing Connections */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-extrabold text-amber-400">
                📺 3. Social Publishing Setup (YouTube, Instagram, Facebook)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-white">📺 YouTube Channel</div>
                  <div
                    className={`text-xs font-bold mt-1 ${
                      settingsData?.social?.youtubeAuthorized
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {settingsData?.social?.youtubeAuthorized
                      ? "✅ Connected & Verified"
                      : "⚠️ Needs Authorization"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-white">📸 Instagram & Facebook</div>
                  <div
                    className={`text-xs font-bold mt-1 ${
                      settingsData?.social?.metaTokenSet ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {settingsData?.social?.metaTokenSet
                      ? "✅ Meta Token Saved"
                      : "Not Configured Yet"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-white">🎵 TikTok Session</div>
                  <div
                    className={`text-xs font-bold mt-1 ${
                      settingsData?.social?.tiktokSessionReady
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {settingsData?.social?.tiktokSessionReady
                      ? "✅ Session Saved"
                      : "Run login-tiktok.bat"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Facebook Page ID
                  </label>
                  <input
                    type="text"
                    value={keyInputs.fbPageId}
                    onChange={(e) => setKeyInputs({...keyInputs, fbPageId: e.target.value})}
                    placeholder="e.g. 1234567890"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Instagram Business Account ID
                  </label>
                  <input
                    type="text"
                    value={keyInputs.igUserId}
                    onChange={(e) => setKeyInputs({...keyInputs, igUserId: e.target.value})}
                    placeholder="e.g. 1784140..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Meta Long-Lived Page Access Token
                  </label>
                  <input
                    type="password"
                    value={keyInputs.fbPageAccessToken}
                    onChange={(e) =>
                      setKeyInputs({...keyInputs, fbPageAccessToken: e.target.value})
                    }
                    placeholder="EAA..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Optional: Paste YouTube `client_secret.json` Content (Already Configured!)
                </label>
                <textarea
                  rows={2}
                  value={keyInputs.youtubeClientSecretJson}
                  onChange={(e) =>
                    setKeyInputs({...keyInputs, youtubeClientSecretJson: e.target.value})
                  }
                  placeholder='{"installed":{"client_id":"...","client_secret":"..."}}'
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* 4. Laptop-Off Cloud Render Worker */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-amber-400">
                  ☁️ 4. "Laptop-Off" Cloud Render Worker ($0 GitHub Actions 16GB RAM Engine)
                </h3>
                <p className="text-xs text-slate-400">
                  When deployed to Vercel, configure your GitHub repo and Personal Access Token so tapping "Cloud Render" on your phone renders the video on GitHub's servers even when your laptop is powered off.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    GitHub Repository (`owner/repo`)
                  </label>
                  <input
                    type="text"
                    value={keyInputs.GITHUB_REPO}
                    onChange={(e) => setKeyInputs({...keyInputs, GITHUB_REPO: e.target.value})}
                    placeholder="e.g. yourusername/a-day-back-then-automation"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    GitHub Personal Access Token (`repo` + `workflow` scope)
                  </label>
                  <input
                    type="password"
                    value={keyInputs.GITHUB_TOKEN}
                    onChange={(e) => setKeyInputs({...keyInputs, GITHUB_TOKEN: e.target.value})}
                    placeholder="ghp_..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {tunnelInfo && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-300">📶 Home Wi-Fi Phone URL: </span>
                    <span className="text-amber-400 font-mono">{tunnelInfo.localUrl}</span>
                    {tunnelInfo.url && (
                      <div className="mt-1">
                        <span className="font-bold text-emerald-400">🌐 Public Mobile URL: </span>
                        <a
                          href={tunnelInfo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-300 underline font-mono"
                        >
                          {tunnelInfo.url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={Boolean(busyAction)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                💾 Save All Settings & Keys
              </button>
            </div>
          </form>
        </main>
      )}

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0e17]/95 backdrop-blur-xl border-t border-slate-800 grid grid-cols-5 py-2 px-2">
        {[
          {id: "create", icon: "✨", label: "Create"},
          {id: "vault", icon: "🎬", label: `Videos (${vaultVideos.length})`},
          {id: "jobs", icon: "🚀", label: "Queue"},
          {id: "settings", icon: "⚙️", label: "Settings"},
          {id: "analytics", icon: "📊", label: "Analytics"},
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-bold ${
              activeTab === item.id ? "text-amber-400" : "text-slate-400"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Login / Register Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">
                {authMode === "login" ? "👤 Sign In to Studio" : "✨ Create Creator Account"}
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`py-2 rounded-lg text-xs font-bold ${
                  authMode === "login" ? "bg-amber-500 text-slate-950" : "text-slate-400"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`py-2 rounded-lg text-xs font-bold ${
                  authMode === "register" ? "bg-amber-500 text-slate-950" : "text-slate-400"
                }`}
              >
                Register New Account
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Creator Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Christian"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                {authLoading
                  ? "Please wait..."
                  : authMode === "login"
                  ? "Sign In"
                  : "Create Account & Enter Studio"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
