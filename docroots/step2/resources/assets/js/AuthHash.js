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
