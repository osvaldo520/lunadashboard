import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/generate-pdf
 * 
 * Converte Markdown → PDF usando o serviço externo md-to-pdf.fly.dev
 * Como o painel Next.js roda na Vercel, ele não tem acesso ao Puppeteer local da VPS do bot.
 * Portanto, ele delega a transformação para este microserviço em nuvem,
 * enviando os atributos de CSS Premium para que o resultado fique idêntico ao do bot.
 */
export async function POST(req: NextRequest) {
  try {
    const { content, title } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Conteúdo é obrigatório.' }, { status: 400 });
    }

    const pdfServiceUrl = process.env.PDF_SERVICE_URL || 'https://md-to-pdf.fly.dev';

    // ═══════════════════════════════════════════
    // Pré-processamento Seguro: Trocando emojis do Telegram
    // por marcadores de texto (O serviço Fly.dev usa Pandoc/WeasyPrint 
    // que falha ao tentar renderizar @import de fontes web)
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
    processedContent = processedContent.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const params = new URLSearchParams();
    params.append('markdown', processedContent);
    
    // Injetamos um título pro Pandoc não reclamar
    params.append('title', title || 'Documento Entrelinhas');
    
    // CSS Institucional Seguro (Sem @import, box-shadow ou fonts externas)
    params.append('css', `
      body { 
        font-family: 'Segoe UI', 'Noto Sans', Tahoma, Geneva, Verdana, sans-serif; 
        padding: 30px 40px; 
        line-height: 1.6; 
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
        background: #0f172a; 
        color: #ffffff; 
        padding: 8px 12px; 
        text-align: left; 
        font-weight: 600;
        text-transform: uppercase;
      }
      td { 
        border: 1px solid #e2e8f0; 
        padding: 8px 12px; 
        color: #1e293b;
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
    `);

    console.log(`[API /generate-pdf] Solicitando PDF Cloud externo para: ${title || 'sem título'}`);

    const response = await fetch(pdfServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Serviço de Nuvem (md-to-pdf) retornou status ${response.status}: ${err}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    const safeTitle = (title || 'documento').replace(/[^a-zA-Z0-9]/g, '_');

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
      { error: err.message || 'Falha ao conectar no Motor de PDF Local.' },
      { status: 500 }
    );
  }
}
