const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const Dispute = require('./models/Dispute');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/trustbound');
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Project.deleteMany({});
  await Dispute.deleteMany({});
  console.log('Cleared existing data');

  const hash = await bcrypt.hash('password123', 10);

  // Create users
  const client1 = await User.create({ name: 'Arjun Mehta', email: 'client@demo.com', password: hash, role: 'client', walletBalance: 50000 });
  const client2 = await User.create({ name: 'Priya Sharma', email: 'priya@demo.com', password: hash, role: 'client', walletBalance: 35000 });
  const freelancer1 = await User.create({ name: 'Rahul Verma', email: 'freelancer@demo.com', password: hash, role: 'freelancer', walletBalance: 8000 });
  const freelancer2 = await User.create({ name: 'Sneha Kulkarni', email: 'sneha@demo.com', password: hash, role: 'freelancer', walletBalance: 15000 });
  console.log('Created users');

  // Project 1: Active with 1 milestone released
  const totalP1 = 18000;
  client1.walletBalance -= totalP1;
  client1.escrowBalance += 12000; // 6000 already released
  await client1.save();
  freelancer1.walletBalance += 6000;
  await freelancer1.save();

  const p1 = await Project.create({
    title: 'Brand Identity & Logo Design',
    description: 'Complete brand identity package for a fintech startup including logo, color palette, typography guide, and brand guidelines document.',
    client: client1._id,
    freelancer: freelancer1._id,
    totalBudget: totalP1,
    escrowAmount: 12000,
    category: 'Design',
    status: 'active',
    contractSigned: true,
    contractSignedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    milestones: [
      { title: 'Logo Concepts (3 options)', description: 'Initial logo concepts with color variations', amount: 6000, status: 'released', submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), submissionNote: 'Attached 3 logo concepts with 2 color variations each.' },
      { title: 'Final Logo + Brand Colors', description: 'Refined final logo and complete color palette', amount: 6000, status: 'submitted', submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), submissionNote: 'Final logo in SVG and PNG. Added primary, secondary, and neutral color palette.' },
      { title: 'Brand Guidelines PDF', description: 'Complete usage guidelines document', amount: 6000, status: 'pending' }
    ]
  });

  // Project 2: Open for freelancers to grab
  const totalP2 = 25000;
  client1.walletBalance -= totalP2;
  client1.escrowBalance += totalP2;
  await client1.save();

  await Project.create({
    title: 'E-commerce Website Development',
    description: 'Build a full-stack e-commerce website with product listings, cart functionality, checkout with Razorpay integration, and admin dashboard. React frontend + Node backend.',
    client: client1._id,
    totalBudget: totalP2,
    escrowAmount: totalP2,
    category: 'Development',
    status: 'open',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    milestones: [
      { title: 'UI Designs + Frontend Setup', description: 'Figma designs and React project setup with routing', amount: 6000, status: 'pending' },
      { title: 'Product & Cart Functionality', description: 'Product listing, detail pages, and cart system', amount: 8000, status: 'pending' },
      { title: 'Payment Integration', description: 'Razorpay checkout and order management', amount: 6000, status: 'pending' },
      { title: 'Admin Dashboard + Deployment', description: 'Admin panel and final deployment', amount: 5000, status: 'pending' }
    ]
  });

  // Project 3: Disputed
  const totalP3 = 12000;
  client2.walletBalance -= totalP3;
  client2.escrowBalance += 8000;
  await client2.save();
  freelancer2.walletBalance += 4000;
  await freelancer2.save();

  const p3 = await Project.create({
    title: 'Social Media Content Pack',
    description: '30-day social media content calendar with 30 designed posts, captions, and hashtag strategies for Instagram and LinkedIn.',
    client: client2._id,
    freelancer: freelancer2._id,
    totalBudget: totalP3,
    escrowAmount: 8000,
    category: 'Marketing',
    status: 'disputed',
    contractSigned: true,
    contractSignedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    milestones: [
      { title: 'Content Strategy & Calendar', amount: 4000, status: 'released', approvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { title: '15 Instagram Posts', amount: 4000, status: 'disputed', submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), submissionNote: 'Attached 15 posts in Canva format with captions.' },
      { title: '15 LinkedIn Posts + Report', amount: 4000, status: 'pending' }
    ]
  });

  // Dispute for p3
  await Dispute.create({
    project: p3._id,
    milestoneId: p3.milestones[1]._id,
    raisedBy: client2._id,
    reason: 'The submitted posts do not match the agreed style guide. Images are low quality and captions are generic.',
    messages: [
      { sender: client2._id, senderName: 'Priya Sharma', message: 'The quality of posts is not matching what was agreed. The images look generic and captions are too short.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { sender: freelancer2._id, senderName: 'Sneha Kulkarni', message: 'I followed the brief as provided. The style guide mentioned minimalist design. Can you point to specific posts you are unhappy with?', timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000) },
      { sender: client2._id, senderName: 'Priya Sharma', message: 'Posts 3, 7, and 12 specifically. The colors are off-brand and the text hierarchy is wrong.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ]
  });

  // Project 4: Completed
  const totalP4 = 8000;
  freelancer1.walletBalance += totalP4;
  await freelancer1.save();

  await Project.create({
    title: 'Resume & Portfolio Website',
    description: 'Personal portfolio website with animated hero section, project showcase, and contact form. Deployed on Vercel.',
    client: client2._id,
    freelancer: freelancer1._id,
    totalBudget: totalP4,
    escrowAmount: 0,
    category: 'Development',
    status: 'completed',
    contractSigned: true,
    contractSignedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    milestones: [
      { title: 'Design Mockups', amount: 2000, status: 'released', approvedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
      { title: 'Development & Animations', amount: 4000, status: 'released', approvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { title: 'Deployment & Handover', amount: 2000, status: 'released', approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
    ]
  });

  // Project 5: Open
  const totalP5 = 15000;
  client2.walletBalance -= totalP5;
  client2.escrowBalance += totalP5;
  await client2.save();

  await Project.create({
    title: 'Mobile App UI/UX Design',
    description: 'UI/UX design for a fitness tracking mobile app. Includes user flows, wireframes, high-fidelity screens in Figma, and prototype for investor demo.',
    client: client2._id,
    totalBudget: totalP5,
    escrowAmount: totalP5,
    category: 'Design',
    status: 'open',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    milestones: [
      { title: 'User Flows & Wireframes', amount: 4000, status: 'pending' },
      { title: 'High-Fidelity Screens', amount: 7000, status: 'pending' },
      { title: 'Interactive Prototype', amount: 4000, status: 'pending' }
    ]
  });

  console.log('\n✅ Seed complete!\n');
  console.log('Demo Accounts:');
  console.log('  Client:     client@demo.com     / password123');
  console.log('  Client 2:   priya@demo.com      / password123');
  console.log('  Freelancer: freelancer@demo.com / password123');
  console.log('  Freelancer 2: sneha@demo.com    / password123');
  console.log('\nProjects created: 5 (1 active, 2 open, 1 disputed, 1 completed)');

  await mongoose.disconnect();
}

seed().catch(console.error);
