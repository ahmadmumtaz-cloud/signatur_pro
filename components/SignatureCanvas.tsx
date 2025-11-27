import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { SignatureConfig } from '../types';

interface SignatureCanvasProps {
  config: SignatureConfig;
  backgroundImage?: string | null;
  onInteract?: () => void;
}

export interface SignatureCanvasHandle {
  clear: () => void;
  getCanvas: () => HTMLCanvasElement | null;
  isEmpty: () => boolean;
}

export const SignatureCanvas = forwardRef<SignatureCanvasHandle, SignatureCanvasProps>(({ config, backgroundImage, onInteract }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [bgImageElement, setBgImageElement] = useState<HTMLImageElement | null>(null);

  // Load background image when prop changes
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        setBgImageElement(img);
        setHasContent(true); // Content exists (the document)
        resizeAndDraw(img);
      };
    } else {
      setBgImageElement(null);
      setHasContent(false);
      resizeAndDraw(null);
    }
  }, [backgroundImage]);

  const resizeAndDraw = (img: HTMLImageElement | null) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current content if needed? 
    // For simplicity, resizing clears the canvas in standard HTML5. 
    // We will redraw the background image immediately.
    
    const containerWidth = container.clientWidth;

    if (img) {
      // Calculate height based on aspect ratio
      const aspectRatio = img.height / img.width;
      canvas.width = containerWidth;
      canvas.height = containerWidth * aspectRatio;
      
      // Draw background
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      // Default dimensions
      canvas.width = containerWidth;
      canvas.height = 400;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw background if it exists
        if (bgImageElement) {
          ctx.drawImage(bgImageElement, 0, 0, canvas.width, canvas.height);
          // Keep hasContent true because the document is there
          setHasContent(true); 
        } else {
          setHasContent(false);
        }
      }
    },
    getCanvas: () => canvasRef.current,
    isEmpty: () => !hasContent
  }));

  const getCoordinates = (event: MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasContent(true);
    onInteract?.();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e.nativeEvent || e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = config.color;
    ctx.lineWidth = config.thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: any) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e.nativeEvent || e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: any) => {
    e.preventDefault();
    if (isDrawing) {
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.closePath();
      setIsDrawing(false);
    }
  };

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      // Debounce or just call logic
      resizeAndDraw(bgImageElement);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [bgImageElement]);

  return (
    <div ref={containerRef} className="w-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden relative touch-none cursor-crosshair hover:border-indigo-300 transition-colors">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {!hasContent && !bgImageElement && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 select-none p-4 text-center h-[400px]">
          <span className="text-lg font-medium">Draw your signature here<br/><span className="text-sm opacity-75">or upload a document</span></span>
        </div>
      )}
    </div>
  );
});

SignatureCanvas.displayName = 'SignatureCanvas';