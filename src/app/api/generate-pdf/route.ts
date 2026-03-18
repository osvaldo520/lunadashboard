import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/generate-pdf
 * 
 * Converte Markdown → PDF usando o serviço externo md-to-pdf.fly.dev
 * Roda no servidor Next.js (não no browser) para evitar CORS.
 * Leve: só faz proxy da conversão, sem Puppeteer ou RAM pesada.
 */
export async function POST(req: NextRequest) {
  try {
    const { content, title } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Conteúdo é obrigatório.' }, { status: 400 });
    }

    const pdfServiceUrl = process.env.PDF_SERVICE_URL || 'https://md-to-pdf.fly.dev';

    // ═══════════════════════════════════════════
    // PRÉ-PROCESSAMENTO: Converte emojis populares em marcadores de texto profissionais
    // O serviço md-to-pdf roda em container Linux sem fontes emoji instaladas.
    // ═══════════════════════════════════════════
    const emojiMap: Record<string, string> = {
      '⚠️': '[ATENÇÃO]', '⚡': '[!]', '🔴': '[CRÍTICO]', '🟡': '[MODERADO]', '🟢': '[OK]',
      '✅': '[✓]', '❌': '[✗]', '⭐': '[★]', '🔥': '[!]', '💡': '[DICA]',
      '📋': '[DOC]', '📄': '[DOC]', '📊': '[ANÁLISE]', '📈': '[GRÁFICO]', '📌': '[PONTO]',
      '🔒': '[SEGURANÇA]', '🔓': '[DESBLOQUEADO]', '🛡️': '[PROTEÇÃO]', '⚖️': '[JURÍDICO]',
      '👤': '[PARTE]', '👥': '[PARTES]', '🏢': '[EMPRESA]', '🏠': '[IMÓVEL]',
      '💰': '[VALOR]', '💵': '[R$]', '💳': '[PAGAMENTO]', '📅': '[DATA]', '⏰': '[PRAZO]',
      '🔗': '[LINK]', '📝': '[NOTA]', '📎': '[ANEXO]', '🗂️': '[SEÇÃO]',
      '🎯': '[OBJETIVO]', '🚨': '[ALERTA]', '💼': '[CONTRATO]', '🔍': '[DETALHE]',
      '✨': '[DESTAQUE]', '❗': '[!]', '❓': '[?]', '➡️': '→', '⬆️': '↑', '⬇️': '↓',
      '1️⃣': '1.', '2️⃣': '2.', '3️⃣': '3.', '4️⃣': '4.', '5️⃣': '5.',
      '6️⃣': '6.', '7️⃣': '7.', '8️⃣': '8.', '9️⃣': '9.', '🔟': '10.',
      '📢': '[AVISO]', '🏆': '[DESTAQUE]', '💬': '[OBS]', '🧾': '[RECIBO]',
      '🏷️': '[TAG]', '📜': '[CLÁUSULA]', '⚙️': '[CONFIG]', '🔑': '[CHAVE]',
    };

    let processedContent = content;
    for (const [emoji, label] of Object.entries(emojiMap)) {
      processedContent = processedContent.replaceAll(emoji, label);
    }

    // Remove quaisquer emojis restantes que não estão no mapa
    // (range Unicode de emojis comuns)
    processedContent = processedContent.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    // Prepara o body como form-urlencoded (formato do md-to-pdf)
    const params = new URLSearchParams();
    params.append('markdown', processedContent);
    params.append('css', `
      body { 
        font-family: 'Segoe UI', 'Noto Sans', Tahoma, Geneva, Verdana, sans-serif; 
        padding: 30px 40px; 
        line-height: 1.7; 
        color: #1a1a1a;
        font-size: 13px;
      }
      h1 { 
        color: #1e3a5f; 
        border-bottom: 2px solid #3b82f6; 
        padding-bottom: 8px; 
        font-size: 22px;
        margin-top: 0;
      }
      h2 { 
        color: #2563eb; 
        border-bottom: 1px solid #dbeafe; 
        padding-bottom: 5px; 
        font-size: 17px;
        margin-top: 24px;
      }
      h3 { color: #1e40af; font-size: 14px; margin-top: 18px; }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        margin: 12px 0;
        font-size: 12px;
      }
      th { 
        background: #1e3a5f; 
        color: white; 
        padding: 8px 12px; 
        text-align: left; 
        font-weight: 600;
      }
      td { 
        border: 1px solid #e2e8f0; 
        padding: 8px 12px; 
      }
      tr:nth-child(even) { background: #f8fafc; }
      blockquote { 
        border-left: 4px solid #3b82f6; 
        margin: 16px 0; 
        padding: 8px 16px; 
        background: #eff6ff; 
        color: #1e40af;
      }
      code { 
        background: #f1f5f9; 
        padding: 2px 6px; 
        border-radius: 4px; 
        font-size: 12px;
      }
      strong { color: #0f172a; }
      ul, ol { padding-left: 20px; }
      li { margin-bottom: 4px; }
      hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
      @page { 
        margin: 20mm 15mm; 
        @bottom-center { 
          content: "Entrelinhas — Análise Jurídica Inteligente"; 
          font-size: 9px; 
          color: #94a3b8; 
        }
      }
    `);

    console.log(`[API /generate-pdf] Gerando PDF para: ${title || 'sem título'}`);

    const response = await fetch(pdfServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Serviço de PDF retornou status ${response.status}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    const safeTitle = (title || 'documento')
      .replace(/[^a-zA-Z0-9]/g, '_');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeTitle}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error('[API /generate-pdf] Error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Falha ao gerar PDF.' },
      { status: 500 }
    );
  }
}
