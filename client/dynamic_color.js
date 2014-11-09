// CHANGE THE BACKGROUND COLOR - BUTTONS
// We want to define it when it is not set
// If the variable is not set (expressed by the ! and Session.get…)
if ( ! Session.get('backgroundColorVariable') ) {
    // then we set it in blue
    Session.set('backgroundColorVariable', "blue");
}
// Put new value in the template dynamicStyle, see specimen.meteor.com.html file
// we create the variable backrgoundColor, we prepare what will be sent to the template
// Session is a variable that is persistent in all the session (connection of a user)
Template.dynamicStyle.helpers({
    backgroundColor: function () {
        return Session.get('backgroundColorVariable');
    }
});

// CHANGE THE BACKGROUND COLOR - BUTTONS
// the event is defined here, the buttons are defined in the layout template
// and the dynamic style is its own template
Template.layout.events = {
    'click .button-yellow': function(e){ 
        Session.set("backgroundColorVariable", "yellow");
    },
    'click .button-blue': function(e){ 
        Session.set("backgroundColorVariable", "blue");
    },
    'click .button-soft': function(e){ 
        Session.set("backgroundColorVariable", "#FFFFCC");
    }
};

// then go to specimen.meteor.com
// we replace the color of background-color by the variable: (curly brackets) backgroundColor
// and later here in the javascript the rest of the code

