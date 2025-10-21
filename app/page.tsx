// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ArrowRight, Bot, Zap, Target, Shield, BarChart3, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Blended Purple Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/20 backdrop-blur-xl bg-[#1F1A3F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Image */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo@72x.png"
                alt="Delegatr Logo"
                width={120}
                height={40}
                className="group-hover:scale-110 transition-transform"
              />
            </Link>

            {/* Right side - Dynamic based on auth state */}
            <div className="flex items-center gap-4">
              <SignedOut>
                <Link 
                  href="/sign-in" 
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                  Get Started
                </Link>
              </SignedOut>

              <SignedIn>
                <Link 
                  href="/dashboard" 
                  className="text-slate-300 hover:text-purple-300 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-purple-500/30 hover:ring-purple-400/50 transition-all"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed nav */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">Delegate Your Lead Analysis to AI</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Delegate Lead Analysis.
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Focus on Closing.</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                AI agents automatically analyze your Leadfeeder data, score prospects, 
                and generate actionable lead sheets. Stop manually reviewing visitors. Start closing deals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/sign-up"
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="#features"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-all font-semibold text-lg border border-white/20"
                >
                  Learn More
                </Link>
              </div>

              <p className="text-sm text-slate-400 mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Intelligent Delegation
              </h2>
              <p className="text-xl text-slate-300">
                Let AI agents handle the analysis while you focus on revenue
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Bot className="w-8 h-8" />}
                title="AI Agent Workforce"
                description="Deploy specialized agents that analyze visitor behavior, score leads, and generate insights 24/7 without human intervention."
              />
              <FeatureCard 
                icon={<Zap className="w-8 h-8" />}
                title="Real-Time Processing"
                description="Get instant lead intelligence as visitors browse your site. Agents process data in seconds, not hours."
              />
              <FeatureCard 
                icon={<Target className="w-8 h-8" />}
                title="Smart Prioritization"
                description="Hot, warm, and cold lead categorization based on buying signals, engagement depth, and behavioral patterns."
              />
              <FeatureCard 
                icon={<BarChart3 className="w-8 h-8" />}
                title="Actionable Insights"
                description="Receive specific recommendations for each lead including optimal outreach timing and personalized messaging strategies."
              />
              <FeatureCard 
                icon={<Shield className="w-8 h-8" />}
                title="Enterprise Security"
                description="SOC 2 compliant with end-to-end encryption. Your data stays secure with enterprise-grade infrastructure."
              />
              <FeatureCard 
                icon={<Sparkles className="w-8 h-8" />}
                title="CRM Integration"
                description="Seamlessly sync with Salesforce, HubSpot, and other CRMs. Export lead sheets in any format your team needs."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Delegate Your Lead Analysis?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join sales teams using AI agents to close more deals with less manual work.
            </p>
            <Link 
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-purple-50 transition-all font-semibold text-lg shadow-xl"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-slate-400 text-sm">
              © 2025 Delegatr. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:border-purple-500/50">
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}