"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@components/Button";
import { consultationService, type ConsultationNote } from "@services/api";
import { getApiErrorMessage } from "@utils/apiError";
import { toast } from "react-toastify";
import { useConsultation } from "./ConsultationContext";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
};

export default function ConsultationNotesPanel() {
  const { orgId, selectedConsultationId } = useConsultation();
  const [notes, setNotes] = useState<ConsultationNote[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    if (!orgId || !selectedConsultationId) {
      setNotes([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await consultationService.listConsultationNotes(
        orgId,
        selectedConsultationId,
      );
      setNotes(result ?? []);
    } catch (requestError) {
      console.error("Failed to load consultation notes", requestError);
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to load the saved notes. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [orgId, selectedConsultationId]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const handleSave = async () => {
    const content = draft.trim();
    if (!orgId || !selectedConsultationId || !content || saving) return;

    setSaving(true);
    try {
      const savedNote = await consultationService.addConsultationNote(
        orgId,
        selectedConsultationId,
        content,
      );
      setNotes((current) => [...current, savedNote]);
      setDraft("");
      setError(null);
      toast.success("Note saved");
    } catch (requestError) {
      console.error("Failed to save consultation note", requestError);
      toast.error(
        getApiErrorMessage(requestError, "Unable to save the note. Please try again."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold text-[#1A2380]">Doctor&apos;s Notes</h3>
      <p className="mt-1 text-sm text-gray-500">
        Notes are saved to this consultation and shown oldest first.
      </p>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-gray-800">Saved notes</h4>

        {loading && (
          <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-500" aria-live="polite">
            Loading saved notes...
          </p>
        )}

        {!loading && error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3" role="alert">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadNotes()}
              className="mt-2 text-sm font-medium text-[#1A2380] underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <p className="mt-3 rounded-lg border border-dashed p-3 text-sm text-gray-500">
            No doctor&apos;s notes have been saved yet.
          </p>
        )}

        {!loading && !error && notes.length > 0 && (
          <ul className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
            {notes.map((note, index) => (
              <li key={note.id} className="rounded-lg border bg-gray-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#1A2380]">
                    Note {index + 1}
                  </span>
                  <time className="text-xs text-gray-500" dateTime={note.created_at}>
                    {formatDateTime(note.created_at)}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                  {note.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 border-t pt-5">
        <label htmlFor="consultation-note" className="text-sm font-semibold text-gray-800">
          Add a note
        </label>
        <textarea
          id="consultation-note"
          placeholder="Enter a clinical note"
          disabled={!selectedConsultationId || saving}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="mt-2 w-full resize-y rounded-md border border-gray-200 p-3 text-sm outline-none focus:border-[#00B8A8] focus:ring-2 focus:ring-[#00B8A8]/20 disabled:bg-gray-50"
          rows={5}
        />

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!selectedConsultationId || !draft.trim() || saving}
            className="bg-[#1A2380] text-white hover:bg-[#00B8A8] disabled:bg-gray-300"
          >
            {saving ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>
    </section>
  );
}
