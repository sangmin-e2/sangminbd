
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Note, NoteColor, CLOUD_API_BASE } from './types';
import StickyNote from './components/StickyNote';
import CreateModal from './components/CreateModal';
import DeleteModal from './components/DeleteModal';
import DetailModal from './components/DetailModal';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [boardId, setBoardId] = useState<string | null>(null);
  
  // 드래그 앤 드롭 상태
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const initialFetchDone = useRef(false);

  useEffect(() => {
    const initializeBoard = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      let currentId = urlParams.get('b');

      if (!currentId) {
        currentId = localStorage.getItem('last_board_id');
        
        if (!currentId) {
          try {
            setSyncStatus('syncing');
            const response = await fetch(CLOUD_API_BASE, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify([])
            });
            const location = response.headers.get('Location');
            if (location) {
              currentId = location.split('/').pop() || null;
            }
          } catch (error) {
            console.error("Failed to create new board:", error);
          }
        }

        if (currentId) {
          localStorage.setItem('last_board_id', currentId);
          window.history.replaceState(null, '', `?b=${currentId}`);
        }
      }

      setBoardId(currentId);
      if (currentId) {
        fetchNotes(currentId);
      } else {
        setIsLoaded(true);
      }
    };

    if (!initialFetchDone.current) {
      initializeBoard();
      initialFetchDone.current = true;
    }
  }, []);

  const fetchNotes = async (id: string) => {
    setSyncStatus('syncing');
    try {
      const response = await fetch(`${CLOUD_API_BASE}/${id}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus('error');
    } finally {
      setIsLoaded(true);
    }
  };

  const saveToCloud = async (newNotes: Note[]) => {
    if (!boardId) return;
    setSyncStatus('syncing');
    try {
      const response = await fetch(`${CLOUD_API_BASE}/${boardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(newNotes)
      });
      if (response.ok) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      setSyncStatus('error');
    }
  };

  const handleAddNote = useCallback((title: string, content: string, color: NoteColor, author: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      content,
      color,
      author: author || '익명',
      createdAt: Date.now()
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveToCloud(updatedNotes);
  }, [notes, boardId]);

  const confirmDelete = () => {
    if (deletingNoteId) {
      const updatedNotes = notes.filter(note => note.id !== deletingNoteId);
      setNotes(updatedNotes);
      saveToCloud(updatedNotes);
      setDeletingNoteId(null);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('보드 공유 링크가 복사되었습니다!');
  };

  // --- 드래그 앤 드롭 핸들러 ---
  const onDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const onDragOver = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    // 실시간으로 배열 순서 변경 (Visual Shuffle)
    const updatedNotes = [...notes];
    const itemToMove = updatedNotes[draggedItemIndex];
    updatedNotes.splice(draggedItemIndex, 1);
    updatedNotes.splice(index, 0, itemToMove);
    
    setDraggedItemIndex(index);
    setNotes(updatedNotes);
  };

  const onDragEnd = () => {
    setDraggedItemIndex(null);
    // 드래그가 끝나면 최종 변경된 순서를 클라우드에 저장
    saveToCloud(notes);
  };
  // ---------------------------

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="marker-font text-xl text-indigo-600 animate-pulse">Connecting to Cloud Board...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">
            I
          </div>
          <div>
            <h1 className="marker-font text-xl md:text-2xl font-bold text-gray-800 leading-none">INSTANT BOARD</h1>
            <p className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-0.5 md:mt-1">By Sangmin</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${
              syncStatus === 'synced' ? 'bg-green-500' : 
              syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500'
            }`}></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              {syncStatus === 'synced' ? 'Cloud Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Offline'}
            </span>
          </div>
          
          <button 
            onClick={copyShareLink}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-xs font-bold uppercase tracking-tighter"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
            <span className="hidden xs:inline">Share</span>
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 md:p-10">
        <div className="mb-6 flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="bg-indigo-50 px-4 py-1.5 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest shadow-inner">
            Board ID: <span className="font-mono">{boardId?.substring(0, 8)}...</span>
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase">
            Total {notes.length} posts &bull; Hold & Drag to reorder
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-300">
            <div className="w-24 h-24 mb-6 border-4 border-dashed border-gray-200 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <p className="text-xl font-bold italic text-center">게시물이 없습니다. 첫 메모를 남겨주세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-w-[1800px] mx-auto">
            {notes.map((note, index) => (
              <StickyNote 
                key={note.id} 
                note={note} 
                index={index}
                onDeleteRequest={(id) => setDeletingNoteId(id)} 
                onViewRequest={(note) => setViewingNote(note)}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                isDragging={draggedItemIndex === index}
              />
            ))}
          </div>
        )}
      </main>

      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 ring-4 ring-white"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      <CreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={handleAddNote} 
      />

      <DeleteModal 
        isOpen={deletingNoteId !== null}
        onClose={() => setDeletingNoteId(null)}
        onConfirm={confirmDelete}
      />

      <DetailModal 
        note={viewingNote}
        onClose={() => setViewingNote(null)}
      />

      <footer className="py-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
        &copy; 2025 INSTANT BOARD &bull; DRAG & DROP ENABLED
      </footer>
    </div>
  );
};

export default App;
