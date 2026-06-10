import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET — load all versions for current user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ versions: [] });
    }

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) return NextResponse.json({ versions: [] });

    const { data: versions, error } = await supabaseAdmin
      .from("cv_versions")
      .select("id, name, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) return NextResponse.json({ versions: [] });

    return NextResponse.json({ versions: versions ?? [] });
  } catch {
    return NextResponse.json({ versions: [] });
  }
}

// POST — save current CV as a named version
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as any;
    const { name, data } = body;

    if (!name?.trim() || !data) {
      return NextResponse.json({ error: "Missing name or data" }, { status: 400 });
    }

    // Get or create user
    const { data: user } = await supabaseAdmin
      .from("users")
      .upsert(
        { email: session.user.email, name: session.user.name ?? "", image: session.user.image ?? "" },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Max 10 versions per user
    const { count } = await supabaseAdmin
      .from("cv_versions")
      .select("id", { count: "exact" })
      .eq("user_id", user.id);

    if ((count ?? 0) >= 10) {
      return NextResponse.json(
        { error: "Maximum 10 CV versions allowed. Delete one first." },
        { status: 400 }
      );
    }

    const { data: version, error } = await supabaseAdmin
      .from("cv_versions")
      .insert({ user_id: user.id, name: name.trim(), data })
      .select("id, name, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, version });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE — delete a version by id
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as any;
    const { id } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { error } = await supabaseAdmin
      .from("cv_versions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Security: only delete own versions

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH — load a version's full data
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as any;
    const { id } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { data: version, error } = await supabaseAdmin
      .from("cv_versions")
      .select("data")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    return NextResponse.json({ data: version.data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}