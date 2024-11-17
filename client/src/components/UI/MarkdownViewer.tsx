import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { HTMLAttributes, OlHTMLAttributes } from 'react';

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const components: Partial<Components> = {
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />
    ),
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-xl font-semibold mb-3 mt-5" {...props} />
    ),
    h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-lg font-medium mb-2 mt-4" {...props} />
    ),
    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-4 text-base" {...props} />
    ),
    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
    ),
    ol: (props: OlHTMLAttributes<HTMLOListElement>) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
    ),
    li: (props: HTMLAttributes<HTMLLIElement>) => (
      <li className="text-base" {...props} />
    ),
    strong: (props: HTMLAttributes<HTMLElement>) => (
      <strong className="font-semibold" {...props} />
    ),
    blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
    code: ({ inline, ...props }: HTMLAttributes<HTMLElement> & { inline?: boolean }) => (
      inline ? 
        <code className="bg-gray-800 rounded px-1 py-0.5" {...props} /> :
        <code className="block bg-gray-800 rounded p-4 mb-4 overflow-x-auto" {...props} />
    ),
    pre: (props: HTMLAttributes<HTMLPreElement>) => (
      <pre className="bg-gray-800 rounded p-4 mb-4 overflow-x-auto" {...props} />
    ),
  };

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
