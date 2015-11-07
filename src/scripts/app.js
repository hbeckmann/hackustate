angular
  .module('hackustate', [])

  .controller('hackController', function(hackFactory){

    var self = this;
    console.log(self);
    console.log(hackFactory);
    self.inGame = false;
    self.handler = hackFactory.handler;
    self.songList = hackFactory.songList;



  })

  .factory('hackFactory', function($http){
    var service = {};
    var ajaxData = {};
    service.handler = function(name, gameCode){
      console.log('factory working!');
      var gameData = {
        "name": name,
        "gameCode": gameCode
      };
      ajaxData = gameData;


      $http.post('/parseRequester', {'userData':gameData})
        .then(function(res){
          console.log(res.data);
          if(res.data.inGame === true){

            //If user is in a game
            self.inGame = res.data.inGame;
            console.log('In Lobby - Initializing Game Checks');
            ajaxData.currentRound = 0;
            service.gameHandler(completed);

          }
      });
      return $http;

    };

    service.gameHandler = function(completed){

            function checkRound(completed){
              console.log('checking lobby status');
              $http.post('/round', {'userData': ajaxData})
                .then(function(res){
                  console.log(res.data);
                  ajaxData = res.data;
                  service.songList = ajaxData.songs;
                  console.log(service.songList[0]);
                  completed(service.songList);
                });
            };

            service.gameCheck = function(completed){

              setInterval(function() {checkRound(completed)}, 3000);
            };

            return service.gameCheck();

    };



    return service;
  })
    .directive('songNames', function(){

      return {
        template: '{{self.name}}'
      };

    });
