import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Calendar, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/AppHeader';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { api, ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errorHandler';

interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  event: string;
  subject_type: string;
  subject_id: number;
  causer_type: string;
  causer_id: number;
  properties: any;
  created_at: string;
  causer?: {
    id: number;
    name: string;
    email: string;
  };
  subject?: {
    id: number;
    title?: string;
    name?: string;
  };
}

export default function Logs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{data: {data: ActivityLog[]}}>('/activity-logs');
      setLogs(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      toast({
        title: t('error'),
        description: getErrorMessage(error, t),
        variant: 'destructive',
      });
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLogIcon = (logName: string) => {
    switch (logName) {
      case 'created':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'updated':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'deleted':
        return <FileText className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLogColor = (logName: string) => {
    switch (logName) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs.filter(log => {
    const query = searchQuery.toLowerCase().trim();
    const description = log.description.toLowerCase();
    const causerName = log.causer?.name?.toLowerCase() || '';
    const subjectName = log.subject?.title?.toLowerCase() || log.subject?.name?.toLowerCase() || '';
    
    const matchesSearch = query === '' || description.includes(query) || 
                         causerName.includes(query) || 
                         subjectName.includes(query);
    
    const matchesFilter = filterType === 'all' || log.event === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <AppHeader />
        <PageContainer>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{t('activityLogs')}</h1>
            </div>
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-8 w-8 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[300px]" />
                        <Skeleton className="h-3 w-[200px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <AppHeader />
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('activityLogs')}</h1>
            <Badge variant="secondary" className="text-sm">
              {filteredLogs.length} {filteredLogs.length !== 1 ? t('logCountPlural') : t('logCount')}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('searchLogs')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                {t('allLogs')}
              </Button>
              <Button
                variant={filterType === 'created' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('created')}
              >
                {t('createdLogs')}
              </Button>
              <Button
                variant={filterType === 'updated' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('updated')}
              >
                {t('updatedLogs')}
              </Button>
              <Button
                variant={filterType === 'deleted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('deleted')}
              >
                {t('deletedLogs')}
              </Button>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('noLogsFound')}</h3>
                <p className="text-gray-500">
                  {searchQuery ? t('tryAdjustingLogSearch') : t('noLogsAvailable')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredLogs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getLogIcon(log.event)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getLogColor(log.event)}>
                            {log.event}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-900 mb-2">{log.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {log.causer && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{log.causer.name}</span>
                            </div>
                          )}
                          
                          {log.subject && (
                            <div className="flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span>
                                {log.subject.title || log.subject.name || `ID: ${log.subject_id}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
