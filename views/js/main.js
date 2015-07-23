/**
 * Created by l.li on 7/17/15.
 */
require.config({

    // alias libraries paths
    paths: {
        'angular': '/bower_components/angular/angular.min',
        'angularRoute':'/bower_components/angular-route/angular-route.min',
        'jQuery':'/bower_components/jquery/dist/jquery.min',
        'bootstrapjs':'/bower_components/bootstrap/dist/js/bootstrap'

    },

    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },
        'bootstrapjs': ['jQuery'],
        'angularRoute':['angular']
    }
});

define([
    'angular',
    'bootstrapjs',
    'controllers/index',
    'routes'
    //'routes',
    //'compareChart',
    //'lookBackPageModule',
    //'myScenarios',
    //'planForwardPageModule',
    //'roi.directiveModules'
], function (angular) {
    angular.bootstrap(document,['ROIClientApp']);
});