<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentResource extends JsonResource
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
            'firstAssessment' => $this->firstAssessment,
            'secondAssessment' => $this->secondAssessment,
            'endofTermAssessment' => $this->endOfTermAssessment,
            'averageScore' => $this->averageScore

        ];
    }
}
