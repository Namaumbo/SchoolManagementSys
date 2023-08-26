<?php

namespace App\Exceptions;
use Throwable;

use Exception;

class GeneralException extends Exception
{
    public function register(){
     $this->renderable (function(ModelNotFoundException $e,$request){
        if($request->wantsJson() || $request->is('api/update-user/{id}'))
         return response()->json([
        'message'=>'The user doesnt exist in the database'],404);
       
        else if($request->wantsJson() || $request->is('api/update-subject/{id}'))
         return response()->Json([
        'message'=>'Subject doesnt exists in the database'],404);
       
        else if($request->wantsJson() || $request->is('api/update-department/{id}'));
          return response()->Json([
            
            'message'=>'There is no such a department in the database']);
     });
    }


}
