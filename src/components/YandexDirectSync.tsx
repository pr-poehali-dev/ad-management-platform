import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { yandexDirectAPI, YandexCampaign } from '@/lib/yandex-direct-api';
import { useToast } from '@/hooks/use-toast';

export const YandexDirectSync = () => {
  const [campaigns, setCampaigns] = useState<YandexCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await yandexDirectAPI.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить кампании',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const syncCampaigns = async () => {
    setSyncing(true);
    try {
      const result = await yandexDirectAPI.syncCampaigns();
      if (result.success) {
        setCampaigns(result.campaigns);
        setLastSync(new Date());
        toast({
          title: 'Синхронизация завершена',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка синхронизации',
        description: 'Не удалось синхронизировать данные',
        variant: 'destructive'
      });
    } finally {
      setSyncing(false);
    }
  };

  const toggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'active') {
        await yandexDirectAPI.pauseCampaign(campaignId);
        toast({ title: 'Кампания приостановлена' });
      } else {
        await yandexDirectAPI.resumeCampaign(campaignId);
        toast({ title: 'Кампания возобновлена' });
      }
      await loadCampaigns();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус кампании',
        variant: 'destructive'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `₽${Math.round(amount).toLocaleString('ru-RU')}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center justify-center gap-3">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-muted-foreground">Загрузка кампаний...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Яндекс Директ</h3>
              <p className="text-sm text-muted-foreground">
                {campaigns.length} активных кампаний
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastSync && (
              <span className="text-xs text-muted-foreground">
                Обновлено: {lastSync.toLocaleTimeString('ru-RU')}
              </span>
            )}
            <Button 
              onClick={syncCampaigns} 
              disabled={syncing}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              {syncing ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Синхронизация...
                </>
              ) : (
                <>
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Синхронизировать
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-card/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Потрачено</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0))}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Конверсий</p>
            <p className="text-xl font-bold text-foreground">
              {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Кликов</p>
            <p className="text-xl font-bold text-foreground">
              {campaigns.reduce((sum, c) => sum + c.clicks, 0).toLocaleString('ru-RU')}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Показов</p>
            <p className="text-xl font-bold text-foreground">
              {campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString('ru-RU')}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-foreground">{campaign.name}</h4>
                  <Badge 
                    variant={campaign.status === 'active' ? 'default' : 'secondary'}
                    className={campaign.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }
                  >
                    {campaign.status === 'active' ? 'Активна' : 'Приостановлена'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">ID: {campaign.id}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
              >
                <Icon 
                  name={campaign.status === 'active' ? 'Pause' : 'Play'} 
                  size={14} 
                  className="mr-2" 
                />
                {campaign.status === 'active' ? 'Остановить' : 'Запустить'}
              </Button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Бюджет</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                </span>
              </div>
              <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <div className="p-3 rounded-lg bg-muted/20 border border-border">
                <p className="text-xs text-muted-foreground mb-1">CPL</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(campaign.cpl)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border">
                <p className="text-xs text-muted-foreground mb-1">CR</p>
                <p className="text-sm font-semibold text-green-400">
                  {formatPercent(campaign.cr)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border">
                <p className="text-xs text-muted-foreground mb-1">ROAS</p>
                <p className="text-sm font-semibold text-primary">
                  {campaign.roas.toFixed(1)}x
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border">
                <p className="text-xs text-muted-foreground mb-1">CTR</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatPercent(campaign.ctr)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border">
                <p className="text-xs text-muted-foreground mb-1">CPC</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(campaign.cpc)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Конверсии</p>
                <p className="text-sm font-semibold text-secondary">
                  {campaign.conversions}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
