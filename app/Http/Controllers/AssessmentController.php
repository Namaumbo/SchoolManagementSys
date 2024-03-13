<?php

namespace App\Http\Controllers;
use App\Services\AssessmentService;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{

   protected $assessmentService ;
    public function __construct(AssessmentService $AssessmentService)

    {
       $this->assessmentService = $AssessmentService;
    }
   
   public function updateAssessment(Request $AssessmentService)
   {
    return $this->assessmentService->updateAssessment($AssessmentService);
      }

   //    public function deleteAssessment(int $id){
   //       return $this->AssessmentService->deleteAssessmentsForStudentAndSubject($id);
   //   }

   }
   


