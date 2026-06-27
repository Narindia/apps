import { useState } from 'react'
import type { Patient, SymptomEntry, AppView } from './types'
import { loadPatients, loadEntries, saveEntry, savePatients } from './utils/storage'
import { HomeView } from './components/HomeView'
import { FormView } from './components/FormView'
import { SymptomCard } from './components/SymptomCard'
import { PatientEditor } from './components/PatientEditor'

export default function App() {
  const [view, setView] = useState<AppView>('home')
  const [patients, setPatients] = useState<Patient[]>(loadPatients)
  const [history, setHistory] = useState<SymptomEntry[]>(loadEntries)
  const [editingEntry, setEditingEntry] = useState<Partial<SymptomEntry> | undefined>()
  const [completedEntry, setCompletedEntry] = useState<SymptomEntry | null>(null)

  const handleNewEntry = () => {
    setEditingEntry(undefined)
    setView('form')
  }

  const handleViewEntry = (entry: SymptomEntry) => {
    setCompletedEntry(entry)
    setView('card')
  }

  const handleFormComplete = (entry: SymptomEntry) => {
    saveEntry(entry)
    setHistory(loadEntries())
    setCompletedEntry(entry)
    setView('card')
  }

  const handleEditFromCard = () => {
    if (completedEntry) {
      setEditingEntry(completedEntry)
      setView('form')
    }
  }

  const handleNewFromCard = () => {
    setEditingEntry(undefined)
    setCompletedEntry(null)
    setView('form')
  }

  const handleBack = () => {
    setView('home')
    setEditingEntry(undefined)
    setCompletedEntry(null)
  }

  // Auto-save: called on every mutation in PatientEditor
  const handlePatientsChange = (updated: Patient[]) => {
    savePatients(updated)
    setPatients(updated)
  }

  const patient = completedEntry
    ? patients.find(p => p.id === completedEntry.patientId)
    : undefined

  const headerTitles: Record<AppView, { ja: string; en: string }> = {
    home: { ja: '症状カード', en: 'Symptom Card App' },
    form: { ja: '症状を入力', en: 'Enter Symptoms' },
    card: { ja: '症状カード', en: 'Medical Card' },
    profiles: { ja: '家族メンバー', en: 'Family Members' },
  }
  const headerTitle = headerTitles[view]

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="cross-icon">✚</div>
        <h1>
          {headerTitle.ja}
          <small>{headerTitle.en}</small>
        </h1>
        {view === 'home' && (
          <button className="header-gear" onClick={() => setView('profiles')} title="家族メンバー管理">
            ⚙
          </button>
        )}
        {view !== 'home' && (
          <button className="header-back" onClick={handleBack}>
            ← ホーム
          </button>
        )}
      </header>

      <div className="main-content">
        {view === 'home' && (
          <HomeView
            patients={patients}
            history={history}
            onNewEntry={handleNewEntry}
            onViewEntry={handleViewEntry}
            onHistoryChange={setHistory}
          />
        )}

        {view === 'form' && (
          <FormView
            patients={patients}
            initialEntry={editingEntry}
            onComplete={handleFormComplete}
          />
        )}

        {view === 'card' && completedEntry && patient && (
          <SymptomCard
            entry={completedEntry}
            patient={patient}
            onBack={handleEditFromCard}
            onNew={handleNewFromCard}
          />
        )}

        {view === 'profiles' && (
          <PatientEditor
            patients={patients}
            onChange={handlePatientsChange}
            onClose={handleBack}
          />
        )}
      </div>
    </div>
  )
}
