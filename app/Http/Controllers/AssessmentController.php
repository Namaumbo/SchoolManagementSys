<?php

namespace App\Http\Controllers;
use App\Services\AssessmentService;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function __construct(AssessmentService $AssessmentService)

    {
       $this->AssessmentService = $AssessmentService;


    }
    //getting users from the database
   public function UpdateAssessment(Request $AssessmentService,int $id)
   {

    return $this->AssessmentService->updateAssessment($AssessmentService,$id);
      }

   }
   


