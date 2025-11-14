<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'title' => $this->title,
            'firstname' => $this->firstname,
            'surname' => $this->surname,
            'email' => $this->email,
            'sex' => $this->sex,
            'village' => $this->village,
            'traditional_authority' => $this->traditional_authority,
            'district' => $this->district,
            'role_name' => $this->role_name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'subjects' => $this->subjects,
            'departments' => DepartmentResource::collection($this->departments),
            'is_in_department' => $this->is_in_department,
        ];
    }
}
