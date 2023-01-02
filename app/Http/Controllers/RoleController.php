<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Models\Role;
use App\Models\User;

use Illuminate\Http\JsonResponse;

use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use phpDocumentor\Reflection\Types\Collection;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(): AnonymousResourceCollection
    {
        return RoleResource::collection(Role::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $role)
    {
        $role->role_name = $request->role_name;
        $role->created_at = carbon::now();
        $role->updated_at = carbon::now();
        $role->save();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
    $role = Role::where('role_name', $request->input('role_name'))->first();
    if ($role) {
        return response()->json(
            ['message' => 'The role was arleady created', 'role_name' => $role],
        );
    }
    try {
        $role = new Role;
        $this->create($request, $role);
        return response()->json([
            'message' => 'Role created successfully',
            'Role' => $role,
            'status' => 200,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Role not saved',
            'Role' => $role,
            'status' => 400,
            '4' => $e,
        ]);
    }
}

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function UserToRoles(Request $request, int $id): JsonResponse|EntityNotFoundException
    {
        $user = User::where('id', $id)->first();
        if ($user) {
            try {
                $role = Role::where('role_name', $request->input('role_name'))->first();
                if ($role) {
                    $user->roles()->syncWithoutDetaching($role);
                    return response()->json(['message' => 'Role added to User']);
                }
            } catch (EntityNotFoundException $entityNotFoundException)
             {
                return $entityNotFoundException;
            }
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $id)
    {
        if (Role::where('id', $id)->exists()) {
            $role = Role::find($id);
            $this->create($request, $role);
            return response()->json([
                'message' => 'The role is updated successfully'
            ], 400);
        } else {
            return response()->json([
                'message' => 'No such Role found in the database '
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (Role::where('id', $id)->exists()) {
            $role =Role::find($id);
            $role->delete();
            return response()->json([
                'message' => 'The role is deleted successfully'
            ], 404);
        } else {
            return response()->json([
                'message' => 'No  role found in the database ',
            ]);
        }
    
    }
}
