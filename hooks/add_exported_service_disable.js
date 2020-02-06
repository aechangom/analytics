#!/usr/bin/env node

/* 
 * Este archivo se encarga de modificar el archivo manifest la parte de Configuración de seguridad de la red - con el fin de solventar la vulnerabilidad  RQVULSEC-2595
 */
module.exports = function(context) {
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

            var result = '';
            let pluginDiagnosticLocation = 'android:name="cordova.plugins.Diagnostic$LocationProviderChangedReceiver"';
            let pluginDiagnosticNFCS = 'android:name="cordova.plugins.Diagnostic$NFCStateChangedReceiver"';
            let androidExported = 'android:exported="false"';
            if (data.indexOf(pluginDiagnosticLocation + ' ' + androidExported) === -1) {
                if (data.indexOf(pluginDiagnosticLocation) != -1) {
                    console.log("pluginDiagnosticLocation se cambiara exported a false");
                    result = data.replace(pluginDiagnosticLocation, pluginDiagnosticLocation + ' ' + androidExported);
                }
            }
            if (data.indexOf(pluginDiagnosticNFCS + ' ' + androidExported) === -1) {
                if (data.indexOf(pluginDiagnosticNFCS) != -1) {
                    console.log("pluginDiagnosticNFCS se cambiara exported a false");
                    if (result != '') {
                    	result = result.replace(pluginDiagnosticNFCS, pluginDiagnosticNFCS + ' ' + androidExported);
                    } else {
                    	result = data.replace(pluginDiagnosticNFCS, pluginDiagnosticNFCS + ' ' + androidExported);
                    }
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