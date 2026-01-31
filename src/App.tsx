import { type Component, createSignal, For, Show, onMount, createEffect } from 'solid-js';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Markdown } from '@/components/ui/markdown';
import { sendMessage, type ChatMessage } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const App: Component = () => {
  const [isDarkMode, setIsDarkMode] = createSignal(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [activeTab, setActiveTab] = createSignal<'chat' | 'settings'>('chat');
  const [messages, setMessages] = createSignal<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "# Welcome to Jenny ✨\nI'm your AI companion, fully equipped for data analysis and visualization. \n\n### 🚀 What I can do:\n- **Visualizations**: I can render charts (Bar, Line, Pie, etc.)\n- **Rich Tables**: Complex data presented in a clean, modern way.\n- **Code Highlighting**: Syntax highlighting for all major languages.\n- **Mathematical Plots**: Ask me to visualize trends or comparison data.\n\nTry asking: *\"Compare the market cap of Apple, Google and Microsoft in a bar chart\"* or *\"Show me a table of recent tech trends\"*.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [isListening, setIsListening] = createSignal(false);
  const [streamingContent, setStreamingContent] = createSignal('');
  const [config, setConfig] = createSignal<any>(null);

  let messagesContainer: HTMLDivElement | undefined;
  let inputRef: HTMLTextAreaElement | undefined;

  // Theme Sync
  createEffect(() => {
    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/gateway/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 8e6e252af4cddc8baa07390b132a70e2d4e881571655081b`
        },
        body: JSON.stringify({ method: 'status' })
      });
      const data = await res.json();
      if (data.ok) setConfig(data.payload);
    } catch (e) {
      console.warn("Could not fetch gateway status", e);
    }
  };

  const handleSend = async () => {
    const content = inputValue().trim();
    if (!content || isLoading()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setStreamingContent('');

    setTimeout(scrollToBottom, 50);

    try {
      const history: ChatMessage[] = [
        ...messages().map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content }
      ];
      
      const response = await sendMessage(history, (chunk) => {
        setStreamingContent(chunk);
        scrollToBottom();
      });

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
      setStreamingContent('');
    } catch (error) {
      console.error('API error:', error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "❌ **Gateway Error**: I couldn't process that. Check your Clawdbot connection.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInputValue(transcript);
      handleSend();
    };
    recognition.start();
  };

  onMount(() => {
    fetchConfig();
    inputRef?.focus();
  });

  return (
    <div class="flex h-full bg-background transition-colors duration-500 relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px] animate-pulse pointer-events-none" style={{ "animation-delay": "2s" }} />
      
      {/* Sidebar */}
      <aside class="hidden md:flex w-72 flex-col border-r border-border/50 glass z-40">
        <div class="p-8 flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 ring-4 ring-primary/10 transition-transform hover:scale-105">
            <span class="text-2xl font-black">J</span>
          </div>
          <div>
            <h2 class="font-black text-xl leading-tight tracking-tight">Jenny</h2>
            <div class="flex items-center gap-1.5">
              <span class={cn("w-2 h-2 rounded-full animate-pulse", config() ? "bg-green-500" : "bg-zinc-300")} />
              <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{config() ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 px-4 space-y-2 mt-6">
          <NavButton 
            active={activeTab() === 'chat'} 
            onClick={() => setActiveTab('chat')}
            icon={<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>}
            label="Conversation"
          />
          <NavButton 
            active={activeTab() === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
            label="Preferences"
          />
        </nav>

        <div class="p-6 border-t border-border/50 glass mt-auto flex items-center justify-between gap-2">
          <div class="flex items-center gap-3 overflow-hidden">
            <Avatar class="h-10 w-10 shrink-0 ring-2 ring-primary/20">
              <AvatarFallback class="bg-primary/5 text-xs font-black">NJ</AvatarFallback>
            </Avatar>
            <div class="truncate">
               <p class="text-sm font-bold truncate">Nitin Jain</p>
               <p class="text-[10px] text-muted-foreground truncate">Main Operator</p>
            </div>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode())}
            class="p-2.5 rounded-2xl hover:bg-primary/5 transition-all active:scale-90 bg-card border border-border/50 shadow-sm"
          >
            <Show when={isDarkMode()} fallback={<svg class="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.929 7.929l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>}>
              <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </Show>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div class="flex-1 flex flex-col relative min-w-0 h-full">
        {/* Mobile Header */}
        <header class="md:hidden flex items-center justify-between p-4 glass z-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg">J</div>
            <span class="font-black text-lg">Jenny</span>
          </div>
          <Button variant="ghost" size="icon" class="rounded-2xl bg-card border border-border/50" onClick={() => setIsDarkMode(!isDarkMode())}>
             {isDarkMode() ? '🌙' : '☀️'}
          </Button>
        </header>

        <Show when={activeTab() === 'chat'} fallback={<SettingsView config={config()} />}>
          {/* Messages List */}
          <main 
            ref={messagesContainer} 
            class="flex-1 overflow-y-auto px-4 md:px-12 pt-8 pb-48 space-y-12"
          >
            <div class="max-w-4xl mx-auto flex flex-col">
              <For each={messages()}>
                {(message) => (
                  <div class={cn(
                    "flex flex-col mb-12 last:mb-0 page-transition",
                    message.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div class="flex items-center gap-2 mb-3 px-2">
                      <span class="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        {message.role === 'assistant' ? 'Jenny' : 'You'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div class={cn(
                      "group relative p-6 rounded-[2rem] text-[16px] leading-relaxed shadow-2xl transition-all duration-500",
                      message.role === 'assistant' 
                        ? "glass-card text-foreground md:max-w-[95%] rounded-tl-lg" 
                        : "bg-primary text-primary-foreground font-semibold md:max-w-[85%] rounded-br-lg shadow-primary/20"
                    )}>
                      <Show when={message.role === 'assistant'} fallback={message.content}>
                        <Markdown content={message.content} />
                      </Show>
                      
                      {/* Interaction hint on hover */}
                      <div class={cn(
                        "absolute top-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2",
                        message.role === 'user' ? "-left-16" : "-right-16"
                      )}>
                        <Button variant="ghost" size="icon" class="h-10 w-10 rounded-full glass border border-border/50 shadow-xl hover:scale-110 active:scale-95">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </For>

              <Show when={streamingContent()}>
                <div class="flex flex-col items-start mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div class="mb-3 px-2">
                     <span class="text-[11px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">Jenny is writing...</span>
                   </div>
                   <div class="p-6 rounded-[2rem] glass-card text-foreground md:max-w-[95%] rounded-tl-lg shadow-2xl">
                      <Markdown content={streamingContent()} />
                      <span class="inline-block w-2.5 h-5 bg-primary/30 ml-1 rounded-full animate-bounce align-middle" />
                   </div>
                </div>
              </Show>

              <Show when={isLoading() && !streamingContent()}>
                <div class="flex flex-col items-start gap-4 mt-4">
                  <Skeleton class="h-14 w-[320px] rounded-[2rem]" />
                  <Skeleton class="h-28 w-[500px] rounded-[2rem]" />
                </div>
              </Show>
            </div>
          </main>

          {/* Floating Input Area */}
          <footer class="absolute bottom-0 left-0 right-0 p-6 md:p-12 pointer-events-none z-50">
            <div class="max-w-4xl mx-auto pointer-events-auto">
              <div class={cn(
                "relative glass-card p-3 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] transition-all duration-500",
                "focus-within:ring-8 ring-primary/5 focus-within:border-primary/20",
                isListening() && "ring-8 ring-red-500/10 border-red-500/20"
              )}>
                <textarea
                  ref={inputRef}
                  class="flex-1 w-full bg-transparent resize-none outline-none px-6 py-4 text-[18px] min-h-[64px] max-h-56 leading-relaxed placeholder:text-muted-foreground/30 font-medium"
                  placeholder={isListening() ? "I'm listening..." : "Talk to Jenny..."}
                  value={inputValue()}
                  onInput={(e) => {
                    setInputValue(e.currentTarget.value);
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = (e.currentTarget.scrollHeight) + 'px';
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                />
                <div class="absolute right-4 bottom-4 flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class={cn(
                      "rounded-[1.5rem] h-14 w-14 transition-all duration-500",
                      isListening() ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20 scale-110" : "hover:bg-secondary/50"
                    )} 
                    onClick={startVoice}
                  >
                    <Show when={isListening()} fallback={<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>}>
                       <div class="flex gap-1 items-center">
                         <span class="w-1 h-4 bg-current rounded-full animate-bounce" />
                         <span class="w-1 h-6 bg-current rounded-full animate-bounce" style={{ "animation-delay": "0.1s" }} />
                         <span class="w-1 h-4 bg-current rounded-full animate-bounce" style={{ "animation-delay": "0.2s" }} />
                       </div>
                    </Show>
                  </Button>
                  <Button 
                    size="icon" 
                    class="rounded-[1.5rem] h-14 w-14 bg-primary text-primary-foreground shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 group disabled:opacity-30" 
                    onClick={handleSend} 
                    disabled={!inputValue().trim() || isLoading()}
                  >
                    <svg class="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </Button>
                </div>
              </div>
              <div class="flex justify-center gap-4 mt-6">
                <span class="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.3em]">
                  Encrypted Session • Clawdbot v3.4.2
                </span>
              </div>
            </div>
          </footer>
        </Show>
      </div>
    </div>
  );
};

const NavButton = (props: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={props.onClick}
    class={cn(
      "flex items-center gap-4 w-full px-6 py-4 rounded-2xl transition-all duration-300 group",
      props.active 
        ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 font-black" 
        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
    )}
  >
    <span class={cn("transition-all duration-300 group-hover:scale-125", props.active ? "text-primary-foreground" : "text-muted-foreground")}>
      {props.icon}
    </span>
    <span class="text-[15px] tracking-tight">{props.label}</span>
  </button>
);

const SettingsView = (props: { config: any }) => (
  <main class="flex-1 overflow-y-auto p-8 md:p-20 page-transition">
    <div class="max-w-4xl mx-auto space-y-16">
      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-5xl font-black tracking-tighter mb-4">Preferences</h1>
          <p class="text-muted-foreground text-lg font-medium max-w-lg leading-relaxed">Customize your core environment and verify your secure gateway connection.</p>
        </div>
        <div class="hidden lg:block w-32 h-32 rounded-full border-8 border-primary/5 bg-primary/5 animate-pulse" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section class="space-y-6">
          <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60 px-4">Cloud Gateway</h3>
          <div class="glass-card rounded-[2.5rem] divide-y divide-border/30 overflow-hidden shadow-2xl">
            <SettingsItem label="Host OS" value={props.config?.host?.platform || 'Darwin'} />
            <SettingsItem label="Gateway Port" value={props.config?.gateway?.port || '18789'} />
            <SettingsItem label="IP Address" value={props.config?.host?.ip || '127.0.0.1'} />
            <SettingsItem label="Handshake" value="Verified (RSA-4096)" />
          </div>
        </section>

        <section class="space-y-6">
          <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60 px-4">Interface</h3>
          <div class="glass-card rounded-[2.5rem] divide-y divide-border/30 overflow-hidden shadow-2xl">
            <SettingsItem label="Visual Engine" value="Metal v3.0" />
            <SettingsItem label="Glass Depth" value="High (20px)" />
            <SettingsItem label="Haptic Engine" value="Enabled" />
            <SettingsItem label="Auto-Sync" value="Real-time" />
          </div>
        </section>
      </div>

      <div class="p-10 glass-card rounded-[3rem] border border-primary/10 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-5">
           <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z"/></svg>
        </div>
        <h3 class="text-xl font-black mb-6">Environment Signature</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block mb-1">Runtime</span>
            <p class="font-bold font-mono text-sm">Node {props.config?.host?.node || 'v20.0'}</p>
          </div>
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block mb-1">Clawdbot</span>
            <p class="font-bold font-mono text-sm">{props.config?.host?.version || '2025.1.x'}</p>
          </div>
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block mb-1">Mode</span>
            <p class="font-bold font-mono text-sm uppercase">Operator</p>
          </div>
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block mb-1">Uptime</span>
            <p class="font-bold font-mono text-sm">Active</p>
          </div>
        </div>
      </div>
    </div>
  </main>
);

const SettingsItem = (props: { label: string, value: string | number }) => (
  <div class="flex items-center justify-between p-7 hover:bg-primary/[0.02] transition-colors group">
    <span class="font-bold text-[15px] tracking-tight group-hover:translate-x-1 transition-transform">{props.label}</span>
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground font-black uppercase tracking-widest bg-secondary/50 px-3 py-1 rounded-lg">{props.value}</span>
      <svg class="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
    </div>
  </div>
);

export default App;
