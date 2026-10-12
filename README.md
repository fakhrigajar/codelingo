# CodeLingo

A standalone learning app built with Vite, React and Tailwind CSS. It runs without an API server, database, API keys or environment variables.

## Getting started

```bash
npm install
npm run dev       # run the frontend
npm run build     # build the static site into dist/
npm run preview   # preview the production build
npm run lint
```

Deploy `dist/` to a static host. The included Netlify configuration supports client-side routes.

## Default content

The app starts with exactly **10 courses** and **30 lessons**, each with practice questions:

1. HTML
2. CSS
3. JavaScript
4. Python
5. Git & Version Control
6. TypeScript
7. React
8. Node.js
9. SQL & Databases
10. UI/UX Design Fundamentals

Four learning paths link to these courses. Badges, sample community posts and demo accounts are also included. Course content is defined in `src/data/courses.json`; paths, users, posts and badges are in `src/data/data.js`.

## Demo accounts

Log in at `/account`:

| Account | Username | Password |
| --- | --- | --- |
| Learner | `demo` | `demo1234` |
| Admin | `admin` | `codelingo-admin` |

The admin account can open `/admin` to edit courses, paths and badges, manage local users and posts, or export/import content. **System → Reset to defaults** restores the 10 courses, four paths, badges and page text.

## Browser storage and practice tools

Accounts, sessions, progress, favorites, content edits, posts, comments and visit history persist in this browser's `localStorage`. Data is local to this browser and is not shared with other people or devices. New accounts can be created from the account page.

Image and document attachments are kept as data URLs, with a 2 MB per-file limit. Browser storage has limited capacity; export your content edits from the admin panel to keep a backup.

The practice tools use default content: course quizzes reuse lesson questions, interview practice uses a local question bank, project ideas use ten starter projects, and learning paths use the default course catalog. The CV feedback tool shows a clearly labeled sample review; it does not analyze the uploaded CV or call an AI service.

Demo login is a client-side convenience, not secure authentication. Use this app with sample data only.
