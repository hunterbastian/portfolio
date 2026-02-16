from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

output_path = Path('output/pdf/portfolio-app-summary.pdf')
output_path.parent.mkdir(parents=True, exist_ok=True)

styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    'Title',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=17,
    leading=20,
    spaceAfter=10,
)

style_heading = ParagraphStyle(
    'Heading',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=13,
    spaceBefore=4,
    spaceAfter=3,
)

style_body = ParagraphStyle(
    'Body',
    parent=styles['BodyText'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=12,
    spaceAfter=3,
)

style_bullet = ParagraphStyle(
    'Bullet',
    parent=style_body,
    leftIndent=10,
    firstLineIndent=-8,
    spaceAfter=2,
)

story = []
story.append(Paragraph('Portfolio App Summary', style_title))

story.append(Paragraph('What it is', style_heading))
story.append(
    Paragraph(
        'A personal portfolio web app built with Next.js 16, React 19, and TypeScript. '
        'It showcases design and development case studies from MDX content, with a protected resume viewer and download flow.',
        style_body,
    )
)

story.append(Paragraph('Who it is for', style_heading))
story.append(
    Paragraph(
        'Primary audience: recruiters, hiring managers, and potential clients evaluating Hunter Bastian, '
        'who is described in repo metadata as a student product designer and photographer.',
        style_body,
    )
)

story.append(Paragraph('What it does', style_heading))
features = [
    'Renders a home page of case studies sourced from local MDX files in content/projects.',
    'Generates per-project routes at /projects/[slug] with SEO metadata, hero media, tags, and optional demo/GitHub links.',
    'Provides an archive page that lists projects marked archived in frontmatter.',
    'Includes a resume modal that checks access, unlocks via password, and serves PDF inline or as download.',
    'Uses motion-driven UI patterns (section transitions, staggered reveals, responsive nav, and overlay interactions).',
    'Adds a footer Snake mini-game easter egg implemented entirely client-side.',
    'Registers a service worker for static asset caching, plus Vercel Analytics and Speed Insights hooks.',
]
for item in features:
    story.append(Paragraph(f'- {item}', style_bullet))

story.append(Spacer(1, 4))
story.append(Paragraph('How it works (repo-evidence architecture)', style_heading))
architecture = [
    'Content/data layer: src/lib/projects.ts reads content/projects/*.mdx via fs + gray-matter, '
    'then sorts/filter projects by frontmatter (including archived).',
    'App routing layer: src/app/page.tsx loads all projects for the home view; '
    'src/app/projects/[slug]/page.tsx loads one project and renders MDX with next-mdx-remote; '
    'src/app/archive/page.tsx renders archived projects.',
    'UI/component layer: AnimatedHomePage, ProjectGridClient, ProjectCard, Header/Footer, and ResumeModal compose the interactive front end.',
    'Resume service flow: /api/resume/status, /api/resume/unlock, and /api/resume/file use src/lib/resumeAuth.ts '
    'to issue and verify signed cookie tokens before returning private/resume/Hunter Bastian Resume.pdf.',
    'Platform/performance layer: Next.js config enables MDX, image optimization, standalone output, cache/security headers, and optional bundle analysis.',
    'Not found in repo: database, message queue/background workers, or third-party API integrations beyond Vercel analytics/speed insights.',
]
for item in architecture:
    story.append(Paragraph(f'- {item}', style_bullet))

story.append(Spacer(1, 4))
story.append(Paragraph('How to run (minimal)', style_heading))
run_steps = [
    'Use Node.js >= 18.17.0.',
    'Install dependencies: npm install',
    'Optional: set RESUME_PASSWORD in .env.local to lock resume access (fallback default exists in code).',
    'Start dev server: npm run dev',
    'Open http://127.0.0.1:3000',
]
for step in run_steps:
    story.append(Paragraph(f'- {step}', style_bullet))

doc = SimpleDocTemplate(
    str(output_path),
    pagesize=letter,
    leftMargin=0.62 * inch,
    rightMargin=0.62 * inch,
    topMargin=0.55 * inch,
    bottomMargin=0.52 * inch,
)

doc.build(story)
print(output_path)
