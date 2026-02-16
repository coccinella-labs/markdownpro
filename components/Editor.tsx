
import React, { useRef } from 'react';
import Toolbar from './Toolbar';
import { Wand2, Image as ImageIcon } from 'lucide-react';
import { AIActionType } from '../types';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onAIAction: (action: AIActionType) => void;
  isZen?: boolean;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, onAIAction, isZen }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleToolbarAction = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    const selectedText = content.substring(selectionStart, selectionEnd);
    const newContent = 
      content.substring(0, selectionStart) + 
      prefix + selectedText + suffix + 
      content.substring(selectionEnd);
    
    onChange(newContent);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = selectionStart + prefix.length + selectedText.length + suffix.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  return (
    <div className={`h-full flex flex-col transition-all duration-700 ${isZen ? 'bg-[#1e1e1e]' : 'bg-[#1e1e1e]'}`}>
      {!isZen && <Toolbar onAction={handleToolbarAction} />}
      <div className="flex-1 relative overflow-hidden group">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Unfold your vision..."
          style={{ caretColor: '#dcc8b1' }}
          className={`w-full h-full mono leading-[1.85] border-none focus:ring-0 resize-none text-[#e5e1da] placeholder-[#3d3d3d] outline-none scrollbar-hide bg-transparent transition-all duration-700 ${isZen ? 'p-10 md:p-24 text-lg' : 'p-10 md:p-16'}`}
        />
        
        <div className={`absolute bottom-10 right-10 flex flex-col gap-4 transition-opacity duration-700 ${isZen ? 'opacity-20 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
           <button 
            onClick={() => onAIAction(AIActionType.IMPROVE)}
            className="p-4 bg-[#2d2d2d] border border-[#3d3d3d] shadow-2xl rounded-[24px] text-[#dcc8b1] hover:text-white transition-all transform hover:-translate-y-2 active:scale-95"
            title="Refine Draft"
           >
             <Wand2 size={18} />
           </button>
           <button 
            onClick={() => onAIAction(AIActionType.GENERATE_IMAGE)}
            className="p-4 bg-[#2d2d2d] border border-[#3d3d3d] shadow-2xl rounded-[24px] text-[#dcc8b1] hover:text-white transition-all transform hover:-translate-y-2 active:scale-95"
            title="Add Vision"
           >
             <ImageIcon size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
