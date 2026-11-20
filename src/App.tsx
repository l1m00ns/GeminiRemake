import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Download,
  Image as ImageIcon,
  Menu,
  Mic,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  Share,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
} from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const MODELS = ["Gemini 3 Pro", "Gemini 3 Flash", "Gemini 2.5 Pro"];

function Spark() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="gm-spark" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.45" stopColor="#9B72CB" />
          <stop offset="0.75" stopColor="#D96570" />
          <stop offset="1" stopColor="#F2A93B" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5c.5 4.7 3.3 7.5 8 8-4.7.5-7.5 3.3-8 8-.5-4.7-3.3-7.5-8-8 4.7-.5 7.5-3.3 8-8Z"
        fill="url(#gm-spark)"
      />
    </svg>
  );
}

function Answer({ text }: { text: string }) {
  return (
    <div className="gm-answer">
      {text.split("\n").map((line, i) =>
        line.startsWith("## ") ? (
          <h3 key={i}>{line.slice(3)}</h3>
        ) : line.startsWith("- ") ? (
          <li key={i}>{line.slice(2)}</li>
        ) : line ? (
          <p key={i}>{line}</p>
        ) : null,
      )}
    </div>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [settings, setSettings] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [chats, setChats] = useState<string[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const ta = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  function send(text?: string) {
    const t = (text ?? value).trim();
    if (!t || pending) return;
    setValue("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: t }]);
    setChats((c) => (c.includes(t) ? c : [t, ...c].slice(0, 6)));
    setPending(true);
    window.setTimeout(() => {
      const reply =
        "Great starting point. Here's a clear way to think about it.\n\n## Start with the outcome\nDecide what \"done\" looks like in one sentence, then work backwards. That keeps the scope honest and makes progress visible.\n\n- Define the single metric that matters\n- List what you already have\n- Identify the riskiest assumption\n- Run the smallest test that proves or disproves it\n\nIf you share a little more context, I can turn this into a step-by-step plan with a timeline.";
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
      setPending(false);
    }, 1700);
  }

  function newChat() {
    setMessages([]);
    setValue("");
    setMobile(false);
    ta.current?.focus();
  }

  const hasChat = messages.length > 0;

  return (
    <div className={`gm ${collapsed ? "collapsed" : ""}`}>
      {mobile && <div className="gm-scrim" onClick={() => setMobile(false)} />}
      <aside className={`gm-side ${mobile ? "open" : ""}`}>
        <div className="gm-side-top">
          <button className="gm-icon" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse menu">
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <button className="gm-icon gm-side-x" onClick={() => setMobile(false)} aria-label="Close"><X size={18} /></button>
        </div>

        <nav className="gm-nav">
          <button className="gm-nav-new" onClick={newChat} disabled={!hasChat && messages.length === 0}>
            <Plus size={17} /> <span>New chat</span>
          </button>
          <button onClick={() => setToast("Images — demo only")}>
            <ImageIcon size={17} /> <span>Images</span>
          </button>
          {!signedIn && (
            <button onClick={() => setSignIn(true)}>
              <User size={17} /> <span>Sign in to save activity</span>
            </button>
          )}
        </nav>

        <div className="gm-recents">
          {chats.length > 0 && <p>Recent</p>}
          {chats.map((c, i) => (
            <button key={c + i} onClick={() => setToast("Opening recent chat — demo only")}>
              <span>{c}</span>
            </button>
          ))}
        </div>

        <div className="gm-side-foot">
          <button className="gm-foot-link" onClick={() => setSettings(true)}>
            <Settings size={16} /> <span>Settings</span>
          </button>
          {!signedIn ? (
            <>
              <button className="gm-signin" onClick={() => setSignIn(true)}>Sign in</button>
              <button className="gm-getapp" onClick={() => setToast("Download the Gemini app — demo only")}>
                <Download size={15} /> Get App
              </button>
            </>
          ) : (
            <div className="gm-account">
              <span className="gm-avatar">A</span>
              <div><b>Alex Rivera</b><span>alex@gmail.com</span></div>
            </div>
          )}
        </div>
      </aside>

      <main className="gm-main">
        <header className="gm-top">
          <button className="gm-icon gm-burger" onClick={() => setMobile(true)} aria-label="Menu"><Menu size={18} /></button>
          {hasChat && (
            <div className="gm-model-wrap">
              <button className="gm-model" onClick={() => setModelOpen(!modelOpen)}>
                <Spark /> {model} <ChevronDown size={12} />
              </button>
              {modelOpen && (
                <div className="gm-model-menu">
                  {MODELS.map((m) => (
                    <button key={m} onClick={() => { setModel(m); setModelOpen(false); }}>
                      {m} {m === model && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="gm-top-right">
            <a href="#about" onClick={(e) => { e.preventDefault(); setToast("About Gemini — demo only"); }}>About Gemini</a>
            <a href="#subs" onClick={(e) => { e.preventDefault(); setToast("Subscriptions — demo only"); }}>Subscriptions</a>
            <a href="#business" onClick={(e) => { e.preventDefault(); setToast("For Business — demo only"); }}>For Business</a>
            <button className="gm-top-get" onClick={() => setToast("Download the Gemini app — demo only")}>
              <Download size={14} /> Get App
            </button>
            {signedIn ? (
              <span className="gm-avatar sm">A</span>
            ) : (
              <button className="gm-top-signin" onClick={() => setSignIn(true)}>Sign in</button>
            )}
          </div>
        </header>

        {!hasChat ? (
          <div className="gm-welcome">
            <div className="gm-welcome-inner">
              <h1>Hi, I&apos;m Gemini. Where should we start?</h1>
              <form
                className="gm-composer"
                onSubmit={(e) => { e.preventDefault(); send(); }}
              >
                <div className="gm-composer-main">
                  <button type="button" className="gm-icon" onClick={() => setToast("Add files, images or Drive content — demo only")} aria-label="Add"><Plus size={19} /></button>
                  <textarea
                    ref={ta}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    rows={1}
                    placeholder="Try ⌘D to dictate"
                    aria-label="Ask Gemini"
                  />
                  <button type="button" className="gm-icon" onClick={() => setToast("Voice input — demo only")} aria-label="Microphone"><Mic size={18} /></button>
                  {value.trim() && (
                    <button type="submit" className="gm-send" aria-label="Send"><ArrowUp size={16} /></button>
                  )}
                </div>
                {value.trim() && (
                  <div className="gm-composer-tools">
                    {["Deep Research", "Canvas", "Guided Learning", "Personal Intelligence"].map((t) => (
                      <button key={t} type="button" onClick={() => setToast(`${t} — demo only`)}>{t}</button>
                    ))}
                  </div>
                )}
              </form>
              <div className="gm-chips">
                {["Create an image of a cozy cabin", "Help me plan a weekend in Lisbon", "Explain quantum computing simply", "Draft a launch email"].map((c) => (
                  <button key={c} onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            </div>
            <p className="gm-disclaimer">Gemini can make mistakes, so double-check it.</p>
          </div>
        ) : (
          <div className="gm-chat">
            <div className="gm-chat-scroll" ref={scroller}>
              <div className="gm-thread">
                {messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="gm-user">{m.text}</div>
                  ) : (
                    <div key={m.id} className="gm-assistant">
                      <span className="gm-ai"><Spark /></span>
                      <div>
                        <Answer text={m.text} />
                        <div className="gm-actions">
                          <button aria-label="Good"><ThumbsUp size={13} /></button>
                          <button aria-label="Bad"><ThumbsDown size={13} /></button>
                          <button><Share size={13} /> Share</button>
                        </div>
                        <div className="gm-followups">
                          {["Give me a step-by-step plan", "What should I do first?", "Show me an example"].map((f) => (
                            <button key={f} onClick={() => send(f)}>{f}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                )}
                {pending && (
                  <div className="gm-assistant">
                    <span className="gm-ai"><Spark /></span>
                    <div className="gm-thinking"><i /><i /><i /></div>
                  </div>
                )}
              </div>
            </div>
            <div className="gm-bottom">
              <form className="gm-composer chat" onSubmit={(e) => { e.preventDefault(); send(); }}>
                <div className="gm-composer-main">
                  <button type="button" className="gm-icon" aria-label="Add"><Plus size={19} /></button>
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    rows={1}
                    placeholder="Ask Gemini"
                  />
                  <button type="button" className="gm-icon" aria-label="Microphone"><Mic size={18} /></button>
                  <button type="submit" className="gm-send" disabled={!value.trim()} aria-label="Send"><ArrowUp size={16} /></button>
                </div>
              </form>
              <p className="gm-disclaimer">Gemini can make mistakes, so double-check it.</p>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {signIn && (
          <motion.div className="gm-modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSignIn(false)}>
            <motion.div className="gm-modal" initial={{ y: 14, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10 }} onClick={(e) => e.stopPropagation()}>
              <button className="gm-modal-x" onClick={() => setSignIn(false)} aria-label="Close"><X size={16} /></button>
              <Spark />
              <h3>Sign in to Gemini</h3>
              <p>Save your chats, generate images and connect your Google apps.</p>
              <button className="gm-google-btn" onClick={() => { setSignedIn(true); setSignIn(false); setToast("Signed in as Alex Rivera"); }}>
                <span className="gm-g">G</span> Continue with Google
              </button>
              <button className="gm-alt-btn" onClick={() => { setSignedIn(true); setSignIn(false); }}>
                <User size={15} /> Use another account
              </button>
              <small>By continuing, Google will share your name and email with Gemini.</small>
            </motion.div>
          </motion.div>
        )}
        {settings && (
          <motion.div className="gm-modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettings(false)}>
            <motion.div className="gm-modal left" initial={{ y: 14, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10 }} onClick={(e) => e.stopPropagation()}>
              <button className="gm-modal-x" onClick={() => setSettings(false)} aria-label="Close"><X size={16} /></button>
              <h3>Settings</h3>
              <div className="gm-setting"><div><b>Personal Intelligence</b><span>Let Gemini use context from your Google apps.</span></div><span className="gm-toggle on"><i /></span></div>
              <div className="gm-setting"><div><b>Save chat history</b><span>Keep chats for up to 18 months.</span></div><span className="gm-toggle on"><i /></span></div>
              <div className="gm-setting"><div><b>Show suggested prompts</b><span>Display ideas on the home screen.</span></div><span className="gm-toggle"><i /></span></div>
              <button className="gm-google-btn" onClick={() => setSettings(false)}>Done</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div className="gm-toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <Sparkles size={14} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
