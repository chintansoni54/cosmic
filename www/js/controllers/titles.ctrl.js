// Titles
angular.module('cosmic.controllers').controller('TitlesCtrl', function($scope, $stateParams, $state,cosmicDB,cosmicPlayer,$ionicViewSwitcher,$ionicGesture,$ionicPopover,$cordovaToast,cosmicConfig) {

    $scope.miniaturesPath = cosmicConfig.appRootStorage + 'miniatures/';
    var artistId=$stateParams.artistId;
    cosmicDB.getTitles(artistId).then(function(albums){
        $scope.albums=albums;
    });
    $scope.playTitle = function (index){
        cosmicPlayer.launchPlayer(index);
        //$ionicViewSwitcher.nextTransition('ios');
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('player');
    };

    var titlesView=angular.element(document.getElementById('titles-view'));
    $ionicGesture.on('swipeleft',function(e){
        console.log('Swipe left');
        $ionicViewSwitcher.nextDirection('forward');
        $state.go('player');
    }, titlesView);


    // Popover
    var selectedTitleId;
    var event;
    document.body.classList.remove('platform-ios');
    document.body.classList.remove('platform-android');
    document.body.classList.remove('platform-ionic');
    document.body.classList.add('platform-ios');
    $ionicPopover.fromTemplateUrl('templates/title-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
        $scope.showPopover = function(ev,titleId){
            ev.stopPropagation();
            console.log('show popover of '+titleId);
            //$scope.selectedId = titleId;
            event = ev;
            selectedTitleId = titleId;
            popover.show(event);
        };

        // add the title to an existing playlist
        $scope.addToPlaylist = function(){
            console.log('add to playlist');
            popover.hide();
            $ionicPopover.fromTemplateUrl('templates/select-playlist-popover.html', {
                scope: $scope,
            }).then(function(playlistPopover) {
                // Get playlists
                cosmicDB.getPlaylists().then(function(playlists){
                    $scope.playlists = playlists;
                    playlistPopover.show(event);
                    $scope.addTitleToPlaylist = function(playlistId){
                        console.log('Selected title id : '+selectedTitleId);
                        console.log('add to playlist '+playlistId);
                        cosmicDB.addTitleToPlaylist(playlistId,selectedTitleId).then(function(){
                            $cordovaToast.showShortTop('Done !');
                            playlistPopover.remove();
                        });
                    };
                });

            });

        };
    });

});


