require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const {
  Subject, Attendance, Timetable, Result, ExamSchedule,
  Library, Dues, Notification, Event, StudyResource,
  InboxMessage, Holiday, PracticeSchool, ExamRegistration, Canteen
} = require('../models/index');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([
    Student.deleteMany({}),
    Attendance.deleteMany({}),
    Timetable.deleteMany({}),
    Result.deleteMany({}),
    ExamSchedule.deleteMany({}),
    Library.deleteMany({}),
    Dues.deleteMany({}),
    Notification.deleteMany({}),
    Event.deleteMany({}),
    StudyResource.deleteMany({}),
    InboxMessage.deleteMany({}),
    Holiday.deleteMany({}),
    PracticeSchool.deleteMany({}),
  ]);

  // Create student
  const student = await Student.create({
    registrationNumber: 'REG2021CS001',
    rollNumber: '21CS001',
    name: 'Arjun Sharma',
    email: 'arjun@student.edu',
    password: 'password123',
    phone: '9876543210',
    localGuardianPhone: '9876501234',
    address: '45, MG Road, Bangalore, Karnataka 560001',
    bloodGroup: 'B+',
    gender: 'Male',
    religion: 'Hindu',
    caste: 'General',
    dateOfBirth: new Date('2003-05-15'),
    program: 'B.Tech',
    branch: 'CSE',
    year: 3,
    semester: 6,
    section: 'A',
    father: { name: 'Ramesh Sharma', phone: '9845001234', occupation: 'Engineer' },
    mother: { name: 'Sunita Sharma', phone: '9845005678', occupation: 'Teacher' },
    facultyAdvisor: { name: 'Dr. Priya Nair', phone: '9900112233', email: 'priya.nair@college.edu' },
    hostel: { name: 'Ganga Boys Hostel', roomNumber: 'B-204', bedNumber: 'B2' },
  });

  console.log('✅ Student created:', student.email, '/ password: password123');

  // Attendance
  const subjects = [
    { code: 'CS601', name: 'Machine Learning', total: 45, attended: 40 },
    { code: 'CS602', name: 'Computer Networks', total: 42, attended: 30 },
    { code: 'CS603', name: 'Database Systems', total: 44, attended: 42 },
    { code: 'CS604', name: 'Operating Systems', total: 40, attended: 36 },
    { code: 'CS605', name: 'Software Engineering', total: 38, attended: 38 },
    { code: 'CS606', name: 'Cloud Computing', total: 35, attended: 25 },
  ];

  const attendanceData = subjects.map(s => ({
    student: student._id,
    subjectName: s.name,
    subjectCode: s.code,
    totalClasses: s.total,
    attendedClasses: s.attended,
    percentage: Math.round((s.attended / s.total) * 100),
    semester: 6,
    monthlyData: [
      { month: 'Jan', attended: Math.floor(s.attended * 0.2), total: Math.floor(s.total * 0.2) },
      { month: 'Feb', attended: Math.floor(s.attended * 0.25), total: Math.floor(s.total * 0.25) },
      { month: 'Mar', attended: Math.floor(s.attended * 0.3), total: Math.floor(s.total * 0.3) },
      { month: 'Apr', attended: Math.floor(s.attended * 0.25), total: Math.floor(s.total * 0.25) },
    ]
  }));
  await Attendance.insertMany(attendanceData);

  // Timetable
  await Timetable.create({
    branch: 'CSE', semester: 6, section: 'A',
    schedule: [
      { day: 'Monday', slots: [
        { time: '9:00 - 10:00', subject: 'Machine Learning', subjectCode: 'CS601', faculty: 'Dr. A. Kumar', room: 'CS-101', type: 'Lecture' },
        { time: '10:00 - 11:00', subject: 'Computer Networks', subjectCode: 'CS602', faculty: 'Prof. B. Singh', room: 'CS-102', type: 'Lecture' },
        { time: '11:15 - 12:15', subject: 'Database Systems', subjectCode: 'CS603', faculty: 'Dr. C. Nair', room: 'CS-103', type: 'Lecture' },
        { time: '2:00 - 5:00', subject: 'ML Lab', subjectCode: 'CS601L', faculty: 'Dr. A. Kumar', room: 'CS-Lab1', type: 'Lab' },
      ]},
      { day: 'Tuesday', slots: [
        { time: '9:00 - 10:00', subject: 'Operating Systems', subjectCode: 'CS604', faculty: 'Dr. D. Verma', room: 'CS-104', type: 'Lecture' },
        { time: '10:00 - 11:00', subject: 'Software Engineering', subjectCode: 'CS605', faculty: 'Prof. E. Rao', room: 'CS-105', type: 'Lecture' },
        { time: '11:15 - 12:15', subject: 'Cloud Computing', subjectCode: 'CS606', faculty: 'Dr. F. Patel', room: 'CS-106', type: 'Lecture' },
      ]},
      { day: 'Wednesday', slots: [
        { time: '9:00 - 10:00', subject: 'Machine Learning', subjectCode: 'CS601', faculty: 'Dr. A. Kumar', room: 'CS-101', type: 'Lecture' },
        { time: '10:00 - 11:00', subject: 'Database Systems', subjectCode: 'CS603', faculty: 'Dr. C. Nair', room: 'CS-103', type: 'Lecture' },
        { time: '2:00 - 5:00', subject: 'Networks Lab', subjectCode: 'CS602L', faculty: 'Prof. B. Singh', room: 'CS-Lab2', type: 'Lab' },
      ]},
      { day: 'Thursday', slots: [
        { time: '9:00 - 10:00', subject: 'Computer Networks', subjectCode: 'CS602', faculty: 'Prof. B. Singh', room: 'CS-102', type: 'Lecture' },
        { time: '10:00 - 11:00', subject: 'Operating Systems', subjectCode: 'CS604', faculty: 'Dr. D. Verma', room: 'CS-104', type: 'Lecture' },
        { time: '11:15 - 12:15', subject: 'Software Engineering', subjectCode: 'CS605', faculty: 'Prof. E. Rao', room: 'CS-105', type: 'Lecture' },
      ]},
      { day: 'Friday', slots: [
        { time: '9:00 - 10:00', subject: 'Cloud Computing', subjectCode: 'CS606', faculty: 'Dr. F. Patel', room: 'CS-106', type: 'Lecture' },
        { time: '10:00 - 11:00', subject: 'Machine Learning', subjectCode: 'CS601', faculty: 'Dr. A. Kumar', room: 'CS-101', type: 'Lecture' },
        { time: '2:00 - 5:00', subject: 'OS Lab', subjectCode: 'CS604L', faculty: 'Dr. D. Verma', room: 'CS-Lab3', type: 'Lab' },
      ]},
    ]
  });

  // Results - multiple semesters
  const semesters = [
    { sem: 1, sgpa: 8.2, subjects: [
      { subjectCode: 'CS101', subjectName: 'Programming Fundamentals', credits: 4, internalMarks: 35, quizMarks: 9, surpriseTest: 8, teacherAssessment: 8, endSemMarks: 62, totalMarks: 80, grade: 'A', gradePoints: 9 },
      { subjectCode: 'MA101', subjectName: 'Engineering Mathematics I', credits: 4, internalMarks: 32, quizMarks: 8, surpriseTest: 7, teacherAssessment: 7, endSemMarks: 55, totalMarks: 72, grade: 'B+', gradePoints: 8 },
      { subjectCode: 'PH101', subjectName: 'Engineering Physics', credits: 3, internalMarks: 30, quizMarks: 8, surpriseTest: 8, teacherAssessment: 8, endSemMarks: 58, totalMarks: 75, grade: 'A-', gradePoints: 8.5 },
    ]},
    { sem: 2, sgpa: 8.5, subjects: [
      { subjectCode: 'CS201', subjectName: 'Data Structures', credits: 4, internalMarks: 38, quizMarks: 9, surpriseTest: 9, teacherAssessment: 9, endSemMarks: 68, totalMarks: 85, grade: 'A+', gradePoints: 10 },
      { subjectCode: 'CS202', subjectName: 'Object Oriented Programming', credits: 4, internalMarks: 36, quizMarks: 9, surpriseTest: 8, teacherAssessment: 8, endSemMarks: 65, totalMarks: 82, grade: 'A', gradePoints: 9 },
    ]},
    { sem: 3, sgpa: 8.8, subjects: [
      { subjectCode: 'CS301', subjectName: 'Algorithms', credits: 4, internalMarks: 38, quizMarks: 10, surpriseTest: 9, teacherAssessment: 9, endSemMarks: 70, totalMarks: 88, grade: 'A+', gradePoints: 10 },
      { subjectCode: 'CS302', subjectName: 'Discrete Mathematics', credits: 3, internalMarks: 35, quizMarks: 9, surpriseTest: 8, teacherAssessment: 8, endSemMarks: 65, totalMarks: 82, grade: 'A', gradePoints: 9 },
    ]},
    { sem: 4, sgpa: 9.0, subjects: [
      { subjectCode: 'CS401', subjectName: 'Theory of Computation', credits: 4, internalMarks: 39, quizMarks: 10, surpriseTest: 10, teacherAssessment: 9, endSemMarks: 72, totalMarks: 90, grade: 'O', gradePoints: 10 },
      { subjectCode: 'CS402', subjectName: 'Computer Architecture', credits: 4, internalMarks: 37, quizMarks: 9, surpriseTest: 9, teacherAssessment: 9, endSemMarks: 68, totalMarks: 86, grade: 'A+', gradePoints: 10 },
    ]},
    { sem: 5, sgpa: 8.9, subjects: [
      { subjectCode: 'CS501', subjectName: 'Compiler Design', credits: 4, internalMarks: 38, quizMarks: 9, surpriseTest: 9, teacherAssessment: 9, endSemMarks: 70, totalMarks: 88, grade: 'A+', gradePoints: 10 },
      { subjectCode: 'CS502', subjectName: 'Artificial Intelligence', credits: 4, internalMarks: 36, quizMarks: 9, surpriseTest: 8, teacherAssessment: 9, endSemMarks: 66, totalMarks: 84, grade: 'A', gradePoints: 9 },
    ]},
  ];

  const cgpaProgression = [8.2, 8.35, 8.5, 8.65, 8.8];
  for (let i = 0; i < semesters.length; i++) {
    await Result.create({
      student: student._id,
      semester: semesters[i].sem,
      academicYear: `202${i}-2${i+1}`,
      subjects: semesters[i].subjects,
      sgpa: semesters[i].sgpa,
      cgpa: cgpaProgression[i],
      result: 'Pass'
    });
  }

  // Exam Schedule
  await ExamSchedule.create({
    examName: 'End Semester Examination - Sem 6',
    branch: 'CSE', semester: 6,
    examType: 'End Semester',
    subjects: [
      { subjectCode: 'CS601', subjectName: 'Machine Learning', date: new Date('2025-04-20'), startTime: '10:00 AM', endTime: '1:00 PM', room: 'Exam Hall A', duration: '3 hours' },
      { subjectCode: 'CS602', subjectName: 'Computer Networks', date: new Date('2025-04-22'), startTime: '10:00 AM', endTime: '1:00 PM', room: 'Exam Hall B', duration: '3 hours' },
      { subjectCode: 'CS603', subjectName: 'Database Systems', date: new Date('2025-04-24'), startTime: '10:00 AM', endTime: '1:00 PM', room: 'Exam Hall A', duration: '3 hours' },
      { subjectCode: 'CS604', subjectName: 'Operating Systems', date: new Date('2025-04-26'), startTime: '10:00 AM', endTime: '1:00 PM', room: 'Exam Hall C', duration: '3 hours' },
      { subjectCode: 'CS605', subjectName: 'Software Engineering', date: new Date('2025-04-28'), startTime: '10:00 AM', endTime: '1:00 PM', room: 'Exam Hall B', duration: '3 hours' },
      { subjectCode: 'CS606', subjectName: 'Cloud Computing', date: new Date('2025-04-30'), startTime: '10:00 AM', endTime: '1:00 PM', room: 'Exam Hall A', duration: '3 hours' },
    ]
  });

  // Library
  await Library.create({
    student: student._id,
    books: [
      { bookId: 'LIB001', title: 'Introduction to Machine Learning', author: 'Ethem Alpaydin', issueDate: new Date('2025-02-01'), dueDate: new Date('2025-02-15'), status: 'Overdue', fine: 50 },
      { bookId: 'LIB002', title: 'Computer Networks', author: 'Andrew Tanenbaum', issueDate: new Date('2025-03-01'), dueDate: new Date('2025-03-31'), status: 'Issued', fine: 0 },
      { bookId: 'LIB003', title: 'Database System Concepts', author: 'Silberschatz', issueDate: new Date('2025-01-10'), dueDate: new Date('2025-01-25'), returnDate: new Date('2025-01-22'), status: 'Returned', fine: 0 },
    ]
  });

  // Dues
  await Dues.create({
    student: student._id,
    dues: [
      { description: 'Semester Fee - Sem 6', amount: 45000, dueDate: new Date('2025-02-01'), status: 'Paid', paidDate: new Date('2025-01-25'), receiptNumber: 'RCP2025001', category: 'Tuition' },
      { description: 'Hostel Fee - Jan-Mar', amount: 12000, dueDate: new Date('2025-01-15'), status: 'Paid', paidDate: new Date('2025-01-10'), receiptNumber: 'RCP2025002', category: 'Hostel' },
      { description: 'Exam Registration Fee', amount: 1500, dueDate: new Date('2025-03-31'), status: 'Pending', category: 'Exam' },
      { description: 'Library Fine', amount: 50, dueDate: new Date('2025-03-20'), status: 'Pending', category: 'Library' },
    ],
    totalPending: 1550,
  });

  // Notifications
  const notifications = [
    { title: '⚠️ Low Attendance Alert', message: 'Your attendance in Computer Networks (CS602) is 71.4%, below the required 80%. Please attend classes regularly.', type: 'Attendance', priority: 'High', isGlobal: false, student: student._id },
    { title: '📝 Exam Registration Open', message: 'End Semester Exam registration for Sem 6 is now open. Last date: March 31, 2025.', type: 'Exam', priority: 'Critical', isGlobal: true },
    { title: '📚 Library Book Overdue', message: '"Introduction to Machine Learning" was due on Feb 15. Current fine: ₹50. Please return immediately.', type: 'Library', priority: 'High', student: student._id },
    { title: '🎉 Tech Fest Registration', message: 'Technovation 2025 registrations are open! Register before March 25.', type: 'Event', priority: 'Medium', isGlobal: true },
    { title: '💳 Pending Dues Reminder', message: 'You have pending dues of ₹1,550. Please clear before exam registration.', type: 'Dues', priority: 'Medium', student: student._id },
  ];
  await Notification.insertMany(notifications);

  // Events
  const events = [
    { title: 'Technovation 2025', description: 'Annual Technical Fest featuring hackathons, coding contests, robotics, and tech talks by industry leaders.', date: new Date('2025-04-05'), endDate: new Date('2025-04-07'), location: 'Main Auditorium & Tech Block', organizer: 'CSE Department', category: 'Technical', poster: 'https://picsum.photos/seed/tech/400/200' },
    { title: 'Culturama Spring Edition', description: 'A vibrant cultural fest with music, dance, drama, and art competitions.', date: new Date('2025-03-28'), endDate: new Date('2025-03-29'), location: 'Open Air Theatre', organizer: 'Cultural Committee', category: 'Cultural', poster: 'https://picsum.photos/seed/culture/400/200' },
    { title: 'Campus Recruitment Drive - TCS', description: 'TCS is visiting campus for recruitment. Eligible: 3rd and 4th year students with 6.5+ CGPA.', date: new Date('2025-04-15'), location: 'Placement Hall', organizer: 'Placement Cell', category: 'Academic' },
    { title: 'National Sports Meet', description: 'Inter-college sports competition in cricket, football, basketball, and athletics.', date: new Date('2025-03-20'), endDate: new Date('2025-03-22'), location: 'Sports Complex', organizer: 'Sports Committee', category: 'Sports' },
  ];
  await Event.insertMany(events);

  // Study Resources
  const resources = [
    { title: 'ML Unit 1-3 Notes', description: 'Complete notes for Machine Learning units 1 to 3', subject: 'Machine Learning', subjectCode: 'CS601', semester: 6, type: 'Notes', fileUrl: '#', fileName: 'ML_Notes_Unit1-3.pdf', fileSize: '2.4 MB', uploadedBy: 'Dr. A. Kumar', downloads: 145 },
    { title: 'Computer Networks PYQ 2022-23', description: 'Previous year question papers for CN', subject: 'Computer Networks', subjectCode: 'CS602', semester: 6, type: 'PYQ', fileUrl: '#', fileName: 'CN_PYQ_2022.pdf', fileSize: '1.1 MB', uploadedBy: 'Prof. B. Singh', downloads: 289 },
    { title: 'DBMS Lab Manual', description: 'Complete lab manual with SQL exercises', subject: 'Database Systems', subjectCode: 'CS603', semester: 6, type: 'Lab Manual', fileUrl: '#', fileName: 'DBMS_Lab_Manual.pdf', fileSize: '3.2 MB', uploadedBy: 'Dr. C. Nair', downloads: 210 },
    { title: 'OS Reference Book Chapter 5', description: 'Memory Management - detailed reference material', subject: 'Operating Systems', subjectCode: 'CS604', semester: 6, type: 'Reference', fileUrl: '#', fileName: 'OS_Chapter5.pdf', fileSize: '4.1 MB', uploadedBy: 'Dr. D. Verma', downloads: 98 },
    { title: 'SE Solved Question Bank', description: 'Solved questions for software engineering', subject: 'Software Engineering', subjectCode: 'CS605', semester: 6, type: 'PYQ', fileUrl: '#', fileName: 'SE_QuestionBank.pdf', fileSize: '2.8 MB', uploadedBy: 'Prof. E. Rao', downloads: 178 },
  ];
  await StudyResource.insertMany(resources);

  // Inbox Messages
  const messages = [
    { isGlobal: true, sender: 'Prof. Ramesh Kumar (HOD)', senderRole: 'HOD', subject: 'Important: End Semester Exam Guidelines', message: 'Dear students, please note that the End Semester Examinations for Semester 6 will commence from April 20, 2025. All students must carry their admit cards. Mobile phones are strictly prohibited in the exam hall. Best of luck!' },
    { recipient: student._id, sender: 'Dr. Priya Nair (Faculty Advisor)', senderRole: 'Faculty', subject: 'Attendance Concern', message: 'Dear Arjun, I have noticed that your attendance in Computer Networks is below the required 75%. Please ensure you attend all remaining classes. If you have any issues, please meet me during my office hours (Tuesday 2-4 PM).' },
    { isGlobal: true, sender: 'Placement Cell', senderRole: 'Admin', subject: 'TCS Campus Recruitment - Eligibility List', message: 'The eligibility list for TCS Campus Recruitment Drive (April 15) has been published on the placement portal. Eligible students: CGPA 6.5+, No active backlogs. Please register by April 10.' },
    { recipient: student._id, sender: 'Library', senderRole: 'Admin', subject: 'Book Return Reminder', message: 'This is a reminder that "Introduction to Machine Learning" (Book ID: LIB001) was due on February 15, 2025. The current fine is ₹50. Please return the book at the earliest to avoid further fines.' },
  ];
  await InboxMessage.insertMany(messages);

  // Holidays
  const holidays = [
    { name: 'Republic Day', date: new Date('2025-01-26'), type: 'National', description: 'National Holiday' },
    { name: 'Maha Shivaratri', date: new Date('2025-02-26'), type: 'Festival' },
    { name: 'Holi', date: new Date('2025-03-14'), type: 'Festival' },
    { name: 'Good Friday', date: new Date('2025-04-18'), type: 'National' },
    { name: 'Ugadi / Gudi Padwa', date: new Date('2025-03-30'), type: 'Regional' },
    { name: 'Dr. Ambedkar Jayanti', date: new Date('2025-04-14'), type: 'National' },
    { name: 'College Foundation Day', date: new Date('2025-04-01'), type: 'College', description: 'Annual College Day Celebrations' },
    { name: 'Eid al-Fitr', date: new Date('2025-04-02'), type: 'Festival' },
    { name: 'Independence Day', date: new Date('2025-08-15'), type: 'National' },
    { name: 'Dussehra', date: new Date('2025-10-02'), type: 'Festival' },
    { name: 'Diwali', date: new Date('2025-10-20'), type: 'Festival' },
    { name: 'Christmas', date: new Date('2025-12-25'), type: 'National' },
  ];
  await Holiday.insertMany(holidays);

  // Practice School
  await PracticeSchool.create({
    student: student._id,
    company: 'Infosys Limited',
    role: 'Software Engineer Intern',
    location: 'Bangalore, Karnataka',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-07-31'),
    mentor: { name: 'Mr. Vivek Malhotra', email: 'vivek.m@infosys.com', phone: '9988776655' },
    stipend: 15000,
    status: 'Completed',
    grade: 'A',
  });

  // Canteen
  await Canteen.create({
    student: student._id,
    week: 'Week of March 17, 2025',
    isActive: true,
    preferences: [
      { day: 'Monday', breakfast: 'Veg', lunch: 'Non-Veg', dinner: 'Veg' },
      { day: 'Tuesday', breakfast: 'Veg', lunch: 'Veg', dinner: 'Non-Veg' },
      { day: 'Wednesday', breakfast: 'Veg', lunch: 'Non-Veg', dinner: 'Veg' },
      { day: 'Thursday', breakfast: 'Veg', lunch: 'Veg', dinner: 'Veg' },
      { day: 'Friday', breakfast: 'Veg', lunch: 'Non-Veg', dinner: 'Non-Veg' },
      { day: 'Saturday', breakfast: 'Veg', lunch: 'Veg', dinner: 'Skip' },
    ]
  });

  // Exam Registration
  await ExamRegistration.create({
    student: student._id,
    semester: 6,
    examType: 'Regular',
    registeredSubjects: [
      { subjectCode: 'CS601', subjectName: 'Machine Learning', credits: 4, type: 'Regular' },
      { subjectCode: 'CS602', subjectName: 'Computer Networks', credits: 4, type: 'Regular' },
      { subjectCode: 'CS603', subjectName: 'Database Systems', credits: 4, type: 'Regular' },
      { subjectCode: 'CS604', subjectName: 'Operating Systems', credits: 3, type: 'Regular' },
      { subjectCode: 'CS605', subjectName: 'Software Engineering', credits: 3, type: 'Regular' },
      { subjectCode: 'CS606', subjectName: 'Cloud Computing', credits: 3, type: 'Regular' },
    ],
    status: 'Submitted',
    examFee: 1500,
    paymentStatus: 'Pending',
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Login: arjun@student.edu | 🔑 Password: password123');
  mongoose.connection.close();
};

seed().catch(console.error);
