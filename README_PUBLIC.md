# ⚖️ Judite AI — Plataforma de Inteligência Jurídica com Blockchain

> 🇬🇧 [Read in English](./README.en.md)

**Judite** é uma plataforma de inteligência artificial multi-agente especializada em análise e geração de documentos jurídicos, com infraestrutura de pagamentos e autenticidade construída sobre a **Solana**.

🌐 **Live Demo:** [usejudite.com.br](https://www.usejudite.com.br)

---

## 🎯 O Problema

Análise de contratos e documentos jurídicos é cara, lenta e inacessível para a maioria das pessoas e pequenas empresas. Advogados cobram centenas de reais por pareceres simples, e ferramentas de IA existentes não oferecem **prova de integridade** nem **pagamento descentralizado**.

## 💡 A Solução

A Judite combina **Agentes de IA especializados** com **infraestrutura Solana** para criar um ecossistema jurídico acessível, verificável e sem intermediários:

- 📄 **Análise Inteligente** — Upload de contratos (PDF, DOCX, TXT) para auditoria automatizada com classificação de risco em 4 níveis
- 🏛️ **Cruzamento com Dados Oficiais** — Validação automática contra bases governamentais (BR, US e EU)
- 🔗 **Selo Blockchain** — Cada análise recebe um hash SHA-256 registrado na Solana como prova de existência e integridade
- 💳 **Pagamento Descentralizado (x402)** — API pay-per-use via USDC na Solana, sem intermediários
- 🪪 **Certificado cNFT** — Recibo verificável emitido como Compressed NFT via Metaplex
- ✅ **Verificação Pública** — Qualquer pessoa pode verificar a autenticidade de uma análise em `/verify/[tx]`

---

## 🏗️ Arquitetura

Este repositório contém o **Dashboard (Frontend)** — a interface web da plataforma, construída com Next.js 15 e hospedada na Vercel.

O **Motor de IA** (backend) opera em uma instância privada separada, processando as análises, cruzamentos governamentais e notarizações blockchain. A comunicação entre frontend e backend é feita via APIs seguras e Supabase Realtime.

```
┌─────────────────────────────────────────────────────┐
│                    USUÁRIO                          │
│         (Browser / Telegram / WhatsApp)             │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────▼─────────────┐
         │   Dashboard (este repo)   │
         │   Next.js 15 + Vercel     │
         │                           │
         │  • Landing Page           │
         │  • Painel de Documentos   │
         │  • Análise + Phantom Pay  │
         │  • Verificação Blockchain │
         │  • Web Chat               │
         └─────────────┬─────────────┘
                       │ APIs + Realtime
         ┌─────────────▼─────────────┐
         │   Motor de IA (Privado)   │
         │                           │
         │  • Multi-Agent Engine     │
         │  • Gov Data Cross-Ref     │
         │  • Compliance Audit       │
         │  • Solana Notarization    │
         │  • x402 Payment Gateway   │
         └───────────────────────────┘
```

---

## 🔗 Integração Solana

| Feature | Descrição |
|---------|-----------|
| **x402 Paywall** | Middleware que exige pagamento USDC via Solana antes de liberar acesso à API de análise |
| **Notarização On-Chain** | Hash SHA-256 da análise registrado via Memo Program — trilha de auditoria imutável |
| **Certificado cNFT** | Compressed NFT emitido via Metaplex Bubblegum como recibo verificável (~$0.001/cert) |
| **Verificação Pública** | Página `/verify/[tx]` compara hash on-chain com o conteúdo armazenado |
| **Phantom Wallet** | Integração nativa para pagamentos e minting direto no browser |
| **Crypto Pass** | Assinatura Pro via USDC — 30 dias de acesso completo, sem intermediário |

### API x402 — Pay-Per-Request

```
POST https://api.usejudite.com.br/v1/analyze
Header: x-solana-tx: <assinatura_da_transacao_usdc>
```

**Fluxo:** Cliente paga USDC → inclui TX no header → middleware verifica on-chain → IA analisa → resposta inclui `blockchain_proof` com hash de notarização.

---

## 📱 Canais Disponíveis

A Judite é **omnichannel** — funciona em múltiplas plataformas com a mesma inteligência:

- 🌐 **Web Dashboard** — Upload, análise, gestão de documentos e chat
- 💬 **Telegram** — Converse por texto/voz, envie documentos
- 📱 **WhatsApp** — Mesma experiência, integração nativa
- 🔌 **API B2B** — Endpoint stateless para integração em sistemas terceiros

---

## ⚖️ Capacidades Jurídicas

- **Análise de Contratos** — Auditoria técnica com Matriz de Risco (4 níveis: Fatal, Importante, Geral, Leve)
- **Geração de Documentos** — Redação parametrizada (contratos, NDAs, termos, procurações)
- **Multi-Jurisdicional** — Brasil 🇧🇷, Estados Unidos 🇺🇸 e União Europeia 🇪🇺
- **Cruzamento Governamental** — Consulta automática a bases oficiais (BR: DataJud, BACEN, Câmara | US: CourtListener, eCFR, FRED | EU: EUR-Lex)
- **Compliance Automatizado** — Guardrail de ética e conformidade em toda análise e documento gerado
- **Exportação Premium** — PDF corporativo, Word (.docx), Markdown com selo blockchain

---

## 🏛️ Visão de Futuro

> Estamos construindo infraestrutura de justiça descentralizada — uma plataforma onde contratos são analisados, selados, disputados e arbitrados na blockchain por agentes de IA especializados.

| Conceito | Descrição |
|----------|-----------|
| **DAO Tribunal** | Tribunal descentralizado com IA — parecer técnico automatizado + júri descentralizado + execução via smart contract |
| **Smart Contract Escrow** | Fundos travados até a IA validar cumprimento de cláusulas contratuais |
| **Agent Passport (DID)** | Identidade descentralizada verificável da IA para interações B2B |
| **Cross-Chain Legal Proofs** | Bridge de selos para Ethereum/Polygon |

---

## 📄 Licença

© 2025 Judite AI. Todos os direitos reservados.

Este repositório é disponibilizado apenas para fins de avaliação (hackathon).
O código não pode ser copiado, modificado ou redistribuído sem autorização expressa.
