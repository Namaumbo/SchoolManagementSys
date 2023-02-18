<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

use Illuminate\Http\Request;
use App\Http\Resources\MessageResource;
use App\Models\Message;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllMessages()
    {
        return  MessageResource::collection(Message::all());

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $message)
    {
        $message->title = $request->title;
        $message->messageBody = $request->messageBody;
        $message->created_at = carbon::now();
        $message->updated_at = carbon::now();
        $message->save();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        $message =  Message::where('id', $request->input('id'))->first();
        if ($message) {
            return response()->json(
                ['message' => 'The Message was arleady created', 'subject_name' => $subject],
            );
        }
        try {
            $message = new Message;
            $this->create($request, $message);
            return response()->json([
                'message' => 'Subject created successfully',
                'Message' => $message,
                'status' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send a message',
                'Message' => $message,
                'status' => 400,
                '4' => $e,
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if (Message::where('id', $id)->exists()) {
            $message = Message::find($id);
            $this->create($request, $message);
            return response()->json([
                'message' => 'Message is updated successfully'
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id): JsonResponse
    {
        if (Message::where('id', $id)->exists()) {
            $message = Message::find($id);
            $message->delete();
            return response()->json([
                'message' => 'The User is deleted successfully'
            ], 404);
        } 
    }
}
