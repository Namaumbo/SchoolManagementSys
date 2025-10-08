<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Level;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AssessmentService
{
    public function updateAssessment(Request $request): JsonResponse
    {
        $response = [];
        $code = 200; // Default success code

        try {
            Log::info('Starting assessment update/create process', ['request' => $request->all()]);
            DB::beginTransaction();

            // Relaxed validation to allow partial updates
            $this->validateInput($request);
            Log::info('Input validation passed');

            $subject = Subject::where('name', $request->input('name'))->firstOrFail();
            Log::info('Subject found', ['subject_id' => $subject->id, 'name' => $subject->name]);

            $student = Student::where('username', $request->input('username'))->firstOrFail();
            Log::info('Student found', ['student_id' => $student->id, 'username' => $student->username]);

            // Optional assessments
            $firstAssessment = $request->has('firstAssessment')
                ? $this->validateNumeric($request->input('firstAssessment'))
                : null;

            $secondAssessment = $request->has('secondAssessment')
                ? $this->validateNumeric($request->input('secondAssessment'))
                : null;

            $endOfTermAssessment = $request->has('endOfTermAssessment')
                ? $this->validateNumeric($request->input('endOfTermAssessment'))
                : null;

            Log::info('End of term assessment processed successfully');

            $averageScore = $this->calculateAverageScore($firstAssessment, $secondAssessment, $endOfTermAssessment);
            Log::info('Average score calculated', ['averageScore' => $averageScore]);



            $assessmentSearchAttributes = [
                'subject_id' => $subject->id,
                'student_id' => $student->id,
            ];

            // Only update fields that were provided
            $assessmentDataToUpdateOrCreate = [
                'schoolTerm' => $request->input('schoolTerm'),
                'teacherEmail' => $request->input('teacherEmail'),
                'updated_at' => Carbon::now(),
            ];

            if (!is_null($firstAssessment)) {
                $assessmentDataToUpdateOrCreate['firstAssessment'] = $firstAssessment;
            }

            if (!is_null($secondAssessment)) {
                $assessmentDataToUpdateOrCreate['secondAssessment'] = $secondAssessment;
            }

            if (!is_null($endOfTermAssessment)) {
                $assessmentDataToUpdateOrCreate['endOfTermAssessment'] = $endOfTermAssessment;
            }

            $assessmentDataToUpdateOrCreate['averageScore'] = $averageScore;

            $assessment = Assessment::updateOrCreate(
                $assessmentSearchAttributes,
                $assessmentDataToUpdateOrCreate
            );

            Log::info('Assessment updated/created successfully', ['assessment_id' => $assessment->id]);

            DB::commit();

            $response['message'] = 'Assessment updated successfully';
            $response['status'] = 'success';
            $response['data'] = $assessment->fresh();
        } catch (\InvalidArgumentException | ValidationException $e) {
            DB::rollBack();
            Log::error('Validation or Invalid Argument error occurred', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $response['message'] = $e->getMessage();
            $response['description'] = 'Invalid data provided. Please check your input and try again.';
            $response['status'] = 'fail';
            $code = 400;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Unexpected error occurred', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $response['message'] = 'An error occurred while processing the assessment.';
            $response['description'] = 'Please contact the IT officer.';
            $response['status'] = 'fail';
            $code = 500;
        }

        return response()->json($response, $code);
    }
    private function validateNumeric($value)
    {
        if (!is_numeric($value) || $value < 0 || $value > 100) {
            throw new \InvalidArgumentException('Invalid assessment value. Values must be between 0 and 100.');
        }

        return (float) $value;
    }


    private function validateInput(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'username' => 'required|string',
            'schoolTerm' => 'required|string',
            'teacherEmail' => 'required|email',
            'firstAssessment' => 'sometimes|numeric|min:0|max:100',
            'secondAssessment' => 'sometimes|numeric|min:0|max:100',
            'endOfTermAssessment' => 'sometimes|numeric|min:0|max:100',
        ]);
    }

    private function calculateAverageScore($firstAssessment, $secondAssessment, $endOfTermAssessment)
    {
        $components = [];

        if (!is_null($firstAssessment)) {
            $components[] = $firstAssessment;
        }

        if (!is_null($secondAssessment)) {
            $components[] = $secondAssessment;
        }

        if (!is_null($endOfTermAssessment)) {
            $components[] = $endOfTermAssessment;
        }

        if (empty($components)) {
            return 0;
        }

        return array_sum($components) / count($components);
    }


    // Fetch all assessments with student and subject relations
    public function getAllAssessments(Request $request): JsonResponse
    {
        try {
            Log::info('Fetching assessments', [
                'class_filter' => $request->input('class'),
                'student_filter' => $request->input('student'),
                'subject_filter' => $request->input('subject')
            ]);
        
            $className = $request->input('class');
        
            // Get level ID based on class name
            $level = Level::where('className', $className)->first();
            $level_id = $level ? $level->id : null;
        
            if (!$level_id) {
                Log::warning('No level found for class', ['class' => $className]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Class not found'
                ], 404);
            }
        
            // Fetch only assessments where the student's level matches the class
            $assessments = DB::select("
                SELECT 
                    a.*,
                    s.id as student_id, s.firstname, s.surname, s.username, s.sex, s.village, s.traditional_authority, s.district, s.level_id, s.created_at as student_created_at, s.updated_at as student_updated_at,
                    sub.id as subject_id, sub.name as subject_name, sub.code, sub.periodsPerWeek, sub.department, sub.description, sub.status, sub.created_at as subject_created_at, sub.updated_at as subject_updated_at
                FROM assessments a
                INNER JOIN students s ON a.student_id = s.id
                INNER JOIN levels l ON s.level_id = l.id
                INNER JOIN subjects sub ON a.subject_id = sub.id
                WHERE l.id = ?
            ", [$level_id]);

        // old structure
            // {
            //     "id": 1,
            //     "schoolTerm": "First Term",
            //     "teacherEmail": null,
            //     "subject_id": 1,
            //     "student_id": 17,
            //     "firstAssessment": 77,
            //     "secondAssessment": 87,
            //     "endOfTermAssessment": 33,
            //     "averageScore": 66,
            //     "created_at": null,
            //     "updated_at": "2025-07-31T20:06:25.000000Z",
            //     "student": [
            //         {
            //             "id": 17,
            //             "is_deleted": 0,
            //             "firstname": "Martin",
            //             "surname": "Chunga",
            //             "username": "CPS/F1/014",
            //             "sex": "male",
            //             "village": "Chemboma",
            //             "traditional_authority": "Chikumbu",
            //             "district": "Dedza",
            //             "level_id": 1,
            //             "role_name": "Student",
            //             "created_at": "2025-07-30T19:44:15.000000Z",
            //             "updated_at": "2025-07-30T19:44:15.000000Z"
            //         }
            //     ],
            //     "subject": {
            //         "id": 1,
            //         "name": "English",
            //         "code": 1,
            //         "periodsPerWeek": 4,
            //         "department": "Language",
            //         "description": "Reading comprehension and basic grammar\t",
            //         "status": "active",
            //         "created_at": "2025-04-06T00:00:00.000000Z",
            //         "updated_at": "2025-04-06T00:00:00.000000Z"
            //     }
            // },

            // new strcuture
            // {
            //     "id": 12,
            //     "schoolTerm": "First Term",
            //     "teacherEmail": null,
            //     "subject_id": 1,
            //     "student_id": 18,
            //     "firstAssessment": 70,
            //     "secondAssessment": 67,
            //     "endOfTermAssessment": 0,
            //     "averageScore": 46,
            //     "created_at": null,
            //     "updated_at": "2025-07-31 20:14:34",
            //     "firstname": "Daniel",
            //     "surname": "Lembani",
            //     "username": "CPS/F2/001",
            //     "sex": "male",
            //     "village": "Msanjama",
            //     "traditional_authority": "kabudula",
            //     "district": "Kasungu",
            //     "level_id": 2,
            //     "student_created_at": "2025-07-31 20:09:44",
            //     "student_updated_at": "2025-07-31 20:09:44",
            //     "subject_name": "English",
            //     "code": 1,
            //     "periodsPerWeek": 4,
            //     "department": "Language",
            //     "description": "Reading comprehension and basic grammar\t",
            //     "status": "active",
            //     "subject_created_at": "2025-04-06 00:00:00",
            //     "subject_updated_at": "2025-04-06 00:00:00"
            // },


            Log::info('Assessments found', ['count' => count($assessments)]);
        
            return response()->json([
                'status' => 'success',
                'data' => collect($assessments),
                // 'total' => $assessments->count(),
            ], 200);
        
        } catch (\Exception $e) {
            Log::error('Error fetching assessments', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong'
            ], 500);
        }

       
    }

    public function getAssessmentsByClass(Request $request): JsonResponse
    {
        try {

            // Get the 'class' parameter from the URL (request)
            $className = $request->input('className');

            Log::info('Fetching assessments by class', ['class' => $request->input('className')]);

            $level = Level::where('className', $className)->first();
            $level_id = $level ? $level->id : null;

            $assessments = Assessment::whereHas('student.level', function ($query) use ($level_id) {
                $query->where('id', $level_id);
            })
                ->with(['student', 'subject'])
                ->get();

                
            return response()->json([
                'status' => 'success',
                'data' => $assessments,
                'total' => $assessments->count(),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving assessments by class', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'fail',
                'message' => 'Error retrieving assessments by class',
                'description' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'data' => $assessments,
            'total' => $assessments->count(),
        ], 200);
    }
}
