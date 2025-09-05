<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('musics', function (Blueprint $table) {
            $table->boolean('is_approved')->default(false);
            $table->integer('count_to_approve')->default(0);
            $table->text('suggestion_reason')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('musics', function (Blueprint $table) {
            $table->dropColumn(['is_approved', 'count_to_approve', 'suggestion_reason']);
        });
    }
};
