export interface DecisionAnalysis {
  prosCons: {
    option: string;
    pros: string[];
    cons: string[];
  }[];
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendation: string;
  summary: string;
}
