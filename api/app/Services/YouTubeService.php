<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YouTubeService
{
    private string $apiKey;
    private string $baseUrl = 'https://www.googleapis.com/youtube/v3';

    public function __construct()
    {
        $this->apiKey = config('services.youtube.api_key', 'AIzaSyD8hoJOyrKhNLFTlOWT1IT33afAuQg-PRs');
    }

    public function getVideoInfo(string $videoId): ?array
    {
        try {
            $response = Http::get($this->baseUrl . '/videos', [
                'key' => $this->apiKey,
                'id' => $videoId,
                'part' => 'snippet,statistics',
            ]);

            if (!$response->successful()) {
                Log::error('YouTube API error', ['status' => $response->status(), 'body' => $response->body()]);
                return null;
            }

            $data = $response->json();
            
            if (empty($data['items'])) {
                return null;
            }

            $video = $data['items'][0];
            $snippet = $video['snippet'];
            $statistics = $video['statistics'];

            return [
                'title' => $snippet['title'],
                'views' => (int) $statistics['viewCount'],
                'youtube_id' => $videoId,
                'thumb' => $snippet['thumbnails']['high']['url'] ?? $snippet['thumbnails']['default']['url'],
            ];
        } catch (\Exception $e) {
            Log::error('YouTube API exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    public function extractVideoId(string $url): ?string
    {
        $patterns = [
            '/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    public function getTiaoCarreiroVideos(): array
    {
        return $this->searchVideos('Tião Carreiro e Pardinho', 20);
    }

    private function searchVideos(string $query, int $maxResults = 10): array
    {
        try {
            $response = Http::get($this->baseUrl . '/search', [
                'key' => $this->apiKey,
                'q' => $query,
                'part' => 'snippet',
                'type' => 'video',
                'maxResults' => $maxResults,
                'order' => 'viewCount',
            ]);

            if (!$response->successful()) {
                Log::error('YouTube Search API error', ['status' => $response->status(), 'body' => $response->body()]);
                return [];
            }

            $data = $response->json();
            $videos = [];

            foreach ($data['items'] ?? [] as $item) {
                $videoId = $item['id']['videoId'];
                $videoInfo = $this->getVideoInfo($videoId);
                
                if ($videoInfo) {
                    $videos[] = $videoInfo;
                }
            }

            return $videos;
        } catch (\Exception $e) {
            Log::error('YouTube Search API exception', ['error' => $e->getMessage()]);
            return [];
        }
    }
}
