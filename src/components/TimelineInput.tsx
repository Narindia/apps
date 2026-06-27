import type { TimelineEntry } from '../types'
import { TIME_PRESETS } from '../data/symptoms'
import { nowISOLocal } from '../utils/dateHelpers'
import { generateId } from '../utils/storage'

interface Props {
  entries: TimelineEntry[]
  onChange: (entries: TimelineEntry[]) => void
}

function presetToDatetime(preset: string): string {
  const now = new Date()
  const map: Record<string, number> = {
    this_morning: 7,
    this_afternoon: 14,
    tonight: 21,
    yesterday_morning: -17,
    yesterday_evening: -5,
    last_night: -3,
    two_days_ago: -48,
    three_days_ago: -72,
    one_week_ago: -168,
  }
  const hoursOffset = map[preset]
  if (hoursOffset === undefined) return nowISOLocal()
  const d = new Date(now)
  if (preset.startsWith('this_')) {
    d.setHours(hoursOffset, 0, 0, 0)
  } else {
    d.setTime(d.getTime() + hoursOffset * 3600 * 1000)
    if (preset === 'yesterday_morning') d.setHours(8, 0, 0, 0)
    else if (preset === 'yesterday_evening') d.setHours(18, 0, 0, 0)
    else if (preset === 'last_night') d.setHours(22, 0, 0, 0)
  }
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

export function TimelineInput({ entries, onChange }: Props) {
  const add = () => {
    onChange([
      ...entries,
      {
        id: generateId(),
        datetime: nowISOLocal(),
        eventJa: '',
        eventEn: '',
        preset: '',
      },
    ])
  }

  const remove = (id: string) => {
    onChange(entries.filter(e => e.id !== id))
  }

  const update = (id: string, field: keyof TimelineEntry, value: string) => {
    onChange(
      entries.map(e => {
        if (e.id !== id) return e
        if (field === 'preset' && value) {
          return { ...e, preset: value, datetime: presetToDatetime(value) }
        }
        return { ...e, [field]: value }
      })
    )
  }

  return (
    <div className="section">
      <div className="section-title">
        <span className="step-badge">3</span>
        発症の経過 / Timeline of Symptoms
      </div>
      <p className="hint">いつ何が起きたかを記録してください。「いつから？」という医師の質問に答えられます。</p>

      {entries.map((entry, idx) => (
        <div key={entry.id} className="timeline-entry">
          <div className="timeline-dot" />
          <div className="timeline-fields">
            <div className="timeline-time-row">
              <select
                value={entry.preset || ''}
                onChange={e => update(entry.id, 'preset', e.target.value)}
              >
                <option value="">📅 日時を選択...</option>
                {TIME_PRESETS.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.labelJa} ({p.labelEn})
                  </option>
                ))}
                <option value="__custom">手動入力 / Manual</option>
              </select>
            </div>
            {(entry.preset === '__custom' || !entry.preset) && (
              <input
                type="datetime-local"
                value={entry.datetime}
                onChange={e => update(entry.id, 'datetime', e.target.value)}
              />
            )}
            <textarea
              placeholder={`出来事を日本語で入力... (例：熱が39度になった、嘔吐した)\nEntry ${idx + 1}: What happened?`}
              value={entry.eventJa}
              onChange={e => update(entry.id, 'eventJa', e.target.value)}
            />
          </div>
          <button className="btn-remove" onClick={() => remove(entry.id)}>✕</button>
        </div>
      ))}

      <button className="btn-add" onClick={add}>
        ＋ 出来事を追加 / Add Event
      </button>
    </div>
  )
}
