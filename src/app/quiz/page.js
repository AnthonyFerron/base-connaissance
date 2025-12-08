"use client";

import { useState, useEffect } from "react";
import { Progress } from "flowbite-react";
import Image from "next/image";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(-1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [fade, setFade] = useState(false);

  // 🔄 Récupérer les questions depuis la base
  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      setQuestions(data);
    }
    fetchQuestions();
  }, []);

  if (questions.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>Chargement des questions...</p>
      </main>
    );
  }

  if (step === -1) {
    return (
      <main
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
        style={{ backgroundImage: "url('/images/fond-pokemon.png')" }}
      >
        <div className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-md text-center">
          <h1 className="text-4xl font-extrabold mb-4">Quiz Pokémon 🎮</h1>
          <p className="text-lg mb-6">
            Teste tes connaissances Pokémon !<br />
            Réponds aux <strong>{questions.length} questions</strong> et vois
            ton score !
          </p>
          <button
            onClick={() => setStep(0)}
            className="px-6 py-3 bg-[#EC533A] text-white rounded-lg shadow hover:bg-orange-700 transition font-semibold"
          >
            Commencer 🔥
          </button>
        </div>
      </main>
    );
  }

  const current = questions[step];

  const handleAnswer = (choice) => {
    setSelected(choice);
    setFade(true);

    setTimeout(() => {
      if (choice === current.correct) setScore((s) => s + 1);
      if (step + 1 === questions.length) {
        setShowResult(true);
      } else {
        setStep((s) => s + 1);
        setSelected(null);
        setFade(false);
      }
    }, 400);
  };

  if (showResult) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="bg-white/90 p-8 rounded-xl shadow-xl max-w-md w-full">
          <h1 className="text-4xl font-extrabold mb-4">Résultat 🎉</h1>
          <p className="text-2xl font-semibold mb-4">
            Score : {score} / {questions.length}
          </p>
          <p className="text-xl mb-6">
            {percent === 100 &&
              "Incroyable ! Tu es un vrai Maître Pokémon ! 🌟"}
            {percent >= 70 && percent < 100 && "Très bien joué ! 💪✨"}
            {percent >= 40 && percent < 70 && "Pas mal ! Continue ! 🔥"}
            {percent < 40 && "Ressaye encore ! Tu vas y arriver ❤️‍🔥"}
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setStep(-1);
                setScore(0);
                setSelected(null);
                setShowResult(false);
                setFade(false);
              }}
              className="px-6 py-3 bg-[#EC533A] text-white rounded-lg shadow hover:bg-orange-700 transition font-semibold"
            >
              Recommencer 🔄
            </button>

            <button
              onClick={async () => {
                // Exemple : recharger les questions depuis l'API pour un nouveau quiz
                const res = await fetch("/api/quiz");
                const data = await res.json();
                setQuestions(data);
                setStep(0);
                setScore(0);
                setSelected(null);
                setShowResult(false);
                setFade(false);
              }}
              className="px-6 py-3 bg-[#1D4ED8] text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
            >
              Passer à un autre quiz 🎯
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-6">
      <div
        className={`bg-white/90 mt-10 p-6 rounded-xl shadow-xl max-w-md w-full transition-opacity duration-500 ${
          fade ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* Progression */}
        <div className="mb-6">
          <span className="text-sm font-semibold">
            Question {step + 1} / {questions.length}
          </span>
          <Progress
            progress={((step + 1) / questions.length) * 100}
            size="md"
            color="orange"
            className="mt-2 [&>div]:!bg-[#EC533A]"
          />
        </div>

        {/* Question et image */}
        {current.image && (
          <div className="mb-4 flex justify-center">
            <Image
              src={current.image}
              alt={current.question}
              height={20}
              width={20}
              objectFit="fill"
            />
          </div>
        )}
        <h2 className="text-xl font-bold mb-6">{current.question}</h2>

        {/* Réponses */}
        <div className="flex flex-col gap-4">
          {current.choices.map((choice) => {
            const isCorrect = selected && choice === current.correct;
            const isWrong =
              selected && choice === selected && choice !== current.correct;

            return (
              <button
                key={choice}
                disabled={!!selected}
                onClick={() => handleAnswer(choice)}
                className={`
                  border px-4 py-3 rounded-lg text-left text-lg transition-all duration-200
                  ${
                    selected
                      ? isCorrect
                        ? "bg-green-500 text-white border-green-600"
                        : isWrong
                        ? "bg-red-500 text-white border-red-600"
                        : "bg-gray-200"
                      : "hover:bg-gray-100"
                  }
                `}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
