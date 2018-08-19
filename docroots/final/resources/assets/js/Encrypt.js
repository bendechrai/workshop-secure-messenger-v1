export default class Encrypt {

    constructor(jQuery) {
        this.jQuery = jQuery;
        this.openpgp = require("openpgp");
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

    sendHook(keys) {

        // On message send, encrypt message
        this.jQuery("div.encrypt form").submit(async function (e) {

            var sender = await self.openpgp.key.readArmored(keys.sender_key);
            var recipient = await self.openpgp.key.readArmored(keys.recipient_key);

            // Grab message
            var message = self.jQuery("#message", e.target).val();

            // Encrypt message
            var options = {
                message: self.openpgp.message.fromText(message),
                publicKeys: [
                    sender.keys[0],
                    recipient.keys[0],
                ]
            };
            var encrypted = await self.openpgp.encrypt(options);

            // Update message field
            self.jQuery("#message", e.target).val(encrypted.data);

        });

    }

    async decryptMessages(params) {

        self = this;

        var privKeyObj = (await this.openpgp.key.readArmored(params.private_key)).keys[0];
        await privKeyObj.decrypt(params.passphrase);

        // Find all message bodies
        this.jQuery("div.encrypt .messageBody").each(async function (i, el) {

            // Extract message from DOM
            var message = $(el).html().trim();

            try {

                // Decrypt
                var options = {
                    message: await self.openpgp.message.readArmored(message),
                    privateKeys: privKeyObj
                };

                // Update DOM
                self.openpgp.decrypt(options).then(function(decrypted){
                    $(el).html(decrypted.data);
                });
            }
            catch(error) {}

        });

    }

}
