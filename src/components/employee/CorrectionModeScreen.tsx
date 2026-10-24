import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  FileText
} from 'lucide-react';
import { CandidateRecord, DocumentItem, DocumentType } from '../../types';
import { getSampleDocSvg } from '../../utils/sampleDocs';
import { triggerConfetti } from '../../utils/confetti';

interface CorrectionModeScreenProps {
  candidate: CandidateRecord;
  onResubmitCorrection: (updatedCandidate: CandidateRecord) => void;
  language: 'en' | 'hi';
}

export const CorrectionModeScreen: React.FC<CorrectionModeScreenProps> = ({
  candidate,
  onResubmitCorrection,
  language
}) => {
  const [candidateData, setCandidateData] = useState<CandidateRecord>(candidate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctedDocIds, setCorrectedDocIds] = useState<Set<string>>(new Set());

  // Find all documents marked CORRECTION_REQUIRED
  const flaggedDocs = candidateData.documents.filter(d => d.status === 'CORRECTION_REQUIRED');

  const replaceWithCleanSample = (docId: string, docType: DocumentType) => {
    const updatedDocs = candidateData.documents.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          fileName: `${docType}_corrected_sample.svg`,
          fileDataUrl: getSampleDocSvg(docType, candidateData.fullName),
          fileSize: '395 KB',
          uploadTimestamp: new Date().toISOString(),
          status: 'PENDING' as const, // resets to pending
          correctionReason: undefined
        };
      }
      return d;
    });

    setCandidateData(prev => ({ ...prev, documents: updatedDocs }));
    setCorrectedDocIds(prev => new Set(prev).add(docId));
  };

  const handleLocalUpload = (docId: string, docType: DocumentType, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const updatedDocs = candidateData.documents.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            fileName: file.name,
            fileDataUrl: dataUrl,
            fileSize: `${Math.round(file.size / 1024)} KB`,
            uploadTimestamp: new Date().toISOString(),
            status: 'PENDING' as const,
            correctionReason: undefined
          };
        }
        return d;
      });

      setCandidateData(prev => ({ ...prev, documents: updatedDocs }));
      setCorrectedDocIds(prev => new Set(prev).add(docId));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    triggerConfetti();

    setTimeout(() => {
      setIsSubmitting(false);
      onResubmitCorrection({
        ...candidateData,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 select-none overflow-y-auto justify-between p-5">
      <div className="space-y-4">
        {/* Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              {language === 'en' ? 'Document Correction Required' : 'दस्तावेज़ सुधार आवश्यक'}
            </h3>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              {language === 'en'
                ? 'HR has reviewed your submission and requested an updated document. Please upload a clear replacement below.'
                : 'एचआर ने आपके आवेदन की समीक्षा की है और संशोधित दस्तावेज़ का अनुरोध किया है।'}
            </p>
          </div>
        </div>

        {/* List of Flagged Items */}
        <div className="space-y-3">
          {flaggedDocs.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-800">All Flagged Items Replaced!</h4>
              <p className="text-xs text-slate-500 mt-1">Click the button below to submit your corrected application.</p>
            </div>
          ) : (
            flaggedDocs.map(doc => {
              const isReplaced = correctedDocIds.has(doc.id);

              return (
                <div key={doc.id} className="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <h4 className="font-bold text-xs text-slate-900">{doc.title}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Action Needed
                    </span>
                  </div>

                  {/* HR Remark */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <span className="font-semibold block text-[11px] text-amber-800 mb-0.5">HR Operations Remark:</span>
                    "{doc.correctionReason || 'Please provide a clear scan without glare or cropped borders.'}"
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => replaceWithCleanSample(doc.id, doc.type)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Attach Clean Sample Scan</span>
                    </button>

                    <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Upload Replacement</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLocalUpload(doc.id, doc.type, file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || (flaggedDocs.length > 0 && correctedDocIds.size === 0)}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none active:scale-95 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Resubmitting...' : 'Submit Corrected Documents to HR'}</span>
        </button>
      </div>
    </div>
  );
};
