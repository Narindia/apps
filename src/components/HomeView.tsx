import { useState } from 'react'
import type { Patient, SymptomEntry } from '../types'
import { SYMPTOM_CHIPS } from '../data/symptoms'
import { calcAgeJa } from '../utils/dateHelpers'
import { deleteEntry } from '../utils/storage'

const AVATARS: Record<string, string> = {
  husband: '👨', daughter1: '👧', daughter2: '👧', son: '👦', other: '🧑',
}

interface Props {
  patients: Patient[]
  history: SymptomEntry[]
  onNewEntry: () => void
  onViewEntry: (entry: SymptomEntry) => void
  onHistoryChange: (entries: SymptomEntry[]) => void
}

export function HomeView({ patients, history, onNewEntry, onViewEntry, onHistoryChange }: Props) {
  const [tab, setTab] = useState<'new' | 'history'>('new')

  const getPatient = (id: string) => patients.find(p => p.id === id)

  const handleDelete = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation()
    if (!confirm('この記録を削除しますか？')) return
    deleteEntry(entryId)
    onHistoryChange(history.filter(h => h.id !== entryId))
  }

  const formatHistoryDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    } catch { return iso }
  }

  return (
    <>
      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === 'new' ? 'active' : ''}`}
          onClick={() => setTab('new')}
        >
          🏥 新規作成
        </button>
        <button
          className={`tab-btn ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          📋 過去の記録 {history.length > 0 && `(${history.length})`}
        </button>
      </div>

      {tab === 'new' && (
        <div className="home-actions">
          <div style={{
            background: 'var(--navy)',
            borderRadius: 'var(--radius)',
            padding: '24px 20px',
            color: 'white',
            marginBottom: 8,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏥</div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: 20 }}>症状カード作成</h2>
            <p style={{ margin: '0 0 16px 0', fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
              患者を選択して症状を入力するだけで、医師に見せる英語の症状カードを即座に生成します。
            </p>
            <button
              className="btn-primary"
              style={{ background: 'white', color: 'var(--navy)', fontSize: 16 }}
              onClick={onNewEntry}
            >
              ＋ 今すぐ作成する
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>
              👥 家族メンバー
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {patients.filter(p => p.id !== 'other').map(p => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    cursor: 'pointer',
                  }}
                  onClick={onNewEntry}
                >
                  <span style={{ fontSize: 28 }}>{AVATARS[p.id] ?? '🧑'}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-700)' }}>
                      {p.nameJa}
                      <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--gray-500)', marginLeft: 8 }}>
                        {p.nameEn}
                      </span>
                    </div>
                    {p.birthDate && (
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                        {calcAgeJa(p.birthDate)}
                        {p.regularMedications.length > 0 && ` · 常備薬 ${p.regularMedications.length}件`}
                      </div>
                    )}
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--gray-400)', fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <div>過去の記録はありません</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>作成したカードがここに保存されます</div>
            </div>
          ) : (
            history.map(entry => {
              const patient = getPatient(entry.patientId)
              const chips = entry.symptoms.slice(0, 4).map(s => {
                const chip = SYMPTOM_CHIPS.find(c => c.key === s.key)
                return chip?.labelJa ?? s.key
              })
              return (
                <div key={entry.id} className="history-item" onClick={() => onViewEntry(entry)}>
                  <div className="history-icon">{AVATARS[entry.patientId] ?? '🧑'}</div>
                  <div className="history-info">
                    <div className="history-name">
                      {patient?.nameJa ?? entry.patientId}
                    </div>
                    <div className="history-date">{formatHistoryDate(entry.date)}</div>
                    <div className="history-chips">
                      {chips.map(c => (
                        <span key={c} className="history-chip">{c}</span>
                      ))}
                      {entry.symptoms.length > 4 && (
                        <span className="history-chip">+{entry.symptoms.length - 4}</span>
                      )}
                    </div>
                  </div>
                  <button
                    style={{
                      background: 'none', border: 'none', color: 'var(--gray-400)',
                      fontSize: 18, cursor: 'pointer', padding: 4,
                    }}
                    onClick={e => handleDelete(e, entry.id)}
                  >
                    🗑
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}
    </>
  )
}
