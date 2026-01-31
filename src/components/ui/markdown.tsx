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

type ContentPart = 
  | { type: 'markdown', content: string }
  | { type: 'chart', data: any };

export const Markdown = (props: MarkdownProps) => {
  // Configure marked for GFM and tables
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  const parts = createMemo(() => {
    const content = props.content;
    const result: ContentPart[] = [];
    
    // Regex to find ```json:chart ... ``` blocks
    const chartRegex = /```json:chart\n([\s\S]*?)\n```/g;
    
    let lastIndex = 0;
    let match;

    while ((match = chartRegex.exec(content)) !== null) {
      // Add markdown before the chart
      if (match.index > lastIndex) {
        result.push({ 
          type: 'markdown', 
          content: content.substring(lastIndex, match.index) 
        });
      }

      // Try to parse chart data
      try {
        const chartData = JSON.parse(match[1]);
        result.push({ type: 'chart', data: chartData });
      } catch (e) {
        // If parsing fails, treat it as markdown (it will show as a code block)
        result.push({ 
          type: 'markdown', 
          content: match[0] 
        });
      }

      lastIndex = chartRegex.lastIndex;
    }

    // Add remaining markdown
    if (lastIndex < content.length) {
      result.push({ 
        type: 'markdown', 
        content: content.substring(lastIndex) 
      });
    }

    return result.length > 0 ? result : [{ type: 'markdown', content: content }];
  });

  const renderMarkdown = (text: string) => {
    const rawHtml = marked.parse(text) as string;
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    
    // Trigger Prism highlight after DOM update
    setTimeout(() => Prism.highlightAll(), 50);
    
    return sanitizedHtml;
  };

  return (
    <div class="flex flex-col gap-2 w-full max-w-none overflow-hidden">
      <For each={parts()}>
        {(part) => (
          <Show when={part.type === 'markdown'} fallback={
            <ChatChart 
              type={part.data.type || 'bar'} 
              data={part.data.data} 
              options={part.data.options} 
            />
          }>
            <div 
              class="markdown-body w-full overflow-hidden"
              innerHTML={renderMarkdown((part as any).content)} 
            />
          </Show>
        )}
      </For>
    </div>
  );
};
