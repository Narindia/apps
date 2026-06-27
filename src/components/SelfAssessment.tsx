import { useState } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
}

const PRESETS = [
  { ja: '風邪', en: 'Common cold' },
  { ja: 'インフルエンザかも', en: 'Possible influenza (flu)' },
  { ja: '食中毒かも', en: 'Possible food poisoning' },
  { ja: '胃腸炎かも', en: 'Possible gastroenteritis' },
  { ja: '熱性けいれんが心配', en: 'Concerned about febrile seizure' },
  { ja: 'アレルギー反応かも', en: 'Possible allergic reaction' },
  { ja: '尿路感染かも', en: 'Possible urinary tract infection' },
  { ja: '扁桃炎かも', en: 'Possible tonsillitis' },
]

export function SelfAssessment({ value, onChange }: Props) {
  const [showFree, setShowFree] = useState(false)

  const selectedPreset = PRESETS.find(p => value === p.en || value.startsWith(p.en))

  return (
    <div className="section self-assess">
      <div className="section-title">
        <span className="step-badge">5</span>
        自己評価コメント / Your Assessment （任意）
      </div>
      <p className="hint">おそらく…と思う、という印象があれば選択してください（任意）。</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {PRESETS.map(p => (
          <button
            key={p.en}
            className={`assessment-chip ${(selectedPreset?.en === p.en && !showFree) ? 'active' : ''}`}
            onClick={() => {
              setShowFree(false)
              onChange(selectedPreset?.en === p.en ? '' : p.en)
            }}
          >
            {p.ja}
          </button>
        ))}
        <button
          className={`assessment-chip ${showFree ? 'active' : ''}`}
          onClick={() => {
            setShowFree(true)
            if (!showFree) onChange('')
          }}
        >
          ✏️ その他・自由記述
        </button>
      </div>

      {(showFree || (!selectedPreset && value)) && (
        <textarea
          placeholder="自由記述（日本語または英語）/ Free text..."
          value={value}
          onChange={e => onChange(e.target.value)}
          autoFocus={showFree}
        />
      )}

      {selectedPreset && !showFree && (
        <div className="assessment-preview">
          カードに表示: <strong>{selectedPreset.en}</strong>
        </div>
      )}
    </div>
  )
}
