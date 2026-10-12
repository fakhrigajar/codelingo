import courseData from './courses.json'
import htmlIcon from '../assets/logos/html-icon.png'
import jsIcon from '../assets/logos/js-icon.png'
import pythonIcon from '../assets/logos/python-icon.png'
import tsIcon from '../assets/logos/typescript-icon.png'
import reactIcon from '../assets/logos/react-icon.png'
import nodeIcon from '../assets/logos/nodejs-icon.png'
import figmaIcon from '../assets/logos/figma-icon.png'

const icons = { html: htmlIcon, javascript: jsIcon, python: pythonIcon,
  typescript: tsIcon, react: reactIcon, nodejs: nodeIcon, 'ui-ux': figmaIcon }
export const DEFAULT_COURSES = courseData.map((course) => ({ ...course, icon: icons[course.id] || '' }))

export const DEFAULT_PATHS = [
  { id: 'web-foundations', label: 'Web Development Foundations', level: 'Beginner', courseIds: ['html', 'css', 'javascript', 'git'] },
  { id: 'frontend', label: 'Frontend Developer', level: 'Intermediate', courseIds: ['html', 'css', 'javascript', 'typescript', 'react', 'ui-ux'] },
  { id: 'full-stack', label: 'Full-Stack JavaScript', level: 'Intermediate', courseIds: ['javascript', 'git', 'typescript', 'react', 'nodejs', 'sql'] },
  { id: 'python-data', label: 'Python & Data Foundations', level: 'Beginner', courseIds: ['python', 'git', 'sql'] },
]

export const DEFAULT_USERS = [
  { username: 'admin', displayName: 'CodeLingo Admin', password: 'codelingo-admin', role: 'admin', age: 25,
    xp: 0, badges: [], completed: {}, favorites: [], joined: '2026-01-01T00:00:00.000Z' },
  { username: 'demo', displayName: 'Demo Learner', password: 'demo1234', role: 'community', age: 18,
    xp: 0, badges: [], completed: {}, favorites: [], joined: '2026-01-02T00:00:00.000Z' },
  { username: 'alex', displayName: 'Alex', password: 'alex1234', role: 'community', age: 20,
    xp: 30, badges: ['first-steps'], completed: { html: ['html-lesson-1', 'html-lesson-2', 'html-lesson-3'] },
    favorites: ['html'], joined: '2026-01-03T00:00:00.000Z' },
]

export const DEFAULT_POSTS = [
  { id: 'welcome', username: 'admin', displayName: 'CodeLingo Admin',
    text: 'Welcome to CodeLingo! Start with HTML, CSS and JavaScript, or follow one of the learning paths. Share your progress and help other learners here.',
    time: 1767528000000, likes: ['alex'], reports: [], replies: [], image: null, document: null },
  { id: 'first-page', username: 'alex', displayName: 'Alex',
    text: 'I finished the HTML course and built my first web page! Next up: adding a responsive layout with CSS.',
    time: 1767441600000, likes: ['admin'], reports: [], image: null, document: null,
    replies: [{ id: 'encouragement', username: 'admin', displayName: 'CodeLingo Admin', text: 'Great start! Try the Web Development Foundations path next.', time: 1767445200000, likes: [], replyTo: null }] },
  { id: 'study-tip', username: 'demo', displayName: 'Demo Learner',
    text: 'Study tip: try the practice quiz after each lesson, then explain the answer in your own words. Small steps add up!',
    time: 1767355200000, likes: [], reports: [], replies: [], image: null, document: null },
]

export const DEFAULT_BADGES = [
  {
    id: "first-steps",
    icon: "sprout",
    name: "First Steps",
    desc: "Complete your first lesson",
  },
  {
    id: "course-champion",
    icon: "trophy",
    name: "Course Champion",
    desc: "Finish an entire course",
  },
  {
    id: "quiz-whiz",
    icon: "brain",
    name: "Quiz Whiz",
    desc: "Pass your first quiz",
  },
  {
    id: "chatterbox",
    icon: "message-circle",
    name: "Chatterbox",
    desc: "Share your first community post",
  },
  {
    id: "triple-threat",
    icon: "zap",
    name: "Triple Threat",
    desc: "Make progress in 3 different courses",
  },
];

export const DEFAULT_PAGE_TEXT = {
  pathsTitle: "Learning paths",
  pathsSubtitle:
    "Follow a path from first course to last — complete one to unlock the next.",
  coursesTitle: "Course library",
  coursesSubtitle:
    "Bite-sized modules covering the core skills every developer needs. Tap a card to open it.",
};
