
import React from 'react';
import { Note, COLORS, NoteColor } from '../types';

interface StickyNoteProps {
  note: Note;
  index: number;
  onDeleteRequest: (id: string) => void;
  onViewRequest: (note: Note) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const StickyNote: React.FC<StickyNoteProps> = ({ 
  note, 
  index,
  onDeleteRequest, 
  onViewRequest,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging
}) => {
  const dateStr = new Date(note.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleInternalDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteRequest(note.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // 드롭 허용
    onDragOver(index);
  };

  return (
    <div 
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={handleDragOver}
      onDragEnd={onDragEnd}
      onClick={() => onViewRequest(note)}
      className={`relative p-5 rounded-sm shadow-md border-t-4 ${COLORS[note.color as NoteColor] || COLORS.yellow} aspect-square flex flex-col group transition-all cursor-move overflow-hidden ${isDragging ? 'opacity-30 scale-95 grayscale' : 'hover:shadow-xl hover:-translate-y-1'}`}
      style={{ isolation: 'isolate' }}
    >
      {/* 삭제 버튼 */}
      <button 
        type="button"
        onClick={handleInternalDelete}
        className="absolute top-2 right-2 z-[50] pointer-events-auto active:scale-90 transition-transform opacity-0 group-hover:opacity-100"
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: 'white',
          border: '2px solid black',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '2px 2px 0px rgba(0,0,0,0.1)'
        }}
        title="삭제"
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="black" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <h3 className="font-bold text-base mb-2 border-b border-black/10 pb-1 truncate pr-8 pointer-events-none">
        {note.title || '제목 없음'}
      </h3>
      
      <p className="flex-grow text-xs leading-relaxed mb-2 overflow-hidden display-orient-vertical line-clamp-6 text-gray-800 pointer-events-none">
        {note.content}
      </p>
      
      <div className="flex justify-between items-center text-[10px] mt-auto opacity-60 italic font-bold text-gray-700 pt-2 border-t border-black/5 pointer-events-none">
        <span className="uppercase truncate max-w-[60px]">BY {note.author || '익명'}</span>
        <span>{dateStr}</span>
      </div>
    </div>
  );
};

export default StickyNote;
