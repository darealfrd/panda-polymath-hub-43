import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import { OverallHealth } from '@/types/business';
import { PortfolioGraph } from './PortfolioGraph';

interface OverviewCardProps {
  health: OverallHealth;
}

export function OverviewCard({ health }: OverviewCardProps) {
  const getTrendIcon = () => {
    switch (health.trend) {
      case 'up':
        return <TrendingUp className="h-6 w-6 text-status-success animate-bounce-subtle" />;
      case 'down':
        return <TrendingDown className="h-6 w-6 text-status-danger animate-bounce-subtle" />;
      default:
        return <Minus className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getHealthColor = () => {
    if (health.healthScore >= 80) return 'text-status-success';
    if (health.healthScore >= 60) return 'text-status-warning';
    return 'text-status-danger';
  };

  const getHealthStatus = () => {
    if (health.healthScore >= 80) return 'EXCELLENT';
    if (health.healthScore >= 60) return 'GOOD';
    if (health.healthScore >= 40) return 'WARNING';
    return 'CRITICAL';
  };

  const getHealthBadgeColor = () => {
    if (health.healthScore >= 80) return 'bg-status-success text-white';
    if (health.healthScore >= 60) return 'bg-status-warning text-black';
    return 'bg-status-danger text-white';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-card border-border/50 animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-xl">
          <span className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Portfolio Overview
          </span>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Graph */}
        <div className="mb-6">
          <h3 className="text-sm text-muted-foreground mb-3">Portfolio Performance</h3>
          <PortfolioGraph health={health} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(health.totalRevenue)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <p className={`text-2xl font-bold ${health.totalNetProfit >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
              {formatCurrency(health.totalNetProfit)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className={`text-xl font-semibold ${health.profitMargin >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
              {health.profitMargin.toFixed(1)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Health Score</p>
            <div className="flex items-center gap-2">
              <p className={`text-xl font-semibold ${getHealthColor()}`}>
                {health.healthScore.toFixed(0)}/100
              </p>
              <Badge className={`${getHealthBadgeColor()} text-xs`}>
                {getHealthStatus()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Health Score Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Business Health</span>
            <span>{health.healthScore.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-slow ease-out ${
                health.healthScore >= 80 ? 'bg-gradient-success' :
                health.healthScore >= 60 ? 'bg-gradient-danger' : 'bg-gradient-danger'
              }`}
              style={{ width: `${health.healthScore}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}