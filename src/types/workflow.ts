export type WorkflowCategory = 
  | 'overview' 
  | 'frontend' 
  | 'backend' 
  | 'api' 
  | 'database' 
  | 'table' 
  | 'auth' 
  | 'journey' 
  | 'external';

export type WorkflowSubtype = 
  | 'page' 
  | 'component' 
  | 'hook' 
  | 'route' 
  | 'controller' 
  | 'service' 
  | 'model' 
  | 'table' 
  | 'api' 
  | 'middleware' 
  | 'database' 
  | 'external' 
  | 'journey';

export interface WorkflowNodeData {
  id: string;
  label: string;
  category: WorkflowCategory;
  subType?: WorkflowSubtype;
  path?: string;
  description: string;
  language?: string;
  framework?: string;
  method?: string;
  endpoint?: string;
  connectedApis?: string[];
  connectedComponents?: string[];
  databaseRelations?: string[];
  dependencies?: string[];
  sourceFile?: string;
  status?: string;
  metadata?: Record<string, any>;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  inboundCount?: number;
  outboundCount?: number;
  connectionRole?: 'focus' | 'inbound' | 'outbound' | null;
}

export interface WorkflowNodeItem {
  id: string;
  type: string;
  category: WorkflowCategory;
  label: string;
  path?: string;
  description: string;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdgeItem {
  id: string;
  source: string;
  target: string;
  label?: string;
  category?: string;
  animated?: boolean;
  style?: Record<string, any>;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  connectionType?: 'inbound' | 'outbound' | 'normal';
}

export interface WorkflowGraphResponse {
  nodes: WorkflowNodeItem[];
  edges: WorkflowEdgeItem[];
  metadata: {
    repositoryId: string;
    name: string;
    owner: string;
    branch: string;
    techStack: string[];
    frameworks: string[];
    latestCommitSha?: string;
    totalNodes: number;
    totalEdges: number;
    categories: Record<string, number>;
    hasAuthenticationFlow: boolean;
    authFlowMessage?: string;
    userJourneyMessage: string;
    generatedAt: string;
  };
}
