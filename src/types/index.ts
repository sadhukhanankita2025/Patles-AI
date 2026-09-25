export type PageView = 
  | 'landing' 
  | 'auth' 
  | 'ai-builder' 
  | 'dashboard'
  | 'my-projects'
  | 'project-dashboard'
  | 'workspace'
  | 'deployment'
  | 'documentation'
  | 'github-import'
  | 'github'
  | 'workflow'
  | 'profile';

export type AuthMode = 'login' | 'signup';

export type ProjectType = 'website' | 'mobile' | 'fullstack';

export type AIModelId = 'ibm-granite' | 'gpt-4o' | 'claude-3-7' | 'gemini-3-8';

export interface AIModel {
  id: AIModelId;
  name: string;
  provider: string;
  badge?: string;
  description: string;
  contextWindow: string;
  speed: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  badgeText: string;
  metrics: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: 'Healthcare' | 'E-Commerce' | 'Education' | 'Portfolio' | 'Finance';
  description: string;
  techStack: string[];
  stars: number;
  forks: number;
  previewColor: string;
  defaultPrompt: string;
  highlights: string[];
}

export interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  timeframe: string;
  iconName: string;
  sparkline: number[];
}

export interface ProjectRecord {
  id: string;
  name: string;
  type: ProjectType;
  modelUsed: string;
  status: 'Ready' | 'Building' | 'Live' | 'Failed';
  updatedAt: string;
  stars: number;
  branch: string;
  url?: string;
  description: string;
  linesOfCode: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'queued' | 'warning';
  model: string;
  duration: string;
}

export interface AITip {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: string;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  category: 'client' | 'gateway' | 'service' | 'cache' | 'database' | 'queue' | 'ai';
  tech: string;
  description: string;
  connections: string[];
  latency?: string;
  security?: string;
}

export interface ArchitectureData {
  pattern: string;
  description: string;
  scalabilitySummary: string;
  securityProtocol: string;
  dataFlowSteps: string[];
  nodes: ArchitectureNode[];
  mermaidDiagram: string;
}

export interface GeneratedProjectStructure {
  projectName: string;
  projectType: ProjectType;
  model: string;
  summary: string;
  architecture: ArchitectureData;
  frontend: {
    framework: string;
    fileCount: number;
    mainFile: string;
    sampleCode: string;
    previewType?: string;
  };
  backend: {
    runtime: string;
    endpoints: { method: string; path: string; desc: string; sampleResponse?: string }[];
    sampleCode: string;
  };
  database: {
    dialect: string;
    tables: string[];
    schemaCode: string;
  };
  readme: {
    overview: string;
    installCmd: string;
    runCmd: string;
    features: string[];
    envVars?: string[];
  };
}
