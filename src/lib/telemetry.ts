const truthyValues = new Set(['1', 'true', 'yes', 'on'])
const falsyValues = new Set(['0', 'false', 'no', 'off'])

const parseBooleanEnv = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) {
    return defaultValue
  }

  const normalized = value.trim().toLowerCase()

  if (truthyValues.has(normalized)) {
    return true
  }

  if (falsyValues.has(normalized)) {
    return false
  }

  return defaultValue
}

const isProduction = process.env.NODE_ENV === 'production'

export const telemetryConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID?.trim() || '',
  enableGtm: isProduction && parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_GTM, true),
  enableVercelAnalytics: isProduction && parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS, true),
  enableSpeedInsights: isProduction && parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS, true),
} as const
