## Modern US Logistics Website

Marketing + functional logistics site focused on real offered services (Last-Mile Delivery, Dispatch Operations, Vehicle Relocation) built with:

- Next.js (App Router, TypeScript)
- Tailwind CSS
- React Hook Form + Zod (forms & validation)
- API Routes (mock tracking + quote submission)
- Vitest + Testing Library (unit tests)

### Features Implemented

- Responsive marketing pages (Home, Services, About, Contact, Track, Quote)
- Animated hero (framer-motion) with stat counters
- Dynamic services listing + individual service detail pages
- Quote request form with validation posting to `/api/quote`
- Contact form with Zod validation
- Tracking UI with timeline consuming mock `/api/track?tn=NUMBER`
- Dark mode toggle (class strategy)
- Breadcrumbs, loading skeletons, custom 404
- Shared design tokens & custom Tailwind theme
- Basic test setup (Vitest)

### Getting Started

Install dependencies:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```
Visit http://localhost:3000

### Environment Variables

Copy `.env.example` to `.env.local` and fill as needed.

### Testing
```bash
npm test
```

### Project Structure (Key)
```
src/
	app/                # App Router pages & API routes
	components/         # UI & layout components
	lib/                # Data utilities
	types/              # Shared TypeScript types
```

### API Examples
- Quote: POST /api/quote { name,email,origin,destination,weightKg,mode,notes? }
- Track: GET /api/track?tn=ABC123

### Future Enhancements
Real carrier API integrations, customer portal (auth dashboard), analytics, i18n, accessibility audits, performance budgets, CI/CD pipeline, infrastructure as code, caching layer, background job queue, optional CMS if blog reinstated.

### License
Private (proprietary) – adjust as required.
