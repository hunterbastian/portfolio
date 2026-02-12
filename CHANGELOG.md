# Portfolio Changelog

## Version History

### **v2.5.0** - Live Typography & Motion Iteration *(February 12, 2026)*
- Added a detailed private day-log at `private/updates/2026-02-12-portfolio-updates.md` with one-sentence entries for each change made during this iteration.
- Restored terminal-style typography selectively (section labels and metadata) while keeping long-form case-study and experience body copy in Inter for readability.
- Corrected section toggle positioning to stay on the left, strengthened section label stagger sequencing, and refined first-load animation choreography.
- Added a subtle blur fade layer to section and case-study entrances/exits for softer motion without overdoing effects.
- Added the 2021 Google IT Support Professional Certificate in Education and corrected naming/casing adjustments to match intended title case.

### **v2.4.0** - Weekly Highlights *(February 2026)*
- Refined the site's visual direction with luxury/minimal styling updates across global theme, layout, header, and footer.
- Updated the hero intro to highlight Studio Alpine and improved the typewriter behavior (newline handling and cursor stopping at completion).
- Applied broader UI and animation polish, including loader refinements and smoother page-level interactions.
- Refreshed brand assets with a new profile photo and favicon set.
- Simplified homepage structure by removing the category bar and related client/performance overhead.
- Updated site description copy and refreshed the dependency lockfile.

### **v2.3.3** - Spacing Consistency *(August 2025)*
- Improved section spacing consistency throughout portfolio

### **v2.3.2** - Text Size Fix *(August 2025)*
- Fixed bio text size back to original (text-base/16px instead of text-lg/18px)
- Restored proper typography sizing that was accidentally changed during mobile optimization

### **v2.3.1** - Build Fix *(August 2025)*
- Fixed TypeScript errors in iframe props (allowtransparency → allowTransparency)
- Resolved Vercel build failure

### **v2.3.0** - Animation Consistency *(August 2025)*
- Restored Case Studies button animation to match Download Resume button
- Both buttons now have matching hover effects (scale: 1.08, rotate: -3°)
- Intentional left-side cutoff during animation for dynamic visual effect

### **v2.2.0** - Animation Fix *(August 2025)*
- ~~Fixed Case Studies button animation cutoff~~ (Reverted - cutoff is intentional)

### **v2.1.0** - Documentation & Tracking *(August 2025)*
- Added comprehensive changelog for tracking portfolio evolution
- Documented all features and technical decisions

### **v2.0.0** - Mobile & Visual Overhaul *(August 2025)*
- **3D Gems**: Added floating 3D gems from Endless Tools (left: 320px, right: 200px)
- **Mobile Optimization**: Complete responsive overhaul with fluid typography and touch interactions
- **Social Media**: Redesigned for mobile with grid layout and text labels
- **Typography**: Custom Tailwind config with fluid font sizing using `clamp()`
- **Bug Fixes**: Fixed Next.js viewport warnings and font compatibility issues


### **v1.0.0** - Initial Launch *(Previous)*
- Next.js portfolio with project showcase
- Basic responsive design and SEO
- Project filtering and contact form

## Technical Notes

**Current Stack**: Next.js 15 • React 18 • TypeScript • Framer Motion • Tailwind CSS  
**Fonts**: JetBrains Mono • Inter • EB Garamond  
**Deployment**: Vercel • GitHub  

**Known Issues**: JetBrains Mono incompatible with Turbopack (using standard dev mode)
