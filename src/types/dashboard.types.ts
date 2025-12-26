export interface DashboardKPIs {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface DashboardKPIsGlobal {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface DashboardPeriod {
  month: number;
  year: number;
}

export interface ChartData {
  category: string;
  total: number;
  percentage: number;
}

export interface DashboardResponse {
  period: DashboardPeriod;
  kpis: DashboardKPIs;
  kpis_global: DashboardKPIsGlobal;
  chart_data: ChartData[];
}
