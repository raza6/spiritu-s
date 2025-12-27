import { AnalysisComponent } from "./analyzis";

export type SentenceVM = {
  german: string;
  english: string;
  audio: string;
}

export type AnalyzisVM = {
  structure: string;
  wordOrder: string;
  caseUsage: string;
  explanation: string;
  tree: AnalysisComponent[],
  references: { type: string, ref: string }[];
}

export type FullVM = {
  sentence: SentenceVM;
  analyzis: AnalyzisVM;
}