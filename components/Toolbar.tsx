import React from 'react';
import { SignatureConfig, SignatureColor } from '../types';
import { Check } from 'lucide-react';

interface ToolbarProps {
  config: SignatureConfig;
  onChange: (config: SignatureConfig) => void;
}

const COLORS: SignatureColor[] = ['#000000', '#1e40af', '#dc2626', '#15803d'];

export const Toolbar: React.FC<ToolbarProps> = ({ config, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Color Picker */}
      <div className="flex-1 bg-slate-50 p-4 rounded-xl flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-600">Color:</span>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...config, color })}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                config.color === color ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            >
              {config.color === color && <Check className="w-4 h-4 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Thickness Slider */}
      <div className="flex-1 bg-slate-50 p-4 rounded-xl flex items-center gap-4">
        <label htmlFor="thickness" className="text-sm font-semibold text-slate-600 min-w-fit">
          Thickness:
        </label>
        <div className="flex-1 flex items-center gap-3">
          <input
            type="range"
            id="thickness"
            min="1"
            max="10"
            step="1"
            value={config.thickness}
            onChange={(e) => onChange({ ...config, thickness: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-sm font-bold text-indigo-600 w-6 text-center">
            {config.thickness}
          </span>
        </div>
      </div>
    </div>
  );
};