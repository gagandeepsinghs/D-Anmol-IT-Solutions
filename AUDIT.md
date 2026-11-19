# D-Anmol Academy production audit

Audit date: 2026-11-02  
Scope: repository inspection, production build, local production preview, raw HTML inspection, and rendered-page inspection. No application code was changed for this audit.

## Executive summary

The current site is a polished React SPA, but its production HTML contains no rendered page content. Search engines and link-preview crawlers that do not execute JavaScript receive an empty root element, generic metadata, and no route-specific content. The public enquiry flows are explicitly browser-only demos, the `/admin` route is publicly reachable without authentication, and the configured contact details are placeholders. These are release-blocking issues for a production training-institute site.

## Verification performed

- `npm.cmd run build`: passed with Vite 6.4.5; 1,624 modules transformed; no build warnings were emitted. Output is one main JavaScript bundle (328.39 kB, 96.83 kB gzip) and one CSS bundle (115.41 kB, 22.85 kB gzip).
- `npm.cmd run preview -- --host 127.0.0.1`: started successfully at `http://127.0.0.1:4173/`.
- Raw preview HTML for `/`, `/courses`, `/courses/python-programming`, and `/admin`: all returned HTTP 200 and the same 817-byte shell. Each had `<div id="root"></div>` with zero text/content inside it.
- The rendered preview home page did hydrate correctly in a browser and exposed the expected React content, routes, demo notices, placeholder contact details, sample testimonials, and public Demo admin link. This confirms the problem is the HTML delivered before JavaScript executes, not an inability of the React app to render after hydration.
- The live Vercel fetch could not be completed from this environment because the HTTPS connection closed during receive. The user-provided live-site observation is consistent with the local production preview and source inspection.

## Critical

### 1. No server-rendered or prerendered route content

`dist/index.html` is only the Vite shell. It has an empty root, a single generic title/description, and one JavaScript entry. Every deep route is served the same shell by the preview server. `/courses` and a course detail URL therefore have no headings, course text, links, canonical, Open Graph data, or JSON-LD in raw HTML.

Impact: severe SEO/indexing, social link-preview, and no-JavaScript accessibility failure. The first fix must add static prerendering/SSG for all static routes and every course and AI/Python course detail route generated from data.

### 2. Lead forms do not deliver leads

`EnquiryForm`, `AiPythonEnquiryForm`, and `AdvisorBookingModal` wait briefly and write submissions to browser localStorage. Their visible copy says “Demo only”, “saved in this browser”, and “has not been sent”. There is no `/api/contact`, email provider, database, or server-side validation.

Impact: enquiries can be lost, the business receives no notification, and visitors are misled if the demo wording is overlooked. This requires a server-side Vercel function with validation, honeypot, rate limiting, Resend integration, and clear client states.

### 3. Public unauthenticated admin/editor route

`/admin` is registered in `src/App.jsx`, linked from the production footer, and renders course editing, publish/unpublish, delete, and enquiry viewing controls. It has no authentication or authorization. It reads and writes the same browser localStorage used by the public app.

Impact: anyone can access the dashboard, inspect any browser-local demo enquiries, and alter the public experience in that browser. Default recommendation: remove the route and page from the production build unless real server-side authentication is requested.

### 4. Production contact identity is placeholder data

`src/config/siteConfig.js` contains `+91 00000 00000`, `hello@example.com`, and `Your business address will appear here`. The user-provided real business details are not used. The WhatsApp number is the only configured real contact value.

Impact: visible footer/contact CTAs currently direct visitors to invalid email/phone/address details and undermine local SEO and conversion.

### 5. Public course catalogue is overridden by localStorage

`src/App.jsx` loads and migrates course data from browser localStorage and persists the course catalogue back to it. Public visitors can see stale, modified, unpublished, or seeded demo content depending on their browser. The admin controls mutate this data.

Impact: production content is not deterministic, shareable, or controlled by the repository. Production course content must come from `src/data` only.

## Important

### SEO and discoverability

- Metadata is changed after hydration with `document.title` and a single existing description element. There is no route-safe head system, canonical URL, Open Graph set, Twitter card set, or production-domain constant.
- There is no 1200x630 OG/share image, favicon set, `sitemap.xml`, `robots.txt`, or Search Console verification placeholder.
- There is no JSON-LD for `EducationalOrganization`, FAQ sections, or individual `Course` pages.
- Local intent is weakly and inconsistently represented. The content should use the verified Chandigarh address and natural Chandigarh/IT-training wording without inventing claims.
- The current route inventory includes `/`, `/courses`, `/courses/:slug`, `/ai-python`, `/ai-python/:slug`, `/corporate-training`, `/about`, `/contact`, `/faq`, `/admin`, and a wildcard 404. The future build must enumerate every course and AI/Python course detail URL.

### Content and trust risks

- The home page visibly renders three illustrative testimonials under “Words from learners”. They are marked sample/unverified, but they are still testimonial-shaped content and should be removed or retained only with explicit owner approval and real verification.
- The source contains a “6 Weeks Summer Training” menu item and “Career Course” language. The latter correctly says outcomes/opportunities are not guaranteed, but production copy must consistently use “placement and career guidance support” and “we do not guarantee placement”.
- There are no Privacy Policy, Terms of Service, or Refund Policy routes/pages. The requested policies need clearly marked owner-fill placeholders before launch.
- A custom 404 component exists, but route-level static output and metadata for it do not exist.
- The Contact page has a visible placeholder notice and no map/directions link.
- Fees are not displayed, which is appropriate; the production CTA should direct visitors to call or WhatsApp for fee information.

### Conversion and contact paths

- Floating WhatsApp exists with a prefilled message. The floating advisor action opens a demo modal, but there is no distinct floating Call button.
- The header has an “Explore courses” CTA and advisor/contact paths, but the requested “Book Free Demo” and “Call Now” coverage across header, hero, mid-page, and footer is not present as explicit production CTAs.
- Footer contact links currently use placeholder email/phone/address and link to the public Demo admin page.

### Accessibility and interaction

- Some icon-only controls have accessible labels and the browser snapshot showed meaningful image alt text in several places.
- A skip link was not found in the inspected source. Route changes only call `window.scrollTo`; there is no focus move or live route announcement.
- `AdvisorBookingModal` stores the opener and handles Escape, but the source needs a focused keyboard audit to verify true focus trapping, initial focus, background inertness, and all ARIA relationships. Its modal copy currently describes a browser-only demo request.
- Menu buttons use `aria-expanded`, but keyboard behavior, focus return, and menu semantics should be verified at 360px and with keyboard-only navigation.
- Images generally lack explicit intrinsic `width`/`height` attributes. Decorative icon images also appear in the rendered accessibility tree without consistent review of hidden/decorative semantics.
- Training marquee CSS includes a non-animated responsive rule, but a dedicated `prefers-reduced-motion` rule was not found in the inspected styles.
- Global focus styling, color contrast, form error association, and modal focus behavior need WCAG AA verification.

### Performance and maintainability

- All routes are included in one eagerly loaded JS bundle; route components are not lazy-loaded/code-split.
- Source assets are JPEG/PNG only. Several images are large for their display size, including a 680 kB digital-marketing image, 486 kB team-project image, and 407 kB artificial-intelligence image in the build output. No WebP/AVIF variants were found.
- CSS output is 115.41 kB and `src/styles.css` is large with duplicated/overlapping responsive rules; dead CSS review is needed.
- The app imports Google Fonts via `index.html`; self-hosted Inter with `font-display: swap` should be evaluated.
- No unused-dependency check or Lighthouse run was performed in this audit. The package manifest is small, but `lucide-react` and all route code are bundled into the main chunk.

### Deployment and security configuration

- No `vercel.json` exists for SPA/static-route behavior, clean URLs, security headers, or hashed-asset caching.
- `.gitignore` does not ignore `.env`, `.env.*`, or local Vercel files. There is no `.env.example`.
- No API folder or server-side secret boundary exists. Any Resend key must remain server-only.
- No security headers were observed in the local preview configuration; production Vercel headers need to be added and verified after deployment.

## Nice-to-have

- Add a proper favicon set, final owner-approved logo, optimized share image, and useful image dimensions/crops.
- Add automated route/content checks that fail the build if a route is missing a unique title, description, canonical, one H1, JSON-LD, or prerendered body text.
- Add link checking for all internal links and an automated 360px/768px/1280px smoke test.
- Add form integration tests for valid/invalid payloads, Indian mobile validation, honeypot rejection, rate limiting, Resend failures, loading, success, and error states.
- Add Lighthouse mobile baselines and post-fix scores. No before/after score is claimed here because Lighthouse was not available in the current environment.
- Review unused CSS and any dependencies after the production architecture changes.

## Owner approval items before implementation

1. Approve removing `/admin` and its footer link from production (recommended), or provide a real authentication requirement.
2. Approve removal or replacement of the three sample testimonials; no testimonials or claims will be treated as real without owner verification.
3. Provide owner-approved Privacy Policy, Terms, and Refund Policy wording, or approve clearly marked placeholders.
4. Provide final logo, favicon, and 1200x630 OG image if the existing assets are not final.

## Recommended Step 2 order

1. Add deterministic static prerendering for every route and course detail page.
2. Centralize verified business data and implement per-route metadata, structured data, sitemap, robots, favicon, and OG assets.
3. Replace all three demo submission paths with `/api/contact` and server-side validation/email delivery.
4. Remove the unauthenticated admin/demo surface and localStorage catalogue/enquiry persistence.
5. Add legal pages, map link, production CTAs, accessibility fixes, performance optimizations, and Vercel/security configuration.
