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
        $me = \Auth::user()->id;
        $them = $user->id;
        $messages = Message::where(function ($query) use ($me, $them) {
                $query->where('sender_id', '=', $me)
                    ->where('recipient_id', '=', $them);
            })
            ->orWhere(function ($query) use ($me, $them) {
                $query->where('sender_id', '=', $them)
                    ->where('recipient_id', '=', $me);
            })
            ->get();
        return view('user', ['user' => $user, 'users' => $users, 'messages' => $messages]);
    }

}
