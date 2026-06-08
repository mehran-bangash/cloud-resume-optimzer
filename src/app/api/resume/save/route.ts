import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as any;
const { resumeData } = body;

    // 1. Get user ID
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Upsert resume
    // Ensure "user_id" is the exact column name in your database
    const { error: resumeError } = await supabaseAdmin
      .from("resumes")
      .upsert(
        { 
          user_id: user.id, 
          data: resumeData, 
          updated_at: new Date().toISOString() 
        },
        { onConflict: "user_id" } 
      );

    if (resumeError) {
      console.error("[save] resume upsert error:", resumeError);
      return NextResponse.json({ error: resumeError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ resume: null });

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) return NextResponse.json({ resume: null });

    const { data: resume } = await supabaseAdmin
      .from("resumes")
      .select("data")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({ resume: resume?.data ?? null });
  } catch (e) {
    return NextResponse.json({ resume: null });
  }
}