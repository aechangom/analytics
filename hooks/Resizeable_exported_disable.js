#!/usr/bin/env node

/* 
 * Este archivo se encarga de modificar el archivo manifest la parte de Configuración de seguridad de la red - con el fin de solventar la vulnerabilidad  RQVULSEC-2595
 */
module.exports = function(context) {
    var ANDROID = 'android';
    var platformsList = context.opts.platforms;

    runModifyManifest(context);

};


function runModifyManifest(context) {

    let fs = context.requireCordovaModule('fs'),
        path = context.requireCordovaModule('path');

    // android platform directory
    let platformAndroidDir = path.join(context.opts.projectRoot, 'platforms/android');

    // android app module directory
    let platformAndroidAppModuleDir = path.join(platformAndroidDir, 'app');

    // android manifest file
    let androidManifestFile = path.join(platformAndroidAppModuleDir, 'src/main/AndroidManifest.xml');

    if (fs.existsSync(androidManifestFile)) {

        fs.readFile(androidManifestFile, 'UTF-8', function(err, data) {
            if (err) {
                throw new Error('Unable to find AndroidManifest.xml: ' + err);
            }
            // the Android Application class that need to config to Android manifest file

            let applicationResizeableActivity = 'android:resizeableActivity';
            var result = '';
            if (data.indexOf(applicationResizeableActivity + '="true"') != -1) {
                console.log("(TODO1) applicationResizeableActivity se cambiara al correcto");
                result = data.replace(applicationResizeableActivity + '="true"', applicationResizeableActivity + '="false"');
            } else if (data.indexOf(applicationResizeableActivity) === -1) {
                console.log("(TODO1) Se agrega la linea de applicationResizeableActivity al manifest");
                result = data.replace(/<application/g, '<application ' + applicationResizeableActivity + '="false"');
            }

          
              if (result != '') {
                if (result.indexOf('android:requestLegacyExternalStorage="true"') === -1) {
                  result = result.replace(/<application/g, '<application ' + 'android:requestLegacyExternalStorage="true"');
                }
             } else {
               if (data.indexOf('android:requestLegacyExternalStorage="true"') === -1) {
                   result = data.replace(/<application/g, '<application ' + 'android:requestLegacyExternalStorage="true"');
                } 
             }

            if (result != '') {
                fs.writeFile(androidManifestFile, result, 'UTF-8', function(err) {
                    if (err)
                        throw new Error('Unable to write into AndroidManifest.xml: ' + err);
                })
            }
        });
    }
}

