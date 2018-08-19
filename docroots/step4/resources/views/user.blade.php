@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-4 contacts">
            <div class="panel panel-default">
                <div class="panel-heading">Contacts</div>
                <div class="panel-body">
                    <ul>
                        @foreach ($users as $_user)
                            <li><a href="{{ route('user', ['id'=>$_user->id]) }}">{{ $_user->name }}</a></li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-md-8 messages">
            <div class="panel panel-default">
                <div class="panel-heading">Message</div>
                <div class="panel-body">
                    @foreach($messages as $_message)
                        <p><strong>{{ $_message->sender->name }}</strong> <span class="messageBody">{{ $_message->message }}</span></p>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

