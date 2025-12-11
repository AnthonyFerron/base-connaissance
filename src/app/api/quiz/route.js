import prisma from "@/lib/prisma";

// Fonction pour mélanger un tableau (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(req) {
  const questions = await prisma.quizQuestion.findMany({
    include: {
      answers: true,
    },
  });

  const formatted = questions.map((q) => ({
    id: q.id,
    question: q.question,
    image: q.image,
    difficulty: q.difficulty,
    choices: shuffleArray(q.answers.map((a) => a.text)), // Mélanger les choix
    correct: q.answers.find((a) => a.isCorrect)?.text,
  }));

  // Mélanger toutes les questions
  const shuffledQuestions = shuffleArray(formatted);

  // Limiter à 5 questions par quiz (chaque question unique)
  const limitedQuestions = shuffledQuestions.slice(0, 5);

  return new Response(JSON.stringify(limitedQuestions), {
    headers: { "Content-Type": "application/json" },
  });
}
