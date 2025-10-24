// app/api/leads/analyze/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchAllLeads, getDateRange } from '@/lib/leadfeeder';
import { analyzeLeadsWithClaude } from '@/lib/lead-analyzer';

// In-memory storage for analysis results (replace with database later)
let lastAnalysis: any = null;
let agentRunCount = 0;

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get configuration from env
    const leadfeederAccountId = '281219';
    const leadfeederApiKey = process.env.LEADFEEDER_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    if (!leadfeederApiKey) {
      return NextResponse.json(
        { error: 'LEADFEEDER_API_KEY not configured' },
        { status: 500 }
      );
    }

    if (!anthropicApiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Parse request body for custom date range (optional)
    const body = await request.json().catch(() => ({}));
    const days = body.days || 7;

    // Get date range
    const { startDate, endDate } = getDateRange(days);

    console.log(`Fetching leads from ${startDate} to ${endDate}...`);

    // Step 1: Fetch leads from Leadfeeder
    const leads = await fetchAllLeads(
      leadfeederAccountId,
      startDate,
      endDate,
      leadfeederApiKey
    );

    console.log(`Fetched ${leads.length} leads from Leadfeeder`);

    if (leads.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No leads found in the specified date range',
        metrics: {
          totalLeads: 0,
          hotLeads: 0,
          warmLeads: 0,
          coolLeads: 0,
          agentRuns: agentRunCount,
          avgScore: 0,
        },
        leads: [],
      });
    }

    // Step 2: Analyze leads with Claude
    console.log('Analyzing leads with Claude...');
    const analysis = await analyzeLeadsWithClaude(leads, anthropicApiKey);

    // Increment agent run counter
    agentRunCount++;

    // Store the analysis
    lastAnalysis = {
      ...analysis,
      analyzedAt: new Date().toISOString(),
      agentRuns: agentRunCount,
    };

    console.log('Analysis complete!');

    return NextResponse.json({
      success: true,
      message: `Analyzed ${analysis.totalLeads} leads successfully`,
      metrics: {
        totalLeads: analysis.totalLeads,
        hotLeads: analysis.hotLeads,
        warmLeads: analysis.warmLeads,
        coolLeads: analysis.coolLeads,
        agentRuns: agentRunCount,
        avgScore: analysis.avgScore,
      },
      summary: analysis.summary,
      leads: analysis.leads,
      analyzedAt: lastAnalysis.analyzedAt,
    });
  } catch (error: any) {
    console.error('Error analyzing leads:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze leads',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve last analysis
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!lastAnalysis) {
      return NextResponse.json({
        success: true,
        message: 'No analysis available yet. Click "Analyze Leads" to start.',
        metrics: {
          totalLeads: 0,
          hotLeads: 0,
          warmLeads: 0,
          coolLeads: 0,
          agentRuns: agentRunCount,
          avgScore: 0,
        },
        leads: [],
      });
    }

    return NextResponse.json({
      success: true,
      ...lastAnalysis,
    });
  } catch (error: any) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis', details: error.message },
      { status: 500 }
    );
  }
}