import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/generate-pdf
 * 
 * Delega a geração de PDF para o PdfEngine Premium da VPS (Puppeteer).
 * Isso garante qualidade visual idêntica em todos os canais (Dashboard, Telegram, WhatsApp).
 * 
 * Fallback: Se a VPS estiver fora do ar, usa o serviço externo md-to-pdf.fly.dev.
 */
export async function POST(req: NextRequest) {
  try {
    const { content, title, blockchainOptions } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Conteúdo é obrigatório.' }, { status: 400 });
    }

    // ═══════════════════════════════════════════
    // Estratégia 1: VPS PdfEngine (Puppeteer) — Premium Quality
    // ═══════════════════════════════════════════
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.usejudite.com.br';
    
    try {
      console.log(`[API /generate-pdf] Requesting premium PDF from VPS for: ${title || 'untitled'}`);
      
      const vpsResponse = await fetch(`${vpsApiUrl}/v1/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: content, title, blockchainOptions }),
        signal: AbortSignal.timeout(60000), // 60s timeout
      });

      if (vpsResponse.ok) {
        const pdfBuffer = await vpsResponse.arrayBuffer();
        const safeTitle = (title || 'documento').replace(/[^a-zA-Z0-9]/g, '_');

        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${safeTitle}.pdf"`,
          },
        });
      }

      // Se a VPS retornou erro, cai no fallback
      console.warn(`[API /generate-pdf] VPS returned ${vpsResponse.status}. Falling back to cloud service.`);
    } catch (vpsErr: any) {
      console.warn(`[API /generate-pdf] VPS unreachable: ${vpsErr.message}. Falling back to cloud service.`);
    }

    // ═══════════════════════════════════════════
    // Estratégia 2: Fallback — md-to-pdf.fly.dev (qualidade inferior)
    // ═══════════════════════════════════════════
    console.log(`[API /generate-pdf] Using cloud fallback for: ${title || 'untitled'}`);

    // Emojis que o WeasyPrint não suporta — substituir por símbolos neutros
    const emojiMap: Record<string, string> = {
      '⚠️': '[!]', '⚡': '[!]', '🔴': '[!]', '🟡': '[!]', '🟢': '[OK]',
      '✅': '[✓]', '❌': '[✗]', '⭐': '[★]', '🔥': '[!]', '💡': '[i]',
      '📋': '[DOC]', '📄': '[DOC]', '📊': '[CHART]', '📈': '[CHART]', '📌': '[*]',
      '🔒': '[SEC]', '🔓': '[UNSEC]', '🛡️': '[SEC]', '⚖️': '[LAW]',
      '👤': '[USER]', '👥': '[USERS]', '🏢': '[ORG]', '🏠': '[ORG]',
      '💰': '[$]', '💵': '[$]', '💳': '[$]', '📅': '[DATE]', '⏰': '[TIME]',
      '🔗': '[LINK]', '📝': '[NOTE]', '📎': '[ATTACH]', '🗂️': '[SECTION]',
      '🎯': '[TARGET]', '🚨': '[!]', '💼': '[CASE]', '🔍': '[SEARCH]',
      '✨': '[*]', '❗': '[!]', '❓': '[?]', '➡️': '→', '⬆️': '↑', '⬇️': '↓',
      '1️⃣': '1.', '2️⃣': '2.', '3️⃣': '3.', '4️⃣': '4.', '5️⃣': '5.',
      '6️⃣': '6.', '7️⃣': '7.', '8️⃣': '8.', '9️⃣': '9.', '🔟': '10.',
      '📢': '[!]', '🏆': '[*]', '💬': '[MSG]', '🧾': '[RECEIPT]',
      '🏷️': '[TAG]', '📜': '[CLAUSE]', '⚙️': '[CONFIG]', '🔑': '[KEY]',
    };

    let processedContent = content;
    for (const [emoji, label] of Object.entries(emojiMap)) {
      processedContent = processedContent.replaceAll(emoji, label);
    }
    processedContent = processedContent.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const pdfServiceUrl = process.env.PDF_SERVICE_URL || 'https://md-to-pdf.fly.dev';

    const params = new URLSearchParams();
    params.append('markdown', processedContent);
    params.append('title', title || 'Documento Judite');
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

    const response = await fetch(pdfServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Cloud PDF service returned status ${response.status}: ${err}`);
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
      { error: err.message || 'Failed to generate PDF.' },
      { status: 500 }
    );
  }
}
