import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { YandexDirectSync } from '@/components/YandexDirectSync';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const platformsData = [
    { name: 'Яндекс Директ', campaigns: 12, budget: 450000, status: 'active', color: '#8B5CF6' },
    { name: 'ВКонтакте', campaigns: 8, budget: 280000, status: 'active', color: '#D946EF' },
    { name: 'Wildberries', campaigns: 5, budget: 320000, status: 'active', color: '#F97316' },
    { name: 'OZON', campaigns: 4, budget: 180000, status: 'review', color: '#0EA5E9' },
  ];

  const performanceData = [
    { date: '1 янв', cpl: 420, cr: 3.2, roas: 4.5 },
    { date: '8 янв', cpl: 380, cr: 3.8, roas: 5.1 },
    { date: '15 янв', cpl: 350, cr: 4.2, roas: 5.8 },
    { date: '22 янв', cpl: 320, cr: 4.6, roas: 6.2 },
    { date: '29 янв', cpl: 290, cr: 5.1, roas: 6.8 },
    { date: '5 фев', cpl: 310, cr: 4.9, roas: 6.5 },
  ];

  const budgetData = [
    { name: 'Яндекс Директ', value: 450000 },
    { name: 'ВКонтакте', value: 280000 },
    { name: 'Wildberries', value: 320000 },
    { name: 'OZON', value: 180000 },
  ];

  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

  const abTests = [
    { 
      id: 1, 
      name: 'Объявление А vs Б', 
      platform: 'Яндекс Директ', 
      winner: 'Вариант Б', 
      improvement: '+28%', 
      status: 'completed' 
    },
    { 
      id: 2, 
      name: 'Лендинг v3 vs v4', 
      platform: 'ВКонтакте', 
      winner: 'Определяется...', 
      improvement: '—', 
      status: 'running' 
    },
    { 
      id: 3, 
      name: 'Креатив 1 vs 2', 
      platform: 'Wildberries', 
      winner: 'Вариант 1', 
      improvement: '+15%', 
      status: 'completed' 
    },
  ];

  const recommendations = [
    { 
      icon: 'TrendingUp', 
      title: 'Увеличить бюджет на Яндекс Директ', 
      description: 'ROAS вырос на 35% за неделю. Рекомендуем +20% к бюджету.', 
      priority: 'high' 
    },
    { 
      icon: 'AlertCircle', 
      title: 'Низкая конверсия в ВКонтакте', 
      description: 'CR упал на 12%. Проверьте целевую аудиторию и креативы.', 
      priority: 'medium' 
    },
    { 
      icon: 'Target', 
      title: 'Оптимизировать ставки OZON', 
      description: 'CPL можно снизить на 15-20% без потери охвата.', 
      priority: 'low' 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-glow">
                <Icon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AdPlatform
                </h1>
                <p className="text-xs text-muted-foreground">Управление рекламой</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Icon name="Plus" size={16} className="mr-2" />
                Новая кампания
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/20">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="yandex" className="data-[state=active]:bg-primary/20">
              <Icon name="Zap" size={16} className="mr-2" />
              Яндекс Директ
            </TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-primary/20">
              <Icon name="Link" size={16} className="mr-2" />
              Платформы
            </TabsTrigger>
            <TabsTrigger value="ab-tests" className="data-[state=active]:bg-primary/20">
              <Icon name="TestTube" size={16} className="mr-2" />
              A/B-тесты
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">CPL средний</span>
                  <Icon name="DollarSign" size={20} className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">₽310</div>
                <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <Icon name="TrendingDown" size={12} />
                  -8.2% за неделю
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Конверсия</span>
                  <Icon name="Target" size={20} className="text-secondary" />
                </div>
                <div className="text-3xl font-bold text-foreground">4.9%</div>
                <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <Icon name="TrendingUp" size={12} />
                  +12.5% за неделю
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">ROAS</span>
                  <Icon name="TrendingUp" size={20} className="text-accent" />
                </div>
                <div className="text-3xl font-bold text-foreground">6.5x</div>
                <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <Icon name="TrendingUp" size={12} />
                  +18.3% за неделю
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Бюджет</span>
                  <Icon name="Wallet" size={20} className="text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-foreground">₽1.2M</div>
                <div className="text-xs text-muted-foreground mt-1">
                  29 активных кампаний
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="LineChart" size={20} className="text-primary" />
                  Динамика эффективности
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis yAxisId="left" stroke="#8B5CF6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#D946EF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="cpl" 
                      stroke="#8B5CF6" 
                      strokeWidth={2} 
                      name="CPL (₽)" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="roas" 
                      stroke="#D946EF" 
                      strokeWidth={2} 
                      name="ROAS" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="PieChart" size={20} className="text-secondary" />
                  Распределение бюджета
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${(entry.value / 1000).toFixed(0)}K`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333', 
                        borderRadius: '8px' 
                      }}
                      formatter={(value: number) => `₽${value.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Lightbulb" size={20} className="text-accent" />
                Рекомендации по оптимизации
              </h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border hover:border-primary/40 transition-all duration-300"
                  >
                    <div className={`p-2 rounded-lg ${
                      rec.priority === 'high' ? 'bg-red-500/20' :
                      rec.priority === 'medium' ? 'bg-yellow-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      <Icon name={rec.icon as any} size={24} className={
                        rec.priority === 'high' ? 'text-red-400' :
                        rec.priority === 'medium' ? 'text-yellow-400' :
                        'text-blue-400'
                      } />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{rec.title}</h4>
                        <Badge variant={
                          rec.priority === 'high' ? 'destructive' : 'secondary'
                        } className="text-xs">
                          {rec.priority === 'high' ? 'Высокий' : 
                           rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <Button size="sm" variant="outline">Применить</Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="yandex" className="animate-fade-in">
            <YandexDirectSync />
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platformsData.map((platform, index) => (
                <Card 
                  key={index} 
                  className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/40 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${platform.color}20` }}
                      >
                        <Icon name="Link" size={24} style={{ color: platform.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">{platform.campaigns} кампаний</p>
                      </div>
                    </div>
                    <Badge 
                      variant={platform.status === 'active' ? 'default' : 'secondary'}
                      className="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      {platform.status === 'active' ? 'Активно' : 'На проверке'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Бюджет</span>
                        <span className="font-semibold text-foreground">₽{platform.budget.toLocaleString()}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Icon name="Settings" size={14} className="mr-2" />
                        Настроить
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        style={{ backgroundColor: platform.color }}
                      >
                        <Icon name="BarChart3" size={14} className="mr-2" />
                        Статистика
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="Plus" size={20} className="text-primary" />
                  Подключить новую платформу
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['TikTok', 'Instagram', 'Telegram Ads', 'MyTarget'].map((platform, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="h-20 border-dashed hover:border-primary/60 hover:bg-primary/10"
                  >
                    <div className="text-center">
                      <Icon name="Plus" size={20} className="mx-auto mb-1" />
                      <span className="text-xs">{platform}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ab-tests" className="space-y-4 animate-fade-in">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="TestTube" size={20} className="text-secondary" />
                  Активные и завершённые тесты
                </h3>
                <Button className="bg-gradient-to-r from-secondary to-accent">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Новый A/B-тест
                </Button>
              </div>

              <div className="space-y-4">
                {abTests.map((test) => (
                  <div 
                    key={test.id}
                    className="p-5 rounded-lg border border-border bg-muted/20 hover:border-secondary/40 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{test.name}</h4>
                        <p className="text-sm text-muted-foreground">{test.platform}</p>
                      </div>
                      <Badge 
                        variant={test.status === 'completed' ? 'default' : 'secondary'}
                        className={test.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }
                      >
                        {test.status === 'completed' ? 'Завершён' : 'Активен'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-card border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Победитель</p>
                        <p className="font-semibold text-foreground">{test.winner}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-card border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Прирост</p>
                        <p className="font-semibold text-green-400">{test.improvement}</p>
                      </div>
                    </div>

                    {test.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Прогресс теста</span>
                          <span>67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
              <div className="flex items-start gap-4">
                <Icon name="Sparkles" size={32} className="text-secondary" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Автоматическое A/B-тестирование
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Платформа автоматически создаёт и запускает тесты для ваших кампаний, 
                    анализирует результаты и применяет лучшие варианты.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Настроить правила
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-secondary to-accent">
                      Включить автотесты
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="BarChart3" size={20} className="text-primary" />
                Сравнение платформ по эффективности
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={[
                  { platform: 'Яндекс', cpl: 290, cr: 5.2, roas: 6.8 },
                  { platform: 'ВК', cpl: 350, cr: 4.1, roas: 5.5 },
                  { platform: 'WB', cpl: 310, cr: 4.8, roas: 6.2 },
                  { platform: 'OZON', cpl: 380, cr: 3.9, roas: 5.1 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="platform" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333', 
                      borderRadius: '8px' 
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="cpl" fill="#8B5CF6" name="CPL (₽)" />
                  <Bar dataKey="cr" fill="#D946EF" name="CR (%)" />
                  <Bar dataKey="roas" fill="#F97316" name="ROAS" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <Icon name="Download" size={24} className="text-primary mb-3" />
                <h4 className="font-semibold mb-2 text-foreground">Еженедельный отчёт</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Скачайте детальную аналитику за последние 7 дней
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Скачать PDF
                </Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <Icon name="Mail" size={24} className="text-secondary mb-3" />
                <h4 className="font-semibold mb-2 text-foreground">Email-рассылка</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Получайте отчёты автоматически на почту
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Настроить
                </Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <Icon name="Calendar" size={24} className="text-accent mb-3" />
                <h4 className="font-semibold mb-2 text-foreground">Кастомный период</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Выберите даты для анализа произвольного периода
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Выбрать даты
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;