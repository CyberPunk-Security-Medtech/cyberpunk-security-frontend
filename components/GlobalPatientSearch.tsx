"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoaderCircle, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@context/AuthContext";
import {
  patientService,
  type PatientSearchResult,
} from "@services/api";

const getPatientPath = (pathname: string, patientId: string) => {
  if (pathname.startsWith("/dashboard/doctor")) {
    return `/dashboard/doctor/patient/${patientId}`;
  }
  if (pathname.startsWith("/dashboard/nurse")) {
    return `/dashboard/nurse/patient/${patientId}`;
  }
  if (pathname.startsWith("/dashboard/record-staff")) {
    return `/dashboard/record-staff/patient/${patientId}`;
  }
  return null;
};

export default function GlobalPatientSearch() {
  const { activeWorkspace } = useAuth();
  const pathname = usePathname();
  const regionId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const requestVersionRef = useRef(0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PatientSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const normalizedQuery = query.trim();

  useEffect(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, [pathname, activeWorkspace?.id]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const requestVersion = ++requestVersionRef.current;

    if (!activeWorkspace?.id || normalizedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const data = await patientService.searchPatients(activeWorkspace.id, {
          q: normalizedQuery,
          limit: 8,
        });
        if (requestVersion === requestVersionRef.current) {
          setResults(Array.isArray(data) ? data : []);
        }
      } catch {
        if (requestVersion === requestVersionRef.current) {
          setResults([]);
          toast.error("Patient search is unavailable. Please try again.");
        }
      } finally {
        if (requestVersion === requestVersionRef.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [activeWorkspace?.id, normalizedQuery]);

  const clearSearch = () => {
    requestVersionRef.current += 1;
    setQuery("");
    setResults([]);
    setLoading(false);
    setOpen(false);
  };

  const showPanel = open && normalizedQuery.length > 0;

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <label htmlFor="global-patient-search" className="sr-only">
        Search patients by name, phone number, email, or NIN
      </label>
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-2.5 text-gray-400"
      />
      <input
        id="global-patient-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(Boolean(event.target.value.trim()));
        }}
        onFocus={() => setOpen(Boolean(normalizedQuery))}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Search patients"
        autoComplete="off"
        maxLength={100}
        className="w-64 rounded-full border border-gray-200 py-2 pl-9 pr-9 text-sm outline-none focus:border-[#00B8A8] focus:ring-1 focus:ring-[#00B8A8] [&::-webkit-search-cancel-button]:appearance-none"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear patient search"
          className="absolute right-2 top-1.5 grid size-7 place-items-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8A8]"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}

      <p className="sr-only" aria-live="polite">
        {loading
          ? "Searching patients"
          : normalizedQuery.length >= 2 && activeWorkspace?.id
            ? `${results.length} ${results.length === 1 ? "patient" : "patients"} found`
            : ""}
      </p>

      {showPanel && (
        <div
          id={regionId}
          role="region"
          aria-label="Patient search results"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {!activeWorkspace?.id ? (
            <p className="px-4 py-4 text-sm text-slate-600">
              Select an organization workspace to search patients.
            </p>
          ) : normalizedQuery.length < 2 ? (
            <p className="px-4 py-4 text-sm text-slate-600">
              Enter at least 2 characters to search.
            </p>
          ) : loading ? (
            <p role="status" className="flex items-center gap-2 px-4 py-4 text-sm text-slate-600">
              <LoaderCircle size={17} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
              Searching patients...
            </p>
          ) : results.length === 0 ? (
            <p role="status" className="px-4 py-4 text-sm text-slate-600">
              No patients found for “{normalizedQuery}”.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-2" aria-label="Matching patients">
              {results.map((patient) => {
                const name = `${patient.first_name} ${patient.last_name}`.trim();
                const details = patient.email || patient.phone_number;
                const patientPath = getPatientPath(pathname, patient.id);
                const content = (
                  <>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#E6F8F7] text-xs font-semibold text-[#008F83]">
                      {`${patient.first_name[0] ?? ""}${patient.last_name[0] ?? ""}`.toUpperCase() || "P"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {name || "Unknown patient"}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">
                        {details}
                      </span>
                    </span>
                    {patientPath && (
                      <span className="shrink-0 text-xs font-medium text-[var(--dashboard-accent,#1A2380)]">
                        Open
                      </span>
                    )}
                  </>
                );

                return (
                  <li key={patient.id}>
                    {patientPath ? (
                      <Link
                        href={patientPath}
                        onClick={clearSearch}
                        className="flex min-h-14 items-center gap-3 px-4 py-3 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00B8A8]"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex min-h-14 items-center gap-3 px-4 py-3">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
