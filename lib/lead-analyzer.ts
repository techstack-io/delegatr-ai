// lib/lead-analyzer.ts
/**
 * Simple Lead Analyzer (no Claude for tonight)
 * Tomorrow we'll add Claude back with proper JSON handling
 */

import type { LeadfeederLead } from './leadfeeder';

export type AnalyzedLead = {
  id: string;
  name: string;
  industry?: string;
  visits: number;
  quality: number;
  customScore: number;
  category: 'HOT' | 'WARM' | 'COOL';
  insights: string;
  website?: string;
  linkedin?: string;
  employeeCount?: number;
  revenue?: string;
  firstVisit: string;
  lastVisit: string;
};

export type AnalysisResult = {
  leads: AnalyzedLead[];
  summary: string;
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coolLeads: number;
  avgScore: number;
  topProducts: Array<{ url: string; title: string; visits: number }>;
};

export async function analyzeLeadsWithClaude(
  leads: LeadfeederLead[],
  apiKey: string
): Promise<AnalysisResult> {
  console.log(`Analyzing ${leads.length} leads with simple scoring...`);

  const analyzedLeads: AnalyzedLead[] = leads.map(lead => {
    // Simple scoring algorithm based on visits and quality
    const visitScore = Math.min(lead.attributes.visits * 8, 60); // Max 60 points from visits
    const qualityScore = lead.attributes.quality * 4; // Max 40 points from quality (0-10 scale)
    const customScore = Math.min(100, visitScore + qualityScore);

    // Categorize
    let category: 'HOT' | 'WARM' | 'COOL';
    if (customScore >= 75) category = 'HOT';
    else if (customScore >= 50) category = 'WARM';
    else category = 'COOL';

    // Generate insight
    let insights = '';
    if (lead.attributes.visits > 10) {
      insights = `High engagement: ${lead.attributes.visits} visits`;
    } else if (lead.attributes.visits > 5) {
      insights = `Moderate interest: ${lead.attributes.visits} visits`;
    } else {
      insights = `Early research: ${lead.attributes.visits} visits`;
    }

    return {
      id: lead.id,
      name: lead.attributes.name,
      industry: lead.attributes.industries?.[0]?.name || lead.attributes.industry,
      visits: lead.attributes.visits,
      quality: lead.attributes.quality,
      customScore: Math.round(customScore),
      category,
      insights,
      website: lead.attributes.website_url,
      linkedin: lead.attributes.linkedin_url,
      employeeCount: lead.attributes.employee_count,
      revenue: lead.attributes.revenue,
      firstVisit: lead.attributes.first_visit_date,
      lastVisit: lead.attributes.last_visit_date,
    };
  });

  // Calculate metrics
  const hotLeads = analyzedLeads.filter(l => l.category === 'HOT').length;
  const warmLeads = analyzedLeads.filter(l => l.category === 'WARM').length;
  const coolLeads = analyzedLeads.filter(l => l.category === 'COOL').length;
  const avgScore = analyzedLeads.reduce((sum, l) => sum + l.customScore, 0) / analyzedLeads.length;

  console.log(`Analysis complete: ${hotLeads} HOT, ${warmLeads} WARM, ${coolLeads} COOL`);

  return {
    leads: analyzedLeads,
    summary: `Analyzed ${analyzedLeads.length} leads: ${hotLeads} hot opportunities, ${warmLeads} warm leads, ${coolLeads} cool prospects.`,
    totalLeads: analyzedLeads.length,
    hotLeads,
    warmLeads,
    coolLeads,
    avgScore: Math.round(avgScore),
    topProducts: [],
  };
}