const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const studentController = require("../controllers/studentController");
const { protect } = require("../middleware/auth");

const upload = require('../middleware/upload');
const { DocVault } = require('../models');

// Auth routes
router.post("/auth/login", authController.login);
router.get("/auth/me", protect, authController.getMe);
router.put("/auth/update-profile", protect, authController.updateProfile);

// Dashboard
router.get("/dashboard/stats", protect, studentController.getDashboardStats);

// Academics / Timetable
router.get("/timetable", protect, studentController.getTimetable);

// Attendance
router.get("/attendance", protect, studentController.getAttendance);

// Results
router.get("/results", protect, studentController.getResults);

// Exam Schedule
router.get("/exam-schedule", protect, studentController.getExamSchedule);

// Library
router.get("/library", protect, studentController.getLibrary);

// Hostel / Leave
router.get("/leaves", protect, studentController.getLeaves);
router.post("/leaves", protect, studentController.applyLeave);

// Dues
router.get("/dues", protect, studentController.getDues);

// Canteen
router.get("/canteen", protect, studentController.getCanteen);
router.post("/canteen", protect, studentController.saveCanteen);

// Faculty Feedback
router.get("/feedback", protect, studentController.getFeedback);
router.post("/feedback", protect, studentController.submitFeedback);

// Notifications
router.get("/notifications", protect, studentController.getNotifications);
router.put(
  "/notifications/:id/read",
  protect,
  studentController.markNotificationRead,
);

// Events
router.get("/events", protect, studentController.getEvents);

// Study Resources
router.get("/resources", protect, studentController.getResources);

// Document Vault
router.get("/documents", protect, studentController.getDocuments);
router.post(
  "/documents",
  protect,
  upload.single("file"),
  studentController.uploadDocument,
);
router.delete("/documents/:docId", protect, studentController.deleteDocument);

// Inbox
router.get("/inbox", protect, studentController.getInbox);
router.put("/inbox/:id/read", protect, studentController.markMessageRead);

// Holidays
router.get("/holidays", protect, studentController.getHolidays);

// Practice School
router.get("/practice-school", protect, studentController.getPracticeSchool);

// Exam Registration
router.get(
  "/exam-registration",
  protect,
  studentController.getExamRegistration,
);
router.post(
  "/exam-registration",
  protect,
  studentController.submitExamRegistration,
);

module.exports = router;
