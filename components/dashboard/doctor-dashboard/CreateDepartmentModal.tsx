'use client'

import { useState } from 'react'
import Modal from '@components/Modal'
import { Input, FieldLabel } from '@components/Field'
import Button from '@components/Button'
import { authService, PatientService } from '@services/api'

interface CreateDepartmentModalProps {
  open: boolean
  onClose: () => void
  onDepartmentCreated: (dept: { id: string; name: string }) => void
}

export function CreateDepartmentModal({ open, onClose, onDepartmentCreated }: CreateDepartmentModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)

    try {
      const workspace = JSON.parse(localStorage.getItem("activeWorkspace") || "{}")
      const orgId = workspace.id

      const res = await PatientService.createDepartment(orgId, { name })
      onDepartmentCreated(res.data)
      setName('')
      onClose()
    } catch (error) {
      console.error('Failed to create department', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Create Department" isOpen={open} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="deptName">Department Name</FieldLabel>
          <Input
            id="deptName"
            placeholder="Enter department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full border px-6 py-2.5 text-sm font-medium">
            Cancel
          </button>
          <Button
            type="button"
            onSubmitHandler={handleSubmit}
            disabled={loading}
            className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Department'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

