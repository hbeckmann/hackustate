var express = require('express');
var Parse = require('parse/node');
var server = express();
var bodyParser = require('body-parser');


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({'extended': true}));


server.use(express.static('src'));
server.use(express.static('node_modules'));

server.listen(8000);
console.log('Server Started');

//PARSE CODE & Game Table Selection ADD THE PARSE KEY!!!!!!

var GameInfo = Parse.Object.extend("Game");
var query = new Parse.Query(GameInfo);


server.post('/parseRequester', function (req, res){
  var requestData = req.body.userData;
  console.log("resquest recieved! " + req.body.userData);
  requestData.inGame = false;


  //Checks for Game ID
  query.equalTo('shortId', requestData.gameCode);
  query.find({
      success: function(results) {
        if(results.length >= 1){
          console.log("game found at short Id: " + requestData.gameCode);

          //If Game exists then create new user
          var UserInfo = Parse.Object.extend("Users");
          var userInfo = new UserInfo();
          userInfo.set('name', requestData.name);
          userInfo.set('inGame', requestData.gameCode);
          userInfo.set('onRound', 0);
          userInfo.save(null, {
            success: function(userInfo){
              console.log('Successfully created and Save User');

              //Save User Object ID in the Game's Players
              results[0].addUnique("players", userInfo.id);
              results[0].save();
              requestData.inGame = true;
              console.log(userInfo.id);
              requestData.objectId = userInfo.id;
                //confirm with front end that user is in game lobby
                res.send(requestData);
            },
            error: function(userInfo, error){
              for (var key in error){console.log(key)};
              console.log('Parse User Creation Failed!' + error.message);
              res.send(requestData);
            }
          });
        }
      },
      error: function(error){
          alert("error - cannot find user" + error);
      }
  });
});

server.post('/round', function (req, res){
  //console.log(req.body.userData);
  requestData = req.body.userData;
  query.equalTo('shortId', requestData.gameCode);
  query.find({
      success: function(results) {
        requestData.currentRound = results[0].get('onRound');
        requestData.songs = results[0].get('songNames');
        res.send(requestData);
      },
      error: function(error) {

      }
  });
});

server.post('/selection', function (req, res){
  console.log(req.body.userData.songSelection);
  console.log(req.body.userData.objectId);
  console.log("going to query for user object");
  var userSongSelectionData = req.body.userData;
  var UserInfo = Parse.Object.extend("Users");
  var userInfo = new Parse.Query(UserInfo);
  console.log("hit - " + userSongSelectionData.objectId);
  userInfo.get(userSongSelectionData.objectId, {
      success: function(results) {
        console.log("Got results: " + results);
        results.set('guess', userSongSelectionData.songSelection);
        results.set('onRound', userSongSelectionData.currentRound);
        results.save();
        console.log("saved guess");
        res.send();
      },
      error: function(error) {
        console.log("Error at guess Save " + error.message);
      }

  });
});
