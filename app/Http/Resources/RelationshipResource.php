<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentAssessmentResource extends JsonResource
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
            'student_id' => $this->student_id,
            'assessment_id' => $this->assessment_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
           // 'students_assessments' => StudentResource::collection($this->students_assessments),


        ];    }
}
