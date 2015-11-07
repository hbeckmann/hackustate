angular
  .module('hackustate', [])

  .controller('hackController', function($http){

    var self = this;
    console.log(self);
    self.inGame = false;
    self.songList = [];
    var ajaxData = {};

    self.handler = function(name, gameCode){
      console.log('Contacting Back End!');
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
            ajaxData.objectId = res.data.objectId;
            self.gameHandler();

          }
      });
      return $http;

    };

    self.gameHandler = function(){

            function checkRound(){
              console.log('checking lobby status');
              $http.post('/round', {'userData': ajaxData})
                .then(function(res){
                  console.log(res.data);
                  ajaxData = res.data;
                  self.songList = ajaxData.songs;
                  if(ajaxData.currentRound == -1){location.reload()};

                });
            };

            self.gameCheck = function(){

              setInterval(function() {checkRound()}, 3000);
            };

            return self.gameCheck();

    };

    self.songSelect = function(selection) {

      ajaxData.songSelection = selection;
      $http.post('/selection', {'userData': ajaxData})
        .then(function(res){
          console.log(res.data);
        });

    };
  })
  /*
  .directive('hackDirectives', function(){
    return {
      template: '{{hack.song}}'

    }

  })
  */
