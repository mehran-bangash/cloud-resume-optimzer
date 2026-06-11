

export interface KeywordGapResult {
  jdKeywords: string[];
  foundInCV: string[];
  missingFromCV: string[];
  matchScore: number;
}

export interface CoverLetterResult {
  subject: string;
  body: string;
  tone: string;
}

export interface KeywordGapResult {
  jdKeywords: string[];
  foundInCV: string[];
  missingFromCV: string[];
  matchScore: number;
}

export interface CoverLetterResult {
  subject: string;
  body: string;
  tone: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected" | "withdrawn";
  job_url?: string;
  notes?: string;
  cv_version_name?: string;
  applied_date: string;
  created_at: string;
  updated_at: string;
}