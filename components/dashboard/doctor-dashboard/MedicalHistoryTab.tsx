'use client'

import { useState } from 'react'
import { StatusBadge } from '@components/StatusBadge'
import { DiagnosisModal } from './DiagnosisModal'
import Button from '@components/Button'
import { useConsultation } from './ConsultationContext'
import { consultationService } from '@services/api'

const rows = [
  {
    condition: 'Hypertension, High Cholesterol',
    doctor: 'Wilson Francis',
    role: 'General Doctor',
    date: '10 Oct 2025',
    status: 'Active',
  },
  {
    condition: 'Hypertension, High Cholesterol',
    doctor: 'Wilson Francis',
    role: 'General Doctor',
    date: '10 Oct 2025',
    status: 'Resolved',
  },
  {
    condition: 'Hypertension, High Cholesterol',
    doctor: 'Wilson Francis',
    role: 'General Doctor',
    date: '10 Oct 2025',
    status: 'Resolved',
  },
]

export default function MedicalHistoryTab() {
  const [open, setOpen] = useState(false)

  const { isConsultationActive, currentVisitId } = useConsultation()
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const handleSaveNote = async () => {
    if (!currentVisitId || !note.trim()) return

    setSavingNote(true)
    try {
      await consultationService.addNote(currentVisitId, note)
      setNote('')
      // In a real app we'd refresh the activity log here
    } catch (error) {
      console.error("Failed to save note", error)
    } finally {
      setSavingNote(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      {/* Left: Medical History */}
      <section className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1A2380]">Medical History</h3>
          <button
            onClick={() => setOpen(true)}
            disabled={!isConsultationActive}
            className={`rounded-md px-4 py-2.5 text-sm font-medium text-white transition ${isConsultationActive
              ? 'bg-[#1A2380] hover:bg-[#00B8A8]'
              : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            + Add Diagnosis
          </button>
        </div>

        <div className="space-y-4">
          {rows.map((h, index) => (
            <div
              key={`${h.condition}-${h.date}-${index}`}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <h4 className="font-medium text-[#1A2380]">{h.condition}</h4>
                <p className="text-xs text-gray-500">
                  {h.doctor} — {h.role}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs text-gray-500">{h.date}</p>
                <StatusBadge status={h.status as any} />
              </div>
            </div>
          ))}
        </div>

        <DiagnosisModal
          open={open}
          onClose={() => setOpen(false)}
          visitId={currentVisitId}
        />
      </section>

      {/* Right: Doctor’s Note */}
      <section className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#1A2380] mb-4">Doctor’s Note</h3>

        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://randomuser.me/api/portraits/men/65.jpg"
            alt="doctor"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-[#1A2380]">Wilson Francis</p>
            <p className="text-xs text-gray-500">General Doctor</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Lorem ipsum dolor sit amet consectetur. Arcu donec massa consequat interdum magna mattis
          amet non malesuada. Eu quis ipsum vestibulum adipiscing fringilla lectus eget.
        </p>

        <textarea
          placeholder={isConsultationActive ? "Add Note" : "Start consultation to add notes"}
          disabled={!isConsultationActive}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-gray-200 rounded-md p-3 text-sm focus:ring-1 focus:ring-[#00B8A8] outline-none resize-none disabled:bg-gray-50"
          rows={3}
        />

        <div className="flex justify-end mt-4">
          <Button
            type='button'
            onSubmitHandler={handleSaveNote}
            disabled={!isConsultationActive || savingNote || !note.trim()}
            className="bg-[#1A2380] text-white px-4 py-2 rounded-md hover:bg-[#00B8A8] transition text-sm disabled:opacity-50 disabled:bg-gray-300"
          >
            {savingNote ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </section>
    </div>
  )
}
