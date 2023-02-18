<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    private mixed $departmentName;
    private mixed $headOfDepartment;

    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
        'departmentName' => $this->departmentName,
        'headOfDepartment' => $this->headOfDepartment,

    ];


    }
}
