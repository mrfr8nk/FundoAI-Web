import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  magicToken: string | null;
  magicTokenExpires: Date | null;
  pendingName: string | null;
  verifyCode: string | null;
  verifyExpires: Date | null;
  resetCode: string | null;
  resetExpires: Date | null;
  level: string;
  chatHistory: Array<{ role: string; content: string; ts: number }>;
  createdAt: Date;
  plan: string;
  planExpires: Date | null;
  paynowPollUrl: string | null;
  paynowRef: string | null;
  chatsToday: number;
  imagestoday: number;
  pdfsToday: number;
  downloadsToday: number;
  usageResetDate: string;
}

const UserSchema = new Schema<IUser>({
  name:               { type: String, required: true, trim: true },
  email:              { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:           { type: String, default: "" },
  isVerified:         { type: Boolean, default: false },
  magicToken:         { type: String, default: null },
  magicTokenExpires:  { type: Date, default: null },
  pendingName:        { type: String, default: null },
  verifyCode:         { type: String, default: null },
  verifyExpires:      { type: Date, default: null },
  resetCode:          { type: String, default: null },
  resetExpires:       { type: Date, default: null },
  level:              { type: String, default: "" },
  chatHistory:        { type: [{ role: String, content: String, ts: Number }], default: [] },
  createdAt:          { type: Date, default: Date.now },
  plan:               { type: String, default: "free", enum: ["free", "starter", "basic", "pro", "premium"] },
  planExpires:        { type: Date, default: null },
  paynowPollUrl:      { type: String, default: null },
  paynowRef:          { type: String, default: null },
  chatsToday:         { type: Number, default: 0 },
  imagestoday:        { type: Number, default: 0 },
  pdfsToday:          { type: Number, default: 0 },
  downloadsToday:     { type: Number, default: 0 },
  usageResetDate:     { type: String, default: "" },
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
