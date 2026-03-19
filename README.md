# 🎓 UniCampus — Student ERP System

A full-stack **MERN** Student Enterprise Resource Planning system built as a Final Year Computer Science project.

---

## 🚀 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React.js, Tailwind CSS, Framer Motion, Recharts |
| Backend    | Node.js, Express.js (MVC Architecture)          |
| Database   | MongoDB with Mongoose ODM                       |
| Auth       | JWT Authentication + bcryptjs                   |
| Icons      | Lucide React                                    |
| File Upload| Multer                                          |

---

## 📁 Project Structure

```
student-erp/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login, profile update
│   │   └── studentController.js  # All module controllers
│   ├── middleware/
│   │   └── auth.js                # JWT protect middleware
│   ├── models/
│   │   ├── Student.js             # Student schema
│   │   └── index.js               # All other schemas (20 models)
│   ├── routes/
│   │   └── index.js               # All API routes
│   ├── utils/
│   │   └── seedData.js            # Database seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx         # Top navigation
    │   │   ├── Sidebar.jsx        # Collapsible sidebar
    │   │   └── UI.jsx             # Reusable components
    │   ├── context/
    │   │   ├── AuthContext.js     # Auth state management
    │   │   └── ThemeContext.js    # Dark mode
    │   ├── layouts/
    │   │   └── MainLayout.jsx     # App shell
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── AcademicsPages.jsx  # Academics, Attendance, Timetable
    │   │   ├── AcademicModules.jsx # Results, ExamSchedule, Library
    │   │   ├── StudentModules.jsx  # Hostel, Dues, Canteen, Feedback
    │   │   └── OtherModules.jsx    # Events, Resources, Vault, Inbox,
    │   │                           # Notifications, Holidays, Practice
    │   │                           # School, Exam Reg, Anti-Ragging
    │   ├── services/
    │   │   └── api.js             # Axios API service
    │   ├── App.js                 # Router + routes
    │   ├── index.js
    │   └── index.css              # Tailwind + Google Fonts
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ Quick Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### Step 1 — Clone and Install

```bash
# Clone the project
git clone <your-repo-url>
cd student-erp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure Environment

```bash
# In the backend folder, create .env from example
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_erp
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

For **MongoDB Atlas**:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/student_erp
```

---

### Step 3 — Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 1 student account with full data
- Attendance records, timetable, results (5 semesters)
- Exam schedule, library records, dues
- Notifications, events, study resources
- Inbox messages, holidays, practice school data

**Demo login:**
```
Email:    arjun@student.edu
Password: password123
```

---

### Step 4 — Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Server starts at: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```
App opens at: `http://localhost:3000`

---

## 📱 Modules

| #  | Module            | Features                                        |
|----|-------------------|-------------------------------------------------|
| 1  | Dashboard         | Stats, CGPA graph, alerts, quick links          |
| 2  | Profile           | Full profile, editable contact details           |
| 3  | Academics         | Registered subjects, credits, faculty           |
| 4  | Timetable         | Day-wise schedule with lab/lecture types        |
| 5  | Attendance        | Subject-wise %, progress bars, charts           |
| 6  | Exam Schedule     | Date/time/room for all exams                    |
| 7  | Results           | Grade sheet, SGPA/CGPA, graphs                  |
| 8  | Library           | Books issued, dues, overdue alerts              |
| 9  | Hostel            | Room details, leave applications                |
| 10 | Dues              | Pending/paid dues, receipt download             |
| 11 | Canteen           | Weekly meal preference (Veg/Non-Veg/Skip)       |
| 12 | Faculty Feedback  | Star ratings with 5 criteria                    |
| 13 | Events            | Card layout with posters                        |
| 14 | Study Resources   | Downloadable notes, PYQs, lab manuals           |
| 15 | Document Vault    | Upload/preview/delete personal documents        |
| 16 | Inbox             | Faculty & admin messages                        |
| 17 | Notifications     | Smart alerts with priority levels               |
| 18 | Holiday List      | Academic year holidays by month                 |
| 19 | Practice School   | Internship details and mentor info              |
| 20 | Exam Registration | Subject registration for end-sem exams          |
| 21 | Anti-Ragging      | Guidelines + confidential complaint form        |

---

## 🔌 API Endpoints

```
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/update-profile

GET    /api/dashboard/stats
GET    /api/timetable
GET    /api/attendance
GET    /api/results
GET    /api/exam-schedule
GET    /api/library
GET    /api/leaves
POST   /api/leaves
GET    /api/dues
GET    /api/canteen
POST   /api/canteen
GET    /api/feedback
POST   /api/feedback
GET    /api/notifications
PUT    /api/notifications/:id/read
GET    /api/events
GET    /api/resources
GET    /api/documents
POST   /api/documents
DELETE /api/documents/:docId
GET    /api/inbox
PUT    /api/inbox/:id/read
GET    /api/holidays
GET    /api/practice-school
GET    /api/exam-registration
POST   /api/exam-registration
```

---

## 🎨 UI Features

- **Dark/Light mode** toggle
- **Collapsible sidebar** with smooth animation (Framer Motion)
- **Responsive layout** (mobile + desktop)
- **Charts** using Recharts (Area, Bar, Pie, Line)
- **Animated page transitions**
- **Smart alert banners** for attendance/dues
- **Notification dropdown** in navbar
- **Progress bars** with auto color coding
- **Card grid layouts** with hover effects

---

## 🗃️ Database Models (20)

Student, Subject, Attendance, Timetable, Result, ExamSchedule, Library, LeaveApplication, Dues, Canteen, FacultyFeedback, Notification, Event, StudyResource, DocumentVault, InboxMessage, Holiday, PracticeSchool, ExamRegistration

---

## 🐛 Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running: `sudo systemctl start mongod`
- Or use MongoDB Atlas URI in `.env`

**Port already in use:**
- Change `PORT` in backend `.env`
- Or kill process: `kill -9 $(lsof -t -i:5000)`

**CORS error:**
- Make sure frontend proxy in `package.json` points to `http://localhost:5000`
- Check `CLIENT_URL` in backend `.env`

---

## 📝 Notes for Final Year Project

- Architecture: **MVC (Model-View-Controller)**
- JWT tokens stored in **localStorage**
- All API routes protected with **middleware**
- **20 MongoDB schemas** demonstrating complex data modeling
- **Recharts** for data visualization
- **Framer Motion** for professional animations
- **Tailwind CSS** for responsive, modern UI

---

*Built with ❤️ as a Final Year Computer Science Project*
