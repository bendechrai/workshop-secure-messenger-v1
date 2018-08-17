@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-4 contacts">
            <div class="panel panel-default">
                <div class="panel-heading">Contacts</div>
                <div class="panel-body">
                @foreach ($users as $user)
                    <a href="">{{ $user->name }}</a>
                @endforeach
                </div>
            </div>
        </div>
        <div class="col-md-8 messages">
            <div class="panel panel-default">
                <div class="panel-heading">Message</div>
                <div class="panel-body">
                    Select a user on the left to start chatting with them.
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
