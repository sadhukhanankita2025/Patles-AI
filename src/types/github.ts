export interface GitHubRepoMetadata {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  url: string;
  description: string;
  defaultBranch: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  latestCommitSha?: string;
  latestCommitMessage?: string;
}

export interface DetectedTech {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'language' | 'library' | 'mobile';
  confidence: number;
  sourceFile: string;
  version?: string;
}

export interface DiscoveredApi {
  method: string;
  path: string;
  filePath: string;
  purpose: string;
  handlerName?: string;
}

export interface DependencyItem {
  name: string;
  version: string;
  purpose: string;
  type: 'production' | 'development';
}

export interface DatabaseArchitecture {
  type: string;
  orm: string;
  schemaFiles: string[];
  models: string[];
  flow: string[];
}

export interface ProjectHealth {
  filesScanned: number;
  linesOfCode: number;
  componentsCount: number;
  apiCount: number;
  dependenciesCount: number;
  documentationScore: string;
  environmentStatus: string;
  testCoverageStatus: string;
  typeSafety: string;
  stars: number;
  forks: number;
  openIssues: number;
}

export interface UserJourneyStep {
  step: number;
  title: string;
  route: string;
  desc: string;
}

export interface ComponentNode {
  name: string;
  path: string;
  dependencies: string[];
}

export interface ArchitectureNode {
  id: string;
  name: string;
  category: string;
  tech: string;
  description: string;
  connections: string[];
  latency?: string;
}

export interface RepositoryFileItem {
  id: string;
  path: string;
  fileName: string;
  language: string;
  size: number;
  hasContent?: boolean;
}

export interface FileContentDetail {
  id: string;
  repository_id: string;
  path: string;
  file_name: string;
  language: string;
  size: number;
  content: string;
}

export interface FileExplanation {
  summary: string;
  purpose: string;
  functions: Array<{ name: string; description: string }>;
  inputs: string;
  outputs: string;
  dependencies: string[];
  apis: string[];
  database: string;
  security: string;
  isAIGenerated?: boolean;
  modelUsed?: string;
}

export interface FolderExplanation {
  folderPath: string;
  purpose: string;
  importantFiles: Array<{ name: string; reason: string }>;
  relationship: string;
  responsibilities: string[];
  isAIGenerated?: boolean;
  modelUsed?: string;
}

export interface CodebaseSummary {
  projectOverview: string;
  architecture: string;
  mainFeatures: string[];
  technologyStack: string[];
  authentication: string;
  apiLayer: string;
  database: string;
  dependencies: string[];
  entryPoints: {
    frontend?: string;
    backend?: string;
  };
  isAIGenerated?: boolean;
  modelUsed?: string;
}

export interface RepositoryAnalysis {
  id: string;
  repository_id: string;
  technology_stack: DetectedTech[];
  frameworks: string[];
  database: DatabaseArchitecture;
  api_count: number;
  component_count: number;
  apis: DiscoveredApi[];
  dependencies: DependencyItem[];
  summary?: CodebaseSummary;
  architecture: {
    pattern: string;
    description: string;
    nodes: ArchitectureNode[];
  };
  health: ProjectHealth;
  user_journeys: UserJourneyStep[];
  component_graph: {
    totalComponents: number;
    hierarchy: ComponentNode[];
  };
}
