<?php

namespace App\Http\Controllers;

use App\Http\Requests\Musics\ApproveMusicRequest;
use App\Http\Requests\Musics\StoreMusicRequest;
use App\Http\Requests\Musics\UpdateMusicRequest;
use App\Models\Music;
use App\Services\YouTubeService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Spatie\Activitylog\Models\Activity;

class MusicController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private YouTubeService $youTubeService
    ) {}

    public function index(): JsonResponse
    {
        $topFive = Music::query()->topFive()->get();
        $others = Music::query()->afterTopFive()->paginate(10);

        return response()->json([
            'message' => 'Musics retrieved successfully.',
            'data' => [
                'top_five' => $topFive,
                'others' => $others,
            ]
        ], Response::HTTP_OK);
    }

    public function topFive(): JsonResponse
    {
        $musics = Music::query()->topFive()->get();

        return response()->json([
            'message' => 'Top 5 musics retrieved successfully.',
            'data' => $musics
        ], Response::HTTP_OK);
    }

    public function others(): JsonResponse
    {
        $musics = Music::query()->afterTopFive()->paginate(10);

        return response()->json([
            'message' => 'Other musics retrieved successfully.',
            'data' => $musics
        ], Response::HTTP_OK);
    }

    public function pending(): JsonResponse
    {
        $this->authorize('viewAny', Music::class);

        $musics = Music::query()->pending()->with('user')->paginate(10);

        return response()->json([
            'message' => 'Pending musics retrieved successfully.',
            'data' => $musics
        ], Response::HTTP_OK);
    }

    public function store(StoreMusicRequest $request): JsonResponse
    {
        $this->authorize('create', Music::class);

        $videoId = $this->youTubeService->extractVideoId($request->youtube_url);
        
        if (!$videoId) {
            return response()->json([
                'message' => 'Invalid YouTube URL.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $videoInfo = $this->youTubeService->getVideoInfo($videoId);
        
        if (!$videoInfo) {
            return response()->json([
                'message' => 'Could not retrieve video information from YouTube.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $music = Music::query()->create([
            ...$videoInfo,
            'user_id' => auth()->id(),
            'suggestion_reason' => $request->suggestion_reason,
            'is_approved' => false,
            'count_to_approve' => 0,
        ]);

        activity()
            ->performedOn($music)
            ->withProperties(['youtube_url' => $request->youtube_url])
            ->log('Music suggestion created');

        return response()->json([
            'message' => 'Music suggestion created successfully.',
            'data' => $music
        ], Response::HTTP_CREATED);
    }

    public function show(Music $music): JsonResponse
    {
        return response()->json([
            'message' => 'Music retrieved successfully.',
            'data' => $music->load('user')
        ], Response::HTTP_OK);
    }

    public function update(UpdateMusicRequest $request, Music $music): JsonResponse
    {
        $this->authorize('update', $music);

        $music->update($request->validated());

        activity()
            ->performedOn($music)
            ->withProperties($request->validated())
            ->log('Music updated');

        return response()->json([
            'message' => 'Music updated successfully.',
            'data' => $music
        ], Response::HTTP_OK);
    }

    public function destroy(Music $music): JsonResponse
    {
        $this->authorize('delete', $music);

        activity()
            ->performedOn($music)
            ->log('Music deleted');

        $music->delete();

        return response()->json([
            'message' => 'Music deleted successfully.'
        ], Response::HTTP_OK);
    }

    public function approve(ApproveMusicRequest $request, Music $music): JsonResponse
    {
        $this->authorize('approve', $music);

        if ($request->action === 'approve') {
            $music->update(['is_approved' => true]);
            $message = 'Music approved successfully.';
            
            activity()
                ->performedOn($music)
                ->log('Music approved by admin');
        } else {
            activity()
                ->performedOn($music)
                ->log('Music rejected and deleted by admin');
                
            $music->delete();
            $message = 'Music rejected and deleted successfully.';
        }

        return response()->json([
            'message' => $message,
        ], Response::HTTP_OK);
    }

    public function contribute(Music $music): JsonResponse
    {
        $this->authorize('contribute', $music);

        $music->incrementApprovalCount();

        if ($music->shouldAutoApprove()) {
            $music->update(['is_approved' => true]);
            
            activity()
                ->performedOn($music)
                ->withProperties(['count_to_approve' => $music->count_to_approve])
                ->log('Music auto-approved after 5 contributions');
            
            return response()->json([
                'message' => 'Music contribution recorded and auto-approved!',
                'data' => $music
            ], Response::HTTP_OK);
        }

        activity()
            ->performedOn($music)
            ->withProperties(['count_to_approve' => $music->count_to_approve])
            ->log('Music contribution recorded');

        return response()->json([
            'message' => 'Music contribution recorded.',
            'data' => [
                'count_to_approve' => $music->count_to_approve,
                'needed_for_approval' => 5 - $music->count_to_approve
            ]
        ], Response::HTTP_OK);
    }

    public function syncFromYouTube(): JsonResponse
    {
        $this->authorize('create', Music::class);

        $videos = $this->youTubeService->getTiaoCarreiroVideos();
        $created = 0;

        foreach ($videos as $video) {
            $existing = Music::query()->where('youtube_id', $video['youtube_id'])->first();
            
            if (!$existing) {
                Music::create([
                    ...$video,
                    'user_id' => auth()->id(),
                    'is_approved' => true,
                    'count_to_approve' => 0,
                ]);
                $created++;
            }
        }

        activity()
            ->withProperties(['created_count' => $created])
            ->log('YouTube sync completed');

        return response()->json([
            'message' => "Synced {$created} new musics from YouTube.",
        ], Response::HTTP_OK);
    }
}
