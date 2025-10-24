// app/(auth)/sign-up/[[...sign-up]]/page.tsx
'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-purple-500/20 backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Delegatr
              </span>
            </Link>
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Get started free</h2>
            <p className="text-slate-300">Start turning visitors into leads today</p>
          </div>

          <div className="flex justify-center">
            <SignUp
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: 'w-full flex justify-center',
                  card: 'bg-white/10 backdrop-blur-lg border border-purple-500/20 shadow-2xl w-full',
                  headerTitle: 'text-white text-center',
                  headerSubtitle: 'text-slate-300 text-center',
                  socialButtonsBlockButton: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200',
                  formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg',
                  formFieldInput: 'bg-white/10 border-purple-500/20 text-white placeholder:text-slate-400',
                  formFieldLabel: 'text-slate-300',
                  footerActionLink: 'text-purple-400 hover:text-purple-300',
                  footer: 'text-center',
                  footerAction: 'text-center',
                  formResendCodeLink: 'text-purple-400 hover:text-purple-300',
                  identityPreviewText: 'text-white',
                  otpCodeFieldInput: 'bg-white/10 border-purple-500/20 text-white',
                },
              }}
            />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <div>✓ No credit card required</div>
            <div>✓ 14-day free trial</div>
            <div>✓ Cancel anytime</div>
          </div>
        </div>
      </div>
    </div>
  );
}
