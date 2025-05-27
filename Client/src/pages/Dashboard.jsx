import { useState } from "react";
import { useSelector } from "react-redux";
import FeedbackTable from "../components/FeedbackTable";
import DrawerForm from "../components/DrawerForm";

export default function Dashboard() {
  const feedbackItems = useSelector((state) => state.feedback.items || []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleAddClick = () => {
    setEditItem(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Feedback List
        </h2>
        <button
          onClick={handleAddClick}
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
          aria-label="Add new feedback"
        >
          + Add Feedback
        </button>
      </div>

      {/* Feedback table handles all filtering/search */}
      <FeedbackTable data={feedbackItems} onEdit={handleEditClick} />

      {/* Feedback drawer form */}
      <DrawerForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialData={editItem}
      />
    </div>
  );
}
