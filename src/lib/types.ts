export interface KeywordGapResult {
  jdKeywords: string[];
  foundInCV: string[];
  missingFromCV: string[];
  matchScore: number;
}