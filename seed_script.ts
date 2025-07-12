import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        password: hashedPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
        bio: 'Full-stack developer passionate about teaching and learning new technologies.',
        location: 'San Francisco, CA',
        profileImage: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        password: hashedPassword,
        firstName: 'Bob',
        lastName: 'Smith',
        bio: 'UX designer with 5+ years experience in digital product design.',
        location: 'New York, NY',
        profileImage: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'carol@example.com',
        password: hashedPassword,
        firstName: 'Carol',
        lastName: 'Davis',
        bio: 'Marketing professional specializing in digital marketing and content creation.',
        location: 'Austin, TX',
        profileImage: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'david@example.com',
        password: hashedPassword,
        firstName: 'David',
        lastName: 'Wilson',
        bio: 'Data scientist and machine learning enthusiast.',
        location: 'Seattle, WA',
        profileImage: null,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create sample skills
  const skills = await Promise.all([
    // Alice's skills
    prisma.skill.create({
      data: {
        title: 'React & TypeScript Development',
        description: 'I can teach you modern React development with TypeScript, including hooks, state management, and best practices.',
        category: 'Programming',
        skillLevel: 'ADVANCED',
        skillType: 'OFFER',
        location: 'San Francisco, CA',
        isRemote: true,
        userId: users[0].id,
        tags: {
          create: [
            { name: 'React' },
            { name: 'TypeScript' },
            { name: 'JavaScript' },
            { name: 'Frontend' },
          ],
        },
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Learn Guitar Basics',
        description: 'Looking for someone to teach me acoustic guitar fundamentals and basic chord progressions.',
        category: 'Music',
        skillLevel: 'BEGINNER',
        skillType: 'REQUEST',
        location: 'San Francisco, CA',
        isRemote: false,
        userId: users[0].id,
        tags: {
          create: [
            { name: 'Guitar' },
            { name: 'Music' },
            { name: 'Beginner' },
          ],
        },
      },
    }),
    // Bob's skills
    prisma.skill.create({
      data: {
        title: 'UX/UI Design Fundamentals',
        description: 'I can help you learn user experience design principles, wireframing, and prototyping using Figma.',
        category: 'Design',
        skillLevel: 'INTERMEDIATE',
        skillType: 'OFFER',
        location: 'New York, NY',
        isRemote: true,
        userId: users[1].id,
        tags: {
          create: [
            { name: 'UX' },
            { name: 'UI' },
            { name: 'Figma' },
            { name: 'Design' },
          ],
        },
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Learn Web Development',
        description: 'Want to learn full-stack web development, particularly backend technologies like Node.js and databases.',
        category: 'Programming',
        skillLevel: 'BEGINNER',
        skillType: 'REQUEST',
        location: 'New York, NY',
        isRemote: true,
        userId: users[1].id,
        tags: {
          create: [
            { name: 'Web Development' },
            { name: 'Backend' },
            { name: 'Node.js' },
          ],
        },
      },
    }),
    // Carol's skills
    prisma.skill.create({
      data: {
        title: 'Digital Marketing Strategy',
        description: 'I can teach you digital marketing fundamentals, social media marketing, and content creation strategies.',
        category: 'Marketing',
        skillLevel: 'ADVANCED',
        skillType: 'OFFER',
        location: 'Austin, TX',
        isRemote: true,
        userId: users[2].id,
        tags: {
          create: [
            { name: 'Digital Marketing' },
            { name: 'Social Media' },
            { name: 'Content Creation' },
            { name: 'Strategy' },
          ],
        },
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Photography Basics',
        description: 'Looking to learn photography fundamentals, camera settings, and composition techniques.',
        category: 'Photography',
        skillLevel: 'BEGINNER',
        skillType: 'REQUEST',
        location: 'Austin, TX',
        isRemote: false,
        userId: users[2].id,
        tags: {
          create: [
            { name: 'Photography' },
            { name: 'Camera' },
            { name: 'Composition' },
          ],
        },
      },
    }),
    // David's skills
    prisma.skill.create({
      data: {
        title: 'Data Science & Machine Learning',
        description: 'I can teach you data science fundamentals, Python programming, and machine learning algorithms.',
        category: 'Data Science',
        skillLevel: 'ADVANCED',
        skillType: 'OFFER',
        location: 'Seattle, WA',
        isRemote: true,
        userId: users[3].id,
        tags: {
          create: [
            { name: 'Data Science' },
            { name: 'Machine Learning' },
            { name: 'Python' },
            { name: 'Statistics' },
          ],
        },
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Learn Spanish Language',
        description: 'Want to learn conversational Spanish for travel and business purposes.',
        category: 'Languages',
        skillLevel: 'BEGINNER',
        skillType: 'REQUEST',
        location: 'Seattle, WA',
        isRemote: true,
        userId: users[3].id,
        tags: {
          create: [
            { name: 'Spanish' },
            { name: 'Language' },
            { name: 'Conversation' },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${skills.length} skills`);

  // Create sample swap requests
  const swapRequests = await Promise.all([
    prisma.swapRequest.create({
      data: {
        message: 'Hi! I love your UX design skills. I can help you learn React and TypeScript in exchange for some UX design lessons.',
        status: 'PENDING',
        offeredSkillId: skills[0].id, // Alice's React skill
        requestedSkillId: skills[2].id, // Bob's UX skill
        requesterId: users[0].id, // Alice
      },
    }),
    prisma.swapRequest.create({
      data: {
        message: 'I\'m interested in learning digital marketing. I can teach you data science and Python in return.',
        status: 'ACCEPTED',
        offeredSkillId: skills[6].id, // David's Data Science skill
        requestedSkillId: skills[4].id, // Carol's Digital Marketing skill
        requesterId: users[3].id, // David
      },
    }),
    prisma.swapRequest.create({
      data: {
        message: 'Would love to learn web development! I can help you with marketing strategy in exchange.',
        status: 'PENDING',
        offeredSkillId: skills[4].id, // Carol's Digital Marketing skill
        requestedSkillId: skills[0].id, // Alice's React skill
        requesterId: users[2].id, // Carol
      },
    }),
  ]);

  console.log(`Created ${swapRequests.length} swap requests`);

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });