import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Validation schemas
const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  bio: z.string().optional(),
  location: z.string().optional()
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const skillSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  skillType: z.enum(['OFFER', 'REQUEST']),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  isRemote: z.boolean().default(false)
});

const swapRequestSchema = z.object({
  offeredSkillId: z.string(),
  requestedSkillId: z.string(),
  message: z.string().min(1)
});

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const validatedData = userRegistrationSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        bio: validatedData.bio,
        location: validatedData.location
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const validatedData = userLoginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        location: user.location,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users/profile', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        profileImage: true,
        createdAt: true,
        skills: {
          include: {
            tags: true,
            _count: {
              select: { swapRequests: true }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req: any, res) => {
  try {
    const { firstName, lastName, bio, location } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName,
        lastName,
        bio,
        location
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        profileImage: true,
        createdAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users/upload-avatar', authenticateToken, upload.single('avatar'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { profileImage: imageUrl },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true
      }
    });

    res.json({ message: 'Avatar uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Skill routes
app.get('/api/skills', async (req, res) => {
  try {
    const { category, skillLevel, skillType, search, page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    
    if (category) where.category = category;
    if (skillLevel) where.skillLevel = skillLevel;
    if (skillType) where.skillType = skillType;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const skills = await prisma.skill.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            location: true
          }
        },
        tags: true,
        _count: {
          select: { swapRequests: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const totalCount = await prisma.skill.count({ where });

    res.json({
      skills,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/skills', authenticateToken, async (req: any, res) => {
  try {
    const validatedData = skillSchema.parse(req.body);

    const skill = await prisma.skill.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        skillLevel: validatedData.skillLevel,
        skillType: validatedData.skillType,
        location: validatedData.location,
        isRemote: validatedData.isRemote,
        userId: req.user.userId,
        tags: {
          create: validatedData.tags?.map(tag => ({ name: tag })) || []
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            location: true
          }
        },
        tags: true
      }
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/skills/:id', async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            location: true,
            bio: true
          }
        },
        tags: true,
        _count: {
          select: { swapRequests: true }
        }
      }
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Swap request routes
app.post('/api/swap-requests', authenticateToken, async (req: any, res) => {
  try {
    const validatedData = swapRequestSchema.parse(req.body);

    // Check if skills exist and are valid for swapping
    const offeredSkill = await prisma.skill.findFirst({
      where: {
        id: validatedData.offeredSkillId,
        userId: req.user.userId,
        skillType: 'OFFER'
      }
    });

    const requestedSkill = await prisma.skill.findFirst({
      where: {
        id: validatedData.requestedSkillId,
        skillType: 'REQUEST'
      }
    });

    if (!offeredSkill || !requestedSkill) {
      return res.status(400).json({ error: 'Invalid skill selection for swap' });
    }

    // Check if swap request already exists
    const existingRequest = await prisma.swapRequest.findFirst({
      where: {
        offeredSkillId: validatedData.offeredSkillId,
        requestedSkillId: validatedData.requestedSkillId,
        requesterId: req.user.userId
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Swap request already exists' });
    }

    const swapRequest = await prisma.swapRequest.create({
      data: {
        offeredSkillId: validatedData.offeredSkillId,
        requestedSkillId: validatedData.requestedSkillId,
        requesterId: req.user.userId,
        message: validatedData.message
      },
      include: {
        offeredSkill: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        },
        requestedSkill: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        },
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    res.status(201).json(swapRequest);
  } catch (error) {
    console.error('Create swap request error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/swap-requests', authenticateToken, async (req: any, res) => {
  try {
    const { type = 'all' } = req.query;

    let where: any = {};

    if (type === 'sent') {
      where.requesterId = req.user.userId;
    } else if (type === 'received') {
      where.requestedSkill = {
        userId: req.user.userId
      };
    } else {
      where.OR = [
        { requesterId: req.user.userId },
        { requestedSkill: { userId: req.user.userId } }
      ];
    }

    const swapRequests = await prisma.swapRequest.findMany({
      where,
      include: {
        offeredSkill: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        },
        requestedSkill: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        },
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(swapRequests);
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/swap-requests/:id/status', authenticateToken, async (req: any, res) => {
  try {
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: req.params.id },
      include: {
        requestedSkill: {
          select: { userId: true }
        }
      }
    });

    if (!swapRequest) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    // Only the owner of the requested skill can update the status
    if (swapRequest.requestedSkill.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this swap request' });
    }

    const updatedSwapRequest = await prisma.swapRequest.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        offeredSkill: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        },
        requestedSkill: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          }
        },
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });

    res.json(updatedSwapRequest);
  } catch (error) {
    console.error('Update swap request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Static file serving
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    prisma.$disconnect();
    process.exit(0);
  });
});

export default app;