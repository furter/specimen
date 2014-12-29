var fs = Npm.require("fs");
var path = Npm.require("path");

Posts = new Meteor.Collection("posts");

// Because the name has the value null, the collection is published to all connected clients
// We sort by date descending (last created comes first)
Meteor.publish(null, function () {
    return Posts.find({}, {sort: [["created", "desc"],]});
});

// Meteor.call("publish", function(error, postPaths) { alert(postPaths) });

Meteor.methods({
    publish : function(arg1, arg2) {

        var assetsFolder = path.join(__meteor_bootstrap__.serverDir, 'assets', 'app', 'posts');
        var files = fs.readdirSync(assetsFolder);
        var postPaths = _.filter(files, function(slug) {
            return slug.match(/\.html$/);
        });
        postPaths.forEach(function(postPath) {
            var $ = cheerio.load(Assets.getText(path.join('posts', postPath)));
            var body = $("body");
            var slug = body.attr('id');
            var text = body.html();
            var title = $("title").text();
            var preview = $("section.preview").html();
            var created = new Date( $('meta[property="dc:created"]').attr('content') );
            if (created > new Date()) {
                // this is a future post don’t store it
                return;
            }
            Posts.upsert({"slug": slug},{
                "$set": {
                    "text": text,
                    "created": created,
                    "title": title,
                    "preview": preview
                }
            });
        });
        return postPaths;
    },
});
