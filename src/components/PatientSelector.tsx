import type { Patient } from '../types'
import { calcAge, calcAgeJa } from '../utils/dateHelpers'

function getAvatar(p: Patient): string {
  if (p.id === 'husband') return '👨'
  if (p.id.startsWith('daughter')) return '👧'
  if (p.id === 'son') return '👦'
  if (p.id === 'other') return '🧑'
  const name = (p.nameJa + p.nameEn).toLowerCase()
  if (name.includes('息子') || name.includes('boy') || name.includes('son') || name.includes('father') || name.includes('夫') || name.includes('husband')) return '👦'
  if (name.includes('娘') || name.includes('girl') || name.includes('daughter') || name.includes('mother') || name.includes('妻') || name.includes('wife')) return '👧'
  return '🧑'
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

      {patients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--gray-500)' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>家族メンバーがまだ登録されていません</div>
          <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
            ヘッダー右上の <strong>⚙</strong> から家族を登録してください
          </div>
        </div>
      ) : (
        <div className="patient-grid">
          {patients.map(p => (
            <div
              key={p.id}
              className={`patient-card ${selectedId === p.id ? 'selected' : ''}`}
              onClick={() => onSelect(p.id)}
            >
              <div className="avatar">{getAvatar(p)}</div>
              <div className="name-ja">{p.nameJa}</div>
              {p.birthDate && (
                <div className="age">{calcAgeJa(p.birthDate)} / {calcAge(p.birthDate)}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
