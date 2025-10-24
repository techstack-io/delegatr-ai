import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ScoutChat } from "../../components/scout/scout-chat";
import UserMenu from "@/components/UserMenu";
import TopCompany from "@/components/TopCompanyStat.client";
import { Bot, LayoutDashboard, Users, Settings, BarChart3, Menu, Bell, Search } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 p-6 border-b border-white/10">
            <Bot className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Delegatr
            </span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <NavItem href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
            <NavItem href="/dashboard/leads" icon={<Users className="w-5 h-5" />} label="Leads" />
            <NavItem href="/dashboard/analytics" icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
            <NavItem href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
          </nav>

          <div className="p-4">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 text-center shadow-xl">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold mb-1">Upgrade to Pro</h3>
              <p className="text-purple-100 text-xs mb-3">Unlock unlimited agents</p>
              <button className="w-full bg-white text-purple-600 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-all">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        <nav className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" aria-label="Open menu">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <p className="text-sm text-gray-500">Pages / Dashboard</p>
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type here..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>

              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <UserMenu
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </div>
        </nav>

        <main className="p-8 bg-white">{children}</main>

        {/* Client overlay: Scout concierge */}
        <ScoutChat />
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active ? "bg-white shadow-lg text-gray-800" : "text-gray-300 hover:bg-white/10"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
