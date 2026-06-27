import type { Patient, SymptomEntry } from '../types'
import { DEFAULT_PATIENTS } from '../data/patients'

const PATIENTS_KEY = 'symptom_card_patients'
const ENTRIES_KEY = 'symptom_card_entries'

export function loadPatients(): Patient[] {
  try {
    const raw = localStorage.getItem(PATIENTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_PATIENTS
}

export function savePatients(patients: Patient[]): void {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
}

export function loadEntries(): SymptomEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

export function saveEntry(entry: SymptomEntry): void {
  const entries = loadEntries()
  const idx = entries.findIndex(e => e.id === entry.id)
  if (idx >= 0) {
    entries[idx] = entry
  } else {
    entries.unshift(entry)
  }
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries.slice(0, 50)))
}

export function deleteEntry(id: string): void {
  const entries = loadEntries().filter(e => e.id !== id)
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
