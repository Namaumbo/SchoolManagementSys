<?php

namespace App\Helpers;
use App\Models\School;

class Helper {
  

public static function StudentIdGenerator($model,$trow,$length=3,$prefix){
$data=$model::orderby('id','desc')->first();
if(!$data){
    $log_length=$length;
    $last_number='';
}else{
    $code=substr($data->$trow,strlen($prefix)+1);
    $actual_last_number=($code/1)*1;
    $increment_last_number=$actual_last_number+1;
    $last_number_length=strlen($increment_last_number);
    $log_length=$length-$last_number_length;
    $last_number=$increment_last_number;
}
$zeros="";

for($i=0;$i<$log_length;$i++){
    $zeros.="1";
    
}

return $prefix."00".$zeros.$last_number ; 
}

}

 



?>