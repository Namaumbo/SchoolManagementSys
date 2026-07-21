<?php

namespace App\Http\Controllers;

use App\Services\ExaminationManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExaminationManagementController extends Controller
{
    protected ExaminationManagementService $examinationManagement;

    public function __construct(ExaminationManagementService $examinationManagement)
    {
        $this->examinationManagement = $examinationManagement;
    }

    public function index(): JsonResponse
    {
        return $this->examinationManagement->getAll();
    }

    public function updateSettings(Request $request): JsonResponse
    {
        return $this->examinationManagement->updateSettings($request);
    }

    public function storeGradingScale(Request $request): JsonResponse
    {
        return $this->examinationManagement->createGradingScale($request);
    }

    public function updateGradingScale(Request $request, int $id): JsonResponse
    {
        return $this->examinationManagement->updateGradingScale($request, $id);
    }

    public function destroyGradingScale(int $id): JsonResponse
    {
        return $this->examinationManagement->deleteGradingScale($id);
    }
}
