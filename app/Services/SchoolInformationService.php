<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Models\SchoolInformation;
use Illuminate\Http\Request;

class SchoolInformationService
{
    /**
     * This method validates the user's input.
     * 
     * @param \Illuminate\Http\Request $request The request object.
     * @return array The validated input.
     */
    public function getInputs(Request $request) : array
    {
        Log::info('Getting and Validating inputs');
        return $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'phone_number' => 'required|digits:11',
            'logo_path' => 'required|string',
        ]);
    }

    /**
     * This method saves the school information into the database.
     * 
     * It first validates the user's input by calling the getInputs method.
     * The validated input is then used to create a new instance of the SchoolInformation model.
     * The model's attributes are set with the validated input using mass assignment.
     * Finally, the model is saved into the database.
     * 
     * @return JsonResponse
     */
    public function save(): JsonResponse
    {
        try {
            Log::info("Request data available ..." );

            // Get the validated input from the user's request
            $request = $this->getInputs(request());

            Log::info("Request data: " . print_r($request, true));
 
            // Create a new instance of the SchoolInformation model
            $school = new SchoolInformation();

            // Set the model's attributes with the validated input using mass assignment
            $school->fill($request);

            // Save the model into the database
            if (!$school->save()) {
                throw new \Exception('Failed to save school information');
            }

            return response()->json([
                'message' => 'School information saved successfully',
                'status' => 'success',
                'school' => $school,
            ], 201);

        } catch (\Exception $e) {
            // Log the exception details for debugging and monitoring
            Log::error('Error saving school information: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error saving school information',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * This method generates an abbreviation for the school name.
     * 
     * @param string $name The name of the school.
     * @return string The abbreviation of the school name.
     */
    private function generateAbbreviation(string $name): string
    {
        $words = explode(' ', $name);

        // Initialize the abbreviation with the first letter of the first word
        $abbreviation = '';

        if (isset($words[0][0])) {
            $abbreviation .= strtoupper($words[0][0]);
        }

        // Append 'SMIS' to the abbreviation
        return $abbreviation . 'SMIS';
    }

    /**
     * This method retrieves school information from the database.
     * 
     * @return JsonResponse
     */
    public function getSchoolInformation(): JsonResponse
    {
        try {
            // Retrieve all school information from the database
            $schools = SchoolInformation::all();

            // Generate abbreviation for each school
            foreach ($schools as $school) {
                $school->abbreviation = $this->generateAbbreviation($school->name);
            }

            return response()->json([
                'message' => 'Successfully retrieved all school information',
                'status' => 'success',
                'schools' => $schools,
            ], 200);

        } catch (\Exception $e) {
            // Log the exception details for debugging and monitoring
            Log::error('Error fetching all school information: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching all school information',
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
