var Player = function(el) {
  var player_wrap = document.createElement("DIV");
  
};

var VideoPlayer = function(videos) {
  var defaultOptions = {
    theme: 'theme-player-dark'
  };
  var options = $.extend(defaultOptions, options);
  console.log('Start video player: ',options);

  if(typeof(videos) === 'undefined'){
    videos = document.getElementsByTagName("video");
  }
  if(Array.isArray(videos)){
    return videos.each(Player);
  }else{
    return Player(videos);
  }
}
