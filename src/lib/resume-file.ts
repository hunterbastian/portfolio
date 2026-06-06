import path from 'path'

export const RESUME_SOURCE_FILE_NAME = 'Hunter Bastian Resume.pdf'
export const RESUME_DOWNLOAD_FILE_NAME = 'Hunter_Bastian_Resume.pdf'
export const RESUME_FILE_CONTENT_TYPE = 'application/pdf'
export const RESUME_FILE_CACHE_CONTROL = 'public, max-age=3600, must-revalidate'

export type ResumeFileDispositionType = 'attachment' | 'inline'

export function getResumeFilePath(projectRoot = process.cwd()): string {
  return path.join(projectRoot, 'private', 'resume', RESUME_SOURCE_FILE_NAME)
}

export function shouldDownloadResumeFile(searchParams: Pick<URLSearchParams, 'get'>): boolean {
  return searchParams.get('download') === '1'
}

export function getResumeFileDispositionType(download: boolean): ResumeFileDispositionType {
  return download ? 'attachment' : 'inline'
}

export function getResumeFileResponseHeaders(download: boolean): Record<string, string> {
  return {
    'Content-Type': RESUME_FILE_CONTENT_TYPE,
    'Content-Disposition': `${getResumeFileDispositionType(download)}; filename="${RESUME_DOWNLOAD_FILE_NAME}"`,
    'Cache-Control': RESUME_FILE_CACHE_CONTROL,
  }
}
