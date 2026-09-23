import { Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/db";
import { signToken } from "../utils/jwt";
import { ApiError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function toPublicUser(user: { id: string; firstName: string; lastName: string; email: string }) {
  return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
}

export async function signup(req: AuthRequest, res: Response) {
  const data = signupSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
    },
  });
  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({ token, user: toPublicUser(user) });
}

export async function login(req: AuthRequest, res: Response) {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }
  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid email or password");
  }
  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, user: toPublicUser(user) });
}

export async function me(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new ApiError(404, "User not found");
  res.json({ user: toPublicUser(user) });
}
