import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BusinessData, BusinessEntry, BusinessMetrics } from '@/types/business';
import { Building2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BusinessCardProps {
  business: BusinessData;
  currentEntry: BusinessEntry;
  metrics: BusinessMetrics;
  onUpdateEntry: (updates: Partial<BusinessEntry>) => void;
}

export function BusinessCard({ business, currentEntry, metrics, onUpdateEntry }: BusinessCardProps) {
  const getStatusColor = () => {
    switch (metrics.healthStatus) {
      case 'excellent': return 'bg-status-success text-white';
      case 'good': return 'bg-status-success/70 text-white';
      case 'warning': return 'bg-status-warning text-black';
      case 'critical': return 'bg-status-danger text-white';
    }
  };

  const getBusinessColorClass = () => {
    return `bg-business-${business.color}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: keyof BusinessEntry, value: string | number) => {
    onUpdateEntry({ [field]: value });
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-border transition-all duration-normal group animate-slide-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getBusinessColorClass()}`} />
            <span className="text-lg">{business.name}</span>
          </div>
          <Badge className={`${getStatusColor()} font-medium`}>
            {metrics.healthStatus.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-surface-elevated rounded-lg border border-border/30">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Profit</p>
            <p className={`text-sm font-bold ${business.totalNetProfit >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
              {formatCurrency(business.totalNetProfit)}
            </p>
            <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${business.totalNetProfit >= 0 ? 'bg-status-success' : 'bg-status-danger'}`} />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Growth</p>
            <div className="flex items-center justify-center gap-1">
              {metrics.weeklyGrowth > 0 ? (
                <TrendingUp className="h-3 w-3 text-status-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-status-danger" />
              )}
              <p className={`text-sm font-bold ${metrics.weeklyGrowth >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
                {metrics.weeklyGrowth.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">MTD</p>
            <p className="text-sm font-bold text-foreground">
              {formatCurrency(metrics.monthToDate)}
            </p>
            <Badge variant="outline" className="text-xs mt-1 bg-surface">
              {metrics.healthStatus}
            </Badge>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${business.id}-date`} className="text-sm text-muted-foreground">Date</Label>
            <Input
              id={`${business.id}-date`}
              type="date"
              value={currentEntry.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="bg-surface border-border/50 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${business.id}-revenue`} className="text-sm text-muted-foreground">Revenue ($)</Label>
            <Input
              id={`${business.id}-revenue`}
              type="number"
              value={currentEntry.revenue || ''}
              onChange={(e) => handleInputChange('revenue', parseFloat(e.target.value) || 0)}
              className="bg-surface border-border/50 focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${business.id}-salaries`} className="text-sm text-muted-foreground">Salaries ($)</Label>
            <Input
              id={`${business.id}-salaries`}
              type="number"
              value={currentEntry.salaries || ''}
              onChange={(e) => handleInputChange('salaries', parseFloat(e.target.value) || 0)}
              className="bg-surface border-border/50 focus:border-primary"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${business.id}-expenses`} className="text-sm text-muted-foreground">Expenses ($)</Label>
            <Input
              id={`${business.id}-expenses`}
              type="number"
              value={currentEntry.expenses || ''}
              onChange={(e) => handleInputChange('expenses', parseFloat(e.target.value) || 0)}
              className="bg-surface border-border/50 focus:border-primary"
              placeholder="0"
            />
          </div>
        </div>

        {/* Business-specific fields */}
        {business.id === 'iclean' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${business.id}-clients`} className="text-sm text-muted-foreground">Clients</Label>
              <Input
                id={`${business.id}-clients`}
                type="number"
                value={currentEntry.clients || ''}
                onChange={(e) => handleInputChange('clients', parseFloat(e.target.value) || 0)}
                className="bg-surface border-border/50 focus:border-primary"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${business.id}-hours`} className="text-sm text-muted-foreground">Staff Hours</Label>
              <Input
                id={`${business.id}-hours`}
                type="number"
                value={currentEntry.hours || ''}
                onChange={(e) => handleInputChange('hours', parseFloat(e.target.value) || 0)}
                className="bg-surface border-border/50 focus:border-primary"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {(business.id === 'icandy' || business.id === 'apl') && (
          <div className="grid grid-cols-2 gap-4">
            {business.id === 'icandy' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor={`${business.id}-clients`} className="text-sm text-muted-foreground">Clients</Label>
                  <Input
                    id={`${business.id}-clients`}
                    type="number"
                    value={currentEntry.clients || ''}
                    onChange={(e) => handleInputChange('clients', parseFloat(e.target.value) || 0)}
                    className="bg-surface border-border/50 focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${business.id}-hours`} className="text-sm text-muted-foreground">Staff Hours</Label>
                  <Input
                    id={`${business.id}-hours`}
                    type="number"
                    value={currentEntry.hours || ''}
                    onChange={(e) => handleInputChange('hours', parseFloat(e.target.value) || 0)}
                    className="bg-surface border-border/50 focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </>
            )}
            {business.id === 'apl' && (
              <div className="space-y-2">
                <Label htmlFor={`${business.id}-items`} className="text-sm text-muted-foreground">Items Purchased</Label>
                <Input
                  id={`${business.id}-items`}
                  type="text"
                  value={currentEntry.items || ''}
                  onChange={(e) => handleInputChange('items', e.target.value)}
                  className="bg-surface border-border/50 focus:border-primary"
                  placeholder="Item list"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor={`${business.id}-investor`} className="text-sm text-muted-foreground">Investor Funds ($)</Label>
              <Input
                id={`${business.id}-investor`}
                type="number"
                value={currentEntry.investor || ''}
                onChange={(e) => handleInputChange('investor', parseFloat(e.target.value) || 0)}
                className="bg-surface border-border/50 focus:border-primary"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {business.id === 'apmg' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${business.id}-video`} className="text-sm text-muted-foreground">Video Costs ($)</Label>
              <Input
                id={`${business.id}-video`}
                type="number"
                value={currentEntry.video || ''}
                onChange={(e) => handleInputChange('video', parseFloat(e.target.value) || 0)}
                className="bg-surface border-border/50 focus:border-primary"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${business.id}-promotion`} className="text-sm text-muted-foreground">Promotion Costs ($)</Label>
              <Input
                id={`${business.id}-promotion`}
                type="number"
                value={currentEntry.promotion || ''}
                onChange={(e) => handleInputChange('promotion', parseFloat(e.target.value) || 0)}
                className="bg-surface border-border/50 focus:border-primary"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {business.id === 'instafund' && (
          <div className="space-y-2">
            <Label htmlFor={`${business.id}-transactions`} className="text-sm text-muted-foreground">Transactions</Label>
            <Input
              id={`${business.id}-transactions`}
              type="number"
              value={currentEntry.transactions || ''}
              onChange={(e) => handleInputChange('transactions', parseFloat(e.target.value) || 0)}
              className="bg-surface border-border/50 focus:border-primary"
              placeholder="0"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`${business.id}-notes`} className="text-sm text-muted-foreground">Notes</Label>
          <Textarea
            id={`${business.id}-notes`}
            value={currentEntry.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="bg-surface border-border/50 focus:border-primary min-h-[80px] resize-none"
            placeholder="Business notes and insights..."
          />
        </div>
      </CardContent>
    </Card>
  );
}