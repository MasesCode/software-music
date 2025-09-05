<?php

namespace App\Observers;

use App\Models\Music;

class MusicObserver
{
    public function updated(Music $music): void
    {
        if ($music->wasChanged('count_to_approve') && $music->shouldAutoApprove() && !$music->is_approved) {
            $music->withoutEvents(function () use ($music) {
                $music->update(['is_approved' => true]);
            });
        }
    }
}
