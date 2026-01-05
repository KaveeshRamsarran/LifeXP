import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { generateToken, setAuthCookie } from '../utils/auth';
import { RegisterSchema, LoginSchema } from '@life-xp/shared';

export const register = async (req: Request, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        timezone: data.timezone,
      },
    });

    const token = generateToken(user.id);
    setAuthCookie(res, token);

    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = LoginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    setAuthCookie(res, token);

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Login failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

export const getMe = async (req: any, res: Response) => {
  res.json({ user: req.user });
};
