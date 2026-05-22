import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

dotenv.config();

const avatar = (name) => `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;

const runSeed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Project.deleteMany(), Task.deleteMany()]);

  const users = await User.create([
    {
      name: 'Aarav Sharma',
      email: 'admin@example.com',
      password: 'password123',
      role: 'ADMIN',
      avatar: avatar('Aarav Sharma')
    },
    {
      name: 'Maya Patel',
      email: 'maya@example.com',
      password: 'password123',
      role: 'MEMBER',
      avatar: avatar('Maya Patel')
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan@example.com',
      password: 'password123',
      role: 'MEMBER',
      avatar: avatar('Rohan Mehta')
    },
    {
      name: 'Isha Rao',
      email: 'isha@example.com',
      password: 'password123',
      role: 'MEMBER',
      avatar: avatar('Isha Rao')
    }
  ]);

  const [admin, maya, rohan, isha] = users;

  const projects = await Project.create([
    {
      title: 'Customer Portal Launch',
      description: 'Ship the new client-facing portal with auth, billing, and onboarding flows.',
      createdBy: admin._id,
      members: [admin._id, maya._id, rohan._id],
      status: 'ACTIVE'
    },
    {
      title: 'Mobile Sprint Board',
      description: 'Coordinate design and engineering tasks for the next mobile release.',
      createdBy: admin._id,
      members: [admin._id, maya._id, isha._id],
      status: 'PLANNING'
    }
  ]);

  const [portal, mobile] = projects;
  const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await Task.create([
    {
      title: 'Build login and signup screens',
      description: 'Create responsive auth screens and connect them to the API.',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: daysFromNow(-1),
      assignedTo: maya._id,
      project: portal._id,
      createdBy: admin._id
    },
    {
      title: 'Implement billing overview',
      description: 'Add subscription summary cards and invoice history.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: daysFromNow(3),
      assignedTo: rohan._id,
      project: portal._id,
      createdBy: admin._id
    },
    {
      title: 'QA onboarding checklist',
      description: 'Verify onboarding states for new and returning customers.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: daysFromNow(5),
      assignedTo: maya._id,
      project: portal._id,
      createdBy: admin._id
    },
    {
      title: 'Design sprint board empty states',
      description: 'Prepare empty, loading, and error states for the mobile sprint board.',
      status: 'TODO',
      priority: 'LOW',
      dueDate: daysFromNow(7),
      assignedTo: isha._id,
      project: mobile._id,
      createdBy: admin._id
    }
  ]);

  console.log('Seed completed');
  console.table([
    { role: 'ADMIN', email: 'admin@example.com', password: 'password123' },
    { role: 'MEMBER', email: 'maya@example.com', password: 'password123' }
  ]);

  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
