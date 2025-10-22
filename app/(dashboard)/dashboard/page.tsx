// app/(dashboard)/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { Bot, TrendingUp, Users, Zap } from 'lucide-react';
import { Suspense } from 'react';
import DashboardClient from './dashboard-client';

async function DashboardContent() {
  const { userId } = await auth();
  const user = await currentUser();

<button
  onClick={() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hasSeenScoutTour');
      window.location.reload();
    }
  }}
  className="fixed bottom-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 z-50"
></button>
  
  return (
    <>
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.firstName || 'there'}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour-id="stats-cards">
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Total Leads"
          value="0"
          subtitle="No leads yet"
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Hot Leads"
          value="0"
          subtitle="High priority"
          color="red"
        />
        <StatCard
          icon={<Zap className="w-8 h-8" />}
          title="Agent Runs"
          value="0"
          subtitle="This month"
          color="blue"
        />
        <StatCard
          icon={<Bot className="w-8 h-8" />}
          title="Active Agents"
          value="0"
          subtitle="Ready to deploy"
          color="green"
        />
      </div>

      {/* Getting Started Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200" data-tour-id="getting-started">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Getting Started</h2>
        <div className="space-y-4">
          <Step 
            number="1" 
            title="Connect Leadfeeder" 
            description="Add your Leadfeeder API key in settings to start tracking visitors"
            completed={false}
          />
          <Step 
            number="2" 
            title="Configure AI Agents" 
            description="Set up your lead scoring criteria and analysis preferences"
            completed={false}
          />
          <Step 
            number="3" 
            title="Deploy Agents" 
            description="Activate agents to start analyzing your leads automatically"
            completed={false}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to delegate your lead analysis?
        </h2>
        <p className="text-purple-100 mb-6">
          Connect your Leadfeeder account to get started
        </p>
        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold shadow-xl">
          Connect Leadfeeder
        </button>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <DashboardClient>
      <div className="space-y-8">
        <Suspense fallback={<div className="text-gray-600">Loading...</div>}>
          <DashboardContent />
        </Suspense>
      </div>
    </DashboardClient>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle: string; 
  color: string;
}) {
  const colorClasses = {
    purple: 'text-purple-600 bg-purple-100',
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
  }[color];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
      <div className={`w-12 h-12 rounded-xl ${colorClasses} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

function Step({ 
  number, 
  title, 
  description, 
  completed 
}: { 
  number: string; 
  title: string; 
  description: string; 
  completed: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        completed 
          ? 'bg-green-500 text-white' 
          : 'bg-purple-100 text-purple-600 border-2 border-purple-500'
      }`}>
        {completed ? '✓' : number}
      </div>
      <div className="flex-1">
        <h3 className="text-gray-800 font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}