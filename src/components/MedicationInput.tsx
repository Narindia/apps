import type { MedicationTaken } from '../types'
import { COMMON_OTCS } from '../data/symptoms'
import { generateId } from '../utils/storage'
import { nowISOLocal } from '../utils/dateHelpers'

interface Props {
  medications: MedicationTaken[]
  onChange: (meds: MedicationTaken[]) => void
}

export function MedicationInput({ medications, onChange }: Props) {
  const add = (prefill?: Partial<MedicationTaken>) => {
    onChange([
      ...medications,
      {
        id: generateId(),
        nameEn: '',
        nameJa: '',
        dose: '',
        timesTaken: '1回',
        lastTakenAt: nowISOLocal(),
        isRegular: false,
        ...prefill,
      },
    ])
  }

  const remove = (id: string) => {
    onChange(medications.filter(m => m.id !== id))
  }

  const update = (id: string, field: keyof MedicationTaken, value: string | boolean) => {
    onChange(medications.map(m => (m.id === id ? { ...m, [field]: value } : m)))
  }

  return (
    <div className="section">
      <div className="section-title">
        <span className="step-badge">4</span>
        服用した薬 / Medications Already Taken
      </div>
      <p className="hint">病院に来る前に飲んだ薬を記録してください。</p>

      <div className="otc-quick">
        {COMMON_OTCS.map(otc => (
          <button
            key={otc.nameEn}
            className="otc-quick-btn"
            onClick={() =>
              add({
                nameEn: otc.nameEn,
                nameJa: otc.nameJa,
                dose: otc.dose,
              })
            }
          >
            ＋ {otc.nameJa}
          </button>
        ))}
      </div>

      {medications.map((med, idx) => (
        <div key={med.id} className="med-entry">
          <div className="med-entry-header">
            <span>薬 {idx + 1}</span>
            <button className="btn-remove" onClick={() => remove(med.id)}>✕</button>
          </div>
          <div className="med-entry-row">
            <input
              placeholder="薬品名（英語）/ Drug name (EN)"
              value={med.nameEn}
              onChange={e => update(med.id, 'nameEn', e.target.value)}
            />
            <input
              placeholder="薬品名（日本語）/ Drug name (JA)"
              value={med.nameJa}
              onChange={e => update(med.id, 'nameJa', e.target.value)}
            />
          </div>
          <div className="med-entry-row">
            <input
              placeholder="用量 / Dose (e.g. 500mg)"
              value={med.dose}
              onChange={e => update(med.id, 'dose', e.target.value)}
            />
            <input
              placeholder="回数 / Times taken (e.g. 2回)"
              value={med.timesTaken}
              onChange={e => update(med.id, 'timesTaken', e.target.value)}
            />
          </div>
          <div className="med-full-row">
            <input
              type="datetime-local"
              value={med.lastTakenAt}
              onChange={e => update(med.id, 'lastTakenAt', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius-sm)', fontSize: 13, fontFamily: 'inherit' }}
            />
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={() => add()}>
        ＋ 薬を追加 / Add Medication
      </button>
    </div>
  )
}
