<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function show(\App\User $user)
    {
        $response = new \stdClass();
        $response->id = $user->id;
        $response->public_key = $user->public_key;
        if($user->id === \Auth::user()->id) {
            $response->private_key = $user->private_key;
        }
        return response()->json($response);
    }


    public function update(Request $request, \App\User $user)
    {
        if($user->id === \Auth::user()->id) {
            $data = $request->all(['private_key', 'public_key']);
            if (isset($data['private_key'])) {
                $user->private_key = $data['private_key'];
            }
            if (isset($data['public_key'])) {
                $user->public_key = $data['public_key'];
            }
            $user->save();
            \Auth::setUser($user);
        }
        $this->show($user);
    }

}
