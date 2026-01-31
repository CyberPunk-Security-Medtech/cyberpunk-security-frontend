import { useState } from 'react'
import { consultationService } from '@services/api'
import Modal from '@components/Modal'
import { FieldLabel, Input, Textarea } from '@components/Field'
import Button from '@components/Button'

interface DiagnosisModalProps {
    open: boolean
    onClose: () => void
    visitId: string | null
}

export function DiagnosisModal({ open, onClose, visitId }: DiagnosisModalProps) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        pdx: '',
        sdx: '',
        obs: ''
    })

    const handleSubmit = async () => {
        if (!visitId) return
        setLoading(true)
        try {
            await consultationService.addDiagnosis(visitId, {
                primary_diagnosis: form.pdx,
                secondary_diagnosis: form.sdx,
                observation: form.obs
            })
            onClose()
            setForm({ pdx: '', sdx: '', obs: '' })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal title="Create Diagnosis" isOpen={open} onClose={onClose}>
            <form className="space-y-6">
                <div>
                    <FieldLabel htmlFor="pdx">Primary Diagnosis</FieldLabel>
                    <Input
                        id="pdx"
                        placeholder="Enter primary diagnosis"
                        value={form.pdx}
                        onChange={(e) => setForm({ ...form, pdx: e.target.value })}
                    />
                </div>
                <div>
                    <FieldLabel htmlFor="sdx">Secondary Diagnosis</FieldLabel>
                    <Input
                        id="sdx"
                        placeholder="Enter secondary diagnosis"
                        value={form.sdx}
                        onChange={(e) => setForm({ ...form, sdx: e.target.value })}
                    />
                </div>
                <div>
                    <FieldLabel htmlFor="obs">Symptoms / Observations</FieldLabel>
                    <Textarea
                        id="obs"
                        rows={6}
                        placeholder="Enter Symptoms / Observations..."
                        value={form.obs}
                        onChange={(e) => setForm({ ...form, obs: e.target.value })}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-full border px-6 py-2.5 text-sm font-medium">Cancel</button>
                    <Button
                        type="button"
                        onSubmitHandler={handleSubmit}
                        disabled={loading || !visitId}
                        className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Diagnosis'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}