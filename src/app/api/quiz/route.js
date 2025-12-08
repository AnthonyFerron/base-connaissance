import prisma from "@/lib/prisma";

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
    choices: q.answers.map((a) => a.text),
    correct: q.answers.find((a) => a.isCorrect)?.text,
  }));

  return new Response(JSON.stringify(formatted), {
    headers: { "Content-Type": "application/json" },
  });
}
