# 🍲 Kya Saabzi? (Frontend)

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

**Kya Saabzi** is a modern, responsive web application designed to solve the everyday dilemma of *"Aaj kya banau?"* (What should I cook today?). It acts as the frontend interface for the Kya Saabzi backend, offering households an intelligent dish recommendation experience, history tracking, and an intuitive UI.

---

## 📑 Table of Contents
1. [Core Features](#-core-features)
2. [Tech Stack](#️-tech-stack)
3. [Getting Started](#-getting-started)
4. [Project Structure](#-project-structure)
5. [API Integration](#-api-integration)
6. [Contributing](#-contributing)

---

## ✨ Core Features

-   **🎯 Intelligent Dashboard**: Get meal-aware, household-specific dish recommendations directly upon logging in.
-   **📚 Dish Management**: View, create, and manage your household's repository of dishes. Integrates with the backend's AI enrichment to automatically fill in ingredients and prep time.
-   **📜 Cook Logs History**: A dedicated view to track exactly what your household cooked, along with personal ratings and notes.
-   **🔐 Secure Authentication**: Full JWT-based authentication flow (Login/Register) with secure token storage and session management.
-   **📱 Responsive UI**: Beautifully designed interface powered by Tailwind CSS, perfectly responsive across mobile and desktop.

---

## 🛠️ Tech Stack

-   **Core Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite 7](https://vitejs.dev/) (Extremely fast HMR)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Routing**: [React Router v7](https://reactrouter.com/)
-   **HTTP Client**: [Axios](https://axios-http.com/) (Configured for API v1)
-   **Code Quality**: ESLint

---

## 🚀 Getting Started

Follow these steps to set up and run the frontend locally.

### 1. Prerequisites
-   Node.js (v18 or higher recommended)
-   Running instance of the [Kya Saabzi Backend](https://github.com/manav-sh1/kya-saabzi-backend)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/manav-sh1/kya-saabzi-frontend.git
cd kya-saabzi-frontend

# Install dependencies
npm install
```

### 3. Configuration
Create a `.env` file in the root directory. This tells the frontend where the backend API is running.

```env
# Example .env configuration
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 4. Running the Development Server
```bash
npm run dev
```

The application will typically be available at: `http://localhost:5173/`

### 5. Building for Production
To create an optimized production build:
```bash
npm run build
```
This will generate static files in the `dist` folder.

---

## 📂 Project Structure

```text
kya-saabzi-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/                # Axios configuration and API service wrappers
│   ├── assets/             # Images, global stylesheets (index.css)
│   ├── components/         # Reusable UI components (Buttons, Cards, Modals)
│   ├── pages/              # Route-level components (Dashboard, CooklogPage, etc.)
│   ├── App.jsx             # Main application and router setup
│   └── main.jsx            # React DOM entry point
├── .env                    # Local environment variables
├── eslint.config.js        # Linter configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

---

## 🔌 API Integration

This frontend is designed to strictly communicate with the backend's `v1` REST API. All API calls are routed through an Axios instance configured in `src/api/services.js`. The `VITE_API_BASE_URL` environment variable is used to automatically prefix `/api/v1` to all outgoing requests, ensuring smooth compatibility with the backend's versioning strategy.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFrontendFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFrontendFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFrontendFeature`)
5. Open a Pull Request

---

*Created with ❤️ for home chefs everywhere.*
