"use client";

import ConsultationActivityLog from "@components/dashboard/consultations/ConsultationActivityLog";
import { useConsultation } from "./ConsultationContext";

export default function ActivityLogTab() {
  const { orgId, selectedConsultationId, selectedConsultation } =
    useConsultation();

  return (
    <ConsultationActivityLog
      orgId={orgId}
      consultationId={selectedConsultationId}
      refreshKey={selectedConsultation?.updated_at ?? null}
      theme="doctor"
    />
  );
}
