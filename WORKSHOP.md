# Build your own Secure Messenger in 3 hours

## Introduction

This document is the workshop guide for [Ben Dechrai](https://bendechrai.com)'s workshop of the same name.

The workshop is split in to steps, to help break the tiem in to specific goals. If you don't manage to complete one step, you can simply move on to a working version and continue the workshop.

For example, if you're working on step 3, and the group is ready to get started on step 4, simply change to the "step4" directory and use https://localhost:3004/ to get to a version thata has steps 1 to 3 already completed.

### Connecting to the virtual machine

When working on the files, you can edit them directly on your host maching. However, there are some things that much be done from within the virtual machine. To avoid issues, it's recommended you always do things in the virtual machine.

You can either connect to the machine from the VirtualMachine management application, or from your command line:

    // From the base directory for the workshop, run this:
    vagrant ssh

If you have used SSH, you should see a screen with text similar to this:

    Linux debian-9 4.9.0-6-amd64 #1 SMP Debian 4.9.88-1+deb9u1 (2018-05-07) x86_64
    
    The programs included with the Debian GNU/Linux system are free software;
    the exact distribution terms for each program are described in the
    individual files in /usr/share/doc/*/copyright.
    
    Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
    permitted by applicable law.
    vagrant@debian-9:~$
If you connected via the VirtualBox application, you will see a black screen with the prompt:

    debian-9 login:

Use the username `vagrant` and password `vagrant` to get in.

### File location in the virtual machine

Whenever you want to work on the workshop files, you'll have to change user to the web server first:

    sudo su - www-data

The code is in `/vagrant/docroots/stepX`, where X is the step number.

## Step 1 - Double Hashing

By now, you should be able to see a base Laravel installation at `https://localhost:3001/`. Remember that we're using TLS encryption using a self-signed certificate, so if oyu see a certificate error, you'll need to manually proceed.

The first step in this workshop is to enable the user login system, and make sure passwords are hashed in the browser before being sent to the server. This way, we can ensure the server will never know your password, but still be able to log you in.

Laravel makes it really easy to add authentication. Firstly, we'll need to connect to the vagrant box.

### Enable Authentication Components

Now we're ready to add the authentication components:

    php artisan make:auth
    php artisan migrate

If you refresh the homepage now, you'll see the Login and Register links in the top right.

### Hash passwords in the browser

This will require some custom code. We're going to use JavaSolution to hook in to the login and registration form, and hash passwords before the form is actually submitted.

The JavaScript in a Laravel application is kept in `resources/assets/js/app.js`. You can edit this file on your main machine if that's easier, using an editor of your choice.

Add something like this to that file:

    import AuthHash from './AuthHash';
		// make sure that the page is completely loaded before we try looking for the form elements
    $(document).ready(function () {
        var ah = new AuthHash($);
        ah.authHook();
    });

Now create the `AuthHash` class (`resources/assets/js/Authash.js`) and the `authHook` method. Note the script above injects jQuery in to the constructor.

### Hints

You might want to add `id`s to the forms in `resources/views/auth/*.blade.php`

JavaScript doesn't have any native hashing functions. An easy to use library is easy to install with `npm` from the document root:

    npm install bcryptjs

You can hash a string like this:

    bcrypt.hashSync(string, bcrypt_salt);

### Sample Solution

    export default class AuthHash {
    
      constructor(jQuery) {
        this.jQuery = jQuery;
      }
    
      authHook() {
    
        self = this;
    
        // On register submit, hash passwords
        this.jQuery("form#register").submit(function (e) {
    
          // Grab passwords, save to session storage, then blank the input fields
          var password = self.jQuery("#password", e.target).val();
          var passwordConfirm = self.jQuery("#password-confirm", e.target).val();
          sessionStorage.setItem("password", password);
          self.jQuery("#password", e.target).val("");
          self.jQuery("#password-confirm", e.target).val("");
    
    
          // Hash the password, and put it in to the password fields
          var bcrypt = require("bcryptjs");
          self.jQuery("#password", e.target).val(bcrypt.hashSync(password, self.getSalt()));
          self.jQuery("#password-confirm", e.target).val(bcrypt.hashSync(passwordConfirm, self.getSalt()));
    
        });
    
        // On login submit, hash password
        this.jQuery("form#login").submit(function (e) {
    
          // Grab password, save to session storage, then blank the input field
          var password = self.jQuery("#password", e.target).val();
          sessionStorage.setItem("password", password);
          self.jQuery("#password", e.target).val("");
    
          // Hash the password, and put it in to the password field
          var bcrypt = require("bcryptjs");
          var hashPassword = bcrypt.hashSync(password, self.getSalt());
          self.jQuery("#password", e.target).val(hashPassword);
    
        });
    
        // On logout, forget password
        this.jQuery("#logout-form").submit(function (e) {
          sessionStorage.removeItem("password");
        });
    
      }
    
      getSalt() {
        // Salt is 22 chars long. It shouldn't be public. Can you think of a way to avoid using a fixed string?
        var salt = "1234567890123456789012"
        salt = "$2y$10$" + salt;
        return salt;
      }
    
    }

## Step 2 - Contact Lists

Starting logged in, and looking at the dashboard, we want to create a view of contacts on the left, and a placeholder for messages on the right. For simplicity, the contact list will show a list of all users in the system. Note that this could represent a privacy leak in a production system.

Edit the `resources/views/home.blade.php` view, and `app/Http/Controllers/HomeController.php` controller accordingly.

### Sample Solution

#### View

    @extends('layouts.app')
    
    @section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-4 contacts">
                <div class="panel panel-default">
                    <div class="panel-heading">Contacts</div>
                    <div class="panel-body">
                    @foreach ($users as $user)
                        <a href="">{{ $user->email }}</a>
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
    
### Controller

Add this to the lsit of classes to use:

    use App\User;

And replace the `index` method with:

    public function index()
    {
	      $users = User::all();
        return view('home', ['users' => $users]);
    }

If you have time, why not try to make sure users are in alphabetical order, and exclude the logged in user from the list.
