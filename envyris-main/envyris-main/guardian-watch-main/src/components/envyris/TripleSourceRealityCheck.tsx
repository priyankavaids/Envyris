import { useState } from 'react';
import { Cpu, Monitor, User, RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface SourceReading {
  sensor: number;
  ddu: number;
  manual: number;
}

interface TimeSeriesPoint {
  time: string;
  sensor: number;
  ddu: number;
  manual: number;
  alignmentScore: number;
}

const parameters = [
  { id: 'temperature', label: 'Temperature', unit: '°C', min: 18, max: 25, target: 21 },
  { id: 'humidity', label: 'Relative Humidity', unit: '%RH', min: 30, max: 65, target: 45 },
  { id: 'pressure', label: 'Differential Pressure', unit: 'Pa', min: 10, max: 30, target: 20 },
  { id: 'particles', label: 'Particle Count', unit: '/m³', min: 0, max: 3520, target: 1000 },
];

const generateTimeSeriesData = (readings: SourceReading, points: number = 24): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  const baseTime = new Date();
  baseTime.setHours(baseTime.getHours() - points);

  for (let i = 0; i < points; i++) {
    const time = new Date(baseTime);
    time.setHours(time.getHours() + i);
    
    const variance = () => (Math.random() - 0.5) * 2;
    const sensorVal = readings.sensor + variance();
    const dduVal = readings.ddu + variance();
    const manualVal = readings.manual + variance() * 0.5;
    
    const values = [sensorVal, dduVal, manualVal];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const maxDev = Math.max(...values.map(v => Math.abs(v - avg)));
    const alignmentScore = Math.max(0, 100 - (maxDev * 10));

    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sensor: parseFloat(sensorVal.toFixed(2)),
      ddu: parseFloat(dduVal.toFixed(2)),
      manual: parseFloat(manualVal.toFixed(2)),
      alignmentScore: parseFloat(alignmentScore.toFixed(1)),
    });
  }
  return data;
};

const calculateAlignmentScore = (readings: SourceReading): number => {
  const values = [readings.sensor, readings.ddu, readings.manual];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const maxDeviation = Math.max(...values.map(v => Math.abs(v - avg)));
  const percentDeviation = (maxDeviation / avg) * 100;
  return Math.max(0, Math.min(100, 100 - percentDeviation * 5));
};

const getAlignmentStatus = (score: number) => {
  if (score >= 90) return { status: 'aligned', color: 'text-success', bg: 'bg-success/20', label: 'Sources Aligned' };
  if (score >= 70) return { status: 'minor', color: 'text-warning', bg: 'bg-warning/20', label: 'Minor Deviation' };
  return { status: 'mismatch', color: 'text-danger', bg: 'bg-danger/20', label: 'Source Mismatch' };
};

export const TripleSourceRealityCheck = () => {
  const [selectedParameter, setSelectedParameter] = useState(parameters[0].id);
  const [readings, setReadings] = useState<SourceReading>({
    sensor: 21.2,
    ddu: 21.0,
    manual: 21.1,
  });
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesPoint[]>(() => 
    generateTimeSeriesData(readings)
  );

  const currentParam = parameters.find(p => p.id === selectedParameter)!;
  const alignmentScore = calculateAlignmentScore(readings);
  const alignmentStatus = getAlignmentStatus(alignmentScore);

  const handleInputChange = (source: keyof SourceReading, value: string) => {
    const numValue = parseFloat(value) || 0;
    setReadings(prev => ({ ...prev, [source]: numValue }));
  };

  const handleAnalyze = () => {
    setTimeSeriesData(generateTimeSeriesData(readings));
  };

  const radarData = [
    { metric: 'Sensor Accuracy', value: Math.min(100, 100 - Math.abs(readings.sensor - currentParam.target) * 5) },
    { metric: 'DDU Accuracy', value: Math.min(100, 100 - Math.abs(readings.ddu - currentParam.target) * 5) },
    { metric: 'Manual Accuracy', value: Math.min(100, 100 - Math.abs(readings.manual - currentParam.target) * 5) },
    { metric: 'Cross-Validation', value: alignmentScore },
    { metric: 'Stability', value: 85 + Math.random() * 10 },
    { metric: 'Confidence', value: alignmentScore * 0.9 + 10 },
  ];

  const deviationData = [
    { source: 'Sensor', value: readings.sensor, deviation: readings.sensor - currentParam.target },
    { source: 'DDU', value: readings.ddu, deviation: readings.ddu - currentParam.target },
    { source: 'Manual', value: readings.manual, deviation: readings.manual - currentParam.target },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Triple Source Reality Check Engine</h1>
          <p className="text-muted-foreground mt-1">Cross-validate environmental readings from multiple sources</p>
        </div>
        <Button onClick={handleAnalyze} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Analyze
        </Button>
      </div>

      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Input Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Parameter Selection */}
            <div className="space-y-2">
              <Label>Parameter Type</Label>
              <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parameters.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label} ({p.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sensor Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-info" />
                Sensor Reading
              </Label>
              <Input
                type="number"
                step="0.1"
                value={readings.sensor}
                onChange={(e) => handleInputChange('sensor', e.target.value)}
                className="font-mono"
              />
            </div>

            {/* DDU Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-warning" />
                DDU Reading
              </Label>
              <Input
                type="number"
                step="0.1"
                value={readings.ddu}
                onChange={(e) => handleInputChange('ddu', e.target.value)}
                className="font-mono"
              />
            </div>

            {/* Manual Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4 text-success" />
                Manual Reading
              </Label>
              <Input
                type="number"
                step="0.1"
                value={readings.manual}
                onChange={(e) => handleInputChange('manual', e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          {/* Alignment Score Display */}
          <div className={cn('mt-6 p-4 rounded-lg flex items-center justify-between', alignmentStatus.bg)}>
            <div className="flex items-center gap-3">
              {alignmentScore >= 90 ? (
                <CheckCircle className={cn('w-6 h-6', alignmentStatus.color)} />
              ) : (
                <AlertTriangle className={cn('w-6 h-6', alignmentStatus.color)} />
              )}
              <div>
                <p className={cn('font-semibold', alignmentStatus.color)}>{alignmentStatus.label}</p>
                <p className="text-sm text-muted-foreground">
                  Target: {currentParam.target} {currentParam.unit} | Range: {currentParam.min}-{currentParam.max} {currentParam.unit}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn('text-3xl font-bold font-mono', alignmentStatus.color)}>
                {alignmentScore.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Alignment Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Triple Source Time Series</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <ReferenceLine y={currentParam.target} stroke="hsl(var(--primary))" strokeDasharray="5 5" label="Target" />
                <Line type="monotone" dataKey="sensor" stroke="hsl(var(--info))" strokeWidth={2} dot={false} name="Sensor" />
                <Line type="monotone" dataKey="ddu" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} name="DDU" />
                <Line type="monotone" dataKey="manual" stroke="hsl(var(--success))" strokeWidth={2} dot={false} name="Manual" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Reality Confidence Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Radar
                  name="Confidence"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deviation Bar Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Source Deviation from Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={deviationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="source" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <ReferenceLine x={0} stroke="hsl(var(--primary))" />
                <Bar dataKey="deviation" fill="hsl(var(--info))" name="Deviation" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alignment Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Alignment Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <ReferenceLine y={90} stroke="hsl(var(--success))" strokeDasharray="3 3" label="Aligned" />
                <ReferenceLine y={70} stroke="hsl(var(--warning))" strokeDasharray="3 3" label="Warning" />
                <Area
                  type="monotone"
                  dataKey="alignmentScore"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  name="Alignment %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Source Comparison Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Source Comparison Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Source</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Value</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Target</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Deviation</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { icon: Cpu, label: 'Sensor', value: readings.sensor, color: 'text-info' },
                  { icon: Monitor, label: 'DDU', value: readings.ddu, color: 'text-warning' },
                  { icon: User, label: 'Manual', value: readings.manual, color: 'text-success' },
                ].map(source => {
                  const deviation = source.value - currentParam.target;
                  const isWithinRange = source.value >= currentParam.min && source.value <= currentParam.max;
                  return (
                    <tr key={source.label} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <source.icon className={cn('w-4 h-4', source.color)} />
                          <span className="font-medium">{source.label}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-mono">
                        {source.value.toFixed(2)} {currentParam.unit}
                      </td>
                      <td className="text-right py-3 px-4 font-mono text-muted-foreground">
                        {currentParam.target} {currentParam.unit}
                      </td>
                      <td className={cn(
                        'text-right py-3 px-4 font-mono',
                        deviation > 0 ? 'text-warning' : deviation < 0 ? 'text-info' : 'text-success'
                      )}>
                        {deviation > 0 ? '+' : ''}{deviation.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          isWithinRange ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                        )}>
                          {isWithinRange ? 'In Range' : 'Out of Range'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
