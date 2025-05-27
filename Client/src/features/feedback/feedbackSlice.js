// src/features/feedback/feedbackSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

// Utility functions
const loadFromLocalStorage = () => {
  const data = localStorage.getItem("feedbackItems");
  return data ? JSON.parse(data) : [];
};

const saveToLocalStorage = (items) => {
  localStorage.setItem("feedbackItems", JSON.stringify(items));
};

// Simulate API delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Initial state
const initialState = {
  items: loadFromLocalStorage(),
  status: "idle",
  error: null,
};

// Async Thunks
export const addFeedback = createAsyncThunk(
  "feedback/addFeedback",
  async (feedback) => {
    await delay(500);
    return feedback;
  }
);

export const editFeedback = createAsyncThunk(
  "feedback/editFeedback",
  async (feedback) => {
    await delay(500);
    return feedback;
  }
);

export const deleteFeedback = createAsyncThunk(
  "feedback/deleteFeedback",
  async (id) => {
    await delay(500);
    return id;
  }
);

export const archiveFeedback = createAsyncThunk(
  "feedback/archiveFeedback",
  async (ids) => {
    await delay(500);
    return ids;
  }
);

export const unarchiveFeedback = createAsyncThunk(
  "feedback/unarchiveFeedback",
  async (ids) => {
    await delay(500);
    return ids;
  }
);

// Priority order for sorting
const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
  normal: 4,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Feedback
      .addCase(addFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.items.push({
          ...action.payload,
          archived: false,
          priority: action.payload.priority || "normal",
        });
        saveToLocalStorage(state.items);
        state.status = "succeeded";
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Edit Feedback
      .addCase(editFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editFeedback.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          const archived =
            typeof action.payload.archived === "boolean"
              ? action.payload.archived
              : state.items[index].archived;

          state.items[index] = {
            ...action.payload,
            archived,
            priority:
              action.payload.priority ||
              state.items[index].priority ||
              "normal",
          };
          saveToLocalStorage(state.items);
        }
        state.status = "succeeded";
      })
      .addCase(editFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Delete Feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        saveToLocalStorage(state.items);
        state.status = "succeeded";
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Archive Feedback (multiple)
      .addCase(archiveFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(archiveFeedback.fulfilled, (state, action) => {
        const idsToArchive = action.payload;
        state.items = state.items.map((item) =>
          idsToArchive.includes(item.id) ? { ...item, archived: true } : item
        );
        saveToLocalStorage(state.items);
        state.status = "succeeded";
      })
      .addCase(archiveFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Unarchive Feedback (multiple)
      .addCase(unarchiveFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(unarchiveFeedback.fulfilled, (state, action) => {
        const idsToUnarchive = action.payload;
        state.items = state.items.map((item) =>
          idsToUnarchive.includes(item.id) ? { ...item, archived: false } : item
        );
        saveToLocalStorage(state.items);
        state.status = "succeeded";
      })
      .addCase(unarchiveFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Selector to get feedback sorted by priority
export const selectFeedbackItemsSortedByPriority = createSelector(
  (state) => state.feedback.items,
  (items) =>
    [...items].sort((a, b) => {
      const prioA = priorityOrder[a.priority] || priorityOrder.normal;
      const prioB = priorityOrder[b.priority] || priorityOrder.normal;
      return prioA - prioB;
    })
);

export default feedbackSlice.reducer;
