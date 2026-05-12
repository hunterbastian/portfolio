# Analytics Events

Vercel Web Analytics is the primary analytics path. Page views are handled by the Vercel `<Analytics />` component in `src/app/layout.tsx`.

Custom events are sent through `src/lib/analytics.ts`:

| Event | When it fires | Properties |
| --- | --- | --- |
| `project_view` | Project detail page mounts | `slug`, `title` |
| `project_click` | User opens a project from home, archive/grid, text list, or project-end nav | `slug`, `title`, optional `source`, `project_slug`, `project_title` |
| `resume_action` | Resume modal/page opens, PDF downloads, or resume prints | `action`, optional `source`, `project_slug`, `project_title` |
| `external_link` | User clicks email/social/project/MDX outbound links | `url`, `platform`, optional `source`, `project_slug`, `project_title` |
| `navigation_click` | User uses header, breadcrumbs, project CTAs, or chapter navigation | `section`, optional `source`, `project_slug`, `project_title` |

Project-page CTA events include `source: "project_cta"` plus the project slug/title. Project outbound links use `source: "project_links"`. Project-end links use `source: "project_end_next"` or `source: "project_end_related"`.

Google Analytics is optional. It only loads when `NEXT_PUBLIC_GA_ID` is present and `NEXT_PUBLIC_ENABLE_GA=true`.
