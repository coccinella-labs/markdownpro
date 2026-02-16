
import React, { useState, useEffect } from 'react';
import { 
  Sidebar as SidebarIcon, Eye, Edit3, Sparkles, Download, RefreshCw, Layers, Moon, Sun, Box, Maximize2, Minimize2, Search
} from 'lucide-react';
import { Document, AIActionType, GroundingChunk } from './types';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import AIModal from './components/AIModal';
import { processAITask, generateMarkdownImage } from './services/gemini';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(() => {
    try {
      const saved = localStorage.getItem('harper_obsidian_docs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load documents", e);
    }
    return [{
      id: '1',
      title: 'Obsidian & Kraft',
      content: '# Obsidian & Kraft\n\nA dark grey workspace designed to complement the natural tones of your box logo. Professional, focused, and minimal.\n\n## Palette\n- **Primary**: Obsidian Grey (#1e1e1e)\n- **Secondary**: Charcoal Kraft (#161616)\n- **Accent**: Tan Kraft (#dcc8b1)\n\nType freely in a space that stays out of your way.',
      updatedAt: Date.now()
    }];
  });

  const [activeDocId, setActiveDocId] = useState<string>(documents[0].id);
  const [showSidebar, setShowSidebar] = useState(true);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('harper_theme') as 'light' | 'dark') || 'light';
  });
  const [aiModal, setAiModal] = useState<{ isOpen: boolean; result: string; action?: AIActionType; sources?: GroundingChunk[] }>({ 
    isOpen: false, 
    result: '',
  });

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  useEffect(() => {
    localStorage.setItem('harper_obsidian_docs', JSON.stringify(documents));
    setLastSaved(Date.now());
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('harper_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleUpdateContent = (content: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, content, updatedAt: Date.now() } : doc
    ));
  };

  const handleUpdateTitle = (title: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId ? { ...doc, title, updatedAt: Date.now() } : doc
    ));
  };

  const createNewDoc = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: '',
      content: '',
      updatedAt: Date.now()
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
  };

  const deleteDoc = (id: string) => {
    if (documents.length <= 1) return;
    const nextDocs = documents.filter(doc => doc.id !== id);
    setDocuments(nextDocs);
    if (activeDocId === id) setActiveDocId(nextDocs[0].id);
  };

  const handleAIAction = async (action: AIActionType) => {
    setIsAIProcessing(true);
    try {
      if (action === AIActionType.GENERATE_IMAGE) {
        const imageUrl = await generateMarkdownImage(activeDoc.title || "Dark minimalist textures");
        const imageMarkdown = `\n\n![Vision](${imageUrl})\n\n`;
        handleUpdateContent(activeDoc.content + imageMarkdown);
        setAiModal({ isOpen: true, result: 'Visual generated successfully.', action });
      } else {
        const result = await processAITask(action, action === AIActionType.RESEARCH ? activeDoc.title : activeDoc.content);
        setAiModal({ 
          isOpen: true, 
          result: result.content, 
          action, 
          sources: result.sources 
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const applyAIResult = () => {
    if (aiModal.action === AIActionType.CONTINUE || aiModal.action === AIActionType.RESEARCH) {
      handleUpdateContent(activeDoc.content + '\n\n' + aiModal.result);
    } else if (aiModal.action === AIActionType.IMPROVE) {
      handleUpdateContent(aiModal.result);
    }
    setAiModal({ ...aiModal, isOpen: false });
  };

  const downloadDoc = () => {
    const blob = new Blob([activeDoc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDoc.title || 'untitled'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-all duration-700 bg-[#1e1e1e] text-[#e5e1da]`}>
      {!isZenMode && (
        <Sidebar 
          show={showSidebar} 
          documents={documents} 
          activeId={activeDocId}
          onSelect={setActiveDocId}
          onNew={createNewDoc}
          onDelete={deleteDoc}
          onToggle={() => setShowSidebar(!showSidebar)}
          lastSaved={lastSaved}
        />
      )}

      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-700 ${isZenMode ? 'px-4 md:px-20 py-10' : ''}`}>
        {!isZenMode && (
          <header className="h-14 flex items-center justify-between px-6 border-b border-[#2d2d2d]">
            <div className="flex items-center gap-4 flex-1">
              {!showSidebar && (
                <button onClick={() => setShowSidebar(true)} className="p-1.5 text-[#5e5e5e] hover:text-[#dcc8b1] transition-colors">
                  <SidebarIcon size={18} />
                </button>
              )}
              <input 
                type="text" 
                value={activeDoc.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-semibold w-full placeholder-[#3d3d3d]"
                placeholder="Draft"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-xl border border-[#2d2d2d]">
                <button onClick={() => setViewMode('edit')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'edit' ? 'bg-[#2d2d2d] text-[#dcc8b1]' : 'text-[#5e5e5e] hover:text-[#e5e1da]'}`}>
                  <Edit3 size={16} />
                </button>
                <button onClick={() => setViewMode('split')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'split' ? 'bg-[#2d2d2d] text-[#dcc8b1]' : 'text-[#5e5e5e] hover:text-[#e5e1da]'}`}>
                  <Layers size={16} />
                </button>
                <button onClick={() => setViewMode('preview')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'preview' ? 'bg-[#2d2d2d] text-[#dcc8b1]' : 'text-[#5e5e5e] hover:text-[#e5e1da]'}`}>
                  <Eye size={16} />
                </button>
              </div>

              <div className="h-4 w-px bg-[#2d2d2d]"></div>

              <div className="flex items-center gap-4">
                <button onClick={() => setIsZenMode(true)} className="text-[#5e5e5e] hover:text-[#dcc8b1] transition-all" title="Zen Mode">
                  <Maximize2 size={18} />
                </button>
                <button onClick={() => handleAIAction(AIActionType.RESEARCH)} disabled={isAIProcessing} className="text-[#5e5e5e] hover:text-[#dcc8b1] transition-all disabled:opacity-30" title="Research Topic">
                  <Search size={18} />
                </button>
                <button onClick={downloadDoc} className="text-[#5e5e5e] hover:text-[#e5e1da] transition-all" title="Download MD">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </header>
        )}

        {isZenMode && (
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsZenMode(false)} className="p-3 bg-[#2d2d2d] border border-[#3d3d3d] rounded-2xl text-[#dcc8b1] hover:text-white transition-all shadow-xl">
              <Minimize2 size={20} />
            </button>
          </div>
        )}

        <div className={`flex-1 flex overflow-hidden rounded-[40px] ${isZenMode ? 'shadow-2xl border border-[#2d2d2d]' : ''}`}>
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`h-full ${viewMode === 'split' ? 'w-1/2 border-r border-[#2d2d2d]' : 'w-full'}`}>
              <Editor 
                content={activeDoc.content} 
                onChange={handleUpdateContent} 
                onAIAction={handleAIAction}
                isZen={isZenMode}
              />
            </div>
          )}
          {(viewMode === 'preview' || viewMode === 'split') && !isZenMode && (
            <div className={`h-full ${viewMode === 'split' ? 'w-1/2' : 'w-full'} overflow-y-auto bg-[#1e1e1e]`}>
              <Preview content={activeDoc.content} />
            </div>
          )}
        </div>
      </main>

      <AIModal 
        isOpen={aiModal.isOpen} 
        result={aiModal.result} 
        action={aiModal.action}
        sources={aiModal.sources}
        onClose={() => setAiModal({ ...aiModal, isOpen: false })}
        onApply={applyAIResult}
      />
    </div>
  );
};

export default App;
