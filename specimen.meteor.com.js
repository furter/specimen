if (Meteor.isServer) {
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
}

if (Meteor.isClient) {

    var Router = Backbone.Router.extend({

        // quels routes ont quel function:

        routes : {
            '' : 'staticPage', // --> variable page est undefined
            ':page' : 'staticPage', // --> /about --> variable page est 'about'
        },

        // le function defini pour montrer le contenu:

        staticPage : function(page) {
            // if page a un valeur (ex: 'about'), templateName devient ce valeur, si non
            // templateName devient "main"
            var templateName = page ? page : "main";

            // on ajoute un variable reutilisable (mais pas utilisée pour l'instant)
            Session.set('currentPage', templateName);

            // on demande Meteor de faire un rendu du template correspondent
            // (dans le fichier html: <template name="about">)
            var tmpl = Template[templateName];
            if (typeof tmpl === "undefined") {
                this.navigate('/'); //if the template is not found, go to home page
                return;
            }
            Blaze.render(tmpl, document.getElementById("container"));
            
            // insertion de ce rendu dans le document dans le browser,
            // à l'endroit où se trouve le div avec le id container
            // <div id="container"></div>
            $('div#container').removeClass();
            $('div#container').addClass(templateName);
        },
    });
    
    Template.main.rendered = function() {
        var hash = document.location.hash;
        if (hash) {
            $('html,body').animate({scrollTop: $(hash).offset().top});
        }
    };

    // CHANGE THE BACKGROUND COLOR - BUTTONS
    // We want to define it when it is not set
    // If the variable is not set (expressed by the ! and Session.get…)
    if ( ! Session.get('backgroundColorVariable') ) {
        // then we set it in blue
        //Session.set('backgroundColorVariable', "blue");
    }
    // Put new value in the template dynamicStyle, see specimen.meteor.com.html file
    // we create the variable backrgoundColor, we prepare what will be sent to the template
    // Session is a variable that is persistent in all the session (connection of a user)
    Template.dynamicStyle.helpers({
        backgroundColor: function () {
            return Session.get('backgroundColorVariable');
        }
    });
    // then go to specimen.meteor.com
    // we replace the color of background-color by the variable: (curly brackets) backgroundColor
    // and later here in the javascript the rest of the code
    
    
    // GET COMMITS FROM GITHUB
    // to call other servers’informations, in the terminal: meteor add http
    // we start with empty commits:
    Session.set('commits', []);
    Session.set('commit', false);
    // in the template named about (page /about) we create the variable "comments"
    // use this value of commit (empty for now)
    Template.about.helpers({
        comments: function () {
            return Session.get('commits');
        }
    });
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
    
    // Use this helper to format a date in a template:
    // {{ formatDate commit.date }}
    Handlebars.registerHelper("formatDate", function(datetime) {
        // Depends on the momentjs library in client/compatibility/moment.min.js
        return moment(datetime).format('MMMM Do YYYY');
    });
    
    var isExternal = function(href) {
        if (href.indexOf("http") === -1 || href.indexOf(document.location.host) !== -1 || href.indexOf("localhost") !== -1 || href.indexOf("127.0.0.1") !== -1 ) {
            return false;
        }
        return true;
    };

    // initialise le router
    var app = new Router;
    Meteor.startup(function() {
        // démarre le router; rendant possible l’utilisation des boutons Back et Forward dans le browser
        Backbone.history.start({
            pushState : true
        });

        // une fois que toute la structure de la page est là: action
        $(document).ready(function() {
            
            
            // ici on va chercher sur Github:
            if (Session.get('currentPage') === 'about') {
                HTTP.get("https://api.github.com/repos/furter/specimen/commits?path=about.html", function(error, result) {
                    // Transcribes the result (JSON text format) so that the browser understands it is JSON
                    // so that it becomes an object
                    var res = JSON.parse( result.content );
                    // Replace the value by the result got from Github
                    Session.set('commits', res);
                });
            } else if (Session.get('currentPage') === 'main') {
                // For the homepage, we want the latest commit in full detail:
                HTTP.get("https://api.github.com/repos/furter/specimen/commits/HEAD", function(error, result) {
                    var res = JSON.parse( result.content );
                    Session.set('commit', res);
                });
            }
            // Through Session.set:
            // Reactualises the first code (that prints the template) 
            // Session = reactivity, some datas are linked and updated automatically when the other changes
            // So that it can have the time to add the things from Github
        
            
            // CHANGE THE BACKGROUND COLOR - BUTTONS
            // the beginning of this is up there
            // and another part in the html main template
            $(".button-yellow").click(function(){ 
                //$('body').css("background-color","yellow");
                Session.set("backgroundColorVariable", "yellow");
            });
            $(".button-blue").click(function(){ 
                //$('body').css("background-color","blue");
                Session.set("backgroundColorVariable", "blue");
            });
            $(".button-soft").click(function(){ 
                //$('body').css("background-color","#FFFFCC");
                Session.set("backgroundColorVariable", "#FFFFCC");
            });
            
            // action: si c'est externe, on attribue à "ça" une target pour le lien qui est un nouvel onglet
             $("a[href]").each(
                 function() {
                     if (isExternal($(this).attr('href')) ) {
                        $(this).attr('target', '_blank');
                     }
                 }
             );
             

            // to change the title on the bar
            document.title = " O P E N F O N T S";
            
            
            
            
            $('a').smoothScroll();
            
            $(function() {
                $(".draggable").draggable();
                 
                $( ".resizable" ).resizable();

                });

            var contactFormValidator = $("form").validate();
            console.log(contactFormValidator);

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
            // API for GitHub to only have commits from the page about.html
            // https://api.github.com/repos/furter/specimen/commits?path=about.html
            // after we must find a way to call it here with javascript
            
            

// écrire les trucs ici!! on est encore dans document ready
        });

    });

}

