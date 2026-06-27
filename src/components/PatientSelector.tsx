import type { Patient } from '../types'
import { calcAge, calcAgeJa } from '../utils/dateHelpers'

const AVATARS: Record<string, string> = {
  husband: '👨',
  daughter1: '👧',
  daughter2: '👧',
  son: '👦',
  other: '🧑',
}

interface Props {
  patients: Patient[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PatientSelector({ patients, selectedId, onSelect }: Props) {
  return (
    <div className="section">
      <div className="section-title">
        <span className="step-badge">1</span>
        患者を選択 / Select Patient
      </div>
      <div className="patient-grid">
        {patients.map(p => (
          <div
            key={p.id}
            className={`patient-card ${selectedId === p.id ? 'selected' : ''}`}
            onClick={() => onSelect(p.id)}
          >
            <div className="avatar">{AVATARS[p.id] ?? '🧑'}</div>
            <div className="name-ja">{p.nameJa}</div>
            {p.birthDate && (
              <div className="age">{calcAgeJa(p.birthDate)} / {calcAge(p.birthDate)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
