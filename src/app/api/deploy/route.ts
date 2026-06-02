import { NextResponse } from "next/server";
import { ResumeModel } from "@/models/resume";

export async function POST(request: Request) {
  try {
    const data: ResumeModel = await request.json();

    // 1. Basic validation
    if (!data.fullName || !data.email) {
      return NextResponse.json(
        { error: "Full Name and Email are required to generate a portfolio." },
        { status: 400 }
      );
    }

    // 2. Insert user data into a high-end, responsive HTML template string
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} | Portfolio</title>
    <!-- Tailwind CSS CDN for global styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: '#2dd4bf', // Teal accent
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased selection:bg-brand selection:text-slate-900">

    <!-- Header Section -->
    <header class="max-w-5xl mx-auto px-6 py-20 text-center md:text-left">
        <span class="text-brand font-mono font-semibold text-sm tracking-widest uppercase block mb-3">Available for opportunities</span>
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">${data.fullName}</h1>
        <p class="text-xl text-brand font-medium mb-6">${data.title}</p>
        <p class="max-w-2xl text-slate-400 text-lg leading-relaxed mb-8">${data.aboutMe}</p>
        
        <div class="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="mailto:${data.email}" class="bg-brand text-slate-950 font-bold px-6 py-3 rounded-lg hover:bg-teal-300 transition duration-300 shadow-lg shadow-teal-500/10">
                Contact Me
            </a>
            ${data.location ? `
            <div class="inline-flex items-center text-slate-400 text-sm px-4 py-3 bg-slate-900/60 rounded-lg border border-slate-800">
                📍 ${data.location}
            </div>
            ` : ''}
        </div>
    </header>

    <!-- Main Content Grid -->
    <main class="max-w-5xl mx-auto px-6 pb-32 space-y-20">

        <!-- Projects Section -->
        ${data.projects && data.projects.length > 0 ? `
        <section class="space-y-8">
            <div class="border-b border-slate-800 pb-4">
                <h2 class="text-2xl font-bold text-white tracking-wide">Featured Projects</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${data.projects.map(proj => `
                <div class="p-6 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-brand/40 transition duration-300 flex flex-col justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-slate-100 mb-2">${proj.title || 'Untitled Project'}</h3>
                        <p class="text-slate-400 text-sm leading-relaxed mb-4">${proj.description || 'Details coming soon...'}</p>
                    </div>
                    ${proj.technologies && proj.technologies.length > 0 ? `
                    <div class="flex flex-wrap gap-2 pt-2">
                        ${proj.technologies.map(tech => `
                        <span class="text-[10px] uppercase font-mono tracking-wider font-semibold bg-brand/10 text-brand px-2 py-1 rounded">
                            ${tech}
                        </span>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

    </main>

    <!-- Simple Visitor Script for Real-Time Analytics -->
    <script>
        console.log("Visitor Analytics script ready for AWS DynamoDB integration!");
    </script>
</body>
</html>
    `;

    // 3. Return the compiled template to the client
    return NextResponse.json({ 
      success: true, 
      html: htmlTemplate 
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while compiling your portfolio." },
      { status: 500 }
    );
  }
}