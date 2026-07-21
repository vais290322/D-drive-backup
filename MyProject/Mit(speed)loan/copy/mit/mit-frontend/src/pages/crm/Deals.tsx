import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, DollarSign, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getDeals, updateDeal } from '@/db/crmApi';
import type { DealWithRelations } from '@/types/types';
import { formatCurrency } from '@/lib/currency';

const DEAL_STAGES = [
  { value: 'lead', label: 'Lead', color: 'bg-muted' },
  { value: 'qualified', label: 'Qualified', color: 'bg-chart-3' },
  { value: 'proposal', label: 'Proposal', color: 'bg-chart-4' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-chart-5' },
  { value: 'won', label: 'Won', color: 'bg-success' },
  { value: 'lost', label: 'Lost', color: 'bg-destructive' },
];

export default function Deals() {
  const [deals, setDeals] = useState<DealWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await getDeals();
      setDeals(data);
    } catch (error) {
      console.error('Error loading deals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDealsByStage = (stage: string) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getTotalValue = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + Number(deal.value), 0);
  };

  const handleStageChange = async (dealId: string, newStage: string) => {
    try {
      await updateDeal(dealId, { stage: newStage });
      toast({
        title: 'Success',
        description: 'Deal stage updated',
      });
      loadDeals();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update deal stage',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-destructive',
      medium: 'bg-chart-4',
      low: 'bg-muted',
    };
    return colors[priority] || 'bg-muted';
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground mt-1">Loading deals...</p>
        </div>
      </div>
    );
  }

  const activeDeals = deals.filter((d) => !['won', 'lost'].includes(d.stage));
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + Number(d.value), 0);
  const wonDeals = deals.filter((d) => d.stage === 'won');
  const totalRevenue = wonDeals.reduce((sum, d) => sum + Number(d.value), 0);

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl xl:text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground mt-1">Track and manage your deals</p>
        </div>
        <Link to="/crm/deals/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deals
            </CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl xl:text-3xl font-bold">{deals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pipeline Value
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl xl:text-3xl font-bold">
              {formatCurrency(totalPipelineValue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl xl:text-3xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DEAL_STAGES.map((stage) => {
          const stageDeals = getDealsByStage(stage.value);
          const stageValue = getTotalValue(stage.value);

          return (
            <Card key={stage.value} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{stage.label}</CardTitle>
                  <Badge className={stage.color}>{stageDeals.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(stageValue)}
                </p>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {stageDeals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No deals in this stage
                  </p>
                ) : (
                  stageDeals.map((deal) => (
                    <Card key={deal.id} className="p-4 hover:shadow-md transition-shadow">
                      <Link to={`/crm/deals/${deal.id}`}>
                        <h4 className="font-semibold hover:text-primary mb-2">
                          {deal.title}
                        </h4>
                      </Link>
                      <div className="space-y-2 text-sm">
                        {deal.company && (
                          <p className="text-muted-foreground">{deal.company.name}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-success">
                            {formatCurrency(Number(deal.value))}
                          </span>
                          <Badge className={getPriorityColor(deal.priority)}>
                            {deal.priority}
                          </Badge>
                        </div>
                        {deal.expected_close_date && (
                          <p className="text-xs text-muted-foreground">
                            Close: {new Date(deal.expected_close_date).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex gap-1 flex-wrap mt-2">
                          {DEAL_STAGES.filter((s) => s.value !== deal.stage).map((s, index) => (
                            <Button
                              key={s.value}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleStageChange(deal.id, s.value)}
                            >
                              → {s.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

