<?php

namespace App\Http\Controllers;

use App\Services\AssessmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    protected $assessmentService;

    // Constructor to inject AssessmentService
    public function __construct(AssessmentService $assessmentService)
    {
        $this->assessmentService = $assessmentService;
    }

    // Update assessment for a specific student and subject
    public function updateAssessment(Request $request): JsonResponse
    {
        return $this->assessmentService->updateAssessment($request);
    }

    // Delete assessment for a specific ID (student and subject)
    public function deleteAssessment(int $id): JsonResponse
    {
        return $this->assessmentService->deleteAssessmentsForStudentAndSubject($id);
    }

    // Get all assessments with associated student and subject data
    public function getAllAssessments(): JsonResponse
    {
 
        return $this->assessmentService->getAllAssessments();
    }
}
