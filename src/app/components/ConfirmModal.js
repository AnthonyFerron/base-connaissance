"use client";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir continuer ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  confirmColor = "orange", // "orange", "red", "blue"
}) {
  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    switch (confirmColor) {
      case "red":
        return "bg-red-600 hover:bg-red-700";
      case "blue":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-orange-600 hover:bg-orange-700";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div
          className="px-8 py-6 text-white"
          style={{
            background:
              confirmColor === "red"
                ? "linear-gradient(to right, #dc2626, #ef4444)"
                : confirmColor === "blue"
                ? "linear-gradient(to right, #2563eb, #3b82f6)"
                : "linear-gradient(to right, #ea580c, #f97316)",
            minHeight: "80px",
          }}
        >
          <h2 className="text-3xl font-bold text-white">{title}</h2>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 flex gap-3 justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-3 text-white rounded-xl transition-colors font-semibold shadow-lg hover:shadow-xl ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
