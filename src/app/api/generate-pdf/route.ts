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

    // O serviço envia o texto intacto para renderizar com Emojis Nativos
    const params = new URLSearchParams();
    params.append('markdown', content);
    
    // CSS Institucional Premium
    params.append('css', `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Color+Emoji&display=swap');

      body { 
        font-family: 'Inter', 'Noto Color Emoji', sans-serif; 
        padding: 40px 50px; 
        line-height: 1.6; 
        color: #334155;
        font-size: 12px;
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
        margin: 24px 0;
        font-size: 11px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      th { 
        background: #0f172a; 
        color: #ffffff; 
        padding: 12px 16px; 
        text-align: left; 
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      td { 
        border: 1px solid #e2e8f0; 
        padding: 12px 16px; 
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
