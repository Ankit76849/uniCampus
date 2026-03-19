const mongoose = require('mongoose');

// Subject Model
const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  faculty: { name: String, email: String, phone: String },
  type: { type: String, enum: ['Theory', 'Lab', 'Elective'], default: 'Theory' },
}, { timestamps: true });

// Attendance Model
const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  subjectName: { type: String },
  subjectCode: { type: String },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  monthlyData: [{ month: String, attended: Number, total: Number }],
  semester: { type: Number },
}, { timestamps: true });

// Timetable Model
const timetableSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String },
  schedule: [{
    day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] },
    slots: [{
      time: String,
      subject: String,
      subjectCode: String,
      faculty: String,
      room: String,
      type: { type: String, enum: ['Lecture','Lab','Tutorial'] }
    }]
  }]
}, { timestamps: true });

// Result Model
const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester: { type: Number, required: true },
  academicYear: { type: String },
  subjects: [{
    subjectCode: String,
    subjectName: String,
    credits: Number,
    internalMarks: Number,
    quizMarks: Number,
    surpriseTest: Number,
    teacherAssessment: Number,
    endSemMarks: Number,
    totalMarks: Number,
    grade: String,
    gradePoints: Number,
  }],
  sgpa: { type: Number },
  cgpa: { type: Number },
  totalCredits: { type: Number },
  result: { type: String, enum: ['Pass','Fail','Withheld'] }
}, { timestamps: true });

// Exam Schedule Model
const examScheduleSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  branch: { type: String },
  semester: { type: Number },
  examType: { type: String, enum: ['Internal','End Semester','Supplementary','Practical'] },
  subjects: [{
    subjectCode: String,
    subjectName: String,
    date: Date,
    startTime: String,
    endTime: String,
    room: String,
    duration: String,
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Library Model
const librarySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  books: [{
    bookId: String,
    title: String,
    author: String,
    issueDate: Date,
    dueDate: Date,
    returnDate: Date,
    fine: { type: Number, default: 0 },
    status: { type: String, enum: ['Issued','Returned','Overdue'], default: 'Issued' },
  }]
}, { timestamps: true });

// Leave Application Model
const leaveApplicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  leaveType: { type: String, enum: ['Hostel','Academic','Medical'], required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  remarks: { type: String },
  appliedOn: { type: Date, default: Date.now },
}, { timestamps: true });

// Dues Model
const duesSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  dues: [{
    description: String,
    amount: Number,
    dueDate: Date,
    status: { type: String, enum: ['Pending','Paid'], default: 'Pending' },
    paidDate: Date,
    receiptNumber: String,
    category: { type: String, enum: ['Tuition','Hostel','Library','Canteen','Exam','Other'] }
  }],
  totalPending: { type: Number, default: 0 },
}, { timestamps: true });

// Canteen Registration Model
const canteenSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  week: { type: String },
  preferences: [{
    day: String,
    breakfast: { type: String, enum: ['Veg','Non-Veg','Skip'] },
    lunch: { type: String, enum: ['Veg','Non-Veg','Skip'] },
    dinner: { type: String, enum: ['Veg','Non-Veg','Skip'] },
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Faculty Feedback Model
const feedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  faculty: { name: String, email: String },
  ratings: {
    teachingStyle: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 },
    clarity: { type: Number, min: 1, max: 5 },
    interaction: { type: Number, min: 1, max: 5 },
    overall: { type: Number, min: 1, max: 5 },
  },
  comments: { type: String },
  semester: { type: Number },
}, { timestamps: true });

// Notification Model
const notificationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Attendance','Dues','Exam','Library','Event','General','Alert'], default: 'General' },
  isRead: { type: Boolean, default: false },
  isGlobal: { type: Boolean, default: false },
  priority: { type: String, enum: ['Low','Medium','High','Critical'], default: 'Medium' },
}, { timestamps: true });

// Event Model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String },
  organizer: { type: String },
  poster: { type: String },
  category: { type: String, enum: ['Cultural','Technical','Sports','Academic','Other'] },
  isActive: { type: Boolean, default: true },
  registrationLink: { type: String },
}, { timestamps: true });

// Study Resource Model
const studyResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  subjectCode: { type: String },
  semester: { type: Number, required: true },
  branch: { type: String },
  type: { type: String, enum: ['Notes','PYQ','Assignment','Reference','Lab Manual'], required: true },
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: String },
  uploadedBy: { type: String },
  downloads: { type: Number, default: 0 },
}, { timestamps: true });

// Document Vault Model
const documentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  documents: [{
    name: String,
    type: { type: String, enum: ['Aadhar','PAN','Driving License','Certificate','Marksheet','Other'] },
    fileUrl: String,
    fileName: String,
    uploadedAt: { type: Date, default: Date.now },
    fileSize: String,
  }]
}, { timestamps: true });

// Inbox Message Model
const inboxSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  isGlobal: { type: Boolean, default: false },
  sender: { type: String, required: true },
  senderRole: { type: String, enum: ['Faculty','Admin','HOD','Principal'] },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  attachments: [{ name: String, url: String }],
}, { timestamps: true });

// Holiday Model
const holidaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['National','Regional','Festival','College','Restricted'] },
  description: { type: String },
}, { timestamps: true });

// Practice School Model
const practiceSchoolSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  company: { type: String },
  role: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  mentor: { name: String, email: String, phone: String },
  stipend: { type: Number },
  status: { type: String, enum: ['Applied','Ongoing','Completed','Not Applied'], default: 'Not Applied' },
  report: { type: String },
  grade: { type: String },
}, { timestamps: true });

// Exam Registration Model
const examRegistrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester: { type: Number, required: true },
  examType: { type: String, enum: ['Regular','Back','Improvement'], default: 'Regular' },
  registeredSubjects: [{
    subjectCode: String,
    subjectName: String,
    credits: Number,
    type: { type: String, enum: ['Regular','Back'] }
  }],
  status: { type: String, enum: ['Draft','Submitted','Approved','AdmitCardGenerated'], default: 'Draft' },
  registrationDate: { type: Date, default: Date.now },
  examFee: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Pending','Paid'], default: 'Pending' },
}, { timestamps: true });

module.exports = {
  Subject: mongoose.model('Subject', subjectSchema),
  Attendance: mongoose.model('Attendance', attendanceSchema),
  Timetable: mongoose.model('Timetable', timetableSchema),
  Result: mongoose.model('Result', resultSchema),
  ExamSchedule: mongoose.model('ExamSchedule', examScheduleSchema),
  Library: mongoose.model('Library', librarySchema),
  LeaveApplication: mongoose.model('LeaveApplication', leaveApplicationSchema),
  Dues: mongoose.model('Dues', duesSchema),
  Canteen: mongoose.model('Canteen', canteenSchema),
  FacultyFeedback: mongoose.model('FacultyFeedback', feedbackSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Event: mongoose.model('Event', eventSchema),
  StudyResource: mongoose.model('StudyResource', studyResourceSchema),
  DocumentVault: mongoose.model('DocumentVault', documentSchema),
  InboxMessage: mongoose.model('InboxMessage', inboxSchema),
  Holiday: mongoose.model('Holiday', holidaySchema),
  PracticeSchool: mongoose.model('PracticeSchool', practiceSchoolSchema),
  ExamRegistration: mongoose.model('ExamRegistration', examRegistrationSchema),
};
