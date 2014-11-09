Meteor.startup(function() {
    // code to run on server at startup
});

Meteor.methods({
    sendEmail: function (from, text) {
        this.unblock();

        Email.send({
            to: "Loraine Furter <loraine.furter@gmail.com>",
            from: from,
            subject: "New Specimen comment from " + from,
            text: text
        });
    }
});
