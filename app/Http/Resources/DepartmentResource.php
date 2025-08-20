<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'departmentName' => $this->departmentName,
            'departmentCode' => $this->departmentCode,
            'description' => $this->description,
            'headOfDepartment' => $this->whenLoaded('headOfDepartment', function () {
                return [
                    'id' => $this->headOfDepartment->id,
                    'title' => $this->headOfDepartment->title,
                    'firstname' => $this->headOfDepartment->firstname,
                    'surname' => $this->headOfDepartment->surname,
                    'email' => $this->headOfDepartment->email,
                    'fullName' => $this->headOfDepartment->title . ' ' .
                        $this->headOfDepartment->firstname . ' ' .
                        $this->headOfDepartment->surname,
                ];
            }),          
        ];
    }
}
