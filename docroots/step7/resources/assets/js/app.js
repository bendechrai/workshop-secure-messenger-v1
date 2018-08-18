
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

import AuthHash from './AuthHash';
var ah = new AuthHash($);
$(document).ready(function () {
    ah.authHook();
});

// Try to get user
import Encrypt from './Encrypt';
$.ajax({
    url: "/api/user",
    type: "GET"
}).done(function (user) {

    // User is logged in - apply encryption to DOM
    $(document).ready(function () {
        var encrypt = new Encrypt($);
        encrypt.getKeys({
			userId: user.id,
			passphrase: ah.getPassword()
		}).done(function(keys){
			console.log(keys);
        });
    });

});

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

const app = new Vue({
    el: '#app'
});
