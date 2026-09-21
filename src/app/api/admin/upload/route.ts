import { NextResponse } from "next/server";
import { getAdminSession, isSameOrigin } from "@/lib/admin/session";
import { ImageUploadError, MAX_UPLOAD_BYTES, saveProductImage } from "@/lib/admin/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST multipart/form-data { file } → { src, width, height }. Admin only. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-site requests are not allowed." }, { status: 403 });
  }
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES + 64 * 1024) {
    return NextResponse.json({ error: "Images must be 6 MB or smaller." }, { status: 413 });
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was sent." }, { status: 400 });
  }

  try {
    const saved = await saveProductImage(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json(saved);
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("upload failed", error);
    return NextResponse.json({ error: "Couldn't save the image." }, { status: 500 });
  }
}
