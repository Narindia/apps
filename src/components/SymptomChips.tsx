import { SYMPTOM_CHIPS, CATEGORY_LABELS } from '../data/symptoms'
import type { SelectedSymptom } from '../types'

interface Props {
  selected: SelectedSymptom[]
  temperature: string
  temperatureUnknown: boolean
  onToggle: (key: string) => void
  onTemperatureChange: (val: string) => void
  onTemperatureUnknown: (val: boolean) => void
}

export function SymptomChips({
  selected,
  temperature,
  temperatureUnknown,
  onToggle,
  onTemperatureChange,
  onTemperatureUnknown,
}: Props) {
  const selectedKeys = new Set(selected.map(s => s.key))
  const isFeverSelected = selectedKeys.has('fever')

  const categories = ['general', 'respiratory', 'digestive', 'pain', 'skin', 'neuro'] as const

  return (
    <div className="section">
      <div className="section-title">
        <span className="step-badge">2</span>
        症状を選択 / Select Symptoms
      </div>
      <p className="hint">複数選択可。タップで ON/OFF します。</p>

      {categories.map(cat => {
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
