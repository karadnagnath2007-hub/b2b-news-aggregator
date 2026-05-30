import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '../../../lib/prisma'
import { getUserFromRequest, assertPremiumUser } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

async function buildPrompt(
  sector: string,
  articles: Array<{ title: string; summary: string }>,
  deepDive: boolean
) {
  const articleText = articles
    .map((article, index) => `${index + 1}. ${article.title}\n${article.summary}`)
    .join('\n\n')

  const focus = deepDive
    ? 'Provide a deep-dive strategic analysis that references structural risks, regulatory pressure, and tactical implications for senior leadership.'
    : 'Provide a concise briefing that highlights key trends and strategic implications for senior readers.'

  return `You are an AI analyst for a B2B intelligence newsroom. ${focus} Do not include markdown, bullet points, or labels in the output.\n\nSector: ${sector}\n\nArticles:\n${articleText}\n\nAssistant:`
}

async function fetchGeminiResponse(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key is not configured in environment variables.')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ message: 'Bypassing build execution' })
  }

  const body = await request.json()
  const sector = (body.sector as string)?.toLowerCase().trim()
  const deepDive = body?.deepDive === true

  const validSectors = [
    'logistics',
    'fintech',
    'manufacturing',
    'energy',
    'supply-chain',
    'medical-compliance',
    'heavy-manufacturing',
    'energy-commodities',
  ]

  if (!sector || !validSectors.includes(sector)) {
    return NextResponse.json({ error: `Unknown sector: ${sector}` }, { status: 400 })
  }

  const user = await getUserFromRequest(request)

  if (deepDive) {
    try {
      assertPremiumUser(user)
    } catch (error) {
      const status = (error as any).status ?? 403
      return NextResponse.json({ error: (error as any).message }, { status })
    }
  }

  const industry = await prisma.industry.findFirst({
    where: { name: { equals: sector, mode: 'insensitive' } },
  })

  if (!industry) {
    return NextResponse.json({ error: `Unknown sector: ${sector}` }, { status: 404 })
  }

  const articles = await prisma.article.findMany({
    where: { industryId: industry.id },
    orderBy: { publishedAt: 'desc' },
    take: 5,
    select: {
      title: true,
      summary: true,
    },
  })

  if (articles.length === 0) {
    return NextResponse.json(
      { error: `No articles found for sector: ${sector}` },
      { status: 404 }
    )
  }

  const prompt = await buildPrompt(sector, articles, deepDive)
  const briefing = await fetchGeminiResponse(prompt)
  const sentences = briefing.split(/(?<=[.?!])\s+/).filter(Boolean)
  const alert = sentences[0] || ''
  const marketNote = sentences[sentences.length - 1] || ''

  return NextResponse.json(
    {
      sector,
      briefing,
      alert,
      marketNote,
      deepDive,
      sourceArticles: articles,
      user: user ? { email: user.email, isPremium: user.isPremium } : null,
    },
    { status: 200 }
  )
}
