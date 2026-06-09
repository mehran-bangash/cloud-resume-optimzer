import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // This is the missing logic: it saves the user to Supabase on login
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        const { error } = await supabaseAdmin
          .from("users")
          .upsert(
            { 
              email: user.email, 
              name: user.name ?? "", 
              image: user.image ?? "" 
            },
            { onConflict: "email" }
          );
        if (error) {
          console.error("Supabase upsert error:", error.message);
          return false;
        }
        return true;
      } catch (e) {
        console.error("Sign in error:", e);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
});

export { handler as GET, handler as POST };