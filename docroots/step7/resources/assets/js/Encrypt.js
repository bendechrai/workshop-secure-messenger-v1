export default class Encrypt {

    constructor(jQuery) {
        this.jQuery = jQuery;
        this.openpgp =require("openpgp");
    }

    getKeys(params) {
		var deferred = jQuery.Deferred();
        self = this;

        // Get keys
        $.ajax({
            url: "/api/user/"+params.userId+"/keys",
            type: "GET"
        }).done(function (keys) {
		
            if(params.passphrase && (keys.private_key === null || keys.public_key === null)) {
                self.generateKeys(params.passphrase).done(function (keys) {
					self.keys = keys;

					// Send to backend
					$.ajax({
						url: "/api/user/"+params.userId+"/keys",
						type: "POST",
						data: {
							private_key: keys.private_key,
							public_key: keys.public_key
						},
						dataType: "json",
					}).done(function () {
						deferred.resolve(keys)
					});

				});
            } else {
				deferred.resolve(keys);
			}

        });

		return deferred.promise();
    }

	generateKeys(passphrase) {
		var deferred = jQuery.Deferred();

        var options = {
            userIds: [{name: "Anonymous", email: "anon@example.com"}],
            numBits: 2048,
            passphrase: passphrase
        };

        // Generate Key and resolve this promise
        var openpgp = require("openpgp");
        openpgp.generateKey(options).then(function (keys) {
            deferred.resolve({
                private_key: keys.privateKeyArmored,
                public_key: keys.publicKeyArmored
            });
        });
	
		return deferred.promise();
	}

}
