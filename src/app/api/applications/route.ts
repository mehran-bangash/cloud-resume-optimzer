import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function getUserId(email: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();
  return data?.id ?? null;
}

// GET — load all applications
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ applications: [] });
    }
    const userId = await getUserId(session.user.email);
    if (!userId) return NextResponse.json({ applications: [] });

    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ applications: [] });
    return NextResponse.json({ applications: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ applications: [] });
  }
}

// POST — add new application
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as any;
    const { company, role, status, job_url, notes, cv_version_name, applied_date } = body;

    if (!company?.trim() || !role?.trim()) {
      return NextResponse.json({ error: "Company and role are required" }, { status: 400 });
    }

    // Upsert user
    const { data: user } = await supabaseAdmin
      .from("users")
      .upsert(
        { email: session.user.email, name: session.user.name ?? "", image: session.user.image ?? "" },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (!user) return NextResponse.json({ error: "User error" }, { status: 500 });

    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .insert({
        user_id: user.id,
        company: company.trim(),
        role: role.trim(),
        status: status ?? "applied",
        job_url: job_url?.trim() ?? null,
        notes: notes?.trim() ?? null,
        cv_version_name: cv_version_name?.trim() ?? null,
        applied_date: applied_date ?? new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, application: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH — update status or notes
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as any;
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const userId = await getUserId(session.user.email);
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { error } = await supabaseAdmin
      .from("job_applications")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE — remove application
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as any;
    const { id } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const userId = await getUserId(session.user.email);
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { error } = await supabaseAdmin
      .from("job_applications")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}