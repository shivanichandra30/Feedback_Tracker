// src/services/localStorage.js
const userKey = "loggedUser";
const feedbackKey = "feedbackItems";

// USER FUNCTIONS
export const saveUser = (user) => {
  localStorage.setItem(userKey, JSON.stringify(user));
};

export const loadUser = () => {
  const data = localStorage.getItem(userKey);
  return data ? JSON.parse(data) : null;
};

export const clearUser = () => {
  localStorage.removeItem(userKey);
};

// FEEDBACK FUNCTIONS
export const saveFeedbackItems = (items) => {
  localStorage.setItem(feedbackKey, JSON.stringify(items));
};

export const loadFeedbackItems = () => {
  const data = localStorage.getItem(feedbackKey);
  return data ? JSON.parse(data) : [];
};
