export interface Vulnerability {
  id: number;
  title: string;
  description: string;
  severity: string;
  cwe: string;
  status: string;
  createdAt: string;
}

export interface CWEData {
  id: string;
  name: string;
  description: string;
  likelihood: string;
  consequences: string[] | unknown[];
  mitigations: string[];
}
