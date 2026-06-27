export function calcAge(birthDate: string): string {
  if (!birthDate) return ''
  const birth = new Date(birthDate)
  const today = new Date()
  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--
    months += 12
  }
  if (years === 0) return `${months} months old`
  if (years < 3) return `${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''} old`
  return `${years} years old`
}

export function calcAgeJa(birthDate: string): string {
  if (!birthDate) return ''
  const birth = new Date(birthDate)
  const today = new Date()
  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--
    months += 12
  }
  if (years === 0) return `${months}ヶ月`
  return `${years}歳`
}

export function formatDatetime(dt: string): string {
  if (!dt) return ''
  try {
    return new Date(dt).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
  } catch {
    return dt
  }
}

export function formatDate(dt: string): string {
  if (!dt) return ''
  try {
    return new Date(dt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch {
    return dt
  }
}

export function nowISOLocal(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 16)
}
