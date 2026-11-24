# D-Anmol Enterprises Website — Technology and Architecture

## Project overview

D-Anmol Enterprises’ website is a responsive course discovery and enquiry site. Visitors can browse the institute’s courses, read course outlines, learn about corporate training, and contact the team. The site does not provide online checkout, student accounts, or a database-backed course editor.

The application is a browser-rendered React single-page application (SPA), built with Vite. Its public pages and route-specific HTML metadata are prepared during the production build. The page content itself is rendered by React in the browser; this is not server-side rendering (SSR).

## Technology stack

| Area | Technology | Use |
| --- | --- | --- |
| UI | React 18, React DOM | Components and browser rendering |
| Language | JavaScript and JSX | Application logic and UI |
| Routing | React Router DOM 6 | Client-side page navigation and course routes |
| Build tooling | Vite 6, `@vitejs/plugin-react` | Local development and production bundling |
| Styling | Authored CSS, Tailwind CSS 3, PostCSS, Autoprefixer | Responsive design, stylesheets, and CSS processing |
| Icons | Lucide React | Interface and content icons |
| Typography | Inter from Google Fonts, with system font fallbacks | Site-wide typography |
| Enquiry storage | MongoDB | Stores submitted enquiries for the admin inbox |
| Hosting configuration | Vercel configuration and serverless functions | Route rewrites, redirects, sitemap, and robots endpoints |

Most of the visible design is implemented in `src/styles.css` and component CSS files. Tailwind is configured in `tailwind.config.js`, but the main page styling is authored CSS rather than a Tailwind-only UI.

## Main site features

- Homepage, course catalogue, individual course pages, and AI/Python programme pages
- About, Contact, Corporate Training, FAQ, and policy pages
- Course search and category filtering
- Course outlines, learning modules, topics, projects, and technology badges
- Contact/enquiry forms with client-side validation and loading, success, and error states
- Advisor booking modal and floating contact actions
- Responsive navigation, mobile layouts, reduced-motion support, and accessible form labels
- Route-specific titles, descriptions, canonical and social metadata
- EducationalOrganization JSON-LD, sitemap, robots rules, legacy redirects, and not-found handling

Enquiry submission and the admin inbox require a configured MongoDB database.

## Routes

Routes are declared in `src/App.jsx`; public routes are also listed in `src/data/publicSitePaths.js`.

| Route pattern | Page |
| --- | --- |
| `/` | Homepage |
| `/courses` | Course catalogue |
| `/courses/:slug` | Course detail and syllabus |
| `/ai-python` | AI/Python programme catalogue |
| `/ai-python/:slug` | AI/Python programme detail |
| `/corporate-training` | Corporate training |
| `/about` | About the academy |
| `/contact` | Contact and enquiry form |
| `/faq` | Frequently asked questions |
| Any unmatched path | Not-found page |

Legacy course URLs redirect to their current routes. Course and programme routes are generated from the public slug lists and mapped to local course data.

## Application structure

```text
api/
  lib/seoResponses.js       Shared sitemap.xml and robots.txt response builders
  robots.js                Vercel robots.txt function
  sitemap.js               Vercel sitemap.xml function
public/
  404.html                 Static not-found response used by local preview
src/
  App.jsx                  App shell, routes, and client-side metadata updates
  main.jsx                 React and BrowserRouter entry point
  styles.css               Global styles, tokens, responsive rules
  assets/images/           Brand, course, module, and section imagery
  components/              Shared navigation, cards, forms, modal, and UI
  config/siteConfig.js     Brand/contact values and logo assets
  context/                 Shared application data context
  data/                    Course, syllabus, FAQ, route, and SEO data
  lib/                     Enquiry validation and submission helpers
  pages/                   Route-level page components
index.html                 Vite HTML entry point and base SEO/schema markup
vite.config.js             Vite setup and build/preview SEO route plugin
vercel.json                Vercel rewrites and legacy redirects
```

### Key data files

- `src/data/courses.js` — Main course catalogue and course detail content
- `src/data/aiPythonCourses.js` — AI/Python curricula and programme details
- `src/data/courseSyllabi.json` — Course module outlines and syllabus durations
- `src/data/courseSyllabi.js` — Syllabus-folder mappings
- `src/data/categories.js` — Course categories
- `src/data/faqs.js` — FAQ entries
- `src/data/moduleTechnologies.js` — Technology labels associated with modules
- `src/data/seoMetadata.js` — Public route titles and descriptions
- `src/data/publicSitePaths.js` — Public route allowlist and legacy redirects
- `src/config/siteConfig.js` — Academy name, phone, email, WhatsApp, service areas, and logos

Course information is bundled with the frontend; it is not loaded from a CMS or database. `AppDataContext` exposes the catalogue to components.

## Forms and enquiry flow

`EnquiryForm`, `AiPythonEnquiryForm`, and `AdvisorBookingModal` use shared validation/submission helpers under `src/lib/`.

1. The browser validates the form fields.
2. `src/lib/submitEnquiry.js` sends a JSON payload to the same-origin `/api/enquiry` endpoint.
3. The endpoint validates and stores the enquiry in MongoDB, where it appears in the admin inbox.
4. The frontend shows success only after the enquiry has been stored.

The hidden `website` field is a spam honeypot validated by the server API. The application does not send email or forward enquiries to a spreadsheet. MongoDB must be configured and tested in the deployment environment before launch.

Environment variable names are listed in `.env.example`:

- `VITE_SITE_URL` — chosen canonical site origin, used by build/deployment SEO endpoints
- `VITE_GOOGLE_SITE_VERIFICATION` — optional Google Search Console HTML verification token

Values with the `VITE_` prefix are included in browser-side build configuration; do not put private credentials in them.

## SEO, routing, and rendering

- `src/data/seoMetadata.js` contains static route metadata. Course routes also derive titles and descriptions from course data.
- `App.jsx` updates the document title, description, canonical, robots, Open Graph, and Twitter metadata after client-side navigation.
- The Vite build plugin in `vite.config.js` creates route-specific HTML files and metadata for each allowlisted route. These files contain the app shell; React renders page content after JavaScript loads.
- `api/sitemap.js` and `api/robots.js` expose sitemap and robots responses on Vercel, using shared helpers from `api/lib/seoResponses.js`.
- The Vite development/preview middleware provides matching sitemap/robots behavior and local redirects/404 handling.
- `vercel.json` maps known routes to their generated HTML files and defines permanent legacy redirects. It also routes `/sitemap.xml` and `/robots.txt` to the Vercel functions.
- Vercel hosting and build settings have not been verified against a live deployment. A real HTTP 404 and search indexing should be confirmed after launch.

## Styling, fonts, and images

- `src/styles.css` defines global styles, design tokens, shared components, and many responsive adjustments.
- Component stylesheets live beside their components, including `CourseSyllabus.css` and `AdvisorBookingModal.css`.
- The site uses a navy/blue foundation, orange accents, light neutral surfaces, and Inter typography.
- `index.html` loads Inter from Google Fonts with system fallbacks.
- Local image assets are grouped under `src/assets/images/brand/`, `courses/`, and `sections/`. Optimized WebP variants are used where available.
- `src/assets/images/README.md` documents the image folders and replacement process.

## Hosting and external services

The repository is currently configured for **Vercel**: `vercel.json` and the `api/` functions use Vercel deployment conventions. The built frontend is static, while the admin, enquiry, sitemap, and robots endpoints use serverless functions backed by MongoDB.

Deploying to another provider (including Hostinger) requires checking or adapting:

- SPA route rewrites, generated route HTML, and legacy redirects
- Sitemap and robots endpoints, currently implemented as Vercel functions
- Build-time environment variables and the canonical site origin
- Actual status codes for unknown routes

No hosting provider account, production domain, production endpoint, or live enquiry flow is configured by this repository documentation.

## Local development and build

Requirements: Node.js 18 or newer and npm.

```powershell
npm install
npm run dev
npm run build
npm run preview
```

The production build is written to `dist/`. `npm run preview` serves that output locally and exercises the Vite preview middleware. It does not deploy the site.

## Current boundaries and launch checks

- A MongoDB-backed admin CMS, login, and enquiry inbox are included. Public registration and checkout are not included.
- Enquiry storage, admin content, and saved images require MongoDB Atlas configuration for deployment.
- Domain purchase, hosting account setup, DNS, production environment variables, and Search Console verification are external launch tasks.
- Owner approval is still needed for final course details, syllabus mappings, and legal policy text.
- Validate live routes, 404 status, sitemap, robots, forms, mobile layouts, accessibility, and performance after deployment.
