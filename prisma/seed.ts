import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.briefing.deleteMany();
  await prisma.article.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.user.deleteMany();

  const author = await prisma.user.create({
    data: {
      email: 'editor@b2bintel.com',
      name: 'Maya Singh',
      role: 'editor',
      isPremium: false,
    },
  });

  const premiumUser = await prisma.user.create({
    data: {
      email: 'premium@b2bintel.com',
      name: 'Ari Patel',
      role: 'subscriber',
      isPremium: true,
    },
  });

  const industries = await Promise.all([
    prisma.industry.create({
      data: {
        name: 'Logistics',
        description: 'Insight into freight, shipping, and supply-chain operations for enterprise logistics teams.',
      },
    }),
    prisma.industry.create({
      data: {
        name: 'Fintech',
        description: 'Coverage of payments, banking infrastructure, and AI-driven financial services.',
      },
    }),
    prisma.industry.create({
      data: {
        name: 'Manufacturing',
        description: 'Analysis of production automation, industrial supply, and smart factory trends.',
      },
    }),
    prisma.industry.create({
      data: {
        name: 'Energy',
        description: 'Market updates on utilities, renewable infrastructure, and energy transition risk.',
      },
    }),
  ]);

  const industryMap = industries.reduce<Record<string, string>>((map, industry) => {
    map[industry.name] = industry.id;
    return map;
  }, {});

  const articles = [
    {
      title: 'Logistics operators shift to modular last-mile fleets ahead of Q4 demand',
      summary: 'Regulatory alert: new urban delivery permit rules in APAC may alter cross-border routing. Ticker: LOGI-AX 1.8%',
      industryId: industryMap.Logistics,
    },
    {
      title: 'Warehouse automation spend accelerates as labor costs climb',
      summary: 'Market data: warehouse operator index up 4.6% after new robotics funding round.',
      industryId: industryMap.Logistics,
    },
    {
      title: 'Customs clearance delays persist despite digital trade document rollout',
      summary: 'Regulatory alert: mandatory e-manifest rules now apply to refrigerated cargo. Ticker: FRT-GLB 2.1%',
      industryId: industryMap.Logistics,
    },
    {
      title: 'Air freight capacity tightens for semiconductor shipments',
      summary: 'Market data: air cargo benchmark rises 9.2% versus prior quarter.',
      industryId: industryMap.Logistics,
    },
    {
      title: 'Fintech underwriting platforms prepare for new consumer data rules',
      summary: 'Regulatory alert: privacy compliance deadlines set by EU digital finance framework.',
      industryId: industryMap.Fintech,
    },
    {
      title: 'Embedded payments pilots boost B2B vendor settlement speed',
      summary: 'Ticker: PAYM-NET 3.3% after record transaction volume.',
      industryId: industryMap.Fintech,
    },
    {
      title: 'Blockchain KYC providers win contracts with corporate treasury desks',
      summary: 'Market data: digital identity solutions demand jumps 22% year-over-year.',
      industryId: industryMap.Fintech,
    },
    {
      title: 'Central bank digital currency simulation expands to institutional networks',
      summary: 'Regulatory alert: CBDC pilot guidance now includes AML controls for stablecoin issuers.',
      industryId: industryMap.Fintech,
    },
    {
      title: 'Smart factory sensors slash maintenance downtime in Q3 rollouts',
      summary: 'Market data: industrial IoT adoption index climbs 5.8% after new sensor contracts.',
      industryId: industryMap.Manufacturing,
    },
    {
      title: 'Steel suppliers reevaluate backward integration after tariff uncertainty',
      summary: 'Regulatory alert: updated import quotas may affect tier-one suppliers.',
      industryId: industryMap.Manufacturing,
    },
    {
      title: 'Advanced materials startups secure funding for sustainable packaging',
      summary: 'Ticker: MATL-ADV 4.9% on supply chain resilience outlook.',
      industryId: industryMap.Manufacturing,
    },
    {
      title: 'Factory floor energy efficiency programs gain traction under ESG mandates',
      summary: 'Market data: utilities-linked manufacturing index rises 3.7%.',
      industryId: industryMap.Manufacturing,
    },
    {
      title: 'Renewable power PPAs jump as corporates lock in energy transition budgets',
      summary: 'Ticker: ENRG-PPX 2.5% amid new green contract announcements.',
      industryId: industryMap.Energy,
    },
    {
      title: 'Grid resilience funding increases after storm-readiness mandates',
      summary: 'Regulatory alert: new utility inspection standards coming into force.',
      industryId: industryMap.Energy,
    },
    {
      title: 'Hydrogen logistics partnerships accelerate for heavy industry export markets',
      summary: 'Market data: hydrogen project index up 6.0% with new export terminal deals.',
      industryId: industryMap.Energy,
    },
  ];

  await Promise.all(
    articles.map((article) =>
      prisma.article.create({
        data: {
          ...article,
          publishedAt: new Date(),
        },
      })
    )
  );

  await Promise.all([
    prisma.briefing.create({
      data: {
        title: 'Logistics regulatory pulse and freight market tickers',
        content:
          'Headline roundup for Logistics: urban delivery permits, customs e-manifest updates, air freight capacity tightness. Key tickers: LOGI-AX 1.8%, FRT-GLB 2.1%.',
        premium: false,
        authorId: author.id,
      },
    }),
    prisma.briefing.create({
      data: {
        title: 'Fintech compliance briefing for corporate finance teams',
        content:
          'Market note for Fintech: KYC blockchain contracts, CBDC pilot guidance, embedded payments growth. Regulatory alert: new consumer data rules and privacy controls.',
        premium: false,
        authorId: author.id,
      },
    }),
    prisma.briefing.create({
      data: {
        title: 'Manufacturing margin resilience under new trade and ESG policy',
        content:
          'Coverage includes smart factory uptime, steel tariff risk, sustainable packaging funding, and energy efficiency programs. Tickers reference: MATL-ADV 4.9%, manufacturing index +3.7%.',
        premium: true,
        authorId: author.id,
      },
    }),
    prisma.briefing.create({
      data: {
        title: 'Energy transition alert: utility mandates and hydrogen export deals',
        content:
          'Insights on renewable PPA growth, grid resilience standards, and hydrogen logistics. Market data highlights: ENRG-PPX 2.5%, hydrogen index +6.0%.',
        premium: true,
        authorId: author.id,
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
