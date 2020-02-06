#!/usr/bin/env node

/* 
 * Este archivo se encarga de modificar el archivo manifest la parte de Configuración de seguridad de la red - con el fin de solventar la vulnerabilidad  RQVULSEC-2595
 */
module.exports = function(context) {
    var ANDROID = 'android';
    var platformsList = context.opts.platforms;
                    runModifyManifest(context);
                    runModifyNetworkConfig(context);

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
            let applicationnetworkSecurityConfig = 'android:networkSecurityConfig="@xml/network_security"';

            let incorrectNetworkSecurityConfig = 'android:networkSecurityConfig="@xml/network_security_config"';
            var result = '';
            if (data.indexOf(incorrectNetworkSecurityConfig) != -1) {
                result = data.replace(incorrectNetworkSecurityConfig, applicationnetworkSecurityConfig);
            } else if (data.indexOf('@xml/network_security') === -1) {
                result = data.replace(/<application/g, '<application ' + applicationnetworkSecurityConfig);
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


function runModifyNetworkConfig(context) {

    let fs = context.requireCordovaModule('fs'),
        path = context.requireCordovaModule('path');

    // android platform directory
    let platformAndroidDir = path.join(context.opts.projectRoot, 'platforms/android');

    // android app module directory
    let platformAndroidAppModuleDir = path.join(platformAndroidDir, 'app');

    let networkSecurityConfigFile = path.join(platformAndroidAppModuleDir, 'src/main/res/xml/network_security_config.xml');

    if (fs.existsSync(networkSecurityConfigFile)) {

        fs.readFile(networkSecurityConfigFile, 'UTF-8', function(err, data) {
            if (err) {
                throw new Error('Unable to find network_security_config.xml: ' + err);
            }

            // the Android Application class that need to config to Android manifest file
            let networkSecurityConfigCertificates = '<certificates src="user" />';

            if (data.indexOf(networkSecurityConfigCertificates) != -1) {
                var result1 = data.replace(networkSecurityConfigCertificates, '');
            }


            if (result1 != undefined && result1 != null) {
                fs.writeFile(networkSecurityConfigFile, result1, 'UTF-8', function(err) {
                    if (err)
                        throw new Error('Unable to write into network_security_config.xml: ' + err);
                })
            }
        });
    }
}