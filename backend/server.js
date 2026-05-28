import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

async function callClaude(systemPrompt, userContent, maxTokens = 4096) {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  });
  return message.content[0].text;
}

// Phase 1: Niche Discovery
app.post('/api/phase1', async (req, res) => {
  const { interests, budget, targetAudience, hoursPerWeek } = req.body;

  const system = `You are an expert Shopify business strategist specializing in digital products.
You help entrepreneurs find profitable niches and build sustainable online businesses.
Your advice is specific, actionable, and grounded in real market data.`;

  const user = `Based on the following profile, recommend exactly 3 specific and highly profitable niches for a Shopify digital product business:

**Profile:**
- Interests & Skills: ${interests}
- Starting Budget: ${budget}
- Target Audience: ${targetAudience}
- Hours Available Per Week: ${hoursPerWeek}

For each niche provide:

## Niche [N]: [Name]

**Why It's Profitable**
[Market size, demand trends, why now is a good time]

**Competition Level:** [Low / Medium / High]
[Brief explanation of the competitive landscape]

**Estimated Startup Cost**
[Specific cost breakdown within their budget]

**Best Digital Products for This Niche**
- Product type 1
- Product type 2
- Product type 3

**Target Customer Profile**
[Detailed description of who buys, their pain points, where they hang out online]

**Realistic Revenue Potential**
[Month 1–3 projection, Month 4–6 projection, Year 1 potential — be honest and realistic]

**Your Unfair Advantage**
[How their specific skills/interests give them an edge in this niche]

---

Be specific. No generic advice. Every recommendation should be tailored to their exact profile.`;

  try {
    const result = await callClaude(system, user);
    res.json({ result });
  } catch (err) {
    console.error('Phase 1 error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Phase 2: Digital Product Creation
app.post('/api/phase2', async (req, res) => {
  const { niche, productType, priceRange, skillLevel, phase1Output } = req.body;

  const system = `You are a digital product creation expert who has helped hundreds of entrepreneurs build 6-figure Shopify stores.
You specialize in creating high-value digital products that customers love and recommend.`;

  const user = `Create 5 detailed digital product ideas for the following business:

**Business Context:**
- Chosen Niche: ${niche}
- Preferred Product Types: ${productType}
- Target Price Range: ${priceRange}
- Creator Skill Level: ${skillLevel}
${phase1Output ? `\n**Niche Research Context:**\n${phase1Output.slice(0, 800)}` : ''}

For each product, provide:

## Product [N]: [Compelling Product Name]

**One-Line Pitch**
[The value proposition in one punchy sentence]

**Full Description**
[2–3 sentences describing what it is and who it's for]

**What's Included**
- Item 1
- Item 2
- Item 3
[Continue as needed]

**Ideal Price Point:** $[X]
[Why this price — anchored to value, not cost]

**Creation Timeline**
- MVP Version: [X days/hours]
- Full Version: [X weeks]

**Tools Needed**
- Free: [tool 1, tool 2]
- Paid (optional): [tool 1, tool 2]

**What Makes It Stand Out**
[The specific differentiator from existing products]

**Sales Potential**
[Estimated monthly sales volume at target price if marketed well]

---

Make these products realistic for someone at a ${skillLevel} level. Prioritize products that can be created quickly but sold repeatedly.`;

  try {
    const result = await callClaude(system, user);
    res.json({ result });
  } catch (err) {
    console.error('Phase 2 error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Phase 3: Store Setup & Branding
app.post('/api/phase3', async (req, res) => {
  const { niche, productName, brandValues, storeNameIdeas } = req.body;

  const system = `You are a Shopify brand strategist and copywriter who has built and launched over 200 successful online stores.
You specialize in creating brand identities that connect emotionally with customers and drive conversions.`;

  const user = `Create a complete Shopify store brand identity and setup guide for:

**Store Details:**
- Niche: ${niche}
- Main Product: ${productName}
- Brand Values: ${brandValues}
- Store Name Ideas (if any): ${storeNameIdeas || 'Open to suggestions'}

Generate all of the following:

## Store Name Options
Provide 5 store name options that are:
- Available as .com domains (likely)
- Memorable and brandable
- Relevant to the niche

For each: **[Name]** — [why it works]

## Tagline Options
5 compelling taglines (one per line, with brief explanation)

## Brand Voice Guide

**Personality:** [3 adjectives]

**Tone:** [How you sound — friendly? authoritative? inspiring?]

**Words We Use:** [5–8 brand-aligned words/phrases]

**Words We Avoid:** [5–8 off-brand words]

**Writing Style:** [2–3 sentences describing the writing approach]

## About Page Copy
[Write a complete, conversion-focused About page — 300–400 words. Tell a story. Include: who this is for, the founder's motivation, the mission, and a CTA.]

## Homepage Hero Section

**Headline:** [Power headline — clear, specific, benefit-driven]

**Subheadline:** [Supporting sentence that adds context]

**Primary CTA:** [Button text]

**Trust Badges:** [4–5 trust signals to display]

## SEO Meta Description
[Homepage meta description, exactly 150–160 characters]

## Product Page Template Structure
[Outline the sections for a high-converting product page — title formula, description structure, what to include in each section]

Make everything specific to this niche and product. Every word should be written as if it's going live tomorrow.`;

  try {
    const result = await callClaude(system, user);
    res.json({ result });
  } catch (err) {
    console.error('Phase 3 error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Phase 4: Marketing Content Generation
app.post('/api/phase4', async (req, res) => {
  const { storeName, product, niche, platforms, targetAudience } = req.body;

  const system = `You are a digital marketing strategist specializing in organic and paid traffic for Shopify stores.
You create content that converts — not just content that gets likes. You understand the psychology of buyers.`;

  const user = `Create a complete marketing content package for this Shopify store:

**Store Details:**
- Store Name: ${storeName}
- Hero Product: ${product}
- Niche: ${niche}
- Marketing Platforms: ${platforms}
- Target Audience: ${targetAudience}

Generate all of the following:

## Social Media Content — 10 Posts

For each post include:
**Post [N] — [Platform]**
- **Caption:** [Full caption with emojis, line breaks for readability]
- **Hashtags:** [15–20 targeted hashtags]
- **Visual Concept:** [What the image/video should show]
- **Best Time to Post:** [Day + time]

Vary the content types: educational, testimonial-style, behind-the-scenes, promotional, storytelling.

## Email Marketing Sequence — 5 Emails

**Email [N]: [Subject Line]**
- **Subject Line A:** [Primary]
- **Subject Line B:** [A/B test variant]
- **Preview Text:** [45 characters max]
- **Body:**
[Full email body — conversational, not corporate. Include personalization tokens where natural.]
- **CTA:** [Button text + destination]

Emails: Welcome → Value → Social Proof → Soft Pitch → Hard Pitch

## Pinterest Pin Descriptions — 5 Pins

**Pin [N]:**
- **Title:** [100 chars max, keyword-rich]
- **Description:** [500 chars, storytelling + keywords]
- **Board:** [Suggested board name]

## Ad Copy — 3 Versions

For each version:
**Ad Version [N] — [Angle]**
- **Headline:** [25 chars max]
- **Primary Text:** [125 chars — the hook]
- **Description:** [25 chars]

## Content Pillars
5 recurring content themes with 3 post ideas each — organized so you never run out of ideas.

Make all content feel human, specific to this product, and designed to drive clicks and conversions.`;

  try {
    const result = await callClaude(system, user, 5000);
    res.json({ result });
  } catch (err) {
    console.error('Phase 4 error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Phase 5: 30-Day Launch Plan
app.post('/api/phase5', async (req, res) => {
  const { storeName, niche, product, weeklyBudget, hoursPerWeek, allContext } = req.body;

  const system = `You are a Shopify launch strategist who has taken dozens of stores from zero to their first $10k in sales.
You create realistic, achievable launch plans tailored to the founder's constraints — not theoretical ideal-world scenarios.`;

  const user = `Create a detailed, day-by-day 30-day launch plan for this business:

**Business:**
- Store: ${storeName}
- Niche: ${niche}
- Hero Product: ${product}
- Weekly Budget: ${weeklyBudget}
- Hours Available Per Week: ${hoursPerWeek}

## Week 1: Foundation (Days 1–7)
**Goal: Get the store live and ready**

For each day:
**Day [N] — [Theme]** (~[X] hours)
- Primary Task: [The one thing that must get done]
- Secondary Tasks: [2–3 supporting tasks]
- Tool/Resource: [What to use]
- End-of-Day Checkpoint: [How you know you're done]

## Week 2: Content & Audience (Days 8–14)
**Goal: Build your audience before launch**
[Same format as Week 1]

## Week 3: Pre-Launch Momentum (Days 15–21)
**Goal: Generate anticipation and early interest**
[Same format as Week 1]

## Week 4: Launch & First Sales (Days 22–30)
**Goal: Make your first 10 sales**
[Same format as Week 1]

## Weekly Success Metrics
What numbers to track each week and what "good" looks like.

## Milestone Targets
- Day 7 milestone:
- Day 14 milestone:
- Day 21 milestone:
- Day 30 milestone:

## If Things Aren't Working: Troubleshooting Guide

**No traffic by Day 21?** [Specific action steps]
**Traffic but no sales?** [Conversion fix checklist]
**First sale but nothing since?** [Momentum maintenance]

## Month 2 Priorities
Top 5 tasks to focus on after the launch month — how to build on momentum or course-correct.

Make the plan realistic for someone with ${hoursPerWeek} hours/week and a $${weeklyBudget}/week budget. Every day should be achievable without burning out.`;

  try {
    const result = await callClaude(system, user, 5000);
    res.json({ result });
  } catch (err) {
    console.error('Phase 5 error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', model: MODEL }));

// Serve React frontend in production (when the build exists)
const distPath = path.join(__dirname, '../frontend/dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Shopify Agent API running at http://localhost:${PORT}`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
