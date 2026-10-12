export async function generateCourseQuiz({ course }) {
  const questions = course.lessons.flatMap((lesson) => (lesson.practiceQuiz || lesson.questions || []).map((item) => ({
    question: item.q, options: [...item.options], correctIndex: item.correct,
    topic: lesson.title, explanation: item.explanation || `Review "${lesson.title}": the correct answer is ${item.options[item.correct]}.`,
  })))
  if (!questions.length) throw new Error('This course has no practice questions yet.')
  return questions
}
