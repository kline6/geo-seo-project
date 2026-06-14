import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Send, User, Plus, Trash2, MessageSquare, Workflow, HelpCircle, PanelLeftClose, PanelLeft } from "lucide-react";

const capabilities = [
  { id: "geo-brand", name: "GEO品牌诊断", desc: "分析品牌在AI中的可见度", icon: "📊", prompt: "分析品牌在AI中的可见度" },
  { id: "seo-audit", name: "SEO技术检测", desc: "检测网站SEO技术指标", icon: "🔍", prompt: "检测 example.com 的SEO技术指标" },
  { id: "trust-score", name: "AI信任度评分", desc: "评估内容被AI引用的概率", icon: "🛡️", prompt: "评估内容被AI引用的概率" },
  { id: "keyword-expand", name: "关键词扩展", desc: "智能扩展相关长尾关键词", icon: "🔑", prompt: "帮我扩展AI营销相关的长尾关键词" },
  { id: "article-gen", name: "文章生成", desc: "生成SEO优化的文章内容", icon: "📄", prompt: "生成一篇关于GEO优化的SEO文章" },
  { id: "brand-compare", name: "品牌对比", desc: "多品牌AI可见度对比分析", icon: "⚖️", prompt: "比较华为和小米在AI搜索引擎中的品牌可见度" },
];

const quickPrompts = [
  "分析华为的AI可见度",
  "检测 example.com 的SEO",
  "扩展关键词：AI营销",
  "评估内容信任度",
  "比较华为和小米",
];

function AiAssistant() {
  const [mode, setMode] = useState("chat");
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ====== Load conversations ======
  const loadConversations = useCallback(async () => {
    try {
      const resp = await fetch("/api/chat/conversations");
      const data = await resp.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // ====== Load messages when switching to an existing conversation ======
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      setIsLoadingMessages(false);
      return;
    }
    let cancelled = false;
    setIsLoadingMessages(true);
    fetch(`/api/chat/conversations/${activeConvId}/messages`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        setMessages(Array.isArray(data) ? data.map(m => ({ id: m.id, role: m.role, content: m.content })) : []);
      })
      .catch(() => { if (!cancelled) setMessages([]); })
      .finally(() => { if (!cancelled) setIsLoadingMessages(false); });
    return () => { cancelled = true; };
  }, [activeConvId]);

  // ====== New Conversation: just clear state, NO DB call ======
  const handleNewConversation = useCallback(() => {
    setActiveConvId(null);
    setMessages([]);
    setIsLoading(false);
    setIsLoadingMessages(false);
  }, []);

  // ====== Switch to existing conversation ======
  const handleSwitchConversation = useCallback((convId) => {
    if (convId === activeConvId) return;
    setIsLoading(false);
    setActiveConvId(convId);
  }, [activeConvId]);

  // ====== Delete conversation ======
  const handleDeleteConversation = useCallback(async (convId, e) => {
    if (e) e.stopPropagation();
    try {
      await fetch(`/api/chat/conversations/${convId}`, { method: "DELETE" });
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConvId === convId) {
        setActiveConvId(null);
        setMessages([]);
      }
    } catch (err) { console.error(err); }
  }, [activeConvId]);

  // ====== Send Message ======
  const sendMessage = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    let convId = activeConvId;

    // No conversation yet? Create one in DB now
    if (!convId) {
      try {
        const resp = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: msg.slice(0, 30) }),
        });
        const conv = await resp.json();
        convId = conv.id;
        setActiveConvId(convId);
        setConversations(prev => [conv, ...prev]);
      } catch (e) { console.error(e); return; }
    }

    // Show user message immediately
    const userMsg = { id: `temp-${Date.now()}`, role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setTimeout(() => inputRef.current?.focus(), 50);

    // AI in background
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, conversationId: convId }),
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        setMessages(prev => [...prev, { id: `ai-${Date.now()}`, role: "assistant", content: data.reply || "未获取到回复" }]);
        loadConversations();
      })
      .catch(err => {
        setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: "assistant", content: `请求失败: ${err.message}` }]);
      })
      .finally(() => setIsLoading(false));
  }, [input, isLoading, activeConvId, loadConversations]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }, [sendMessage]);

  // ====== Show welcome? Only when no conversation is active ======
  const showWelcome = activeConvId === null;

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--header-height) - 48px)" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, background: "rgba(245,166,35,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={24} color="var(--accent-yellow)" />
          </div>
          <div>
            <h2>AI 智能助手</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>对话具有记忆功能，AI 会记住之前的聊天内容</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setShowSidebar(!showSidebar)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "transparent", border: "1px solid var(--border-color)", borderRadius: 6, color: "var(--text-secondary)", cursor: "pointer", fontSize: 13 }}>
            {showSidebar ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "transparent", border: "1px solid var(--border-color)", borderRadius: 6, color: "var(--text-secondary)", cursor: "pointer", fontSize: 13 }}>
            <HelpCircle size={14} /> 使用指南
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode("chat")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: mode === "chat" ? "var(--accent-yellow)" : "var(--bg-card)", color: mode === "chat" ? "#000" : "var(--text-secondary)" }}>
          <MessageSquare size={16} /> 对话模式
        </button>
        <button onClick={() => navigate("/plan-mode")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: mode === "workflow" ? "var(--accent-yellow)" : "var(--bg-card)", color: mode === "workflow" ? "#000" : "var(--text-secondary)" }}>
          <Workflow size={16} /> 工作流模式
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, gap: 0, minHeight: 0, background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-color)", overflow: "hidden" }}>

        {/* ====== Sidebar ====== */}
        {showSidebar && (
          <div style={{ width: 260, borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: 12, borderBottom: "1px solid var(--border-color)" }}>
              <button onClick={handleNewConversation} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", background: "var(--accent-yellow)", border: "none", borderRadius: 8, color: "#000", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                <Plus size={16} /> 新建对话
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
              {conversations.length === 0 && (
                <p style={{ color: "var(--text-secondary)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>暂无对话</p>
              )}
              {conversations.map(conv => {
                const isActive = activeConvId === conv.id;
                return (
                  <div key={conv.id}
                    onClick={() => handleSwitchConversation(conv.id)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, cursor: "pointer", background: isActive ? "rgba(245,166,35,0.12)" : "transparent", marginBottom: 2, transition: "background 0.15s" }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                      <MessageSquare size={14} color={isActive ? "var(--accent-yellow)" : "var(--text-secondary)"} style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: isActive ? "var(--text-primary)" : "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.title}</div>
                        {conv.message_count > 0 && (
                          <div style={{ fontSize: 11, color: "var(--text-secondary)", opacity: 0.5 }}>{conv.message_count} 条消息</div>
                        )}
                      </div>
                    </div>
                    <button onClick={(e) => handleDeleteConversation(conv.id, e)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-secondary)", opacity: 0.4, flexShrink: 0, display: "flex" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.4}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== Chat Area ====== */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {showWelcome ? (
            /* ====== Welcome: capability cards + quick prompts ====== */
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
              <div style={{ width: 64, height: 64, background: "rgba(245,166,35,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Bot size={32} color="var(--accent-yellow)" />
              </div>
              <h2 style={{ marginBottom: 8, fontSize: 22 }}>GEO Platform AI 智能助手</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32, textAlign: "center", maxWidth: 480 }}>
                选择下方功能卡片快速开始，或直接输入问题
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 680, width: "100%", marginBottom: 24 }}>
                {capabilities.map(cap => (
                  <div key={cap.id} onClick={() => sendMessage(cap.prompt)}
                    style={{ padding: "16px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 10, cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{cap.icon}</div>
                    <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{cap.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{cap.desc}</div>
                  </div>
                ))}
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 12 }}>或试试这些问题：</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 700 }}>
                {quickPrompts.map((prompt, i) => (
                  <button key={i} onClick={() => sendMessage(prompt)} style={{ padding: "6px 16px", borderRadius: 20, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", cursor: "pointer", fontSize: 13, transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-yellow)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-color)"}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ====== Active conversation: messages ====== */
            <>
              <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                <MessageSquare size={14} color="var(--accent-yellow)" />
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                  {conversations.find(c => c.id === activeConvId)?.title || "对话"}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.5 }}>
                  {messages.length} 条消息
                </span>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                {isLoadingMessages && (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)", fontSize: 13 }}>加载历史消息中...</div>
                )}
                {!isLoadingMessages && messages.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
                    <Bot size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                    <p>发送消息开始对话</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", gap: 12, padding: "12px 0", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: msg.role === "user" ? "#333" : "var(--accent-yellow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {msg.role === "user" ? <User size={18} color="#fff" /> : <Bot size={18} color="#000" />}
                    </div>
                    <div style={{ maxWidth: "70%", padding: "12px 16px", borderRadius: 12, background: msg.role === "user" ? "var(--bg-secondary)" : "rgba(245,166,35,0.08)", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ display: "flex", gap: 12, padding: "12px 0" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-yellow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bot size={18} color="#000" />
                    </div>
                    <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(245,166,35,0.08)", fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span>思考中</span>
                      <span style={{ display: "inline-flex", gap: 3 }}>
                        <span style={{ animation: "blink 1.4s infinite 0s" }}>&#9679;</span>
                        <span style={{ animation: "blink 1.4s infinite 0.2s" }}>&#9679;</span>
                        <span style={{ animation: "blink 1.4s infinite 0.4s" }}>&#9679;</span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEnd} />
              </div>
            </>
          )}

          {/* Input - always visible at bottom */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-color)", display: "flex", gap: 12, alignItems: "flex-end" }}>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={activeConvId ? "继续对话..." : "选择功能卡片或输入问题开始"}
              style={{ flex: 1, minHeight: 44, maxHeight: 120, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit" }} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} style={{ width: 44, height: 44, borderRadius: "50%", background: input.trim() && !isLoading ? "var(--accent-yellow)" : "#333", border: "none", color: input.trim() && !isLoading ? "#000" : "#666", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
              <Send size={18} />
            </button>
          </div>
          <div style={{ padding: "0 16px 8px", fontSize: 11, color: "var(--text-secondary)", textAlign: "center" }}>
            Enter 发送 · Shift+Enter 换行
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 20% { opacity: 0.2; }
          50% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

export default AiAssistant;


