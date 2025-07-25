# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Start the Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Create production build
- **Start production**: `npm start` - Start production server
- **Lint**: `npm run lint` - Run ESLint to check code quality
- **Post-build**: `npm run postbuild` - Generate sitemap after build (runs automatically)

## Architecture Overview

This is a Next.js 13+ application using the App Router architecture that showcases Stanford University's a cappella groups. The site is built with TypeScript and uses Chakra UI for styling.

### Key Architectural Components

**App Router Structure (`src/app/`)**:
- Dynamic routing for group pages: `[slug]/page.tsx` 
- Individual group audition pages: `[slug]/audition/page.tsx`
- Group website redirects: `[slug]/site/page.tsx`
- Promotional redirects: `groupPromo/[slug]/page.tsx`

**Configuration System (`src/app/config/`)**:
- `groups.tsx` - Central configuration for all a cappella groups with type-safe interfaces
- `branding.tsx` - Brand colors and styling constants
- Voice part enumeration using bitwise flags for flexible group categorization

**Component Architecture**:
- **Group Pages**: Individual components for each group in `components/group-pages/`
- **Shared Components**: Reusable UI components in `components/shared/`
- **Template System**: `components/group-pages/template.tsx` provides consistent structure

**Data Model**:
- `ACappellaGroup` interface defines group structure with metadata, social links, and SEO configuration
- `VoicePart` enum uses bitwise operations for flexible voice part combinations
- Groups array indexed by slug for dynamic routing

### Key Features

**Dynamic Group Management**:
- Groups are defined once in `groups.tsx` and automatically generate pages, navigation, and metadata
- SEO-optimized with custom descriptions, keywords, and Open Graph data
- Audition link management with active/inactive states

**Responsive Design**:
- Mobile-first approach with Chakra UI responsive system
- Stanford branding integration with custom fonts and colors
- Safe area handling for mobile devices

**Performance Optimizations**:
- Next.js Image optimization for group photos
- Automatic sitemap generation
- Google Analytics integration (production only)

## Development Guidelines

**Adding New Groups**:
1. Create group component in `components/group-pages/`
2. Add group to `GROUPS` object in `config/groups.tsx`
3. Add slug to `GROUPS_WITH_CURRENT_AUDITION_LINKS` if auditions are active
4. Add group images to `public/assets/img/`

**Group Configuration**:
- Use `VoicePart` bitwise flags for voice parts (e.g., `VoicePart.SATB` for all parts)
- Include `extraKeywords` for SEO aliases (e.g., "harmz" for Harmonics)
- Set `descriptionImgUrl` for different images on detail pages
- Configure `socialLinks` with partial object (only include available platforms)

**Styling**:
- Uses Chakra UI component system with custom theme
- Stanford Cardinal Red: `#8c1515`
- Custom Stanford font loaded via CSS
- Mobile-responsive design patterns throughout

**SEO and Analytics**:
- Google Analytics configured for production environment
- Cookie consent banner implementation
- Automatic sitemap generation via next-sitemap
- Open Graph metadata for social sharing

## Deployment Notes

- Live website is deployed at acappella.stanford.edu. Formerly stanfordacappella.com