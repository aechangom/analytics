#!/usr/bin/env node

module.exports = function(context) {

  var fs = require('fs'),
    path = require('path');

  var platformRoot = path.join(context.opts.projectRoot, 'platforms/android');


  var manifestFile = path.join(platformRoot, 'AndroidManifest.xml');

  if (fs.existsSync(manifestFile)) {

    fs.readFile(manifestFile, 'utf8', function (err,data) {
      if (err) {
        throw new Error('Unable to find AndroidManifest.xml: ' + err);
      }

      var attribute = 'android:resizeableActivity';

      if (data.indexOf(attribute) == -1) {

        var result = data.replace(/<application/g, '<application ' + attribute + '="false"');

        fs.writeFile(manifestFile, result, 'utf8', function (err) {
          if (err) throw new Error('Unable to write into AndroidManifest.xml: ' + err);
        })
      }
    });
  }


};