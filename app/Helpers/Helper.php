<?php

namespace App\Helpers;

use App\Models\Student;

class Helper
{
    public static function StudentIdGenerator($model, $trow, $minLength = 3, $classPrefix)
    {
        $data = $model::where($trow, 'LIKE', $classPrefix . '%')->orderBy('id', 'desc')->first();
        
        // If no record exists or class prefix has changed, reset the increment
        if (!$data) {
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
