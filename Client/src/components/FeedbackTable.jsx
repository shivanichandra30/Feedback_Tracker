// src/components/FeedbackTable.jsx
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFeedback,
  archiveFeedback,
  unarchiveFeedback,
} from "../features/feedback/feedbackSlice";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import Modal from "./Modal";

export default function FeedbackTable({ data, onEdit }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.feedback.status);

  const [sortBy, setSortBy] = useState(null); // "title" or "message" or "priority"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [viewFeedback, setViewFeedback] = useState(null); // For modal view

  // New filter states
  const [filterType, setFilterType] = useState("all"); // all or specific type
  const [filterPriority, setFilterPriority] = useState("all"); // all or specific priority

  // Get unique types and priorities from data for dropdown options
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

  // Filter data by archived status, search term, type filter and priority filter
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

  // Sort filtered data (handle priority sorting)
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // For priority, you might want a custom order (e.g. High > Medium > Low)
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

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const onFilterPriorityChange = (e) => {
    setFilterPriority(e.target.value);
  };

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

  const clearSelection = () => {
    setSelectedIds([]);
    setMultiSelectMode(false);
  };

  const archiveSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm("Archive selected feedback?")) {
      dispatch(archiveFeedback(selectedIds));
      toast.success("Selected feedback archived");
      clearSelection();
    }
  };

  const unarchiveSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm("Unarchive selected feedback?")) {
      dispatch(unarchiveFeedback(selectedIds));
      toast.success("Selected feedback unarchived");
      clearSelection();
    }
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm("Delete selected feedback? This cannot be undone.")) {
      selectedIds.forEach((id) => dispatch(deleteFeedback(id)));
      toast.success("Selected feedback deleted");
      clearSelection();
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

  useEffect(() => {
    setMultiSelectMode(selectedIds.length > 0);
  }, [selectedIds]);

  const handleRowClick = (e, item) => {
    if (
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "INPUT" ||
      e.target.closest("button") ||
      e.target.closest("input")
    ) {
      return;
    }
    setViewFeedback(item);
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

          {/* Filter by Type */}
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

          {/* Filter by Priority */}
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

        {multiSelectMode && (
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
            <button
              onClick={clearSelection}
              className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white dark:from-gray-700 dark:to-gray-900">
            <tr>
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
              text-white-700 dark:text-gray-300
              ${
                (header === "Title" && sortBy === "title") ||
                (header === "Message" && sortBy === "message") ||
                (header === "Priority" && sortBy === "priority")
                  ? "underline underline-offset-4"
                  : ""
              }
            `}
                    onClick={() => {
                      if (header === "Title") handleSort("title");
                      else if (header === "Message") handleSort("message");
                      else if (header === "Priority") handleSort("priority");
                    }}
                    title={`Sort by ${header.toLowerCase()}`}
                  >
                    {header}
                    {sortBy === header.toLowerCase()
                      ? sortOrder === "asc"
                        ? " ▲"
                        : " ▼"
                      : ""}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={multiSelectMode ? 6 : 5}
                  className="text-center py-6 text-gray-400 italic dark:text-gray-500"
                >
                  No feedback found.
                </td>
              </tr>
            ) : (
              sortedData.map((item) => (
                <tr
                  key={item.id}
                  className={`cursor-pointer transition duration-300 ease-in-out
            ${
              selectedIds.includes(item.id)
                ? "bg-indigo-100 dark:bg-indigo-900"
                : "hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
            }
            text-gray-900 dark:text-gray-100
          `}
                  onClick={(e) => handleRowClick(e, item)}
                >
                  {multiSelectMode && (
                    <td className="px-4 py-3 text-center">
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
                  <td className="px-6 py-4 whitespace-normal max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-normal max-w-lg truncate">
                    {item.message}
                  </td>
                  <td className="px-6 py-4 font-medium text-indigo-700 dark:text-indigo-400">
                    {item.priority}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 flex space-x-2 justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      className="px-3 py-1 rounded bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition"
                      aria-label={`Edit feedback titled ${item.title}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive(item);
                      }}
                      className={`px-3 py-1 rounded text-white text-sm transition ${
                        item.archived
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
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
                      className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
                      aria-label={`Delete feedback titled ${item.title}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
