import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/env.js";

export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { id: user.id, name: user.name, email: user.email };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  return jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, {
    expiresIn: "1d",
  });
}
