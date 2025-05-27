import { useDispatch, useSelector } from "react-redux";
import {
  deleteFeedback,
  archiveFeedback,
  unarchiveFeedback,
} from "../features/feedback/feedbackSlice";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import Modal from "./Modal";

export default function FeedbackTable({ data, onEdit }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.feedback.status);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false); // << NEW
  const [viewFeedback, setViewFeedback] = useState(null);

  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const uniqueTypes = useMemo(() => {
    const types = new Set();
    data.forEach((item) => {
      if (item.type) types.add(item.type);
    });
    return Array.from(types);
  }, [data]);

  const uniquePriorities = useMemo(() => {
    const priorities = new Set();
    data.forEach((item) => {
      if (item.priority) priorities.add(item.priority.toLowerCase());
    });
    return Array.from(priorities);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesArchived = showArchived ? item.archived : !item.archived;
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(lowerSearch) ||
        item.message.toLowerCase().includes(lowerSearch) ||
        (item.priority && item.priority.toLowerCase().includes(lowerSearch));

      const matchesType = filterType === "all" || item.type === filterType;
      const matchesPriority =
        filterPriority === "all" ||
        (item.priority && item.priority.toLowerCase() === filterPriority);

      return matchesArchived && matchesSearch && matchesType && matchesPriority;
    });
  }, [data, showArchived, searchTerm, filterType, filterPriority]);

  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        valA = priorityOrder[valA?.toLowerCase()] || 0;
        valB = priorityOrder[valB?.toLowerCase()] || 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      valA = valA.toLowerCase();
      valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortOrder]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const onSearchChange = (e) => setSearchTerm(e.target.value);
  const onFilterTypeChange = (e) => setFilterType(e.target.value);
  const onFilterPriorityChange = (e) => setFilterPriority(e.target.value);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedData.map((item) => item.id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const archiveSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm("Archive selected feedback?")) {
      dispatch(archiveFeedback(selectedIds));
      toast.success("Selected feedback archived");
      clearSelection();
      setMultiSelectMode(false);
    }
  };

  const unarchiveSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm("Unarchive selected feedback?")) {
      dispatch(unarchiveFeedback(selectedIds));
      toast.success("Selected feedback unarchived");
      clearSelection();
      setMultiSelectMode(false);
    }
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm("Delete selected feedback? This cannot be undone.")) {
      selectedIds.forEach((id) => dispatch(deleteFeedback(id)));
      toast.success("Selected feedback deleted");
      clearSelection();
      setMultiSelectMode(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      dispatch(deleteFeedback(id));
      toast.success("Feedback deleted");
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const toggleArchive = (item) => {
    if (item.archived) {
      dispatch(unarchiveFeedback([item.id]));
      toast.success("Feedback unarchived");
    } else {
      dispatch(archiveFeedback([item.id]));
      toast.success("Feedback archived");
    }
    setSelectedIds((prev) => prev.filter((sid) => sid !== item.id));
  };

  const handleRowClick = (e, item) => {
    if (multiSelectMode) {
      // Toggle selection on row click in select mode
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "INPUT" ||
        e.target.closest("button") ||
        e.target.closest("input")
      ) {
        return;
      }
      toggleSelect(item.id);
    } else {
      // Normal mode: open modal on row click (unless button or input clicked)
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "INPUT" ||
        e.target.closest("button") ||
        e.target.closest("input")
      ) {
        return;
      }
      setViewFeedback(item);
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={onSearchChange}
            className="px-3 py-1 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={() => setShowArchived((prev) => !prev)}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </button>

          <select
            value={filterType}
            onChange={onFilterTypeChange}
            className="px-3 py-1 border rounded dark:bg-gray-700 dark:text-white"
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={onFilterPriorityChange}
            className="px-3 py-1 border rounded dark:bg-gray-700 dark:text-white"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            {uniquePriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle multi-select mode button */}
        <div>
          <button
            onClick={() => {
              if (multiSelectMode) {
                clearSelection();
              }
              setMultiSelectMode((prev) => !prev);
            }}
            className={`px-3 py-1 rounded ${
              multiSelectMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {multiSelectMode ? "Cancel Selection" : "Select Feedback"}
          </button>
        </div>

        {/* Bulk action buttons - only show if in multiSelectMode and have selected items */}
        {multiSelectMode && selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={archiveSelected}
              className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-black"
            >
              Archive Selected
            </button>
            <button
              onClick={unarchiveSelected}
              className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 text-white"
            >
              Unarchive Selected
            </button>
            <button
              onClick={deleteSelected}
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-gray-700 dark:to-gray-900">
            <tr>
              {/* Show checkbox column only if multiSelectMode */}
              {multiSelectMode && (
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === sortedData.length &&
                      sortedData.length > 0
                    }
                    onChange={toggleSelectAll}
                    aria-label="Select all feedback"
                    className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                  />
                </th>
              )}

              {["Title", "Message", "Priority", "Type", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className={`px-6 py-3 text-left font-semibold text-sm uppercase tracking-wider cursor-pointer select-none
              text-white`}
                    onClick={() => {
                      if (header !== "Actions") {
                        handleSort(header.toLowerCase());
                      }
                    }}
                    aria-sort={
                      sortBy === header.toLowerCase()
                        ? sortOrder === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    role="columnheader"
                  >
                    <div className="flex items-center gap-1">
                      {header}
                      {sortBy === header.toLowerCase() && (
                        <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 && (
              <tr>
                <td
                  colSpan={multiSelectMode ? 6 : 5}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No feedback found.
                </td>
              </tr>
            )}
            {sortedData.map((item) => (
              <tr
                key={item.id}
                className={`border-t border-gray-200 dark:border-gray-700 cursor-pointer
              ${
                selectedIds.includes(item.id)
                  ? "bg-indigo-100 dark:bg-indigo-900"
                  : ""
              }`}
                onClick={(e) => handleRowClick(e, item)}
              >
                {/* Checkbox column only if multiSelectMode */}
                {multiSelectMode && (
                  <td className="text-center px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select feedback titled ${item.title}`}
                      className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                    />
                  </td>
                )}

                <td className="px-6 py-3 max-w-xs truncate" title={item.title}>
                  {item.title}
                </td>
                <td
                  className="px-6 py-3 max-w-sm truncate"
                  title={item.message}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {item.message}
                </td>
                <td className="px-6 py-3">
                  {item.priority
                    ? item.priority.charAt(0).toUpperCase() +
                      item.priority.slice(1)
                    : "-"}
                </td>
                <td className="px-6 py-3">{item.type || "-"}</td>
                <td className="px-6 py-3 space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    aria-label={`Edit feedback titled ${item.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleArchive(item);
                    }}
                    className={`px-2 py-1 rounded ${
                      item.archived
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-yellow-400 hover:bg-yellow-500 text-black"
                    }`}
                    aria-label={
                      item.archived
                        ? `Unarchive feedback titled ${item.title}`
                        : `Archive feedback titled ${item.title}`
                    }
                  >
                    {item.archived ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    aria-label={`Delete feedback titled ${item.title}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for view feedback */}
      {/* Modal for viewing feedback */}
      {viewFeedback && (
        <Modal onClose={() => setViewFeedback(null)} title={viewFeedback.title}>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col gap-3 text-sm text-gray-800 dark:text-gray-200">
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-white dark:bg-gray-900 rounded">
              <strong>Message:</strong> {viewFeedback.message}
            </div>
            <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-white dark:bg-gray-900 rounded">
              <strong>Priority:</strong> {viewFeedback.priority}
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2 bg-white dark:bg-gray-900 rounded">
              <strong>Type:</strong> {viewFeedback.type}
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-white dark:bg-gray-900 rounded">
              <strong>Archived:</strong> {viewFeedback.archived ? "Yes" : "No"}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              onClick={() => setViewFeedback(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
