'use client'

import { useEffect, useState } from 'react'
import Modal from '@components/Modal'
import { FieldLabel, Textarea, Select } from '@components/Field'
import Button from '@components/Button'
import { organizationService, patientService, PatientService } from '@services/api'
import { toast } from 'react-toastify'
import { getApiErrorMessage } from '@utils/apiError'

interface CreateConsultationModalProps {
  open: boolean
  onClose: () => void
  // Optional: pass a patient when the modal is opened from a patient
  // page. When omitted (queue page), a patient selector is shown.
  patientId?: string | null
  onCreated: (consultationId: string) => void
}

type Department = {
  id: string
  name: string
}

type PatientOption = {
  id: string
  patient_code: string | null
  first_name: string | null
  last_name: string | null
}

export function CreateConsultationModal({ open, onClose, patientId, onCreated }: CreateConsultationModalProps) {
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [patients, setPatients] = useState<PatientOption[]>([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [form, setForm] = useState({
    department_id: '',
    reason_for_visit: '',
    priority: 'Routine',
    vitals: ''
  })

  // Patient picker is only needed when no patient was passed in.
  const needsPatientSelection = !patientId

  useEffect(() => {
    const fetchOptions = async () => {
      if (!open) return

      const workspace = JSON.parse(localStorage.getItem('activeWorkspace') || '{}')
      const orgId = workspace?.id
      if (!orgId) {
        setDepartments([])
        setPatients([])
        return
      }

      setLoadingDepartments(true)
      setLoadingPatients(needsPatientSelection)
      try {
        const [departmentsData, patientsData] = await Promise.all([
          organizationService.getDepartments(orgId),
          needsPatientSelection ? patientService.getPatients(orgId) : Promise.resolve(null),
        ])
        setDepartments(Array.isArray(departmentsData) ? departmentsData : [])
        if (Array.isArray(patientsData)) {
          setPatients(patientsData as PatientOption[])
        }
      } catch (error) {
        console.error('Failed to load consultation options', error)
        setDepartments([])
        setPatients([])
        toast.error('Could not load form options. Please try again.')
      } finally {
        setLoadingDepartments(false)
        setLoadingPatients(false)
      }
    }

    fetchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, needsPatientSelection])

  const patientOptions = patients
    .map((patient) => ({
      id: patient.id,
      label: `${patient.first_name ?? ''} ${patient.last_name ?? ''}`.trim() || 'Unknown Patient',
      patient_code: patient.patient_code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const handleSubmit = async () => {
    const workspace = JSON.parse(localStorage.getItem('activeWorkspace') || '{}')
    const orgId = workspace?.id
    const effectivePatientId = patientId ?? selectedPatientId
    if (!orgId || !effectivePatientId) {
      toast.error('Please select a patient before creating the consultation.')
      return
    }

    setLoading(true)
    try {
      const res = await PatientService.createConsultation(orgId, {
        patient_id: effectivePatientId,
        ...form
      })
      const consultationId = res.data.id
      onCreated(consultationId)
      setForm({ department_id: '', reason_for_visit: '', priority: 'Routine', vitals: '' })
      setSelectedPatientId('')
      onClose()
      toast.success('Consultation created')
    } catch (err) {
      console.error('Failed to create consultation', err)
      toast.error(getApiErrorMessage(err, 'Failed to create consultation. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Create Consultation"
      isOpen={open}
      onClose={onClose}
      headerClassName="bg-[#003C36]"
    >
      <form className="space-y-6">
        {needsPatientSelection && (
          <div>
            <FieldLabel htmlFor="patient">Patient</FieldLabel>
            <Select
              id="patient"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              <option value="">
                {loadingPatients ? 'Loading patients...' : 'Select Patient'}
              </option>
              {patientOptions.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.label}
                  {patient.patient_code ? ` (${patient.patient_code})` : ''}
                </option>
              ))}
            </Select>
            {!loadingPatients && patientOptions.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">
                No patients found. Create a patient record first.
              </p>
            )}
          </div>
        )}

        <div>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <Select
            id="department"
            value={form.department_id}
            onChange={(e) => setForm({ ...form, department_id: e.target.value })}
          >
            <option value="">
              {loadingDepartments ? 'Loading departments...' : 'Select Department'}
            </option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </Select>
          {!loadingDepartments && departments.length === 0 && (
            <p className="mt-1 text-xs text-gray-500">
              No departments found. Ask an admin to create departments from the admin dashboard.
            </p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="reason">Reason for Visit</FieldLabel>
          <Textarea
            id="reason"
            rows={4}
            placeholder="e.g. Persistent headache and dizziness for 3 days"
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
            placeholder="e.g. BP 120/80, temp 37.1°C"
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
            disabled={
              loading ||
              !form.reason_for_visit ||
              !form.department_id ||
              departments.length === 0 ||
              (needsPatientSelection && !selectedPatientId)
            }
            className="rounded-full bg-[#006B5F] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005249] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8A8] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Consultation'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
