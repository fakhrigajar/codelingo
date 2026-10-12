import { DEFAULT_PROJECT_IDEAS } from '../data/toolDefaults'

export async function generateProjectIdeas({ language, level, detailed }) {
  return DEFAULT_PROJECT_IDEAS.map((idea) => ({ ...structuredClone(idea),
    skills: [language, ...idea.skills],
    description: `${idea.description}${detailed ? ` Use ${language} and split the work into small, testable steps.` : ''}${level === 'advanced' ? ' Add automated tests, validation and import/export.' : level === 'medium' ? ' Add editing and input validation.' : ''}`,
  }))
}
