<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Allocationable extends Model
{
    use HasFactory;
    protected $table = "allocationables";
    protected $fillable=[

         'user_id',
         'allocationable_id',
         'allocatiobable_type',
         'created_at',
         'updated_at'
       
        ];
      
 
  


   
  
    
 
}
