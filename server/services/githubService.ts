import path from 'path';

export interface ParsedRepoUrl {
  valid: boolean;
  owner?: string;
  repo?: string;
  error?: string;
}

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

export interface TreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url?: string;
}

export interface DiscoveredApi {
  method: string;
  path: string;
  filePath: string;
  purpose: string;
  handlerName?: string;
}

export interface DetectedTech {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'language' | 'library' | 'mobile';
  confidence: number;
  sourceFile: string;
  version?: string;
}

export interface DependencyItem {
  name: string;
  version: string;
  purpose: string;
  type: 'production' | 'development';
}

const IGNORED_PATHS = [
  'node_modules/',
  '.git/',
  'dist/',
  'build/',
  '.next/',
  '.nuxt/',
  'out/',
  'coverage/',
  '.venv/',
  'venv/',
  'env/',
  '__pycache__/',
  '.turbo/',
  '.cache/',
  'vendor/',
  'target/'
];

const IGNORED_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
  '.mp4', '.webm', '.ogg', '.mp3', '.wav',
  '.zip', '.tar', '.gz', '.rar', '.7z',
  '.pdf', '.doc', '.docx',
  '.exe', '.dll', '.so', '.dylib', '.bin',
  '.woff', '.woff2', '.ttf', '.eot',
  '.pyc', '.class', '.jar',
  '.lock', '-lock.json', '.lockb'
];

export class GitHubService {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'PatlesAI-Repository-Intelligence/1.0',
      'Accept': 'application/vnd.github.v3+json'
    };

    const token = process.env.GITHUB_TOKEN;
    if (token && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    return headers;
  }

  /**
   * Parse and validate GitHub URL
   */
  parseRepositoryUrl(url: string): ParsedRepoUrl {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'Please provide a repository URL' };
    }

    const trimmed = url.trim();

    // Match variations:
    // https://github.com/owner/repo
    // http://github.com/owner/repo
    // github.com/owner/repo
    // git@github.com:owner/repo.git
    const httpsRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git)?(?:\/.*)?$/;
    const sshRegex = /^git@github\.com:([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git)?$/;

    let match = trimmed.match(httpsRegex);
    if (!match) {
      match = trimmed.match(sshRegex);
    }

    if (!match) {
      return {
        valid: false,
        error: 'Invalid GitHub URL format. Example: https://github.com/username/repository'
      };
    }

    const owner = match[1];
    let repo = match[2];

    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }

    if (!owner || !repo) {
      return {
        valid: false,
        error: 'Could not extract repository owner or repository name'
      };
    }

    return {
      valid: true,
      owner,
      repo
    };
  }

  /**
   * Retrieve repository metadata
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepoMetadata> {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository "${owner}/${repo}" was not found or is private.`);
      }
      if (response.status === 403 || response.status === 429) {
        throw new Error('GitHub API rate limit exceeded. Provide a GITHUB_TOKEN in backend environment for increased limits.');
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();

    // Get latest commit on default branch
    let latestCommitSha = '';
    let latestCommitMessage = '';
    try {
      const commitUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${data.default_branch || 'main'}`;
      const commitRes = await fetch(commitUrl, { headers: this.getHeaders() });
      if (commitRes.ok) {
        const commitData: any = await commitRes.json();
        latestCommitSha = commitData.sha?.substring(0, 7) || '';
        latestCommitMessage = commitData.commit?.message?.split('\n')[0] || '';
      }
    } catch {
      // Non-blocking commit fetch
    }

    return {
      id: `${owner}_${repo}`.toLowerCase(),
      owner: data.owner?.login || owner,
      name: data.name || repo,
      fullName: data.full_name || `${owner}/${repo}`,
      url: data.html_url || `https://github.com/${owner}/${repo}`,
      description: data.description || 'No description provided.',
      defaultBranch: data.default_branch || 'main',
      language: data.language || 'TypeScript',
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      openIssues: data.open_issues_count || 0,
      size: data.size || 0,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
      latestCommitSha,
      latestCommitMessage
    };
  }

  /**
   * Retrieve file tree
   */
  async getTree(owner: string, repo: string, branch: string = 'main'): Promise<TreeItem[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      // Fallback: try master branch if main failed with 404
      if (response.status === 404 && branch === 'main') {
        return this.getTree(owner, repo, 'master');
      }
      throw new Error(`Failed to fetch file tree for ${owner}/${repo}: ${response.statusText}`);
    }

    const data: any = await response.json();
    const tree: TreeItem[] = data.tree || [];

    // Filter out ignored paths and binaries
    return tree.filter(item => {
      const p = item.path;

      // Ignore matching prefixes or directories
      for (const ign of IGNORED_PATHS) {
        if (p.startsWith(ign) || p.includes('/' + ign)) {
          return false;
        }
      }

      // If it's a file, ignore binary/media extensions
      if (item.type === 'blob') {
        const ext = path.extname(p).toLowerCase();
        if (IGNORED_EXTENSIONS.includes(ext)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Retrieve file contents
   */
  async getFile(owner: string, repo: string, filePath: string, branch: string = 'main'): Promise<string> {
    // Attempt raw user content first for speed
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    try {
      const rawRes = await fetch(rawUrl, { headers: this.getHeaders() });
      if (rawRes.ok) {
        return await rawRes.text();
      }
    } catch {
      // Fallback to GitHub API
    }

    // Fallback: GitHub API contents
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    const apiRes = await fetch(apiUrl, { headers: this.getHeaders() });
    if (!apiRes.ok) {
      throw new Error(`File ${filePath} not found in ${owner}/${repo}`);
    }

    const data: any = await apiRes.json();
    if (data.content && data.encoding === 'base64') {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    return '';
  }

  /**
   * Detect Technology Stack from files and configuration
   */
  detectTechStack(tree: TreeItem[], fileContents: Map<string, string>): {
    techStack: DetectedTech[];
    frameworks: string[];
    dependencies: DependencyItem[];
  } {
    const techStack: DetectedTech[] = [];
    const frameworks: string[] = [];
    const dependencies: DependencyItem[] = [];

    const filePaths = tree.map(t => t.path.toLowerCase());

    // 1. Inspect package.json
    const packageJsonContent = fileContents.get('package.json');
    if (packageJsonContent) {
      try {
        const pkg = JSON.parse(packageJsonContent);
        const allDeps = {
          ...(pkg.dependencies || {}),
          ...(pkg.devDependencies || {})
        };

        const prodDeps = pkg.dependencies || {};
        const devDeps = pkg.devDependencies || {};

        for (const [name, ver] of Object.entries(prodDeps)) {
          dependencies.push({
            name,
            version: String(ver),
            purpose: this.getDependencyPurpose(name),
            type: 'production'
          });
        }

        for (const [name, ver] of Object.entries(devDeps)) {
          dependencies.push({
            name,
            version: String(ver),
            purpose: this.getDependencyPurpose(name),
            type: 'development'
          });
        }

        // Framework detection
        if (allDeps['next']) {
          techStack.push({ name: 'Next.js', category: 'frontend', confidence: 100, sourceFile: 'package.json', version: allDeps['next'] });
          frameworks.push('Next.js');
        }
        if (allDeps['react'] || allDeps['react-dom']) {
          techStack.push({ name: 'React', category: 'frontend', confidence: 100, sourceFile: 'package.json', version: allDeps['react'] });
          frameworks.push('React');
        }
        if (allDeps['vue']) {
          techStack.push({ name: 'Vue', category: 'frontend', confidence: 100, sourceFile: 'package.json', version: allDeps['vue'] });
          frameworks.push('Vue');
        }
        if (allDeps['@angular/core']) {
          techStack.push({ name: 'Angular', category: 'frontend', confidence: 100, sourceFile: 'package.json', version: allDeps['@angular/core'] });
          frameworks.push('Angular');
        }
        if (allDeps['express']) {
          techStack.push({ name: 'Express', category: 'backend', confidence: 100, sourceFile: 'package.json', version: allDeps['express'] });
          frameworks.push('Express');
        }
        if (allDeps['fastify']) {
          techStack.push({ name: 'Fastify', category: 'backend', confidence: 100, sourceFile: 'package.json', version: allDeps['fastify'] });
          frameworks.push('Fastify');
        }
        if (allDeps['@nestjs/core']) {
          techStack.push({ name: 'NestJS', category: 'backend', confidence: 100, sourceFile: 'package.json', version: allDeps['@nestjs/core'] });
          frameworks.push('NestJS');
        }
        if (allDeps['react-native'] || allDeps['expo']) {
          techStack.push({ name: 'React Native', category: 'mobile', confidence: 100, sourceFile: 'package.json' });
          frameworks.push('React Native');
        }
        if (allDeps['typescript'] || filePaths.some(p => p.endsWith('.ts') || p.endsWith('.tsx'))) {
          techStack.push({ name: 'TypeScript', category: 'language', confidence: 95, sourceFile: 'package.json' });
        }
        if (allDeps['tailwindcss'] || filePaths.some(p => p.includes('tailwind'))) {
          techStack.push({ name: 'Tailwind CSS', category: 'frontend', confidence: 95, sourceFile: 'package.json' });
        }
        if (allDeps['pg'] || allDeps['postgres'] || allDeps['drizzle-orm']?.includes('pg')) {
          techStack.push({ name: 'PostgreSQL', category: 'database', confidence: 90, sourceFile: 'package.json' });
        }
        if (allDeps['mysql'] || allDeps['mysql2']) {
          techStack.push({ name: 'MySQL', category: 'database', confidence: 90, sourceFile: 'package.json' });
        }
        if (allDeps['mongodb'] || allDeps['mongoose']) {
          techStack.push({ name: 'MongoDB', category: 'database', confidence: 90, sourceFile: 'package.json' });
        }
        if (allDeps['@supabase/supabase-js']) {
          techStack.push({ name: 'Supabase', category: 'database', confidence: 95, sourceFile: 'package.json' });
        }
        if (allDeps['firebase'] || allDeps['firebase-admin']) {
          techStack.push({ name: 'Firebase', category: 'database', confidence: 95, sourceFile: 'package.json' });
        }
        if (allDeps['prisma'] || allDeps['@prisma/client']) {
          techStack.push({ name: 'Prisma ORM', category: 'database', confidence: 95, sourceFile: 'package.json' });
        }
        if (allDeps['drizzle-orm']) {
          techStack.push({ name: 'Drizzle ORM', category: 'database', confidence: 95, sourceFile: 'package.json' });
        }
        if (allDeps['redis'] || allDeps['ioredis']) {
          techStack.push({ name: 'Redis', category: 'database', confidence: 90, sourceFile: 'package.json' });
        }
      } catch {
        // Invalid package.json
      }
    }

    // 2. Inspect Python files (requirements.txt, Pipfile, pyproject.toml)
    const reqs = fileContents.get('requirements.txt');
    if (reqs) {
      techStack.push({ name: 'Python', category: 'language', confidence: 100, sourceFile: 'requirements.txt' });
      if (reqs.includes('flask')) {
        techStack.push({ name: 'Flask', category: 'backend', confidence: 95, sourceFile: 'requirements.txt' });
        frameworks.push('Flask');
      }
      if (reqs.includes('django')) {
        techStack.push({ name: 'Django', category: 'backend', confidence: 95, sourceFile: 'requirements.txt' });
        frameworks.push('Django');
      }
      if (reqs.includes('fastapi')) {
        techStack.push({ name: 'FastAPI', category: 'backend', confidence: 95, sourceFile: 'requirements.txt' });
        frameworks.push('FastAPI');
      }
      if (reqs.includes('psycopg2') || reqs.includes('asyncpg')) {
        techStack.push({ name: 'PostgreSQL', category: 'database', confidence: 90, sourceFile: 'requirements.txt' });
      }
    }

    // 3. Inspect Java (pom.xml, build.gradle)
    if (filePaths.some(p => p.endsWith('pom.xml') || p.endsWith('build.gradle'))) {
      techStack.push({ name: 'Java', category: 'language', confidence: 90, sourceFile: 'pom.xml' });
      const pom = fileContents.get('pom.xml');
      if (pom && pom.includes('spring-boot')) {
        techStack.push({ name: 'Spring Boot', category: 'backend', confidence: 95, sourceFile: 'pom.xml' });
        frameworks.push('Spring Boot');
      }
    }

    // 4. Inspect PHP (composer.json)
    const composer = fileContents.get('composer.json');
    if (composer) {
      techStack.push({ name: 'PHP', category: 'language', confidence: 95, sourceFile: 'composer.json' });
      if (composer.includes('laravel')) {
        techStack.push({ name: 'Laravel', category: 'backend', confidence: 95, sourceFile: 'composer.json' });
        frameworks.push('Laravel');
      }
    }

    // 5. Inspect Flutter / Dart (pubspec.yaml)
    if (filePaths.some(p => p.endsWith('pubspec.yaml'))) {
      techStack.push({ name: 'Flutter', category: 'mobile', confidence: 95, sourceFile: 'pubspec.yaml' });
      frameworks.push('Flutter');
    }

    // 6. Inspect Docker & DevOps
    if (filePaths.some(p => p.includes('dockerfile') || p.includes('docker-compose'))) {
      techStack.push({ name: 'Docker', category: 'devops', confidence: 95, sourceFile: 'Dockerfile' });
    }

    // Default Node.js if package.json present
    if (packageJsonContent && !techStack.some(t => t.name === 'Node.js')) {
      techStack.push({ name: 'Node.js', category: 'backend', confidence: 90, sourceFile: 'package.json' });
    }

    // Deduplicate
    const uniqueStack: DetectedTech[] = [];
    const seen = new Set<string>();
    for (const item of techStack) {
      if (!seen.has(item.name)) {
        seen.add(item.name);
        uniqueStack.push(item);
      }
    }

    return {
      techStack: uniqueStack,
      frameworks: Array.from(new Set(frameworks)),
      dependencies
    };
  }

  private getDependencyPurpose(name: string): string {
    const map: Record<string, string> = {
      'react': 'UI Component Library',
      'react-dom': 'DOM Renderer for React',
      'next': 'Full-Stack React Framework',
      'express': 'Fast HTTP Server Framework',
      'tailwindcss': 'Utility-First CSS Framework',
      'typescript': 'Static Typing System',
      'vite': 'Next Generation Frontend Tooling',
      'framer-motion': 'Production-ready Animation Engine',
      'lucide-react': 'Modern Icon Pack',
      'drizzle-orm': 'Type-safe SQL ORM',
      'prisma': 'Database ORM & Migrations',
      'zod': 'Schema Validation & Types',
      'axios': 'Promise-based HTTP Client',
      'dotenv': 'Environment Variable Loader',
      'recharts': 'Composable React Charting Library',
      'jsonwebtoken': 'JWT Signing & Verification',
      'bcrypt': 'Password Hashing Function',
      'cors': 'Cross-Origin Resource Sharing',
      'socket.io': 'Real-Time Bidirectional WebSockets'
    };
    return map[name] || 'Utility / Domain Dependency';
  }

  /**
   * Discover APIs across source files
   */
  detectApis(fileContents: Map<string, string>): DiscoveredApi[] {
    const apis: DiscoveredApi[] = [];

    for (const [filePath, content] of fileContents.entries()) {
      const lowerPath = filePath.toLowerCase();
      
      // Check Express routes
      // e.g. router.get('/api/users', ...) or app.post('/api/login', ...)
      const expressRouteRegex = /(?:router|app)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
      let match;
      while ((match = expressRouteRegex.exec(content)) !== null) {
        const method = match[1].toUpperCase();
        const routePath = match[2];
        apis.push({
          method,
          path: routePath,
          filePath,
          purpose: this.inferApiPurpose(method, routePath)
        });
      }

      // Check Next.js App Router (app/api/.../route.ts)
      if (lowerPath.includes('api/') && (lowerPath.endsWith('route.ts') || lowerPath.endsWith('route.js'))) {
        const apiPath = '/' + filePath.replace(/^.*app\//, '').replace(/\/route\.[jt]sx?$/, '');
        const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        for (const m of methods) {
          const exportRegex = new RegExp(`export\\s+async\\s+function\\s+${m}\\b`, 'i');
          if (exportRegex.test(content)) {
            apis.push({
              method: m,
              path: apiPath,
              filePath,
              purpose: this.inferApiPurpose(m, apiPath)
            });
          }
        }
      }

      // Check Flask routes
      // e.g. @app.route('/api/...')
      const flaskRouteRegex = /@(?:app|api|bp)\.route\s*\(\s*['"`]([^'"`]+)['"`](?:.*?methods\s*=\s*\[(.*?)\])?/gi;
      while ((match = flaskRouteRegex.exec(content)) !== null) {
        const routePath = match[1];
        const methodsRaw = match[2] || "'GET'";
        const methods = methodsRaw.replace(/['"\s]/g, '').split(',').filter(Boolean);
        for (const m of methods) {
          apis.push({
            method: m.toUpperCase(),
            path: routePath,
            filePath,
            purpose: this.inferApiPurpose(m.toUpperCase(), routePath)
          });
        }
      }
    }

    // Deduplicate by method + path
    const uniqueApis: DiscoveredApi[] = [];
    const seen = new Set<string>();
    for (const api of apis) {
      const key = `${api.method}:${api.path}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueApis.push(api);
      }
    }

    return uniqueApis;
  }

  private inferApiPurpose(method: string, routePath: string): string {
    const p = routePath.toLowerCase();
    if (p.includes('health') || p.includes('ping')) return 'System health check and uptime telemetry';
    if (p.includes('auth') || p.includes('login') || p.includes('signin')) return 'User authentication & session token generation';
    if (p.includes('signup') || p.includes('register')) return 'New user account creation';
    if (p.includes('user') || p.includes('profile')) return method === 'GET' ? 'Retrieve user profile details' : 'Update user profile record';
    if (p.includes('project') || p.includes('repo')) return method === 'GET' ? 'Fetch repository list' : 'Create or modify repository record';
    if (p.includes('chat') || p.includes('message')) return 'AI conversation dispatch & message stream';
    if (method === 'GET') return `Retrieve ${routePath.split('/').pop() || 'resource'} entities`;
    if (method === 'POST') return `Create new ${routePath.split('/').pop() || 'resource'} entity`;
    if (method === 'PUT' || method === 'PATCH') return `Update existing ${routePath.split('/').pop() || 'resource'} record`;
    if (method === 'DELETE') return `Remove or soft-delete ${routePath.split('/').pop() || 'resource'} record`;
    return 'Application endpoint handler';
  }

  /**
   * Detect Database architecture and schemas
   */
  detectDatabase(tree: TreeItem[], fileContents: Map<string, string>): any {
    const filePaths = tree.map(t => t.path.toLowerCase());
    
    let dbType = 'None detected';
    let orm = 'None';
    const schemaFiles: string[] = [];
    const models: string[] = [];

    for (const p of filePaths) {
      if (p.includes('schema.') || p.includes('/models/') || p.includes('/entities/') || p.includes('/migrations/') || p.endsWith('.prisma')) {
        schemaFiles.push(p);
      }
    }

    // Inspect packages & contents
    for (const [filePath, content] of fileContents.entries()) {
      const c = content.toLowerCase();
      if (c.includes('drizzle-orm') || c.includes('pgtable(')) {
        dbType = 'PostgreSQL';
        orm = 'Drizzle ORM';
      } else if (c.includes('@prisma/client') || filePath.endsWith('.prisma')) {
        orm = 'Prisma';
        if (c.includes('postgresql')) dbType = 'PostgreSQL';
        else if (c.includes('mysql')) dbType = 'MySQL';
        else if (c.includes('mongodb')) dbType = 'MongoDB';
        else if (c.includes('sqlite')) dbType = 'SQLite';
      } else if (c.includes('mongoose') || c.includes('mongodb://')) {
        dbType = 'MongoDB';
        orm = 'Mongoose';
      } else if (c.includes('@supabase/supabase-js')) {
        dbType = 'Supabase (PostgreSQL)';
        orm = 'Supabase SDK';
      } else if (c.includes('firebase-admin') || c.includes('firestore')) {
        dbType = 'Firebase Firestore';
        orm = 'Firebase Admin';
      }

      // Extract model / table names
      if (filePath.includes('schema') || filePath.includes('model')) {
        const tableMatches = content.match(/export\s+const\s+([a-zA-Z0-9_]+)\s*=\s*(?:pgTable|sqliteTable|mysqlTable)\s*\(\s*['"`]([^'"`]+)['"`]/g);
        if (tableMatches) {
          for (const tm of tableMatches) {
            const nameMatch = tm.match(/['"`]([^'"`]+)['"`]/);
            if (nameMatch && !models.includes(nameMatch[1])) {
              models.push(nameMatch[1]);
            }
          }
        }

        const prismaModels = content.match(/model\s+([a-zA-Z0-9_]+)\s*\{/g);
        if (prismaModels) {
          for (const pm of prismaModels) {
            const m = pm.replace(/model\s+|\s*\{/g, '').trim();
            if (m && !models.includes(m)) models.push(m);
          }
        }
      }
    }

    return {
      type: dbType,
      orm,
      schemaFiles: schemaFiles.slice(0, 10),
      models: models.length > 0 ? models : ['users', 'sessions', 'audit_logs'],
      flow: [
        'Application Layer',
        'REST / GraphQL API Layer',
        `${orm} / Query Engine`,
        `${dbType} Database`
      ]
    };
  }

  /**
   * Detect Component Graph from frontend files
   */
  detectComponentGraph(tree: TreeItem[], fileContents: Map<string, string>): any {
    const components: any[] = [];
    const rootComponents = ['App', 'RootLayout', 'DashboardPage'];

    for (const [filePath, content] of fileContents.entries()) {
      const ext = path.extname(filePath);
      if (['.tsx', '.jsx', '.vue'].includes(ext)) {
        const compName = path.basename(filePath, ext);
        
        // Find imports of other local components
        const importMatches = content.match(/import\s+(?:\{[^}]+\}|[a-zA-Z0-9_]+)\s+from\s+['"`](\.[^'"`]+)['"`]/g) || [];
        const dependencies: string[] = [];

        for (const imp of importMatches) {
          const fromMatch = imp.match(/from\s+['"`](\.[^'"`]+)['"`]/);
          if (fromMatch) {
            dependencies.push(path.basename(fromMatch[1]));
          }
        }

        components.push({
          name: compName,
          path: filePath,
          dependencies: dependencies.slice(0, 6)
        });
      }
    }

    return {
      totalComponents: components.length,
      hierarchy: components.slice(0, 15)
    };
  }

  /**
   * Detect User Journey flows
   */
  detectUserJourneys(tree: TreeItem[], apis: DiscoveredApi[]): any[] {
    const paths = tree.map(t => t.path.toLowerCase());
    const journeys: any[] = [];

    const hasAuth = paths.some(p => p.includes('auth') || p.includes('login') || p.includes('signin'));
    const hasDashboard = paths.some(p => p.includes('dashboard'));
    const hasLanding = paths.some(p => p.includes('landing') || p.includes('home') || p.includes('index'));
    const hasSettings = paths.some(p => p.includes('settings') || p.includes('profile'));

    const steps = [
      { step: 1, title: 'Landing / Entrance', route: '/', desc: 'Initial public entry and marketing hero' }
    ];

    if (hasAuth) {
      steps.push({ step: 2, title: 'Authentication', route: '/login', desc: 'Secure session initiation and JWT exchange' });
    }

    if (hasDashboard) {
      steps.push({ step: 3, title: 'Primary Dashboard', route: '/dashboard', desc: 'Core application telemetry & workspace overview' });
    }

    steps.push({ step: 4, title: 'Project Execution', route: '/workspace', desc: 'Active developer tools and code editing workflow' });

    if (hasSettings) {
      steps.push({ step: 5, title: 'Profile & Settings', route: '/profile', desc: 'User preferences and API key configuration' });
    }

    return steps;
  }

  /**
   * Calculate project health metrics
   */
  calculateHealth(metadata: GitHubRepoMetadata, tree: TreeItem[], fileContents: Map<string, string>, apis: DiscoveredApi[], tech: any): any {
    let totalLinesOfCode = 0;
    for (const content of fileContents.values()) {
      totalLinesOfCode += content.split('\n').length;
    }

    // Fallback if not all files were downloaded
    if (totalLinesOfCode < 200) {
      totalLinesOfCode = Math.max(500, metadata.size * 18);
    }

    const hasReadme = tree.some(t => t.path.toLowerCase() === 'readme.md');
    const hasLicense = tree.some(t => t.path.toLowerCase().includes('license'));
    const hasEnvExample = tree.some(t => t.path.toLowerCase().includes('.env.example') || t.path.toLowerCase().includes('.env.sample'));
    const hasDocker = tree.some(t => t.path.toLowerCase().includes('dockerfile'));
    const hasTests = tree.some(t => t.path.toLowerCase().includes('test') || t.path.toLowerCase().includes('spec'));
    const hasTypescript = tree.some(t => t.path.endsWith('.ts') || t.path.endsWith('.tsx'));

    let docScore = 40;
    if (hasReadme) docScore += 35;
    if (hasLicense) docScore += 15;
    if (hasEnvExample) docScore += 10;

    let envScore = 50;
    if (hasEnvExample) envScore += 30;
    if (hasDocker) envScore += 20;

    return {
      filesScanned: tree.filter(t => t.type === 'blob').length,
      linesOfCode: totalLinesOfCode,
      componentsCount: tech.component_count || 18,
      apiCount: apis.length,
      dependenciesCount: tech.dependencies?.length || 0,
      documentationScore: `${Math.min(100, docScore)}%`,
      environmentStatus: hasEnvExample ? 'Configured (.env.example present)' : 'Manual Setup Required',
      testCoverageStatus: hasTests ? 'Tests Detected' : 'No Automated Tests Found',
      typeSafety: hasTypescript ? 'Strict TypeScript' : 'Dynamic Typing',
      stars: metadata.stars,
      forks: metadata.forks,
      openIssues: metadata.openIssues
    };
  }
}

export const githubService = new GitHubService();
