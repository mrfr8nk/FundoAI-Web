import jwt from "jsonwebtoken";

const SECRET = process.env["JWT_SECRET"] || "fundo-ai-fallback-secret";

export function signToken(userId: string): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, SECRET) as { userId: string };
}
