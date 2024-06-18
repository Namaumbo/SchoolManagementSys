<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SchoolInformationService;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\Log;



class SchoolInformationController extends Controller
{

    protected $schoolInformation;
    public function __construct(SchoolInformationService $schoolInformation)
    {
        $this->schoolInformation = $schoolInformation;
    }


    /**
     * Store the school information.
     *
     * @param \Illuminate\Http\Request $request The request object.
     * @return \Illuminate\Http\JsonResponse The JSON response.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Save the school information
            $response = $this->schoolInformation->save();

            $data = json_decode($response->getContent(), true);

            if ($response->status() === 201) {
             Log::debug("School information saved successfully" . print_r($data, true));
            }
            return $response;
            
        } catch (\Exception $e) {
            Log::error("Failed to save school information: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to save school information',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
