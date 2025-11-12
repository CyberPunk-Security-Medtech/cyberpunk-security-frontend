'use client'
import { useState } from 'react'
import { classNames } from '@utils/helper'
export default function Tabs({tabs}:{tabs:{label:string,content:React.ReactNode}[]}){
  const [active,setActive] = useState(0)
  return(
    <div>
      <div className="flex border-b mb-6">
        {tabs.map((t,i)=> (
          <button key={t.label} onClick={()=>setActive(i)} className={classNames('px-5 py-2 text-sm font-medium border-b-2', active===i ? 'border-brand-navy text-brand-navy' : 'border-transparent text-gray-500 hover:text-brand-navy')}>{t.label}</button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  )
}
