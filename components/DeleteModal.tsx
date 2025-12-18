
import React, { useState } from 'react';
import { SECRET_PASSWORD } from '../types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (password === SECRET_PASSWORD) {
      onConfirm();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-red-600 px-6 py-4 text-white flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            삭제 확인
          </h2>
          <button onClick={onClose} className="hover:opacity-70">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-gray-800 text-sm font-bold">
              이 메모를 삭제하시겠습니까?
            </p>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              Enter Password
            </p>
          </div>
          
          <input 
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            placeholder="••••"
            className={`w-full px-4 py-3 bg-gray-50 border ${error ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all text-center text-xl tracking-widest`}
          />
          
          {error && <p className="text-red-500 text-xs font-bold text-center animate-bounce">비밀번호가 틀렸습니다.</p>}
          
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-bold transition-colors"
            >
              취소
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-lg shadow-red-200 transition-colors"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
