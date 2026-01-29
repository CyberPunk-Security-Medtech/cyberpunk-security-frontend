
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { consultationService } from '@services/api'

interface ConsultationContextType {
    isConsultationActive: boolean
    consultationStatus: 'idle' | 'starting' | 'active'
    currentVisitId: string | null
    startConsultation: (visitId: string) => Promise<void>
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined)

export function ConsultationProvider({ children }: { children: ReactNode }) {
    const [consultationStatus, setConsultationStatus] = useState<'idle' | 'starting' | 'active'>('idle')
    const [currentVisitId, setCurrentVisitId] = useState<string | null>(null)

    const isConsultationActive = consultationStatus === 'active'

    const startConsultation = async (visitId: string) => {
        setConsultationStatus('starting')

        // Simulate network delay
        setTimeout(() => {
            setConsultationStatus('active')
            setCurrentVisitId(visitId)
        }, 800)
    }

    return (
        <ConsultationContext.Provider value={{
            isConsultationActive,
            currentVisitId,
            startConsultation,
            consultationStatus
        }}>
            {children}
        </ConsultationContext.Provider>
    )
}

export function useConsultation() {
    const context = useContext(ConsultationContext)
    if (context === undefined) {
        throw new Error('useConsultation must be used within a ConsultationProvider')
    }
    return context
}
