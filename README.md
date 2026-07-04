# CodeLingo

A kids' ICT e-learning site — courses, grade roadmaps, badges, XP, and a
community chat — rebuilt with **Vite + React**, styled entirely with
**Tailwind CSS 3.4**, and with a full **/admin** panel for editing content.

No backend is required: learner accounts, chat messages, and all
admin-edited content are stored in the browser's `localStorage`.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Admin panel

Go to **`/admin/login`** and log in with the default password:

```
codelingo-admin
```

You can change this in `src/data/data.js` (`ADMIN_PASSWORD`).

From the admin panel you can:

- **Grades** — edit the Grades page header/subtitle, and add, edit, reorder,
  or delete each grade's roadmap stops (title, description, and which
  course/lesson they link to).
- **Courses** — edit course info (title, icon, level, color, blurb) and
  every lesson or quiz inside it, including quiz questions/options/answers.
- **Badges** — edit badge icon, name and description, or add new ones.
- **Chat rooms** — rename rooms, or clear a room's stored messages.
- **Users** — view every registered learner, reset an account's progress,
  or delete an account.
- **Backup & reset** — export all content to a JSON file, import content
  from a JSON file, or reset everything back to the original demo content.

## Folder structure

```
src/
  data/
    data.js              default seed content (courses, grades, badges, rooms)
  lib/
    storage.js           localStorage helpers (namespaced under "codelingo:")
    helpers.js            small pure helper functions (progress %, ids, etc.)
  context/
    ContentContext.jsx    editable app content (persisted, admin-driven)
    AuthContext.jsx       learner accounts, session, progress
    AdminAuthContext.jsx  admin login gate
    ToastContext.jsx      toast notifications
  routes/
    RequireAuth.jsx       guards /profile for logged-in learners
    RequireAdmin.jsx      guards /admin for the admin session
  components/
    layout/               navbar, footer, page shell
    home/                 hero boot animation
    courses/               course card, lesson panel, quiz panel
    grades/                roadmap node
    common/                shared bits like the filter row
    admin/                 admin layout, cards, form fields, editors
  pages/                  one file per route
App.jsx                   route table
main.jsx                  app entry point
```

## Notes

- This is a self-contained demo: there's no real server, so "shared" data
  (chat messages, user accounts, admin content) lives in the current
  browser's localStorage only. Use **Backup & reset → Export** in the admin
  panel to save your content edits somewhere durable.
- The admin password is a simple client-side gate suitable for a demo or
  internal tool — it is **not** real authentication. Don't rely on it to
  protect sensitive data.
