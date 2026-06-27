import type { TimelineEntry } from '../types'
import { TIME_PRESETS, EVENT_TYPES, SYMPTOM_CHIPS, generateTimelineEnglish } from '../data/symptoms'
import { nowISOLocal } from '../utils/dateHelpers'
import { generateId } from '../utils/storage'

interface Props {
  entries: TimelineEntry[]
  selectedSymptomKeys: string[]
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

function buildJa(symptomKeys: string[], eventType: string, freeText: string): string {
  if (eventType === 'took_med') return '薬を飲んだ'
  if (eventType === 'visited') return '受診した'
  if (eventType === 'other') return freeText
  const jaLabel = EVENT_TYPES.find(e => e.key === eventType)?.labelJa ?? ''
  if (symptomKeys.length === 0) return jaLabel
  const names = symptomKeys.map(k => SYMPTOM_CHIPS.find(c => c.key === k)?.labelJa ?? k)
  return `${names.join('・')}が${jaLabel}`
}

export function TimelineInput({ entries, selectedSymptomKeys, onChange }: Props) {
  const add = () => {
    onChange([
      ...entries,
      {
        id: generateId(),
        datetime: nowISOLocal(),
        selectedSymptomKeys: [],
        eventType: '',
        eventJa: '',
        eventEn: '',
        preset: '',
      },
    ])
  }

  const remove = (id: string) => {
    onChange(entries.filter(e => e.id !== id))
  }

  const patch = (id: string, updates: Partial<TimelineEntry>) => {
    onChange(entries.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const updatePreset = (id: string, preset: string) => {
    const dt = preset && preset !== '__custom' ? presetToDatetime(preset) : undefined
    patch(id, dt ? { preset, datetime: dt } : { preset })
  }

  const toggleSymptom = (id: string, key: string) => {
    const entry = entries.find(e => e.id === id)
    if (!entry) return
    const newKeys = entry.selectedSymptomKeys.includes(key)
      ? entry.selectedSymptomKeys.filter(k => k !== key)
      : [...entry.selectedSymptomKeys, key]
    const en = generateTimelineEnglish(newKeys, entry.eventType, entry.eventJa)
    const ja = buildJa(newKeys, entry.eventType, entry.eventJa)
    patch(id, { selectedSymptomKeys: newKeys, eventEn: en, eventJa: ja })
  }

  const updateEventType = (id: string, eventType: string) => {
    const entry = entries.find(e => e.id === id)
    if (!entry) return
    const freeText = entry.eventType === 'other' ? entry.eventJa : ''
    const en = generateTimelineEnglish(entry.selectedSymptomKeys, eventType, freeText)
    const ja = buildJa(entry.selectedSymptomKeys, eventType, freeText)
    patch(id, { eventType, eventEn: en, eventJa: ja })
  }

  const updateFreeText = (id: string, text: string) => {
    const entry = entries.find(e => e.id === id)
    if (!entry) return
    const en = generateTimelineEnglish(entry.selectedSymptomKeys, entry.eventType, text)
    patch(id, { eventJa: text, eventEn: en })
  }

  return (
    <div className="section">
      <div className="section-title">
        <span className="step-badge">3</span>
        発症の経過 / Timeline of Symptoms
      </div>
      <p className="hint">いつ何が起きたかを記録。「いつから？」という医師の質問に答えられます。</p>

      {entries.map(entry => (
        <div key={entry.id} className="timeline-entry">
          <div className="timeline-dot" />
          <div className="timeline-fields">
            <div className="timeline-time-row">
              <select
                value={entry.preset || ''}
                onChange={e => updatePreset(entry.id, e.target.value)}
              >
                <option value="">📅 いつ？（時間を選択）</option>
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
                onChange={e => patch(entry.id, { datetime: e.target.value })}
              />
            )}

            {selectedSymptomKeys.length > 0 && (
              <div>
                <div className="timeline-sublabel">症状（タップで選択）:</div>
                <div className="event-chips">
                  {selectedSymptomKeys.map(key => {
                    const chip = SYMPTOM_CHIPS.find(c => c.key === key)
                    if (!chip) return null
                    const isActive = entry.selectedSymptomKeys.includes(key)
                    return (
                      <button
                        key={key}
                        className={`event-chip ${isActive ? 'active' : ''}`}
                        onClick={() => toggleSymptom(entry.id, key)}
                      >
                        {chip.icon} {chip.labelJa}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="timeline-sublabel">何が起きた？:</div>
              <div className="event-type-chips">
                {EVENT_TYPES.map(ev => (
                  <button
                    key={ev.key}
                    className={`event-type-chip ${entry.eventType === ev.key ? 'active' : ''}`}
                    onClick={() => updateEventType(entry.id, ev.key)}
                  >
                    {ev.labelJa}
                  </button>
                ))}
              </div>
            </div>

            {entry.eventType === 'other' && (
              <textarea
                placeholder="内容を日本語で入力してください..."
                value={entry.eventJa}
                onChange={e => updateFreeText(entry.id, e.target.value)}
              />
            )}

            {entry.eventEn && (
              <div className="timeline-preview">
                📋 {entry.eventEn}
              </div>
            )}
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
