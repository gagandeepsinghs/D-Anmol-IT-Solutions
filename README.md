# D-Anmol Enterprises Training Website

A responsive, frontend-only training website for D-Anmol Enterprises. It presents technology and office-skills courses, explains course modules, supports demo enquiries, and includes a browser-only demo course manager.

> **Demo status:** This project does not have a backend, email delivery, WhatsApp API, or secure admin authentication. Public forms and admin changes are local browser demonstrations only.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Run the project](#run-the-project)
- [Website pages](#website-pages)
- [Project structure](#project-structure)
- [Editing website content](#editing-website-content)
- [Demo forms and browser storage](#demo-forms-and-browser-storage)
- [Contact and WhatsApp configuration](#contact-and-whatsapp-configuration)
- [Responsive design and accessibility](#responsive-design-and-accessibility)
- [Build and preview](#build-and-preview)
- [Before production launch](#before-production-launch)

## Features

- Responsive home, course catalogue, course detail, AI & Python, corporate training, About, Contact, and demo admin pages.
- Searchable course listings and category filters.
- A Courses dropdown that links to published course details.
- Course pages with overviews, explained curriculum modules, skills, project ideas, prerequisites, duration, and learning mode.
- Separate Computer Basics & MS Office and Computer Typing for Government Exams programmes.
- Contact, course and corporate enquiry forms with required-field and email validation, loading feedback, and demo-only confirmation.
- Demo course management for adding, editing, publishing/unpublishing, and deleting catalogue entries.
- Configurable contact details and a WhatsApp-style contact panel. Until a real WhatsApp number is configured, the panel links to the Contact page.
- Responsive layouts, subtle hover and motion effects, reduced-motion support, and accessible labels.
- Page titles and meta descriptions updated for the current route.

## Technology

- React 18 and JavaScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- Browser `localStorage` for demo course edits and enquiry records

There is no application server, external database, or third-party form backend in this project.

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
| `/` | Homepage with featured courses, categories, learning approach, sample testimonials, FAQs, and demo enquiry form |
| `/courses` | Searchable and filterable course catalogue |
| `/courses/:slug` | Course overview, modules, outcomes, projects, prerequisites, and enquiry options |
| `/courses/computer-basics-ms-office` | Computer fundamentals and Microsoft Word, Excel, and PowerPoint |
| `/courses/computer-typing-government-exams` | Separate typing practice programme for government-exam preparation |
| `/courses/computer-basics-ms-office-typing` | Legacy URL; redirects to the updated Computer Basics & MS Office page |
| `/ai-python` | AI & Python programme catalogue |
| `/ai-python/:slug` | Individual AI & Python programme details |
| `/corporate-training` | Corporate programme information and demo enquiry |
| `/about` | Editable company overview and practical-learning approach |
| `/contact` | Contact placeholders and demo contact form |
| `/admin` | Browser-only demo course manager and enquiry list |

The Courses dropdown is populated from the locally loaded course list and omits courses marked unpublished.

## Project structure

```text
src/
  assets/
    images/                    Brand logos and locally stored website photos
  components/                  Shared header, footer, buttons, forms, cards, and floating contact panel
  config/
    siteConfig.js              Brand and contact placeholders, logo imports, storage keys
  context/
    AppDataContext.jsx         Shared course and enquiry state
  data/
    courses.js                 Main editable course catalogue and detailed modules
    aiPythonCourses.js         AI & Python catalogue and course details
    categories.js              Catalogue and homepage categories
    faqs.js                    Homepage FAQ content
  pages/                       Route-level page components
  styles.css                   Global styles, responsive layouts, and motion effects
  App.jsx                      Routes, metadata, and browser demo persistence
  main.jsx                     React and router entry point
index.html                     HTML shell and basic metadata
```

Website image assets are kept together in `src/assets/images/`. Course and page photos are bundled locally with the site; images added later through the demo admin form may still use an externally supplied image URL.

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

- Homepage copy and sample testimonials: `src/pages/HomePage.jsx`
- FAQ entries: `src/data/faqs.js`
- Corporate training copy: `src/pages/CorporatePage.jsx`
- About page copy: `src/pages/AboutPage.jsx`
- Brand and contact values: `src/config/siteConfig.js`

Testimonials are explicitly labelled as sample content. Review all course details and placeholders before publishing.

## Demo forms and browser storage

Forms validate required fields and email format, show a brief loading state, and then display a demo-only confirmation. They do **not** send submissions to D-Anmol Enterprises.

Demo course edits and enquiry records are stored in the visitor's browser:

- `danmol-demo-courses` — demo course catalogue edits and publish status
- `danmol-demo-enquiries` — demo enquiries
- `danmol-demo-course-catalog-version` — local catalogue migration marker

This storage is specific to the browser and device, is not a secure production database, and does not provide synchronization or backups. The admin page has no authentication or production-grade access controls. Never store sensitive information there.

To reset the demo data, remove the `danmol-demo-courses`, `danmol-demo-enquiries`, and `danmol-demo-course-catalog-version` keys from the browser's local storage for this site. Resetting course data restores the default catalogue on the next load.

## Contact and WhatsApp configuration

Update the placeholders in `src/config/siteConfig.js` before publishing:

- `phone`
- `email`
- `address`
- `whatsappNumber`

Set `whatsappNumber` to the business number in international digits-only format, without `+`, spaces, or punctuation. The WhatsApp panel opens a `wa.me` conversation only when a number is configured. Until then, it provides a link to `/contact`.

The contact form and WhatsApp shortcut do not automatically transmit or persist messages outside the user's browser; WhatsApp only opens after the visitor chooses to continue and a valid business number is configured.

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

## Before production launch

1. Confirm course names, syllabus, durations, modes, prerequisites, and project descriptions with the business.
2. Replace placeholder phone, email, address, and WhatsApp values in `src/config/siteConfig.js`.
3. Connect forms to an approved backend or email service and replace the demo-only success messages.
4. Add authentication and server-side authorization before making admin operations available to real users.
5. Replace browser-only demo storage with durable, access-controlled persistence if course editing or enquiry management is required in production.
6. Review image rights and availability. The logo is local in `asset/`; course and page photos currently use remote Unsplash URLs.
7. Ensure the required fonts and imagery are available in the intended deployment environment. Geist is loaded from Google Fonts with a system-font fallback.
8. Run `npm run build` and test the deployed routes, forms, and layouts at common screen widths.
