<?php

namespace App\Http\Controllers;

use App\User;
use App\Message;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function show(User $user)
    {
        $users = User::all();
        $members = [ \Auth::user()->id, $user->id ];
        $messages = Message::whereIn('sender_id', $members)
            ->whereIn('recipient_id', $members)
            ->get();
        return view('user', ['user' => $user, 'users' => $users, 'messages' => $messages]);
    }

    public function sendMessage(Request $request, User $user)
    {
        $message = new Message();
        $message->sender_id = \Auth::user()->id;
        $message->recipient_id = $user->id;
        $message->message = $request->input('message');
        $message->save();
        return redirect()->route('user', ['id'=>$user->id]);
    }

}
