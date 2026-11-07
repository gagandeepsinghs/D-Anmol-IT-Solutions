# D-Anmol Academy Website — Technology Documentation

## Overview

This website is a single-page React application for D-Anmol Academy’s IT training programs. It includes course browsing, course detail pages, enquiry forms, advisor booking, corporate training information, FAQs, and an admin/demo data view.

## Core technologies

- **React 18** — Component-based user interface development.
- **React DOM** — Renders the React application in the browser.
- **React Router DOM 6** — Client-side routing for pages and course detail URLs.
- **Vite 6** — Development server, module bundling, and production builds.
- **JavaScript / JSX** — Application logic and UI components.
- **Tailwind CSS 3** — Utility CSS configuration and theme support.
- **PostCSS** — CSS processing through the project’s PostCSS configuration.
- **Autoprefixer** — Adds browser-specific CSS prefixes during processing.
- **Lucide React** — Icon library used throughout navigation, cards, forms, and actions.

## Styling and design system

The main visual styling is defined in [`src/styles.css`](./src/styles.css). It includes:

- Global layout and typography rules
- Responsive breakpoints and mobile navigation styling
- Site header, footer, hero sections, cards, forms, modals, and banners
- Academy color tokens based on the brochure and reference design:
  - Navy for primary structure and headings
  - Golden yellow for actions and highlights
  - White and off-white for surfaces
  - Small red accents for emphasis
- CSS custom properties for shared colors, spacing, borders, and typography
- Google Fonts import for Inter

Tailwind theme extensions are configured in [`tailwind.config.js`](./tailwind.config.js).

## Application structure

```text
src/
├── App.jsx                 Application routes and page shell
├── main.jsx                React entry point
├── styles.css              Global styles and responsive design
├── assets/images/
│   ├── logos/              Header and footer logos
│   ├── courses/            Course card and fallback images
│   ├── modules/            Module, classroom, and learning photos
│   └── references/         Design references not used by the website
├── components/             Reusable UI components
├── config/                 Site configuration and storage keys
├── context/                Shared application data context
├── data/                   Course, category, FAQ, and technology data
└── pages/                  Route-level page components
```

## Reusable components

The main reusable components are located in [`src/components/`](./src/components):

- `Header.jsx` — Main navigation, course menu, training menu, and mobile menu
- `Footer.jsx` — Site footer and contact links
- `Button.jsx` — Shared button and link styles
- `CourseCard.jsx` — Course listing cards
- `EnquiryForm.jsx` — General enquiry form
- `AiPythonEnquiryForm.jsx` — AI/Python enquiry form
- `AdvisorBookingModal.jsx` — Advisor consultation modal
- `FloatingActions.jsx` — Floating contact/action controls
- `TrainingMarquee.jsx` — Training category marquee
- `ScrollToTop.jsx` — Scroll-to-top interaction

## Pages and routing

Page components are located in [`src/pages/`](./src/pages):

- Home page
- Courses listing page
- Course detail page
- About page
- Contact page
- Corporate training page
- AI/Python training page
- AI/Python course detail page
- Admin/demo page

Routes are defined in [`src/App.jsx`](./src/App.jsx) using React Router.

## Data and state

- Course content is stored in JavaScript data modules under [`src/data/`](./src/data/).
- Categories, FAQs, module technologies, and AI/Python course data are also stored locally in this directory.
- [`AppDataContext.jsx`](./src/context/AppDataContext.jsx) provides shared course data to components.
- Browser `localStorage` is used for demo course catalog and enquiry storage.
- The current enquiry forms are demo-only and do not send email or save to a remote database.

Storage keys are defined in [`src/config/siteConfig.js`](./src/config/siteConfig.js).

## Assets

The site uses local assets from [`src/assets/images/`](./src/assets/images/), organized by purpose:

- [`logos/`](./src/assets/images/logos/) - header and footer logo files
- [`courses/`](./src/assets/images/courses/) - course card images and the admin fallback image
- [`modules/`](./src/assets/images/modules/) - module, classroom, and learning photos
- [`references/`](./src/assets/images/references/) - design references that are not loaded by the website

To replace a website image, keep its existing filename and extension. The active brand logos are configured in [`src/config/siteConfig.js`](./src/config/siteConfig.js), and module image assignments are in [`src/data/courseModuleImages.js`](./src/data/courseModuleImages.js).

## Development commands

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Build output

Vite generates the optimized production files in the `dist/` directory. The output contains the compiled JavaScript, CSS, HTML, and processed image assets.

## Current limitations

- Forms are browser-local demo forms and are not connected to an email or backend service.
- Course and enquiry data is not stored in a secure production database.
- No authentication or authorization should be assumed for the demo admin page.
- The site depends on the browser for client-side routing and local storage.
