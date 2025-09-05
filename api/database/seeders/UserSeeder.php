<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@email.com',
            'password' => bcrypt('senhasegura123'),
            'is_admin' => true,
        ]);
    }
}
