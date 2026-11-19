# Website image folders

The website's images are grouped by where and how they are used:

```text
images/
  brand/                  Header and footer logos
    optimized/             WebP files currently delivered by the website
  courses/
    covers/               Course cards, course pages, and fallback image
      optimized/           WebP copies delivered for course cards and modules
    modules/<course>/      Optional image for each module in a course
  sections/               Homepage, About, Corporate, and shared page photos
    optimized/             WebP files currently delivered by the website
  references/             Design references; not displayed on the website
```

## Replace an existing image

Find the image in the folders above. If it has an optimized WebP copy listed below, replace the active `.webp` file with your new image exported as WebP using the **same filename**. Replacing only the original JPG/PNG will not change what the website displays. For images without an optimized copy, replace the source file with the same filename and type. Restart the dev server if it does not refresh automatically.

Course cover images are assigned in [`src/data/courses.js`](../../data/courses.js) and AI/Python course covers in [`src/data/aiPythonCourses.js`](../../data/aiPythonCourses.js). Course module pages use unique topic-themed illustrations by default instead of cycling through the same shared photos. Add a custom module photo as described below to replace an illustration.

The website currently delivers these optimized WebP files; original JPG/PNG files remain unchanged:

- `brand/optimized/D Anmol Enterprises Logo.webp`
- `brand/optimized/D Anmol Enterprises Logo Light.webp`
- `courses/covers/optimized/AI Automation.webp`
- `courses/covers/optimized/Full Stack.webp`
- `courses/covers/optimized/Generative AI.webp`
- `courses/covers/optimized/artificial-intelligence.webp`
- `courses/covers/optimized/computer-basics.webp`
- `courses/covers/optimized/course-image-fallback.webp`
- `courses/covers/optimized/data-analytics.webp`
- `courses/covers/optimized/digital-marketing.webp`
- `courses/covers/optimized/digital-marketing-work.webp`
- `courses/covers/optimized/technology-hardware.webp`
- `courses/covers/optimized/typing-practice.webp`
- `sections/optimized/classroom-learning.webp`
- `sections/optimized/home-team-learning.webp`
- `sections/optimized/team-planning.webp`
- `sections/optimized/team-project.webp`

These two images are used directly in their original format and do not have an optimized copy:

- `courses/covers/python-programming.jpg`
- `sections/technology-workshop.jpg`

The large course and section photos were resized to a maximum 1280-pixel dimension and exported as WebP. The logos were resized for their displayed dimensions and exported as lossless WebP with transparency preserved. When replacing an optimized asset, keep its aspect ratio and use a comparable or higher visual quality.

## Replace a course module image

To customize a specific module without affecting other pages, put its image in the matching folder under `courses/modules/`:

- `module-01.jpg` - first module
- `module-02.jpg` - second module
- Continue numbering in the order shown on that course page.

The course folder names and supported formats (`.jpg`, `.jpeg`, `.png`, `.webp`) are listed in [`courses/modules/README.md`](./courses/modules/README.md). If an override is not present, the website uses its built-in default. The image lookup is in [`src/data/courseModuleImages.js`](../../data/courseModuleImages.js).

## Add a new image

For a new course cover or a new image used elsewhere in a page, add the file to the relevant folder and update its import/mapping in the corresponding source file. For optimized images, replace the active WebP file as described above; for images without an optimized copy, replace the source file using its existing filename.
