import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { Suggestion } from '@/types';
import { isValidYouTubeUrl, extractYouTubeId } from '@/lib/youtube';

const suggestionSchema = z.object({
  youtubeUrl: z.string().url('Invalid URL').refine(isValidYouTubeUrl, {
    message: 'Must be a valid YouTube URL',
  }),
  suggestion_reason: z.string().optional(),
});

type SuggestionFormData = z.infer<typeof suggestionSchema>;

interface SuggestionFormProps {
  suggestion?: Suggestion | null;
  onSubmit: (data: SuggestionFormData) => void;
  onCancel: () => void;
}

export function SuggestionForm({ suggestion, onSubmit, onCancel }: SuggestionFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      youtubeUrl: suggestion ? `https://www.youtube.com/watch?v=${suggestion.youtube_id}` : '',
      suggestion_reason: suggestion?.suggestion_reason || '',
    },
  });

  const handleFormSubmit = (data: SuggestionFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="youtubeUrl">{t('youtubeUrl')} *</Label>
        <Input
          id="youtubeUrl"
          {...register('youtubeUrl')}
          placeholder="https://www.youtube.com/watch?v=..."
          className={errors.youtubeUrl ? 'border-destructive' : ''}
        />
        {errors.youtubeUrl && (
          <p className="text-sm text-destructive">{errors.youtubeUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="suggestion_reason">Reason for suggestion (optional)</Label>
        <Input
          id="suggestion_reason"
          {...register('suggestion_reason')}
          placeholder="Why do you think this song should be included?"
          className={errors.suggestion_reason ? 'border-destructive' : ''}
        />
        {errors.suggestion_reason && (
          <p className="text-sm text-destructive">{errors.suggestion_reason.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('loading') : t('save')}
        </Button>
      </div>
    </form>
  );
}