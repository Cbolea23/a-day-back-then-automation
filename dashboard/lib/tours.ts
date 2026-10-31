export interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
  };
  tab?: "schedule" | "analytics" | "create" | "vault" | "jobs" | "settings";
  channel?: "kwentong-pinoy" | "adaybackthen" | "genesis-to-glory";
}

export interface TourDefinition {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  steps: TourStep[];
}

export const TOURS: Record<string, TourDefinition> = {
  orientation: {
    id: "orientation",
    title: "Quick Studio Orientation",
    description: "Learn the core navigation, multi-channel system, and operating tabs in 2 minutes.",
    estimatedMinutes: 2,
    steps: [
      {
        element: '[data-tour="channel-selector"]',
        popover: {
          title: "Multi-Channel Architecture",
          description: "Switch seamlessly between your channels: Kwentong Pinoy (Priority / Taglish), A Day Back Then (Global / English), and Genesis to Glory (Standby). All schedules and analytics reload dynamically.",
          side: "bottom",
          align: "start"
        }
      },
      {
        element: '[data-tour="schedule-tab"]',
        tab: "schedule",
        popover: {
          title: "Native Cloud Schedule",
          description: "See all armed videos staged directly on YouTube and Meta servers. Posts release automatically even when your laptop is turned off.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="analytics-tab"]',
        tab: "analytics",
        popover: {
          title: "Live Analytics & Baselines",
          description: "Monitor real-time views, watch time, and subscriber growth measured against official launch baselines.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="create-tab"]',
        tab: "create",
        popover: {
          title: "Story & Video Creator",
          description: "Draft scripts, select cultural art styles, choose narrator costumes, and queue automated Remotion renders.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="vault-tab"]',
        tab: "vault",
        popover: {
          title: "Media Vault & Publishing Lanes",
          description: "Preview rendered MP4s, download mobile assets, and verify posting lanes (YouTube & Facebook via Antigravity, Instagram via Muse).",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="guide-button"]',
        popover: {
          title: "Interactive Guide Launcher",
          description: "You can reopen any guided tour or review the end-to-end pipeline at any time from this button.",
          side: "bottom",
          align: "end"
        }
      }
    ]
  },

  schedule: {
    id: "schedule",
    title: "Schedule & Runway Monitor",
    description: "Understand buffer health, gap detection, and how cloud queues execute autonomously.",
    estimatedMinutes: 3,
    steps: [
      {
        element: '[data-tour="target-channel-card"]',
        tab: "schedule",
        popover: {
          title: "Active Channel & Identity",
          description: "Confirms which brand you are inspecting, including handle (@kwentongpinoylore) and priority tier.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="armed-posts-card"]',
        tab: "schedule",
        popover: {
          title: "Armed Video Counter",
          description: "Tracks exact video inventory loaded into YouTube Studio and Meta Business Suite.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="buffer-health-card"]',
        tab: "schedule",
        popover: {
          title: "Buffer Runway & Gap Detection",
          description: "Calculates how many days of scheduled daily content remain. When runway drops to 3 days or fewer, an alert triggers to order the next wave of scripts from Muse.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="posting-lanes-card"]',
        tab: "schedule",
        popover: {
          title: "Dual-Agent Posting Split",
          description: "Enforces strict channel governance: Antigravity posts Facebook & YouTube; Muse owns Instagram (and TikTok once approved). Prevents duplicate posts.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="schedule-table"]',
        tab: "schedule",
        popover: {
          title: "14-Day Timeline Grid",
          description: "Lists every scheduled video with direct links to the scheduled YouTube Short and Facebook Reel, plus the expected Instagram slot for Muse.",
          side: "top"
        }
      }
    ]
  },

  analytics: {
    id: "analytics",
    title: "Analytics & Growth Tracking",
    description: "How to interpret retention, views, and compare against the Day 0 launch baseline.",
    estimatedMinutes: 2,
    steps: [
      {
        element: '[data-tour="day0-baseline"]',
        tab: "analytics",
        channel: "kwentong-pinoy",
        popover: {
          title: "Official Day 0 Baseline",
          description: "Records Kwentong Pinoy's numbers at Wave A launch (Oct 31, 2026: 5 subs, 2,560 views, 3 launch videos) so all growth is measured cleanly.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="analytics-overview"]',
        tab: "analytics",
        popover: {
          title: "28-Day Channel Trajectory",
          description: "Tracks net subscriber deltas, watch hours, average percentage viewed (APV), and shares across connected APIs.",
          side: "top"
        }
      }
    ]
  },

  pipeline: {
    id: "pipeline",
    title: "End-to-End Pipeline Walkthrough",
    description: "The complete journey from idea to live post under the Oct 31 operating rules.",
    estimatedMinutes: 4,
    steps: [
      {
        element: '[data-tour="channel-selector"]',
        tab: "schedule",
        popover: {
          title: "Step 1: Planning & Scripting (Muse)",
          description: "Muse plans stories, generates 5 scene backgrounds, synthesizes voice, and prepares Tagalog/Taglish copy packages.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="posting-lanes-card"]',
        tab: "schedule",
        popover: {
          title: "Step 2: Google Drive Handover",
          description: "All media lives on Google Drive ('Muse and atigravity handover'). Media binaries are never committed to git.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="queue-tab"]',
        tab: "jobs",
        popover: {
          title: "Step 3: Rendering (Antigravity)",
          description: "Antigravity downloads raw assets from Drive, runs Remotion 1080x1920 renders with synced kinetic typography, and parks finished videos for review.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="schedule-tab"]',
        tab: "schedule",
        popover: {
          title: "Step 4: Christian's Review Gate",
          description: "Nothing ever publishes without Christian's explicit approval. Christian inspects parked renders and authorizes the start date.",
          side: "bottom"
        }
      },
      {
        element: '[data-tour="schedule-table"]',
        tab: "schedule",
        popover: {
          title: "Step 5: Cloud Scheduling & Cross-Posting",
          description: "Antigravity stages YouTube Shorts (20:00 PHT) and Facebook Reels (21:00 PHT) natively. Muse picks up files from Drive for Instagram next day (12:00 PHT).",
          side: "top"
        }
      }
    ]
  }
};
