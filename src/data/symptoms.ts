import type { SymptomChip } from '../types'

export const SYMPTOM_CHIPS: SymptomChip[] = [
  // General
  { key: 'fever', labelEn: 'Fever', labelJa: '発熱', icon: '🌡️', category: 'general', warnLevel: 'warn', hasSubInput: 'temperature' },
  { key: 'chills', labelEn: 'Chills', labelJa: '寒気・悪寒', icon: '🥶', category: 'general', warnLevel: 'normal' },
  { key: 'fatigue', labelEn: 'Fatigue', labelJa: '倦怠感・だるさ', icon: '😩', category: 'general', warnLevel: 'normal' },
  { key: 'loss_of_appetite', labelEn: 'Loss of Appetite', labelJa: '食欲不振', icon: '🍽️', category: 'general', warnLevel: 'normal' },
  { key: 'sweating', labelEn: 'Excessive Sweating', labelJa: '多汗・発汗', icon: '💦', category: 'general', warnLevel: 'normal' },
  { key: 'weight_loss', labelEn: 'Weight Loss', labelJa: '体重減少', icon: '⚖️', category: 'general', warnLevel: 'normal' },
  { key: 'dehydration', labelEn: 'Dehydration Signs', labelJa: '脱水症状', icon: '🫙', category: 'general', warnLevel: 'warn' },
  { key: 'jaundice', labelEn: 'Jaundice (Yellow skin)', labelJa: '黄疸（肌の黄色化）', icon: '🟡', category: 'general', warnLevel: 'alert' },

  // Respiratory
  { key: 'sore_throat', labelEn: 'Sore Throat', labelJa: '喉の痛み', icon: '🫁', category: 'respiratory', warnLevel: 'normal' },
  { key: 'swollen_tonsils', labelEn: 'Swollen Tonsils', labelJa: '扁桃腺の腫れ', icon: '🔴', category: 'respiratory', warnLevel: 'warn' },
  { key: 'cough_dry', labelEn: 'Dry Cough', labelJa: '空咳（乾いた咳）', icon: '😮‍💨', category: 'respiratory', warnLevel: 'normal' },
  { key: 'cough_wet', labelEn: 'Productive Cough', labelJa: '痰の出る咳', icon: '🤧', category: 'respiratory', warnLevel: 'normal' },
  { key: 'runny_nose', labelEn: 'Runny Nose', labelJa: '鼻水', icon: '💧', category: 'respiratory', warnLevel: 'normal' },
  { key: 'nasal_congestion', labelEn: 'Nasal Congestion', labelJa: '鼻詰まり', icon: '👃', category: 'respiratory', warnLevel: 'normal' },
  { key: 'shortness_of_breath', labelEn: 'Shortness of Breath', labelJa: '息切れ', icon: '😤', category: 'respiratory', warnLevel: 'warn' },
  { key: 'difficulty_breathing', labelEn: 'Difficulty Breathing', labelJa: '息苦しさ', icon: '😰', category: 'respiratory', warnLevel: 'alert' },
  { key: 'wheezing', labelEn: 'Wheezing', labelJa: 'ゼーゼー・喘鳴', icon: '🌬️', category: 'respiratory', warnLevel: 'warn' },

  // Digestive
  { key: 'nausea', labelEn: 'Nausea', labelJa: '吐き気', icon: '😵', category: 'digestive', warnLevel: 'normal' },
  { key: 'vomiting', labelEn: 'Vomiting', labelJa: '嘔吐', icon: '🤢', category: 'digestive', warnLevel: 'warn' },
  { key: 'diarrhea', labelEn: 'Diarrhea', labelJa: '下痢', icon: '🚽', category: 'digestive', warnLevel: 'warn' },
  { key: 'abdominal_pain', labelEn: 'Abdominal Pain', labelJa: '腹痛', icon: '🤕', category: 'pain', warnLevel: 'warn' },
  { key: 'constipation', labelEn: 'Constipation', labelJa: '便秘', icon: '😖', category: 'digestive', warnLevel: 'normal' },
  { key: 'blood_stool', labelEn: 'Blood in Stool', labelJa: '血便', icon: '🩸', category: 'digestive', warnLevel: 'alert' },

  // Pain
  { key: 'headache', labelEn: 'Headache', labelJa: '頭痛', icon: '🤯', category: 'pain', warnLevel: 'normal' },
  { key: 'ear_pain', labelEn: 'Ear Pain', labelJa: '耳の痛み', icon: '👂', category: 'pain', warnLevel: 'normal' },
  { key: 'chest_pain', labelEn: 'Chest Pain', labelJa: '胸の痛み', icon: '💔', category: 'pain', warnLevel: 'alert' },
  { key: 'joint_pain', labelEn: 'Joint Pain', labelJa: '関節痛', icon: '🦴', category: 'pain', warnLevel: 'normal' },
  { key: 'back_pain', labelEn: 'Back Pain', labelJa: '腰痛・背中の痛み', icon: '🫄', category: 'pain', warnLevel: 'normal' },
  { key: 'toothache', labelEn: 'Toothache', labelJa: '歯痛', icon: '🦷', category: 'pain', warnLevel: 'normal' },

  // Skin
  { key: 'rash', labelEn: 'Rash', labelJa: '発疹', icon: '🔴', category: 'skin', warnLevel: 'warn' },
  { key: 'itching', labelEn: 'Itching', labelJa: 'かゆみ', icon: '🖐️', category: 'skin', warnLevel: 'normal' },
  { key: 'swelling', labelEn: 'Swelling / Edema', labelJa: '腫れ・むくみ', icon: '🫧', category: 'skin', warnLevel: 'warn' },
  { key: 'cyanosis', labelEn: 'Blue Lips / Cyanosis', labelJa: '唇・爪の青み', icon: '🔵', category: 'skin', warnLevel: 'alert' },

  // Eyes
  { key: 'eye_discharge', labelEn: 'Eye Discharge / Redness', labelJa: '目やに・充血', icon: '👁️', category: 'eye', warnLevel: 'normal' },
  { key: 'eye_pain', labelEn: 'Eye Pain', labelJa: '目の痛み', icon: '😣', category: 'eye', warnLevel: 'normal' },

  // Neuro
  { key: 'dizziness', labelEn: 'Dizziness', labelJa: 'めまい', icon: '💫', category: 'neuro', warnLevel: 'normal' },
  { key: 'convulsion', labelEn: 'Convulsion / Seizure', labelJa: 'けいれん', icon: '⚡', category: 'neuro', warnLevel: 'alert' },
  { key: 'consciousness', labelEn: 'Altered Consciousness', labelJa: '意識の変容', icon: '🚨', category: 'neuro', warnLevel: 'alert' },
  { key: 'numbness', labelEn: 'Numbness / Tingling', labelJa: 'しびれ', icon: '🤲', category: 'neuro', warnLevel: 'warn' },

  // Urinary
  { key: 'frequent_urination', labelEn: 'Frequent Urination', labelJa: '頻尿', icon: '🚿', category: 'urinary', warnLevel: 'normal' },
  { key: 'painful_urination', labelEn: 'Painful Urination', labelJa: '排尿痛', icon: '😫', category: 'urinary', warnLevel: 'warn' },
  { key: 'blood_urine', labelEn: 'Blood in Urine', labelJa: '血尿', icon: '🩸', category: 'urinary', warnLevel: 'alert' },
]

export const CATEGORY_LABELS: Record<string, { en: string; ja: string }> = {
  general: { en: 'General', ja: '全身症状' },
  respiratory: { en: 'Respiratory', ja: '呼吸器・喉' },
  digestive: { en: 'Digestive', ja: '消化器・胃腸' },
  pain: { en: 'Pain', ja: '痛み' },
  skin: { en: 'Skin', ja: '皮膚' },
  eye: { en: 'Eyes', ja: '目' },
  neuro: { en: 'Neurological', ja: '神経系' },
  urinary: { en: 'Urinary', ja: '泌尿器' },
}

export const CATEGORY_ORDER = ['general', 'respiratory', 'digestive', 'pain', 'skin', 'eye', 'neuro', 'urinary'] as const

export const EVENT_TYPES = [
  { key: 'started', labelJa: '始まった', labelEn: 'started' },
  { key: 'worsened', labelJa: '悪化した', labelEn: 'worsened' },
  { key: 'improved', labelJa: '改善した', labelEn: 'improved' },
  { key: 'resolved', labelJa: '止まった・治った', labelEn: 'resolved' },
  { key: 'recurred', labelJa: '再び起きた', labelEn: 'recurred' },
  { key: 'took_med', labelJa: '薬を飲んだ', labelEn: 'Took medication' },
  { key: 'visited', labelJa: '受診した', labelEn: 'Visited clinic/hospital' },
  { key: 'other', labelJa: 'その他（自由記述）', labelEn: 'Other' },
]

export function generateTimelineEnglish(symptomKeys: string[], eventType: string, freeText: string): string {
  if (eventType === 'took_med') return 'Took medication'
  if (eventType === 'visited') return 'Visited clinic/hospital'
  if (symptomKeys.length === 0 || eventType === 'other') return freeText || ''
  const names = symptomKeys.map(k => SYMPTOM_CHIPS.find(c => c.key === k)?.labelEn ?? k)
  const evLabel = EVENT_TYPES.find(e => e.key === eventType)?.labelEn ?? eventType
  return `${names.join(' / ')} ${evLabel}`
}

export const TIME_PRESETS = [
  { labelJa: '今朝', labelEn: 'This morning', value: 'this_morning' },
  { labelJa: '今日の午後', labelEn: 'This afternoon', value: 'this_afternoon' },
  { labelJa: '今夜', labelEn: 'Tonight', value: 'tonight' },
  { labelJa: '昨日の朝', labelEn: 'Yesterday morning', value: 'yesterday_morning' },
  { labelJa: '昨日の夕方', labelEn: 'Yesterday evening', value: 'yesterday_evening' },
  { labelJa: '昨夜', labelEn: 'Last night', value: 'last_night' },
  { labelJa: '2日前', labelEn: '2 days ago', value: 'two_days_ago' },
  { labelJa: '3日前', labelEn: '3 days ago', value: 'three_days_ago' },
  { labelJa: '1週間前', labelEn: 'About 1 week ago', value: 'one_week_ago' },
]

export const COMMON_OTCS = [
  { nameEn: 'Crocin / Paracetamol 500mg', nameJa: 'パラセタモール 500mg', dose: '500mg' },
  { nameEn: 'Calpol (Paracetamol syrup)', nameJa: 'カルポール（小児シロップ）', dose: '2.5–5ml' },
  { nameEn: 'Ibuprofen 400mg', nameJa: 'イブプロフェン 400mg', dose: '400mg' },
  { nameEn: 'ORS (Oral Rehydration Salt)', nameJa: '経口補水液', dose: '1 sachet' },
  { nameEn: 'Cetirizine 10mg', nameJa: 'セチリジン 10mg', dose: '10mg' },
  { nameEn: 'Azithromycin 500mg', nameJa: 'アジスロマイシン 500mg', dose: '500mg' },
]
