
import React, { useMemo } from 'react';
import { marked } from 'marked';

interface PreviewProps {
  content: string;
}

const Preview: React.FC<PreviewProps> = ({ content }) => {
  const htmlContent = useMemo(() => {
    return { __html: marked.parse(content || '*No content to preview*') };
  }, [content]);

  return (
    <div className="h-full w-full bg-[#1e1e1e] p-8 md:p-16 overflow-y-auto max-w-4xl mx-auto">
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={htmlContent}
      />
    </div>
  );
};

export default Preview;
