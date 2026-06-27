import { useState } from 'react'
import { SYMPTOM_CHIPS, CATEGORY_LABELS, CATEGORY_ORDER } from '../data/symptoms'
import type { SelectedSymptom } from '../types'

interface Props {
  selected: SelectedSymptom[]
  temperature: string
  temperatureUnknown: boolean
  otherSymptom: string
  onToggle: (key: string) => void
  onTemperatureChange: (val: string) => void
  onTemperatureUnknown: (val: boolean) => void
  onOtherSymptom: (val: string) => void
}

export function SymptomChips({
  selected,
  temperature,
  temperatureUnknown,
  otherSymptom,
  onToggle,
  onTemperatureChange,
  onTemperatureUnknown,
  onOtherSymptom,
}: Props) {
  const [showOther, setShowOther] = useState(!!otherSymptom)
  const selectedKeys = new Set(selected.map(s => s.key))
  const isFeverSelected = selectedKeys.has('fever')

  return (
    <div className="section">
      <div className="section-title">
        <span className="step-badge">2</span>
        症状を選択 / Select Symptoms
      </div>
      <p className="hint">複数選択可。タップで ON/OFF します。</p>

      {CATEGORY_ORDER.map(cat => {
        const chips = SYMPTOM_CHIPS.filter(c => c.category === cat)
        if (chips.length === 0) return null
        const label = CATEGORY_LABELS[cat]
        return (
          <div key={cat} className="symptom-category">
            <div className="symptom-category-label">{label.ja} / {label.en}</div>
            <div className="chip-grid">
              {chips.map(chip => {
                const isSelected = selectedKeys.has(chip.key)
                const warnClass = chip.warnLevel === 'alert' ? 'alert' : chip.warnLevel === 'warn' ? 'warn' : ''
                return (
                  <div
                    key={chip.key}
                    className={`symptom-chip ${isSelected ? 'selected' : ''} ${warnClass}`}
                    onClick={() => onToggle(chip.key)}
                  >
                    <span className="chip-icon">{chip.icon}</span>
                    <div className="chip-labels">
                      <span className="chip-en">{chip.labelEn}</span>
                      <span className="chip-ja">{chip.labelJa}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="symptom-category">
        <div className="symptom-category-label">その他 / Other</div>
        <div className="chip-grid">
          <div
            className={`symptom-chip ${showOther || otherSymptom ? 'selected' : ''}`}
            onClick={() => {
              const next = !showOther
              setShowOther(next)
              if (!next) onOtherSymptom('')
            }}
          >
            <span className="chip-icon">✏️</span>
            <div className="chip-labels">
              <span className="chip-en">Other Symptom</span>
              <span className="chip-ja">その他の症状</span>
            </div>
          </div>
        </div>
        {(showOther || otherSymptom) && (
          <textarea
            placeholder="その他の症状を日本語または英語で入力..."
            value={otherSymptom}
            onChange={e => onOtherSymptom(e.target.value)}
            style={{
              width: '100%', marginTop: 8, padding: '8px 10px',
              border: '1px solid var(--gray-300)', borderRadius: 'var(--radius-sm)',
              fontSize: 13, resize: 'vertical', minHeight: 52,
              fontFamily: 'inherit', color: 'var(--gray-700)',
            }}
            autoFocus
          />
        )}
      </div>

      {isFeverSelected && (
        <div className="temp-input-row">
          <label>🌡️ 体温 / Temp:</label>
          <input
            type="number"
            step="0.1"
            min="35"
            max="42"
            placeholder="38.5"
            value={temperature}
            onChange={e => {
              onTemperatureChange(e.target.value)
              onTemperatureUnknown(false)
            }}
            disabled={temperatureUnknown}
          />
          <span style={{ fontSize: 13, color: 'var(--orange)' }}>°C</span>
          <button
            className={`temp-unknown-btn ${temperatureUnknown ? 'active' : ''}`}
            onClick={() => {
              onTemperatureUnknown(!temperatureUnknown)
              if (!temperatureUnknown) onTemperatureChange('')
            }}
          >
            測れていない / Not measured
          </button>
        </div>
      )}
    </div>
  )
}
