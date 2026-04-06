import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { User } from "../models/User";
import { connectDB } from "../lib/mongo";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const token = auth.slice(7);
    const { userId } = verifyToken(token);
    await connectDB();
    const user = await User.findById(userId).select("-password -verifyCode -resetCode");
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
