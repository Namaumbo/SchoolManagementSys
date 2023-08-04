<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Collection
     */
   

    public function getAll()
    {
        return Department::all();
//        return DepartmentResource::collection(Department::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function store(Request $request): JsonResponse
    {

        $request->validate([
            'departmentName' => 'required|max:255',
        ]);

        $departmentName = $request->input('departmentName');
        if (Department::where('departmentName', $departmentName)->first()) {
            return \response()->json(['message' => "department available", $departmentName],
                ResponseAlias::HTTP_CONFLICT);
        } else {
            try {
                $department = Department::create([
                    'departmentName' => $request->input('departmentName'),
                    'headOfDepartment' => $request->input('headOfDepartment'),
                    'created_at' => carbon::now(),
                    'updated_at' => carbon::now()
                ]);
                return response()->json([
                    'message' => 'Department saved successfully',
                    'Department' => $department,
                    'status' => 201,
                ],ResponseAlias::HTTP_CREATED);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Department not saved',
                    'error' => $e,
                    'status' => 201,
                ]);
            }
        }

    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return DepartmentResource
     */
    public function show($id)
    {
//        return Department::find($id);

        return new DepartmentResource(Department::findorFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return Response|null
     */
    public function edit(int $id): ?Response
    {
        return null;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        if (Department::where('id', $id)->exists()) {
            $department = Department::find($id);
            $department->departmentName = $request->departmentName;
            $department->headOfDepartment = $request->headOfDepartment;
            $department->created_at = carbon::now();
            $department->updated_at = carbon::now();
            $department->save();
            return response()->json([
                'message' => 'Department is updated successfully'

            ], 400);
        } else {
            return response()->json([
                'message' => 'No Department found with that information '
            ], 401);
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        if (Department::where('id', $id)->exists()) {
            $department = Department::find($id);
            $department->delete();
            return response()->json([
                'message' => 'Department is deleted successfully'
            ], 404);

        } else {
            return response()->json([
                'message' => 'No Department found with that information ',
            ]);
        }
    }
}
