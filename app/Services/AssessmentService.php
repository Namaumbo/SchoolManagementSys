<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\Student;
use App\Models\User;
use App\Models\Relationship;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Resources\RelationshipResource;

use App\Http\Resources\AssessmentResource;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AssessmentService
{

    public function updateAssessment(Request $request, int $student_id): JsonResponse
    {
        $response = [];
        $code = 200;
        // using the assessment model am searching if student exists
        $studentRecords   = Assessment::find($student_id);
        
        if ($studentRecords) {
            try {
                //the subject will be there already on the list of assignments from the frontend
                $subject = Subject::select('id')->where('name', $request->input('name'))->first();

                if ($subject) {
                    $firstAssessment  = $request->input('firstAssessment');
                    $secondAssessment = $request->input('secondAssessment');
                    $finalExam = $request->input('endOfTermAssessment');

                    Assessment::where('student_id', $student_id)->where('subject_id', $subject->id)->update([
                        'schoolTerm' => $request->input('schoolTerm'),
                        'teacherEmail' => $request->input('teacherEmail'),
                        'firstAssessment' => $request->input('firstAssessment'),
                        'secondAssessment' => $request->input('secondAssessment'),
                        'endOfTermAssessment' => $request->input('endOfTermAssessment'),
                        'averageScore' => ($firstAssessment + $secondAssessment) * 0.2 + ($finalExam) * 0.6,
                        'created_at' => carbon::now(),
                        'updated_at' => carbon::now()
                    ]);
                    $response['message'] = 'Assessment updated successfully';
                    $response['status'] = 'Success';
                    $code = 200;
                }
            } catch (\Exception $e) {
                $response['message'] = $e->getMessage();
                $response['description'] = 'error encountered please contact the IT officer';
                $response['status'] = 'fail';
                $code = 500;
            }
        } else {
            $response = [
                'message' => 'Student not found',
                'status' => 'fail',
            ];
            $code = 404;
        }

        


        return response()->json($response, $code);
    }
}
