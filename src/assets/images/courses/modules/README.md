# Course module images

Each course has its own folder below. Put one image per module directly in that course folder, using its order in the course pathway:

- `src/assets/images/courses/modules/Generative_AI/module-01.webp` - first Generative AI module
- `src/assets/images/courses/modules/Generative_AI/module-02.webp` - second Generative AI module
- Continue numbering (`module-03.webp`, etc.) for later modules.

Supported formats are `.jpg`, `.jpeg`, `.png`, and `.webp`. The filename number matches the module's position, not its displayed title. A custom image replaces only that module's built-in illustration. Leave a file out to keep the default.

## Course folder names

Use the folder matching the course:

- AI Automation: `AI_Automation/`
- Artificial Intelligence and Machine Learning: `Artificial_Intelligence_Machine_Learning/`
- Computer Basics: `Computer_Basics_MS_Office/`
- Computer Typing: `Computer_Typing/`
- Corporate Training: `Corporate_Training/`
- Data Analytics: `Data_Analytics_Foundations/`
- Data Science: `Data_Science/`
- Digital Marketing: `Digital_Marketing/`
- Full Stack Development: `Full_Stack_Web_Development/`
- Generative AI: `Generative_AI/`
- Python Programming: `Python_Programming/`

## Upload images from the admin page

The site includes an admin image manager at `/admin`. It saves uploaded image data in the MongoDB `courseModuleImages` collection and shows it on the matching course module card. JPEG, PNG and WebP files smaller than 20 MB are supported; larger images are resized and optimized before upload.

For local development, copy `.env.example` to `.env`, start MongoDB on your computer, set `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD` (at least 12 characters) and `ADMIN_SESSION_SECRET` (at least 32 random characters), then run `npm run dev`. Open `http://localhost:5173/admin` to sign in and manage images.

For a deployed site, use a MongoDB Atlas connection string in the hosting provider's server-side `MONGODB_URI` environment variable. A MongoDB service running only on your computer is not accessible to the deployed site. Set `MONGODB_DB`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in the same server-side environment. Do not expose these values as `VITE_` variables or commit them to source control.
