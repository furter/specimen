// The About Page

// GET COMMITS FROM GITHUB
// to call other servers’informations, in the terminal: meteor add http
// we start with empty commits:
Session.set('commits', []);
// in the template named about (page /about) we create the variable "comments"
// use this value of commit (empty for now)
Template.about.helpers({
    comments: function () {
        return Session.get('commits');
    }
});

Template.about.rendered = function() {
    // API for GitHub to only have commits from the page about.html
    // https://api.github.com/repos/furter/specimen/commits?path=about.html
    HTTP.get("https://api.github.com/repos/furter/specimen/commits?path=about.html", function(error, result) {
        // Transcribes the result (JSON text format) so that the browser understands it is JSON
        // so that it becomes an object
        var res = JSON.parse( result.content );
        // Replace the value by the result got from Github
        // Through Session.set:
        // Reactualises the first code (that prints the template) 
        // Session = reactivity, some datas are linked and updated automatically when the data changes
        // In this case, the About page has a helper method that depends on the Session variable ‘commits’
        // So in this case it will reload parts of the template once we add the things from Github
        Session.set('commits', res);
    });
    $("input#send").click(function(e) {
        e.preventDefault();
        if ( $("form").valid() ) {
            var email = $("input#form-name").val() + ' <' + $("input#form-email").val() +'>';
            var content = $("textarea#form-content").val();
            Meteor.call('sendEmail',
                        email,
                        content);
            alert("Thank you.");
        }
    });
};
