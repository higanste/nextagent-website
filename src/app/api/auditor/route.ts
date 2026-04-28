import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/cf-helpers';

const IMPECCABLE_AUDIT_PROMPT = `You are an expert design auditor using the Impeccable design system.
Audit the provided website URL for design quality issues.

Check these areas:
1. TYPOGRAPHY - Font choices, sizes, hierarchy, readability
2. COLOR & CONTRAST - Color usage, WCAG accessibility, dark mode support
3. SPATIAL DESIGN - Spacing systems, grids, visual hierarchy
4. MOTION DESIGN - Animations, easing curves, reduced motion support
5. INTERACTION DESIGN - Forms, focus states, loading patterns
6. RESPONSIVE DESIGN - Mobile-first approach, fluid design

Provide a JSON response with EXACTLY this structure (no additional text):
{
  "score": <number 1-100>,
  "issues": [
    {
      "severity": "critical|major|minor",
      "category": "typography|color|spatial|motion|interaction|responsive",
      "issue": "Description of the issue",
      "fix": "Actionable fix suggestion"
    }
  ],
  "strengths": ["List of design strengths"],
  "summary": "Brief overall assessment"
}`;

const VIBE_SECURITY_PROMPT = `You are a security auditor using Vibe Security patterns.
Audit the provided website URL for security vulnerabilities.

Check these areas:
1. SECRETS & ENV VARS - Hardcoded API keys, exposed env vars (NEXT_PUBLIC_, VITE_, EXPO_PUBLIC_)
2. AUTH & AUTHORIZATION - Weak JWT verification, middleware-only auth, tokens in localStorage
3. RATE LIMITING - Missing rate limits on auth/AI/email endpoints
4. PAYMENTS - Client-submitted prices, missing Stripe webhook verification
5. DATABASE - SQL injection, missing RLS policies (Supabase), insecure queries
6. DEPLOYMENT - Debug mode in production, exposed source maps, missing security headers

Provide a JSON response with EXACTLY this structure (no additional text):
{
  "score": <number 1-100>,
  "vulnerabilities": [
    {
      "severity": "critical|major|minor",
      "category": "secrets|auth|rate_limiting|payments|database|deployment",
      "issue": "Description of the vulnerability",
      "fix": "Actionable fix suggestion"
    }
  ],
  "passed": ["List of checks that passed"],
  "summary": "Brief overall assessment"
}`;

async function callOpenAI(apiKey: string, prompt: string, url: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `Audit this website: ${url}` }
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');
    const type = req.nextUrl.searchParams.get('type') || 'full';

    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const { env } = getRequestContext() as unknown as { env: any };
    const apiKey = env.OPENAI_API_KEY || env.OPENAI_API_KEY_2;

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const results: any = { url, auditedAt: new Date().toISOString() };

    if (type === 'design' || type === 'full') {
      try {
        results.design = await callOpenAI(apiKey, IMPECCABLE_AUDIT_PROMPT, url);
      } catch (error: any) {
        results.design = { error: error.message };
      }
    }

    if (type === 'security' || type === 'full') {
      try {
        results.security = await callOpenAI(apiKey, VIBE_SECURITY_PROMPT, url);
      } catch (error: any) {
        results.security = { error: error.message };
      }
    }

    if (type === 'full' && results.design && results.security) {
      const designScore = results.design.score || 50;
      const securityScore = results.security.score || 50;
      results.overall = Math.round((designScore + securityScore) / 2);
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('[auditor api error]', error);
    return NextResponse.json(
      { error: 'Audit failed', message: error.message },
      { status: 500 }
    );
  }
}
