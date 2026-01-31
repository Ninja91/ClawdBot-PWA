import { type Component } from 'solid-js';
import { cn } from '@/lib/utils';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}

export const NavButton: Component<NavButtonProps> = (props) => {
  return (
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
};
