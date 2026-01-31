import { createEffect, onMount } from "solid-js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface ChartProps {
  data: any;
  type: "line" | "bar" | "pie" | "doughnut" | "radar" | "polarArea";
  options?: any;
}

export const ChatChart = (props: ChartProps) => {
  let canvasRef: HTMLCanvasElement | undefined;
  let chartInstance: Chart | undefined;

  const isDark = () => document.documentElement.classList.contains('dark');

  createEffect(() => {
    if (canvasRef && props.data) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const gridColor = isDark() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      const textColor = isDark() ? '#a1a1aa' : '#71717a';
      
      chartInstance = new Chart(canvasRef, {
        type: props.type,
        data: props.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: textColor,
                font: { family: 'Inter', size: 12, weight: 'bold' }
              }
            }
          },
          scales: props.type === 'bar' || props.type === 'line' ? {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor }
            }
          } : undefined,
          ...props.options,
        },
      });
    }
  });

  return (
    <div class="w-full h-80 my-8 p-4 bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-[2rem] border border-border/50 shadow-inner flex flex-col items-center justify-center overflow-hidden">
      <div class="w-full h-full relative">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
