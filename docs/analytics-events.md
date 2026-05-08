# Analytics Events

Vercel Web Analytics is the primary analytics path. Page views are handled by the Vercel `<Analytics />` component in `src/app/layout.tsx`.

Custom events are sent through `src/lib/analytics.ts`:

| Event | When it fires | Properties |
| --- | --- | --- |
| `project_view` | Project detail page mounts | `slug`, `title` |
| `project_click` | User opens a project from home, archive/grid, or text list | `slug`, `title` |
| `resume_action` | Resume modal/CV opens, PDF downloads, or CV prints | `action` |
| `external_link` | User clicks email/social/project/MDX outbound links | `url`, `platform` |
| `navigation_click` | User uses header, breadcrumbs, project CTAs, or chapter navigation | `section` |

Google Analytics is optional. It only loads when `NEXT_PUBLIC_GA_ID` is present and `NEXT_PUBLIC_ENABLE_GA=true`.
