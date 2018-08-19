export default class AuthHash {

    constructor(jQuery) {
        this.jQuery = jQuery;
        this.bcrypt = require("bcryptjs");
    }

    authHook() {

        self = this;

        // On register submit, hash passwords
        this.jQuery("form#register").submit(function (e) {

            // Grab passwords
            var password = self.jQuery("#password", e.target).val();
            var passwordConfirm = self.jQuery("#password-confirm", e.target).val();

            // Remember password
            self.setPassword(password);

            // Hash the passwords, and put them in to the password fields
            self.jQuery("#password", e.target).val(self.bcrypt.hashSync(password, self.getSalt()));
            self.jQuery("#password-confirm", e.target).val(self.bcrypt.hashSync(passwordConfirm, self.getSalt()));

        });

        // On login submit, hash password
        this.jQuery("form#login").submit(function (e) {

            // Grab password
            var password = self.jQuery("#password", e.target).val();

            // Remember password
            self.setPassword(password);

            // Hash the password, and put it in to the password field
            self.jQuery("#password", e.target).val(self.bcrypt.hashSync(password, self.getSalt()));

        });

    }

    getSalt() {
        // Salt is 22 chars long. It shouldn't be public. Can you think of a way to avoid using a fixed string?
        var salt = "1234567890123456789012"
        salt = "$2y$10$" + salt;
        return salt;
    }

    setPassword(password) {
        localStorage.setItem('AuthHash_Password', password);
    }

    getPassword(password) {
        return localStorage.getItem('AuthHash_Password');
    }

}
