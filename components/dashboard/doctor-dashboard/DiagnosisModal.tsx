import Modal from '@components/Modal'
import { FieldLabel, Input, Textarea } from '@components/Field'


export function DiagnosisModal({open,onClose}:{open:boolean,onClose:()=>void}){
return(
<Modal title="Create Diagnosis" isOpen={open} onClose={onClose}>
<form className="space-y-6">
<div>
<FieldLabel htmlFor="pdx">Primary Diagnosis</FieldLabel>
<Input id="pdx" placeholder="Enter primary diagnosis"/>
</div>
<div>
<FieldLabel htmlFor="sdx">Secondary Diagnosis</FieldLabel>
<Input id="sdx" placeholder="Enter secondary diagnosis"/>
</div>
<div>
<FieldLabel htmlFor="obs">Symptoms / Observations</FieldLabel>
<Textarea id="obs" rows={6} placeholder="Enter Symptoms / Observations..."/>
</div>
<div className="flex justify-end gap-3">
<button type="button" onClick={onClose} className="rounded-full border px-6 py-2.5 text-sm font-medium">Cancel</button>
<button className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white">Create Diagnosis</button>
</div>
</form>
</Modal>
)
}