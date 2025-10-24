// app/(dashboard)/page.tsx
import React from "react";
import DashboardExample from "./dashboard/page";


const TOP_COMPANY_URL = process.env.INTERNAL_API_URL
  ? `${process.env.INTERNAL_API_URL.replace(/\/$/, "")}/metrics/top-company`
  : `/metrics/top-company`;

async function fetchTopCompanyServer(): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(TOP_COMPANY_URL, {
      method: "GET",
      headers: {
        ...(process.env.SERVICE_TOKEN ? { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` } : {}),
      },
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export default async function Page(): Promise<JSX.Element> {
  const defaultMetrics = {
    totalLeads: 273,
    hotLeads: 28,
    agentRuns: 360,
    activeAgents: 0,
    totalVisitors: 911,
    avgCompaniesPerDay: 39.0,
    days: 7,
    hotCut: 28,
  };

  let serverMetrics: Partial<typeof defaultMetrics> = {};

  const top = await fetchTopCompanyServer();
  if (top && typeof top.total_time_seconds === "number") {
    const s = Number(top.total_time_seconds || 0);
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    serverMetrics = {
      agentRuns: `${m}m ${sec}s`,
    };
  }

  const metrics = { ...defaultMetrics, ...serverMetrics };

  return <DashboardExample metrics={metrics} />;
}
