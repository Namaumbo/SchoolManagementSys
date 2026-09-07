<?php

namespace App\Services;

use App\Models\ExaminationSetting;
use App\Models\GradingScale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ExaminationManagementService
{
    public function getAll(): JsonResponse
    {
        try {
            $settings = ExaminationSetting::first();

            if (!$settings) {
                $settings = ExaminationSetting::create([
                    'academic_year' => '2025/2026',
                    'current_term' => 'term2',
                    'first_assessment_enabled' => true,
                    'second_assessment_enabled' => true,
                    'end_of_term_enabled' => true,
                ]);
            }

            $juniorGrades = GradingScale::where('level', 'junior')
                ->orderBy('min_score')
                ->get()
                ->map(fn ($row) => $this->formatGrade($row));

            $seniorGrades = GradingScale::where('level', 'senior')
                ->orderBy('min_score')
                ->get()
                ->map(fn ($row) => $this->formatGrade($row));

            return response()->json([
                'status' => 'success',
                'message' => 'Examination management data retrieved successfully',
                'data' => [
                    'settings' => $this->formatSettings($settings),
                    'juniorGrades' => $juniorGrades,
                    'seniorGrades' => $seniorGrades,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching examination management data: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch examination management data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateSettings(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'academicYear' => 'required|string|max:20',
                'currentTerm' => 'required|in:term1,term2,term3',
                'allowedExamTypes' => 'required|array',
                'allowedExamTypes.firstAssessment' => 'required|boolean',
                'allowedExamTypes.secondAssessment' => 'required|boolean',
                'allowedExamTypes.endOfTerm' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $validated = $validator->validated();
            $settings = ExaminationSetting::first();

            if (!$settings) {
                $settings = new ExaminationSetting();
            }

            $settings->fill([
                'academic_year' => $validated['academicYear'],
                'current_term' => $validated['currentTerm'],
                'first_assessment_enabled' => $validated['allowedExamTypes']['firstAssessment'],
                'second_assessment_enabled' => $validated['allowedExamTypes']['secondAssessment'],
                'end_of_term_enabled' => $validated['allowedExamTypes']['endOfTerm'],
            ]);
            $settings->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Examination settings saved successfully',
                'data' => $this->formatSettings($settings),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error saving examination settings: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save examination settings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function createGradingScale(Request $request): JsonResponse
    {
        try {
            $validator = $this->gradeValidator($request->all());

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $validated = $validator->validated();
            $grade = GradingScale::create([
                'level' => $validated['level'],
                'min_score' => $validated['min'],
                'max_score' => $validated['max'],
                'grade' => strtoupper($validated['grade']),
                'analysis' => $validated['analysis'],
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Grade entry created successfully',
                'data' => $this->formatGrade($grade),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating grading scale: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create grade entry',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateGradingScale(Request $request, int $id): JsonResponse
    {
        try {
            $grade = GradingScale::find($id);

            if (!$grade) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Grade entry not found',
                ], 404);
            }

            $validator = $this->gradeValidator($request->all(), $id);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $validated = $validator->validated();
            $grade->update([
                'level' => $validated['level'],
                'min_score' => $validated['min'],
                'max_score' => $validated['max'],
                'grade' => strtoupper($validated['grade']),
                'analysis' => $validated['analysis'],
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Grade entry updated successfully',
                'data' => $this->formatGrade($grade->fresh()),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating grading scale: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update grade entry',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteGradingScale(int $id): JsonResponse
    {
        try {
            $grade = GradingScale::find($id);

            if (!$grade) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Grade entry not found',
                ], 404);
            }

            $grade->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Grade entry deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting grading scale: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete grade entry',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function gradeValidator(array $data, ?int $ignoreId = null)
    {
        return Validator::make($data, [
            'level' => 'required|in:junior,senior',
            'min' => 'required|integer|min:0|max:100',
            'max' => 'required|integer|min:0|max:100|gte:min',
            'grade' => 'required|string|max:5',
            'analysis' => 'required|string|max:255',
        ]);
    }

    private function formatSettings(ExaminationSetting $settings): array
    {
        return [
            'academicYear' => $settings->academic_year,
            'currentTerm' => $settings->current_term,
            'allowedExamTypes' => [
                'firstAssessment' => (bool) $settings->first_assessment_enabled,
                'secondAssessment' => (bool) $settings->second_assessment_enabled,
                'endOfTerm' => (bool) $settings->end_of_term_enabled,
            ],
        ];
    }

    private function formatGrade(GradingScale $grade): array
    {
        return [
            'id' => $grade->id,
            'level' => $grade->level,
            'min' => $grade->min_score,
            'max' => $grade->max_score,
            'grade' => $grade->grade,
            'analysis' => $grade->analysis,
        ];
    }
}
