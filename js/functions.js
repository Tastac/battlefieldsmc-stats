function calculatePlayerMap(callback){
  console.log("loading player map")
  var playerMap = [];
  var numFinished = 4;
  var numLoaded = 0;

  var requestRP = new XMLHttpRequest();
  var requestRPK = new XMLHttpRequest();
  var requestRPW = new XMLHttpRequest();
  var requestRPM = new XMLHttpRequest();

  requestRP.open('GET', 'https://api.battlefieldsmc.net/api/?type=cubg_players', true); // BF PLAYER
  requestRPK.open('GET', 'https://api.battlefieldsmc.net/api/?type=cubg_most_kills', true); // KILLS
  requestRPW.open('GET', 'https://api.battlefieldsmc.net/api/?type=cubg_most_wins', true); // WINS
  requestRPM.open('GET', 'https://api.battlefieldsmc.net/api/?type=cubg_participants', true); // MATCHES

  requestRP.onreadystatechange = async function() {
    if(requestRP.readyState === XMLHttpRequest.DONE && requestRP.status === 200){
      var data = JSON.parse(requestRP.response);
      for(var i in data.detail){
        var info = {uuid: data.detail[i].uuid, username: data.detail[i].username, bfid: data.detail[i].id, lastseen: data.detail[i].last_seen, matches: [], kills: 0, wins: 0, score: 0}
        playerMap.push(info)
      }

      console.log("Player Map Load Prepaired")

      numLoaded++;
      if(numLoaded === numFinished){
        callback(PlayerMap);
        console.log("Map Load Finished")
      }

      requestRPK.send()
      requestRPW.send()
      requestRPM.send()

    }
  }

  requestRPK.onreadystatechange = function() {
    if(requestRPK.readyState === XMLHttpRequest.DONE && requestRPK.status === 200){
      var data2 = JSON.parse(requestRPK.response);
      for(var i in data2.detail){
        for(var w in playerMap){
          if(data2.detail[i].uuid === playerMap[w].uuid){
            playerMap[w].kills = parseInt(data2.detail[i].kills)
            playerMap[w].score += parseInt(data2.detail[i].kills)
          }
        }
      }

      console.log("Map Kills Loaded")

      numLoaded++;
      if(numLoaded === numFinished){
        callback(playerMap);
        console.log("Map Load Finished")
      }

    }
  }

  requestRPW.onreadystatechange = function() {
    if(requestRPW.readyState === XMLHttpRequest.DONE && requestRPW.status === 200){
      var data3 = JSON.parse(requestRPW.response);

      for(var i in data3.detail){
        for(var w in playerMap){
          if(data3.detail[i].uuid === playerMap[w].uuid){
            playerMap[w].wins = parseInt(data3.detail[i].wins)
            playerMap[w].score += parseInt(data3.detail[i].wins) * 5
          }
        }

      }

      console.log("Map Wins Loaded");

      numLoaded++;
      if(numLoaded === numFinished){
        callback(playerMap);
        console.log("Map Load Finished")
      }

    }
  }

  requestRPM.onreadystatechange = function() {
    if(requestRPM.readyState === XMLHttpRequest.DONE && requestRPM.status === 200){
      var data4 = JSON.parse(requestRPM.response);

      for(var i in playerMap){
        var curPlayerMatchList = [];
        for(var x in data4.detail){
          if(playerMap[i].bfid === data4.detail[x].player_id){
            console.log(data4.detail[x])
            curPlayerMatchList.push(data4.detail[x]);
          }
        }
        console.log("Done " + i)
        playerMap[i].matches = curPlayerMatchList;
      }

      console.log("Map Matches Loaded");

      numLoaded++;
      if(numLoaded === numFinished){
        callback(playerMap);
        console.log("Map Load Finished")
      }

    }
  }

  requestRP.send()
}

function getServerStatus(callback){
  var requestSS = new XMLHttpRequest();
  requestSS.open('GET', 'https://api.mcsrvstat.us/2/server.battlefieldsmc.net', true);
  requestSS.onreadystatechange = function() {
    if(requestSS.readyState === XMLHttpRequest.DONE && requestSS.status === 200){
      var data = JSON.parse(requestSS.response);
      callback(data.online, data.players.online, data.players.max);
    }
  }
  requestSS.send();
}
