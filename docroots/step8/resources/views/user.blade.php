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
            <div class="panel panel-default encrypt encrypt-user-{{$user->id}}">
                <div class="panel-heading">Message</div>
                <div class="panel-body">
                    @foreach($messages as $_message)
                        <p><strong>{{ $_message->sender->name }}</strong> <span class="messageBody">{{ $_message->message }}</span></p>
                    @endforeach
                </div>
                <div class="panel-footer">
                    <form action="{{ route('user.message', ['id'=>$user->id]) }}" method="post">
                        {{csrf_field()}}
                        <div class="input-group">
                            <input id="message" name="message" type="text" class="form-control" placeholder="Type new message to {{ $user->name }}...">
                            <span class="input-group-btn">
                                <button class="btn btn-default" type="submit">Send!</button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
