<?php

namespace App\Observers;

use App\Models\Music;
use App\Services\NotificationService;

class MusicObserver
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function updated(Music $music): void
    {
        if ($music->wasChanged('count_to_approve') && $music->shouldAutoApprove() && !$music->is_approved) {
            $music->withoutEvents(function () use ($music) {
                $music->update(['is_approved' => true]);
            });
        }

        if ($music->wasChanged('is_approved')) {
            $this->notificationService->createApprovalNotification($music);
        }
    }
}
