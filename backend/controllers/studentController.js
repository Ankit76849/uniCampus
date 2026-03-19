const {
  Attendance, Result, ExamSchedule, Library, LeaveApplication,
  Dues, Canteen, FacultyFeedback, Notification, Event, StudyResource,
  DocumentVault, InboxMessage, Holiday, PracticeSchool, ExamRegistration,
  Timetable, Subject
} = require('../models/index');

// ===== ATTENDANCE =====
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.student._id });
    res.json({ success: true, attendance });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== TIMETABLE =====
exports.getTimetable = async (req, res) => {
  try {
    const tt = await Timetable.findOne({
      branch: req.student.branch,
      semester: req.student.semester,
    });
    res.json({ success: true, timetable: tt });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== RESULTS =====
exports.getResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.student._id }).sort({ semester: 1 });
    res.json({ success: true, results });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== EXAM SCHEDULE =====
exports.getExamSchedule = async (req, res) => {
  try {
    const exams = await ExamSchedule.find({
      $or: [{ branch: req.student.branch }, { branch: null }],
      semester: req.student.semester,
      isActive: true
    });
    res.json({ success: true, exams });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== LIBRARY =====
exports.getLibrary = async (req, res) => {
  try {
    let lib = await Library.findOne({ student: req.student._id });
    res.json({ success: true, library: lib });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== LEAVE =====
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await LeaveApplication.find({ student: req.student._id }).sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.applyLeave = async (req, res) => {
  try {
    const leave = await LeaveApplication.create({ student: req.student._id, ...req.body });
    res.status(201).json({ success: true, leave });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== DUES =====
exports.getDues = async (req, res) => {
  try {
    const dues = await Dues.findOne({ student: req.student._id });
    res.json({ success: true, dues });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== CANTEEN =====
exports.getCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findOne({ student: req.student._id, isActive: true });
    res.json({ success: true, canteen });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.saveCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findOneAndUpdate(
      { student: req.student._id, isActive: true },
      { ...req.body, student: req.student._id },
      { upsert: true, new: true }
    );
    res.json({ success: true, canteen });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== FEEDBACK =====
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await FacultyFeedback.find({ student: req.student._id });
    res.json({ success: true, feedback });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = await FacultyFeedback.create({ student: req.student._id, ...req.body });
    res.status(201).json({ success: true, feedback });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== NOTIFICATIONS =====
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ student: req.student._id }, { isGlobal: true }]
    }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== EVENTS =====
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.json({ success: true, events });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== STUDY RESOURCES =====
exports.getResources = async (req, res) => {
  try {
    const { subject, semester, type } = req.query;
    const filter = {};
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (semester) filter.semester = Number(semester);
    if (type) filter.type = type;
    const resources = await StudyResource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, resources });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== DOCUMENT VAULT =====
exports.getDocuments = async (req, res) => {
  try {
    const vault = await DocumentVault.findOne({ student: req.student._id });
    res.json({ success: true, vault });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { name, type } = req.body;
    const doc = { name, type, fileUrl: '#', fileName: name, fileSize: '1MB' };
    await DocumentVault.findOneAndUpdate(
      { student: req.student._id },
      { $push: { documents: doc } },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Document uploaded' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.deleteDocument = async (req, res) => {
  try {
    await DocumentVault.findOneAndUpdate(
      { student: req.student._id },
      { $pull: { documents: { _id: req.params.docId } } }
    );
    res.json({ success: true, message: 'Document deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== INBOX =====
exports.getInbox = async (req, res) => {
  try {
    const messages = await InboxMessage.find({
      $or: [{ recipient: req.student._id }, { isGlobal: true }]
    }).sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.markMessageRead = async (req, res) => {
  try {
    await InboxMessage.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== HOLIDAYS =====
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json({ success: true, holidays });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== PRACTICE SCHOOL =====
exports.getPracticeSchool = async (req, res) => {
  try {
    const ps = await PracticeSchool.findOne({ student: req.student._id });
    res.json({ success: true, practiceSchool: ps });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== EXAM REGISTRATION =====
exports.getExamRegistration = async (req, res) => {
  try {
    const reg = await ExamRegistration.findOne({
      student: req.student._id,
      semester: req.student.semester
    });
    res.json({ success: true, registration: reg });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.submitExamRegistration = async (req, res) => {
  try {
    const reg = await ExamRegistration.findOneAndUpdate(
      { student: req.student._id, semester: req.student.semester },
      { ...req.body, student: req.student._id, status: 'Submitted' },
      { upsert: true, new: true }
    );
    res.json({ success: true, registration: reg });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ===== DASHBOARD STATS =====
exports.getDashboardStats = async (req, res) => {
  try {
    const [attendance, results, dues, notifications, events, exams] = await Promise.all([
      Attendance.find({ student: req.student._id }),
      Result.find({ student: req.student._id }).sort({ semester: -1 }).limit(1),
      Dues.findOne({ student: req.student._id }),
      Notification.countDocuments({ $or: [{ student: req.student._id }, { isGlobal: true }], isRead: false }),
      Event.find({ isActive: true, date: { $gte: new Date() } }).sort({ date: 1 }).limit(3),
      ExamSchedule.findOne({ semester: req.student.semester, isActive: true })
    ]);

    const avgAttendance = attendance.length
      ? Math.round(attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length)
      : 0;
    const cgpa = results.length ? results[0].cgpa : 0;
    const pendingDues = dues ? dues.dues.filter(d => d.status === 'Pending').reduce((s, d) => s + d.amount, 0) : 0;

    res.json({
      success: true,
      stats: { avgAttendance, cgpa, pendingDues, unreadNotifications: notifications, upcomingEvents: events, upcomingExam: exams }
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
