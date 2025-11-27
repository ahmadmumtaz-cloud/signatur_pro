import React, { useRef, useState } from 'react';
import { SignatureCanvas, SignatureCanvasHandle } from './components/SignatureCanvas';
import { Toolbar } from './components/Toolbar';
import { Button } from './components/Button';
import { InspirationPanel } from './components/InspirationPanel';
import { SignatureConfig, ExportFormat } from './types';
import { downloadSignature } from './utils/fileUtils';
import { Download, Trash2, PenTool, Upload, FileText, FileImage, FileType, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const canvasRef = useRef<SignatureCanvasHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [config, setConfig] = useState<SignatureConfig>({
    color: '#000000',
    thickness: 3
  });
  const [format, setFormat] = useState<ExportFormat>('jpg');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (canvas) {
      if (canvasRef.current?.isEmpty() && !backgroundImage) {
        alert('Please draw a signature first.');
        return;
      }
      downloadSignature(canvas, format);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = () => {
    setBackgroundImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Sidebar */}
        <aside className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <PenTool className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Signature Pro</h1>
          </div>

          {/* Upload Section */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document
            </h3>
            <div className="space-y-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden" 
              />
              
              {!backgroundImage ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-600"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm font-medium">Upload Document</span>
                  <span className="text-xs text-slate-400">JPG or PNG</span>
                </button>
              ) : (
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded flex items-center justify-center text-indigo-600">
                      <FileImage className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">Document Loaded</p>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Ready to sign
                      </p>
                    </div>
                  </div>
                  <Button variant="danger" onClick={removeDocument} className="w-full text-sm py-2">
                    Remove Document
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Format Section - Moved Here */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileType className="w-4 h-4" />
              Export Format
            </h3>
            <div className="space-y-2">
              {(['jpg', 'png', 'pdf', 'docx'] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    format === fmt
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <span className="uppercase">{fmt}</span>
                  {format === fmt && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 pt-4 border-t border-slate-200">
             © 2024 Signature Pro
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 bg-white flex flex-col">
          <InspirationPanel />

          <Toolbar config={config} onChange={setConfig} />

          <div className="flex-1 mb-6 min-h-[400px]">
            <SignatureCanvas 
              ref={canvasRef} 
              config={config} 
              backgroundImage={backgroundImage}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <Button variant="secondary" onClick={handleClear} className="w-full sm:w-auto">
              <Trash2 className="w-4 h-4" />
              Clear Signature
            </Button>
            <Button onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="w-4 h-4" />
              Download {format.toUpperCase()}
            </Button>
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;