if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
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
            Session.set('currentPage', page);

            // on demande Meteor de faire un rendu du template correspondent
            // (dans le fichier html: <template name="about">)
            var frag = Meteor.render(function() {
                var i = Template[templateName] ? Template[templateName]() : "";
                return i;
            });

            // insertion de ce rendu dans le document dans le browser,
            // à l'endroit où se trouve le div avec le id container
            // <div id="container"></div>
            $('div#container').html(frag);
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
    Template.dynamicStyle.backgroundColor = function () {
        return Session.get('backgroundColorVariable');
    };
    // then go to specimen.meteor.com
    // we replace the color of background-color by the variable: (curly brackets) backgroundColor
    // and later here in the javascript the rest of the code
    
    
    // GET COMMITS FROM GITHUB
    // to call other servers’informations, in the terminal: meteor add http
    // we start with empty commits:
    Session.set('commits', [])
    // in the template name about (page about) we create the variable "comments"
    // use this value of commit (empty)
    Template.about.comments = function () {
        return Session.get('commits');
      };
    // ici on va chercher sur Github:
    HTTP.get("https://api.github.com/repos/furter/specimen/commits?path=about.html", function(error, result) {
        // Transcribes the result (JSON text format) so that the browser understands it is JSON
        // so that it becomes an object
        var res = JSON.parse( result.content );
        // Replace the value by the result got from Github
        Session.set('commits', res);
    });
    // Reactualises the first code (that prints the template) 
    // Session = reactivity, some datas are linked and updated automatically when the other changes
    // So that it can have the time to add the things from Github
    
    
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
            
/*            $(window).load(function() {
                $('#container.detailed').masonry({
                    itemSelector: '.box',
                    columnWidth: 254,
                });
    });  */

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
             $(this).attr('target', '_blank')
             }
             }
             );
             

            // to change the title on the bar
            document.title = " O P E N F O N T S";
            
            /*
            // checkboxes
            $('.box, .biox').hide();
            $("input").each(function() {
                var $this = $(this);
                $this.hide();
                if($this.prop("checked")) {
                    var $image = $("<img src='/checkbox-crossed.svg' />").insertAfter(this);
                } else {
                    var $image = $("<img src='/checkbox.png' />").insertAfter(this);
                }
                $image.bind("click", function() {
                    var $checkbox = $(this).prev("input");
                    var cat = $checkbox.val();
                    $checkbox.prop("checked", !$checkbox.prop("checked"));    
                    checkImage(cat);
                })
                function checkImage(cat) {
                    if($image.prev("input").prop("checked")) {
                        $image.attr("src", "/checkbox-crossed.svg");
                        $('.' + cat).fadeIn();
                    } else {
                        $image.attr("src", "/checkbox.png");
                        $('.' + cat).fadeOut(function() {
        });
                    }
                }
                
            });
            */
            
            
            
            $('a').smoothScroll();
            
            $(function() {
                $(".draggable").draggable();
                 
                $( ".resizable" ).resizable();

                });

            $("form").validate();

            $("input#send").click(function(e) {
                e.preventDefault();
                if ( $("form").valid() ) {
                    alert("CEST BON!");
                }
            });
            // API for GitHub to only have commits from the page about.html
            // https://api.github.com/repos/furter/specimen/commits?path=about.html
            // after we must find a way to call it here with javascript
            
            

// écrire les trucs ici!! on est encore dans document ready
        });

    });

}

