import { createMemo, For, Show } from "solid-js";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import { ChatChart } from "./chart";

interface MarkdownProps {
  content: string;
}

type MarkdownPart = { type: 'markdown', content: string };
type ChartPart = { type: 'chart', data: any };
type ContentPart = MarkdownPart | ChartPart;

export const Markdown = (props: MarkdownProps) => {
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  const parts = createMemo(() => {
    const content = props.content;
    const result: ContentPart[] = [];
    const chartRegex = /```json:chart\n([\s\S]*?)\n```/g;
    
    let lastIndex = 0;
    let match;

    while ((match = chartRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ 
          type: 'markdown', 
          content: content.substring(lastIndex, match.index) 
        });
      }

      try {
        const chartData = JSON.parse(match[1]);
        result.push({ type: 'chart', data: chartData });
      } catch (e) {
        result.push({ 
          type: 'markdown', 
          content: match[0] 
        });
      }
      lastIndex = chartRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      result.push({ 
        type: 'markdown', 
        content: content.substring(lastIndex) 
      });
    }

    return result.length > 0 ? result : [{ type: 'markdown', content: content } as MarkdownPart];
  });

  const renderMarkdown = (text: string) => {
    const rawHtml = marked.parse(text) as string;
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    setTimeout(() => Prism.highlightAll(), 50);
    return sanitizedHtml;
  };

  return (
    <div class="flex flex-col gap-2 w-full max-w-none overflow-hidden">
      <For each={parts()}>
        {(part) => (
          <Show 
            when={part.type === 'chart'} 
            fallback={
              <div 
                class="markdown-body w-full overflow-hidden"
                innerHTML={renderMarkdown((part as MarkdownPart).content)} 
              />
            }
          >
            <ChatChart 
              type={(part as ChartPart).data.type || 'bar'} 
              data={(part as ChartPart).data.data} 
              options={(part as ChartPart).data.options} 
            />
          </Show>
        )}
      </For>
    </div>
  );
};
