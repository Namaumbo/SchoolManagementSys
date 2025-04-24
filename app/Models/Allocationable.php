<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\Pivot;


class Allocationable extends pivot
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
