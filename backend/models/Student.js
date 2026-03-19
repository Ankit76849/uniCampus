const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  localGuardianPhone: { type: String },
  address: { type: String },
  bloodGroup: { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },
  gender: { type: String, enum: ['Male','Female','Other'] },
  religion: { type: String },
  caste: { type: String },
  dateOfBirth: { type: Date },
  photo: { type: String, default: '' },
  program: { type: String, default: 'B.Tech' },
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  section: { type: String },
  father: {
    name: { type: String },
    phone: { type: String },
    occupation: { type: String },
  },
  mother: {
    name: { type: String },
    phone: { type: String },
    occupation: { type: String },
  },
  facultyAdvisor: {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  hostel: {
    name: { type: String },
    roomNumber: { type: String },
    bedNumber: { type: String },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
