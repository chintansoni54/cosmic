angular.module('cosmic.services').factory("deviceFS", function($q,cosmicDB,ID3Tags,cosmicConfig,$cordovaToast) {

    var deviceFSService = {

        // Verify that the storage directories exists
        initDeviceFS : function(){
            var q = $q.defer();
            var path = cosmicConfig.appRootStorage;
            var dirName = 'artworks';
            var dirName2 = 'tmp';
            console.log('Initialisation : '+ path);

            window.resolveLocalFileSystemURL(path, function (fileSystem) {
                fileSystem.getDirectory(dirName, {create : true, exclusive : false}, function (result) {
                    console.log('Create folder : ' + dirName);
                    fileSystem.getDirectory(dirName2, {create : true, exclusive : false}, function (result) {
                        console.log('Create folder : ' + dirName2);
                        q.resolve();
                    }, function (error) {
                        q.reject('Directory Initialisation failed : '+error);
                    });
                }, function (error) {
                    q.reject('Directory Initialisation failed : '+error);
                });
            }, function (error) {
                q.reject('Directory Initialisation failed : '+error);
            });
            return q.promise;
        },

        handleItem : function(entry,results){
            var extensionsAudio=cosmicConfig.extensionsAudio;
            var self=this;
            var hDeferred=$q.defer();
            // Audio file
            if (entry.isFile) {
                var fileName = entry.name;
                var extension=fileName.substr(fileName.lastIndexOf('.')+1);
                console.log('exploring '+fileName+', ext : ' + extension);
                if (extensionsAudio.indexOf(extension.toLowerCase())!=-1){
                    cosmicDB.isInDatabase(entry.nativeURL).then(function(res){
                        if (res){
                            hDeferred.resolve();
                        } else {
                            results.push(entry.nativeURL);
                            hDeferred.resolve();
                        }
                    });
                } else {
                    hDeferred.resolve();
                }
            }
            //Directory
            if (entry.isDirectory){
                self.scanDirectory(entry.nativeURL,results).then(function(res){
                    hDeferred.resolve();
                });
            }
            return hDeferred.promise;
        },
        scanDirectory: function(path,results){
            var self=this;
            var d= $q.defer();
            var promises = [];

            window.resolveLocalFileSystemURL(path, function(fileSystem) {
                var directoryReader = fileSystem.createReader();

                directoryReader.readEntries(function(entries) {

                    for (var index=0;index<entries.length;index++){
                        promises.push(self.handleItem(entries[index],results));
                    }
                    var sz=promises.length;
                    $q.all(promises).then(function(res){
                        d.resolve();
                    });
                },function(err){
                    console.log('Read entries error');
                    console.dir(err);
                    d.resolve();
                });
            });
            return d.promise;
        },

        scanMusicFolder: function(){
            var d=$q.defer();
            var path=cordova.file.externalRootDirectory+'Music/Mymusic/';
            var results=[];
            console.log('ROOT: '+cordova.file.externalRootDirectory);
            $cordovaToast.showShortCenter('Start to scan the directory');
            this.scanDirectory(path,results).then(function(res){
                console.log('DONE SCAN');
                $cordovaToast.showShortCenter('Find '+results.length+' music files to add !');
                return ID3Tags.readTagsFromFileList(results);
            }).then(function(tagList){
                $cordovaToast.showShortCenter('ID3 Tags Loaded !');
                return cosmicDB.addTitleList(tagList);
            }).then(function(){
                $cordovaToast.showShortCenter('Database Ready !');
                console.log('DATABASE READY');
                d.resolve();
            });
            return d.promise;
        }

    };

    deviceFSService.initDeviceFS();
    return deviceFSService;

});

