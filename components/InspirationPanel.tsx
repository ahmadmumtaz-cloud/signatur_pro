import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from './Button';
import { generateSignatureInspiration } from '../services/geminiService';

export const InspirationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    setError('');
    setImageUrl(null);
    
    try {
      const url = await generateSignatureInspiration(name);
      setImageUrl(url);
    } catch (e) {
      setError('Failed to generate inspiration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="mb-6 flex justify-center">
        <Button 
          variant="ghost" 
          onClick={() => setIsOpen(true)}
          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Need Inspiration? Ask AI
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative animate-in fade-in slide-in-from-top-4">
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        AI Signature Generator
      </h3>
      <p className="text-slate-600 text-sm mb-4">
        Enter your name and let Gemini generate a unique signature style for you to copy.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name (e.g. John Doe)"
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} isLoading={loading} disabled={!name.trim()}>
          Generate
        </Button>
      </div>

      {error && (
        <p className="mt-3 text-red-600 text-sm">{error}</p>
      )}

      {imageUrl && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Generated Inspiration</p>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-center">
             <img src={imageUrl} alt="AI Generated Signature" className="max-h-40 object-contain" />
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">
            Practice drawing this style in the canvas below!
          </p>
        </div>
      )}
    </div>
  );
};