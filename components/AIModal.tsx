
import React from 'react';
import { X, Check, Sparkles, ExternalLink } from 'lucide-react';
import { AIActionType, GroundingChunk } from '../types';
import { marked } from 'marked';

interface AIModalProps {
  isOpen: boolean;
  result: string;
  action?: AIActionType;
  sources?: GroundingChunk[];
  onClose: () => void;
  onApply: () => void;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, result, action, sources, onClose, onApply }) => {
  if (!isOpen) return null;

  const isImageGen = action === AIActionType.GENERATE_IMAGE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm transition-all">
      <div className="bg-[#1e1e1e] border border-[#2d2d2d] shadow-2xl w-full max-w-2xl max-h-[75vh] flex flex-col rounded-[32px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="px-8 py-5 flex items-center justify-between border-b border-[#2d2d2d]">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#dcc8b1] flex items-center gap-3">
            <Sparkles size={14} /> Intelligence
          </span>
          <button onClick={onClose} className="text-[#5e5e5e] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar pt-8">
          {isImageGen ? (
            <div className="py-12 text-center">
               <div className="w-16 h-16 bg-[#2d2d2d] text-[#dcc8b1] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                 <Check size={32} />
               </div>
               <p className="text-[#e5e1da] font-medium text-lg">{result}</p>
            </div>
          ) : (
            <div className="space-y-8">
                <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(result) }} />
                
                {sources && sources.length > 0 && (
                  <div className="space-y-3 pt-6 border-t border-[#2d2d2d]">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#5e5e5e]">Sources & Citations</h4>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((chunk, i) => chunk.web && (
                        <a 
                          key={i} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#161616] border border-[#2d2d2d] rounded-full text-[11px] text-[#b4947d] hover:bg-[#2d2d2d] hover:text-[#dcc8b1] transition-all"
                        >
                          <ExternalLink size={10} />
                          <span className="truncate max-w-[200px]">{chunk.web.title || 'Source'}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-px w-12 bg-[#2d2d2d]"></div>
                <div className="mono text-[14px] text-[#5e5e5e] leading-relaxed italic border-l-2 border-[#dcc8b1]/30 pl-6 py-1">
                  {result.substring(0, 150)}...
                </div>
            </div>
          )}
        </div>

        <div className="p-8 flex items-center justify-end gap-8 bg-[#161616] border-t border-[#2d2d2d]">
          <button onClick={onClose} className="text-sm font-bold text-[#5e5e5e] hover:text-[#e5e1da] transition-colors tracking-wide">
            Discard
          </button>
          {!isImageGen && (
            <button 
              onClick={onApply}
              className="px-8 py-3 bg-[#dcc8b1] text-[#1e1e1e] text-sm font-bold rounded-2xl hover:bg-white transition-all active:scale-95 shadow-lg shadow-[#dcc8b1]/5"
            >
              Apply to Document
            </button>
          )}
          {isImageGen && (
             <button onClick={onClose} className="px-8 py-3 bg-[#dcc8b1] text-[#1e1e1e] text-sm font-bold rounded-2xl transition-all shadow-lg shadow-[#dcc8b1]/5">
               Continue Writing
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModal;
