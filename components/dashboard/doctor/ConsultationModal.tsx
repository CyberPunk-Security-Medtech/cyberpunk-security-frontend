'use client'

import { useEffect, useState } from 'react'
import Modal from '@components/Modal'
import { FieldLabel, Textarea, Select } from '@components/Field'
import Button from '@components/Button'
import { organizationService, PatientService } from '@services/api'
import { useAuth } from '@context/AuthContext'

interface CreateConsultationModalProps {
  open: boolean
  onClose: () => void
  patientId: string
  onCreated: (consultationId: string) => void
}

type Department = {
  id: string
  name: string
}

export function CreateConsultationModal({ open, onClose, patientId, onCreated }: CreateConsultationModalProps) {
  const { activeWorkspace } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [doctorDepartment, setDoctorDepartment] = useState<Department | null>(null)
  const [form, setForm] = useState({
     department_id: '',
    reason_for_visit: '',
    priority: 'Routine',
    vitals: '',
  })

  useEffect(() => {
    const fetchDoctorDepartment = async() => {
      if (!open) return

      const workspace = JSON.parse(localStorage.getItem("activeWorkspace") || "{}")
      const orgId = activeWorkspace?.id ?? workspace?.id
      if (!orgId) return;

      setLoadingDepartments(true);

      try {
        const membership = await organizationService.getMyMembership(orgId);
        const department = membership?.department ?? null;
        setDoctorDepartment(department);
        setForm((current) => ({
          ...current,
          department_id: department?.id ?? '',
        }));
      } catch (error) {
        console.error("Failed to fetch doctor's department", error);
        setDoctorDepartment(null);
        setForm((current) => ({
          ...current,
          department_id: '',
        }));
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDoctorDepartment();
  }, [activeWorkspace?.id, open]);

  const handleSubmit = async () => {
    const workspace = JSON.parse(localStorage.getItem("activeWorkspace") || "{}")
    const orgId = activeWorkspace?.id ?? workspace?.id
    if (!orgId || !patientId || !form.department_id) return

    setLoading(true)
    try {
      const res = await PatientService.createConsultation(orgId, {
        patient_id: patientId,
        ...form
      })
      const consultationId = res.data.id
      onCreated(consultationId)
      setForm({ department_id: '', reason_for_visit: '', priority: 'Routine', vitals: '' })
      onClose()
    } catch (err) {
      console.error("Failed to create consultation", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Create Consultation" isOpen={open} onClose={onClose}>
      <form className="space-y-6">
        <div>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <div
            id="department"
            className="rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700"
          >
            <span className="font-medium">Department:</span>{" "}
            {loadingDepartments
              ? "Loading..."
              : doctorDepartment?.name ?? "No department assigned"}
          </div>
          {!loadingDepartments && !form.department_id && (
            <p className="mt-1 text-xs text-gray-500">
              Your account has no department assigned. Ask an admin to update
              your invitation or membership.
            </p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="reason">Reason for Visit</FieldLabel>
          <Textarea
            id="reason"
            rows={4}
            placeholder="Enter reason for visit"
            value={form.reason_for_visit}
            onChange={(e) => setForm({ ...form, reason_for_visit: e.target.value })}
          />
        </div>

        <div>
          <FieldLabel htmlFor="priority">Priority</FieldLabel>
          <Select
            id="priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="Emergency">Emergency</option>
          </Select>
        </div>

        <div>
          <FieldLabel htmlFor="vitals">Vitals / Notes</FieldLabel>
          <Textarea
            id="vitals"
            rows={3}
            placeholder="Enter vitals or notes"
            value={form.vitals}
            onChange={(e) => setForm({ ...form, vitals: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-6 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <Button
            type="button"
            onSubmitHandler={handleSubmit}
            disabled={loading || !form.reason_for_visit || !form.department_id}
            className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Consultation'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
