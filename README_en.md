# ⚖️ Judite AI — AI-Powered Legal Intelligence Platform on Solana

> 🇧🇷 [Leia em Português](./README.md)

**Judite** is a multi-agent AI platform specialized in legal document analysis and generation, with payment and authenticity infrastructure built on **Solana**.

🌐 **Live Demo:** [usejudite.com.br](https://www.usejudite.com.br)

---

## 🎯 The Problem

Contract analysis and legal document review is expensive, slow, and inaccessible to most individuals and small businesses. Lawyers charge hundreds of dollars for simple opinions, and existing AI tools offer no **proof of integrity** nor **decentralized payment**.

## 💡 The Solution

Judite combines **specialized AI Agents** with **Solana infrastructure** to create an accessible, verifiable, and trustless legal ecosystem:

- 📄 **Smart Analysis** — Upload contracts (PDF, DOCX, TXT) for automated audit with 4-level risk classification
- 🏛️ **Official Data Cross-Reference** — Automatic validation against government databases (Brazil, US, and EU)
- 🔗 **Blockchain Seal** — Every analysis receives a SHA-256 hash registered on Solana as proof of existence and integrity
- 💳 **Decentralized Payment (x402)** — Pay-per-use API via USDC on Solana, no intermediaries
- 🪪 **cNFT Certificate** — Verifiable receipt issued as a Compressed NFT via Metaplex
- ✅ **Public Verification** — Anyone can verify analysis authenticity at `/verify/[tx]`

---

## 🏗️ Architecture

This repository contains the **Dashboard (Frontend)** — the platform's web interface, built with Next.js 15 and hosted on Vercel.

The **AI Engine** (backend) runs on a separate private instance, processing analyses, government cross-references, and blockchain notarizations. Communication between frontend and backend uses secure APIs and Supabase Realtime.

```
┌─────────────────────────────────────────────────────┐
│                      USER                           │
│          (Browser / Telegram / WhatsApp)             │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────▼─────────────┐
         │   Dashboard (this repo)   │
         │   Next.js 15 + Vercel     │
         │                           │
         │  • Landing Page           │
         │  • Document Manager       │
         │  • Analysis + Phantom Pay │
         │  • Blockchain Verify      │
         │  • Web Chat               │
         └─────────────┬─────────────┘
                       │ APIs + Realtime
         ┌─────────────▼─────────────┐
         │    AI Engine (Private)    │
         │                           │
         │  • Multi-Agent Engine     │
         │  • Gov Data Cross-Ref     │
         │  • Compliance Audit       │
         │  • Solana Notarization    │
         │  • x402 Payment Gateway   │
         └───────────────────────────┘
```

---

## 🔗 Solana Integration

| Feature | Description |
|---------|-------------|
| **x402 Paywall** | Middleware requiring USDC payment via Solana before granting API access |
| **On-Chain Notarization** | SHA-256 hash of analysis registered via Memo Program — immutable audit trail |
| **cNFT Certificate** | Compressed NFT issued via Metaplex Bubblegum as verifiable receipt (~$0.001/cert) |
| **Public Verification** | `/verify/[tx]` page compares on-chain hash with stored content |
| **Phantom Wallet** | Native integration for payments and minting directly in the browser |
| **Crypto Pass** | Pro subscription via USDC — 30 days of full access, no intermediary |

### x402 API — Pay-Per-Request Legal Intelligence

```
POST https://api.usejudite.com.br/v1/analyze
Header: x-solana-tx: <usdc_transaction_signature>
```

**Flow:** Client pays USDC → includes TX in header → middleware verifies on-chain → AI analyzes → response includes `blockchain_proof` with notarization hash.

---

## 📱 Available Channels

Judite is **omnichannel** — works across multiple platforms with the same intelligence:

- 🌐 **Web Dashboard** — Upload, analysis, document management and chat
- 💬 **Telegram** — Text/voice conversation, send documents
- 📱 **WhatsApp** — Same experience, native integration
- 🔌 **B2B API** — Stateless endpoint for third-party system integration

---

## ⚖️ Legal Capabilities

- **Contract Analysis** — Technical audit with 4-Level Risk Matrix (Fatal, Important, General, Minor)
- **Document Generation** — Parameterized drafting (contracts, NDAs, terms, powers of attorney)
- **Multi-Jurisdictional** — Brazil 🇧🇷, United States 🇺🇸, and European Union 🇪🇺
- **Government Cross-Reference** — Automatic queries to official databases (BR: DataJud, BACEN, Congress | US: CourtListener, eCFR, FRED | EU: EUR-Lex)
- **Automated Compliance** — Ethics and conformity guardrail on every analysis and generated document
- **Premium Export** — Corporate PDF, Word (.docx), Markdown with blockchain seal

---

## 🏛️ Future Vision

> We are building decentralized justice infrastructure — a platform where contracts are analyzed, sealed, disputed, and arbitrated on-chain by specialized AI agents.

| Concept | Description |
|---------|-------------|
| **DAO Tribunal** | Decentralized court with AI — automated technical opinion + decentralized jury + smart contract execution |
| **Smart Contract Escrow** | Funds locked until AI validates contractual clause compliance |
| **Agent Passport (DID)** | Verifiable decentralized identity for AI in B2B interactions |
| **Cross-Chain Legal Proofs** | Bridge seals to Ethereum/Polygon |

---

## 📄 License

© 2025 Judite AI. All rights reserved.

This repository is made available for evaluation purposes only (hackathon).
The code may not be copied, modified, or redistributed without express authorization.
