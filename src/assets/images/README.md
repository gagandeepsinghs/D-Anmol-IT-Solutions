# Website image folders

Replace an image with another image using the same filename and file type to keep the current imports working.

- `logos/` - header and footer brand logos.
- `courses/` - course-card images and the admin fallback image. Some of these are also reused as matching module images.
- `modules/` - classroom, project, and other learning photos used in page sections.
- `modules/course-modules/` - per-course, per-module photo overrides.
- `references/` - design-reference files; these are not displayed on the website.

To replace a module photo, add an image to that course's folder using `module-01.jpg`, `module-02.jpg`, and so on. PNG, JPEG, and WebP files are also supported. The number follows the module's order on the course page. If a custom image is not present, the website continues to use its built-in default. See `modules/course-modules/README.md` for the course folder names.
