import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  const { hash } = params;

  // Em um cenário real, você poderia buscar no Supabase se esse hash realmente existe.
  // Aqui geramos a resposta dinâmica no formato JSON padrão da Metaplex.

  return NextResponse.json({
    name: "Judite Audit Certificate",
    symbol: "JUDITE",
    description: `Certificado oficial de Auditoria Jurídica Inteligente processado pela Judite AI. Hash do documento auditado: ${hash}`,
    image: "https://usejudite.com.br/judite-newlogo3.png",
    attributes: [
      {
        trait_type: "Jurisdiction",
        value: "BR"
      },
      {
        trait_type: "Validation",
        value: "AI Autonomous"
      },
      {
        trait_type: "Platform",
        value: "Solana Network"
      },
      {
        trait_type: "Document Hash",
        value: hash
      }
    ],
    properties: {
      files: [
        {
          uri: "https://usejudite.com.br/judite-newlogo3.png",
          type: "image/png"
        }
      ],
      category: "image"
    }
  });
}
