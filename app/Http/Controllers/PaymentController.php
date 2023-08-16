<?php

namespace App\Http\Controllers;
use App\Models\Payment;
use App\Models\Student;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\EntityNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Excel;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class PaymentController extends Controller
{   public function create(Request $request, $payment)
    {
        $payment->amount = $request->amount;

        $payment->created_at = carbon::now();
        $payment->updated_at = carbon::now();
        $payment->save();
    }


public function feesToStudent(Request $request)
{
    $student = Student::where('username', $request->input('username'))->first();
   
    //class will be needed here
    
    if (!$student) {
        return response()->json("Information provided doesnt exists");
    }
    $payment = new Payment;
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