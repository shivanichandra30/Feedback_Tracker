// src/components/Modal.jsx
import { useEffect } from "react";

export default function Modal({ onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 opacity-100"
      />

      {/* Modal container */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-4"
        aria-modal="true"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="
            bg-white dark:bg-gray-900 rounded-lg shadow-2xl
            max-w-lg w-full max-h-[90vh] overflow-y-auto
            p-6
            transform transition-all duration-300 ease-out
            scale-100 opacity-100
          "
        >
          {/* Header with gradient background */}
          <div className="rounded-t-md px-4 py-3 mb-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-gray-700 dark:to-gray-900 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full p-1 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 text-gray-800 dark:text-gray-300">
            {/* Example content blocks */}
            {typeof children === "string" || !Array.isArray(children) ? (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow-sm">
                {children}
              </div>
            ) : (
              children.map((child, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow-sm"
                >
                  {child}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
