
import React from 'react';
import { Plus, Trash2, ChevronLeft, FileText, Box, CheckCircle } from 'lucide-react';
import { Document } from '../types';

interface SidebarProps {
  show: boolean;
  documents: Document[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
  lastSaved: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  show, documents, activeId, onSelect, onNew, onDelete, onToggle, lastSaved 
}) => {
  return (
    <aside className={`${show ? 'w-64' : 'w-0'} bg-[#161616] h-full flex flex-col transition-all duration-300 overflow-hidden border-r border-[#2d2d2d]`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#dcc8b1] rounded-xl flex items-center justify-center text-[#1e1e1e] shadow-lg">
            <Box size={18} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#dcc8b1]">Harper</span>
        </div>
        <button onClick={onToggle} className="p-1 hover:bg-[#2d2d2d] rounded-lg text-[#5e5e5e] transition-all">
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="px-4 mb-6">
        <button 
          onClick={onNew}
          className="w-full flex items-center justify-between py-2.5 px-4 bg-[#2d2d2d] border border-transparent hover:border-[#dcc8b1] text-[#e5e1da] rounded-2xl text-sm font-medium transition-all shadow-sm group"
        >
          <span>New Doc</span>
          <Plus size={14} className="text-[#dcc8b1]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar">
        {documents.map(doc => (
          <div 
            key={doc.id}
            onClick={() => onSelect(doc.id)}
            className={`group flex items-center justify-between px-3 py-3 rounded-2xl cursor-pointer transition-all ${activeId === doc.id ? 'bg-[#2d2d2d] shadow-md text-white' : 'text-[#5e5e5e] hover:bg-[#1e1e1e] hover:text-[#e5e1da]'}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText size={14} className={activeId === doc.id ? 'text-[#dcc8b1]' : 'text-[#2d2d2d]'} />
              <span className="text-[13px] font-medium truncate">{doc.title || 'Untitled'}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] text-[#3d3d3d] font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[#dcc8b1] shadow-[0_0_8px_rgba(220,200,177,0.5)]"></div>
            Obsidian Mode
        </div>
        <div 
          key={lastSaved}
          className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-700"
        >
          <CheckCircle size={10} className="text-[#dcc8b1]/40" />
          <span className="text-[8px] text-[#3d3d3d] font-bold uppercase tracking-tighter">Saved</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
