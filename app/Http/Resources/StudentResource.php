<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'firstname' => $this->firstname,
            'surname' => $this->surname,
            'username' => $this->username,
            'village' => $this->village,
            'traditional_authority' => $this->traditional_authority,
            'district' => $this->district,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'assessments' => AssessmentResource::collection($this->assessments)
           // 'st' => StudentAssessmentResource::collection($this->students_assessments),


        ];
    }



}
