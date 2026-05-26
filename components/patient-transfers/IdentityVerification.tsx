import { Camera, Fingerprint, Mic } from "lucide-react";
import VerificationCard from "./VerififcationCard";


type Props = {
  voiceVerified: boolean;
  fingerprintVerified: boolean;
  faceVerified: boolean;
  onVoiceVerify: () => void;
  onFingerprintVerify: () => void;
  onFaceVerify: () => void;
};

export default function IdentityVerification({
  voiceVerified,
  fingerprintVerified,
  faceVerified,
  onVoiceVerify,
  onFingerprintVerify,
  onFaceVerify,
}: Props) {
  return (
    <>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">
          Identity Verification
        </h3>
        <p className="text-sm text-gray-500">
          Complete all three verification methods to proceed
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <VerificationCard
          icon={<Mic />}
          title="Voice Recognition"
          subtitle="Voice Verification"
          buttonText="Start voice verification"
          helperText="Verify it’s you"
          verified={voiceVerified}
          onVerify={onVoiceVerify}
        />

        <VerificationCard
          icon={<Fingerprint />}
          title="Fingerprint Scan"
          subtitle="Biometric Authentication"
          buttonText="Scan fingerprint"
          helperText="Place your finger on the scanner"
          verified={fingerprintVerified}
          onVerify={onFingerprintVerify}
        />

        <VerificationCard
          icon={<Camera />}
          title="Face Recognition"
          subtitle="Face verification"
          buttonText="Start face verification"
          helperText="Position your face in the camera frame"
          verified={faceVerified}
          onVerify={onFaceVerify}
        />
      </div>
    </>
  );
}