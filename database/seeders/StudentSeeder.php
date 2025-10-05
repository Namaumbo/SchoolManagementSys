<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\SchoolInformation;
use App\Helpers\Helper;
use Carbon\Carbon;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get school information
        $schoolInfo = SchoolInformation::first();
        if (!$schoolInfo) {
            $this->command->error('School information not found. Please run SchoolInformationSeeder first.');
            return;
        }

        // Generate school abbreviation
        $words = explode(' ', $schoolInfo->name);
        $schoolAbbreviation = '';
        foreach ($words as $word) {
            $schoolAbbreviation .= strtoupper($word[0]);
        }

        // Student data arrays
        $firstnames = [
            'John',
            'Jane',
            'Michael',
            'Sarah',
            'David',
            'Emily',
            'James',
            'Jessica',
            'Robert',
            'Ashley',
            'William',
            'Amanda',
            'Christopher',
            'Jennifer',
            'Daniel',
            'Lisa',
            'Matthew',
            'Linda',
            'Anthony',
            'Karen',
            'Mark',
            'Nancy',
            'Donald',
            'Betty',
            'Steven',
            'Helen',
            'Paul',
            'Sandra',
            'Andrew',
            'Donna',
            'Joshua',
            'Carol',
            'Kenneth',
            'Ruth',
            'Kevin',
            'Sharon',
            'Brian',
            'Michelle',
            'George',
            'Laura',
            'Edward',
            'Sarah',
            'Ronald',
            'Kimberly',
            'Timothy',
            'Deborah',
            'Jason',
            'Dorothy',
            'Jeffrey',
            'Amy',
            'Ryan',
            'Angela',
            'Jacob',
            'Brenda',
            'Gary',
            'Emma',
            'Nicholas',
            'Olivia',
            'Eric',
            'Cynthia',
            'Jonathan',
            'Marie',
            'Stephen',
            'Janet',
            'Larry',
            'Catherine',
            'Justin',
            'Frances',
            'Scott',
            'Christine',
            'Brandon',
            'Samantha',
            'Benjamin',
            'Debra',
            'Samuel',
            'Rachel',
            'Gregory',
            'Carolyn',
            'Alexander',
            'Janet',
            'Patrick',
            'Virginia',
            'Jack',
            'Maria',
            'Dennis',
            'Heather',
            'Jerry',
            'Diane',
            'Tyler',
            'Julie',
            'Aaron',
            'Joyce',
            'Jose',
            'Victoria',
            'Henry',
            'Kelly',
            'Adam',
            'Christina',
            'Douglas',
            'Joan',
            'Nathan',
            'Evelyn',
            'Zachary',
            'Judith',
            'Peter',
            'Megan',
            'Kyle',
            'Cheryl',
            'Walter',
            'Andrea',
            'Harold',
            'Hannah',
            'Carl',
            'Jacqueline',
            'Arthur',
            'Martha',
            'Gerald',
            'Gloria',
            'Roger',
            'Teresa',
            'Keith',
            'Sara',
            'Jeremy',
            'Janice',
            'Lawrence',
            'Julia',
            'Sean',
            'Marie',
            'Christian',
            'Grace',
            'Albert',
            'Judy',
            'Joe',
            'Theresa',
            'Ethan',
            'Madison',
            'Wayne',
            'Beverly',
            'Ralph',
            'Denise',
            'Mason',
            'Marilyn',
            'Roy',
            'Amber',
            'Eugene',
            'Danielle',
            'Louis',
            'Rose',
            'Philip',
            'Brittany',
            'Johnny',
            'Diana',
            'Bobby',
            'Abigail',
            'Victor',
            'Jane',
            'Johnny',
            'Lori',
            'Martin',
            'Tammy'
        ];

        $surnames = [
            'Smith',
            'Johnson',
            'Williams',
            'Brown',
            'Jones',
            'Garcia',
            'Miller',
            'Davis',
            'Rodriguez',
            'Martinez',
            'Hernandez',
            'Lopez',
            'Gonzalez',
            'Wilson',
            'Anderson',
            'Thomas',
            'Taylor',
            'Moore',
            'Jackson',
            'Martin',
            'Lee',
            'Perez',
            'Thompson',
            'White',
            'Harris',
            'Sanchez',
            'Clark',
            'Ramirez',
            'Lewis',
            'Robinson',
            'Walker',
            'Young',
            'Allen',
            'King',
            'Wright',
            'Scott',
            'Torres',
            'Nguyen',
            'Hill',
            'Flores',
            'Green',
            'Adams',
            'Nelson',
            'Baker',
            'Hall',
            'Rivera',
            'Campbell',
            'Mitchell',
            'Carter',
            'Roberts',
            'Gomez',
            'Phillips',
            'Evans',
            'Turner',
            'Diaz',
            'Parker',
            'Cruz',
            'Edwards',
            'Collins',
            'Reyes',
            'Stewart',
            'Morris',
            'Morales',
            'Murphy',
            'Cook',
            'Rogers',
            'Gutierrez',
            'Ortiz',
            'Morgan',
            'Cooper',
            'Peterson',
            'Bailey',
            'Reed',
            'Kelly',
            'Howard',
            'Ramos',
            'Kim',
            'Cox',
            'Ward',
            'Richardson',
            'Watson',
            'Brooks',
            'Chavez',
            'Wood',
            'James',
            'Bennett',
            'Gray',
            'Mendoza',
            'Ruiz',
            'Hughes',
            'Price',
            'Alvarez',
            'Castillo',
            'Sanders',
            'Patel',
            'Myers',
            'Long',
            'Ross',
            'Foster',
            'Jimenez',
            'Powell',
            'Jenkins',
            'Perry',
            'Russell',
            'Sullivan',
            'Bell',
            'Coleman',
            'Butler',
            'Henderson',
            'Barnes',
            'Gonzales',
            'Fisher',
            'Vasquez',
            'Simmons',
            'Romero',
            'Jordan',
            'Patterson',
            'Alexander',
            'Hamilton',
            'Graham',
            'Reynolds',
            'Griffin',
            'Wallace',
            'Moreno',
            'West',
            'Cole',
            'Hayes',
            'Bryant',
            'Herrera',
            'Gibson',
            'Ellis',
            'Tran',
            'Medina',
            'Aguilar',
            'Stevens',
            'Murray',
            'Ford',
            'Castro',
            'Marshall',
            'Owens',
            'Harrison',
            'Fernandez',
            'McDonald',
            'Woods',
            'Washington',
            'Kennedy',
            'Wells',
            'Vargas',
            'Henry',
            'Chen',
            'Freeman',
            'Webb',
            'Tucker',
            'Guzman',
            'Burns',
            'Crawford',
            'Olson',
            'Simpson',
            'Porter',
            'Hunter',
            'Gordon',
            'Mendez',
            'Silva',
            'Shaw',
            'Snyder',
            'Mason',
            'Dixon',
            'Muñoz',
            'Hunt',
            'Hicks'
        ];

        $villages = [
            'Mangani',
            'Mzeru',
            'Chilumba',
            'Walala',
            'Chimanga',
            'Mkanda',
            'Mzimba',
            'Nkhata Bay',
            'Salima',
            'Zomba',
            'Blantyre',
            'Lilongwe',
            'Mzuzu',
            'Kasungu',
            'Karonga',
            'Dedza',
            'Mchinji',
            'Ntcheu',
            'Thyolo',
            'Mulanje',
            'Phalombe',
            'Chikwawa',
            'Nsanje',
            'Balaka',
            'Machinga',
            'Mangochi',
            'Nkhotakota',
            'Rumphi',
            'Chitipa',
            'Likoma'
        ];

        $traditionalAuthorities = [
            'Msambi',
            'Mkhoma',
            'Mzimba',
            'Manana',
            'Kasanzi',
            'Kachindamoto',
            'Kalonga',
            'Kaphuka',
            'Mankhamba',
            'Maseko',
            'Chikowi',
            'Lundu',
            'Nyachikadza',
            'Makanjira',
            'Malemia',
            'Nthondo',
            'Makanjira',
            'Mbelwa',
            'Chitipa',
            'Mwalweni'
        ];

        $districts = [
            'Karonga',
            'Nkhata Bay',
            'Mzuzu',
            'Rumphi',
            'Chitipa',
            'Lilongwe',
            'Dedza',
            'Ntcheu',
            'Salima',
            'Dowa',
            'Mchinji',
            'Kasungu',
            'Nkhotakota',
            'Ntchisi',
            'Blantyre',
            'Chiradzulu',
            'Mulanje',
            'Phalombe',
            'Thyolo',
            'Zomba',
            'Machinga',
            'Mangochi',
            'Balaka',
            'Ntcheu',
            'Chikwawa',
            'Nsanje',
            'Likoma'
        ];

        $sexes = ['Male', 'Female'];

        // Class distribution
        $classDistribution = [
            'Form 1' => 60,
            'Form 2' => 190,
            'Form 3' => 140,
            'Form 4' => 110  // 500 - 60 - 190 - 140 = 110
        ];

        $this->command->info('Creating 500 students with the following distribution:');
        foreach ($classDistribution as $class => $count) {
            $this->command->info("  - {$class}: {$count} students");
        }

        $totalCreated = 0;

        foreach ($classDistribution as $className => $count) {
            $this->command->info("Creating {$count} students for {$className}...");

            // Extract class number for abbreviation
            $classNumber = preg_replace('/[^0-9]/', '', $className);
            $classAbbreviation = 'F' . $classNumber;

            for ($i = 1; $i <= $count; $i++) {
                // Generate unique username
                $username = Helper::StudentIdGenerator(new Student, 'username', 3, $schoolAbbreviation . '/' . $classAbbreviation . '/');

                // Create student record
                Student::create([
                    'firstname' => $firstnames[array_rand($firstnames)],
                    'surname' => $surnames[array_rand($surnames)],
                    'username' => $username,
                    'sex' => $sexes[array_rand($sexes)],
                    'village' => $villages[array_rand($villages)],
                    'traditional_authority' => $traditionalAuthorities[array_rand($traditionalAuthorities)],
                    'district' => $districts[array_rand($districts)],
                    'className' => $className,
                    'level_id' => \App\Models\Level::where('className', $className)->value('id'),
                    'role_name' => 'Student',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);

                $totalCreated++;

                // Show progress every 50 students
                if ($totalCreated % 50 == 0) {
                    $this->command->info("Created {$totalCreated}/500 students...");
                }
            }
        }

        $this->command->info("Successfully created {$totalCreated} students!");

        // Show final distribution
        $this->command->info("\nFinal distribution:");
        foreach ($classDistribution as $className => $expected) {
            $actual = Student::whereHas('level', function ($q) use ($className) {
                $q->where('className', $className);
            })->count();
            $this->command->info("  - {$className}: {$actual} students");
        }
    }
}
