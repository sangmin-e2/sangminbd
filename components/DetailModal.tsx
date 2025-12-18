
import React from 'react';
import { Note, COLORS, NoteColor } from '../types';

interface DetailModalProps {
  note: Note | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ note, onClose }) => {
  if (!note) return null;

  const dateStr = new Date(note.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col transform transition-all border-t-8 ${COLORS[note.color as NoteColor] || COLORS.yellow}`}
      >
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-gray-800 break-words">{note.title || '제목 없음'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                BY {note.author || '익명'}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">{dateStr}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-gray-50/30">
          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
            {note.content}
          </p>
        </div>

        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors shadow-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
