# ⚖️ Judite — Multi-Agent Legal Intelligence Platform

> 🇧🇷 [Leia em Português](./README.md)

**Judite** is a multi-agent AI platform specialized in legal intelligence, with a decoupled engine and omnichannel architecture. She operates via **WhatsApp**, **Telegram**, and a **Web Dashboard** ("Pauta") — all connected to **Supabase** as the cloud backend. A built-in **Web Chat** lets users interact with Judite directly in the browser via Supabase Realtime.

Built as a modular platform, Judite orchestrates **multiple specialized agents** (legal analysis, OAB compliance, government cross-referencing, autonomous marketing) via hot-reload Skills. The AI engine is **decoupled** — easy to pivot to any niche (legal, dental, accounting).

---

## ✨ Key Features

- 📱 **Omnichannel (Telegram, WhatsApp, Web Chat):** Chat via text or voice, send documents, receive PDFs back — seamless context across all channels. Web Chat uses Supabase Realtime queue for async communication.
- ⚙️ **Native EvolutionAPI Integration:** WhatsApp embedded via PM2 with Judite's own parallel Webhook Server. No Docker, zero latency.
- 🌐 **Pauta (Web Dashboard):** Document management with uploads, KPIs, analysis, and settings (Next.js 15 + React 19).
- ☁️ **Integrated Cloud:** Bot and Dashboard share the same data via Supabase (Auth, Database, Storage with RLS).
- 🧠 **Multi-LLM with Fallback:** 10+ AI models orchestrated (DeepSeek, Gemini, Groq, Claude, Qwen, MiniMax, Kimi and others via OpenRouter). Switch in real-time via `/api` and `/modelo`.
- 🎯 **Native ReAct Reasoning:** Agent loop with Tool Tracing — executes tools in logical turns.
- 🎤 **Bidirectional Voice:** STT via Groq Whisper (Gemini fallback) + TTS with 3 tones (casual, formal, warm).
- 📄 **Native DOCX:** Generates and reads Word files compatible with desktop (`docx` + `mammoth`).
- 💾 **Persistent Memory:** History, provider, model, and voice tone saved in Supabase per user.
- 🔌 **Skills via Hot-Reload:** Edit a skill file and Judite reloads it without restart.
- 🔍 **Duplicate Detection:** Automatic detection of duplicate documents in the cloud.

### 🏛️ Government & International Law Intelligence
- **Brazilian Government Data (Pro):** Direct access to 41 public APIs (326 tools) — DataJud/CNJ, STF, Congress, Central Bank. Proactively cross-references CNPJ, CPF, ZIP codes, and case law during analysis.
- **US Case Law (CourtListener):** Search 140K+ US court opinions, dockets, and RECAP documents via the Free Law Project API.
- **US Federal Regulations (eCFR):** Daily-updated Code of Federal Regulations — all 50 titles.
- **Federal Register:** Official proposed rules, final rules, and executive orders.
- **US Code (GovInfo/GPO):** Federal statutes and official documents.
- **EU Legislation (EUR-Lex):** European regulations, directives, and GDPR via SPARQL.

### 🔗 Blockchain & Web3
- **Blockchain Notarization (Solana):** Every legal analysis receives an on-chain integrity seal (SHA-256 via Memo Program). Public page `/verify/[tx]` allows anyone to verify authenticity.
- **B2B/B2C Monetization (Solana Pay + x402 + cNFT):** Stateless API (`/v1/analyze`) protected by x402 middleware (paywall). Requires USDC transaction signature. Frontend (B2C) issues a **Compressed NFT** via Metaplex as a permanent audit receipt in the user's collectibles.
- **Crypto Pass ($29.90 USDC = 30 days Pro):** Decentralized subscription — pay $29.90 USDC via Solana Pay to unlock 30 days of Pro access (12,000 credits + 20% bonus, all features). No intermediary.

### 🗺️ Solana Integration Map (for Hackathon Judges)

> Quick reference to every file where Solana blockchain is integrated.

| Feature | File | Description |
|---------|------|-------------|
| **x402 Paywall Middleware** | [`src/api/server.ts`](./src/api/server.ts) | Express middleware that validates USDC payment signatures before granting API access |
| **USDC Payment Verification** | [`src/services/SolanaPaymentService.ts`](./src/services/SolanaPaymentService.ts) | Verifies SPL token transfers on-chain (amount, receiver, token mint) |
| **On-Chain Notarization** | [`src/services/SolanaNotaryService.ts`](./src/services/SolanaNotaryService.ts) | SHA-256 hash + Memo Program recording for tamper-proof audit trails |
| **cNFT Certificate Minting** | [`src/services/SolanaCNFTService.ts`](./src/services/SolanaCNFTService.ts) | Compressed NFT via Metaplex Bubblegum — verifiable receipt at ~$0.001 |
| **Crypto Pass (Subscription)** | [`src/services/SolanaPaymentService.ts`](./src/services/SolanaPaymentService.ts) | $29.90 USDC → 30 days Pro access, no intermediary |
| **Frontend Wallet (Phantom)** | [`dashboard/src/app/analyze/page.tsx`](./dashboard/src/app/analyze/page.tsx) | Phantom wallet connect + USDC transfer + cNFT minting UI |
| **Blockchain Verify Page** | [`dashboard/src/app/verify/[tx]/page.tsx`](./dashboard/src/app/verify/[tx]/page.tsx) | Public page to verify analysis integrity via Solana explorer |
| **Wallet Generator Script** | [`scripts/generate-solana-wallet.ts`](./scripts/generate-solana-wallet.ts) | Utility to generate Solana keypairs for deployment |

#### 🔌 x402 API — Pay-Per-Request Legal Intelligence

```
POST https://api.usejudite.com.br/v1/analyze
```

| Header / Param | Value | Description |
|----------------|-------|-------------|
| `x-solana-tx` | `<signature>` | Solana transaction signature (USDC transfer) |
| `expert` | `true/false` | Deep analysis mode ($0.25) vs fast ($0.10) |
| `source` | `social_link` | Identifies B2C social link usage |

**Flow:** Client pays USDC → includes TX signature in header → middleware verifies on-chain → AI analyzes → response includes `blockchain_proof` with notarization hash.

#### 🏗️ Deployment Architecture

| Component | Host | Tech |
|-----------|------|------|
| **Dashboard (Frontend)** | Vercel | Next.js 15 + React 19 |
| **API + Bot (Backend)** | Contabo VPS | Node.js + PM2 + Apache Reverse Proxy |
| **MiroFish (Compliance)** | Contabo VPS | Python/Flask |
| **MCP Brasil (Gov APIs)** | Contabo VPS | Python/FastMCP |
| **Database** | Supabase Cloud | PostgreSQL + Auth + Storage + Realtime |

### 🛡️ Compliance & Quality
- **Automatic OAB Compliance (MiroFish):** All content generated by Judite — contracts, analyses, and social posts — goes through automated audit via `/api/audit` (Qwen Plus). Checks OAB ethics, LGPD, cancellation risk, and quality. Cost: ~$0.002/audit.
- **Official Source Badges:** PDFs, DOCX, and TXT automatically include visual badges with consulted government sources.

### 📈 Autonomous Growth Engine (Judite Marketer)
3-stage scheduled pipeline (Strategist → Copywriter → OAB Compliance) that researches web trends, generates multi-platform content (Twitter/X, LinkedIn, Facebook, Instagram + SEO Blog), with AI-generated images, human approval in Dashboard, and 1-Click publishing via Graph API.

---

## 🧠 AI Stack

| Function | Model(s) | Rationale |
|----------|----------|-----------|
| **Chat + Analysis** | 10+ LLMs orchestrated (DeepSeek, Gemini, Qwen, etc.) | Automatic fallback, cost-optimized |
| **STT (Voice → Text)** | Groq Whisper large-v3 | Fastest and most accurate, Gemini fallback |
| **Voice OGG / Telegram** | Edge TTS (Microsoft) + Qwen3 (Alibaba) | Custom PT-BR native tones |
| **⚡ Expert Mode** | Dynamic chain (MiniMax, Qwen, Claude, etc.) | Multi-API chain managed via Dashboard |
| **Documents** | PDF (Puppeteer) + DOCX (native `docx` package) | Desktop Word compatible, reading via `mammoth` |
| **🖼️ Blog Images** | GPT Image Mini 1.5 (OpenAI) | Automatic thumbnails, ~$0.007/img |
| **🎙️ Premium TTS** | Voxtral (Mistral) — testing | Native PT-BR, voice cloning |
| **Ethics Tribunal (MiroFish)** | Qwen Plus + MiniMax M2.7 | `/api/audit` endpoint for OAB compliance |

---

## ⚖️ International Legal APIs

| API | Coverage | Authentication |
|-----|----------|----------------|
| **CourtListener** | US case law, RECAP Archive, federal dockets + full case law corpus (absorbed Harvard CAP in Sept/2024) | Token (free) |
| **eCFR** | Code of Federal Regulations (daily updates) | None |
| **Federal Register** | Official publications, proposed/final rules | None |
| **GovInfo (GPO)** | US Code, official federal documents | API Key (free) |
| **EUR-Lex (CELLAR)** | European legislation (GDPR, etc.) via SPARQL | None |
| **MCP Brasil** | 41 Brazilian government APIs (326 tools) | Local server |

---

## 💰 Monetization & Credits

Judite operates on an **Analytical Pulses (Credits)** model designed to maximize conversion and ensure >90% profit margin per user.

| Plan | Cost | Allowance | Auto-Reset |
|------|------|-----------|------------|
| **Trial (Free)** | Free | **300 credits** one-time | Never |
| **Pro** | R$ 197/month or **$25 USDC/30 days** | **10,000 credits** | Monthly |

### Cost Table per Action (`credit_costs`)

| Tool / Action | Credit Cost | Reason |
|---------------|-------------|--------|
| **Text Message** | `- 1` credit/send | Lightweight LLM |
| **Web Search** | `- 3` credits/search | Tavily API |
| **PDF Generation** | `- 10` credits/file | Puppeteer Cloud |
| **OCR Reading** | `- 15` credits/image | Gemini Vision |
| **Document Analysis** | `- 5` to `- 20` credits | Based on pages |
| **Voice Chat** | `- 2` to `- 4` credits | Groq Whisper + TTS |
| **Expert Mode** | **x5** base value | Deep reasoning LLM |

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Node.js**: Version 20 or higher.
- **FFmpeg**: Required for audio conversion:
  ```cmd
  winget install Gyan.FFmpeg
  ```

### 2. Environment Setup
1. Create your bot on Telegram by talking to `@BotFather` and get the Token.
2. Find your Telegram **User ID** (talk to `@userinfobot`).
3. Generate API keys from the links below.
4. Rename `.env.example` to `.env` and fill in.

### 3. Start Judite (Telegram Bot)
```bash
npm install
npm run dev
```

### 4. Start the Dashboard
```bash
cd dashboard
npm install
npm run dev
```
Access at `http://localhost:3000`.

---

## 🔑 API Keys

| Key | Provider | Purpose | Get it at |
|-----|----------|---------|-----------|
| `GEMINI_API_KEY` | Google | LLM Fallback + STT Fallback | [aistudio.google.com](https://aistudio.google.com/) |
| `GROQ_API_KEY` | Groq | Primary STT (Whisper) | [console.groq.com](https://console.groq.com/) |
| `DEEPSEEK_API_KEY` | DeepSeek | Primary LLM | [platform.deepseek.com](https://platform.deepseek.com/) |
| `COURTLISTENER_API_TOKEN` | Free Law Project | US case law | [courtlistener.com](https://www.courtlistener.com/sign-in/) |
| `GOVINFO_API_KEY` | GPO | US Code, federal docs | [api.data.gov/signup](https://api.data.gov/signup/) |
| `SUPABASE_URL` | Supabase | Cloud backend | [supabase.com](https://supabase.com/) |
| `TAVILY_API_KEY` | Tavily | Web search | [tavily.com](https://tavily.com/) |
| `SOLANA_PRIVATE_KEY` | Solana | Blockchain notarization | Generate via `scripts/generate-solana-wallet.ts` |

---

## 🔌 Skills System

### ⚖️ Legal Advisor (Brazilian Law)
Triggered by keywords like "contrato", "cláusula", "nuvem", or "meus documentos".

### ⚖️ Legal US (International Law)
Triggered by keywords like "us law", "case law", "gdpr", "cfr", "supreme court".
Bilingual (PT-BR/EN) with US citation format and cross-reference BR↔US.

### 🏛️ Government Data (consulta_gov)
Direct access to Brazilian government databases. 4-phase architecture:
- **Shortcuts:** Selic, IPCA, CNPJ, ZIP — instant response.
- **Recommendation:** LLM selects the best API among 326 tools.
- **Planner:** Complex queries generate parallel execution plans.

### ⚖️ International Law (consulta_law)
Smart jurisdiction detection routes queries to the right API:
- US case law → CourtListener
- US regulations → eCFR
- US statutes → GovInfo
- Federal Register → Official publications
- EU legislation → EUR-Lex (SPARQL)

---

## 📁 Project Structure
```
agente007/
├── src/                    # Bot Judite (Telegram + WhatsApp) — Decoupled AI Engine
│   ├── core/               # AgentController + AgentLoop (ReAct)
│   ├── tools/              # Tools (Cloud*, WebSearch, ConsultaGov, ConsultaLaw)
│   ├── services/           # External services (SolanaNotary, ImageGenerator)
│   ├── skills/             # SkillRouter + SkillExecutor
│   └── ...
├── dashboard/              # Pauta — Next.js 15 + React 19 (Web Dashboard)
├── marketer/               # Autonomous Growth Marketing Engine
├── MiroFish/               # AI Ethics Tribunal (Python/Flask)
├── mcp-br/                 # Brazilian Government APIs Server (FastMCP)
├── .agents/skills/         # Legal and default bot skills
└── docs/                   # Documentation
```

---

## 🏛️ Future Vision — On-Chain Legal Infrastructure

> Judite is not just an analysis tool. We're building the **reference infrastructure for decentralized justice** — a platform where contracts are analyzed, sealed, executed, disputed, and arbitrated on the blockchain by specialized AI agents.

| Item | Concept | Status |
|------|---------|--------|
| **🏛️ DAO Tribunal** | First AI-powered decentralized court. Parties submit evidence on-chain, Judite issues technical opinion, decentralized jury votes, smart contract executes decision. | 🔮 Vision |
| **🔒 Smart Contract Escrow** | Funds locked on Solana until AI validates clause fulfillment. Judite as on-chain legal oracle. | 🔮 Vision |
| **🪪 Agent Passport (DID)** | Verifiable decentralized identity for AI-to-AI B2B interactions. | 🔮 Vision |
| **🌉 Cross-Chain Legal Proofs** | Bridge SHA-256 seals to Ethereum/Polygon. | 🔮 Vision |
| **💸 Revshare On-Chain** | Automatic affiliate commission split in the same USDC TX. | 🔮 Vision |
| **🔜 Mainnet USDC** | Migrate payments from SOL Devnet to real SPL USDC. | 🔜 Next |
| **✅ Dashboard Chat** | Chat with Judite directly in the browser via Supabase Realtime. | ✅ Done |
| **✅ HTTPS API** | `api.usejudite.com.br` — Apache reverse proxy to VPS API (analyze, health). | ✅ Done |

> Full details: [`docs/solana_hackathon.md`](./docs/solana_hackathon.md) | [`ROADMAP.md`](./ROADMAP.md) — Phase 15

---

> 📄 Read the detailed specs in `/specs/` to understand the full architecture.
