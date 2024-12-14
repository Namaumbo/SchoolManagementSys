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

class StudentService
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudents(): JsonResponse
    {
        $students = Student::with('subjects')->get();
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
        $schoolInfo = SchoolInformation::first();
        if (!$schoolInfo) {
            throw new Exception('School information not found');
        }

        // Generate the school abbreviation
        $schoolAbbreviation = $this->generateSchoolAbbreviation($schoolInfo->name);

        $student->firstname = $request->firstname;
        $student->surname = $request->surname;
        $student->className = $request->className;

        // Extract the numeric part from the className (e.g., "Form 1" => "1")
        $classNumber = preg_replace('/[^0-9]/', '', $student->className);
        // Determine the prefix based on the class abbreviation (e.g., "Form 1" => "F1")
        $classAbbreviation = 'F' . $classNumber;

        // Generate the student username in the format "SCHOOL_ABBR/F1/001", "SCHOOL_ABBR/F2/001", etc.
        $student->username = Helper::StudentIdGenerator(new Student, 'username', 3, $schoolAbbreviation . '/' . $classAbbreviation . '/');

        $student->sex = $request->sex;
        $student->village = $request->village;
        $student->traditional_authority = $request->traditional_authority;
        $student->district = $request->district;
        $student->role_name = $request->role_name;
        $student->created_at = Carbon::now();
        $student->updated_at = Carbon::now();
        $student->save();

        // Check if the student is in Form 1 or Form 2
        if ($classNumber === '1' || $classNumber === '2') {
            // Register all subjects for Form 1 and Form 2
            $allSubjects = Subject::all();
            foreach ($allSubjects as $subject) {
                $student->subjects()->syncWithoutDetaching($subject, ["name" => $subject->name]);
            }
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
                'sex' => 'required|in:Male,Female',
                'village' => 'required|string',
                'traditional_authority' => 'required|string',
                'district' => 'required|string',
                'role_name' => 'required|string'
            ]);

            if ($validator->fails()) {
                $response['message'] = 'Validation failed';
                $response['status'] = 'error';
                $response['description'] = $validator->errors();
                return response()->json($response, 422);
            }

            $student = Student::where('username', $request->input('username'))->first();
            if ($student) {
                $response['message'] = 'Student already exists';
                $response['status'] = 'error';
                $response['student'] = $student;
                $response['description'] = 'A student with this username already exists in the system';
                $code = 409;
            } else {
                DB::beginTransaction();
                try {
                    $student = new Student;
                    $this->create($request, $student);
                    DB::commit();

                    $response['message'] = 'Student saved successfully';
                    $response['status'] = 'success';
                    $response['student'] = $student;
                    $response['description'] = 'Student has been registered successfully';
                    $code = 201;
                } catch (\Exception $e) {
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
