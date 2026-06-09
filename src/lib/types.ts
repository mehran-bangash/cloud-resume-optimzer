

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