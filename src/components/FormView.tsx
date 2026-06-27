import { useState } from 'react'
import type { Patient, SymptomEntry, SelectedSymptom, TimelineEntry, MedicationTaken } from '../types'
import { PatientSelector } from './PatientSelector'
import { SymptomChips } from './SymptomChips'
import { TimelineInput } from './TimelineInput'
import { MedicationInput } from './MedicationInput'
import { SelfAssessment } from './SelfAssessment'
import { generateId } from '../utils/storage'
import { calcAge, calcAgeJa } from '../utils/dateHelpers'

const AVATARS: Record<string, string> = {
  husband: '👨', daughter1: '👧', daughter2: '👧', son: '👦', other: '🧑',
}

interface Props {
  patients: Patient[]
  initialEntry?: Partial<SymptomEntry>
  onComplete: (entry: SymptomEntry) => void
}

export function FormView({ patients, initialEntry, onComplete }: Props) {
  const [patientId, setPatientId] = useState<string>(initialEntry?.patientId ?? '')
  const [symptoms, setSymptoms] = useState<SelectedSymptom[]>(initialEntry?.symptoms ?? [])
  const [temperature, setTemperature] = useState(initialEntry?.vitals?.temperature ?? '')
  const [temperatureUnknown, setTemperatureUnknown] = useState(initialEntry?.vitals?.temperatureUnknown ?? false)
  const [timeline, setTimeline] = useState<TimelineEntry[]>(initialEntry?.timeline ?? [])
  const [medications, setMedications] = useState<MedicationTaken[]>(initialEntry?.medicationsTaken ?? [])
  const [selfAssessment, setSelfAssessment] = useState(initialEntry?.selfAssessment ?? '')

  const patient = patients.find(p => p.id === patientId)

  const toggleSymptom = (key: string) => {
    setSymptoms(prev => {
      const exists = prev.find(s => s.key === key)
      if (exists) return prev.filter(s => s.key !== key)
      return [...prev, { key }]
    })
  }

  const handleGenerate = () => {
    if (!patientId || symptoms.length === 0) return
    const entry: SymptomEntry = {
      id: initialEntry?.id ?? generateId(),
      patientId,
      date: new Date().toISOString(),
      selfAssessment,
      symptoms,
      timeline,
      medicationsTaken: medications,
      vitals: {
        temperature,
        temperatureUnknown,
      },
    }
    onComplete(entry)
  }

  const canGenerate = patientId && symptoms.length > 0

  return (
    <>
      <div className="main-content">
        <PatientSelector
          patients={patients}
          selectedId={patientId}
          onSelect={setPatientId}
        />

        {patient && (
          <div className="section" style={{ paddingBottom: 0 }}>
            <div className="patient-info-card">
              <div className="patient-info-name">
                {AVATARS[patient.id] ?? '🧑'} {patient.nameEn}
                <span style={{ fontWeight: 400, fontSize: 14, marginLeft: 8, color: 'var(--gray-500)' }}>
                  / {patient.nameJa}
                </span>
              </div>
              <div className="patient-info-sub">
                {patient.birthDate && `${calcAge(patient.birthDate)} / ${calcAgeJa(patient.birthDate)}`}
                {patient.allergies && patient.allergies !== 'None known' && (
                  <span style={{ color: 'var(--red)', marginLeft: 10, fontWeight: 600 }}>
                    ⚠ アレルギー: {patient.allergies}
                  </span>
                )}
                {patient.regularMedications.length > 0 && (
                  <span style={{ marginLeft: 10 }}>
                    💊 常備薬 {patient.regularMedications.length}件
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <SymptomChips
          selected={symptoms}
          temperature={temperature}
          temperatureUnknown={temperatureUnknown}
          onToggle={toggleSymptom}
          onTemperatureChange={setTemperature}
          onTemperatureUnknown={setTemperatureUnknown}
        />

        <TimelineInput entries={timeline} onChange={setTimeline} />

        <MedicationInput medications={medications} onChange={setMedications} />

        <SelfAssessment value={selfAssessment} onChange={setSelfAssessment} />

        <div style={{ height: 100 }} />
      </div>

      <div className="generate-section">
        {!canGenerate && (
          <p className="hint" style={{ textAlign: 'center', marginBottom: 10 }}>
            {!patientId ? '① 患者を選択してください' : '② 症状を1つ以上選択してください'}
          </p>
        )}
        <button
          className="btn-primary"
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          ✚ カードを作成 / Generate Card
        </button>
      </div>
    </>
  )
}
