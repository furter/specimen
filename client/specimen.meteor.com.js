Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function () {
    Session.set('currentPage', 'main');
    this.render('main');
});
Router.route('/:slug', function () {
    // En fonction d’url,
    // on demande Meteor de faire un rendu du template qui correspond
    // (donc avec un url /about Meteor va chercher dans les fichiers html pour: <template name="about">)
    var slug = this.params.slug;
    Session.set('currentPage', slug);
    this.render(slug);
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
Meteor.startup(function() {
    // une fois que toute la structure de la page est là: action
    $(document).ready(function() {
        
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
        
        // écrire les trucs ici!! on est encore dans document ready
    });

});
