# D-Anmol Enterprises SEO Audit

## Implementation status

- Audited the React 18, Vite, React Router, Vercel and MongoDB architecture.
- Added route-specific titles and descriptions for public pages and the eight requested courses.
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

## Crawl and index configuration

- `/sitemap.xml` is generated dynamically by the existing Vercel API and includes public, real routes.
- `/robots.txt` is generated dynamically and excludes `/admin` and `/api/`.
- Non-www traffic is redirected to the www HTTPS domain through the Vercel host redirect.
- Trailing-slash redirects and legacy course redirects remain enabled.
- Public pages return index/follow metadata; the admin page is noindex/nofollow.
- Unknown routes serve the custom 404 page and do not receive public route canonical tags.

## Structured data

Organization and EducationalOrganization data uses only the verified public email, phone and requested service areas. No address, rating, review, accreditation, certification or placement claim was invented. Course JSON-LD is generated from each course route. FAQ JSON-LD is present for the eight requested course pages.

## Blog architecture

The blog topic architecture is stored in `src/data/blogTopics.js`. It defines the `/blog/[slug]` route pattern and sitemap policy without publishing empty or placeholder articles. Suggested search intents link only to genuinely relevant course pages.

## Technical performance

- Route-level page bundles use React lazy loading and `Suspense`.
- Existing WebP and JPG course and section assets remain in place.
- Below-the-fold course and section images use lazy loading.
- The core page bundle was 440.95 kB (110.88 kB gzip) after the successful build.
- Google Fonts remain preconnected and images above the fold use `fetchpriority="high"`.
- Mobile responsiveness and reduced-motion handling are preserved.

## Verification

- `npm run build` completed successfully.
- Vite SSR/prerender completion passed.
- All eight course routes, core public routes and `/admin` returned HTTP 200 in the production preview.
- `/does-not-exist` returned HTTP 404.
- The eight course pages contain unique titles, preferred-domain canonical tags and index/follow directives.
- The sitemap and robots endpoints returned HTTP 200 in the production preview.
- JSON-LD tags are emitted for Organization, EducationalOrganization, WebSite, BreadcrumbList and Course.

## Manual configuration remaining

Set these variables only in Vercel or approved local environment files:

1. `VITE_GOOGLE_SITE_VERIFICATION`: add the exact HTML verification token from Google Search Console.
2. `VITE_GA_MEASUREMENT_ID`: add the exact GA4 measurement ID, normally in `G-...` format.
3. Confirm `VITE_SITE_URL=https://www.danmolenterprises.com` in deployment configuration.
4. Submit `/sitemap.xml` in Google Search Console after deployment.
5. Verify the www and non-www hosts in Google Search Console.
6. Test MongoDB-backed course, contact and demo forms using authorized test submissions.
