export interface YandexCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
  cpl: number;
  cr: number;
  roas: number;
}

export interface YandexStats {
  period: string;
  campaigns: YandexCampaign[];
  totalSpent: number;
  totalConversions: number;
  avgCPL: number;
  avgCR: number;
  avgROAS: number;
}

const mockCampaigns: YandexCampaign[] = [
  {
    id: 'yd_001',
    name: 'Продажа электроники - Москва',
    status: 'active',
    budget: 150000,
    spent: 112450,
    impressions: 285600,
    clicks: 8540,
    conversions: 428,
    cost: 112450,
    ctr: 2.99,
    cpc: 13.17,
    cpl: 262.73,
    cr: 5.01,
    roas: 7.2
  },
  {
    id: 'yd_002',
    name: 'Акция на смартфоны - РФ',
    status: 'active',
    budget: 200000,
    spent: 186200,
    impressions: 512300,
    clicks: 12860,
    conversions: 618,
    cost: 186200,
    ctr: 2.51,
    cpc: 14.48,
    cpl: 301.29,
    cr: 4.81,
    roas: 6.5
  },
  {
    id: 'yd_003',
    name: 'Ноутбуки - Поиск',
    status: 'active',
    budget: 100000,
    spent: 78900,
    impressions: 156200,
    clicks: 5240,
    conversions: 312,
    cost: 78900,
    ctr: 3.35,
    cpc: 15.06,
    cpl: 252.88,
    cr: 5.95,
    roas: 7.8
  },
  {
    id: 'yd_004',
    name: 'Аксессуары - Ретаргетинг',
    status: 'paused',
    budget: 50000,
    spent: 42100,
    impressions: 98400,
    clicks: 3920,
    conversions: 156,
    cost: 42100,
    ctr: 3.98,
    cpc: 10.74,
    cpl: 269.87,
    cr: 3.98,
    roas: 5.1
  }
];

export class YandexDirectAPI {
  private static instance: YandexDirectAPI;
  private campaigns: YandexCampaign[] = mockCampaigns;
  private syncing: boolean = false;

  private constructor() {}

  static getInstance(): YandexDirectAPI {
    if (!YandexDirectAPI.instance) {
      YandexDirectAPI.instance = new YandexDirectAPI();
    }
    return YandexDirectAPI.instance;
  }

  async getCampaigns(): Promise<YandexCampaign[]> {
    await this.simulateDelay(800);
    return [...this.campaigns];
  }

  async getCampaignById(id: string): Promise<YandexCampaign | null> {
    await this.simulateDelay(500);
    return this.campaigns.find(c => c.id === id) || null;
  }

  async getStats(): Promise<YandexStats> {
    await this.simulateDelay(1200);
    
    const totalSpent = this.campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalConversions = this.campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalClicks = this.campaigns.reduce((sum, c) => sum + c.clicks, 0);
    
    const avgCPL = totalConversions > 0 ? totalSpent / totalConversions : 0;
    const avgCR = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const avgROAS = this.campaigns.reduce((sum, c) => sum + c.roas, 0) / this.campaigns.length;

    return {
      period: 'last_7_days',
      campaigns: [...this.campaigns],
      totalSpent,
      totalConversions,
      avgCPL: Math.round(avgCPL * 100) / 100,
      avgCR: Math.round(avgCR * 100) / 100,
      avgROAS: Math.round(avgROAS * 100) / 100
    };
  }

  async syncCampaigns(): Promise<{ success: boolean; message: string; campaigns: YandexCampaign[] }> {
    if (this.syncing) {
      return {
        success: false,
        message: 'Синхронизация уже выполняется',
        campaigns: []
      };
    }

    this.syncing = true;
    await this.simulateDelay(2000);

    this.campaigns = this.campaigns.map(campaign => ({
      ...campaign,
      spent: campaign.spent + Math.random() * 5000,
      clicks: campaign.clicks + Math.floor(Math.random() * 200),
      conversions: campaign.conversions + Math.floor(Math.random() * 15),
      impressions: campaign.impressions + Math.floor(Math.random() * 10000)
    })).map(campaign => {
      const cpl = campaign.conversions > 0 ? campaign.spent / campaign.conversions : 0;
      const cr = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
      const cpc = campaign.clicks > 0 ? campaign.spent / campaign.clicks : 0;
      const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;

      return {
        ...campaign,
        cpl: Math.round(cpl * 100) / 100,
        cr: Math.round(cr * 100) / 100,
        cpc: Math.round(cpc * 100) / 100,
        ctr: Math.round(ctr * 100) / 100,
        roas: Math.round((Math.random() * 3 + 5) * 100) / 100
      };
    });

    this.syncing = false;

    return {
      success: true,
      message: `Синхронизировано ${this.campaigns.length} кампаний`,
      campaigns: [...this.campaigns]
    };
  }

  async pauseCampaign(id: string): Promise<boolean> {
    await this.simulateDelay(600);
    const campaign = this.campaigns.find(c => c.id === id);
    if (campaign) {
      campaign.status = 'paused';
      return true;
    }
    return false;
  }

  async resumeCampaign(id: string): Promise<boolean> {
    await this.simulateDelay(600);
    const campaign = this.campaigns.find(c => c.id === id);
    if (campaign) {
      campaign.status = 'active';
      return true;
    }
    return false;
  }

  isSyncing(): boolean {
    return this.syncing;
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const yandexDirectAPI = YandexDirectAPI.getInstance();
