export interface Metric {
  projectId: string;
  totalDeploys: number;
  successRate: number;
  avgBuildTime: number;
  deploysToday: number;
}

export interface MetricOverview {
  totalDeploys: number;
  successRate: number;
  avgBuildTime: number;
  deploysToday: number;
  byEnvironment: Record<string, number>;
  byStatus: Record<string, number>;
}
