export interface PerformanceMetric {
  id: string
  name: string
  value: number
  previousValue?: number
  unit: string
  type: 'revenue' | 'volume' | 'weight' | 'count' | 'percentage' | 'time'
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
  category: 'financial' | 'operational' | 'customer' | 'efficiency'
  description?: string
  target?: number
  isKPI: boolean
  lastUpdated: Date
}

export interface PerformanceFilter {
  dateRange: {
    start: Date
    end: Date
    preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  }
  transportModes?: string[]
  regions?: string[]
  companies?: string[]
  clients?: string[]
  status?: string[]
  minValue?: number
  maxValue?: number
}

export interface PerformanceComparison {
  current: PerformanceMetric[]
  previous: PerformanceMetric[]
  comparison: {
    metricId: string
    change: number
    changePercentage: number
    significance: 'high' | 'medium' | 'low'
  }[]
}

export interface PerformanceForecast {
  metricId: string
  predictions: {
    date: Date
    value: number
    confidence: number
  }[]
  accuracy: number
  model: 'linear' | 'exponential' | 'seasonal' | 'ml'
}

export interface PerformanceAlert {
  id: string
  metricId: string
  type: 'threshold' | 'trend' | 'anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  threshold?: number
  currentValue: number
  triggered: Date
  acknowledged: boolean
  resolved: boolean
}

export interface PerformanceDashboard {
  id: string
  name: string
  description?: string
  layout: {
    widgets: PerformanceWidget[]
    columns: number
    rows: number
  }
  filters: PerformanceFilter
  isDefault: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PerformanceWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'heatmap' | 'map'
  title: string
  metricIds: string[]
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar'
  position: { x: number; y: number; width: number; height: number }
  config: {
    showTrend?: boolean
    showTarget?: boolean
    showComparison?: boolean
    aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count'
    groupBy?: string
    colors?: string[]
  }
}

export interface PerformanceReport {
  id: string
  name: string
  description?: string
  type: 'scheduled' | 'on-demand'
  format: 'pdf' | 'excel' | 'csv' | 'json'
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    time: string
    recipients: string[]
  }
  template: {
    sections: ReportSection[]
    styling: {
      theme: 'light' | 'dark' | 'corporate'
      colors: string[]
      logo?: string
    }
  }
  lastGenerated?: Date
  status: 'active' | 'paused' | 'draft'
}

export interface ReportSection {
  id: string
  type: 'summary' | 'metrics' | 'charts' | 'table' | 'text'
  title: string
  content: {
    metricIds?: string[]
    chartType?: string
    text?: string
    columns?: string[]
  }
  order: number
}

export interface PerformanceGoal {
  id: string
  name: string
  description?: string
  metricId: string
  targetValue: number
  targetDate: Date
  currentValue: number
  progress: number
  status: 'on-track' | 'at-risk' | 'behind' | 'achieved'
  milestones: {
    date: Date
    value: number
    achieved: boolean
  }[]
  createdBy: string
  createdAt: Date
}

export interface PerformanceAnalysis {
  id: string
  type: 'correlation' | 'regression' | 'clustering' | 'anomaly'
  metricIds: string[]
  results: {
    insights: string[]
    recommendations: string[]
    confidence: number
    data: any
  }
  parameters: Record<string, any>
  createdAt: Date
}

export interface PerformanceExport {
  id: string
  type: 'data' | 'report' | 'dashboard'
  format: 'pdf' | 'excel' | 'csv' | 'png' | 'svg'
  filters: PerformanceFilter
  status: 'pending' | 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  createdAt: Date
  expiresAt: Date
}
