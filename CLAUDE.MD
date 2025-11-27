# CLAUDE.MD - Portfolio Project Guide

## Project Overview

This is Hunter Bastian's personal portfolio website built with Next.js 15, showcasing projects, skills, and professional experience with modern 3D effects and animations.

**Live Site**: [Portfolio URL]
**Repository**: [GitHub URL]
**Tech Stack**: Next.js 15.4.6 • React 19 • TypeScript • Tailwind CSS • Framer Motion • Three.js

## Project Structure

```
portfolio/
├── src/
│   ├── app/              # Next.js 15 App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and helpers
│   └── types/           # TypeScript type definitions
├── content/             # MDX content for projects/blog
├── public/              # Static assets
├── scripts/             # Build and optimization scripts
└── [config files]       # Various configuration files
```

## Key Features

### 1. **3D Graphics & Animations**
- Floating 3D gems using Three.js (@react-three/fiber, @react-three/drei)
- Smooth animations with Framer Motion
- Interactive hover effects and transitions

### 2. **MDX Content Management**
- Project pages written in MDX
- Next.js MDX integration (@next/mdx, next-mdx-remote)
- Gray-matter for frontmatter parsing

### 3. **Performance Optimizations**
- Bundle size reduced by 46% (see commit: ad35764)
- Lighthouse budget monitoring (.lighthousebudgets.json)
- Bundle analysis available (`npm run build:analyze`)
- Critters for critical CSS inlining
- Image optimization scripts

### 4. **Responsive Design**
- Mobile-first approach with fluid typography
- Custom Tailwind config with `clamp()` for responsive sizing
- Touch-friendly interactions

### 5. **Analytics & Monitoring**
- Vercel Analytics integration
- Vercel Speed Insights
- Web Vitals tracking

## Development Commands

```bash
# Development
npm run dev              # Standard dev server
npm run dev:turbo        # Turbo mode (incompatible with JetBrains Mono font)

# Building
npm run build            # Production build
npm run build:analyze    # Build with bundle analysis
npm run start            # Start production server

# Quality & Performance
npm run lint             # Run ESLint
npm run performance      # Build + analyze bundle
npm run lighthouse       # Run Lighthouse audit (requires local server)
npm run optimize-images  # Optimize image assets
```

## Important Technical Notes

### Known Limitations
- **JetBrains Mono font incompatible with Turbopack** - Use standard `npm run dev`
- Node.js version: >=18.17.0 (see .nvmrc)

### Recent Major Changes
- **Commit 54b983c**: Improved error handling in project pages and MDX components
- **Commit 90a81d6**: Resolved project page errors with better error handling
- **Commit a324821**: Enhanced smoothness and animations
- **Commit ad35764**: Major performance optimization (46% bundle reduction)

### Typography
- **JetBrains Mono**: Code/monospace text
- **Inter**: Primary UI font
- **EB Garamond**: Serif accents

### Configuration Files
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS customization (fluid typography)
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.mjs` - ESLint rules
- `.lighthousebudgets.json` - Performance budgets

## Working with This Project

### Adding New Projects
1. Create MDX file in `content/` directory
2. Add frontmatter with project metadata
3. Include images in `public/` directory
4. Project will auto-populate in portfolio

### Modifying Styles
- Tailwind classes in components
- Custom config in `tailwind.config.ts`
- Global styles in app directory

### Performance Considerations
- Always run `npm run build:analyze` after major changes
- Check bundle size impact
- Monitor Lighthouse scores
- Use image optimization script before adding new images

### Error Handling
Recent improvements (commits 54b983c, 90a81d6) added better error boundaries for:
- Project page loading
- MDX component rendering
- Missing content graceful fallbacks

## Deployment

Deployed on Vercel with automatic deployments from GitHub.

### Environment Variables
(Document any required env vars here)

## Git Workflow

- **Main branch**: `master`
- Current worktree: `admiring-mcclintock`
- Keep commits atomic and descriptive
- Reference CHANGELOG.md for version history

## Debugging Tips

1. **Build failures**: Check TypeScript errors first
2. **Performance issues**: Run bundle analyzer
3. **3D rendering issues**: Check Three.js console warnings
4. **MDX errors**: Verify frontmatter and component imports
5. **Font issues**: Ensure not using Turbopack with JetBrains Mono

## Dependencies to Watch

### Critical Dependencies
- `next`: App framework (v15.4.6)
- `react`, `react-dom`: UI library (v19.0.0)
- `@next/mdx`: Content management
- `framer-motion`: Animations
- `three`, `@react-three/fiber`: 3D graphics

### Dev Dependencies
- `@next/bundle-analyzer`: Performance monitoring
- `sharp`: Image optimization
- `typescript`: Type safety

## Additional Resources

- [CHANGELOG.md](./CHANGELOG.md) - Detailed version history
- [README.md](./README.md) - Basic project info
- `.github/` - GitHub workflows and templates
