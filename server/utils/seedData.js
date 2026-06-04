const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@demo.com",
      password: "password123",
      role: "Admin",
    });

    // Create ProjectManagers
    const pm1 = await User.create({
      name: "John Manager",
      email: "john@demo.com",
      password: "password123",
      role: "ProjectManager",
    });

    const pm2 = await User.create({
      name: "Sarah Manager",
      email: "sarah@demo.com",
      password: "password123",
      role: "ProjectManager",
    });

    // Create TeamMembers
    const member1 = await User.create({
      name: "Alice Developer",
      email: "alice@demo.com",
      password: "password123",
      role: "TeamMember",
    });

    const member2 = await User.create({
      name: "Bob Designer",
      email: "bob@demo.com",
      password: "password123",
      role: "TeamMember",
    });

    const member3 = await User.create({
      name: "Carol Tester",
      email: "carol@demo.com",
      password: "password123",
      role: "TeamMember",
    });

    console.log("✓ Users created (1 Admin, 2 PMs, 3 Members)");

    // Create Projects
    const project1 = await Project.create({
      name: "Website Redesign",
      description: "Complete redesign of company website",
      status: "Active",
      deadline: new Date("2024-03-31"),
      createdBy: pm1._id,
      members: [pm1._id, member1._id, member2._id],
    });

    const project2 = await Project.create({
      name: "Mobile App",
      description: "Build iOS and Android application",
      status: "Active",
      deadline: new Date("2024-04-30"),
      createdBy: pm2._id,
      members: [pm2._id, member1._id, member3._id],
    });

    const project3 = await Project.create({
      name: "API Development",
      description: "Create robust REST APIs",
      status: "Active",
      deadline: new Date("2024-02-28"),
      createdBy: pm1._id,
      members: [pm1._id, member2._id],
    });

    console.log("✓ Projects created");

    // Create Tasks for Project 1
    const task1 = await Task.create({
      title: "Design Homepage",
      description: "Create homepage mockups and designs",
      projectId: project1._id,
      assignedTo: member2._id,
      priority: "High",
      status: "InProgress",
      dueDate: new Date("2024-02-15"),
    });

    const task2 = await Task.create({
      title: "Setup Database",
      description: "Configure MongoDB and Redis",
      projectId: project1._id,
      assignedTo: member1._id,
      priority: "High",
      status: "Todo",
      dueDate: new Date("2024-02-10"),
    });

    const task3 = await Task.create({
      title: "Create Contact Form",
      description: "Build contact form with validation",
      projectId: project1._id,
      assignedTo: member1._id,
      priority: "Medium",
      status: "Todo",
      dueDate: new Date("2024-02-20"),
    });

    // Create Tasks for Project 2
    const task4 = await Task.create({
      title: "App Architecture",
      description: "Design app structure and components",
      projectId: project2._id,
      assignedTo: member1._id,
      priority: "High",
      status: "InProgress",
      dueDate: new Date("2024-02-25"),
    });

    const task5 = await Task.create({
      title: "User Authentication",
      description: "Implement login and signup",
      projectId: project2._id,
      assignedTo: member3._id,
      priority: "High",
      status: "Todo",
      dueDate: new Date("2024-03-05"),
    });

    // Create Tasks for Project 3
    const task6 = await Task.create({
      title: "Users Endpoint",
      description: "Create GET/POST/PUT/DELETE for users",
      projectId: project3._id,
      assignedTo: member2._id,
      priority: "High",
      status: "Completed",
      dueDate: new Date("2024-02-05"),
    });

    const task7 = await Task.create({
      title: "Projects Endpoint",
      description: "Create GET/POST/PUT/DELETE for projects",
      projectId: project3._id,
      assignedTo: member2._id,
      priority: "High",
      status: "InProgress",
      dueDate: new Date("2024-02-12"),
    });

    console.log("✓ Tasks created");

    // Create Activity Logs
    await ActivityLog.create({
      action: "created",
      description: `Project "Website Redesign" created`,
      userId: pm1._id,
      projectId: project1._id,
    });

    await ActivityLog.create({
      action: "created",
      description: `Task "Design Homepage" created`,
      userId: pm1._id,
      projectId: project1._id,
      taskId: task1._id,
    });

    await ActivityLog.create({
      action: "assigned",
      description: `Task "Design Homepage" assigned to Bob Designer`,
      userId: pm1._id,
      projectId: project1._id,
      taskId: task1._id,
    });

    console.log("✓ Activity logs created");

    console.log("\n" + "=".repeat(60));
    console.log("✅ DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(60));

    console.log("\n📋 DEMO CREDENTIALS:\n");
    console.log("Admin Account:");
    console.log("  Email: admin@demo.com");
    console.log("  Password: password123\n");

    console.log("Project Manager Accounts:");
    console.log("  Email: john@demo.com");
    console.log("  Password: password123");
    console.log("  Email: sarah@demo.com");
    console.log("  Password: password123\n");

    console.log("Team Member Accounts:");
    console.log("  Email: alice@demo.com (Password: password123)");
    console.log("  Email: bob@demo.com (Password: password123)");
    console.log("  Email: carol@demo.com (Password: password123)\n");

    console.log("=".repeat(60));

    await mongoose.connection.close();
    console.log("\n✓ MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
