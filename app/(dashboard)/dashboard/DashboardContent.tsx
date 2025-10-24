// app/(dashboard)/dashboard/DashboardContent.tsx
"use client";

import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

type Metrics = {
  totalLeads: number;
  hotLeads: number;
  warmLeads?: number;
  coolLeads?: number;
  agentRuns: number;
  avgScore?: number;
};

type AnalyzedLead = {
  id: string;
  name: string;
  industry?: string;
  visits: number;
  customScore: number;
  category: 'HOT' | 'WARM' | 'COOL';
  insights: string;
  website?: string;
  employeeCount?: number;
  revenue?: string;
};

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
};

function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex gap-4 items-center">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

type LeadsTableProps = {
  leads: AnalyzedLead[];
  category: 'HOT' | 'WARM' | 'COOL';
};

function LeadsTable({ leads, category }: LeadsTableProps) {
  const categoryLeads = leads.filter(l => l.category === category);
  
  if (categoryLeads.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h4 className="font-semibold mb-3 text-gray-900">
        {category} leads ({categoryLeads.length})
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 border-b">
              <th className="px-2 py-2">Company</th>
              <th className="px-2 py-2">Score</th>
              <th className="px-2 py-2">Visits</th>
              <th className="px-2 py-2">Employees</th>
              <th className="px-2 py-2">Insights</th>
            </tr>
          </thead>
          <tbody>
            {categoryLeads.map((lead) => (
              <tr key={lead.id} className="border-t">
                <td className="px-2 py-2">
                  <div className="font-medium text-gray-900">{lead.name}</div>
                  <div className="text-xs text-gray-500">{lead.industry ?? "—"}</div>
                </td>
                <td className="px-2 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    lead.customScore >= 75 ? 'bg-green-100 text-green-800' :
                    lead.customScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.customScore}
                  </span>
                </td>
                <td className="px-2 py-2 text-gray-900">{lead.visits}</td>
                <td className="px-2 py-2 text-gray-900">{lead.employeeCount ?? "—"}</td>
                <td className="px-2 py-2 text-xs text-gray-700">
                  {lead.insights.slice(0, 80)}{lead.insights.length > 80 ? '...' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DashboardContent({ 
  initialMetrics 
}: { 
  initialMetrics: Metrics | null 
}) {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics || {
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coolLeads: 0,
    agentRuns: 0,
    avgScore: 0,
  });
  const [leads, setLeads] = useState<AnalyzedLead[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/leads/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days: 7 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to analyze leads');
      }

      const data = await response.json();
      
      setMetrics(data.metrics);
      setLeads(data.leads || []);
      setSummary(data.summary || '');
      setLastAnalyzed(data.analyzedAt);
    } catch (err: any) {
      console.error('Error analyzing leads:', err);
      setError(err.message || 'Failed to analyze leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, Dan! <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-gray-600">Here's what's happening with your leads this week.</p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Leads
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {lastAnalyzed && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-purple-800">
          <strong>Last analyzed:</strong> {new Date(lastAnalyzed).toLocaleString()}
        </div>
      )}

      {summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Insights
          </h3>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={metrics.totalLeads}
          subtitle="Companies this week"
          icon={
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="7" r="3" strokeWidth="1.5" />
              <path d="M5.5 21a6.5 6.5 0 0113 0" strokeWidth="1.5" />
            </svg>
          }
        />
        <StatCard
          title="Hot Leads"
          value={metrics.hotLeads}
          subtitle="Score 75-100"
          icon={
            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h6l3 8 5-16 3 8h2" strokeWidth="1.5" />
            </svg>
          }
        />
        <StatCard
          title="Agent Runs"
          value={metrics.agentRuns}
          subtitle="Claude analyses completed"
          icon={
            <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2v6l4 2-4 2v6" strokeWidth="1.5" />
            </svg>
          }
        />
        <StatCard
          title="Avg Score"
          value={metrics.avgScore || "—"}
          subtitle="Overall lead quality"
          icon={
            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <path d="M8 14v-4h8v4" strokeWidth="1.5" />
            </svg>
          }
        />
      </div>

      {leads.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Lead Breakdown</h2>
          <LeadsTable leads={leads} category="HOT" />
          <LeadsTable leads={leads} category="WARM" />
          <LeadsTable leads={leads} category="COOL" />
        </div>
      )}

      {!loading && metrics.totalLeads === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready to analyze your leads?
          </h3>
          <p className="text-gray-600 mb-6">
            Click "Analyze Leads" to have Claude intelligently score and categorize your website visitors from Leadfeeder.
          </p>
          <button
            onClick={handleAnalyze}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}
