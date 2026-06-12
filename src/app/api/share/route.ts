import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
  const random = Math.random().toString(36).slice(2, 7);
  return `${base}-${random}`;
}

async function getUserId(email: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();
  return data?.id ?? null;
}

// POST — create or update shared CV link
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as any;
    const { resumeData, template } = body;
    if (!resumeData) {
      return NextResponse.json({ error: "Missing resume data" }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from("users")
      .upsert(
        { email: session.user.email, name: session.user.name ?? "", image: session.user.image ?? "" },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (!user) return NextResponse.json({ error: "User error" }, { status: 500 });

    // Check if user already has a shared CV — update it
    const { data: existing } = await supabaseAdmin
      .from("shared_cvs")
      .select("id, slug")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      await supabaseAdmin
        .from("shared_cvs")
        .update({ resume_data: resumeData, template: template ?? "modern", updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      return NextResponse.json({ success: true, slug: existing.slug });
    }

    // Create new
    const slug = generateSlug(resumeData.fullName ?? "my-resume");
    const { data, error } = await supabaseAdmin
      .from("shared_cvs")
      .insert({ user_id: user.id, slug, resume_data: resumeData, template: template ?? "modern" })
      .select("slug")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, slug: data.slug });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET — get current user's share info
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ shared: null });
    }

    const userId = await getUserId(session.user.email);
    if (!userId) return NextResponse.json({ shared: null });

    const { data } = await supabaseAdmin
      .from("shared_cvs")
      .select("slug, is_active, view_count, updated_at")
      .eq("user_id", userId)
      .single();

    return NextResponse.json({ shared: data ?? null });
  } catch {
    return NextResponse.json({ shared: null });
  }
}

// DELETE — deactivate shared CV
export async function DELETE() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserId(session.user.email);
    if (!userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await supabaseAdmin
      .from("shared_cvs")
      .update({ is_active: false })
      .eq("user_id", userId);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}