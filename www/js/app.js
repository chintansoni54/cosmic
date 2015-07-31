angular.module('cosmic.controllers', []);
angular.module('cosmic.directives', []);
angular.module('cosmic.services', []);

angular.module('cosmic', ['ionic', 'ngCordova', 'cosmic.controllers', 'cosmic.services','cosmic.directives'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        controller : 'TabsCtrl'
    })

    .state('tab.playlists', {
        url: '/playlists',
        views: {
            'tab-playlists': {
                templateUrl: 'templates/playlists.html',
                controller: 'PlaylistsCtrl'
            }
        }
    })

    .state('tab.playlist-items', {
        url: '/playlists/:playlistId',
        views: {
            'tab-playlists': {
                templateUrl: 'templates/playlist-items.html',
                controller: 'PlaylistItemsCtrl'
            }
        }
    })

    .state('tab.artists', {
        url: '/artists',
        views: {
            'tab-artists': {
                templateUrl: 'templates/artists.html',
                controller: 'ArtistsCtrl'
            }
        }
    })

    .state('tab.titles', {
        url: '/artists/:artistId',
        views: {
            'tab-artists': {
                templateUrl: 'templates/titles.html',
                controller: 'TitlesCtrl'
            }
        }
    })

    .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-settings': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })

    .state('tab.search', {
        url: '/search',
        views: {
            'tab-search': {
                templateUrl: 'templates/search.html',
                controller: 'SearchCtrl'
            }
        }
    })

    .state('player', {
        url: '/player',
        templateUrl: 'templates/player.html',
        controller: 'PlayerCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/playlists');

})
.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    //if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false); // native scrolling
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.views.transition('ios');
    $ionicConfigProvider.views.swipeBackEnabled(true);
    $ionicConfigProvider.views.swipeBackHitWidth(80);
    ionic.Platform.isFullScreen = true;
}]);

function bootstrapAngular(){
    console.log('Bootstrap Angular App');
    var domElement = document.querySelector('body');
    angular.bootstrap(domElement, ['cosmic']);
}

if (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
    console.log("URL: Running in Cordova/PhoneGap");
document.addEventListener("deviceready", bootstrapAngular, false);
} else {
    console.log("URL: Running in browser");
    document.addEventListener("DOMContentLoaded", bootstrapAngular, false);
    //bootstrapAngular();
}
