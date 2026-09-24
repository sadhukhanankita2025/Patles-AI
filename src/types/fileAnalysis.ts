export type FileCategory = 
  | 'component' 
  | 'page' 
  | 'route' 
  | 'service' 
  | 'model' 
  | 'hook' 
  | 'util' 
  | 'style' 
  | 'config' 
  | 'test' 
  | 'doc' 
  | 'other';

export type ComplexityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface FileMetricItem {
  id: string;
  path: string;
  fileName: string;
  extension: string;
  category: FileCategory;
  language: string;
  size: number;
  linesOfCode: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  cyclomaticComplexity: number;
  complexityLevel: ComplexityLevel;
  maintainabilityIndex: number; // 0 - 100
  importsCount: number;
  inboundImportsCount: number; // How many other files import this
  importedBy: string[]; // Paths of files importing this
  importedFiles: string[]; // Internal paths imported by this
  externalPackages: string[]; // External packages imported
  exportsCount: number;
  exportedSymbols: string[];
  isHotspot: boolean; // Highly coupled file
  isEntrypoint: boolean;
  hasContent: boolean;
}

export interface FileNetworkNode {
  id: string;
  path: string;
  name: string;
  category: FileCategory;
  language: string;
  linesOfCode: number;
  size: number;
  complexityLevel: ComplexityLevel;
  cyclomaticComplexity: number;
  inboundCount: number;
  outboundCount: number;
  isHotspot: boolean;
  isEntrypoint: boolean;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

export interface FileNetworkEdge {
  id: string;
  source: string; // source file id
  target: string; // target file id
  sourcePath: string;
  targetPath: string;
  type: 'imports' | 'references';
}

export interface DirectoryCluster {
  path: string;
  name: string;
  totalFiles: number;
  totalLinesOfCode: number;
  totalSize: number;
  averageComplexity: number;
  dominantLanguage: string;
  files: string[];
}

export interface CodebaseFileSummary {
  repositoryId: string;
  totalFiles: number;
  totalLinesOfCode: number;
  totalSize: number;
  averageLocPerFile: number;
  averageComplexity: number;
  languages: Array<{
    language: string;
    extension: string;
    count: number;
    linesOfCode: number;
    percentage: number;
    color: string;
  }>;
  complexityDistribution: {
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  categoriesDistribution: Record<FileCategory, number>;
  hotspots: FileMetricItem[];
  highComplexityFiles: FileMetricItem[];
  leafFiles: FileMetricItem[];
}

export interface FileAnalysisResponse {
  summary: CodebaseFileSummary;
  files: FileMetricItem[];
  directories: DirectoryCluster[];
  network: {
    nodes: FileNetworkNode[];
    edges: FileNetworkEdge[];
  };
  generatedAt: string;
}
