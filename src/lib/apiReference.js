// A static reference of this app's own REST API (server/index.js) for the
// admin "API usage" page — kept here as plain data so the page itself is
// just a renderer. Update this alongside server/index.js when routes change.
export const API_GROUPS = [
  {
    title: "Courses",
    basePath: "/api/courses",
    endpoints: [
      { method: "GET", path: "/api/courses", desc: "List all courses" },
      { method: "GET", path: "/api/courses/:id", desc: "Get a course by ID" },
      { method: "POST", path: "/api/courses", desc: "Create a course" },
      { method: "PUT", path: "/api/courses/:id", desc: "Update a course by ID (creates it if missing)" },
      { method: "DELETE", path: "/api/courses/:id", desc: "Delete a course by ID" },
      { method: "DELETE", path: "/api/courses", desc: "Delete every course" },
      { method: "PATCH", path: "/api/courses/:courseId/lessons/:lessonId", desc: "Patch fields on one lesson inside a course" },
      { method: "GET", path: "/api/courses/:courseId/lessons/:lessonId/discussions", desc: "List a lesson's discussion comments" },
      { method: "POST", path: "/api/courses/:courseId/lessons/:lessonId/discussions", desc: "Post a lesson discussion comment" },
    ],
  },
  {
    title: "Paths",
    basePath: "/api/paths",
    endpoints: [
      { method: "GET", path: "/api/paths", desc: "List all learning paths" },
      { method: "GET", path: "/api/paths/:id", desc: "Get a path by ID" },
      { method: "POST", path: "/api/paths", desc: "Create a path" },
      { method: "PUT", path: "/api/paths/:id", desc: "Update a path by ID (creates it if missing)" },
      { method: "DELETE", path: "/api/paths/:id", desc: "Delete a path by ID" },
      { method: "DELETE", path: "/api/paths", desc: "Delete every path" },
    ],
  },
  {
    title: "Users",
    basePath: "/api/users",
    endpoints: [
      { method: "GET", path: "/api/users", desc: "List every account, full records (admin use only)" },
      { method: "GET", path: "/api/users/:username", desc: "Get one account by username" },
      { method: "POST", path: "/api/users", desc: "Create an account (signup)" },
      { method: "PUT", path: "/api/users/:username", desc: "Update an account by username (creates it if missing)" },
      { method: "DELETE", path: "/api/users/:username", desc: "Delete an account by username" },
      { method: "DELETE", path: "/api/users", desc: "Delete every account" },
      { method: "GET", path: "/api/users-public", desc: "List public-safe fields only (username, name, avatar) for every user" },
    ],
  },
  {
    title: "Badges",
    basePath: "/api/badges",
    endpoints: [
      { method: "GET", path: "/api/badges", desc: "List all badges" },
      { method: "GET", path: "/api/badges/:id", desc: "Get a badge by ID" },
      { method: "POST", path: "/api/badges", desc: "Create a badge" },
      { method: "PUT", path: "/api/badges/:id", desc: "Update a badge by ID (creates it if missing)" },
      { method: "DELETE", path: "/api/badges/:id", desc: "Delete a badge by ID" },
      { method: "DELETE", path: "/api/badges", desc: "Delete every badge" },
    ],
  },
  {
    title: "Community posts",
    basePath: "/api/posts",
    endpoints: [
      { method: "GET", path: "/api/posts", desc: "List all community posts, newest first" },
      { method: "GET", path: "/api/posts/:id", desc: "Get a post by ID" },
      { method: "POST", path: "/api/posts", desc: "Create a post" },
      { method: "PUT", path: "/api/posts/:id", desc: "Update a post by ID (creates it if missing)" },
      { method: "DELETE", path: "/api/posts/:id?requestedBy=", desc: "Delete a post — only its owner or an admin may" },
      { method: "DELETE", path: "/api/posts", desc: "Delete every post" },
      { method: "POST", path: "/api/posts/:id/like", desc: "Toggle a like on a post" },
      { method: "POST", path: "/api/posts/:id/report", desc: "Report a post to moderators" },
      { method: "POST", path: "/api/posts/:id/replies", desc: "Add a reply/comment to a post" },
      { method: "POST", path: "/api/posts/:id/replies/:replyId/like", desc: "Toggle a like on a reply" },
      { method: "GET", path: "/api/post-deletions", desc: "Moderation log of who deleted which post" },
    ],
  },
  {
    title: "Visitors",
    basePath: "/api/visits",
    endpoints: [
      { method: "POST", path: "/api/visits", desc: "Log a page view (IP, geo, browser, device, OS, referrer)" },
      { method: "GET", path: "/api/visits", desc: "List the 500 most recent recorded visits" },
      { method: "DELETE", path: "/api/visits", desc: "Clear the visitor log" },
    ],
  },
  {
    title: "File uploads",
    basePath: "/api/uploads",
    endpoints: [
      { method: "POST", path: "/api/uploads", desc: "Upload an image or document (base64 data URL in, file URL out)" },
    ],
  },
  {
    title: "AI tools",
    basePath: "/api/analyze-cv, /api/interview-questions, /api/project-ideas, /api/learning-path",
    endpoints: [
      { method: "POST", path: "/api/analyze-cv", desc: "Gemini: score + review a resume against a target role" },
      { method: "POST", path: "/api/interview-questions", desc: "Gemini: generate multiple-choice interview practice questions" },
      { method: "POST", path: "/api/project-ideas", desc: "Gemini: generate project ideas + wireframes for a language/level" },
      { method: "POST", path: "/api/learning-path", desc: "Gemini: generate a step-by-step personalized learning path" },
    ],
  },
  {
    title: "System",
    basePath: "/api/health",
    endpoints: [
      { method: "GET", path: "/api/health", desc: "Server status: uptime, DB connection, Gemini key configured" },
    ],
  },
]
