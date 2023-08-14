<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LevelController extends Controller
{
      public function create(Request $request)
        {
            $class->amount = $request->amount;
    
            $class->created_at = carbon::now();
            $class->updated_at = carbon::now();
            $class->save();
        }
    
    
    public function feesToStudent(Request $request)
    {
        $student = Student::where('username', $request->input('username'))->first();
       
        //class will be needed here
        $class = Level::where('className', $request->input('name'))->first();
    
        if (!$student) {
            return response()->json("Information provided doesnt exists");
        }
        $class = new Payment;
                $this->create($request, $payment);
        $student->payments()->save($payment);
        
        return response()->json(
            [
                "message" => "Fees paid successfully to  " . $student->firstname.' '.$student->surname,
                "records" => $payment,
            ]
        );
    }

}
