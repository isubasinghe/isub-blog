
export interface BibFileRef {
  type: "fileref";
  file: string;
} 

export interface BibEmbedded {
  type: "embedded";
  refs: string[];
}

export type Bibliography = BibFileRef | BibEmbedded;

export interface Paper {
  name: string;
  description: string;
  affiliations: string[];
  supervisor?: string;
  pdfurl: string;
  bibliography: null;
  grade?: number;
  reason?: string;
  meta: any;
}


