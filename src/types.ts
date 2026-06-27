export interface Medication {
  nameEn: string
  nameJa: string
  dose: string
  purposeEn: string
  purposeJa: string
}

export interface Patient {
  id: string
  nameEn: string
  nameJa: string
  birthDate: string
  bloodType?: string
  allergies?: string
  regularMedications: Medication[]
}

export interface SymptomChip {
  key: string
  labelEn: string
  labelJa: string
  icon: string
  category: 'general' | 'respiratory' | 'digestive' | 'skin' | 'pain' | 'neuro'
  warnLevel?: 'normal' | 'warn' | 'alert'
  hasSubInput?: 'temperature' | 'severity'
}

export interface SelectedSymptom {
  key: string
  subValue?: string
}

export interface TimelineEntry {
  id: string
  datetime: string
  eventJa: string
  eventEn: string
  preset?: string
}

export interface MedicationTaken {
  id: string
  nameEn: string
  nameJa: string
  dose: string
  timesTaken: string
  lastTakenAt: string
  isRegular: boolean
}

export interface Vitals {
  temperature: string
  temperatureUnknown: boolean
  spo2?: string
  pulse?: string
}

export interface SymptomEntry {
  id: string
  patientId: string
  date: string
  selfAssessment: string
  symptoms: SelectedSymptom[]
  timeline: TimelineEntry[]
  medicationsTaken: MedicationTaken[]
  vitals: Vitals
}

export type AppView = 'home' | 'form' | 'card'

export interface AppState {
  view: AppView
  selectedPatientId: string | null
  currentEntry: Partial<SymptomEntry>
  formStep: number
}
