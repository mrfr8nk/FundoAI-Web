import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/User";
import { connectDB } from "../lib/mongo";

const ADMIN_EMAIL = "support.fundo.ai@gmail.com";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const token = auth.slice(7);
    const { userId } = verifyToken(token);
    await connectDB();
    const user = await User.findById(userId).select("-password -verifyCode -resetCode -magicToken");
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    if (user.email !== ADMIN_EMAIL && !user.isAdmin) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
