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

            // action: si c'est externe, on attribue à "ça" une target pour le lien qui est un nouvel onglet
             $("a[href]").each(
             function() {
             if (isExternal($(this).attr('href')) ) {
             $(this).attr('target', '_blank')
             }
             }
             );
             
//             $('a').smoothScroll();

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
// écrire les trucs ici!! on est encore dans document ready
        });

    });

}

