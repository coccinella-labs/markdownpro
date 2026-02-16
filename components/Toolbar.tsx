
import React from 'react';
import { 
  Bold, Italic, List, Link, Code, Quote, Heading1, Heading2, Minus
} from 'lucide-react';

interface ToolbarProps {
  onAction: (prefix: string, suffix?: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAction }) => {
  const tools = [
    { icon: Heading1, action: ['# ', ''] },
    { icon: Heading2, action: ['## ', ''] },
    { icon: Bold, action: ['**', '**'] },
    { icon: Italic, action: ['*', '*'] },
    { icon: List, action: ['- ', ''] },
    { icon: Link, action: ['[', '](url)'] },
    { icon: Code, action: ['`', '`'] },
    { icon: Quote, action: ['> ', ''] },
    { icon: Minus, action: ['\n---\n', ''] },
  ];

  return (
    <div className="flex items-center gap-1 px-6 py-2 border-b border-[#2d2d2d] overflow-x-auto no-scrollbar bg-[#1e1e1e]">
      {tools.map((tool, idx) => (
        <button
          key={idx}
          onClick={() => onAction(tool.action[0], tool.action[1])}
          className="p-1.5 text-[#5e5e5e] hover:text-[#dcc8b1] transition-colors rounded-lg hover:bg-[#2d2d2d]"
        >
          <tool.icon size={15} />
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
