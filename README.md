# ⚖️ Judite — Plataforma Multi-Agente de Inteligência Jurídica

> 🇬🇧 [Read in English](./README.en.md)

A **Judite** é uma plataforma multi-agente de Inteligência Artificial especializada em inteligência jurídica, com motor desacoplado e arquitetura omnichannel. Ela opera via **WhatsApp**, **Telegram** e **Web Chat** (direto no Dashboard) como interfaces de comunicação, além da **Pauta** — um painel web para gestão de documentos na nuvem. Tudo conectado ao **Supabase** como backend cloud.

Criada como uma plataforma modular, a Judite orquestra **múltiplos agentes especializados** (análise jurídica, compliance OAB, cruzamento governamental, marketing autônomo) via *hot-reload* de Skills. O motor IA é **desacoplado** — fácil de pivotar para qualquer nicho (jurídico, odontológico, contábil).

---

## ✨ Características Principais

- 📱 **Omnichannel (Telegram, WhatsApp, Web Chat):** Converse por texto ou voz, envie documentos, receba PDFs de volta sem perder o contexto em qualquer canal. Web Chat usa fila assíncrona via Supabase Realtime.
- ⚙️ **Integração EvolutionAPI Nativa:** WhatsApp embutido via PM2 com Servidor Webhook Paralelo próprio da Judite. Sem docker, latência zero.
- 🌐 **Pauta (Painel Web):** Gestão com upload de documentos, KPIs, análises e configurações (Next.js 15 + React 19).
- ☁️ **Cloud Integrado:** Bot e Pauta compartilham os mesmos dados via Supabase (Auth, Database, Storage com RLS).
- 🧠 **Multi-LLM com Fallback:** 10+ modelos de IA orquestrados (DeepSeek, Gemini, Groq, Claude, Qwen, MiniMax, Kimi e outros via OpenRouter). Troca em tempo real via `/api` e `/modelo`.
- 🎯 **Raciocínio ReAct Nativo:** Ciclo de agente com *Tool Tracing* — executa ferramentas em turnos lógicos.
- 🎤 **Voz Bidirecional:** STT via Groq Whisper (fallback Gemini) + TTS com 3 tons (casual, formal, calorosa).
- 📄 **DOCX Nativo:** Gera e lê arquivos Word compatíveis com desktop (pacote `docx` + `mammoth`).
- 💾 **Memória Persistente:** Histórico, provider, modelo e tom de voz salvos no Supabase.
- 🔌 **Skills via Hot-Reload:** Modificou o arquivo? A Judite recarrega sem reiniciar.
- 🔍 **Detecção de Duplicatas:** Identificação automática de documentos duplicados na nuvem.
- 🏛️ **Cruzamento Inteligente com Governo (Pro):** Acesso direto a 41 APIs públicas brasileiras (326 ferramentas) — DataJud/CNJ, STF, Câmara, BACEN. Cruza CNPJ, CPF, CEP e jurisprudência proativamente durante análises.
- 🇺🇸 **Dados Oficiais do Governo dos EUA:** Federal Reserve (FRED — taxas de juros, CPI, GDP), FDIC (dados bancários e falências), Census Bureau (demografia por estado), Bureau of Labor Statistics (emprego, salários). Complementa as 326 tools brasileiras com cobertura multi-jurisdicional.
- 🛡️ **Compliance OAB Automático (MiroFish):** Todo conteúdo gerado pela Judite — contratos, análises e posts de redes sociais — passa por auditoria automatizada via `/api/audit` (Qwen Plus). Verifica ética OAB, LGPD, risco de cancelamento e qualidade. Custo: ~R$0,01/auditoria.
- 🔗 **Notarização Blockchain (Solana):** Toda análise jurídica e documento gerado recebe automaticamente um selo de integridade on-chain (SHA-256 via Memo Program). Página pública `/verify/[tx]` permite verificar autenticidade e detectar adulterações.
- 💳 **Monetização B2B/B2C (Solana Pay + x402 + cNFT):** API Stateless (`/v1/analyze`) blindada por um middleware `x402` (Paywall). Exige assinatura de transação USDC para liberar a análise. No Frontend (B2C), o sistema não só faz a cobrança automática via carteira Phantom, como também **emite um cNFT (Compressed NFT)** oficial via Metaplex como recibo eterno da auditoria na aba de colecionáveis do usuário, custando frações de centavos por certificado.
- 🌐 **Crypto Pass ($29.90 USDC = 30 dias Pro):** Assinatura descentralizada — pague $29.90 USDC via Solana Pay e desbloqueie 30 dias de acesso Pro completo (12.000 créditos + bônus 20%, todas as features). Sem intermediário.

### 🗺️ Mapa de Integração Solana (para Juízes do Hackathon)

> Referência rápida de cada arquivo onde a blockchain Solana é integrada.

| Feature | Arquivo | Descrição |
|---------|---------|-----------|
| **x402 Paywall Middleware** | [`src/api/server.ts`](./src/api/server.ts) | Middleware Express que valida assinaturas de pagamento USDC antes de liberar acesso à API |
| **Verificação de Pagamento USDC** | [`src/services/SolanaPaymentService.ts`](./src/services/SolanaPaymentService.ts) | Verifica transferências SPL Token on-chain (valor, destinatário, token mint) |
| **Notarização On-Chain** | [`src/services/SolanaNotaryService.ts`](./src/services/SolanaNotaryService.ts) | Hash SHA-256 + Memo Program para trilha de auditoria imutável |
| **Emissão de cNFT** | [`src/services/SolanaCNFTService.ts`](./src/services/SolanaCNFTService.ts) | Compressed NFT via Metaplex Bubblegum — recibo verificável a ~$0.001 |
| **Crypto Pass (Assinatura)** | [`src/services/SolanaPaymentService.ts`](./src/services/SolanaPaymentService.ts) | $29.90 USDC → 30 dias de acesso Pro, sem intermediário |
| **Frontend Wallet (Phantom)** | [`dashboard/src/app/analyze/page.tsx`](./dashboard/src/app/analyze/page.tsx) | Phantom wallet connect + transferência USDC + minting cNFT UI |
| **Página de Verificação Blockchain** | [`dashboard/src/app/verify/[tx]/page.tsx`](./dashboard/src/app/verify/[tx]/page.tsx) | Página pública para verificar integridade via Solana explorer |
| **Script Gerador de Wallet** | [`scripts/generate-solana-wallet.ts`](./scripts/generate-solana-wallet.ts) | Utilitário para gerar keypairs Solana para deployment |

#### 🔌 API x402 — Inteligência Jurídica Pay-Per-Request

```
POST https://api.usejudite.com.br/v1/analyze
```

| Header / Param | Valor | Descrição |
|----------------|-------|-----------|
| `x-solana-tx` | `<signature>` | Assinatura da transação Solana (transferência USDC) |
| `expert` | `true/false` | Modo análise profunda ($0.25) vs rápida ($0.10) |
| `source` | `social_link` | Identifica uso via link social B2C |

**Fluxo:** Cliente paga USDC → inclui TX signature no header → middleware verifica on-chain → IA analisa → resposta inclui `blockchain_proof` com hash de notarização.

#### 🏗️ Arquitetura de Deployment

| Componente | Host | Tech |
|------------|------|------|
| **Dashboard (Frontend)** | Vercel | Next.js 15 + React 19 |
| **API + Bot (Backend)** | Contabo VPS | Node.js + PM2 + Apache Reverse Proxy |
| **MiroFish (Compliance)** | Contabo VPS | Python/Flask |
| **MCP Brasil (APIs Gov)** | Contabo VPS | Python/FastMCP |
| **Database** | Supabase Cloud | PostgreSQL + Auth + Storage + Realtime |
- ⚖️ **Inteligência Jurídica Internacional (US + EU):** Acesso direto a jurisprudência americana (CourtListener — 140K+ opiniões), regulações federais (eCFR), Federal Register, US Code (GovInfo) e legislação europeia (EUR-Lex/GDPR). Roteamento inteligente automático por jurisdição.
- 🌐 **Bilíngue Nativo (PT-BR / EN):** Skills, bot e documentação suportam português e inglês. Detecção automática de idioma.
- 🏛️ **Badge de Fontes Oficiais:** PDFs, DOCX e TXT incluem automaticamente badge visual com as fontes governamentais consultadas (BACEN, TJSP, CDC, LGPD, etc.).
- 📈 **Motor Autônomo de Crescimento (Judite Marketer):** Pipeline agendada de 3 estágios (Estrategista → Copywriter → Compliance OAB) que pesquisa tendências na web, gera conteúdo multi-plataforma (Twitter/X, LinkedIn, Facebook, Instagram + Blog SEO), com imagens por IA, aprovação humana no Dashboard e publicação 1-Click via Graph API. Posts rejeitados pela auditoria são filtrados automaticamente.

---

## 🧠 Stack de IA

| Função | Modelo(s) | Justificativa |
|--------|-----------|---------------|
| **Conversa + Análise** | 10+ LLMs orquestradas (DeepSeek, Gemini, Qwen, etc.) | Fallback automático, custo otimizado |
| **STT (Voz → Texto)** | Groq Whisper large-v3 | Mais rápido e preciso, fallback Gemini |
| **Voz OGG / Telegram**  | Edge TTS (Microsoft) + Qwen3 (Alibaba) | Tons Customizados PT-BR nativos |
| **⚡ Modo Expert** | Cadeia dinâmica (MiniMax, Qwen, Claude, etc.) | Multi-API gerida pelo Dashboard |
| **Documentos** | PDF (Puppeteer) + DOCX (pacote `docx` nativo) | Word desktop compatível, leitura via `mammoth` |
| **🖼️ Imagens Blog** | GPT Image Mini 1.5 (OpenAI) | Thumbnails automáticas, ~$0.007/img |
| **🎙️ TTS Premium** | Voxtral (Mistral) — em testes | PT-BR nativo, clonagem de voz |
| **Tribunal de Ética (MiroFish)** | Qwen Plus + MiniMax M2.7 | Endpoint `/api/audit` para compliance OAB |

---

## 💰 Monetização e Sistema de Créditos

A Judite opera num modelo de **Pulsos Analíticos (Créditos)** projetado para maximizar a conversão de clientes e assegurar >90% de margem de lucro por usuário.

| Plano | Custo | Franquia | Reset Automático |
|-------|-------|----------|------------------|
| **Trial (Free)** | Grátis | **300 créditos** únicos | Nunca (Avaliação Inicial) |
| **Pro** | R$ 197/mês | **10.000 créditos** | Mensal (renovado no faturamento) |

### Tabela de Custos por Ação (`credit_costs`)
O consumo é pulverizado para extrair o valor de uso de hardware. Os valores são gerenciados no Supabase (tabela `credit_costs`).

| Ferramenta / Ação | Custo em Créditos | Motivo / Custo Backend Real |
|-------------------|-------------------|-----------------------------|
| **Mensagem Texto** | `- 1` crédito/envio | LLM Leve (Gemini Flash ou Qwen) |
| **Resumo de Web Search** | `- 3` créditos/busca | Tavily API |
| **Geração de PDF** | `- 10` créditos/arquivo | Infraestrutura Puppeteer Cloud |
| **Leitura via OCR** | `- 15` créditos/imagem | Extração pesada Gemini Vision |
| **Análise de Documento** | `- 5` a `- 20` créditos | Baseado nas páginas lidas (pdf-parse) |
| **Chat de Voz** | `- 2` a `- 4` créditos | Groq Whisper STT + Qwen TTS |
| **Modo Expert** | **x5** no valor base | Aciona MiniMax Raciocínio Profundo |

---

## ☁️ Edge Functions (Supabase)

| Função | O que faz |
|--------|-----------|
| `groq-stt` | Transcrição de áudio via Groq Whisper large-v3 |
| `gemini-stt` | Fallback de transcrição via Gemini 2.0 Flash |
| `pdf-engine` | Conversão Markdown → PDF |
| `process-ocr` | OCR de imagens via OCR.space |
| `rag-embeddings` | Chunking + embeddings para documentos longos |
| `stripe-checkout` | Checkout de pagamento Stripe |

---

## 🔑 APIs e Chaves

| Chave | Provedor | O que faz | Onde obter |
|-------|----------|-----------|------------|
| `GEMINI_API_KEY` | Google | LLM Fallback + STT Fallback | [aistudio.google.com](https://aistudio.google.com/) |
| `GROQ_API_KEY` | Groq | STT principal (Whisper) | [console.groq.com](https://console.groq.com/) |
| `DEEPSEEK_API_KEY` | DeepSeek | Cérebro principal (LLM) | [platform.deepseek.com](https://platform.deepseek.com/) |
| `ANTHROPIC_API_KEY` | Anthropic | Modo Expert Fallback (Claude Haiku) | [console.anthropic.com](https://console.anthropic.com/) |
| `OPENROUTER_API_KEY` | OpenRouter | Gateway universal (+200 modelos, MiniMax) | [openrouter.ai](https://openrouter.ai/) |
| `DASHSCOPE_API_KEY` | Alibaba Cloud | Text-to-Speech Qwen3 & LLM Qwen | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com/) |
| `MINIMAX_API_KEY` | MiniMax | Inteligência Autônoma (opcional via OpenRouter) | [api.minimax.info](https://api.minimax.info/) |
| `SUPABASE_URL` | Supabase | Backend cloud (DB + Auth + Storage) | [supabase.com](https://supabase.com/) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Acesso backend (nunca no frontend!) | Supabase → Settings → API |
| `TAVILY_API_KEY` | Tavily | Pesquisa na internet | [tavily.com](https://tavily.com/) |
| `MCP_BRASIL_URL` | Local (MCP Brasil) | Servidor de APIs governamentais | `http://localhost:8000` (auto) |
| `OPENAI_API_KEY` | OpenAI | Geração de imagens (blog thumbnails) | [platform.openai.com](https://platform.openai.com/) |
| `MISTRAL_API_KEY` | Mistral | Voxtral TTS (voz premium) | [console.mistral.ai](https://console.mistral.ai/) |
| `SOLANA_PRIVATE_KEY` | Solana | Notarização blockchain (JSON array ou Base58) | Gerar via `scripts/generate-solana-wallet.ts` |
| `SOLANA_RPC_URL` | Solana | RPC endpoint (Devnet/Mainnet) | `https://api.devnet.solana.com` |
| `COURTLISTENER_API_TOKEN` | Free Law Project | Jurisprudência US (case law) | [courtlistener.com](https://www.courtlistener.com/sign-in/) |
| `GOVINFO_API_KEY` | GPO | US Code, docs federais | [api.data.gov/signup](https://api.data.gov/signup/) |
| `FRED_API_KEY` | Federal Reserve | Dados econômicos EUA (Fed Funds, CPI, GDP) | [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html) |
| `FDIC_API_KEY` | FDIC | Dados bancários e falências | [banks.data.fdic.gov](https://banks.data.fdic.gov/docs/) |
| `CENSUS_API_KEY` | Census Bureau | Demografia, renda, população | [api.census.gov](https://api.census.gov/data/key_signup.html) |
| `BLS_API_KEY` | Bureau of Labor Statistics | Emprego, salários, CPI | [data.bls.gov](https://data.bls.gov/registrationEngine/) |

---

## 🛠️ Como Instalar e Rodar

### 1. Pré-requisitos
- **Node.js**: Versão 20 ou superior.
- **FFmpeg**: Necessário para conversão de áudio:
  ```cmd
  winget install Gyan.FFmpeg
  ```

### 2. Configure o Ambiente
1. Crie o seu bot no Telegram falando com o `@BotFather` e pegue o Token.
2. Descubra o seu **User ID** do Telegram (fale com `@userinfobot`).
3. Gere suas API keys nos links acima.
4. Renomeie `.env.example` para `.env` e preencha.

### 3. Inicie a Judite (Bot Telegram)
```bash
npm install
npm run dev
```

### 4. Inicie a Pauta (interface web)
```bash
cd dashboard
npm install
npm run dev
```
Acesse em `http://localhost:3000`.

---

## 🎮 Comandos do Bot

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/api` | Alterna o provedor de IA (persistente) | `/api gemini`, `/api openrouter` |
| `/modelo` | Troca o modelo IA no OpenRouter (persistente) | `/modelo deepseek`, `/modelo qwen` |
| `/voz` | Altera o tom de voz | `/voz calorosa`, `/voz formal` |
| `/vincular` | Pareia conta Telegram ↔ Pauta | `/vincular 123456` |
| `/start` | Mostra boas-vindas | `/start` |
| `/help` | Ajuda detalhada | `/help` |

---

## 🔌 Sistema de Skills

### ⚖️ Legal Advisor (Assessora Jurídica)
Ativada por palavras-chave como "contrato", "cláusula", "nuvem" ou "meus documentos".

**Ferramentas cloud (Supabase):**
- `cloud_list` — Lista documentos na nuvem (detecta duplicatas)
- `cloud_read` — Lê conteúdo de um documento do Storage
- `cloud_analyze` — Salva risk_score + resumo no Dashboard
- `cloud_write` — Salva documento gerado na nuvem
- `cloud_send` — Envia documento como PDF/DOCX no chat

### 🔍 Web Search
Pesquisa na internet via Tavily API para informações atualizadas.

### 🏛️ Consulta Governamental
Acesso direto a bases oficiais do governo brasileiro. Funciona em 4 fases:
- **Atalhos:** Selic, IPCA, CNPJ, CEP — resposta instantânea sem LLM.
- **Recomendação:** LLM analisa a query e seleciona a melhor API entre 326 ferramentas.
- **Planner:** Queries complexas ("compare gastos de 2 deputados") geram planos de execução paralela.
- **Fontes:** DataJud/CNJ, STF, Câmara, Senado, BACEN, IBGE, Portal da Transparência, Diário Oficial, TSE, BrasilAPI.

### ⚖️ Direito Internacional (consulta_law)
Detecção inteligente de jurisdição roteia queries para a API correta:
- US case law → CourtListener
- US regulações → eCFR
- US Code → GovInfo
- Federal Register → Publicações oficiais
- Legislação EU → EUR-Lex (SPARQL)

### ⚖️ Legal US (Direito Americano)
Skill bilíngue (PT-BR/EN) com citação no formato US, hierarquia de courts, e cross-reference BR↔US.

### 🇺🇸 Dados Governamentais EUA (consulta_gov_us)
Acesso direto a dados oficiais do governo americano via APIs públicas:
- **FRED (Federal Reserve):** Fed Funds Rate, CPI, GDP, Unemployment, Treasury yields, M2, mortgage rates
- **FDIC:** Bank failures, institution data, financial reports
- **Census Bureau:** Population, income, poverty, demographics por estado (ACS 5-Year)
- **BLS:** Unemployment rate, average wages, CPI, PPI, nonfarm payrolls
- Atalhos diretos para 25+ queries comuns (sem LLM).

---

## 📁 Estrutura do Projeto
```
agente007/
├── src/                    # Bot Judite (Telegram + WhatsApp) — Motor IA desacoplado
│   ├── core/               # AgentController + AgentLoop (ReAct)
│   ├── database/           # SupabaseService
│   ├── llm/                # Providers (Gemini, Groq, OpenRouter, DeepSeek)
│   ├── tools/              # Ferramentas (Cloud*, WebSearch, ConsultaGov, ConsultaLaw, ConsultaGovUS)
│   ├── services/           # Serviços externos (SolanaNotaryService, ImageGenerator)
│   ├── skills/             # SkillRouter + SkillExecutor
│   ├── telegram/           # Input/Output handlers do Telegram
│   ├── whatsapp/           # Servidor Nativo EvolutionAPI Webhook + Handlers
│   ├── pdf/                # PdfEngine, DocxEngine, DocumentJobWorker, PdfServer
│   └── audio/              # STT (Groq+Gemini fallback) + TTS
├── dashboard/              # Pauta — Next.js 15 + React 19 (App + Cofre Social)
│   └── src/app/verify/     # Verificador público blockchain (/verify/[tx])
├── marketer/               # Motor Autônomo de Growth Marketing
│   ├── src/                # Script de disparos e pesquisas cronadas
│   └── .agents/skills/     # Skills separadas dedicadas a Social Media e SEO
├── MiroFish/               # Tribunal Swarm IA (Python/Flask, porta 5001) para bloqueio ético
├── supabase/
│   ├── migrations/         # SQL migrations (001-025, inclui blockchain_notarization)
│   └── functions/          # Edge Functions (groq-stt, gemini-stt, pdf-engine, etc)
├── mcp-br/                 # Servidor de APIs Governamentais (Python, FastMCP, porta 8000)
├── .agents/skills/         # Skills judiciais e padrão do bot principal
├── docs/                   # Documentos locais para teste
└── specs/                  # Especificações técnicas
```

## 🛠️ Detalhes Técnicos

- **Fallback Inteligente:** STT: Groq Whisper → Gemini. LLM: DeepSeek → Gemini → OpenRouter.
- **Persistência Cloud:** Provider, modelo, voice_tone salvos no Supabase por usuário.
- **RLS (Row Level Security):** Isolamento total de dados por usuário no Supabase.
- **Agent Loop:** Ciclo ReAct em TypeScript com Tool Tracing real.
- **Rate Limiting:** Controle por plano (Free/Pro) com overrides VIP por usuário.

## 🏛️ Visão de Futuro — Infraestrutura Jurídica On-Chain

> A Judite não é apenas uma ferramenta de análise. Estamos construindo a **infraestrutura de justiça descentralizada de referência** — uma plataforma onde contratos são analisados, selados, executados, disputados e arbitrados na blockchain por agentes de IA especializados.

| Item | Conceito | Status |
|------|----------|--------|
| **🏛️ DAO Tribunal** | Primeiro tribunal descentralizado com IA. Partes submetem evidências on-chain, Judite emite parecer técnico, júri descentralizado vota, smart contract executa decisão. | 🔮 Visão |
| **🔒 Smart Contract Escrow** | Fundos travados na Solana até a IA validar cumprimento de cláusulas contratuais. Judite como oráculo jurídico on-chain. | 🔮 Visão |
| **🪪 Agent Passport (DID)** | Identidade descentralizada verificável da IA para interações B2B. | 🔮 Visão |
| **🌉 Cross-Chain Legal Proofs** | Bridge de selos SHA-256 para Ethereum/Polygon. | 🔮 Visão |
| **💸 Revshare On-Chain** | Split automático de comissão de afiliados na mesma TX USDC. | 🔮 Visão |
| **🔜 Mainnet USDC** | Migrar pagamentos de SOL Devnet para SPL USDC real. | 🔜 Next |
| **✅ Web Chat** | Conversa com a Judite direto no browser via Supabase Realtime. | ✅ Concluído |
| **✅ HTTPS API** | `api.usejudite.com.br` — Proxy reverso Apache para API da VPS. | ✅ Concluído |

> Detalhes completos: [`docs/solana_hackathon.md`](./docs/solana_hackathon.md) | [`ROADMAP.md`](./ROADMAP.md) — Fase 15

> Leia as documentações detalhadas na pasta `/specs/` para entender a arquitetura.
