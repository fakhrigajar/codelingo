import { FileText, Mic, Lightbulb, Map } from "lucide-react";

// The AI career tools, shown in the navbar's "Tools" dropdown (icon + title
// only there) and linked to directly from each tool's own page.
export const TOOLS = [
  { to: "/tools/cv-analyzer", Icon: FileText, title: "AI CV Analyzer" },
  { to: "/tools/interview-prep", Icon: Mic, title: "Interview Prep" },
  { to: "/tools/project-ideas", Icon: Lightbulb, title: "Project Ideas" },
  { to: "/tools/learning-path", Icon: Map, title: "Learning Path" },
];
