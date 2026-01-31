import { type Component, For, Show, onMount } from 'solid-js';
import { Markdown } from './markdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { state, addMessage, setLoading, setStreaming } from '@/store/app-state';
import { sendMessage } from '@/lib/api';
import { useSpeech } from '@/hooks/use-speech';

export const ChatView: Component = () => {
  let messagesContainer: HTMLDivElement | undefined;
  let inputRef: HTMLTextAreaElement | undefined;
  
  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    });

    setLoading(true);
    setStreaming('');
    setTimeout(scrollToBottom, 50);

    try {
      const history = state.messages.map(m => ({ role: m.role, content: m.content }));
      const response = await sendMessage(history, (chunk) => {
        setStreaming(chunk);
        scrollToBottom();
      });

      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });
      setStreaming('');
      setLoading(false);
    } catch (e) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "❌ **Error**: Failed to generate response.",
        timestamp: new Date(),
      });
      setLoading(false);
    }
  };

  const { isListening, startListening } = useSpeech((transcript) => {
    handleSend(transcript);
  });

  onMount(() => {
    inputRef?.focus();
  });

  return (
    <div class="flex-1 flex flex-col relative h-full">
      <main ref={messagesContainer} class="flex-1 overflow-y-auto px-4 md:px-12 pt-8 pb-48 space-y-12">
        <div class="max-w-4xl mx-auto flex flex-col">
          <For each={state.messages}>
            {(message) => (
              <div class={cn("flex flex-col mb-12 last:mb-0 page-transition", message.role === 'user' ? "items-end" : "items-start")}>
                <div class="flex items-center gap-2 mb-3 px-2">
                  <span class="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 text-foreground">
                    {message.role === 'assistant' ? 'Jenny' : 'Operator'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div class={cn(
                  "group relative p-6 rounded-[2rem] text-[16.5px] leading-relaxed shadow-2xl transition-all duration-500",
                  message.role === 'assistant' 
                    ? "glass-card text-foreground md:max-w-[95%] rounded-tl-lg" 
                    : "bg-primary text-primary-foreground font-semibold md:max-w-[85%] rounded-br-lg shadow-primary/20"
                )}>
                  <Markdown content={message.content} />
                </div>
              </div>
            )}
          </For>

          <Show when={state.streamingContent}>
            <div class="flex flex-col items-start mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-foreground">
               <div class="mb-3 px-2"><span class="text-[11px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">Processing...</span></div>
               <div class="p-6 rounded-[2rem] glass-card md:max-w-[95%] rounded-tl-lg shadow-2xl">
                  <Markdown content={state.streamingContent} />
                  <span class="inline-block w-2.5 h-5 bg-primary/30 ml-1 rounded-full animate-bounce align-middle" />
               </div>
            </div>
          </Show>

          <Show when={state.isLoading && !state.streamingContent}>
            <div class="flex flex-col items-start gap-4 mt-4">
              <Skeleton class="h-14 w-[320px] rounded-[2rem]" />
              <Skeleton class="h-28 w-[500px] rounded-[2rem]" />
            </div>
          </Show>
        </div>
      </main>

      <footer class="absolute bottom-0 left-0 right-0 p-6 md:p-12 pointer-events-none z-50">
        <div class="max-w-4xl mx-auto pointer-events-auto">
          <div class={cn(
            "relative glass-card p-3 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] transition-all duration-500",
            "focus-within:ring-8 ring-primary/5 focus-within:border-primary/20",
            isListening() && "ring-8 ring-red-500/10 border-red-500/20"
          )}>
            <textarea
              ref={inputRef}
              class="flex-1 w-full bg-transparent resize-none outline-none px-6 py-4 text-[18px] min-h-[64px] max-h-56 leading-relaxed placeholder:text-muted-foreground/30 font-medium text-foreground"
              placeholder={isListening() ? "Listening..." : "Talk to Jenny..."}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <div class="absolute right-4 bottom-4 flex items-center gap-3">
              <Button variant="ghost" size="icon" class={cn("rounded-[1.5rem] h-14 w-14 transition-all duration-500", isListening() ? "bg-red-500 text-white animate-pulse" : "hover:bg-secondary/50")} onClick={startListening}>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
              </Button>
              <Button size="icon" class="rounded-[1.5rem] h-14 w-14 bg-primary text-primary-foreground shadow-2xl shadow-primary/40 transition-all active:scale-95 group" onClick={() => { if (inputRef) { handleSend(inputRef.value); inputRef.value = ''; } }}>
                <svg class="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
