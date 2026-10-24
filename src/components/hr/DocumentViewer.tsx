import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText,
  ShieldCheck,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { DocumentItem, DocumentReviewStatus } from '../../types';

interface DocumentViewerProps {
  document: DocumentItem | null;
  onApprove: (docId: string) => void;
  onRequestCorrection: (docId: string, reason: string) => void;
  onReject: (docId: string, reason: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onApprove,
  onRequestCorrection,
  onReject
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!document) {
    return (
      <div className="h-full min-h-[420px] flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
        <FileText className="w-12 h-12 text-slate-300 mb-3" />
        <h4 className="text-base font-semibold text-slate-700">No Document Selected</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Select a document from the left panel to inspect, zoom, rotate, and review.
        </p>
      </div>
    );
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.6));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const submitCorrection = () => {
    if (!correctionReason.trim()) return;
    onRequestCorrection(document.id, correctionReason.trim());
    setShowCorrectionModal(false);
    setCorrectionReason('');
  };

  const submitReject = () => {
    if (!rejectReason.trim()) return;
    onReject(document.id, rejectReason.trim());
    setShowRejectModal(false);
    setRejectReason('');
  };

  const getStatusBadge = (status: DocumentReviewStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'CORRECTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Correction Required
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className={`flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl ${
      isFullscreen ? 'fixed inset-4 z-50' : 'h-full min-h-[500px]'
    }`}>
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700 text-white">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">{document.title}</h3>
              {getStatusBadge(document.status)}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{document.fileName}</span>
              <span>•</span>
              <span>{document.fileSize}</span>
              {document.isSample && (
                <>
                  <span>•</span>
                  <span className="text-amber-400 font-medium">Safe Sample</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleRotate}
            title="Rotate 90°"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset View"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-slate-950/60 overflow-hidden relative flex items-center justify-center p-6 select-none">
        {/* Subtle checkered grid pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {document.correctionReason && (
          <div className="absolute top-4 left-4 right-4 z-10 bg-amber-950/90 border border-amber-600/50 rounded-xl p-3 text-amber-200 text-xs flex items-start gap-2 shadow-lg backdrop-blur-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Correction Reason Logged: </span>
              {document.correctionReason}
            </div>
          </div>
        )}

        <div 
          className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`
          }}
        >
          {document.fileDataUrl ? (
            <img
              src={document.fileDataUrl}
              alt={document.title}
              className="max-h-[380px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-700/50"
            />
          ) : (
            <div className="w-72 h-80 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <FileText className="w-16 h-16 text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">{document.title}</p>
              <p className="text-xs text-slate-500 mt-1">{document.fileName}</p>
              <span className="mt-4 px-3 py-1 bg-slate-700 rounded-full text-[11px] text-slate-300">
                Binary in browser memory
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar per document */}
      <div className="px-5 py-3.5 bg-slate-800 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Statutory Compliance Check: Verify Name, Date of Birth & Clarity</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onApprove(document.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve Document
          </button>

          <button
            type="button"
            onClick={() => setShowCorrectionModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 active:scale-95 transition-all"
          >
            <AlertTriangle className="w-4 h-4" /> Request Correction
          </button>

          <button
            type="button"
            onClick={() => setShowRejectModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 active:scale-95 transition-all"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      </div>

      {/* Correction Reason Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Request Document Correction</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Specify what the employee needs to fix. An automated WhatsApp message with a direct re-upload link will be simulated.
            </p>

            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold text-slate-700">Quick Reason Template</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Image is blurry / unreadable',
                  'Edges cropped, all 4 corners required',
                  'Name does not match PAN record',
                  'Cancelled cheque lacks IFSC / A/C number'
                ].map(tmpl => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => setCorrectionReason(tmpl)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
              placeholder="Enter specific instructions for the candidate..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitCorrection}
                disabled={!correctionReason.trim()}
                className="px-4 py-2 text-xs font-semibold bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50"
              >
                Send Correction Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <XCircle className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Reject Document</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Enter the rejection justification. This will mark the candidate record as Rejected.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Expired identity document or suspected alteration..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-50"
              >
                Confirm Document Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
