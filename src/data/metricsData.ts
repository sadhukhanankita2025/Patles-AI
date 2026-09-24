export interface ProjectGrowthDataPoint {
  date: string;
  activeProjects: number;
  newProjects: number;
  deployments: number;
  websites: number;
  fullstack: number;
  mobile: number;
}

export interface ApiUsageDataPoint {
  time: string;
  totalCalls: number;
  geminiCalls: number;
  graniteCalls: number;
  claudeCalls: number;
  gptCalls: number;
  tokensK: number;
  avgLatencyMs: number;
  successRate: number;
}

export interface MetricSummary {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
}

// 7-day data (daily resolution)
export const PROJECT_GROWTH_7D: ProjectGrowthDataPoint[] = [
  { date: 'Mon', activeProjects: 28, newProjects: 3, deployments: 18, websites: 12, fullstack: 11, mobile: 5 },
  { date: 'Tue', activeProjects: 31, newProjects: 4, deployments: 21, websites: 13, fullstack: 12, mobile: 6 },
  { date: 'Wed', activeProjects: 34, newProjects: 5, deployments: 24, websites: 14, fullstack: 14, mobile: 6 },
  { date: 'Thu', activeProjects: 36, newProjects: 4, deployments: 26, websites: 15, fullstack: 15, mobile: 6 },
  { date: 'Fri', activeProjects: 41, newProjects: 7, deployments: 29, websites: 17, fullstack: 17, mobile: 7 },
  { date: 'Sat', activeProjects: 43, newProjects: 3, deployments: 31, websites: 18, fullstack: 18, mobile: 7 },
  { date: 'Sun', activeProjects: 48, newProjects: 6, deployments: 35, websites: 20, fullstack: 20, mobile: 8 },
];

// 30-day data (aggregated by 3-day intervals)
export const PROJECT_GROWTH_30D: ProjectGrowthDataPoint[] = [
  { date: 'Sep 01', activeProjects: 14, newProjects: 2, deployments: 9, websites: 6, fullstack: 5, mobile: 3 },
  { date: 'Sep 04', activeProjects: 17, newProjects: 3, deployments: 11, websites: 7, fullstack: 7, mobile: 3 },
  { date: 'Sep 07', activeProjects: 21, newProjects: 4, deployments: 14, websites: 9, fullstack: 8, mobile: 4 },
  { date: 'Sep 10', activeProjects: 24, newProjects: 3, deployments: 16, websites: 10, fullstack: 10, mobile: 4 },
  { date: 'Sep 13', activeProjects: 28, newProjects: 5, deployments: 19, websites: 12, fullstack: 11, mobile: 5 },
  { date: 'Sep 16', activeProjects: 32, newProjects: 4, deployments: 22, websites: 13, fullstack: 14, mobile: 5 },
  { date: 'Sep 19', activeProjects: 36, newProjects: 5, deployments: 26, websites: 15, fullstack: 15, mobile: 6 },
  { date: 'Sep 22', activeProjects: 41, newProjects: 6, deployments: 30, websites: 17, fullstack: 17, mobile: 7 },
  { date: 'Sep 25', activeProjects: 45, newProjects: 5, deployments: 33, websites: 19, fullstack: 19, mobile: 7 },
  { date: 'Sep 28', activeProjects: 52, newProjects: 8, deployments: 38, websites: 22, fullstack: 21, mobile: 9 },
];

// 90-day data (bi-weekly / monthly intervals)
export const PROJECT_GROWTH_90D: ProjectGrowthDataPoint[] = [
  { date: 'Jul 15', activeProjects: 6, newProjects: 6, deployments: 4, websites: 3, fullstack: 2, mobile: 1 },
  { date: 'Aug 01', activeProjects: 12, newProjects: 8, deployments: 8, websites: 5, fullstack: 5, mobile: 2 },
  { date: 'Aug 15', activeProjects: 19, newProjects: 10, deployments: 13, websites: 8, fullstack: 8, mobile: 3 },
  { date: 'Sep 01', activeProjects: 29, newProjects: 14, deployments: 20, websites: 13, fullstack: 11, mobile: 5 },
  { date: 'Sep 15', activeProjects: 40, newProjects: 16, deployments: 28, websites: 17, fullstack: 16, mobile: 7 },
  { date: 'Sep 28', activeProjects: 52, newProjects: 19, deployments: 38, websites: 22, fullstack: 21, mobile: 9 },
];

// Recent API Usage (7 days)
export const API_USAGE_7D: ApiUsageDataPoint[] = [
  { time: 'Mon', totalCalls: 8420, geminiCalls: 4950, graniteCalls: 1820, claudeCalls: 1120, gptCalls: 530, tokensK: 5640, avgLatencyMs: 148, successRate: 99.8 },
  { time: 'Tue', totalCalls: 9810, geminiCalls: 5880, graniteCalls: 2050, claudeCalls: 1280, gptCalls: 600, tokensK: 6520, avgLatencyMs: 142, successRate: 99.9 },
  { time: 'Wed', totalCalls: 11340, geminiCalls: 7020, graniteCalls: 2310, claudeCalls: 1390, gptCalls: 620, tokensK: 7490, avgLatencyMs: 139, successRate: 99.9 },
  { time: 'Thu', totalCalls: 10920, geminiCalls: 6680, graniteCalls: 2240, claudeCalls: 1410, gptCalls: 590, tokensK: 7210, avgLatencyMs: 144, successRate: 99.7 },
  { time: 'Fri', totalCalls: 14250, geminiCalls: 8940, graniteCalls: 2890, claudeCalls: 1710, gptCalls: 710, tokensK: 9840, avgLatencyMs: 135, successRate: 99.9 },
  { time: 'Sat', totalCalls: 12800, geminiCalls: 7920, graniteCalls: 2630, claudeCalls: 1540, gptCalls: 710, tokensK: 8630, avgLatencyMs: 131, successRate: 100.0 },
  { time: 'Sun', totalCalls: 15410, geminiCalls: 9780, graniteCalls: 3120, claudeCalls: 1780, gptCalls: 730, tokensK: 10520, avgLatencyMs: 128, successRate: 99.9 },
];

// Recent API Usage (30 days - 3-day intervals)
export const API_USAGE_30D: ApiUsageDataPoint[] = [
  { time: 'Sep 01', totalCalls: 5200, geminiCalls: 2900, graniteCalls: 1200, claudeCalls: 750, gptCalls: 350, tokensK: 3420, avgLatencyMs: 165, successRate: 99.5 },
  { time: 'Sep 04', totalCalls: 6150, geminiCalls: 3500, graniteCalls: 1400, claudeCalls: 850, gptCalls: 400, tokensK: 4100, avgLatencyMs: 158, successRate: 99.7 },
  { time: 'Sep 07', totalCalls: 7400, geminiCalls: 4300, graniteCalls: 1650, claudeCalls: 980, gptCalls: 470, tokensK: 4950, avgLatencyMs: 152, successRate: 99.8 },
  { time: 'Sep 10', totalCalls: 8650, geminiCalls: 5100, graniteCalls: 1900, claudeCalls: 1120, gptCalls: 530, tokensK: 5800, avgLatencyMs: 146, successRate: 99.8 },
  { time: 'Sep 13', totalCalls: 9920, geminiCalls: 5950, graniteCalls: 2150, claudeCalls: 1260, gptCalls: 560, tokensK: 6680, avgLatencyMs: 142, successRate: 99.9 },
  { time: 'Sep 16', totalCalls: 11200, geminiCalls: 6850, graniteCalls: 2380, claudeCalls: 1390, gptCalls: 580, tokensK: 7550, avgLatencyMs: 140, successRate: 99.8 },
  { time: 'Sep 19', totalCalls: 12450, geminiCalls: 7700, graniteCalls: 2620, claudeCalls: 1520, gptCalls: 610, tokensK: 8400, avgLatencyMs: 137, successRate: 99.9 },
  { time: 'Sep 22', totalCalls: 13800, geminiCalls: 8600, graniteCalls: 2880, claudeCalls: 1650, gptCalls: 670, tokensK: 9350, avgLatencyMs: 134, successRate: 99.9 },
  { time: 'Sep 25', totalCalls: 14600, geminiCalls: 9150, graniteCalls: 3040, claudeCalls: 1720, gptCalls: 690, tokensK: 9920, avgLatencyMs: 130, successRate: 99.9 },
  { time: 'Sep 28', totalCalls: 16200, geminiCalls: 10300, graniteCalls: 3350, claudeCalls: 1840, gptCalls: 710, tokensK: 11100, avgLatencyMs: 126, successRate: 100.0 },
];

// Recent API Usage (90 days - bi-weekly)
export const API_USAGE_90D: ApiUsageDataPoint[] = [
  { time: 'Jul 15', totalCalls: 2400, geminiCalls: 1200, graniteCalls: 650, claudeCalls: 380, gptCalls: 170, tokensK: 1520, avgLatencyMs: 182, successRate: 99.4 },
  { time: 'Aug 01', totalCalls: 4100, geminiCalls: 2200, graniteCalls: 1050, claudeCalls: 580, gptCalls: 270, tokensK: 2750, avgLatencyMs: 170, successRate: 99.6 },
  { time: 'Aug 15', totalCalls: 6800, geminiCalls: 3850, graniteCalls: 1580, claudeCalls: 920, gptCalls: 450, tokensK: 4520, avgLatencyMs: 156, successRate: 99.7 },
  { time: 'Sep 01', totalCalls: 9900, geminiCalls: 5950, graniteCalls: 2180, claudeCalls: 1240, gptCalls: 530, tokensK: 6680, avgLatencyMs: 142, successRate: 99.9 },
  { time: 'Sep 15', totalCalls: 13100, geminiCalls: 8150, graniteCalls: 2750, claudeCalls: 1580, gptCalls: 620, tokensK: 8900, avgLatencyMs: 134, successRate: 99.9 },
  { time: 'Sep 28', totalCalls: 16200, geminiCalls: 10300, graniteCalls: 3350, claudeCalls: 1840, gptCalls: 710, tokensK: 11100, avgLatencyMs: 126, successRate: 100.0 },
];

export const METRICS_SUMMARY: MetricSummary[] = [
  {
    label: 'Active Projects',
    value: '52 Repos',
    change: '+38.5%',
    isPositive: true,
    subtext: 'vs previous 30 days'
  },
  {
    label: 'API Request Rate',
    value: '16.2K / day',
    change: '+46.2%',
    isPositive: true,
    subtext: 'peak synthesis velocity'
  },
  {
    label: 'Tokens Generated',
    value: '55.8M',
    change: '+52.1%',
    isPositive: true,
    subtext: 'full-stack & test code'
  },
  {
    label: 'Avg Model Latency',
    value: '126 ms',
    change: '-21.8%',
    isPositive: true,
    subtext: 'Gemini 3.8 Flash optimized'
  }
];
