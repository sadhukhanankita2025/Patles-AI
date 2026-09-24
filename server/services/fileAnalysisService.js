import path from 'path';
import { repositoryStore } from '../db/repositoryStore.js';

const LANGUAGE_COLORS = {
  ts: '#3178C6',
  tsx: '#61DAFB',
  js: '#F7DF1E',
  jsx: '#61DAFB',
  py: '#3776AB',
  json: '#E535AB',
  css: '#264DE4',
  scss: '#CC6699',
  html: '#E34F26',
  sql: '#336791',
  md: '#083FA1',
  yml: '#CB171E',
  yaml: '#CB171E',
  other: '#94A3B8'
};

class FileAnalysisService {
  constructor() {
    this.cache = new Map();
    this.CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
  }

  async analyzeRepositoryFiles(repositoryId, forceRefresh = false) {
    if (!forceRefresh && this.cache.has(repositoryId)) {
      const cached = this.cache.get(repositoryId);
      if (Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
        return cached.result;
      }
    }

    const repo = await repositoryStore.getRepository(repositoryId);
    if (!repo) {
      throw new Error(`Repository with ID ${repositoryId} not found`);
    }

    const files = await repositoryStore.getFiles(repositoryId);
    if (!files || files.length === 0) {
      throw new Error(`No files found for repository ${repositoryId}`);
    }

    const pathToIdMap = new Map();
    const idToFileMap = new Map();
    for (const f of files) {
      const normalizedPath = f.path.replace(/\\/g, '/');
      pathToIdMap.set(normalizedPath, f.id);
      idToFileMap.set(f.id, f);
    }

    const fileMetrics = [];
    const inboundMap = new Map();
    const outboundMap = new Map();

    for (const file of files) {
      const normalizedPath = file.path.replace(/\\/g, '/');
      const ext = path.extname(normalizedPath).replace('.', '').toLowerCase();
      const fileName = path.basename(normalizedPath);
      const category = this.categorizeFile(normalizedPath, ext);

      let linesOfCode = 0;
      let codeLines = 0;
      let commentLines = 0;
      let blankLines = 0;
      let cyclomaticComplexity = 1;
      let maintainabilityIndex = 85;
      const importedFiles = [];
      const externalPackages = [];
      const exportedSymbols = [];

      const content = file.content || '';
      const hasContent = content.trim().length > 0;

      if (hasContent) {
        const lines = content.split(/\r?\n/);
        linesOfCode = lines.length;

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (line === '') {
            blankLines++;
          } else if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line.startsWith('#')) {
            commentLines++;
          } else {
            codeLines++;
          }
        }

        const branchKeywords = [
          /\bif\s*\(/g,
          /\belse\s+if\s*\(/g,
          /\bcase\s+[^:]+:/g,
          /\bfor\s*\(/g,
          /\bwhile\s*\(/g,
          /\bcatch\s*\(/g,
          /\&\&/g,
          /\|\|/g,
          /\?[^:]+:/g
        ];

        for (const regex of branchKeywords) {
          const matches = content.match(regex);
          if (matches) {
            cyclomaticComplexity += matches.length;
          }
        }

        maintainabilityIndex = Math.max(
          10,
          Math.min(
            100,
            Math.round(
              171 -
                5.2 * Math.log(Math.max(1, cyclomaticComplexity)) -
                0.23 * Math.log(Math.max(1, linesOfCode)) -
                16.2 * Math.log(Math.max(1, (file.size || 100) / 100))
            )
          )
        );

        const importRegex = /(?:import\s+(?:[\w*\s{},]*\s+from\s+)?|require\s*\()\s*['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          const rawImportPath = match[1];
          if (rawImportPath.startsWith('.')) {
            const resolvedPath = this.resolveRelativeImport(normalizedPath, rawImportPath, pathToIdMap);
            if (resolvedPath && !importedFiles.includes(resolvedPath)) {
              importedFiles.push(resolvedPath);
            }
          } else if (!rawImportPath.startsWith('/') && !rawImportPath.startsWith('@/')) {
            const pkgName = rawImportPath.startsWith('@') 
              ? rawImportPath.split('/').slice(0, 2).join('/') 
              : rawImportPath.split('/')[0];
            if (!externalPackages.includes(pkgName)) {
              externalPackages.push(pkgName);
            }
          }
        }

        const exportRegex = /export\s+(?:default\s+)?(?:const|function|class|type|interface|enum|let|var)\s+([a-zA-Z0-9_$]+)/g;
        let exportMatch;
        while ((exportMatch = exportRegex.exec(content)) !== null) {
          if (exportMatch[1] && !exportedSymbols.includes(exportMatch[1])) {
            exportedSymbols.push(exportMatch[1]);
          }
        }
      } else {
        linesOfCode = Math.max(5, Math.round((file.size || 300) / 38));
        codeLines = Math.round(linesOfCode * 0.85);
        commentLines = Math.round(linesOfCode * 0.1);
        blankLines = linesOfCode - codeLines - commentLines;
        cyclomaticComplexity = Math.max(1, Math.min(25, Math.round(linesOfCode / 25)));
        maintainabilityIndex = Math.max(40, 95 - Math.round(cyclomaticComplexity * 2));
      }

      outboundMap.set(normalizedPath, importedFiles);

      for (const imp of importedFiles) {
        const list = inboundMap.get(imp) || [];
        if (!list.includes(normalizedPath)) {
          list.push(normalizedPath);
          inboundMap.set(imp, list);
        }
      }

      let complexityLevel = 'low';
      if (cyclomaticComplexity > 25) complexityLevel = 'critical';
      else if (cyclomaticComplexity >= 14) complexityLevel = 'high';
      else if (cyclomaticComplexity >= 6) complexityLevel = 'moderate';

      const isEntrypoint = [
        'src/main.tsx',
        'src/app.tsx',
        'src/index.tsx',
        'server.ts',
        'server.js',
        'app.py',
        'main.py'
      ].includes(normalizedPath.toLowerCase());

      fileMetrics.push({
        id: file.id,
        path: normalizedPath,
        fileName,
        extension: ext || 'txt',
        category,
        language: file.language || ext || 'text',
        size: file.size || 0,
        linesOfCode,
        codeLines,
        commentLines,
        blankLines,
        cyclomaticComplexity,
        complexityLevel,
        maintainabilityIndex,
        importsCount: importedFiles.length + externalPackages.length,
        inboundImportsCount: 0,
        importedBy: [],
        importedFiles,
        externalPackages,
        exportsCount: exportedSymbols.length,
        exportedSymbols,
        isHotspot: false,
        isEntrypoint,
        hasContent
      });
    }

    for (const metric of fileMetrics) {
      const inbound = inboundMap.get(metric.path) || [];
      metric.inboundImportsCount = inbound.length;
      metric.importedBy = inbound;
      metric.isHotspot = metric.inboundImportsCount >= 3 || (metric.category === 'service' && metric.inboundImportsCount >= 2);
    }

    const directoryMap = new Map();
    for (const f of files) {
      const normalizedPath = f.path.replace(/\\/g, '/');
      const dir = path.dirname(normalizedPath);
      const list = directoryMap.get(dir) || [];
      list.push(f);
      directoryMap.set(dir, list);
    }

    const directories = [];
    for (const [dirPath, dirFiles] of directoryMap.entries()) {
      const dirMetrics = fileMetrics.filter(m => path.dirname(m.path) === dirPath);
      const totalLoc = dirMetrics.reduce((sum, m) => sum + m.linesOfCode, 0);
      const totalSize = dirMetrics.reduce((sum, m) => sum + m.size, 0);
      const avgComp = dirMetrics.length > 0 
        ? Math.round(dirMetrics.reduce((sum, m) => sum + m.cyclomaticComplexity, 0) / dirMetrics.length) 
        : 1;

      const langCounts = {};
      for (const m of dirMetrics) {
        langCounts[m.extension] = (langCounts[m.extension] || 0) + 1;
      }
      const dominant = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'text';

      directories.push({
        path: dirPath === '.' ? '/' : dirPath,
        name: dirPath === '.' ? 'root' : path.basename(dirPath),
        totalFiles: dirFiles.length,
        totalLinesOfCode: totalLoc,
        totalSize,
        averageComplexity: avgComp,
        dominantLanguage: dominant,
        files: dirFiles.map(f => f.id)
      });
    }

    const totalFiles = fileMetrics.length;
    const networkNodes = [];
    const networkEdges = [];

    const categoryAngles = {
      page: 0,
      component: Math.PI / 4,
      hook: Math.PI / 2,
      service: (3 * Math.PI) / 4,
      route: Math.PI,
      model: (5 * Math.PI) / 4,
      util: (3 * Math.PI) / 2,
      style: (7 * Math.PI) / 4,
      config: Math.PI / 6,
      test: (5 * Math.PI) / 6,
      doc: (11 * Math.PI) / 6,
      other: 0
    };

    const categoryCounters = {};

    fileMetrics.forEach((f) => {
      const baseAngle = categoryAngles[f.category] || 0;
      const count = categoryCounters[f.category] || 0;
      categoryCounters[f.category] = count + 1;

      const ringRadius = f.isHotspot || f.isEntrypoint ? 180 + (count % 3) * 40 : 320 + (count % 5) * 45;
      const angleOffset = (count * 0.45) - 0.5;
      const angle = baseAngle + angleOffset;

      const centerX = 500;
      const centerY = 400;
      const x = Math.round(centerX + ringRadius * Math.cos(angle));
      const y = Math.round(centerY + ringRadius * Math.sin(angle));

      networkNodes.push({
        id: f.id,
        path: f.path,
        name: f.fileName,
        category: f.category,
        language: f.language,
        linesOfCode: f.linesOfCode,
        size: f.size,
        complexityLevel: f.complexityLevel,
        cyclomaticComplexity: f.cyclomaticComplexity,
        inboundCount: f.inboundImportsCount,
        outboundCount: f.importsCount,
        isHotspot: f.isHotspot,
        isEntrypoint: f.isEntrypoint,
        x,
        y
      });
    });

    const edgeSet = new Set();
    for (const metric of fileMetrics) {
      for (const targetPath of metric.importedFiles) {
        const targetId = pathToIdMap.get(targetPath);
        if (targetId && targetId !== metric.id) {
          const edgeKey = `${metric.id}->${targetId}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            networkEdges.push({
              id: `edge_${metric.id}_${targetId}`,
              source: metric.id,
              target: targetId,
              sourcePath: metric.path,
              targetPath,
              type: 'imports'
            });
          }
        }
      }
    }

    const totalLinesOfCode = fileMetrics.reduce((sum, f) => sum + f.linesOfCode, 0);
    const totalSize = fileMetrics.reduce((sum, f) => sum + f.size, 0);
    const averageLocPerFile = Math.round(totalLinesOfCode / (totalFiles || 1));
    const averageComplexity = Math.round(
      fileMetrics.reduce((sum, f) => sum + f.cyclomaticComplexity, 0) / (totalFiles || 1)
    );

    const langMap = new Map();
    for (const f of fileMetrics) {
      const key = f.extension.toLowerCase();
      const cur = langMap.get(key) || { count: 0, loc: 0 };
      cur.count++;
      cur.loc += f.linesOfCode;
      langMap.set(key, cur);
    }

    const languages = Array.from(langMap.entries())
      .map(([ext, data]) => {
        const percentage = Math.round((data.loc / (totalLinesOfCode || 1)) * 100);
        return {
          language: this.mapExtensionToName(ext),
          extension: ext,
          count: data.count,
          linesOfCode: data.loc,
          percentage,
          color: LANGUAGE_COLORS[ext] || LANGUAGE_COLORS.other
        };
      })
      .sort((a, b) => b.linesOfCode - a.linesOfCode);

    const complexityDistribution = {
      low: fileMetrics.filter(f => f.complexityLevel === 'low').length,
      moderate: fileMetrics.filter(f => f.complexityLevel === 'moderate').length,
      high: fileMetrics.filter(f => f.complexityLevel === 'high').length,
      critical: fileMetrics.filter(f => f.complexityLevel === 'critical').length
    };

    const categoriesDistribution = {
      component: 0,
      page: 0,
      route: 0,
      service: 0,
      model: 0,
      hook: 0,
      util: 0,
      style: 0,
      config: 0,
      test: 0,
      doc: 0,
      other: 0
    };
    for (const f of fileMetrics) {
      categoriesDistribution[f.category] = (categoriesDistribution[f.category] || 0) + 1;
    }

    const hotspots = [...fileMetrics]
      .filter(f => f.inboundImportsCount > 0)
      .sort((a, b) => b.inboundImportsCount - a.inboundImportsCount)
      .slice(0, 10);

    const highComplexityFiles = [...fileMetrics]
      .filter(f => f.cyclomaticComplexity >= 10 || f.complexityLevel === 'high' || f.complexityLevel === 'critical')
      .sort((a, b) => b.cyclomaticComplexity - a.cyclomaticComplexity)
      .slice(0, 10);

    const leafFiles = fileMetrics.filter(
      f => f.inboundImportsCount === 0 && f.importedFiles.length === 0 && !f.isEntrypoint
    );

    const result = {
      summary: {
        repositoryId,
        totalFiles,
        totalLinesOfCode,
        totalSize,
        averageLocPerFile,
        averageComplexity,
        languages,
        complexityDistribution,
        categoriesDistribution,
        hotspots,
        highComplexityFiles,
        leafFiles
      },
      files: fileMetrics,
      directories: directories.sort((a, b) => b.totalLinesOfCode - a.totalLinesOfCode),
      network: {
        nodes: networkNodes,
        edges: networkEdges
      },
      generatedAt: new Date().toISOString()
    };

    this.cache.set(repositoryId, { result, timestamp: Date.now() });
    return result;
  }

  resolveRelativeImport(currentFilePath, relativeImport, pathToIdMap) {
    const dir = path.dirname(currentFilePath);
    let joined = path.posix.normalize(path.posix.join(dir, relativeImport));

    if (pathToIdMap.has(joined)) return joined;

    const exts = ['.tsx', '.ts', '.jsx', '.js', '.json', '/index.tsx', '/index.ts', '/index.js'];
    for (const ext of exts) {
      const candidate = `${joined}${ext}`;
      if (pathToIdMap.has(candidate)) return candidate;
    }

    if (joined.endsWith('.js')) {
      const stripped = joined.slice(0, -3);
      if (pathToIdMap.has(`${stripped}.ts`)) return `${stripped}.ts`;
      if (pathToIdMap.has(`${stripped}.tsx`)) return `${stripped}.tsx`;
    }

    return null;
  }

  categorizeFile(filePath, ext) {
    const lower = filePath.toLowerCase();
    
    if (lower.includes('test') || lower.includes('spec') || lower.endsWith('.test.ts') || lower.endsWith('.spec.ts')) {
      return 'test';
    }
    if (lower.endsWith('.md') || lower.endsWith('.txt') || lower.includes('readme') || lower.includes('license')) {
      return 'doc';
    }
    if (lower.endsWith('.css') || lower.endsWith('.scss') || lower.endsWith('.sass') || lower.includes('tailwind')) {
      return 'style';
    }
    if (
      lower.includes('config') || 
      lower.includes('package.json') || 
      lower.includes('tsconfig') || 
      lower.includes('.env') || 
      lower.includes('docker') ||
      lower.endsWith('.yml') || 
      lower.endsWith('.yaml')
    ) {
      return 'config';
    }
    if (lower.includes('schema') || lower.includes('/models/') || lower.includes('/entities/') || lower.endsWith('.prisma') || lower.endsWith('.sql')) {
      return 'model';
    }
    if (lower.includes('/routes/') || lower.includes('/controllers/') || lower.includes('/api/')) {
      return 'route';
    }
    if (lower.includes('/services/') || lower.includes('service.') || lower.includes('store.')) {
      return 'service';
    }
    if (lower.includes('/hooks/') || path.basename(lower).startsWith('use')) {
      return 'hook';
    }
    if (lower.includes('/pages/') || lower.includes('/views/') || lower.includes('/screens/') || lower.endsWith('page.tsx')) {
      return 'page';
    }
    if (lower.includes('/components/') || ['tsx', 'jsx', 'vue', 'svelte'].includes(ext)) {
      return 'component';
    }
    if (lower.includes('/utils/') || lower.includes('/helpers/') || lower.includes('/lib/')) {
      return 'util';
    }

    return 'other';
  }

  mapExtensionToName(ext) {
    const map = {
      ts: 'TypeScript',
      tsx: 'React TSX',
      js: 'JavaScript',
      jsx: 'React JSX',
      py: 'Python',
      json: 'JSON',
      css: 'CSS',
      scss: 'SCSS',
      html: 'HTML',
      sql: 'SQL',
      md: 'Markdown',
      yml: 'YAML',
      yaml: 'YAML'
    };
    return map[ext.toLowerCase()] || ext.toUpperCase();
  }
}

export const fileAnalysisService = new FileAnalysisService();
export default fileAnalysisService;
