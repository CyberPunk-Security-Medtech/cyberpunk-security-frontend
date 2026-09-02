"use client";

import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CalendarClock,
  Eye,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import DialogPortal from "@components/DialogPortal";
import {
  dataSharingService,
  organizationService,
  type DataShareGrant,
  type GrantStatus,
  type OrganizationDirectoryEntry,
} from "@services/api";

type PermissionFilter = "all" | GrantStatus;

const statusLabels: Record<string, string> = {
  pending_patient: "Pending Patient",
  active: "Granted",
  revoked: "Revoked",
  expired: "Expired",
  verification_failed: "Verification Failed",
};

const statusStyles: Record<string, string> = {
  pending_patient: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  revoked: "bg-red-100 text-red-700",
  expired: "bg-slate-100 text-slate-600",
  verification_failed: "bg-orange-100 text-orange-700",
};

const scopeLabels: Record<string, string> = {
  demographics: "Patient biodata",
  history: "Medical history",
  consultations: "Consultation notes",
  lab_results: "Lab results",
  prescriptions: "Prescriptions",
  immunizations: "Immunizations",
};

const consentMethodLabels: Record<string, string> = {
  email_link: "Email link",
  in_person_attestation: "In-person attestation",
  sms_link: "SMS link",
  voice: "Voice",
};

const terminalStatuses = new Set(["revoked", "expired", "verification_failed"]);

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    if (detail && typeof detail === "object") return JSON.stringify(detail);
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.status) {
      return `Request failed with status ${error.response.status}. Please try again.`;
    }
  }

  if (error instanceof Error && error.message) return error.message;

  return "Something went wrong. Please try again.";
};

export default function SharingPermissionsPage({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { activeWorkspace, hydrated } = useAuth();
  const [grants, setGrants] = useState<DataShareGrant[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationDirectoryEntry[]>([]);
  const [filter, setFilter] = useState<PermissionFilter>("all");
  const [selectedGrant, setSelectedGrant] = useState<DataShareGrant | null>(null);
  const [grantToRevoke, setGrantToRevoke] = useState<DataShareGrant | null>(null);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  const orgId = activeWorkspace?.id;

  const filteredGrants = useMemo(() => {
    if (filter === "all") return grants;
    return grants.filter((grant) => grant.status === filter);
  }, [filter, grants]);

  const organizationNameMap = useMemo(() => {
    const map = new Map<string, string>();
    organizations.forEach((organization) => {
      map.set(organization.id, organization.name);
    });
    if (activeWorkspace?.id && activeWorkspace.name) {
      map.set(activeWorkspace.id, activeWorkspace.name);
    }
    return map;
  }, [activeWorkspace?.id, activeWorkspace?.name, organizations]);

  const counts = useMemo(
    () => ({
      all: grants.length,
      pending: grants.filter((grant) => grant.status === "pending_patient").length,
      granted: grants.filter((grant) => grant.status === "active").length,
    }),
    [grants],
  );

  const getOrganizationName = (organizationId: string) =>
    organizationNameMap.get(organizationId) ?? organizationId.slice(0, 8);

  const loadGrants = async () => {
    if (!orgId) return;
    setLoading(true);

    try {
      const [grantRows, directoryRows] = await Promise.all([
        dataSharingService.listShareGrants(orgId, {
          role: "either",
        }),
        organizationService.getDirectory(),
      ]);

      setGrants(grantRows);
      setOrganizations(directoryRows);
      setSelectedGrant((current) =>
        current
          ? grantRows.find((grant) => grant.id === current.id) ?? null
          : current,
      );
    } catch (loadError) {
      toast.error(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hydrated || !orgId) return;
    loadGrants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, orgId]);

  const revokeGrant = async () => {
    if (!orgId || !grantToRevoke) return;
    setRevoking(true);

    try {
      const updatedGrant = await dataSharingService.revokeShareGrant(
        orgId,
        grantToRevoke.id,
      );
      setGrants((current) =>
        current.map((grant) =>
          grant.id === updatedGrant.id ? updatedGrant : grant,
        ),
      );
      setSelectedGrant((current) =>
        current?.id === updatedGrant.id ? updatedGrant : current,
      );
      setGrantToRevoke(null);
    } catch (revokeError) {
      toast.error(getErrorMessage(revokeError));
      await loadGrants();
    } finally {
      setRevoking(false);
    }
  };

  if (hydrated && !orgId) {
    return (
      <div
        className={
          embedded
            ? "min-h-full bg-[#F4FAFA] p-6 md:p-8"
            : "-mx-4 -my-4 min-h-full bg-[#F4FAFA] p-8 md:-mx-12"
        }
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Please select a workspace before viewing sharing permissions.
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        embedded
          ? "min-h-full bg-[#F4FAFA] px-4 py-6 md:px-8"
          : "-mx-4 -my-4 min-h-full bg-[#F4FAFA] px-6 py-8 md:-mx-12 md:px-12"
      }
    >
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-[#19a89a]">Interoperability</p>
          <h1 className="text-3xl font-bold text-[#211783]">
            Sharing Permissions
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Track consent and data-sharing permissions for patient records shared
            between hospitals.
          </p>
        </div>
      </header>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <SummaryCard title="All Permissions" value={counts.all} icon="all" />
        <SummaryCard title="Pending Patient" value={counts.pending} icon="pending" />
        <SummaryCard title="Granted" value={counts.granted} icon="granted" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Permission Register</h2>
            <p className="text-sm text-gray-500">
              Active backend status is displayed as Granted for staff clarity.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["pending_patient", "Pending Patient"],
              ["active", "Granted"],
              ["revoked", "Revoked"],
              ["expired", "Expired"],
              ["verification_failed", "Verification Failed"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value as PermissionFilter)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  filter === value
                    ? "bg-[#211783] text-white"
                    : "bg-[#EEF0FF] text-gray-600 hover:bg-[#dfe2f3]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-[#effafa] text-gray-600">
              <tr>
                <th className="px-5 py-3">Patient ID</th>
                <th className="px-5 py-3">Recipient Org</th>
                <th className="px-5 py-3">Records Shared</th>
                <th className="px-5 py-3">Consent Method</th>
                <th className="px-5 py-3">Expires</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-gray-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Loading sharing permissions...
                  </td>
                </tr>
              ) : (
                filteredGrants.map((grant) => (
                  <tr key={grant.id} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {grant.patient_id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {getOrganizationName(grant.recipient_org_id)}
                    </td>
                    <td className="max-w-xs px-5 py-4 text-gray-600">
                      <span className="line-clamp-1">
                        {grant.scopes
                          .map((scope) => scopeLabels[scope] ?? scope)
                          .join(", ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {consentMethodLabels[grant.consent_method] ??
                        grant.consent_method}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(grant.expires_at)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={grant.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedGrant(grant)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#211783] px-3 py-2 text-xs font-semibold text-[#211783] hover:bg-[#F1F0FF]"
                      >
                        <Eye size={14} />
                        View Permission
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filteredGrants.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-gray-500">
                    No sharing permissions found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedGrant && (
        <PermissionDetailsModal
          grant={selectedGrant}
          currentOrgId={orgId}
          getOrganizationName={getOrganizationName}
          onClose={() => setSelectedGrant(null)}
          onRevoke={() => setGrantToRevoke(selectedGrant)}
        />
      )}

      {grantToRevoke && (
        <RevokeConfirmModal
          grant={grantToRevoke}
          revoking={revoking}
          onClose={() => setGrantToRevoke(null)}
          onConfirm={revokeGrant}
        />
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: "all" | "pending" | "granted";
}) {
  const iconStyle =
    icon === "granted"
      ? "bg-green-50 text-green-600"
      : icon === "pending"
        ? "bg-amber-50 text-amber-600"
        : "bg-[#EEF0FF] text-[#211783]";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <span className={`rounded-full p-2 ${iconStyle}`}>
          {icon === "pending" ? (
            <CalendarClock size={18} />
          ) : icon === "granted" ? (
            <ShieldCheck size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
        </span>
      </div>
      <h3 className="mt-2 text-3xl font-bold text-[#111827]">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}

function PermissionDetailsModal({
  grant,
  currentOrgId,
  getOrganizationName,
  onClose,
  onRevoke,
}: {
  grant: DataShareGrant;
  currentOrgId?: string;
  getOrganizationName: (organizationId: string) => string;
  onClose: () => void;
  onRevoke: () => void;
}) {
  const isSourceOrg = currentOrgId === grant.source_org_id;
  const canRevoke = isSourceOrg && !terminalStatuses.has(grant.status);

  return (
    <DialogPortal
      title="Permission Details"
      isOpen
      onClose={onClose}
      panelClassName="max-h-[calc(100dvh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
    >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Permission Details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Grant ID: {grant.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Permission Details"
            className="rounded text-gray-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#211783] focus-visible:ring-offset-2"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
          <DetailItem label="Patient ID" value={grant.patient_id} />
          <DetailItem
            label="Source Org"
            value={getOrganizationName(grant.source_org_id)}
          />
          <DetailItem
            label="Recipient Org"
            value={getOrganizationName(grant.recipient_org_id)}
          />
          <DetailItem
            label="Status"
            value={statusLabels[grant.status] ?? grant.status}
          />
          <DetailItem
            label="Consent Method"
            value={
              consentMethodLabels[grant.consent_method] ?? grant.consent_method
            }
          />
          <DetailItem label="Purpose" value={grant.purpose} />
          <DetailItem label="Created" value={formatDate(grant.created_at)} />
          <DetailItem
            label="Granted By Patient"
            value={formatDate(grant.granted_by_patient_at)}
          />
          <DetailItem label="Expires" value={formatDate(grant.expires_at)} />
          <DetailItem label="Updated" value={formatDate(grant.updated_at)} />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
          {!isSourceOrg && !terminalStatuses.has(grant.status) && (
            <p className="mr-auto max-w-sm text-xs leading-5 text-amber-700">
              Only the sending/source hospital can revoke this permission.
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600"
          >
            Close
          </button>
          {canRevoke && (
            <button
              type="button"
              onClick={onRevoke}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Revoke Access
            </button>
          )}
        </div>
    </DialogPortal>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
      <p className="mt-2 break-words text-sm font-medium text-gray-800">
        {value || "N/A"}
      </p>
    </div>
  );
}

function RevokeConfirmModal({
  grant,
  revoking,
  onClose,
  onConfirm,
}: {
  grant: DataShareGrant;
  revoking: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <DialogPortal
      title="Revoke access?"
      isOpen
      onClose={onClose}
      panelClassName="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      dismissible={!revoking}
    >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Revoke access?</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          This will stop the receiving hospital from using this permission to
          access the selected patient records. Grant {grant.id.slice(0, 8)} will
          be marked as Revoked.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={revoking}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={revoking}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-red-300"
          >
            {revoking && <Loader2 size={16} className="animate-spin" />}
            Revoke Access
          </button>
        </div>
    </DialogPortal>
  );
}
