export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface ResumeModel {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  title: string;      // e.g. "Full-Stack Engineer"
  aboutMe: string;
  skills: string[];   // e.g. ["Next.js", "AWS", "TypeScript"]
  projects: Project[];
  experience: Experience[];
}
