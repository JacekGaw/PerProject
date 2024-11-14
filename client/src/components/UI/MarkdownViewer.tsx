import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { HTMLProps } from 'react';

interface MarkdownViewerProps {
  content: string;
}

type ComponentPropsWithoutRef<T> = Omit<HTMLProps<T>, 'ref'>;

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const components: Partial<Components> = {
    h1: (props: ComponentPropsWithoutRef<HTMLHeadingElement>) => (
      <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />
    ),
    h2: (props: ComponentPropsWithoutRef<HTMLHeadingElement>) => (
      <h2 className="text-xl font-semibold mb-3 mt-5" {...props} />
    ),
    h3: (props: ComponentPropsWithoutRef<HTMLHeadingElement>) => (
      <h3 className="text-lg font-medium mb-2 mt-4" {...props} />
    ),
    p: (props: ComponentPropsWithoutRef<HTMLParagraphElement>) => (
      <p className="mb-4 text-base" {...props} />
    ),
    ul: (props: ComponentPropsWithoutRef<HTMLUListElement>) => (
      <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
    ),
    ol: (props: ComponentPropsWithoutRef<HTMLOListElement>) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
    ),
    li: (props: ComponentPropsWithoutRef<HTMLLIElement>) => (
      <li className="text-base" {...props} />
    ),
    strong: (props: ComponentPropsWithoutRef<HTMLElement>) => (
      <strong className="font-semibold" {...props} />
    ),
    blockquote: (props: ComponentPropsWithoutRef<HTMLQuoteElement>) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
    code: ({ inline, ...props }: ComponentPropsWithoutRef<HTMLElement> & { inline?: boolean }) => (
      inline ? 
        <code className="bg-gray-800 rounded px-1 py-0.5" {...props} /> :
        <code className="block bg-gray-800 rounded p-4 mb-4 overflow-x-auto" {...props} />
    ),
    pre: (props: ComponentPropsWithoutRef<HTMLPreElement>) => (
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