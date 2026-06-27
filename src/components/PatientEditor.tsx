import { useState } from 'react'
import type { Patient, Medication } from '../types'
import { generateId } from '../utils/storage'
import { calcAge } from '../utils/dateHelpers'

interface Props {
  patients: Patient[]
  onSave: (patients: Patient[]) => void
}

function MedForm({
  med,
  onChange,
  onRemove,
}: {
  med: Medication
  onChange: (m: Medication) => void
  onRemove: () => void
}) {
  return (
    <div className="med-entry">
      <div className="med-entry-header">
        <span>💊 常備薬</span>
        <button className="btn-remove" onClick={onRemove}>✕</button>
      </div>
      <div className="med-entry-row">
        <input
          placeholder="薬品名（英語）Drug name EN"
          value={med.nameEn}
          onChange={e => onChange({ ...med, nameEn: e.target.value })}
        />
        <input
          placeholder="薬品名（日本語）"
          value={med.nameJa}
          onChange={e => onChange({ ...med, nameJa: e.target.value })}
        />
      </div>
      <div className="med-entry-row">
        <input
          placeholder="用量 Dose (e.g. 5mg daily)"
          value={med.dose}
          onChange={e => onChange({ ...med, dose: e.target.value })}
        />
        <input
          placeholder="目的（英語）Purpose EN"
          value={med.purposeEn}
          onChange={e => onChange({ ...med, purposeEn: e.target.value })}
        />
      </div>
      <input
        placeholder="目的（日本語）Purpose JA"
        value={med.purposeJa}
        onChange={e => onChange({ ...med, purposeJa: e.target.value })}
        className="med-full-input"
      />
    </div>
  )
}

function PatientForm({
  patient,
  onChange,
  onDone,
  onDelete,
}: {
  patient: Patient
  onChange: (p: Patient) => void
  onDone: () => void
  onDelete: () => void
}) {
  const addMed = () => {
    onChange({
      ...patient,
      regularMedications: [
        ...patient.regularMedications,
        { nameEn: '', nameJa: '', dose: '', purposeEn: '', purposeJa: '' },
      ],
    })
  }

  const updateMed = (idx: number, med: Medication) => {
    const meds = [...patient.regularMedications]
    meds[idx] = med
    onChange({ ...patient, regularMedications: meds })
  }

  const removeMed = (idx: number) => {
    onChange({ ...patient, regularMedications: patient.regularMedications.filter((_, i) => i !== idx) })
  }

  return (
    <>
      <div className="section">
        <div className="section-title">メンバー情報 / Member Info</div>
        <div className="form-field">
          <label>名前（日本語）</label>
          <input
            placeholder="例：長女、夫"
            value={patient.nameJa}
            onChange={e => onChange({ ...patient, nameJa: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Name (English)</label>
          <input
            placeholder="e.g. Eldest Daughter"
            value={patient.nameEn}
            onChange={e => onChange({ ...patient, nameEn: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>生年月日 / Birth Date</label>
          <input
            type="date"
            value={patient.birthDate}
            onChange={e => onChange({ ...patient, birthDate: e.target.value })}
          />
        </div>
        <div className="form-field-row">
          <div className="form-field" style={{ flex: 1 }}>
            <label>血液型 / Blood Type</label>
            <select
              value={patient.bloodType ?? ''}
              onChange={e => onChange({ ...patient, bloodType: e.target.value })}
            >
              <option value="">不明 / Unknown</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="O">O</option>
              <option value="AB">AB</option>
            </select>
          </div>
        </div>
        <div className="form-field">
          <label>アレルギー / Allergies</label>
          <input
            placeholder="e.g. Penicillin / None known"
            value={patient.allergies ?? ''}
            onChange={e => onChange({ ...patient, allergies: e.target.value })}
          />
        </div>
      </div>

      <div className="section">
        <div className="section-title">常備薬 / Regular Medications</div>
        <p className="hint">定期的に服用している薬。カード作成時に自動表示されます。</p>
        {patient.regularMedications.map((med, idx) => (
          <MedForm
            key={idx}
            med={med}
            onChange={m => updateMed(idx, m)}
            onRemove={() => removeMed(idx)}
          />
        ))}
        <button className="btn-add" onClick={addMed}>
          ＋ 常備薬を追加 / Add Medication
        </button>
      </div>

      <div className="section">
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onDone}>
            ← リストに戻る
          </button>
          <button
            className="btn-secondary"
            style={{ color: 'var(--red)', borderColor: 'var(--red)', flex: '0 0 auto', padding: '12px 16px' }}
            onClick={() => {
              if (window.confirm('このメンバーを削除しますか？\nDelete this member?')) onDelete()
            }}
          >
            🗑 削除
          </button>
        </div>
      </div>
    </>
  )
}

function getAvatar(p: Patient): string {
  if (p.id === 'husband') return '👨'
  if (p.id.startsWith('daughter')) return '👧'
  if (p.id === 'son') return '👦'
  if (p.id === 'other') return '🧑'
  const nameEn = p.nameEn.toLowerCase()
  if (nameEn.includes('boy') || nameEn.includes('son') || nameEn.includes('father') || nameEn.includes('husband')) return '👦'
  if (nameEn.includes('girl') || nameEn.includes('daughter') || nameEn.includes('mother') || nameEn.includes('wife')) return '👧'
  return '🧑'
}

export function PatientEditor({ patients, onSave }: Props) {
  const [list, setList] = useState<Patient[]>(patients)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editing = editingId ? (list.find(p => p.id === editingId) ?? null) : null

  const updatePatient = (updated: Patient) => {
    setList(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  const addPatient = () => {
    const newP: Patient = {
      id: generateId(),
      nameEn: '',
      nameJa: '新しいメンバー',
      birthDate: '',
      bloodType: '',
      allergies: '',
      regularMedications: [],
    }
    setList(prev => [...prev, newP])
    setEditingId(newP.id)
  }

  const deletePatient = (id: string) => {
    setList(prev => prev.filter(p => p.id !== id))
    setEditingId(null)
  }

  if (editing) {
    return (
      <PatientForm
        patient={editing}
        onChange={updatePatient}
        onDone={() => setEditingId(null)}
        onDelete={() => deletePatient(editing.id)}
      />
    )
  }

  return (
    <>
      <div className="section">
        <div className="section-title">家族メンバー管理 / Manage Family Members</div>
        <p className="hint">タップして情報・常備薬を編集できます。</p>
        {list.map(p => (
          <div key={p.id} className="profile-row" onClick={() => setEditingId(p.id)}>
            <div className="profile-avatar">{getAvatar(p)}</div>
            <div className="profile-info">
              <div className="profile-name-en">{p.nameEn || '（名前未入力）'}</div>
              <div className="profile-name-ja">{p.nameJa}</div>
              <div className="profile-meta">
                {p.birthDate ? calcAge(p.birthDate) : '生年月日未入力'}
                {p.regularMedications.length > 0 && ` · 💊 ${p.regularMedications.length}件`}
                {p.allergies && p.allergies !== 'None known' && p.allergies !== '' && (
                  <span style={{ color: 'var(--red)', marginLeft: 4 }}>· ⚠ アレルギーあり</span>
                )}
              </div>
            </div>
            <div className="profile-arrow">›</div>
          </div>
        ))}
        <button className="btn-add" style={{ marginTop: 12 }} onClick={addPatient}>
          ＋ メンバーを追加 / Add Member
        </button>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <button className="btn-primary" onClick={() => onSave(list)}>
          保存して戻る / Save & Return
        </button>
      </div>
    </>
  )
}
