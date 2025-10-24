// app/(dashboard)/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardContent from './DashboardContent';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Don't fetch initially - let user click "Analyze Leads"
  return <DashboardContent initialMetrics={null} />;
}