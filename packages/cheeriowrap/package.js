Package.describe({
  name: 'schrijver:cheeriowrap',
  summary: 'Wraps cheerio (because Meteor can’t use NPM modules directly)',
  version: '0.0.1',
  git: ' /* Fill me in! */ '
});

Npm.depends({
    "cheerio" : "0.18.0",
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.export('cheerio', 'server');
  api.addFiles('index.js', 'server');
});
