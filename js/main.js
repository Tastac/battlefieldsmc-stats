//loadPlayerStats(function(map){});

$(function(){

  var pathPrefix;
  for(var i in document.location.pathname.split("/")){
    pathPrefix += "../";
  }
  $("head").load(pathPrefix + "html/head.html");
  $("#navbarplaceholder").load(pathPrefix + "html/nav.html");
  $("#navbarplaceholderlb").load(pathPrefix + "html/navlb.html");
});

function loadPlayerStats(callback){
  calculatePlayerMap(function(map){
    localStorage.removeItem("playermap")
    localStorage.setItem("playermap", JSON.stringify(map))
    callback(map);
  });
}
