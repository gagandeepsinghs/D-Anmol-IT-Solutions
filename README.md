# D-Anmol Academy Training Website

A responsive training website for D-Anmol Academy. Enquiries are validated by a server API and saved to MongoDB for the admin inbox.

> **Enquiry setup:** Configure MongoDB in Vercel before launch. Enquiries are stored in the website admin inbox; no spreadsheet integration is used.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Run the project](#run-the-project)
- [Website pages](#website-pages)
- [Project structure](#project-structure)
- [Editing website content](#editing-website-content)
- [Enquiry storage setup](#enquiry-storage-setup)
- [Contact and WhatsApp configuration](#contact-and-whatsapp-configuration)
- [Responsive design and accessibility](#responsive-design-and-accessibility)
- [Build and preview](#build-and-preview)
- [Before production launch](#before-production-launch)

## Features

- Responsive home, course catalogue, course detail, AI & Python, corporate training, About, Contact, and policy pages.
- Searchable course listings and category filters.
- A Courses dropdown that links to published course details.
- Course pages with overviews, explained curriculum modules, skills, project ideas, prerequisites, duration, and learning mode.
- Separate Computer Basics & MS Office and Computer Typing for Government Exams programmes.
- Contact, course, corporate, AI/Python, and demo-request forms with validation and configurable enquiry submission.
- Direct academy contact links for WhatsApp, phone, and email. Admissions are handled directly with the academy; the site has no checkout flow.
- Responsive layouts, subtle hover and motion effects, reduced-motion support, and accessible labels.
- Route-specific page titles, descriptions, canonical URLs, crawl directives, and social metadata.
- Dynamically generated sitemap and robots endpoints, plus proper 404 handling.

## Technology

- React 18 and JavaScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- Vercel serverless API functions and MongoDB for managed website content and enquiry records; admin routes share one function to stay within the Hobby plan's function limit

The React frontend uses serverless API functions for admin access, managed content, and enquiry delivery. MongoDB stores managed pages, site content, uploaded site and course images, and the admin inbox.

## Run the project

### Requirements

- Node.js 18 or newer
- npm

### Install and start

From the project directory, run:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Website pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage with featured courses, categories, learning approach, course-planning steps, FAQs, and enquiry form |
| `/courses` | Searchable and filterable course catalogue |
| `/courses/:slug` | Course overview, modules, outcomes, projects, prerequisites, and enquiry options |
| `/courses/data-analytics` | Data Analytics course; the previous `/courses/data-science-with-python-course-in-chandigarh` URL redirects here |
| `/courses/data-science` | Data Science course and its curriculum-based learning pathway |
| `/courses/computer-basics-ms-office` | Computer fundamentals and Microsoft Word, Excel, and PowerPoint |
| `/courses/computer-typing-government-exams` | Separate typing practice programme for government-exam preparation |
| `/courses/computer-basics-ms-office-typing` | Legacy URL; redirects to the updated Computer Basics & MS Office page |
| `/ai-python` | AI & Python programme catalogue |
| `/ai-python/:slug` | Individual AI & Python programme details |
| `/corporate-training` | Corporate programme information and enquiry |
| `/about` | Editable company overview and practical-learning approach |
| `/contact` | Contact information and enquiry form |
| `/privacy-policy` | How information submitted through enquiries is used |
| `/terms-and-conditions` | Website information, demo requests, and admission process |
| `/refund-cancellation-policy` | Direct contact information for refund and cancellation enquiries |
| `/sitemap.xml` | XML sitemap of public routes |
| `/robots.txt` | Public crawl rules and sitemap location |
| unknown URL | Custom not-found page with HTTP 404 on Vercel and local preview |

The Courses dropdown is populated from the source course list.

## Project structure

```text
src/
  assets/
    images/
      brand/                 Header and footer logos
      courses/
        covers/              Course card and detail images
      sections/              Homepage and other page photos
      references/            Design references not used by the website
  components/                  Shared header, footer, buttons, forms, cards, and floating contact panel
  config/
    siteConfig.js              Brand and contact details, logo imports
  lib/
    submitEnquiry.js           Sends enquiries to the same-origin API
    enquiryValidation.js       Shared name, phone, and optional email validation
  context/
    AppDataContext.jsx         Shared course data
  data/
    courses.js                 Main editable course catalogue and detailed modules
    aiPythonCourses.js         AI & Python catalogue and course details
    categories.js              Catalogue and homepage categories
    faqs.js                    Homepage FAQ content
  pages/                       Route-level page components
  styles.css                   Global styles, responsive layouts, and motion effects
  App.jsx                      Routes and page metadata
  main.jsx                     React and router entry point
index.html                     HTML shell and basic metadata
```

Replace built-in defaults from the admin panel under **Site content → Site photos and logos**. Course and AI & Python cover photos are managed in their respective editors. Each upload accepts JPEG, PNG, or WebP files smaller than 20 MB; larger images are resized and optimized before upload. To change bundled fallback assets, use the matching folder under `src/assets/images/`; see [`src/assets/images/README.md`](./src/assets/images/README.md).

## Editing website content

### Main courses

Edit `src/data/courses.js`. Each course is a JavaScript object with fields such as:

- `id` and `slug` — stable identifier and URL path
- `title`, `category`, `description`, and `overview`
- `duration`, `mode`, and `image`
- `modules` — objects with a `title` and explanatory `description`
- `skills`, `projects`, and `prerequisites`

For example:

```js
{
  id: 'example-course',
  slug: 'example-course',
  title: 'Example Course',
  category: 'Python Programming',
  description: 'A short course summary.',
  duration: 'Contact us for details',
  mode: 'Online or classroom',
  overview: 'A fuller explanation of the course.',
  modules: [
    {
      title: 'Course foundations',
      description: 'Introduce the core concepts through guided examples and practice.',
    },
  ],
  skills: ['Concept one', 'Concept two'],
  projects: ['Build a practical example project.'],
  prerequisites: 'No previous experience required.',
}
```

If adding a category, update `src/data/categories.js`. Homepage category tiles use the category icon list in `src/pages/HomePage.jsx`. The header dropdown uses the course icon list in `src/components/Header.jsx`.

### AI & Python programmes

Edit `src/data/aiPythonCourses.js`. These programmes include `suitableFor`, `level`, technologies, curriculum, outcomes, and project descriptions. Their routes use the `slug` value under `/ai-python/`.

### Other page content

- Homepage copy and learning steps: `src/pages/HomePage.jsx`
- FAQ entries: `src/data/faqs.js`
- Corporate training copy: `src/pages/CorporatePage.jsx`
- About page copy: `src/pages/AboutPage.jsx`
- Brand and contact values: `src/config/siteConfig.js`

Review all course details and placeholders before publishing.

## Enquiry storage setup

Every enquiry form posts `formType`, `name`, `phone`, `email`, `course`, `message`, and `website` to the same-origin API. Corporate enquiries also include `organization`; advisor bookings include `preferredDate`, `preferredTime`, and `referralSource`. The `website` field is a spam honeypot. The form only shows success when the enquiry is saved to MongoDB and the endpoint returns JSON with `{"ok": true}`.

Create a MongoDB Atlas database and set `MONGODB_URI` and `MONGODB_DB` in the Vercel server environment. A local MongoDB address such as `mongodb://127.0.0.1:27017` is only reachable on the same machine and cannot be used by a deployed Vercel function. Keep database credentials out of `VITE_` variables. Test contact, corporate, AI/Python, course, and advisor submissions after deployment; each accepted enquiry should appear in the admin inbox.

`.env.example` is a placeholder for the Atlas connection and required server settings. Replace the URI username and password placeholders for local development; set production values in Vercel. Percent-encode special characters in the database password. Do not commit `.env`. No spreadsheet or email delivery service is used by these forms.

## Contact and WhatsApp configuration

Review the confirmed business details in `src/config/siteConfig.js` before publishing:

- `name`
- `phone`
- `email`
- `whatsappNumber`
- `trainingAreas`

Do not add a public walk-in address. `trainingAreas` describes online training across India and offline training in Mohali, Chandigarh, and Panchkula. The WhatsApp link strips formatting from `whatsappNumber` before opening a `wa.me` conversation.

Enquiry forms post to the same-origin API, which stores the request in MongoDB for the admin inbox. Verify the inbox with an owner-approved test enquiry. WhatsApp opens only after a visitor chooses to continue.

## Responsive design and accessibility

- Layouts adapt for mobile, tablet, and desktop screen widths.
- Navigation and course dropdown support keyboard interaction and mobile toggling.
- Forms have associated labels and visible validation feedback.
- Decorative technology icons are hidden from assistive technology.
- The stylesheet respects the operating system's reduced-motion preference.
- Images should have meaningful alternative text when they convey information; decorative images may use empty alt text.

## Build and preview

Create a production build:

```powershell
npm run build
```

Serve the production build locally:

```powershell
npm run preview
```

The build creates route-specific HTML shells with unique titles, descriptions, canonical paths, and social metadata. Vercel rewrites only known client-side routes; unmatched paths use `public/404.html` and return HTTP 404. Vite development and preview use the same route allowlist and custom 404 behavior.

## SEO and Google Search Console

- `src/data/publicSitePaths.js` is the public route allowlist used by the sitemap and local Vite 404 middleware. `src/data/seoMetadata.js` holds titles and descriptions; update both when adding routes.
- Add each valid app route to `vercel.json` with a rewrite to its generated `/<route>/index.html`. Keep legacy URLs as permanent redirects. Do not add a catch-all SPA rewrite; it turns unknown URLs into HTTP 200 responses.
- `/sitemap.xml` and `/robots.txt` are served by Vercel functions and use `VITE_SITE_URL` when configured, otherwise the request host. Set `VITE_SITE_URL` in the Vercel build environment to the chosen canonical origin (for example `https://www.example.com`) after the production domain is selected.
- Verify the site in Google Search Console using DNS TXT verification after the domain is connected. Then submit `https://<chosen-host>/sitemap.xml`. Alternatively, add the Search Console HTML-tag token as `VITE_GOOGLE_SITE_VERIFICATION` in the Vercel build environment and redeploy.
- Policies are included in the sitemap and indexable; have the academy owner approve their wording before production publication.

## Before production launch

1. Confirm course names, syllabus, durations, modes, prerequisites, and project descriptions with the business.
2. Keep the confirmed public phone and email in `src/config/siteConfig.js`; do not publish a walk-in address.
3. Configure MongoDB Atlas in Vercel and verify enquiry submissions appear in the admin inbox.
4. Confirm the WhatsApp number and the content of `trainingAreas`.
5. Review image rights and approvals in `src/assets/images/`; the active logo artwork has not been approved for replacement.
6. Ensure the required fonts and imagery are available in the intended deployment environment. Geist is loaded from Google Fonts with a system-font fallback.
7. Set `VITE_SITE_URL` to the chosen canonical origin in Vercel, verify Search Console ownership, and submit the sitemap.
8. Run `npm run build` and test the deployed routes, forms, and layouts at common screen widths.

## Admin panel

The full-screen admin panel is available at `/admin`. Configure `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD` (at least 12 characters), and `ADMIN_SESSION_SECRET` (at least 32 random characters) in the server environment before signing in. There is no public registration: management APIs require a signed, HTTP-only admin session, and write requests must be same-origin. Sessions expire after eight hours. The same MongoDB database stores the admin enquiry copy. Keep these values server-side; do not use `VITE_` prefixes.

Signed-in administrators can change the password from the **Password** section. A changed password is stored as a salted scrypt hash in MongoDB and takes precedence over `ADMIN_PASSWORD`; the environment password remains the initial setup fallback. Password changes invalidate existing admin sessions and keep only the current session active.

The panel provides:

- A section-based page builder for existing public routes and new `/pages/<slug>` pages. Add and reorder hero, text, image, course-list, FAQ, and call-to-action sections; save a draft or publish it. Unpublishing or deleting a managed version restores the original built-in page where one exists.
- Guided forms for site settings, courses, course modules and detailed outlines, AI & Python programmes, and FAQs. Site photos and logos, course covers, and programme covers can be replaced with JPEG, PNG, or WebP files smaller than 20 MB and restored to their defaults.
- An enquiry inbox with contact details, status tracking, and deletion. Enquiries are stored in MongoDB.

Saved page and content data uses the configured MongoDB database. Published custom pages are included in the deployed sitemap.
