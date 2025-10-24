"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Binoculars, Target, Search, BarChart3 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

type Role = "scout" | "user" | "assistant";
type Msg = { id: string; role: Role; text: string; actions?: any[] };

const QUICK = [
  { icon: <Search className="w-4 h-4" />, label: "Search", prompt: "Search for company:" },
  { icon: <Target className="w-4 h-4" />, label: "View hot leads", prompt: "Show hot leads for the last 7 days" },
  { icon: <BarChart3 className="w-4 h-4" />, label: "Generate report", prompt: "Generate a weekly lead report" },
  { icon: <Binoculars className="w-4 h-4" />, label: "Restart tour", action: "tour" },
];

export function ScoutChat(): JSX.Element {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: `m-${Date.now()}`, role: "scout", text: "Scout here! How can I help?" },
  ]);
  const [running, setRunning] = useState<boolean>(false);
  const [runId, setRunId] = useState<string | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      sseRef.current?.close();
    };
  }, []);

  useEffect(() => {
    // auto-scroll
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, isOpen]);

  function pushMsg(m: Omit<Msg, "id">) {
    setMsgs((prev) => [...prev, { ...m, id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }]);
  }

  async function sendPrompt(promptText: string) {
    const prompt = promptText.trim();
    if (!prompt) return;
    pushMsg({ role: "user", text: prompt });
    setInput("");
    setRunning(true);

    // get Clerk token
    let token = "";
    try {
      token = (await getToken({ template: "integration" })) || (await getToken()) || "";
    } catch {
      try {
        token = await getToken();
      } catch {}
    }

    // start run
    const res = await fetch("/api/agents/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
      body: JSON.stringify({ prompt, stream: true }),
    });

    if (!res.ok) {
      const err = await res.text();
      pushMsg({ role: "scout", text: `Error starting concierge: ${err}` });
      setRunning(false);
      return;
    }

    const body = await res.json().catch(() => null);
    const id = body?.run_id ?? `run-${Date.now()}`;
    setRunId(id);

    // open SSE stream (EventSource does not accept headers) -> attach token as query param
    sseRef.current?.close();
    const streamUrl = `/api/agents/concierge/stream/${id}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
    const es = new EventSource(streamUrl, { withCredentials: true } as any);
    sseRef.current = es;

    let buffer = "";
    // optimistic assistant placeholder
    pushMsg({ role: "assistant", text: "" });

    es.onmessage = (e) => {
      if (e.data === "[DONE]") {
        // finalize last assistant message (buffer contains final content)
        setMsgs((cur) => {
          const last = [...cur].reverse().find((m) => m.role === "assistant");
          if (!last) return cur;
          return cur.map((m) => (m.id === last.id ? { ...m, text: buffer, actions: extractActions(buffer) } : m));
        });
        buffer = "";
        setRunning(false);
        es.close();
        return;
      }

      // append token chunk
      buffer += e.data;
      // patch last assistant message progressively
      setMsgs((cur) => {
        const last = [...cur].reverse().find((m) => m.role === "assistant");
        if (!last) return cur;
        return cur.map((m) => (m.id === last.id ? { ...m, text: buffer } : m));
      });
    };

    es.onerror = () => {
      pushMsg({ role: "scout", text: "Stream error. Retrying may help." });
      setRunning(false);
      es.close();
    };
  }

  // crude action extractor: assistant may emit a JSON block prefixed with "ACTION:" or a line with {"action":...}
  function extractActions(text: string): any[] {
    const found: any[] = [];
    try {
      // look for explicit 'ACTION:' marker
      const actionMarker = /ACTION:\s*(\{[\s\S]*\})/m.exec(text);
      if (actionMarker) {
        const parsed = JSON.parse(actionMarker[1]);
        found.push(parsed);
      } else {
        // fallback: try to parse any JSON object in text
        const jsonMatch = /(\{[\s\S]*\})/.exec(text);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed?.type) found.push(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
    return found;
  }

  async function executeAction(action: any) {
    if (!runId) {
      pushMsg({ role: "scout", text: "No active run for action." });
      return;
    }
    let token = "";
    try {
      token = (await getToken({ template: "integration" })) || (await getToken()) || "";
    } catch {
      try {
        token = await getToken();
      } catch {}
    }

    const res = await fetch(`/api/agents/concierge/${runId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      const txt = await res.text();
      pushMsg({ role: "scout", text: `Action failed: ${txt}` });
      return;
    }
    const out = await res.json().catch(() => null);
    pushMsg({ role: "scout", text: `Action executed: ${JSON.stringify(out ?? "ok")}` });
  }

  function handleQuick(actionOrPrompt: string | { action?: string; prompt?: string }) {
    if (typeof actionOrPrompt === "string") return;
    if (actionOrPrompt.action === "tour") {
      localStorage.removeItem("hasSeenScoutTour");
      window.location.reload();
      return;
    }
  }

  return (
    <>
      {/* Floating Scout Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 group"
        aria-label="Open Scout"
      >
        <Bot className="w-7 h-7 text-white" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
        <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-75 group-hover:opacity-0"></span>
      </button>

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
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors" aria-label="Close">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {msgs.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" ? "bg-purple-600 text-white" : "bg-white text-gray-800 border border-gray-200"}`}
                >
                  {msg.role === "scout" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-600">Scout</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                  {/* render detected actions */}
                  {msg.actions?.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {msg.actions.map((a: any, i: number) => (
                        <button key={i} onClick={() => executeAction(a)} className="px-3 py-1 bg-purple-600 text-white rounded text-xs">
                          Execute: {a.name ?? a.type ?? "action"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick actions only when no user messages yet */}
            {msgs.length <= 1 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (q.action === "tour") {
                          localStorage.removeItem("hasSeenScoutTour");
                          window.location.reload();
                          return;
                        }
                        // prefill the input or send directly
                        if (q.prompt) sendPrompt(q.prompt);
                      }}
                      className="flex items-center gap-2 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg p-3 text-left transition-colors text-sm"
                    >
                      <span className="text-purple-600">{q.icon}</span>
                      <span className="text-gray-700 font-medium">{q.label}</span>
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendPrompt(input)}
                placeholder="Ask Scout anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button onClick={() => sendPrompt(input)} disabled={running} className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors" aria-label="Send">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Try: "Show hot leads" or "Create project for ECC".</p>
          </div>
        </div>
      )}
    </>
  );
}
