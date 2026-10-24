import React, { useState } from 'react';
import { CandidateRecord, CompanyConfig } from '../../types';
import { WhatsAppInviteScreen } from './WhatsAppInviteScreen';
import { PrivacyConsentScreen } from './PrivacyConsentScreen';
import { OtpVerificationScreen } from './OtpVerificationScreen';
import { EmployeeFormSteps } from './EmployeeFormSteps';
import { ReviewAndSubmitScreen } from './ReviewAndSubmitScreen';
import { SubmissionSuccessScreen } from './SubmissionSuccessScreen';
import { CorrectionModeScreen } from './CorrectionModeScreen';

interface EmployeePortalProps {
  company: CompanyConfig;
  onSubmissionSuccess: (submission: CandidateRecord) => void;
  onSwitchToHr: () => void;
  userSubmission: CandidateRecord | null;
  onUpdateSubmission: (updated: CandidateRecord) => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  company,
  onSubmissionSuccess,
  onSwitchToHr,
  userSubmission,
  onUpdateSubmission
}) => {
  const [screen, setScreen] = useState<'invite' | 'consent' | 'otp' | 'form' | 'review' | 'success'>('invite');
  const [formStep, setFormStep] = useState<number>(1);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Candidate draft in progress
  const [currentDraft, setCurrentDraft] = useState<Partial<CandidateRecord>>(
    userSubmission || {
      companyName: company.name,
      fullName: '',
      fatherName: '',
      dateOfBirth: '',
      gender: 'Male',
      bloodGroup: 'B+',
      mobileNumber: '9000000001',
      email: '',
      emergencyContactName: '',
      emergencyContactRelation: 'Father',
      emergencyContactPhone: '',
      currentAddressLine1: '',
      currentCity: '',
      currentState: '',
      currentPincode: '',
      permanentSameAsCurrent: true,
      panNumber: '',
      aadhaarNumber: '',
      bankAccountNumber: '',
      bankName: '',
      ifscCode: '',
      documents: []
    }
  );

  // If candidate has already submitted and HR requested correction:
  if (userSubmission && userSubmission.status === 'CORRECTION_REQUIRED') {
    return (
      <CorrectionModeScreen
        candidate={userSubmission}
        language={language}
        onResubmitCorrection={(updated) => {
          onUpdateSubmission(updated);
          setScreen('success');
        }}
      />
    );
  }

  // If candidate has already submitted and view is locked in success:
  if (userSubmission && screen === 'success') {
    return (
      <SubmissionSuccessScreen
        submission={userSubmission}
        onSwitchToHr={onSwitchToHr}
        language={language}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {screen === 'invite' && (
        <WhatsAppInviteScreen
          company={company}
          language={language}
          onToggleLanguage={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          onOpenLink={() => setScreen('consent')}
        />
      )}

      {screen === 'consent' && (
        <PrivacyConsentScreen
          company={company}
          language={language}
          onBack={() => setScreen('invite')}
          onConsent={() => setScreen('otp')}
        />
      )}

      {screen === 'otp' && (
        <OtpVerificationScreen
          company={company}
          language={language}
          onBack={() => setScreen('consent')}
          onVerified={() => setScreen('form')}
        />
      )}

      {screen === 'form' && (
        <EmployeeFormSteps
          initialData={currentDraft}
          activeStep={formStep}
          setActiveStep={setFormStep}
          language={language}
          onStepComplete={(step, data) => {
            setCurrentDraft(prev => ({ ...prev, ...data }));
          }}
          onProceedToReview={(finalData) => {
            setCurrentDraft(finalData);
            setScreen('review');
          }}
        />
      )}

      {screen === 'review' && (
        <ReviewAndSubmitScreen
          formData={currentDraft as CandidateRecord}
          company={company}
          language={language}
          onBack={() => setScreen('form')}
          onSubmit={(finalRecord) => {
            onSubmissionSuccess(finalRecord);
            setScreen('success');
          }}
        />
      )}

      {screen === 'success' && currentDraft && (
        <SubmissionSuccessScreen
          submission={currentDraft as CandidateRecord}
          onSwitchToHr={onSwitchToHr}
          language={language}
        />
      )}
    </div>
  );
};
