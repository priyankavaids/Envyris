import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatrixRow {
  parameter: string;
  gradeA: { risk: string; product: string; gmp: string };
  gradeB: { risk: string; product: string; gmp: string };
  gradeC: { risk: string; product: string; gmp: string };
  gradeD: { risk: string; product: string; gmp: string };
}

const matrixData: MatrixRow[] = [
  {
    parameter: 'Temperature',
    gradeA: { risk: 'High', product: 'API degradation, sterility', gmp: 'Annex 1, 21 CFR 211' },
    gradeB: { risk: 'Medium', product: 'Preparation quality', gmp: 'EU GMP Annex 1' },
    gradeC: { risk: 'Low', product: 'Material stability', gmp: 'General GMP' },
    gradeD: { risk: 'Low', product: 'Storage conditions', gmp: 'General GMP' },
  },
  {
    parameter: 'Humidity',
    gradeA: { risk: 'High', product: 'Lyophilization, stability', gmp: 'Annex 1' },
    gradeB: { risk: 'Medium', product: 'Component integrity', gmp: 'EU GMP' },
    gradeC: { risk: 'Low', product: 'Material handling', gmp: 'General GMP' },
    gradeD: { risk: 'Low', product: 'Storage', gmp: 'General GMP' },
  },
  {
    parameter: 'Differential Pressure',
    gradeA: { risk: 'Critical', product: 'Contamination cascade', gmp: 'Annex 1 (≥10 Pa)' },
    gradeB: { risk: 'High', product: 'Cross-contamination', gmp: 'Annex 1 (≥5 Pa)' },
    gradeC: { risk: 'Medium', product: 'Airflow control', gmp: 'EU GMP' },
    gradeD: { risk: 'Low', product: 'Basic containment', gmp: 'General GMP' },
  },
  {
    parameter: 'Particles ≥0.5µm',
    gradeA: { risk: 'Critical', product: 'Particulate contamination', gmp: '≤3,520/m³ at rest' },
    gradeB: { risk: 'High', product: 'Background quality', gmp: '≤352,000/m³' },
    gradeC: { risk: 'Medium', product: 'Component prep', gmp: '≤3,520,000/m³' },
    gradeD: { risk: 'Low', product: 'General handling', gmp: 'Not classified' },
  },
  {
    parameter: 'Microbiology',
    gradeA: { risk: 'Critical', product: 'Sterility assurance', gmp: '<1 CFU/m³' },
    gradeB: { risk: 'High', product: 'Bioburden control', gmp: '≤10 CFU/m³' },
    gradeC: { risk: 'Medium', product: 'Environmental control', gmp: '≤100 CFU/m³' },
    gradeD: { risk: 'Low', product: 'Baseline monitoring', gmp: '≤200 CFU/m³' },
  },
];

const riskColors = {
  Critical: { bg: 'bg-danger/20', text: 'text-danger', icon: AlertTriangle },
  High: { bg: 'bg-warning/20', text: 'text-warning', icon: AlertCircle },
  Medium: { bg: 'bg-info/20', text: 'text-info', icon: AlertCircle },
  Low: { bg: 'bg-success/20', text: 'text-success', icon: CheckCircle },
};

export const CriticalParameterMatrix = () => {
  const grades = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className="bg-card border border-border rounded-xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-foreground">Critical Parameter Risk Matrix</h3>
        </div>
        <span className="text-xs text-muted-foreground">GMP Reference: Annex 1, 21 CFR Part 211</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">Parameter</th>
              {grades.map(grade => (
                <th key={grade} className="text-center py-3 px-2">
                  <span className={cn(
                    'px-3 py-1 rounded text-sm font-bold',
                    grade === 'A' && 'bg-primary/20 text-primary',
                    grade === 'B' && 'bg-info/20 text-info',
                    grade === 'C' && 'bg-warning/20 text-warning',
                    grade === 'D' && 'bg-muted text-muted-foreground'
                  )}>
                    Grade {grade}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixData.map((row, idx) => (
              <tr key={row.parameter} className={cn(
                'border-b border-border/50',
                idx % 2 === 0 && 'bg-secondary/20'
              )}>
                <td className="py-3 px-2 font-medium text-foreground">{row.parameter}</td>
                {grades.map(grade => {
                  const data = row[`grade${grade}` as keyof MatrixRow] as { risk: string; product: string; gmp: string };
                  const riskConfig = riskColors[data.risk as keyof typeof riskColors];
                  const RiskIcon = riskConfig.icon;

                  return (
                    <td key={grade} className="py-3 px-2">
                      <div className="flex flex-col gap-1">
                        <div className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold w-fit',
                          riskConfig.bg,
                          riskConfig.text
                        )}>
                          <RiskIcon className="w-3 h-3" />
                          {data.risk}
                        </div>
                        <span className="text-xs text-muted-foreground">{data.product}</span>
                        <span className="text-xs text-muted-foreground/70 font-mono">{data.gmp}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
