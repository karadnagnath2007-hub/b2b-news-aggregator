# Project Manifest: B2B Intel Aggregator (Production Spec)
Version: 1.0.0
Author: System Architect & Karad Nagnath Vishnu
Target Builder Agent: DeepSeek V4 Pro / Cursor Agent

---

## 1. 🚨 STIRCT TOKEN-SAVING & ANTI-LOOP PROTOCOL (READ THIS FIRST)
To prevent infinite looping, excessive file re-reads, and runaway API request limits, the agent MUST strictly adhere to these rules:
1. **Micro-Steps Only:** You may only complete ONE sub-step at a time (e.g., Step 1.1). Once done, stop, show your progress, and wait for user confirmation.
2. **No Whole-File Rewrites:** If a file is over 50 lines long, do not rewrite the entire file to make a small change. Use targeted line replacements or specific function updates.
3. **No Automatic Terminal Loops:** If a command (`npm i`, `prisma migrate`, `npm run dev`) throws an error, you are forbidden from trying to fix it automatically in a loop. Stop immediately, report the error, and ask the user for direction.
4. **Read Once, Remember Always:** Do not repeatedly read the same file across multiple conversation turns. Cache the file structure in your context.
5. **No Useless API Probing:** Do not call external APIs or build mock test suites that make network requests unless explicitly commanded.

---

## 2. PROJECT ARCHITECTURE OVERVIEW

### Core Tech Stack
| Layer | Technology | Specification |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | TypeScript, Tailwind CSS, Strict Linting |
| **Database** | PostgreSQL | Hosted via Supabase or Neon |
| **ORM** | Prisma ORM | Type-safe queries, migration control |
| **AI Layer** | Anthropic Claude API | Server-side SDK processing only |
| **Styling** | Financial Newspaper | Playfair Display (Serif), Source Serif 4, Cream tones |

### Directory Mapping Goal
## 3. PHASED STEP-BY-STEP IMPLEMENTATION PLAN

### 🛑 CURRENT FOCUS: PHASE 1 (FRONTEND FROM SCRATCH)
*Do not look at Phase 2 or Phase 3 code structures until Phase 1 is marked 100% complete by the user.*

#### Step 1.1: Environment Initialization
- Initialize a brand new Next.js 14+ application using TypeScript, Tailwind CSS, and the App Router.
- Set up `app/layout.tsx` to load Google Fonts: **Playfair Display** (for elegant headers) and **Source Serif 4** (for dense body text).
- Define global theme variables in `tailwind.config.js` for the paper aesthetic:
  - Background: `cream-paper` (`#fdfbf7`)
  - Borders: `hairline-stone` (`border-[0.5px] border-stone-300`)
- **Stop and output:** `[STEP 1.1 COMPLETE] Layout and Tailwind initialized. Awaiting permission.`

#### Step 1.2: Dynamic Ad Architecture Config
- Create a static configurations folder: `/config/ads-config.json`.
- Populate it with the following blueprint structure:
```json
{
  "ad_settings": { "disable_all_ads_for_premium": true },
  "placements": {
    "text_sponsor_line": { "type": "direct", "active": true, "content": { "text": "Sponsor: Optimize logistics with FlexChain AI.", "link": "#" } },
    "native_sponsored_card": { "type": "adsense", "active": true, "content": {} },
    "banner_ad": { "type": "direct", "active": true, "content": { "image_url": "/banner.png", "link": "#" } }
  }
}