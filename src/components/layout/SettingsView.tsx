import { type Component, For } from 'solid-js';

interface SettingsViewProps {
  config: any;
}

export const SettingsView: Component<SettingsViewProps> = (props) => {
  return (
    <main class="flex-1 overflow-y-auto p-8 md:p-20 page-transition bg-background text-foreground">
      <div class="max-w-4xl mx-auto space-y-16">
        <div>
          <h1 class="text-6xl font-black tracking-tighter mb-4">Environment</h1>
          <p class="text-muted-foreground text-xl font-medium max-w-lg leading-relaxed">Secure gateway diagnostics and stack performance metrics.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section class="space-y-6">
            <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60 px-4">Gateway Status</h3>
            <div class="glass-card rounded-[2.5rem] divide-y divide-border/30 shadow-2xl">
              <SettingsItem label="Host Platform" value={props.config?.host?.platform || 'Clawdbot OS'} />
              <SettingsItem label="Active Port" value={props.config?.gateway?.port || '18789'} />
              <SettingsItem label="Auth Mode" value="Secure Token" />
              <SettingsItem label="Encryption" value="AES-256-GCM" />
            </div>
          </section>

          <section class="space-y-6">
            <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-primary/60 px-4">Stack Metrics</h3>
            <div class="glass-card rounded-[2.5rem] divide-y divide-border/30 shadow-2xl">
               <SettingsItem label="Runtime" value="Bun 1.3.1" />
               <SettingsItem label="Visuals" value="Lightning CSS" />
               <SettingsItem label="Framework" value="Solid Store" />
               <SettingsItem label="Runner" value="Native Bun" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

const SettingsItem = (props: { label: string, value: string | number }) => (
  <div class="flex items-center justify-between p-7 hover:bg-primary/[0.02] transition-colors group">
    <span class="font-bold text-[15px] tracking-tight group-hover:translate-x-1 transition-transform">{props.label}</span>
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground font-black uppercase tracking-widest bg-secondary/50 px-3 py-1 rounded-lg">{props.value}</span>
      <svg class="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
    </div>
  </div>
);
