import { useRef } from 'react'
import type { SymptomEntry, Patient } from '../types'
import { SYMPTOM_CHIPS } from '../data/symptoms'
import { calcAge, formatDatetime, formatDate } from '../utils/dateHelpers'
import html2canvas from 'html2canvas'

interface Props {
  entry: SymptomEntry
  patient: Patient
  onBack: () => void
  onNew: () => void
}

function calcSeverity(entry: SymptomEntry): { level: string; label: string } {
  const alertSymptoms = ['convulsion', 'consciousness', 'difficulty_breathing', 'chest_pain', 'cyanosis', 'blood_urine', 'blood_stool', 'jaundice']
  const warnSymptoms = ['fever', 'vomiting', 'diarrhea', 'abdominal_pain', 'swollen_tonsils', 'rash', 'shortness_of_breath', 'dehydration', 'numbness', 'painful_urination']
  const keys = entry.symptoms.map(s => s.key)

  if (keys.some(k => alertSymptoms.includes(k))) return { level: 'urgent', label: 'URGENT' }
  const temp = parseFloat(entry.vitals.temperature)
  if (temp >= 39.5) return { level: 'urgent', label: 'URGENT' }
  if (keys.some(k => warnSymptoms.includes(k)) || temp >= 38.5) return { level: 'high', label: 'HIGH' }
  if (temp >= 37.5 || keys.length >= 3) return { level: 'medium', label: 'MEDIUM' }
  return { level: 'low', label: 'LOW' }
}

export function SymptomCard({ entry, patient, onBack, onNew }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const severity = calcSeverity(entry)
  const visitDate = formatDate(entry.date)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Symptom Card – ${patient.nameEn}`,
          text: `Patient: ${patient.nameEn}\nDate: ${visitDate}\nSymptoms: ${entry.symptoms.map(s => {
            const chip = SYMPTOM_CHIPS.find(c => c.key === s.key)
            return chip?.labelEn ?? s.key
          }).join(', ')}`,
        })
      } catch {}
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSaveImage = async () => {
    if (!cardRef.current) return
    const actionBar = cardRef.current.querySelector('.card-actions') as HTMLElement | null
    if (actionBar) actionBar.style.display = 'none'
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f0f4f8',
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `symptom-card-${patient.nameEn.replace(/\s+/g, '-')}-${entry.date.slice(0, 10)}.png`
      a.click()
    } finally {
      if (actionBar) actionBar.style.display = ''
    }
  }

  const temp = entry.vitals.temperature
  const tempUnknown = entry.vitals.temperatureUnknown
  const hasTempReading = entry.symptoms.some(s => s.key === 'fever') && (temp || tempUnknown)

  const takenMeds = entry.medicationsTaken.filter(m => !m.isRegular)
  const regularMeds = patient.regularMedications

  return (
    <div className="card-view" ref={cardRef}>
      <div className="card-header">
        <div className="card-cross">✚</div>
        <div className="card-title-block">
          <h2>
            Medical Symptom Card
            <small>症状カード</small>
          </h2>
          <div className="card-meta">
            <span>👤 {patient.nameEn}</span>
            {patient.birthDate && <span>🎂 {calcAge(patient.birthDate)}</span>}
            <span>📅 {visitDate}</span>
          </div>
          <div style={{ marginTop: 8 }}>
            <span className={`severity-badge ${severity.level}`}>
              ⚠ {severity.label} severity
            </span>
            {patient.allergies && patient.allergies !== 'None known' && patient.allergies !== '' && (
              <span style={{ marginLeft: 8, fontSize: 12, color: '#fc8181', fontWeight: 700 }}>
                ⚠ Allergy: {patient.allergies}
              </span>
            )}
          </div>
        </div>
      </div>

      {entry.selfAssessment && (
        <div className="self-assess-block">
          <div className="self-assess-label">Patient / Caregiver Assessment</div>
          <div className="self-assess-text">{entry.selfAssessment}</div>
        </div>
      )}

      {hasTempReading && (
        <div className="card-block">
          <div className="card-block-header">🌡️ Vital Signs / バイタル</div>
          <div className="card-block-body">
            <div className="vitals-row">
              {tempUnknown ? (
                <div>
                  <div className="vital-label-en">Temperature: Not measured / 未測定</div>
                </div>
              ) : (
                <>
                  <div className="vital-value">{temp}</div>
                  <div className="vital-unit">°C</div>
                  <div>
                    <div className="vital-label-en">Body Temperature</div>
                    <div className="vital-label-ja">体温</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {(entry.symptoms.length > 0 || entry.otherSymptom) && (
        <div className="card-block">
          <div className="card-block-header">🤒 Current Symptoms / 現在の症状</div>
          <div className="card-block-body">
            <div className="card-chip-grid">
              {entry.symptoms.map(s => {
                const chip = SYMPTOM_CHIPS.find(c => c.key === s.key)
                if (!chip) return null
                const warnClass = chip.warnLevel === 'alert' ? 'alert' : chip.warnLevel === 'warn' ? 'warn' : ''
                return (
                  <div key={s.key} className={`card-chip ${warnClass}`}>
                    <span className="card-chip-icon">{chip.icon}</span>
                    <div>
                      <div className="card-chip-en">{chip.labelEn}</div>
                      <div className="card-chip-ja">{chip.labelJa}</div>
                    </div>
                  </div>
                )
              })}
              {entry.otherSymptom && (
                <div className="card-chip">
                  <span className="card-chip-icon">✏️</span>
                  <div>
                    <div className="card-chip-en">Other / その他</div>
                    <div className="card-chip-ja" style={{ fontSize: 11 }}>{entry.otherSymptom}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {entry.timeline.length > 0 && (
        <div className="card-block">
          <div className="card-block-header">📋 Symptom Timeline / 発症経過</div>
          <div className="card-block-body">
            {entry.timeline.map(t => (
              <div key={t.id} className="card-timeline-item">
                <div className="card-timeline-time">{formatDatetime(t.datetime)}</div>
                <div>
                  <div className="card-timeline-en">{t.eventEn || t.eventJa}</div>
                  {t.eventJa && t.eventEn !== t.eventJa && (
                    <div className="card-timeline-ja">{t.eventJa}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(takenMeds.length > 0 || entry.noMedicationTaken) && (
        <div className="card-block">
          <div className="card-block-header">💊 Medications Already Taken / 服用済みの薬</div>
          <div className="card-block-body" style={entry.noMedicationTaken ? {} : { padding: 0 }}>
            {entry.noMedicationTaken ? (
              <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: 14 }}>
                ✓ No medications taken before this visit / 受診前に薬は服用していません
              </div>
            ) : (
              <table className="card-med-table">
                <thead>
                  <tr>
                    <th>Drug / 薬品名</th>
                    <th>Dose / 用量</th>
                    <th>When / いつ</th>
                  </tr>
                </thead>
                <tbody>
                  {takenMeds.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div className="med-name-en">{m.nameEn || m.nameJa}</div>
                        {m.nameJa && m.nameEn && (
                          <div className="med-name-ja">{m.nameJa}</div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{m.dose}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{m.timesTaken}</div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--gray-600)' }}>
                        {m.lastTakenAt ? formatDatetime(m.lastTakenAt) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {regularMeds.length > 0 && (
        <div className="reg-med-block">
          <div className="reg-med-header">
            💚 Regular / Ongoing Medications（常備薬・定期薬）
          </div>
          <div style={{ padding: '0' }}>
            <table className="card-med-table">
              <thead>
                <tr>
                  <th>Drug / 薬品名</th>
                  <th>Dose / 用量</th>
                  <th>Purpose / 目的</th>
                </tr>
              </thead>
              <tbody>
                {regularMeds.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <div className="med-name-en">{m.nameEn}</div>
                      <div className="med-name-ja">{m.nameJa}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{m.dose}</td>
                    <td>
                      <div style={{ fontSize: 12 }}>{m.purposeEn}</div>
                      <div className="med-name-ja">{m.purposeJa}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card-footer">
        <strong>⚠ Please check for drug interactions before prescribing.</strong>
        処方前に薬の相互作用をご確認ください。
        <br />
        This card was generated on {new Date().toLocaleString('en-US')}
      </div>

      <div style={{ height: 90 }} />

      <div className="card-actions">
        <button className="btn-secondary" onClick={onBack}>
          ✏️ 編集
        </button>
        <button className="btn-secondary" onClick={handleSaveImage} title="画像として保存">
          🖼 保存
        </button>
        <button className="btn-secondary" onClick={handlePrint}>
          🖨️ 印刷
        </button>
        <button className="btn-secondary" onClick={handleShare}>
          📤 共有
        </button>
        <button className="btn-secondary" style={{ borderColor: 'var(--green)', color: 'var(--green)' }} onClick={onNew}>
          ＋ 新規
        </button>
      </div>
    </div>
  )
}
