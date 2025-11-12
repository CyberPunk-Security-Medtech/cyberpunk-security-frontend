'use client'

import { StatusBadge } from "@components/StatusBadge"

const vitals=[
{label:'Blood Pressure', value:'120/80 mmHg', status:'Normal'},
{label:'Temperature', value:'36.8 °C', status:'High'},
{label:'Heart Rate', value:'72 bpm', status:'Low'},
{label:'Weight', value:'70 kg', status:'High'},
{label:'Sugar Level', value:'96 mmol/L', status:'High'}
]
export default function PatientHeader(){
return(
<div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
<button onClick={()=>history.back()} className="mb-4 text-sm font-medium text-brand-navy hover:underline">← Back to Patients List</button>
<div className="flex items-center gap-4 mb-6">
<div className="h-14 w-14 rounded-full bg-[#E3F7F5] grid place-items-center text-brand-teal font-semibold">BH</div>
<div>
<h3 className="text-lg font-semibold text-brand-navy">Brandon Herwitz</h3>
<p className="text-sm text-gray-500">PID: <span className="text-brand-teal">SMC0400</span></p>
</div>
</div>
<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
{vitals.map((v)=> (
<div key={v.label} className="border rounded-lg p-4 text-center">
<p className="font-semibold text-brand-navy">{v.value}</p>
<p className="text-sm text-gray-500">{v.label}</p>
<div className="mt-2"><StatusBadge status={v.status as any}/></div>
</div>
))}
</div>
</div>
)
}