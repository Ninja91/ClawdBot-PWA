import { type Component, Show } from 'solid-js';
import { NavButton } from './NavButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: 'chat' | 'settings';
  setActiveTab: (tab: 'chat' | 'settings') => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  config: any;
}

export const Sidebar: Component<SidebarProps> = (props) => {
  return (
    <aside class="hidden md:flex w-72 flex-col border-r border-border/50 glass z-40">
      <div class="p-8 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 ring-4 ring-primary/10 transition-transform hover:scale-105">
          <span class="text-2xl font-black">J</span>
        </div>
        <div>
          <h2 class="font-black text-xl leading-tight tracking-tight text-foreground">Jenny</h2>
          <div class="flex items-center gap-1.5">
            <span class={cn("w-2 h-2 rounded-full animate-pulse", props.config ? "bg-green-500" : "bg-zinc-300")} />
            <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{props.config ? 'Live' : 'Offline'}</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-6">
        <NavButton 
          active={props.activeTab === 'chat'} 
          onClick={() => props.setActiveTab('chat')}
          icon={<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>}
          label="Conversation"
        />
        <NavButton 
          active={props.activeTab === 'settings'} 
          onClick={() => props.setActiveTab('settings')}
          icon={<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
          label="Preferences"
        />
      </nav>

      <div class="p-6 border-t border-border/50 glass mt-auto flex items-center justify-between gap-2">
        <div class="flex items-center gap-3 overflow-hidden">
          <Avatar class="h-10 w-10 shrink-0 ring-2 ring-primary/20">
            <AvatarFallback class="bg-primary/5 text-xs font-black uppercase text-foreground">NJ</AvatarFallback>
          </Avatar>
          <div class="truncate">
             <p class="text-sm font-bold truncate text-foreground">Nitin Jain</p>
             <p class="text-[10px] text-muted-foreground truncate">Main Operator</p>
          </div>
        </div>
        <button 
          onClick={() => props.setIsDarkMode(!props.isDarkMode)}
          class="p-2.5 rounded-2xl hover:bg-primary/5 transition-all active:scale-90 bg-card border border-border/50 shadow-sm"
        >
          <Show when={props.isDarkMode} fallback={<svg class="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.929 7.929l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>}>
            <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          </Show>
        </button>
      </div>
    </aside>
  );
};
