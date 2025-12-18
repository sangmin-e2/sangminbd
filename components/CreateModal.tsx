
import React, { useState } from 'react';
import { NoteColor, SECRET_PASSWORD } from '../types';
import { getSmartImprovement } from '../services/geminiService';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, color: NoteColor, author: string) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (password !== SECRET_PASSWORD) {
      setError('Invalid password. Access denied.');
      return;
    }
    if (!content.trim()) {
      setError('Content cannot be empty.');
      return;
    }
    // Saving with default color 'yellow' and default author 'Anonymous'
    onSave(title, content, 'yellow', 'Anonymous');
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPassword('');
    setError('');
  };

  const handleAIImprove = async () => {
    if (!content.trim()) return;
    setIsImproving(true);
    const improvedText = await getSmartImprovement(content);
    setContent(improvedText);
    setIsImproving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">New Post-it</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your note a title..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex justify-between">
              Content
              <button 
                onClick={handleAIImprove}
                disabled={isImproving || !content.trim()}
                className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 text-[10px] flex items-center gap-1"
              >
                {isImproving ? 'Thinking...' : '✨ Magic Polish'}
              </button>
            </label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="What's on your mind?"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password to post"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>}

          <div className="pt-4 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg shadow-indigo-200"
            >
              Post Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
