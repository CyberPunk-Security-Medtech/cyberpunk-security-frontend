'use client'
import { useState } from 'react'
import Modal from '@components/Modal'
import { FieldLabel, Input, Select, Textarea } from '@components/Field'
import {StatusBadge} from '@components/StatusBadge'

const tests=[
{ name:'Complete Blood Count', dept:'Hematology', urgency:'Urgent', status:'Abnormal', done:'Completed' },
{ name:'Urinalysis', dept:'Microbiology', urgency:'', status:'Pending', done:'' },
{ name:'Complete Blood Count', dept:'Hematology', urgency:'Urgent', status:'Normal', done:'Completed' },
]

export default function LabTestTab(){
const [open,setOpen]=useState(false)
return(
<section className="bg-white rounded-lg border shadow-sm p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="text-lg font-semibold text-brand-navy">Lab Test</h3>
<button onClick={()=>setOpen(true)} className="rounded-md bg-brand-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-[#141a66]">+ Order Lab Test</button>
</div>
<div className="space-y-3">
{tests.map((t)=> (
<div key={t.name+t.status} className="flex items-center justify-between rounded-xl border px-4 py-4">
<div className="min-w-0">
<p className="truncate font-medium text-brand-navy">{t.name}</p>
<p className="text-xs text-gray-500">{t.dept}</p>
</div>
<div className="flex items-center gap-3">
{t.urgency && <span className="rounded-full bg-[#FFEBEC] px-2.5 py-1 text-xs font-medium text-[#CC1820]">{t.urgency}</span>}
<StatusBadge status={t.status as any}/>
{t.done && <StatusBadge status={t.done as any}/>}
<button className="rounded-full border px-4 py-2 text-sm font-medium">View Details</button>
</div>
</div>
))}
</div>
<Modal title="Order New Test" isOpen={open} onClose={()=>setOpen(false)}>
<form className="space-y-6">
<div>
<FieldLabel>Test Name</FieldLabel>
<Input placeholder="Enter Test Name"/>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<FieldLabel>Test Category</FieldLabel>
<Select defaultValue=""><option value='' disabled>Select Test Category</option><option>Hematology</option><option>Microbiology</option><option>Radiology</option></Select>
</div>
<div>
<FieldLabel>Priority</FieldLabel>
<Select defaultValue=""><option value='' disabled>Select Priority</option><option>Routine</option><option>Urgent</option><option>Stat</option></Select>
</div>
</div>
<div>
<FieldLabel>Clinical Notes / Reason</FieldLabel>
<Textarea rows={5} placeholder="Write Special Instructions"/>
</div>
<div className="flex justify-end gap-3 pt-2">
<button type="button" onClick={()=>setOpen(false)} className="rounded-full border px-6 py-2.5 text-sm font-medium">Cancel</button>
<button className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white">Submit Test Request</button>
</div>
</form>
</Modal>
</section>
)
}