# Feedback_Tracker

A modern SaaS-style feedback tracker built with **React + Vite**, powered by **Redux Toolkit**, **TailwindCSS**, and **localStorage** with mock JWT-based authentication. Includes rich table functionalities, a sliding drawer for CRUD actions, dark mode, toast notifications, and more.

---

## Tech Stack

- **React + Vite** — Fast, modern frontend stack
- **Redux Toolkit** — Scalable state management
- **TailwindCSS** — Utility-first CSS for rapid UI development
- **LocalStorage** — Persistent local data layer
- **Mocked JWT Authentication** — Simulated auth for prototyping
- **Dark Mode** — Toggle between light/dark themes
- **Toast Notifications** — Instant user feedback

---

## Features

- SaaS layout with sidebar navigation  
- Login system using mocked JWT authentication  
- Dashboard with a rich feedback table  
- Create/Edit feedback using a **Sliding Drawer**  
- Feedback actions: Edit, Delete, Archive, Multi-select  
- Table enhancements: Search, Filter, Sort  
- Persistent storage using `localStorage`  
- Clean and responsive UX with loading states & validation  
- Dark mode toggle  
- Toast notifications  

## Overview
---
This project simulates a full-fledged feedback management system without a backend. Here's how the solution is structured:

- **Authentication**: The authSlice.js manages user authentication states. It uses localStorage to persist the user's login state, mimicking a JWT-based authentication system.

- **Feedback Management**: The feedbackSlice.js handles all operations related to feedback items, including adding, editing, deleting, and archiving. Feedback data is stored in localStorage to persist across sessions.

- **UI Components**: Components like Drawer.jsx and FeedbackList.jsx provide a responsive and user-friendly interface. The sliding drawer interface allows users to add or edit feedback seamlessly.

- **State Management**: Redux Toolkit is used for state management, providing a predictable state container and simplifying the logic for handling asynchronous actions.

- **Styling**: TailwindCSS is utilized for styling, enabling rapid development of a responsive and modern UI.

---
## Getting Started

Clone the repository and run the app locally:

```bash
git clone https://github.com/shivanichandra30/feedback-dashboard.git
cd Client
npm install
npm run dev
```

- ## Sample Credentials (Mocked)
```bash
  Username: admin@example.com
  Password: password123
```
