export interface Project {
  title: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string; // Will store high-impact bullet points
}

export interface ResumeModel {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  aboutMe: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
}