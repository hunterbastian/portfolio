# Portfolio Changelog

## Version History

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
