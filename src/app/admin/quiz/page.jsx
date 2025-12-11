"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import NavBar from "@/app/components/NavBar";
import Image from "next/image";
import ConfirmModal from "@/app/components/ConfirmModal";
import AlertModal from "@/app/components/AlertModal";

export default function AdminQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    image: "",
    difficulty: "MOYEN",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    questionId: null,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/auth/test-session");

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!data.user) {
        router.push("/login");
        return;
      }

      if (data.user.role !== "ADMIN") {
        router.push("/");
        return;
      }

      setIsAdmin(true);
      fetchQuestions();
    } catch (error) {
      console.error("Erreur vérification admin:", error);
      router.push("/login");
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/admin/quiz");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement");
      }
      const data = await response.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        question: question.question,
        image: question.image || "",
        difficulty: question.difficulty || "MOYEN",
        answers: question.answers.map((a) => ({
          text: a.text,
          isCorrect: a.isCorrect,
        })),
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        question: "",
        image: "",
        difficulty: "MOYEN",
        answers: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.question.trim()) {
      setAlertModal({
        isOpen: true,
        message: "La question est obligatoire",
        type: "error",
      });
      return;
    }

    const filledAnswers = formData.answers.filter((a) => a.text.trim());
    if (filledAnswers.length !== 4) {
      setAlertModal({
        isOpen: true,
        message: "Vous devez fournir exactement 4 réponses",
        type: "error",
      });
      return;
    }

    const correctAnswers = filledAnswers.filter((a) => a.isCorrect);
    if (correctAnswers.length !== 1) {
      setAlertModal({
        isOpen: true,
        message: "Une seule réponse doit être correcte",
        type: "error",
      });
      return;
    }

    try {
      const url = editingQuestion
        ? `/api/admin/quiz/${editingQuestion.id}`
        : "/api/admin/quiz";
      const method = editingQuestion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      await fetchQuestions();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      setAlertModal({
        isOpen: true,
        message: "Erreur lors de la sauvegarde",
        type: "error",
      });
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, questionId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.questionId) return;

    try {
      const response = await fetch(
        `/api/admin/quiz/${deleteModal.questionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      await fetchQuestions();
    } catch (error) {
      console.error("Erreur suppression:", error);
      setAlertModal({
        isOpen: true,
        message: "Erreur lors de la suppression",
        type: "error",
      });
    }
  };

  const handleAnswerChange = (index, field, value) => {
    const newAnswers = [...formData.answers];
    if (field === "isCorrect" && value) {
      // Si on coche une réponse, décocher les autres
      newAnswers.forEach((a, i) => {
        a.isCorrect = i === index;
      });
    } else {
      newAnswers[index][field] = value;
    }
    setFormData({ ...formData, answers: newAnswers });
  };

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Quiz</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaPlus /> Nouvelle question
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulté
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réponses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Aucune question de quiz
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-md">
                        {q.question}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {q.image ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={q.image}
                            alt="Quiz"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <FaImage className="text-gray-400 text-2xl" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          q.difficulty === "FACILE"
                            ? "bg-green-100 text-green-800"
                            : q.difficulty === "DIFFICILE"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {q.difficulty || "MOYEN"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {q.answers.length} réponses
                        <br />
                        <span className="text-green-600 font-medium">
                          ✓{" "}
                          {q.answers
                            .find((a) => a.isCorrect)
                            ?.text.substring(0, 20)}
                          ...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(q)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
            style={{ maxHeight: "90vh" }}
          >
            {/* Header - Toujours visible */}
            <div
              className="px-8 py-6 text-white"
              style={{
                background: "linear-gradient(to right, #ea580c, #f97316)",
                minHeight: "80px",
              }}
            >
              <h2 className="text-3xl font-bold text-white">
                {editingQuestion
                  ? "Modifier une question"
                  : "Ajouter une question"}
              </h2>
            </div>

            {/* Body - Scrollable */}
            <div
              className="px-8 py-6"
              style={{ maxHeight: "calc(90vh - 180px)", overflowY: "auto" }}
            >
              <form onSubmit={handleSubmit} id="quiz-form">
                {/* Question */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Question *
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    rows="3"
                    required
                    placeholder="Ex: Quel Pokémon est connu comme le Pokémon génétique ?"
                  />
                </div>

                {/* Image et Difficulté côte à côte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Chemin de l'image (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="/images/quiz/pokemon.png"
                    />
                  </div>

                  {/* Difficulté */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Difficulté
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({ ...formData, difficulty: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                    >
                      <option value="FACILE">Facile</option>
                      <option value="MOYEN">Moyen</option>
                      <option value="DIFFICILE">Difficile</option>
                    </select>
                  </div>
                </div>

                {/* Réponses */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Réponses (4 obligatoires, 1 correcte) *
                  </label>
                  <div className="space-y-3">
                    {formData.answers.map((answer, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={answer.text}
                            onChange={(e) =>
                              handleAnswerChange(index, "text", e.target.value)
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            placeholder={`Réponse ${index + 1}`}
                            required
                          />
                        </div>
                        <label className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all min-w-[120px] justify-center">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={answer.isCorrect}
                            onChange={(e) =>
                              handleAnswerChange(
                                index,
                                "isCorrect",
                                e.target.checked
                              )
                            }
                            className="w-5 h-5 text-green-600"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Correcte
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 flex gap-3 justify-end border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="quiz-form"
                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
              >
                {editingQuestion ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, questionId: null })}
        onConfirm={confirmDelete}
        title="Supprimer la question"
        message="Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="red"
      />

      {/* Modal d'alerte */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() =>
          setAlertModal({ isOpen: false, message: "", type: "error" })
        }
        title={alertModal.type === "error" ? "Erreur" : "Information"}
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  );
}
