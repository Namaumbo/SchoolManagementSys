<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SchoolInformationService;
use Illuminate\Http\JsonResponse;


class SchoolInformationController extends Controller
{

    /**
     * Store the school information.
     *
     * @param \Illuminate\Http\Request $request The request object.
     * @return \Illuminate\Http\JsonResponse The JSON response.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $school = new SchoolInformationService();
            $school->save();

            return response()->json([
                'message' => 'School information saved successfully',
                'status' => 'success',
                'school' => $school,
            ],201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save school information',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
