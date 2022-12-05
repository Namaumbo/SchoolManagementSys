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
            'firstname' => $this->firstname,
            'surname' => $this->surname,
            'email' => $this->email,
            'password' =>$this->password,
            'class'=>$this->class,
            'village' => $this->location,
            'traditional_authority' => $this->traditional_authority,
            'district' => $this->district,
            'Role_as' => $this->Role_as,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,


        ];
    }



}
