<?php
// app/Exceptions/Handler.php

// app/Exceptions/Handler.php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof ModelNotFoundException || $exception instanceof NotFoundHttpException) {
            return $this->handleSpecificExceptions($request, $exception);
        }

        return parent::render($request, $exception);
    }

    private function handleSpecificExceptions($request, $exception): JsonResponse
    {
        if ($request->is('api/user/*')) {
            return response()->json([
                'error' => 'User Not Found',
                'message' => 'The user does not exist in the database.'
            ], 404);
        } elseif ($request->is('api/subjects/*')) {
            return response()->json([
                'error' => 'Subject Not Found',
                'message' => 'Subject does not exist in the database.'
            ], 404);
        } elseif ($request->is('api/update-department/*')) {
            return response()->json([
                'error' => 'Department Not Found',
                'message' => 'There is no such department in the database.'
            ], 404);
        }

        // If no specific condition matches, return a generic JSON response
        return response()->json([
            'error' => 'Not Found',
            'message' => 'The requested resource was not found.'
        ], 404);
    }
}

