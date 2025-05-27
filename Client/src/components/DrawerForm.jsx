import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeedback, editFeedback } from "../features/feedback/feedbackSlice";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const typeOptions = ["Bug", "Feature", "Improvement", "Other"];
const priorityOptions = ["Low", "Medium", "High"];

export default function DrawerForm({ isOpen, onClose, initialData }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.feedback.status);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Bug");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setMessage(initialData.message);
      setType(initialData.type || "Bug");
      setPriority(initialData.priority || "Medium");
    } else {
      setTitle("");
      setMessage("");
      setType("Bug");
      setPriority("Medium");
    }
    setError("");
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim() || !priority) {
      setError("Title, message, and priority are required.");
      return;
    }

    const payload = {
      id: initialData?.id || uuidv4(),
      title: title.trim(),
      message: message.trim(),
      type,
      priority,
    };

    if (initialData) {
      await dispatch(editFeedback(payload));
      toast.success("Feedback updated!");
    } else {
      await dispatch(addFeedback(payload));
      toast.success("Feedback added!");
    }

    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform duration-300 ease-in-out p-6 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          {initialData ? "Edit Feedback" : "Add Feedback"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          {/* Title Field */}
          <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            className="mb-4 p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Message Field */}
          <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            rows={4}
            className="mb-4 p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Type Field */}
          <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <select
            className="mb-4 p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Priority Field */}
          <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <select
            className="mb-4 p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Buttons */}
          <div className="mt-auto flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              disabled={status === "loading"}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white transition-colors ${
                status === "loading"
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={status === "loading"}
            >
              {status === "loading"
                ? initialData
                  ? "Updating..."
                  : "Adding..."
                : initialData
                ? "Update"
                : "Add"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
