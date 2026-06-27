import type { Patient } from '../types'

export const DEFAULT_PATIENTS: Patient[] = [
  {
    id: 'husband',
    nameEn: 'Nariaki Okado',
    nameJa: '夫 (岡道成明)',
    birthDate: '1983-01-01',
    bloodType: 'A',
    allergies: 'None known',
    regularMedications: [
      {
        nameEn: 'Amlodipine 5mg',
        nameJa: 'アムロジピン 5mg',
        dose: '5mg once daily (morning)',
        purposeEn: 'Hypertension',
        purposeJa: '高血圧治療',
      },
      {
        nameEn: 'Dutasteride 0.5mg',
        nameJa: 'デュタステリド 0.5mg',
        dose: '0.5mg once daily',
        purposeEn: 'BPH / hair loss treatment',
        purposeJa: '前立腺肥大・脱毛治療',
      },
    ],
  },
  {
    id: 'daughter1',
    nameEn: 'Eldest Daughter',
    nameJa: '長女',
    birthDate: '2017-01-01',
    bloodType: '',
    allergies: 'None known',
    regularMedications: [],
  },
  {
    id: 'daughter2',
    nameEn: 'Second Daughter',
    nameJa: '次女',
    birthDate: '2019-01-01',
    bloodType: '',
    allergies: 'None known',
    regularMedications: [],
  },
  {
    id: 'son',
    nameEn: 'Son',
    nameJa: '息子',
    birthDate: '2022-01-01',
    bloodType: '',
    allergies: 'None known',
    regularMedications: [],
  },
  {
    id: 'other',
    nameEn: 'Other / その他',
    nameJa: 'その他',
    birthDate: '',
    bloodType: '',
    allergies: '',
    regularMedications: [],
  },
]
