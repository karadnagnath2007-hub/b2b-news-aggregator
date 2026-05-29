export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getUserFromRequest, assertPremiumUser } from '../../../lib/auth';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/complete';

async function buildPrompt(sector: string, articles: Array<{ title: string; summary: string }>, deepDive: boolean) {
  const articleText = articles
    .map((article, index) => `${index + 1}. ${article.title}\n${article.summary}`)
    .join('\n\n');

  const focus = deepDive
    ? 'Provide a deep-dive strategic analysis that references structural risks, regulatory pressure, and tactical implications for senior leadership.'
    : 'Provide a concise briefing that highlights key trends and strategic implications for senior readers.';

  return `You are an AI analyst for a B2B intelligence newsroom. ${focus} Do not include markdown, bullet points, or labels in the output.\n\nSector: ${sector}\n\nArticles:\n${articleText}\n\nAssistant:`;
}

async function fetchClaudeResponse(prompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key is not configured in environment variables.');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'claude-3.5-mini',
      prompt,
      max_tokens_to_sample: 600,
      temperature: 0.2,
      stop_sequences: ['\n\nHuman:'],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return (data.completion ?? data.response ?? '').trim();
}

export async function POST(request: Request) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ message: "Bypassing build execution" });
  }

  const body = await request.json().catch(() => null);
  const bodySector = typeof body?.sector === 'string' ? body.sector.trim() : '';
  const requestUrl = new URL(request.url);
  const querySector = requestUrl.searchParams.get('sector')?.trim() ?? '';
  const sector = bodySector || querySector;
  const deepDive = body?.deepDive === true;

  if (!sector) {
    return NextResponse.json({ error: 'Sector is required.' }, { status: 400 });
  }

  const user = await getUserFromRequest(request);

  if (deepDive) {
    try {
      assertPremiumUser(user);
    } catch (error) {
      const status = (error as any).status ?? 403;
      return NextResponse.json({ error: (error as any).message }, { status });
    }
  }

  const industry = await prisma.industry.findFirst({
    where: { name: { equals: sector, mode: 'insensitive' } },
  });

  if (!industry) {
    return NextResponse.json({ error: `Unknown sector: ${sector}` }, { status: 404 });
  }

  const articles = await prisma.article.findMany({
    where: { industryId: industry.id },
    orderBy: { publishedAt: 'desc' },
    take: 5,
    select: {
      title: true,
      summary: true,
    },
  });

  if (articles.length === 0) {
    return NextResponse.json({ error: `No articles found for sector: ${sector}` }, { status: 404 });
  }

  const prompt = await buildPrompt(sector, articles, deepDive);
  const briefing = await fetchClaudeResponse(prompt);

  return NextResponse.json(
    {
      sector,
      briefing,
      deepDive,
      sourceArticles: articles,
      user: user ? { email: user.email, isPremium: user.isPremium } : null,
    },
    { status: 200 }
  );
}
