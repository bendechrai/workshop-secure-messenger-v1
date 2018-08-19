export default class Encrypt {

    constructor(jQuery) {
        this.jQuery = jQuery;
        this.openpgp =require("openpgp");
    }

    getKeys(params) {
		var deferred = jQuery.Deferred();
        self = this;

        // Get key
        $.ajax({
            url: "/api/user/"+params.userId+"/key",
            type: "GET"
        }).done(function (key) {
		
            if(params.passphrase && (keys.private_key === null || keys.public_key === null)) {
                self.generateKeys(params.passphrase).done(function (key) {
					self.key = key;

					// Send to backend
					$.ajax({
						url: "/api/user/"+params.userId+"/key",
						type: "POST",
						data: {
							private_key: key.private_key,
							public_key: key.public_key
						},
						dataType: "json",
					}).done(function () {
						deferred.resolve(key)
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
        openpgp.generateKey(options).then(function (key) {
            deferred.resolve({
                private_key: key.privateKeyArmored,
                public_key: key.publicKeyArmored
            });
        });
	
		return deferred.promise();
	}

}
