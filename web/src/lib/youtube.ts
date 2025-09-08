export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

export function formatYouTubeUrl(url: string): string {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
}