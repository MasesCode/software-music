import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Youtube, ExternalLink, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppHeader } from '@/components/AppHeader';
import { PageContainer } from '@/components/PageContainer';
import { SuggestionForm } from '@/components/SuggestionForm';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { api, ApiError } from '@/lib/api';
import { Suggestion, ApiResponse } from '@/types';
import { getYouTubeThumbnail } from '@/lib/youtube';

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{data: {data: Suggestion[]}}>('/musics/pending');
      setSuggestions(response.data.data || []);
    } catch (error) {
      if (error instanceof ApiError) {
        setSuggestions(mockSuggestions);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingSuggestion) {
        await api.put(`/musics/${editingSuggestion.id}`, data);
        toast({
          title: t('success'),
          description: t('suggestionUpdated'),
        });
      } else {
        await api.post('/musics', {
          youtube_url: data.youtubeUrl,
          suggestion_reason: data.suggestion_reason || 'User suggestion'
        });
        toast({
          title: t('success'),
          description: t('suggestionCreated'),
        });
      }
      fetchSuggestions();
      setIsFormOpen(false);
      setEditingSuggestion(null);
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: t('error'),
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza de que deseja excluir esta sugestão?')) return;
    
    try {
      await api.delete(`/musics/${id}`);
      toast({
        title: t('success'),
        description: t('suggestionDeleted'),
      });
      fetchSuggestions();
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: t('error'),
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const contributeToMusic = async (musicId: number) => {
    try {
      await api.post(`/musics/${musicId}/contribute`);
      toast({
        title: t('success'),
        description: 'Obrigado por contribuir! Seu voto foi registrado.',
      });
      fetchSuggestions(); // Refresh to show updated counts
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: t('error'),
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const canEdit = (suggestion: Suggestion) => {
    return user?.role === 'admin' || suggestion.user_id === user?.id;
  };

  const openForm = (suggestion?: Suggestion) => {
    setEditingSuggestion(suggestion || null);
    setIsFormOpen(true);
  };

  return (
    <ProtectedRoute>
      <AppHeader />
        <PageContainer 
        title={t('suggestions')} 
        description={t('shareFavorites')}
      >
        <div className="mb-6">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openForm()}>
                <Plus className="h-4 w-4 mr-2" />
                {t('addSuggestion')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSuggestion ? t('editSuggestion') : t('addNewSuggestion')}
                </DialogTitle>
              </DialogHeader>
              <SuggestionForm
                suggestion={editingSuggestion}
                onSubmit={handleSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {(!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) ? (
          <div className="text-center py-12">
            <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              {t('noSuggestionsYet')}
            </p>
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" />
              {t('addFirstSuggestion')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(suggestions || []).map((suggestion) => (
              <Card key={suggestion.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="relative aspect-video mb-3 rounded-md overflow-hidden bg-muted">
                    <img
                      src={suggestion.thumb || getYouTubeThumbnail(suggestion.youtube_id)}
                      alt={`${suggestion.title} thumbnail`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${suggestion.youtube_id}`, '_blank')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Assistir
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{suggestion.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.views} visualizações
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                      Pendente ({suggestion.count_to_approve}/5)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      <Youtube className="h-3 w-3 mr-1" />
                      YouTube
                    </Badge>
                    {canEdit(suggestion) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openForm(suggestion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(suggestion.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {t('submittedBy')}: {suggestion.user?.name || 'Unknown'}
                    </p>
                    <p>
                      {t('createdAt')}: {new Date(suggestion.created_at).toLocaleDateString()}
                    </p>
                    {suggestion.suggestion_reason && (
                      <p className="mt-2 text-xs italic">
                        Motivo: {suggestion.suggestion_reason}
                      </p>
                    )}
                  </div>
                  
                  {user && !suggestion.is_approved && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        onClick={() => contributeToMusic(suggestion.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Contribuir ({suggestion.count_to_approve}/5)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </ProtectedRoute>
  );
}

const mockSuggestions: Suggestion[] = [
  {
    id: 's1',
    title: 'Amazing Song',
    artist: 'Great Artist',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    submittedBy: { id: 'u1', name: 'João Silva' },
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 's2',
    title: 'Another Great Track',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    submittedBy: { id: 'u2', name: 'Maria Santos' },
    createdAt: '2024-01-14T15:45:00Z',
  },
];