# HackSphere - Full-Stack Hackathon Management Platform (Major Capstone Project)

**HackSphere** is a centralized, role-based Hackathon Management Platform built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled using **Tailwind CSS**. It eliminates the hassle of managing hackathons across Google Forms, WhatsApp groups, spreadsheets, and drive links by providing a single streamlined solution.

---

## 🌟 Key Features & Role Architecture

The platform natively supports **4 distinct user roles**:

### 1. 👑 Administrator (Platform Governance)
- **User Moderation**: View all registered users across roles, toggle Block/Unblock status, or delete accounts.
- **Platform Analytics**: Global counters for total users, hackathons, registered teams, code submissions, and active judge reviews.
- **Audit Logs**: Live stream of system-wide actions and events.

### 2. 🚀 Organizer (Event Host & Manager)
- **Hackathon Lifecycle**: Create, edit, and manage hackathons (Title, Theme, Mode, Dates, Banner, Prize Pool, Max Team Size, Rules).
- **Jury Assignment**: Assign expert judges to specific hackathons for evaluation.
- **Team Management**: Approve or reject team registrations and track incoming submissions.

### 3. 💻 Participant (Hacker & Student)
- **Browse & Filter**: Search hackathons by keywords, mode (Online/Offline/Hybrid), and lifecycle status.
- **Team Formation**: Create a new team (auto-generates unique invite code e.g. `HS-CYBER1`) or join an existing team via code.
- **Leader Transfer**: Transfer leadership to teammates or manage member roster.
- **Project Submission**: Submit GitHub repository URL, live demo link, demo video link, tech stack tags, problem statement, solution, and screenshots.

### 4. ⚖️ Judge (Rubric Matrix Evaluator)
- **Assigned Projects Portal**: View all project submissions assigned to the judge.
- **Multi-Criteria Scoring Rubric**: Score submissions on a 0–10 scale across 6 predefined criteria:
  1. *Innovation & Novelty*
  2. *Technical Complexity*
  3. *UI / UX Design*
  4. *Functionality & Feasibility*
  5. *Scalability & Architecture*
  6. *Presentation & Pitch*
- **Feedback & Comments**: Provide constructive feedback and submit scores to update the live leaderboard.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React Icons, Axios.
- **Backend**: Node.js, Express.js REST API, Mongoose ORM, JSONWebToken (JWT), BcryptJS.
- **Database**: MongoDB (with automated seed engine and memory fallback).

---

## ⚡ Quick Start & Running Locally

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Start Backend API Server
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:5000` and automatically seed initial demo data.

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🔑 Pre-Seeded Demo Credentials (1-Click Login Available)

For testing and viva demonstrations, use the top navbar **"Demo Roles"** dropdown or the credentials below:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@hacksphere.io` | `password123` |
| **Organizer** | `organizer@hacksphere.io` | `password123` |
| **Judge** | `judge@hacksphere.io` | `password123` |
| **Participant** | `participant@hacksphere.io` | `password123` |

---

## 📁 Repository Structure

```
hacksphere/
├── server/
│   ├── config/          # MongoDB configuration
│   ├── controllers/     # Auth, User, Hackathon, Team, Submission, Review, Analytics
│   ├── middleware/      # Protect JWT auth & authorize RBAC middleware
│   ├── models/          # User, Hackathon, Team, Submission, Review, ActivityLog
│   ├── routes/          # Express API route endpoints
│   ├── utils/           # Database seeder & leaderboard logic
│   ├── package.json
│   └── server.js        # Express app entrypoint
├── client/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProtectedRoute, HackathonCard, CountdownTimer, Modal
│   │   ├── context/     # AuthContext with quick role switcher
│   │   ├── pages/       # Home, Login, Signup, Profile, HackathonList, Detail, Team, Submission, Leaderboard, Dashboards
│   │   ├── services/    # Axios API client interceptor
│   │   ├── App.jsx
│   │   ├── index.css    # Tailwind CSS & custom design tokens
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```
