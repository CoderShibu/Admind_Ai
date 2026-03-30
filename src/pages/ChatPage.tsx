import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Trash2, Zap } from "lucide-react";
import { SkeletonRow } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { suggestedQuestions } from "@/data/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { handleChat, chatHistory, clearChat, isLoading: isTyping } = useApp();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isTyping) return;
    
    setInput("");
    try {
      await handleChat(textToSend);
    } catch (err) {
      console.error(err);
    }
  };

  const renderMarkdown = (text: string) => {
    // Basic bold and lists
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const lines = html.split('\n');
    let inList = false;
    let parsedLines = [];
    
    for (const line of lines) {
      if (line.match(/^\s*[-•]\s+(.*)/)) {
        if (!inList) {
          parsedLines.push('<ul class="list-disc pl-5 mt-2 mb-2 space-y-1">');
          inList = true;
        }
        parsedLines.push(line.replace(/^\s*[-•]\s+(.*)/, '<li>$1</li>'));
      } else {
        if (inList) {
          parsedLines.push('</ul>');
          inList = false;
        }
        parsedLines.push(line);
      }
    }
    if (inList) parsedLines.push('</ul>');
    
    html = parsedLines.join('<br/>').replace(/<ul><br\/>/g, '<ul>').replace(/<\/ul><br\/>/g, '</ul>').replace(/<\/li><br\/>/g, '</li>');
    return { __html: html };
  };

  const suggestions = [
    "Which campaigns should I scale this week?",
    "What is my best performing audience?",
    "Where should I reduce budget?",
    "Generate a performance summary",
    "Which creatives are underperforming?",
    "What is my average CAC this month?",
  ];

  return (
    <DashboardLayout>
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
        margin: '-24px', // Offset DashboardLayout paddings to make it full screen
      }}>

        {/* LEFT PANEL — Suggested Questions */}
        <div style={{
          width: '280px',
          minWidth: '280px',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 16px',
          overflowY: 'auto',
        }} className="hidden md:flex">
          <p style={{
            color: '#9CA3AF',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Suggested Questions
          </p>
          {suggestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isTyping}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#D1D5DB',
                fontSize: '13px',
                cursor: isTyping ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                width: '100%',
                marginBottom: '8px',
                transition: 'all 0.15s',
                opacity: isTyping ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isTyping) {
                  e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)';
                  e.currentTarget.style.color = '#00D4FF';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#D1D5DB';
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* RIGHT PANEL — Chat Interface */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}>

          {/* CHAT HEADER — fixed at top */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold">Admind AI Assistant</span>
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1.5" onClick={() => { if (window.confirm("Are you sure you want to clear the chat history?")) clearChat(); }}>
              <Trash2 className="h-3.5 w-3.5" /> Clear Chat
            </Button>
          </div>

          {/* MESSAGES AREA — scrollable middle */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {chatHistory.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full gap-4 opacity-70">
                 <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                 </div>
                 <p className="font-heading font-semibold text-lg">How can I help you today?</p>
                 <p className="text-muted-foreground text-sm max-w-sm text-center">Ask me anything about your campaigns, generating copy, or finding new audiences.</p>
               </div>
            )}
            
            {chatHistory.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 mr-2 mt-1">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                {msg.role === "user" ? (
                  <div className="max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-primary text-primary-foreground whitespace-pre-wrap">
                    {msg.content}
                  </div>
                ) : (
                  <div 
                    className="max-w-[70%] rounded-xl px-4 py-3 text-sm leading-relaxed glass-card"
                    dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                  />
                )}
              </motion.div>
            ))}

            {isTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0,212,255,0.15)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  borderBottomLeftRadius: '4px',
                  padding: '12px 16px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#00D4FF',
                      animation: 'typing-dot 1.4s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR — always fixed at bottom */}
          <div style={{
            flexShrink: 0,
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(10, 15, 30, 0.95)',
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
            }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask anything about your campaigns..."
                disabled={isTyping}
                rows={1}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '14px',
                  resize: 'none',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  lineHeight: '1.5',
                  fontFamily: 'inherit',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexShrink: 0,
              }}>
                {/* Attach/Upload icon button */}
                <button
                  onClick={() => navigate('/upload')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#6B7280',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Upload data"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>

                {/* Send button */}
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  style={{
                    background: input.trim() && !isTyping ? '#00D4FF' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {isTyping ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}/>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#0A0F1E' : '#6B7280'} strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <p style={{
              color: '#4B5563',
              fontSize: '11px',
              textAlign: 'center',
              marginTop: '8px',
            }}>
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
