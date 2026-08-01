import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Hackathon from '../models/Hackathon.js';
import Team from '../models/Team.js';
import Submission from '../models/Submission.js';
import Review from '../models/Review.js';
import ActivityLog from '../models/ActivityLog.js';
import { connectDB } from '../config/db.js';

export const seedDatabase = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('[Seed] Skipping Mongoose seed since DB connection is offline.');
      return;
    }

    console.log('[Seed] Cleaning existing collections...');
    await User.deleteMany({});
    await Hackathon.deleteMany({});
    await Team.deleteMany({});
    await Submission.deleteMany({});
    await Review.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Elena Rostova (Platform Admin)',
      email: 'admin@hacksphere.io',
      password: hashedPassword,
      role: 'Administrator',
      organization: 'HackSphere Global HQ',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Head of Developer Ecosystem & Platform Operations at HackSphere.',
    });

    const organizer = await User.create({
      name: 'Marcus Vance',
      email: 'organizer@hacksphere.io',
      password: hashedPassword,
      role: 'Organizer',
      organization: 'Innovate AI Guild',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      bio: 'Tech Conference Speaker & Hackathon Community Host.',
    });

    const judge1 = await User.create({
      name: 'Dr. Sophia Chen',
      email: 'judge@hacksphere.io',
      password: hashedPassword,
      role: 'Judge',
      organization: 'Stanford AI Lab / Venture Capital',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      bio: 'AI Researcher & Angel Investor in Emerging Tech.',
    });

    const judge2 = await User.create({
      name: 'Alex Rivera',
      email: 'alex.judge@hacksphere.io',
      password: hashedPassword,
      role: 'Judge',
      organization: 'Cloud Scale Inc.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      bio: 'Principal Systems Architect & Open Source Maintainer.',
    });

    const participant1 = await User.create({
      name: 'Sarah Jenkins (Team Captain)',
      email: 'participant@hacksphere.io',
      password: hashedPassword,
      role: 'Participant',
      organization: 'MIT Computer Science',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      bio: 'Full Stack Engineer & Machine Learning Enthusiast.',
    });

    const participant2 = await User.create({
      name: 'David Kim',
      email: 'david.part@hacksphere.io',
      password: hashedPassword,
      role: 'Participant',
      organization: 'Berkeley EECS',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      bio: 'Frontend Architect & UI/UX Designer.',
    });

    const participant3 = await User.create({
      name: 'Aisha Patel',
      email: 'aisha.part@hacksphere.io',
      password: hashedPassword,
      role: 'Participant',
      organization: 'Imperial College London',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Backend & Cloud Infrastructure Engineer.',
    });

    console.log('[Seed] Creating flagship hackathons...');

    const hackathon1 = await Hackathon.create({
      title: 'AI World Hackathon 2026',
      description: 'Build futuristic autonomous agents, multimodal LLM applications, and ethical AI tools to solve grand global challenges.',
      theme: 'Artificial Intelligence & Generative Models',
      mode: 'Online',
      venue: 'HackSphere Cloud Portal & Discord Server',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      prizePool: '$25,000 in Cash & Cloud Credits',
      maxTeamSize: 4,
      rules: '1. All code must be written during the hackathon window.\n2. Projects must include a public GitHub repository and live demo.\n3. Respect intellectual property rights and maintain open source spirit.',
      organizerId: organizer._id,
      judges: [judge1._id, judge2._id],
      status: 'Ongoing',
      criteria: [
        { name: 'Innovation & Novelty', maxMarks: 10, weight: 1 },
        { name: 'Technical Complexity', maxMarks: 10, weight: 1 },
        { name: 'UI / UX Design', maxMarks: 10, weight: 1 },
        { name: 'Functionality', maxMarks: 10, weight: 1 },
        { name: 'Scalability', maxMarks: 10, weight: 1 },
        { name: 'Presentation & Demo', maxMarks: 10, weight: 1 },
      ],
    });

    const hackathon2 = await Hackathon.create({
      title: 'DevStorm Web3 & Cloud Summit',
      description: 'High-octane hackathon focused on decentralized storage, high-throughput backend APIs, and micro-frontend architectures.',
      theme: 'Cloud Infrastructure & Distributed Systems',
      mode: 'Hybrid',
      venue: 'San Francisco Tech Hub & Global Remote',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      prizePool: '$15,000 Cash + Incubator Fast Track',
      maxTeamSize: 3,
      rules: 'Open to all developers worldwide. Submissions require containerized deployment (Docker/K8s).',
      organizerId: organizer._id,
      judges: [judge1._id],
      status: 'Registration Open',
      criteria: [
        { name: 'Architecture & Security', maxMarks: 10, weight: 1 },
        { name: 'Code Quality & Performance', maxMarks: 10, weight: 1 },
        { name: 'Real-world Viability', maxMarks: 10, weight: 1 },
      ],
    });

    console.log('[Seed] Creating demo teams & submissions...');

    const team1 = await Team.create({
      name: 'CyberPulse Neural',
      code: 'HS-CYBER1',
      hackathonId: hackathon1._id,
      leaderId: participant1._id,
      members: [
        { userId: participant1._id, role: 'Leader' },
        { userId: participant2._id, role: 'Member' },
      ],
      status: 'Approved',
    });

    const team2 = await Team.create({
      name: 'Aether Nexus',
      code: 'HS-AETHER2',
      hackathonId: hackathon1._id,
      leaderId: participant3._id,
      members: [
        { userId: participant3._id, role: 'Leader' },
      ],
      status: 'Approved',
    });

    const submission1 = await Submission.create({
      teamId: team1._id,
      hackathonId: hackathon1._id,
      projectName: 'NeuroFlow: AI Automated Diagnostics Agent',
      problemStatement: 'Early medical diagnosis in rural health clinics suffers from specialized radiologist shortages and delayed lab results.',
      solution: 'NeuroFlow uses real-time edge vision transformers and LLM reasoning agents to process patient scans and output clinical decision reports in under 30 seconds.',
      description: 'Built with React, Python FastAPI, PyTorch, and MongoDB. Features an intuitive dashboard for clinical teams, automated audit logs, and automated triage scoring.',
      githubUrl: 'https://github.com/hacksphere-demo/neuroflow-ai',
      liveDemoUrl: 'https://neuroflow-demo.hacksphere.dev',
      videoUrl: 'https://youtube.com/watch?v=demo-neuroflow',
      techStack: ['React', 'Node.js', 'PyTorch', 'MongoDB', 'Tailwind CSS', 'FastAPI'],
      screenshots: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'],
      status: 'Under Review',
      totalScore: 56,
      evaluationsCount: 1,
    });

    const submission2 = await Submission.create({
      teamId: team2._id,
      hackathonId: hackathon1._id,
      projectName: 'GreenGrid: Decentralized Carbon Tracking Platform',
      problemStatement: 'Corporate carbon credit accounting is fragmented, prone to greenwashing, and lacks verifiable supply chain proof.',
      solution: 'GreenGrid aggregates IoT smart meter energy telemetry and calculates granular Scope 1-3 carbon footprints with cryptographic verification.',
      description: 'Empowers environmental auditors with real-time anomaly detection and downloadable compliance reports.',
      githubUrl: 'https://github.com/hacksphere-demo/greengrid-sustainability',
      liveDemoUrl: 'https://greengrid.hacksphere.dev',
      videoUrl: 'https://youtube.com/watch?v=demo-greengrid',
      techStack: ['React', 'Express.js', 'MongoDB', 'Chart.js', 'Docker'],
      screenshots: ['https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80'],
      status: 'Under Review',
      totalScore: 52,
      evaluationsCount: 1,
    });

    console.log('[Seed] Creating judge reviews...');

    await Review.create({
      submissionId: submission1._id,
      hackathonId: hackathon1._id,
      judgeId: judge1._id,
      scores: [
        { criterionName: 'Innovation & Novelty', marks: 10, maxMarks: 10 },
        { criterionName: 'Technical Complexity', marks: 9, maxMarks: 10 },
        { criterionName: 'UI / UX Design', marks: 9, maxMarks: 10 },
        { criterionName: 'Functionality', marks: 10, maxMarks: 10 },
        { criterionName: 'Scalability', marks: 9, maxMarks: 10 },
        { criterionName: 'Presentation & Demo', marks: 9, maxMarks: 10 },
      ],
      comments: 'Outstanding project! The diagnostic latency reduction is exceptional and the UI is production-ready.',
      totalScore: 56,
    });

    await Review.create({
      submissionId: submission2._id,
      hackathonId: hackathon1._id,
      judgeId: judge1._id,
      scores: [
        { criterionName: 'Innovation & Novelty', marks: 9, maxMarks: 10 },
        { criterionName: 'Technical Complexity', marks: 8, maxMarks: 10 },
        { criterionName: 'UI / UX Design', marks: 9, maxMarks: 10 },
        { criterionName: 'Functionality', marks: 9, maxMarks: 10 },
        { criterionName: 'Scalability', marks: 9, maxMarks: 10 },
        { criterionName: 'Presentation & Demo', marks: 8, maxMarks: 10 },
      ],
      comments: 'Very strong execution and real-world applicability for ESG auditing teams.',
      totalScore: 52,
    });

    await ActivityLog.create({
      userName: admin.name,
      userRole: admin.role,
      action: 'SYSTEM_SEED_INITIALIZED',
      details: 'HackSphere platform initial seed data deployed successfully.',
    });

    console.log('[Seed] Database successfully seeded!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

if (process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => process.exit(0));
}
