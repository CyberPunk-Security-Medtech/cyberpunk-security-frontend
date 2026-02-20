'use client'
import { useState } from 'react'
import { classNames } from '@utils/helper'
export default function Tabs({tabs}:{tabs:{label:string,content:React.ReactNode}[]}){
  const [active,setActive] = useState(0)
  return(
    <div>
      <div className="mb-5 overflow-x-auto">
        <div className="inline-flex min-w-max border-b">
          {tabs.map((t,i)=> (
            <button
              key={t.label}
              onClick={()=>setActive(i)}
              className={classNames(
                'whitespace-nowrap px-3 py-2 text-xs font-medium border-b-2 sm:px-5 sm:text-sm',
                active===i ? 'border-brand-navy text-brand-navy' : 'border-transparent text-gray-500 hover:text-brand-navy'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>{tabs[active].content}</div>
    </div>
  )
}
