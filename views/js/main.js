/**
 * Created by l.li on 7/17/15.
 */
require.config({

    // alias libraries paths
    paths: {
        'angular': '../lib/angular/angular'
    },

    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        }
    }
});

define(['app'],function(){

});