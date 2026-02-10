Created by [Hunter Bastian](https://github.com/hunterbastian)

## Resume Protection

Set this in `.env.local` to lock the resume modal behind a password:

`RESUME_PASSWORD=your-password`

The resume PDF is served through `/api/resume/file` only after unlock.

## Changelog

### December 18, 2025
- **Security Update**: Upgraded to Next.js 16.1.0 to address CVE-2025-55184 (DoS) and CVE-2025-55183 (Source Code Exposure) vulnerabilities in React Server Components
- Updated `@next/mdx`, `@next/bundle-analyzer`, and `eslint-config-next` to 16.1.0
- Removed deprecated `modularizeImports` config for `@react-three/drei` (now handled by `optimizePackageImports`)
