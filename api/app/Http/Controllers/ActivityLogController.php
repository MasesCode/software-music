<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Activity::with(['causer', 'subject'])
            ->orderBy('created_at', 'desc');

        if ($request->has('subject_type')) {
            $query->where('subject_type', $request->subject_type);
        }

        if ($request->has('event')) {
            $query->where('event', $request->event);
        }

        if ($request->has('causer_id')) {
            $query->where('causer_id', $request->causer_id);
        }

        $activities = $query->paginate(20);

        return response()->json([
            'message' => 'Activity logs retrieved successfully.',
            'data' => $activities
        ], Response::HTTP_OK);
    }

    public function show(Activity $activity): JsonResponse
    {
        $activity->load(['causer', 'subject']);

        return response()->json([
            'message' => 'Activity log retrieved successfully.',
            'data' => $activity
        ], Response::HTTP_OK);
    }

    public function bySubject(Request $request, string $subjectType, string $subjectId): JsonResponse
    {
        $activities = Activity::where('subject_type', $subjectType)
            ->where('subject_id', $subjectId)
            ->with(['causer', 'subject'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'message' => 'Subject activity logs retrieved successfully.',
            'data' => $activities
        ], Response::HTTP_OK);
    }

    public function byUser(Request $request, string $userId): JsonResponse
    {
        $activities = Activity::where('causer_id', $userId)
            ->with(['causer', 'subject'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'message' => 'User activity logs retrieved successfully.',
            'data' => $activities
        ], Response::HTTP_OK);
    }
}
