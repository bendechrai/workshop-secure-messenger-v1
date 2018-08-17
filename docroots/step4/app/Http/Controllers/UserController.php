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
        return view('user', ['users' => $users, 'messages' => $messages]);
    }

}
