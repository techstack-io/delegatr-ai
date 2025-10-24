// app/api/metrics/top-company/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // sample payload matching the shape used by the dashboard page
  const sample = {
    company_id: "sample-1",
    name: "Electronic Contracting (ECC)",
    domain: "ecc.example",
    total_time_seconds: 1680, // 28m 0s
    visits_count: 12
  };

  return NextResponse.json(sample, { status: 200 });
}
