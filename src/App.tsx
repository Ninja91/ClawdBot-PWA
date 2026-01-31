import { type Component, createSignal, Show, createEffect } from 'solid-js';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatView } from '@/components/chat/ChatView';
import { SettingsView } from '@/components/layout/SettingsView';
import { state } from '@/store/app-state';

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal<'chat' | 'settings'>('chat');
  const [isDarkMode, setIsDarkMode] = createSignal(window.matchMedia('(prefers-color-scheme: dark)').matches);

  createEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode());
  });

  return (
    <div class="flex h-full bg-background transition-colors duration-500 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px] animate-pulse pointer-events-none" style={{ "animation-delay": "2s" }} />

      <Sidebar 
        activeTab={activeTab()} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode()} 
        setIsDarkMode={setIsDarkMode} 
        config={state.config}
      />

      <div class="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
        <Show when={activeTab() === 'chat'} fallback={<SettingsView config={state.config} />}>
          <ChatView />
        </Show>
      </div>
    </div>
  );
};

export default App;
