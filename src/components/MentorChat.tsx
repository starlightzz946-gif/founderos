import React, { useState, useRef, useEffect } from "react";
import { UserProfile, StartupReport, ChatMessage, StartupIdea } from "../types";
import { MessageSquare, Send, Sparkles, User, RefreshCw } from "lucide-react";

interface MentorChatProps {
  profile: UserProfile;
  startup: StartupIdea | null;
  report: StartupReport | null;
}

export default function MentorChat({ profile, startup, report }: MentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-msg",
      userId: profile?.name || "guest",
      sender: "mentor",
      text: `Greetings, ${profile?.name || "founder"}! I am your FounderOS Co-founder and mentor. I possess full access to your experience matrix and startup milestones. Ask me any tactical launching plans, database indexing coordinates, or user interview approaches. Or click one of the quick-consult channels below!`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when messages load
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: profile.name || "guest",
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setSending(true);

    try {
      const response = await fetch("/api/chat-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          profile,
          startup,
          report
        })
      });

      if (!response.ok) {
        throw new Error("Server responded with error status");
      }

      const resData = await response.json();
      if (resData.message) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            userId: profile.name || "guest",
            sender: "mentor",
            text: resData.message.text,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err: any) {
      console.error("Mentor chat error Call:", err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          userId: profile.name || "guest",
          sender: "mentor",
          text: "I encountered a minor network latency issue trying to reach the central GenAI models. Please confirm your GEMINI_API_KEY environment variable is healthy and try sending that prompt again!",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(inputText);
    }
  };

  // Quick prompt templates
  const quickPrompts = [
    { label: "Check suitability bottlenecks", prompt: "Evaluate my founder profile against my startup requirements. What are the top 3 friction areas I should address immediately?" },
    { label: "Give user interview scripts", prompt: "Help me write a customer development script based on 'The Mom Test' guidelines to interview 5 potential users this week." },
    { label: "Design Stripe Connect pricing flows", prompt: "Explain how to structure Stripe Connect charges. What tables or webhooks must I configure inside my Firestore database layout?" },
    { label: "Outline 30-day MVP limits", prompt: "I only have 20 hours a week and $2,000. Recommend exactly what features I must cut from my MVP plan to launch inside thirty days." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-6rem)] flex flex-col justify-between space-y-4 font-sans animate-fade-in">
      
      {/* Header */}
      <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Interactive YC Mentor</h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span>Context Aware & Real-Time</span>
            </span>
          </div>
        </div>
        <button
          onClick={() => setMessages(prev => [prev[0]])}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Reset Conversations"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Output Pane */}
      <div className="flex-grow bg-slate-950/60 border border-white/5 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 min-h-0 relative select-text">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
                msg.sender === "user"
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-900 border-white/5 text-sky-400"
              }`}>
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed px-4 py-3 whitespace-pre-wrap font-sans ${
                msg.sender === "user"
                  ? "bg-indigo-500/10 border border-indigo-500/20 text-white"
                  : "bg-slate-900/40 border border-white/5 text-slate-300"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex items-center space-x-2 bg-slate-900/20 border border-white/5 p-3 rounded-xl max-w-xs text-xs text-slate-400">
              <span className="animate-spin w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full" />
              <span>Mentor is analyzing strategy...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompters Column */}
      <div className="shrink-0 space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 pl-1 block">Quick Tactics Channels:</span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              disabled={sending}
              onClick={() => handleSendMessage(qp.prompt)}
              className="text-[11px] bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.04] hover:border-white/10 px-3 py-2 rounded-xl transition-all text-left truncate max-w-full cursor-pointer disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <div className="flex space-x-2 shrink-0">
        <input
          type="text"
          placeholder="Ask about marketing hooks, technical architectures, database normalizations..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={sending}
          className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || sending}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
