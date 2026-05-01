import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TwitterApi } from 'twitter-api-v2';

export const maxDuration = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/social/publish
 * 
 * Publica um draft aprovado na rede social de destino.
 * Atualiza o status para 'published' e salva a URL do post.
 * 
 * Body: { draft_id: string }
 */
export async function POST(request: Request) {
  try {
    const { draft_id } = await request.json();

    if (!draft_id) {
      return NextResponse.json(
        { error: 'draft_id é obrigatório' },
        { status: 400 }
      );
    }

    // 1. Buscar o draft
    const { data: draft, error: fetchError } = await supabase
      .from('social_drafts')
      .select('*')
      .eq('id', draft_id)
      .single();

    if (fetchError || !draft) {
      return NextResponse.json(
        { error: 'Draft não encontrado' },
        { status: 404 }
      );
    }

    if (draft.status !== 'approved') {
      return NextResponse.json(
        { error: `Draft precisa estar aprovado. Status atual: ${draft.status}` },
        { status: 400 }
      );
    }

    // 2. Publicar na plataforma de destino
    let publishResult: { success: boolean; url?: string; error?: string };

        switch (draft.target_platform) {
      case 'twitter':
        publishResult = await publishToTwitter(draft.suggested_reply_md);
        break;
      case 'linkedin':
        publishResult = await publishToLinkedIn(draft.suggested_reply_md);
        break;
      case 'facebook':
        publishResult = await publishToFacebook(draft.suggested_reply_md, draft.media_url);
        break;
      case 'instagram':
        publishResult = await publishToInstagram(draft.suggested_reply_md, draft.media_url);
        break;
      default:
        publishResult = { success: false, error: `Plataforma "${draft.target_platform}" ainda não suportada para publicação automática. Aprove e publique manualmente.` };
    }

    // 3. Atualizar status no banco
    if (publishResult.success) {
      await supabase
        .from('social_drafts')
        .update({
          status: 'published',
          published_url: publishResult.url || null,
        })
        .eq('id', draft_id);

      return NextResponse.json({
        success: true,
        message: `Publicado com sucesso no ${draft.target_platform}!`,
        published_url: publishResult.url,
      });
    } else {
      console.error(`\n🔴 [FALHA NA API SOCIAL - ${draft.target_platform.toUpperCase()}]:\n`, publishResult.error, '\n');
      
      // NÃO setamos como 'failed' aqui — manter como approved para retry
      return NextResponse.json(
        { error: publishResult.error || 'Falha ao publicar' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Social Publish] Error:', error);
    return NextResponse.json(
      { error: `Erro interno ao publicar: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// Função auxiliar para truncar o texto sem quebrar as URLs (que valem 23 chars no Twitter)
function smartTruncateTwitter(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];
  
  // Remove URLs do texto para medir o tamanho real
  let textWithoutUrls = text.replace(urlRegex, '').trim();
  
  // Twitter limite = 280. Cada URL consome 23 chars. 
  // Reservamos 24 chars por URL (23 + 1 espaço).
  const maxTextLength = 280 - (urls.length * 24);
  
  if (textWithoutUrls.length > maxTextLength) {
    textWithoutUrls = textWithoutUrls.substring(0, maxTextLength - 3) + '...';
  }
  
  // Se não tem URL, retorna o texto truncado. Se tem, anexa as URLs no final.
  return urls.length > 0 ? `${textWithoutUrls}\n\n${urls.join('\n')}` : textWithoutUrls;
}

// ─── Twitter/X API v2 (OAuth 1.0a User Context) ───
async function publishToTwitter(text: string): Promise<{ success: boolean; url?: string; error?: string }> {
  const appKey = process.env.TWITTER_APP_KEY;
  const appSecret = process.env.TWITTER_APP_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    return { success: false, error: 'Credenciais do Twitter incompletas. Configure TWITTER_APP_KEY, TWITTER_APP_SECRET, TWITTER_ACCESS_TOKEN e TWITTER_ACCESS_SECRET no .env.local.' };
  }

  try {
    const client = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });

    // Detecta se é uma Thread (dividida pela tag [TWEET_2])
    const parts = text.split('[TWEET_2]');
    let url: string | undefined;

    if (parts.length > 1) {
      // Tentar como thread primeiro
      try {
        const tweet1 = smartTruncateTwitter(parts[0].trim());
        const tweet2 = smartTruncateTwitter(parts[1].trim());
        
        const thread = await client.v2.tweetThread([tweet1, tweet2]);
        const headTweetId = thread[0]?.data?.id;
        url = headTweetId ? `https://x.com/i/web/status/${headTweetId}` : undefined;
      } catch (threadErr: any) {
        const threadCode = threadErr?.code || threadErr?.data?.status;
        console.warn(`[Twitter] tweetThread falhou (${threadCode}). Tentando tweet único...`);
        
        // Fallback: posta só o primeiro tweet
        try {
          const combined = smartTruncateTwitter(parts[0].trim());
          const tweet = await client.v2.tweet(combined);
          const tweetId = tweet.data?.id;
          url = tweetId ? `https://x.com/i/web/status/${tweetId}` : undefined;
        } catch (singleErr: any) {
          console.error('[Twitter] Tweet único TAMBÉM falhou:', JSON.stringify(singleErr?.data || singleErr, null, 2));
          // Propagar o erro do single tweet (mais informativo)
          throw singleErr;
        }
      }
    } else {
      // É um tweet simples
      const safeText = smartTruncateTwitter(text.trim());
      const tweet = await client.v2.tweet(safeText);
      const tweetId = tweet.data?.id;
      url = tweetId ? `https://x.com/i/web/status/${tweetId}` : undefined;
    }

    return { success: true, url };
  } catch (error: any) {
    const code = error?.code || error?.data?.status;
    const title = error?.data?.title || '';
    const detail = error?.data?.detail || error?.message || String(error);

    // Erro 402: Créditos esgotados no plano Free do X
    if (code === 402 || title === 'CreditsDepleted') {
      return {
        success: false,
        error: '⚠️ Créditos da API do X esgotados. O plano Free não inclui postagem via API. Copie o texto e publique manualmente ou assine o plano Basic ($200/mês) no developer.x.com.',
      };
    }

    // Erro 403: Permissões insuficientes ou plano Free sem acesso a endpoint
    if (code === 403) {
      console.error('[Twitter API 403 Full Error]:', JSON.stringify(error?.data || error, null, 2));
      const reason = error?.data?.reason || '';
      const isThreadIssue = detail?.toLowerCase()?.includes('thread') || false;
      return {
        success: false,
        error: `🔒 Permissão negada (403). Reason: "${reason}". Detail: "${detail}". Tip: No plano Free do X, tweetThread pode não ser suportado. Verifique no developer.x.com.`,
      };
    }

    console.error('[Twitter API Full Error]:', JSON.stringify(error?.data || error, null, 2));
    return { success: false, error: `Twitter API (${code}): ${detail}` };
  }
}

// ─── LinkedIn API ───
async function publishToLinkedIn(text: string): Promise<{ success: boolean; url?: string; error?: string }> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN?.replace(/['"]/g, '').trim();
  const authorUrn = 'urn:li:organization:113118066';

  if (!accessToken) {
    return { success: false, error: 'LINKEDIN_ACCESS_TOKEN não configurado. Adicione no arquivo .env' };
  }

  try {
    // Nova arquitetura obrigatória do LinkedIn (/v2/posts)
    const postResponse = await fetch('https://api.linkedin.com/v2/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '2024-02', // Require Header to use /posts endpoint
      },
      body: JSON.stringify({
        author: authorUrn,
        commentary: text,
        visibility: 'PUBLIC',
        distribution: {
          feedDistribution: 'MAIN_FEED',
          targetEntities: [],
          thirdPartyDistributionChannels: []
        },
        lifecycleState: 'PUBLISHED',
        isReshareDisabledByAuthor: false
      }),
    });

    if (!postResponse.ok) {
      const errorData = await postResponse.json().catch(() => ({}));
      return { success: false, error: `LinkedIn Posts API ${postResponse.status}: ${JSON.stringify(errorData)}` };
    }

    return { success: true, url: `https://linkedin.com/company/${authorUrn.split(':').pop()}` };
  } catch (error) {
    return { success: false, error: `Erro de conexão com LinkedIn Posts: ${error}` };
  }
}
// ─── Meta Graph API (Facebook) ───
async function publishToFacebook(text: string, mediaUrl?: string | null): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const pageId = process.env.META_PAGE_ID;
    const token = process.env.META_PAGE_ACCESS_TOKEN;

    if (!pageId || !token) {
      return { success: false, error: 'Variáveis de ambiente do Facebook (META_PAGE_ID, META_PAGE_ACCESS_TOKEN) ausentes.' };
    }

    let url = `https://graph.facebook.com/v19.0/${pageId}/`;
    let bodyData: any = {
      message: text,
      access_token: token,
    };

    if (mediaUrl) {
      url += 'photos';
      bodyData.url = mediaUrl;
    } else {
      url += 'feed';
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();
    if (data.error) {
      return { success: false, error: `Facebook API Error: ${data.error.message}` };
    }

    return { success: true, url: `https://facebook.com/${data.id}` };
  } catch (error: any) {
    return { success: false, error: `Erro na pub. Facebook: ${error.message}` };
  }
}

// ─── Meta Graph API (Instagram) ───
async function publishToInstagram(caption: string, mediaUrl?: string | null): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const igAccountId = process.env.META_IG_ACCOUNT_ID;
    const token = process.env.META_PAGE_ACCESS_TOKEN;

    if (!igAccountId || !token) {
      return { success: false, error: 'Variáveis do Instagram ausentes (META_IG_ACCOUNT_ID, META_PAGE_ACCESS_TOKEN).' };
    }

    if (!mediaUrl) {
      return { success: false, error: 'Instagram não permite postagens de texto sem imagem. É obrigatório haver uma media_url.' };
    }

    // 1. Criar Item Container
    const createUrl = `https://graph.facebook.com/v19.0/${igAccountId}/media?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(caption)}&access_token=${token}`;
    const createRes = await fetch(createUrl, { method: 'POST' });
    const createData = await createRes.json();

    if (createData.error) {
       return { success: false, error: `Instagram Create API Error: ${createData.error.message}` };
    }

    const creationId = createData.id;

    // 2. Aguardar 8 segundos para o servidor do Instagram processar a mídia (evita "resource does not exist")
    await new Promise(resolve => setTimeout(resolve, 8000));

    // 3. Publicar o Container
    const publishUrl = `https://graph.facebook.com/v19.0/${igAccountId}/media_publish?creation_id=${creationId}&access_token=${token}`;
    const publishRes = await fetch(publishUrl, { method: 'POST' });
    const publishData = await publishRes.json();

    if (publishData.error) {
       return { success: false, error: `Instagram Publish API Error: ${publishData.error.message}` };
    }

    return { success: true, url: `https://instagram.com/p/${publishData.id}` }; // Note: The ID here is not the shortcode, but it signifies success
  } catch (error: any) {
    return { success: false, error: `Erro na pub. Instagram: ${error.message}` };
  }
}

