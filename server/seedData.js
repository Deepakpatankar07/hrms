const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("./models/UserModel");
const Candidate = require("./models/CandidateModel");
const Employee = require("./models/EmployeeModel");
const Attendance = require("./models/AttendanceModel");
const bcrypt = require("bcryptjs");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/hrms");
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany();
    await Candidate.deleteMany();
    await Employee.deleteMany();
    await Attendance.deleteMany();
    console.log("Database cleared");
  } catch (err) {
    console.error("Error clearing database:", err);
  }
};

// Create sample users
const seedUsers = async () => {
  const name = "test";
  const email = "test@test.com";
  const password = "test1234";

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role : "hr",
  });

  console.log("Users seeded successfully");
};

// Create sample candidates
const seedCandidates = async () => {
  const candidates = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      position: "Senior Developer",
      status: "Selected",
      experience: 5,
      resume: "john_doe_resume.pdf",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "9876543210",
      position: "Human Resource Lead",
      status: "New",
      experience: 7,
      resume: "jane_smith_resume.pdf",
    },
    {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "5551234567",
      position: "Junior Developer",
      status: "Rejected",
      experience: 1,
      resume: "mike_johnson_resume.pdf",
    },
    {
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "4445556666",
      position: "Designer",
      status: "New",
      experience: 3,
      resume: "sarah_williams_resume.pdf",
    },
    {
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "7778889999",
      position: "Team Lead",
      status: "Selected",
      experience: 8,
      resume: "david_brown_resume.pdf",
    },
  ];

  await Candidate.insertMany(candidates);
  console.log("Candidates seeded successfully");
};

// Create sample employees from selected candidates
const seedEmployees = async () => {
  const selectedCandidates = await Candidate.find({ status: "Selected" });

  for (const candidate of selectedCandidates) {
    const employeeData = {
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      experience: candidate.experience,
      joinedAt: new Date(),
      status: "Active",
    };

    const employee = await Employee.create(employeeData);
    await Attendance.create({ employee: employee._id });

    // Remove the candidate after converting to employee
    await Candidate.findByIdAndDelete(candidate._id);
  }

  console.log("Employees seeded successfully");
};

// Create dummy resume files in uploads folder
const createDummyResumes = () => {
  const uploadsDir = path.join(__dirname, "public", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const candidates = [
    { name: "john_doe_resume.pdf", content: "John Doe Resume Content" },
    { name: "jane_smith_resume.pdf", content: "Jane Smith Resume Content" },
    { name: "mike_johnson_resume.pdf", content: "Mike Johnson Resume Content" },
    {
      name: "sarah_williams_resume.pdf",
      content: "Sarah Williams Resume Content",
    },
    { name: "david_brown_resume.pdf", content: "David Brown Resume Content" },
  ];

  candidates.forEach((candidate) => {
    const filePath = path.join(uploadsDir, candidate.name);
    fs.writeFileSync(filePath, candidate.content);
  });

  console.log("Dummy resume files created");
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();
    await seedUsers();
    await seedCandidates();
    await seedEmployees();
    createDummyResumes();
    console.log("Database seeding completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();
