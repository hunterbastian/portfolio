const truthyValues = new Set(['1', 'true', 'yes', 'on'])
const falsyValues = new Set(['0', 'false', 'no', 'off'])

function parseBooleanEnv(value: string | undefined, defaultValue: boolean): boolean {
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
const isVercelRuntime = process.env.VERCEL === '1' || Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV)
const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || ''

export const telemetryConfig = {
  gaId,
  enableGa: isProduction && gaId.length > 0 && parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_GA, false),
  enableVercelAnalytics: isProduction && isVercelRuntime && parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS, true),
  enableSpeedInsights: isProduction && isVercelRuntime && parseBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS, true),
} as const
