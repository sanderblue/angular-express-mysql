var crypto = require('crypto');

// Used to generate a hash of the plain-text password + salt
exports.hash = function(msg, key) {
    return crypto
        .createHmac('sha256', key)
        .update(msg)
        .digest('hex');
}

//Generates user specific salt (Prevent Rainbow Table Attacks)
exports.makeSalt = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}