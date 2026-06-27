interface Props {
  value: string
  onChange: (v: string) => void
}

const PRESETS = [
  '風邪だと思う / I think it is a cold',
  'インフルエンザかもしれない / Might be influenza',
  '食中毒かもしれない / Possible food poisoning',
  '熱性けいれんが心配 / Concerned about febrile seizure',
  'アレルギー反応かも / Possible allergic reaction',
]

export function SelfAssessment({ value, onChange }: Props) {
  return (
    <div className="section self-assess">
      <div className="section-title">
        <span className="step-badge">5</span>
        自己評価コメント / Your Assessment (任意)
      </div>
      <p className="hint">「おそらく…だと思う」という印象があれば記入してください（任意）。</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {PRESETS.map(p => (
          <button
            key={p}
            style={{
              padding: '5px 10px',
              border: '1px solid var(--gray-300)',
              borderRadius: 16,
              background: value === p ? 'var(--navy)' : 'white',
              color: value === p ? 'white' : 'var(--gray-600)',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onClick={() => onChange(value === p ? '' : p)}
          >
            {p.split(' / ')[0]}
          </button>
        ))}
      </div>
      <textarea
        placeholder="自由記述 / Free text..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
