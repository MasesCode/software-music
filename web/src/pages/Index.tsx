import { useState, useEffect } from 'react';
import { Search, Play, ExternalLink, Copy, Youtube, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { Song, ApiResponse } from '@/types';
import { getYouTubeThumbnail } from '@/lib/youtube';
import { getErrorMessage } from '@/lib/errorHandler';

const Index = () => {
  const [topFive, setTopFive] = useState<Song[]>([]);
  const [otherSongs, setOtherSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSongs, setShowAllSongs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreSongs, setHasMoreSongs] = useState(true);
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [topFiveResponse, othersResponse] = await Promise.all([
        api.get<{data: Song[]}>('/musics/top-five'),
        api.get<{data: {data: Song[]}}>('/musics/others')
      ]);
      
      setTopFive(topFiveResponse.data || []);
      setOtherSongs(othersResponse.data.data || []);
    } catch (error) {
      if (error instanceof ApiError) {
        setTopFive(mockTopFive);
        setOtherSongs(mockOtherSongs);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreSongs = async () => {
    if (isLoadingMore || !hasMoreSongs) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await api.get<{data: {data: Song[]}}>(`/musics/others?page=${nextPage}`);
      const newSongs = response.data.data || [];
      
      if (newSongs.length === 0) {
        setHasMoreSongs(false);
      } else {
        setOtherSongs(prev => [...prev, ...newSongs]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setHasMoreSongs(false);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const contributeToMusic = async (musicId: number) => {
    try {
      await api.post(`/musics/${musicId}/contribute`);
      toast({
        title: t('success'),
        description: t('contributionRecorded'),
      });
      const response = await api.get<{data: Song[]}>('/musics/top-five');
      setTopFive(response.data || []);
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
      const response = await api.get<{data: Song[]}>('/musics/top-five');
      setTopFive(response.data || []);
    } catch (error) {
      toast({
        title: t('error'),
        description: getErrorMessage(error, t),
        variant: 'destructive',
      });
    }
  };

  const allSongs = [...topFive, ...otherSongs];
  const filteredSongs = allSongs.filter(song => {
    const query = searchQuery.toLowerCase().trim();
    const title = song.title.toLowerCase();
    
    return title === query || title.startsWith(query);
  });

  const copyLink = (url: string) => {
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
        <PageContainer title="Top 5 Tião Carreiro e Pardinho" description={t('mostPopularSongs')}>
          <div className="mb-6">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          <div className="space-y-8">
            <div>
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <PageContainer title="Top 5 Tião Carreiro e Pardinho" description={t('mostPopularSongs')}>
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {searchQuery ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t('searchResults')}</h2>
            {filteredSongs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{t('noSongsFound')}</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSongs.map((song) => (
                  <SongCard key={song.id} song={song} onContribute={contributeToMusic} onApprove={approveMusic} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h2 className="text-3xl font-bold">{t('topFiveSongs')}</h2>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {topFive.length} {t('songs')}
                </Badge>
              </div>
              
              {topFive.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    Ainda não há músicas no Top 5. Seja o primeiro a contribuir!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topFive.map((song, index) => (
                    <TopFiveCard 
                      key={song.id} 
                      song={song} 
                      position={index + 1} 
                      onContribute={contributeToMusic} 
                      onApprove={approveMusic}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{t('otherSongs')}</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowAllSongs(!showAllSongs)}
                  className="flex items-center gap-2"
                >
                  {showAllSongs ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      {t('seeLess')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      {t('seeMore')}
                    </>
                  )}
                </Button>
              </div>

              {showAllSongs && (
                <div className="space-y-4">
                  {otherSongs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma música adicional disponível</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {otherSongs.map((song) => (
                          <SongCard key={song.id} song={song} onContribute={contributeToMusic} onApprove={approveMusic} />
                        ))}
                      </div>
                      
                      <div className="text-center pt-6">
                        <Button
                          onClick={loadMoreSongs}
                          disabled={isLoadingMore || !hasMoreSongs}
                          className="px-8"
                        >
                          {isLoadingMore ? t('loadingMore') : hasMoreSongs ? t('loadMoreSongs') : t('noMoreSongs')}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </PageContainer>
    </>
  );
};

const TopFiveCard = ({ song, position, onContribute, onApprove }: { song: Song, position: number, onContribute: (id: number) => void, onApprove: (id: number, action: 'approve' | 'reject') => void }) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openYouTube(song.youtube_id)}>
      <div className="flex h-48">
        <div className="flex-shrink-0 w-64">
          <div className="relative w-full h-full rounded-l-md overflow-hidden bg-muted">
            <img
              src={song.thumb || getYouTubeThumbnail(song.youtube_id)}
              alt={`${song.title} thumbnail`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                onClick={() => openYouTube(song.youtube_id)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Play className="h-4 w-4 mr-1" />
                {t('play')}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full font-bold">
                  {position}
                </div>
                <CardTitle className="text-xl">{song.title}</CardTitle>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {song.views} {t('views')}
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <Youtube className="h-3 w-3 mr-1" />
                  YouTube
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                <p>
                  {t('submittedBy')}: {song.user?.name || 'Desconhecido'}
                </p>
                <p>
                  {t('createdAt')}: {new Date(song.created_at).toLocaleDateString()}
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
                    copyLink(song.youtube_id);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openYouTube(song.youtube_id);
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              {user && !song.is_approved && (
                user.role === 'admin' ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(song.id, 'approve');
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(song.id, 'reject');
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Reprovar
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onContribute(song.id);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {t('contribute')} ({song.count_to_approve}/5)
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const SongCard = ({ song, onContribute, onApprove }: { song: Song, onContribute: (id: number) => void, onApprove: (id: number, action: 'approve' | 'reject') => void }) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openYouTube(song.youtube_id)}>
      <CardHeader className="pb-3">
        {song.youtube_id && (
          <div className="relative aspect-video mb-3 rounded-md overflow-hidden bg-muted">
            <img
              src={song.thumb || getYouTubeThumbnail(song.youtube_id)}
              alt={`${song.title} thumbnail`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                onClick={() => openYouTube(song.youtube_id)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Play className="h-4 w-4 mr-1" />
                {t('play')}
              </Button>
            </div>
          </div>
        )}
        <CardTitle className="text-lg line-clamp-2">{song.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {song.views} {t('views')}
          </Badge>
          {song.is_approved ? (
            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
              {t('approved')}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
              {t('pending')} ({song.count_to_approve}/5)
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              <Youtube className="h-3 w-3 mr-1" />
              YouTube
            </Badge>
          </div>
          {song.youtube_id && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  copyLink(song.youtube_id);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  openYouTube(song.youtube_id);
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>
            {t('submittedBy')}: {song.user?.name || 'Desconhecido'}
          </p>
          <p>
            {t('createdAt')}: {new Date(song.created_at).toLocaleDateString()}
          </p>
          {song.suggestion_reason && (
            <p className="mt-2 text-xs italic">
              Motivo: {song.suggestion_reason}
            </p>
          )}
        </div>
        {user && !song.is_approved && (
          <div className="mt-3">
            {user.role === 'admin' ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onApprove(song.id, 'approve')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  onClick={() => onApprove(song.id, 'reject')}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Reprovar
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => onContribute(song.id)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {t('contribute')} ({song.count_to_approve}/5)
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const mockTopFive: Song[] = [
  {
    id: 1,
    title: 'O Mineiro e o Italiano',
    views: 1250,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 1,
    is_approved: true,
    count_to_approve: 5,
    suggestion_reason: 'Clássico do Tião Carreiro',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    user: { id: 1, name: 'João Silva' }
  },
  {
    id: 2,
    title: 'Pagode em Brasília',
    views: 980,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 2,
    is_approved: true,
    count_to_approve: 5,
    suggestion_reason: 'Grande melodia',
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z',
    user: { id: 2, name: 'Maria Santos' }
  },
  {
    id: 3,
    title: 'A Terra do Nunca',
    views: 850,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 3,
    is_approved: false,
    count_to_approve: 3,
    suggestion_reason: 'Letra linda',
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-13T09:20:00Z',
    user: { id: 3, name: 'Carlos Lima' }
  },
  {
    id: 4,
    title: 'Modinha para Gabriela',
    views: 720,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 4,
    is_approved: false,
    count_to_approve: 1,
    suggestion_reason: 'Música emocionante',
    created_at: '2024-01-12T14:10:00Z',
    updated_at: '2024-01-12T14:10:00Z',
    user: { id: 4, name: 'Ana Costa' }
  },
  {
    id: 5,
    title: 'Manhã de Sertão',
    views: 650,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 5,
    is_approved: false,
    count_to_approve: 4,
    suggestion_reason: 'Melodia tranquila',
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z',
    user: { id: 5, name: 'Pedro Oliveira' }
  },
];

const mockOtherSongs: Song[] = [
  {
    id: 6,
    title: 'Vida de Boiadeiro',
    views: 500,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 6,
    is_approved: false,
    count_to_approve: 2,
    suggestion_reason: 'História do campo',
    created_at: '2024-01-10T08:15:00Z',
    updated_at: '2024-01-10T08:15:00Z',
    user: { id: 6, name: 'Roberto Silva' }
  },
  {
    id: 7,
    title: 'Caminho de Volta',
    views: 420,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 7,
    is_approved: true,
    count_to_approve: 5,
    suggestion_reason: 'Nostalgia',
    created_at: '2024-01-09T16:30:00Z',
    updated_at: '2024-01-09T16:30:00Z',
    user: { id: 7, name: 'Fernanda Lima' }
  },
  {
    id: 8,
    title: 'Sertão de Minha Terra',
    views: 380,
    youtube_id: 'dQw4w9WgXcQ',
    thumb: '',
    user_id: 8,
    is_approved: false,
    count_to_approve: 0,
    suggestion_reason: 'Amor pela terra',
    created_at: '2024-01-08T12:20:00Z',
    updated_at: '2024-01-08T12:20:00Z',
    user: { id: 8, name: 'José Santos' }
  },
];

export default Index;
