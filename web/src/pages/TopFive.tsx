import { useState, useEffect } from 'react';
import { Trophy, Play, ExternalLink, Copy, Youtube, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/AppHeader';
import { PageContainer } from '@/components/PageContainer';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { api, ApiError } from '@/lib/api';
import { Music } from '@/types';
import { getYouTubeThumbnail } from '@/lib/youtube';
import { getErrorMessage } from '@/lib/errorHandler';

const TopFive = () => {
  const [topFive, setTopFive] = useState<Music[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    fetchTopFive();
  }, []);

  const fetchTopFive = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{data: Music[]}>('/musics/top-five');
      setTopFive(response.data || []);
    } catch (error) {
      if (error instanceof ApiError) {
        setTopFive(mockTopFive);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const contributeToMusic = async (musicId: number) => {
    try {
      await api.post(`/musics/${musicId}/contribute`);
      toast({
        title: t('success'),
        description: t('contributionRecorded'),
      });
      fetchTopFive();
    } catch (error) {
      toast({
        title: t('error'),
        description: getErrorMessage(error, t),
        variant: 'destructive',
      });
    }
  };

  const approveMusic = async (musicId: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/musics/${musicId}/approve`, { action });
      toast({
        title: t('success'),
        description: action === 'approve' ? t('musicApproved') : t('musicRejected'),
      });
      fetchTopFive();
    } catch (error) {
      toast({
        title: t('error'),
        description: getErrorMessage(error, t),
        variant: 'destructive',
      });
    }
  };

  const copyLink = (youtubeId: string) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: t('success'),
      description: 'Link copiado para a área de transferência!',
    });
  };

  const openYouTube = (youtubeId: string) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <>
        <AppHeader />
        <PageContainer title="Top 5 Tião Carreiro e Pardinho" description="As músicas mais populares da nossa coleção">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <PageContainer title="Top 5 Tião Carreiro e Pardinho" description="As músicas mais populares da nossa coleção">
        {(!topFive || !Array.isArray(topFive) || topFive.length === 0) ? (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Ainda não há músicas no Top 5. Seja o primeiro a contribuir!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {(topFive || []).map((music, index) => (
              <Card key={music.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openYouTube(music.youtube_id)}>
                <div className="flex">
                  <div className="flex-shrink-0 w-48">
                    <div className="relative aspect-video rounded-l-md overflow-hidden bg-muted">
                      <img
                        src={music.thumb || getYouTubeThumbnail(music.youtube_id)}
                        alt={`${music.title} thumbnail`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          onClick={() => openYouTube(music.youtube_id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full font-bold">
                            {index + 1}
                          </div>
                          <CardTitle className="text-xl">{music.title}</CardTitle>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {music.views} visualizações
                          </Badge>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            <Youtube className="h-3 w-3 mr-1" />
                            YouTube
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-4">
                          <p>
                            {t('submittedBy')}: {music.user?.name || 'Unknown'}
                          </p>
                          <p>
                            {t('createdAt')}: {new Date(music.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyLink(music.youtube_id);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openYouTube(music.youtube_id);
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {user && !music.is_approved && (
                          user.role === 'admin' ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  approveMusic(music.id, 'approve');
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  approveMusic(music.id, 'reject');
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Reprovar
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                contributeToMusic(music.id);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Contribuir ({music.count_to_approve}/5)
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
};

const mockTopFive: Music[] = [
  {
    id: 1,
    title: 'The Miner and the Italian',
    views: 1250,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 1,
    is_approved: true,
    count_to_approve: 5,
    suggestion_reason: 'Classic Tião Carreiro song',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    user: { id: 1, name: 'João Silva' }
  },
  {
    id: 2,
    title: 'Pagoda in Brasília',
    views: 980,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 2,
    is_approved: true,
    count_to_approve: 5,
    suggestion_reason: 'Great melody',
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z',
    user: { id: 2, name: 'Maria Santos' }
  },
  {
    id: 3,
    title: 'The Land of It',
    views: 850,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 3,
    is_approved: true,
    count_to_approve: 5,
    suggestion_reason: 'Beautiful lyrics',
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-13T09:20:00Z',
    user: { id: 3, name: 'Carlos Lima' }
  },
  {
    id: 4,
    title: 'Modinha for Gabriela',
    views: 720,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 4,
    is_approved: true,
    count_to_approve: 5,
    suggestion_reason: 'Emotional song',
    created_at: '2024-01-12T14:10:00Z',
    updated_at: '2024-01-12T14:10:00Z',
    user: { id: 4, name: 'Ana Costa' }
  },
  {
    id: 5,
    title: 'Countryside Morning',
    views: 650,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 5,
    is_approved: true,
    count_to_approve: 5,
    suggestion_reason: 'Peaceful melody',
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z',
    user: { id: 5, name: 'Pedro Oliveira' }
  },
];

export default TopFive;
