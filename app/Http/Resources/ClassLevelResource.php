<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ClassLevelResource extends JsonResource
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

            'ClassName' => $this->className,
            'subject_id' => $this->subject_id,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,


        ];
    }
}
