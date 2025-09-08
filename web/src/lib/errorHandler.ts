import { ApiError } from './api';

export function getErrorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    const status = error.status;
    const message = error.message.toLowerCase();
    
    if (status === 422 && error.data?.errors) {
      const errors = error.data.errors;
      
      if (errors.youtube_url) {
        const youtubeError = Array.isArray(errors.youtube_url) ? errors.youtube_url[0] : errors.youtube_url;
        if (youtubeError.includes('already been suggested')) {
          return t('duplicateYouTubeId');
        }
        if (youtubeError.includes('Invalid YouTube URL')) {
          return t('invalidYouTubeUrl');
        }
        return youtubeError;
      }
      
      const firstError = Object.values(errors)[0];
      if (Array.isArray(firstError)) {
        return firstError[0];
      }
      return firstError as string;
    }
    
    if (status === 403) {
      return t('cannotContributeOwnMusic');
    }
    
    if (message.includes('cannot contribute to your own music') || 
        message.includes('cannot contribute to a music suggestion that you created')) {
      return t('cannotContributeOwnMusic');
    }
    
    if (message.includes('already contributed') || 
        message.includes('You have already contributed to this music')) {
      return t('alreadyContributed');
    }
    
    if (message.includes('already approved') || 
        message.includes('This music is already approved')) {
      return t('musicAlreadyApproved');
    }
    
    if (message.includes('not found') || 
        message.includes('Music not found')) {
      return t('musicNotFound');
    }
    
    if (message.includes('youtube video has already been suggested') || 
        message.includes('A music with this YouTube video has already been suggested')) {
      return t('duplicateYouTubeId');
    }
    
    if (message.includes('invalid youtube url') || 
        message.includes('Invalid YouTube URL')) {
      return t('invalidYouTubeUrl');
    }
    
    if (message.includes('User created successfully')) {
      return t('userCreated');
    }
    
    if (message.includes('User updated successfully')) {
      return t('userUpdated');
    }
    
    if (message.includes('User deleted successfully')) {
      return t('userDeleted');
    }
    
    if (message.includes('User retrieved successfully')) {
      return t('userRetrieved');
    }
    
    if (message.includes('Users retrieved successfully')) {
      return t('usersRetrieved');
    }
    
    switch (status) {
      case 404:
        return t('error404');
      case 409:
        return t('error409');
      case 422:
        return t('error422');
      case 500:
        return t('error500');
      default:
        return error.message || t('errorGeneric');
    }
  }
  
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return t('errorNetwork');
    }
    return error.message;
  }
  
  return t('errorGeneric');
}
