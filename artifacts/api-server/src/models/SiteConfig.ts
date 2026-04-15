import mongoose, { Schema, Document } from "mongoose";

export interface ISiteConfig extends Document {
  key: string;
  value: string;
  updatedAt: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>({
  key:       { type: String, required: true, unique: true, trim: true },
  value:     { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

export const SiteConfig = mongoose.models.SiteConfig || mongoose.model<ISiteConfig>("SiteConfig", SiteConfigSchema);

export async function getConfig(key: string, defaultVal = ""): Promise<string> {
  const doc = await SiteConfig.findOne({ key });
  return doc?.value ?? defaultVal;
}

export async function setConfig(key: string, value: string): Promise<void> {
  await SiteConfig.findOneAndUpdate(
    { key },
    { value, updatedAt: new Date() },
    { upsert: true, new: true }
  );
}
