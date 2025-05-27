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
The app uses React for UI rendering and Redux Toolkit to manage global state including authentication status and feedback items. Feedback data is persisted in local storage to survive page reloads.

All CRUD operations on feedback are handled asynchronously with simulated delays to mimic API calls. The sliding drawer component provides an intuitive way to add or edit feedback without navigating away from the main view.

Local storage utilities are abstracted to centralize persistence logic. The UI is built with Tailwind CSS for fast styling and responsiveness, including support for dark mode.

Toast notifications inform users of success or failure actions, while loading states improve perceived responsiveness.

Overall, the project demonstrates a clean separation of concerns, scalable state management, and a polished UI/UX suitable for SaaS-style dashboards.

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
