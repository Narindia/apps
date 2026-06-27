import { useRef } from 'react'
import type { SymptomEntry, Patient } from '../types'
import { SYMPTOM_CHIPS } from '../data/symptoms'
import { calcAge, formatDatetime, formatDate } from '../utils/dateHelpers'

interface Props {
  entry: SymptomEntry
  patient: Patient
  onBack: () => void
  onNew: () => void
}

function translateEventToEn(ja: string): string {
  const map: [RegExp, string][] = [
    [/発熱|熱が出/i, 'Fever started'],
    [/嘔吐|吐い/i, 'Vomiting occurred'],
    [/下痢/i, 'Diarrhea started'],
    [/頭痛/i, 'Headache started'],
    [/腹痛/i, 'Abdominal pain started'],
    [/咳/i, 'Cough started'],
    [/鼻水/i, 'Runny nose started'],
    [/喉/i, 'Sore throat started'],
    [/発疹/i, 'Rash appeared'],
    [/けいれん/i, 'Convulsion occurred'],
    [/食欲/i, 'Loss of appetite noted'],
    [/倦怠感/i, 'Fatigue noted'],
    [/解熱|熱が下/i, 'Fever subsided'],
    [/救急/i, 'Emergency evaluation'],
    [/受診/i, 'Medical consultation'],
  ]
  for (const [re, en] of map) {
    if (re.test(ja)) return en
  }
  return ja
}

function calcSeverity(entry: SymptomEntry): { level: string; label: string } {
  const alertSymptoms = ['convulsion', 'consciousness', 'difficulty_breathing']
  const warnSymptoms = ['fever', 'vomiting', 'diarrhea', 'abdominal_pain', 'swollen_tonsils', 'rash']
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

  const temp = entry.vitals.temperature
  const tempUnknown = entry.vitals.temperatureUnknown
  const hasTempReading = entry.symptoms.some(s => s.key === 'fever') && (temp || tempUnknown)

  const takenMeds = entry.medicationsTaken.filter(m => !m.isRegular)
  const regularMeds = patient.regularMedications

  return (
    <div className="card-view" ref={cardRef}>
      {/* Header */}
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
            {patient.allergies && patient.allergies !== 'None known' && (
              <span style={{ marginLeft: 8, fontSize: 12, color: '#fc8181', fontWeight: 700 }}>
                ⚠ Allergy: {patient.allergies}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Self assessment */}
      {entry.selfAssessment && (
        <div className="self-assess-block">
          <div className="self-assess-label">Patient / Caregiver Assessment</div>
          <div className="self-assess-text">{entry.selfAssessment}</div>
        </div>
      )}

      {/* Vitals */}
      {hasTempReading && (
        <div className="card-block">
          <div className="card-block-header">🌡️ Vital Signs / バイタル</div>
          <div className="card-block-body">
            <div className="vitals-row">
              {tempUnknown ? (
                <>
                  <div>
                    <div className="vital-label-en">Temperature</div>
                    <div className="vital-label-ja" style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                      Not measured / 未測定
                    </div>
                  </div>
                </>
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

      {/* Symptoms */}
      {entry.symptoms.length > 0 && (
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
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {entry.timeline.length > 0 && (
        <div className="card-block">
          <div className="card-block-header">📋 Symptom Timeline / 発症経過</div>
          <div className="card-block-body">
            {entry.timeline.map(t => {
              const enText = t.eventEn || translateEventToEn(t.eventJa)
              return (
                <div key={t.id} className="card-timeline-item">
                  <div className="card-timeline-time">{formatDatetime(t.datetime)}</div>
                  <div>
                    <div className="card-timeline-en">{enText}</div>
                    {t.eventJa && (
                      <div className="card-timeline-ja">{t.eventJa}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Medications taken */}
      {takenMeds.length > 0 && (
        <div className="card-block">
          <div className="card-block-header">💊 Medications Already Taken / 服用済みの薬</div>
          <div className="card-block-body" style={{ padding: 0 }}>
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
          </div>
        </div>
      )}

      {/* Regular medications */}
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

      {/* Footer */}
      <div className="card-footer">
        <strong>⚠ Please check for drug interactions before prescribing.</strong>
        処方前に薬の相互作用をご確認ください。
        <br />
        This card was generated on {new Date().toLocaleString('en-US')}
      </div>

      <div style={{ height: 90 }} />

      {/* Action bar */}
      <div className="card-actions">
        <button className="btn-secondary" onClick={onBack}>
          ✏️ 編集
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
