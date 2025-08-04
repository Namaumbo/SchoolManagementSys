<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'periodsPerWeek' => $this->periodsPerWeek,
            'department' => $this->department,
            'description' => $this->description,
            'status' => $this->status,
            'departments' => DepartmentResource::collection($this->departments),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
