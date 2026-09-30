<?php

namespace Database\Seeders;

use App\Models\SchoolInformation;
use App\Services\ExaminationManagementService;
use Illuminate\Database\Seeder;

class SchoolInformationSeeder extends Seeder
{
    public function run(): void
    {
        $schools = [
            [
                'name' => 'Zomba Baptist Secondary School',
                'address' => 'Zomba, Malawi',
                'phone_number' => '09991234567',
                'logo_path' => null,
            ],
            [
                'name' => 'Lilongwe Community Secondary School',
                'address' => 'Lilongwe, Malawi',
                'phone_number' => '08881234567',
                'logo_path' => null,
            ],
        ];

        $examinationService = app(ExaminationManagementService::class);

        foreach ($schools as $schoolData) {
            $school = SchoolInformation::firstOrCreate(
                ['name' => $schoolData['name']],
                $schoolData
            );

            $examinationService->seedDefaultsForSchool($school->id);
        }
    }
}
