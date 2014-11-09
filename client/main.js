// The home page

Session.set('commit', false);

// in the template named ‘main’ (homepage) we create the variable ‘commit’
// here we calculate the value:
Template.main.helpers({
    commit: function () {
        // res is the object we get back from GitHub; we don’t need all of it
        var res = Session.get('commit');
        // this is a ‘Regular Expression’ test to see if a string ends in .html
        var isHtml = new RegExp('\.html$', 'i');
        // if we’ve already gotten something from Github:
        if (res) {
            // the commit object is the one we will return with this function—
            // the one that will be passed to template. 
            var commit = {};
            
            var htmlFile = false;
            // In the info from GitHub, we find an array ‘files’, with info about
            // the files affected by the commit.
            // We’re going to check the filename of each file, and see if it
            // is an html page. The first html filename we find, we’ll assign to the
            // htmlFile variable—
            // then we stop the loop, because we only need 1 value.
            for (i=0; i<res.files.length; i++) {
                var filename = res.files[i].filename;
                if (filename.match(isHtml)) {
                    htmlFile = filename;
                    break;
                }
            }
            if (htmlFile) {
                // somepage.html maps to the url /somepage:
                commit.link = '/' + htmlFile.replace('.html','');
            } else {
                // if no affected HTML file was found, the whole function
                // Template.commit is going to return false,
                // because we don’t want to display the commit in that case.
                return false;
            }
            // the commit message and date, from the Github API info:
            commit.message = res.commit.message;
            commit.date = res.commit.author.date;
            return commit;
        }
        return res;
    }
});

Template.main.rendered = function() {
    // To animate
    var hash = document.location.hash;
    if (hash) {
        $('html,body').animate({scrollTop: $(hash).offset().top});
    }
    // utiliser `this.$` est pareil à utiliser juste `$`, sauf que s’agit que sur le template et pas les alentours
    this.$('a').smoothScroll();
    // For the homepage, we want the latest commit in full detail:
    HTTP.get("https://api.github.com/repos/furter/specimen/commits/HEAD", function(error, result) {
        var res = JSON.parse( result.content );
        Session.set('commit', res);
    });
};
