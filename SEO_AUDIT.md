# D-Anmol Enterprises SEO Audit

## Implementation status

- Audited the React 18, Vite, React Router, Vercel and MongoDB architecture.
- Added route-specific titles and descriptions for all 22 static public routes, including ten public course pages.
- Prerendered full route content after lazy components resolve and mapped source image URLs to bundled production assets.
- Prevented API data refreshes from interrupting hydration of prerendered pages.
- Set the preferred canonical domain to `https://www.danmolenterprises.com`.
- Added Organization, EducationalOrganization, WebSite, BreadcrumbList and Course JSON-LD.
- Added course-specific FAQ content and FAQPage JSON-LD for the eight courses.
- Added breadcrumbs and crawlable related-course links to course detail pages.
- Added route-based React lazy loading.
- Prepared optional GA4 and lead-event support without adding any measurement ID.
- Preserved existing branding, images, forms, MongoDB behaviour and route functionality.
- Confirmed `/admin` is excluded from robots and emitted `noindex,nofollow`.

## Course keyword map

1. **AI Automation**
   - Primary: AI Automation course, online AI Automation course in India
   - Local: AI Automation course in Chandigarh, AI Automation training in Mohali, AI Automation classes in Panchkula
2. **Full Stack Development**
   - Primary: Full Stack Development course, online Full Stack Development course in India
   - Local: Full Stack Development institute in Chandigarh, Mohali and Panchkula
3. **Data Analytics**
   - Primary: Data Analytics course, online Data Analytics course in India
   - Local: Data Analytics classes in Chandigarh, Mohali and Panchkula
4. **Data Science**
   - Primary: Data Science course, online Data Science course in India
   - Local: Data Science training in Chandigarh, Mohali and Panchkula
5. **Computer Basics for Government Exams**
   - Primary: Computer Basics course, online Computer Basics course in India
   - Local: Computer Basics classes in Chandigarh, Mohali and Panchkula
6. **Shorthand Stenography**
   - Primary: Shorthand Stenography course, online Shorthand Stenography course in India
   - Local: shorthand classes in Chandigarh, Mohali and Panchkula
7. **Computer Typing**
   - Primary: Computer Typing course, typing course for government exams
   - Local: Computer Typing course in Chandigarh, Mohali and Panchkula
8. **Digital Marketing**
   - Primary: Digital Marketing course, online Digital Marketing course in India
   - Local: Digital Marketing institute in Chandigarh, Mohali and Panchkula
9. **Artificial Intelligence and Machine Learning**
   - Primary: Artificial Intelligence and Machine Learning course, machine learning course online in India
   - Local: AI and machine learning training in Chandigarh, Mohali and Panchkula
10. **Generative AI**
    - Primary: Generative AI course, GenAI course online in India
    - Local: Generative AI training in Chandigarh, Mohali and Panchkula

## Crawl and index configuration

- `/sitemap.xml` is generated dynamically by the existing Vercel API and includes public, real routes.
- `/robots.txt` is generated dynamically and excludes `/admin` and `/api/`.
- Non-www traffic is redirected to the www HTTPS domain through the Vercel host redirect.
- Trailing-slash redirects and legacy course redirects remain enabled.
- Public pages return index/follow metadata; the admin page is noindex/nofollow.
- Unknown routes serve the custom 404 page and do not receive public route canonical tags.

## Structured data

Organization and EducationalOrganization data uses only the verified public email, phone and requested service areas. No address, rating, review, accreditation, certification or placement claim was invented. Course JSON-LD is generated for public course routes. FAQ JSON-LD is present for the eight specifically authored course FAQ sets.

## Blog architecture

The blog topic architecture is stored in `src/data/blogTopics.js`. It defines the `/blog/[slug]` route pattern and sitemap policy without publishing empty or placeholder articles. Suggested search intents link only to genuinely relevant course pages.

## Technical performance

- Route-level page bundles use React lazy loading and `Suspense`.
- Existing WebP and JPG course and section assets remain in place.
- Below-the-fold course and section images use lazy loading.
- The core page bundle was 436.96 kB (109.73 kB gzip) after the latest successful build.
- Google Fonts remain preconnected and images above the fold use `fetchpriority="high"`.
- Mobile responsiveness and reduced-motion handling are preserved.

## Verification

- `npm run build` completed successfully, and the prerender step fails on a missing page H1, unresolved Suspense fallback, or unbundled source image URL.
- All 22 public routes were checked at 11 viewport widths from 320 px to 1920 px: no horizontal overflow, missing H1, duplicate title, or incorrect canonical/robots metadata was found.
- 137 rendered images decoded successfully across the public routes, with no browser hydration errors.
- Mobile navigation, Escape/focus return, advisor modal bounds and validation, course search, syllabus request-panel interaction, and enquiry-field validation were exercised in the production preview.
- `/`, `/courses`, representative course routes, `/admin`, `/sitemap.xml`, and `/robots.txt` returned expected responses; trailing-slash and legacy routes redirected, and an unknown route returned HTTP 404.
- The sitemap contains 22 public URLs and excludes `/admin`; `/robots.txt` disallows `/admin` and `/api/`.
- JSON-LD parses on all public routes. The home page emits one Organization entity plus WebSite and BreadcrumbList; course and FAQ schemas are present where configured.
- The 22 static public routes were tested locally. Live API-backed form delivery and dynamic pages were not submitted or changed during testing.

## Manual configuration remaining

Set these variables only in Vercel or approved local environment files:

1. `VITE_GOOGLE_SITE_VERIFICATION`: add the exact HTML verification token from Google Search Console.
2. `VITE_GA_MEASUREMENT_ID`: add the exact GA4 measurement ID, normally in `G-...` format.
3. Confirm `VITE_SITE_URL=https://www.danmolenterprises.com` in deployment configuration.
4. Submit `/sitemap.xml` in Google Search Console after deployment.
5. Verify the www and non-www hosts in Google Search Console.
6. Deploy the current local changes before relying on the live site; the production domain does not include these fixes until Vercel finishes a new deployment.
7. Test MongoDB-backed course, contact and demo forms using owner-approved test submissions. No real enquiry was submitted during this audit.
8. Privacy, terms and refund-policy pages are not implemented. Add them only with owner-approved legal text.
