# Resume Folder

The live resume PDF is now protected behind `/api/resume/*` routes and is no longer served directly from `public/`.

## Where the protected file lives

- `private/resume/Hunter Bastian Resume.pdf`

## Required environment variable

- `RESUME_PASSWORD=your-password`

Without `RESUME_PASSWORD`, the resume modal will show as unavailable.
