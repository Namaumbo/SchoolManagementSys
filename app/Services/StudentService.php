<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Helpers\Helper;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\SchoolInformation;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class StudentService
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudents(): JsonResponse
    {
        $students = Student::with('subjects')->paginate(10);
        return response()->json($students, 200);
    }

    /**
     * Generate an abbreviation from the school name.
     *
     * @param string $schoolName
     * @return string
     */
    private function generateSchoolAbbreviation(string $schoolName): string
    {
        $words = explode(' ', $schoolName);
        $abbreviation = '';
        foreach ($words as $word) {
            $abbreviation .= strtoupper($word[0]);
        }
        return $abbreviation;
    }

    /**
     * Create or update a student record.
     *
     * @param Request $request
     * @param Student $student
     * @return void
     */
    public function create(Request $request, Student $student): void
    {
        // Fetch the school information
        Log::info('Fetching school information');
        $schoolInfo = SchoolInformation::first();
        if (!$schoolInfo) {
            Log::error('School information not found');
            throw new Exception('School information not found');
        }

        // Generate the school abbreviation
        Log::info('Generating school abbreviation', ['school_name' => $schoolInfo->name]);
        $schoolAbbreviation = $this->generateSchoolAbbreviation($schoolInfo->name);

        $student->firstname = $request->firstname;
        $student->surname = $request->surname;
        $student->className = $request->className;

        // Extract the numeric part from the className (e.g., "Form 1" => "1")
        $classNumber = preg_replace('/[^0-9]/', '', $student->className);
        // Determine the prefix based on the class abbreviation (e.g., "Form 1" => "F1")
        $classAbbreviation = 'F' . $classNumber;

        // Log student creation attempt
        Log::info('Creating new student record', [
            'firstname' => $request->firstname,
            'surname' => $request->surname,
            'className' => $request->className,
            'school_abbreviation' => $schoolAbbreviation,
            'class_abbreviation' => $classAbbreviation
        ]);

        // Generate the student username in the format "SCHOOL_ABBR/F1/001", "SCHOOL_ABBR/F2/001", etc.
        Log::info('Generating student username');
        $student->username = Helper::StudentIdGenerator(new Student, 'username', 3, $schoolAbbreviation . '/' . $classAbbreviation . '/');
        Log::info('Generated username', ['username' => $student->username]);

        $student->sex = $request->sex;
        $student->village = $request->village;
        $student->traditional_authority = $request->traditional_authority;
        $student->district = $request->district;
        $student->role_name = $request->role_name;
        $student->created_at = Carbon::now();
        $student->updated_at = Carbon::now();

        Log::info('Saving student record', ['student_data' => $student->toArray()]);
        $student->save();

        // Check if the student is in Form 1 or Form 2
        if ($classNumber === '1' || $classNumber === '2') {
            Log::info('Registering subjects for Form 1/2 student', ['class_number' => $classNumber]);
            // Register all subjects for Form 1 and Form 2
            $allSubjects = Subject::all();
            foreach ($allSubjects as $subject) {
                Log::debug('Registering subject for student', [
                    'student_id' => $student->id,
                    'subject' => $subject->name
                ]);
                $student->subjects()->syncWithoutDetaching($subject, ["name" => $subject->name]);
            }
            Log::info('Completed subject registration for student');
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $response = [
                'message' => '',
                'status' => '',
                'student' => null,
                'description' => ''
            ];
            $code = 200;

            $validator = Validator::make($request->all(), [
                'firstname' => 'required|string|max:255',
                'surname' => 'required|string|max:255',
                'className' => 'required|string',
                'sex' => 'required|in:Male,Female,MALE,FEMALE,male,female',
                'village' => 'required|string',
                'traditional_authority' => 'required|string',
                'district' => 'required|string',
                'role_name' => 'required|string'
            ]);

            Log::info('Validating student registration request', ['request' => $request->all()]);

            if ($validator->fails()) {
                $response['message'] = 'Validation failed';
                $response['status'] = 'error';
                $response['description'] = $validator->errors();
                return response()->json($response, 422);
            }

            Log::info('Done validating and Processing student registration request', ['request' => $request->all()]);


            $student = Student::where('firstname', $request->input('firstname'))
                ->where('surname', $request->input('surname'))->where('className', $request->input('className'))
                ->first();
            if ($student) {
                $response['message'] = 'Student already exists';
                $response['status'] = 'error';
                $response['student'] = $student;
                $response['description'] = 'A student with this username already exists in the system';
                $code = 409;
                Log::warning('Student already exists', ['username' => $request->input('username')]);
            } else {
                DB::beginTransaction();
                try {

                    Log::info('Creating a new student', ['request' => $request->all()]);
                    $student = new Student;
                    $this->create($request, $student);
                    DB::commit();

                    $response['message'] = 'Student saved successfully';
                    $response['status'] = 'success';
                    $response['student'] = $student;
                    $response['description'] = 'Student has been registered successfully';
                    $code = 201;
                    Log::info('Student created successfully', ['student' => $student]);
                } catch (\Exception $e) {
                    Log::error('Failed to create student', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);

                    DB::rollBack();
                    throw $e;
                }
            }
        } catch (\Exception $e) {
            $response['message'] = 'An error occurred while processing your request';
            $response['status'] = 'error';
            $response['description'] = config('app.debug') ? $e->getMessage() : 'Please contact system administrator';
            $code = 500;
        }
        return response()->json($response, $code);
    }
    /**
     * Register a subject to a student.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function registerSubjectToStudent(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'name' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'description' => $validator->errors()
                ], 422);
            }

            $student = Student::where('username', $request->input('username'))->first();
            $subject = Subject::where('name', $request->input('name'))->first();

            if (!$student) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No student found',
                    'description' => 'Please select a student from the list'
                ], 404);
            }

            if (!$subject) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No subject found',
                    'description' => 'Please select a subject from the list'
                ], 404);
            }

            DB::beginTransaction();
            try {
                $student->subjects()->syncWithoutDetaching([$subject->id => ['name' => $subject->name]]);
                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Subject added successfully',
                    'describedAs' => $subject->name,
                    'records' => $subject->students
                ], 200);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => config('app.debug') ? $e->getMessage() : 'Error encountered contact IT support',
                'description' => 'Error encountered contact IT support'
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $student = Student::find($id);

            if (!$student) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No Student found with that information',
                    'description' => 'Please ensure the student exists'
                ], 404);
            }

            DB::beginTransaction();
            try {
                $this->create($request, $student);
                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Student updated successfully',
                    'data' => $student
                ], 200);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => config('app.debug') ? $e->getMessage() : 'Error updating student',
                'description' => 'Error encountered, please contact IT support'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $student = Student::find($id);

            if (!$student) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No Student found with that information',
                    'description' => 'Please ensure the student exists'
                ], 404);
            }

            DB::beginTransaction();
            try {
                // Delete associated assessments
                Assessment::where('student_id', $student->id)->delete();

                // Detach subjects from the pivot table
                $student->subjects()->detach();

                // Delete the student
                $student->delete();

                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Student and associated records deleted successfully',
                    'data' => null
                ], 200);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => config('app.debug') ? $e->getMessage() : 'Error deleting student',
                'description' => 'Error encountered, please contact IT support'
            ], 500);
        }
    }
}
