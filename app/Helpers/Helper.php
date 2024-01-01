<?php

namespace App\Helpers;
use App\Models\School;

class Helper {
  

    public static function StudentIdGenerator($model, $trow, $minLength = 3, $classPrefix)
    {
        $data = $model::orderBy('id', 'desc')->first();
    
        // Check if the className has changed, if yes, reset the increment
        if (!$data || strpos($data->$trow, $classPrefix) === false) {
            $last_number = 1;
        } else {
            $code = intval(substr($data->$trow, strlen($classPrefix)));
            $increment_last_number = $code + 1;
            $last_number = $increment_last_number;
        }
    
        return $classPrefix . str_pad($last_number, $minLength, '0', STR_PAD_LEFT);
    }
    

    

}

 



?>

