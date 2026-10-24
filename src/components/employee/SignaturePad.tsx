import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Sparkles, PenTool } from 'lucide-react';
import { getSampleDocSvg } from '../../utils/sampleDocs';

interface SignaturePadProps {
  candidateName: string;
  onSave: (signatureDataUrl: string) => void;
  initialSignature?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  candidateName,
  onSave,
  initialSignature
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(candidateName || 'Rahul Sharma');

  useEffect(() => {
    if (initialSignature && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasContent(true);
        };
        img.src = initialSignature;
      }
    }
  }, [initialSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasContent(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e3a8a';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasContent(false);
      onSave('');
    }
  };

  const applySampleSignature = () => {
    const svgUrl = getSampleDocSvg('signature', candidateName || 'Rahul Sharma');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasContent(true);
          onSave(svgUrl);
        };
        img.src = svgUrl;
      }
    } else {
      onSave(svgUrl);
    }
  };

  const generateFromTypedName = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'italic 34px "Brush Script MT", "Caveat", "Segoe Script", cursive';
    ctx.fillStyle = '#1e3a8a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || candidateName, canvas.width / 2, canvas.height / 2);

    // Draw an artistic flourish underline
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4, canvas.height / 2 + 25);
    ctx.quadraticCurveTo(canvas.width / 2, canvas.height / 2 + 35, (canvas.width * 3) / 4, canvas.height / 2 + 20);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1e3a8a';
    ctx.stroke();

    setHasContent(true);
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Digital Signature</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              mode === 'draw' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Draw
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              mode === 'type' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Type
          </button>
        </div>
      </div>

      {mode === 'draw' ? (
        <div className="relative border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-slate-50 touch-none">
          <canvas
            ref={canvasRef}
            width={480}
            height={160}
            className="w-full h-36 cursor-crosshair bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="absolute bottom-2 left-3 pointer-events-none text-[11px] text-slate-400 font-mono">
            Sign above with touch or mouse
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your name"
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={generateFromTypedName}
              className="px-3 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Apply
            </button>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-center min-h-[90px] flex items-center justify-center">
            <span className="font-serif italic text-2xl text-slate-800 tracking-wide">
              {typedName || candidateName}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
        <button
          type="button"
          onClick={clearCanvas}
          className="text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
        >
          <Eraser className="w-3.5 h-3.5" /> Clear
        </button>

        <button
          type="button"
          onClick={applySampleSignature}
          className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" /> Use Sample Signature
        </button>
      </div>
    </div>
  );
};
