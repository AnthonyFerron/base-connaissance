"use client";

export default function AlertModal({
  isOpen,
  onClose,
  title = "Information",
  message = "",
  buttonText = "OK",
  type = "info", // "info", "error", "success", "warning"
}) {
  if (!isOpen) return null;

  const getHeaderStyle = () => {
    switch (type) {
      case "error":
        return "linear-gradient(to right, #dc2626, #ef4444)";
      case "success":
        return "linear-gradient(to right, #059669, #10b981)";
      case "warning":
        return "linear-gradient(to right, #d97706, #f59e0b)";
      default:
        return "linear-gradient(to right, #2563eb, #3b82f6)";
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "error":
        return "bg-red-600 hover:bg-red-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "warning":
        return "bg-orange-600 hover:bg-orange-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
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
            background: getHeaderStyle(),
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
        <div className="bg-gray-50 px-8 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className={`px-6 py-3 text-white rounded-xl transition-colors font-semibold shadow-lg hover:shadow-xl ${getButtonClass()}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
