import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getExtensionFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
  };

  return map[mimeType] || "";
}

async function parseForm(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  const bucket = formData.get("bucket") as string;

  const uploadDir = path.join(process.cwd(), "public", bucket);

  if (!file || !userId) {
    throw new Error("Missing file or userId");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || getExtensionFromMime(file.type);
  const uniqueName = `${crypto.randomUUID()}-${file.name}${ext}`;
  const userFolder = path.join(uploadDir, userId);
  const filePath = path.join(userFolder, uniqueName);

  fs.mkdirSync(userFolder, { recursive: true });
  fs.writeFileSync(filePath, buffer);

  const publicPath = `/${bucket}/${userId}/${uniqueName}`;
  return { path: publicPath };
}

export async function POST(req: NextRequest) {
  try {
    const { path } = await parseForm(req);
    return NextResponse.json({ path });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 },
    );
  }
}
