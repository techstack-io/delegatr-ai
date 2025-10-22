// components/scout/scout-chat.tsx
'use client';

import { useState } from 'react';
import { Bot, X, Send, Binoculars, Target, Search, BarChart3, HelpCircle } from 'lucide-react';

export function ScoutChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'scout',
      text: "Scout here! How can I help?"
    }
  ]);

  const quickActions = [
    { icon: <Search className="w-4 h-4" />, label: "Search", action: "search" },
    { icon: <Target className="w-4 h-4" />, label: "View hot leads", action: "hotleads" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Generate report", action: "report" },
    { icon: <Binoculars className="w-4 h-4" />, label: "Restart tour", action: "tour" },
  ];

  const handleQuickAction = (action: string) => {
    if (action === "tour") {
      localStorage.removeItem('hasSeenScoutTour');
      window.location.reload();
    } else if (action === "search") {
      addScoutMessage("To search for a company, use the search bar at the top of your dashboard. I'll pull up their visit history and AI analysis!");
    } else if (action === "hotleads") {
      addScoutMessage("Your hot leads (score 85+) are companies showing strong purchase intent. Check the 'Hot Targets' section on your dashboard!");
    } else if (action === "report") {
      addScoutMessage("Weekly reports are generated automatically every Monday at 8am. You can also generate one anytime from the dashboard!");
    }
  };

  const addScoutMessage = (text: string) => {
    setMessages(prev => [...prev, { from: 'scout', text }]);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { from: 'user', text: message }]);

    // Simulate Scout response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "score": "🎯 Great question! Our proprietary score (0-100) analyzes 15+ behavioral signals to predict purchase intent. Leadfeeder only gives you a 1-10 engagement score. Scores 85+ = Hot leads ready to buy!",
        "help": "I can help you with: searching companies, understanding lead scores, generating reports, and navigating the dashboard. What would you like to know?",
        "leads": "📊 I'm currently monitoring your site 24/7. Once you connect Leadfeeder, I'll start identifying hot prospects automatically!",
        "report": "📋 Weekly reports run every Monday at 8am. They include all leads from the past 7 days, organized by priority with actionable recommendations.",
      };

      const lowerMessage = message.toLowerCase();
      let response = "I'm still learning! For now, try the quick actions below or ask about: scores, leads, reports, or help.";

      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }

      addScoutMessage(response);
    }, 500);

    setMessage('');
  };

  return (
    <>
      {/* Floating Scout Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 group"
      >
        <Bot className="w-7 h-7 text-white" />
        {/* Online indicator */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-75 group-hover:opacity-0"></span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-purple-200">
          {/* Header */}
          <div className="bg-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-8 h-8 text-white" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600"></span>
              </div>
              <div>
                <h3 className="text-white font-bold">Scout</h3>
                <p className="text-purple-100 text-xs">Lead Intelligence Agent</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.from === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {msg.from === 'scout' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-600">Scout</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center gap-2 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg p-3 text-left transition-colors text-sm"
                    >
                      <span className="text-purple-600">{action.icon}</span>
                      <span className="text-gray-700 font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Scout anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Try asking: "What's a good score?" or "How do reports work?"</p>
          </div>
        </div>
      )}
    </>
  );
}